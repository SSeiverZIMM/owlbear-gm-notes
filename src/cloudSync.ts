import { initializeApp, type FirebaseApp } from "firebase/app";
import { sanitizeNoteHtml } from "./sanitizeHtml";
import { stripSecret } from "./secret";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
  type Firestore,
} from "firebase/firestore";
import { firebaseConfig, hasFirebaseConfig } from "./firebaseConfig";
import type { Note } from "./notes";

// Cloud sync is a purely optional, additional copy of a room's notes — IndexedDB (see notes.ts)
// stays the source of truth for THIS device and works with no sign-in at all. When signed in, notes
// also get pushed to Firestore under the signed-in Google account, letting the SAME account pull
// them back down on another device. Firestore Security Rules (see the project's setup notes) scope
// every document to `request.auth.uid` — the Google account IS the privacy boundary here, not
// Owlbear's own GM/player roles, which Firestore has no way to know about.
//
// Conflict handling is deliberately simple: last-write-wins, per note, by `updatedAt`. Editing the
// SAME note on two devices while both are offline means whichever syncs last overwrites the other —
// there's no merge. For the realistic case (one GM, one device at a time, occasionally switching)
// this never comes up; it's a real, accepted limitation for the rare case where it would.

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function cloudSyncAvailable(): boolean {
  return hasFirebaseConfig();
}

function ensureInitialized(): { auth: Auth; db: Firestore } | null {
  if (!hasFirebaseConfig()) return null;
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { auth: auth!, db: db! };
}

export function getCurrentUser(): User | null {
  const init = ensureInitialized();
  return init ? init.auth.currentUser : null;
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  const init = ensureInitialized();
  if (!init) return () => {};
  return onAuthStateChanged(init.auth, callback);
}

export async function signInWithGoogle(): Promise<void> {
  const init = ensureInitialized();
  if (!init) return;
  await signInWithPopup(init.auth, new GoogleAuthProvider());
}

export async function signOutCloud(): Promise<void> {
  const init = ensureInitialized();
  if (!init) return;
  await signOut(init.auth);
}

export type SyncStatus = "off" | "idle" | "pending" | "syncing" | "synced" | "error";

let status: SyncStatus = "off";
const statusListeners = new Set<(status: SyncStatus) => void>();
function setStatus(next: SyncStatus) {
  status = next;
  statusListeners.forEach((cb) => cb(status));
}
export function getSyncStatus(): SyncStatus {
  return status;
}
export function onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
}

/** For other sync modules (see templateSync.ts): the Firestore handle and signed-in user, or null
 * when cloud sync is unavailable or nobody is signed in. */
export function cloudContext(): { db: Firestore; user: User } | null {
  const init = ensureInitialized();
  const user = init ? init.auth.currentUser : null;
  return init && user ? { db: init.db, user } : null;
}

/** Lets other sync modules surface a failure on the same cloud indicator notes use. */
export function reportCloudSyncError() {
  setStatus("error");
}

function roomNoteDoc(uid: string, roomId: string, noteId: string) {
  return doc(db!, "users", uid, "rooms", roomId, "notes", noteId);
}
function roomNotesCollection(uid: string, roomId: string) {
  return collection(db!, "users", uid, "rooms", roomId, "notes");
}

// Per-note dirty tracking: markDirty() records WHICH note changed and (re)starts a single shared
// debounce; the debounce reads each dirty note's CURRENT content only when it actually fires (via
// getNoteById, supplied by main.ts), not at schedule time — so several edits to the same note during
// one debounce window still cost exactly one Firestore write, always with the latest content.
let dirtyIds = new Set<string>();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let getNoteById: ((id: string) => Note | undefined) | null = null;
let currentRoomId: string | null = null;
const SYNC_DEBOUNCE_MS = 15000;

export function initCloudSyncContext(roomId: string, lookup: (id: string) => Note | undefined) {
  currentRoomId = roomId;
  getNoteById = lookup;
}

// ---------- public notes: shared/{key}/notes/{noteId}, readable by anyone with the room's key ----------
// A public note gets a second copy there (see publicKey.ts for the key), tagged with its author's
// uid: the Security Rules let only that account change or delete it, so several GMs in one room each
// manage their own. Edits reach it on the same debounce as the private copy; publishing and
// unpublishing go straight away.
let sharedKey: string | null = null;
export function setSharedKey(key: string | null) {
  sharedKey = key;
}

function sharedNoteDoc(key: string, noteId: string) {
  return doc(db!, "shared", key, "notes", noteId);
}
// The public copy: the note minus its hidden parts, which never leave the GM's own copies.
function sharedNoteData(note: Note, uid: string) {
  return { title: note.title, html: stripSecret(note.html), updatedAt: note.updatedAt, owner: uid };
}
// The version of each public copy last written from here ("key/noteId" → updatedAt): the flush that
// follows a publish finds it already up and skips it.
const sharedVersions = new Map<string, number>();
async function writeSharedNote(key: string, note: Note, uid: string) {
  await setDoc(sharedNoteDoc(key, note.id), sharedNoteData(note, uid));
  sharedVersions.set(key + "/" + note.id, note.updatedAt);
}

/** Puts (or refreshes) a note's public copy. Rejects when it can't: nobody signed in, no key. */
export async function publishNote(note: Note): Promise<void> {
  const init = ensureInitialized();
  const user = init ? init.auth.currentUser : null;
  if (!init || !user || !sharedKey) throw new Error("Notes: can't publish without an account and a key");
  await writeSharedNote(sharedKey, note, user.uid);
}

/** Takes a note's public copy down. Only for a note that has one: deleting a missing document is
 * refused by the rules (there's no owner to check). */
export async function unpublishNote(noteId: string): Promise<void> {
  const init = ensureInitialized();
  const user = init ? init.auth.currentUser : null;
  if (!init || !user || !sharedKey) return;
  sharedVersions.delete(sharedKey + "/" + noteId);
  try {
    await deleteDoc(sharedNoteDoc(sharedKey, noteId));
  } catch (err) {
    console.error("Notes: failed to unpublish note", noteId, err);
    setStatus("error");
  }
}

/** A player's live view of the room's public notes: every note under `key`, whole, on each change.
 * No account needed. */
export function watchSharedNotes(key: string, onChange: (notes: Note[]) => void, onError: (err: unknown) => void): () => void {
  const init = ensureInitialized();
  if (!init) {
    onError(new Error("Notes: Firebase isn't configured"));
    return () => {};
  }
  return onSnapshot(
    collection(init.db, "shared", key, "notes"),
    (snapshot) => {
      onChange(
        snapshot.docs.map((d) => {
          const data = d.data() as { title?: unknown; html?: unknown; updatedAt?: unknown };
          return {
            id: d.id,
            title: typeof data.title === "string" ? data.title : "",
            html: typeof data.html === "string" ? sanitizeNoteHtml(data.html) : "",
            updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0,
            public: true,
          };
        })
      );
    },
    onError
  );
}

/** Makes this account's public copies under `key` exactly `wanted()`: removes the ones no longer
 * public (unpublished or deleted while signed out, or every one under a key that's been replaced),
 * and writes the ones missing or older than here. `wanted` is read once the copies are fetched, so a
 * note published meanwhile counts. */
export async function reconcileSharedNotes(key: string, wanted: () => Note[]): Promise<void> {
  const init = ensureInitialized();
  const user = init ? init.auth.currentUser : null;
  if (!init || !user) return;
  try {
    const snapshot = await getDocs(query(collection(init.db, "shared", key, "notes"), where("owner", "==", user.uid)));
    const remote = new Map<string, number>();
    snapshot.forEach((d) => {
      const updatedAt = d.data().updatedAt;
      remote.set(d.id, typeof updatedAt === "number" ? updatedAt : 0);
    });
    const notes = wanted();
    const wantedIds = new Set(notes.map((n) => n.id));
    await Promise.all([
      ...Array.from(remote.keys())
        .filter((id) => !wantedIds.has(id))
        .map((id) => {
          sharedVersions.delete(key + "/" + id);
          return deleteDoc(sharedNoteDoc(key, id));
        }),
      ...notes
        .filter((n) => (remote.get(n.id) ?? -1) < n.updatedAt)
        .map((n) => writeSharedNote(key, n, user.uid)),
    ]);
  } catch (err) {
    console.error("Notes: failed to bring public notes up to date", err);
    setStatus("error");
  }
}

export function markNoteDirty(noteId: string) {
  if (!cloudSyncAvailable() || !getCurrentUser()) return;
  dirtyIds.add(noteId);
  setStatus("pending");
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => void flushCloudSync(), SYNC_DEBOUNCE_MS);
}

export async function flushCloudSync(): Promise<void> {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  const init = ensureInitialized();
  const user = init ? init.auth.currentUser : null;
  if (!init || !user || !currentRoomId || !getNoteById || !dirtyIds.size) return;
  const ids = Array.from(dirtyIds);
  dirtyIds = new Set();
  setStatus("syncing");
  try {
    await Promise.all(
      ids.map((id) => {
        const note = getNoteById!(id);
        // Deleted locally between markNoteDirty() and this flush — deleteNoteFromCloud() already
        // handles removing it from Firestore directly, so there's nothing to push for this id.
        if (!note) return Promise.resolve();
        return Promise.all([
          setDoc(roomNoteDoc(user.uid, currentRoomId!, id), {
            title: note.title,
            html: note.html,
            updatedAt: note.updatedAt,
            public: !!note.public,
          }),
          note.public && sharedKey && sharedVersions.get(sharedKey + "/" + id) !== note.updatedAt
            ? writeSharedNote(sharedKey, note, user.uid)
            : null,
        ]);
      })
    );
    setStatus("synced");
  } catch (err) {
    console.error("Notes: cloud sync failed", err);
    ids.forEach((id) => dirtyIds.add(id));
    setStatus("error");
  }
}

export async function deleteNoteFromCloud(noteId: string): Promise<void> {
  const init = ensureInitialized();
  const user = init ? init.auth.currentUser : null;
  if (!init || !user || !currentRoomId) return;
  dirtyIds.delete(noteId);
  try {
    await deleteDoc(roomNoteDoc(user.uid, currentRoomId, noteId));
  } catch (err) {
    console.error("Notes: failed to delete cloud copy of note", noteId, err);
  }
}

// Live-subscribes to every note Firestore has for this room, under the signed-in account. Fires once
// immediately with whatever's already there (covers "just signed in" / "just opened on this device"),
// then again on every remote change — the closest thing to real-time sync this app does, and it comes
// for free from Firestore's own listener rather than any polling of ours.
// `onFirstSync` runs once, after the first batch has gone through `onChange` (empty or not): from then
// on this device has everything the account has.
export function watchCloudNotes(
  roomId: string,
  onChange: (notes: Note[], removedIds: string[]) => void,
  onFirstSync?: () => void
): () => void {
  const init = ensureInitialized();
  const user = init ? init.auth.currentUser : null;
  if (!init || !user) return () => {};
  let first = true;
  return onSnapshot(
    roomNotesCollection(user.uid, roomId),
    (snapshot) => {
      const notes: Note[] = [];
      const removedIds: string[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removedIds.push(change.doc.id);
        } else {
          const data = change.doc.data() as { title?: unknown; html?: unknown; updatedAt?: unknown; public?: unknown };
          notes.push({
            id: change.doc.id,
            title: typeof data.title === "string" ? data.title : "",
            html: typeof data.html === "string" ? sanitizeNoteHtml(data.html) : "",
            updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
            ...(data.public === true ? { public: true } : {}),
          });
        }
      });
      if (notes.length || removedIds.length) onChange(notes, removedIds);
      if (first) {
        first = false;
        onFirstSync?.();
      }
    },
    (err) => {
      console.error("Notes: cloud listener error", err);
      setStatus("error");
    }
  );
}
