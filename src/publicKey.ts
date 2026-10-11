import OBR, { type Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./pluginId";

// The room's public notes live in Firestore under shared/{key}/notes (see cloudSync.ts), readable by
// anyone who knows the key and listable by no one who doesn't. The key itself is kept in room
// metadata, which only people in the room can read: being in the room is what lets a player see its
// public notes. It's ~40 bytes of the room's shared 16kB budget, the only thing this extension
// writes there.
const METADATA_KEY = getPluginId("public");
const KEY_LENGTH = 32;
const KEY_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function publicKeyFromMetadata(metadata: Metadata): string | null {
  const value = metadata[METADATA_KEY];
  if (typeof value !== "object" || value === null) return null;
  const key = (value as { key?: unknown }).key;
  return typeof key === "string" && key.length >= 24 ? key : null;
}

function generateKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(KEY_LENGTH));
  // 256 isn't a multiple of 62, so a few characters come up slightly more often: a negligible bias
  // for 32 characters (~190 bits).
  return Array.from(bytes, (b) => KEY_CHARS[b % KEY_CHARS.length]).join("");
}

/** The room's key, created now if it doesn't have one yet. */
export async function ensurePublicKey(): Promise<string> {
  const existing = publicKeyFromMetadata(await OBR.room.getMetadata());
  if (existing) return existing;
  return replacePublicKey();
}

/** A new key for the room: whoever had the old one (a former player, say) no longer sees anything
 * published from here on. */
export async function replacePublicKey(): Promise<string> {
  const key = generateKey();
  await OBR.room.setMetadata({ [METADATA_KEY]: { key } });
  return key;
}

export async function getPublicKey(): Promise<string | null> {
  return publicKeyFromMetadata(await OBR.room.getMetadata());
}

export function watchPublicKey(callback: (key: string | null) => void): () => void {
  return OBR.room.onMetadataChange((metadata) => callback(publicKeyFromMetadata(metadata)));
}
