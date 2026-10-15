import OBR from "@owlbear-rodeo/sdk";
import type { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./pluginId";
import type { Language } from "./i18n";
import { ITEM_LINKS_PREF_KEY } from "./itemLinks";

const LANGUAGE_KEY = getPluginId("language");
const ACCENT_KEY = getPluginId("accent");
const SECRET_EYE_LOCK_KEY = getPluginId("secretEyeLocked");

const ACCENT_IDS = ["violet", "aqua", "amber", "rose", "green", "blue"] as const;
export type AccentId = (typeof ACCENT_IDS)[number];
export type AccentPref = "auto" | AccentId;

/**
 * Language and accent-override are personal viewing preferences, not shared room data, so they live
 * in the *player's own* metadata (like Daggerheight's language setting) rather than room metadata -
 * each person keeps their own choice, following them across sessions in this room.
 */
function resolveLanguage(metadata: Metadata): Language {
  return metadata[LANGUAGE_KEY] === "es" ? "es" : "en";
}

export async function getLanguage(): Promise<Language> {
  const metadata = await OBR.player.getMetadata();
  return resolveLanguage(metadata);
}

export async function setLanguage(language: Language): Promise<void> {
  await OBR.player.setMetadata({ [LANGUAGE_KEY]: language });
}

function resolveAccentPref(metadata: Metadata): AccentPref {
  const value = metadata[ACCENT_KEY];
  return typeof value === "string" && (value === "auto" || (ACCENT_IDS as readonly string[]).includes(value))
    ? (value as AccentPref)
    : "auto";
}

export async function getAccentPref(): Promise<AccentPref> {
  const metadata = await OBR.player.getMetadata();
  return resolveAccentPref(metadata);
}

export async function setAccentPref(accent: AccentPref): Promise<void> {
  await OBR.player.setMetadata({ [ACCENT_KEY]: accent });
}

/** Whether clicking the eye next to a hidden part does nothing (instead of showing it to players). */
export async function getSecretEyeLocked(): Promise<boolean> {
  const metadata = await OBR.player.getMetadata();
  return metadata[SECRET_EYE_LOCK_KEY] === true;
}

/** How the notes list is sorted (pinned notes first either way). */
export type NoteSort = "recent" | "alpha";
const NOTE_SORT_KEY = getPluginId("noteSort");
export async function getNoteSort(): Promise<NoteSort> {
  const metadata = await OBR.player.getMetadata();
  return metadata[NOTE_SORT_KEY] === "alpha" ? "alpha" : "recent";
}
export async function setNoteSort(sort: NoteSort): Promise<void> {
  await OBR.player.setMetadata({ [NOTE_SORT_KEY]: sort });
}

/** Whether the "Link note" / "Open note" entry is in the map's context menu (on unless turned off). */
export async function getItemLinksEnabled(): Promise<boolean> {
  const metadata = await OBR.player.getMetadata();
  return metadata[ITEM_LINKS_PREF_KEY] !== false;
}

export async function setItemLinksEnabled(enabled: boolean): Promise<void> {
  await OBR.player.setMetadata({ [ITEM_LINKS_PREF_KEY]: enabled });
}

export async function setSecretEyeLocked(locked: boolean): Promise<void> {
  await OBR.player.setMetadata({ [SECRET_EYE_LOCK_KEY]: locked });
}
