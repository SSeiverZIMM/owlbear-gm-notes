// Notes the players can edit (Note.editable) take one editor at a time: whoever starts typing takes
// the note's lock, kept in its shared copy (shared/{key}/notes/{id}, field `lock`), and everyone else
// gets it read-only until it's let go. The holder renews it while they keep editing; one that isn't
// renewed for LOCK_TTL is free again (the Security Rules hold players to that, by server time).
//
// Clocks differ between devices, so a lock's age here isn't read off its server time: it's counted
// from when this device first saw that version of it. That errs toward waiting a bit longer, never
// toward two people editing at once.

export const LOCK_TTL = 45000;
/** How often the holder renews a lock while still editing. */
export const LOCK_RENEW = 15000;
/** How long the holder keeps a lock with no edits before letting it go. */
export const LOCK_IDLE = 60000;

export interface LockInfo {
  uid: string;
  name: string;
  /** Server time it was taken or last renewed, as received (only compared for changes). */
  at: number;
}

const seen = new Map<string, { lock: LockInfo; seenAt: number }>();

/** Records a note's lock as its shared copy has it now (null: none). */
export function noteLockSeen(noteId: string, lock: LockInfo | null, now = Date.now()) {
  if (!lock) {
    seen.delete(noteId);
    return;
  }
  const prev = seen.get(noteId);
  if (prev && prev.lock.uid === lock.uid && prev.lock.at === lock.at) return;
  seen.set(noteId, { lock, seenAt: now });
}

/** Who else holds a note's lock right now, or null if it's free (or it's `myUid`'s). */
export function lockHolder(noteId: string, myUid: string | null, now = Date.now()): LockInfo | null {
  const s = seen.get(noteId);
  if (!s || (myUid && s.lock.uid === myUid) || now - s.seenAt > LOCK_TTL) return null;
  return s.lock;
}

/** How long until someone else's lock on a note lapses (0: it's free). */
export function lockLapsesIn(noteId: string, myUid: string | null, now = Date.now()): number {
  const s = seen.get(noteId);
  if (!lockHolder(noteId, myUid, now) || !s) return 0;
  return Math.max(0, LOCK_TTL - (now - s.seenAt));
}

export function forgetLocks() {
  seen.clear();
}
