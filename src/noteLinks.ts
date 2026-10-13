// Links between notes: an inline <span class="note-link" data-note="id">, atomic (contenteditable
// false: typed over, split or half-deleted it can't be, only deleted whole). Its text is the linked
// note's title, brought up to date whenever it's shown (syncLinks). In a note shared with players,
// a link to a note they can't see is only its title, as plain text (publicLinks): the copy that
// goes up never points at a private note.
import { escapeHtml } from "./markdown";

export const LINK_CLASS = "note-link";
export const LINK_ATTR = "data-note";
// The ids the editor makes (crypto.randomUUID, or an older "n…" fallback).
export const NOTE_ID = /^[\w-]{1,80}$/;

export function linkElement(id: string, title: string): HTMLElement {
  const el = document.createElement("span");
  el.className = LINK_CLASS;
  el.setAttribute(LINK_ATTR, id);
  el.setAttribute("contenteditable", "false");
  el.textContent = title;
  return el;
}

export function linkHtml(id: string, title: string): string {
  return `<span class="${LINK_CLASS}" ${LINK_ATTR}="${escapeHtml(id)}" contenteditable="false">${escapeHtml(title)}</span>`;
}

export interface LinkTarget {
  title: string;
  /** In the trash, or not there at all. */
  gone: boolean;
}

/** Brings every link's text up to its note's current title, and marks the ones whose note is gone
 * (data-missing, view-side only). Returns whether anything changed. */
export function syncLinks(root: Element, target: (id: string) => LinkTarget | null, untitled: string): boolean {
  let changed = false;
  root.querySelectorAll(`.${LINK_CLASS}`).forEach((el) => {
    const t = target(el.getAttribute(LINK_ATTR) || "");
    if (t && !t.gone) {
      const title = t.title || untitled;
      if (el.textContent !== title) {
        el.textContent = title;
        changed = true;
      }
    }
    const missing = !t || t.gone;
    if (el.hasAttribute("data-missing") !== missing) {
      el.toggleAttribute("data-missing", missing);
      changed = true;
    }
  });
  return changed;
}

/** The note as players get it, as far as links go: a link to a public note stays a link (with that
 * note's current title); any other is just its text. */
export function publicLinks(html: string, target: (id: string) => { title: string; public: boolean } | null): string {
  if (!html.includes(LINK_CLASS)) return html;
  const box = document.createElement("div");
  box.innerHTML = html;
  box.querySelectorAll(`.${LINK_CLASS}`).forEach((el) => {
    const t = target(el.getAttribute(LINK_ATTR) || "");
    if (t && t.public) {
      if (t.title) el.textContent = t.title;
      el.removeAttribute("data-missing");
    } else {
      el.replaceWith(document.createTextNode(el.textContent || ""));
    }
  });
  return box.innerHTML;
}

/** The ids of the notes a note links to. */
export function linkedIds(html: string): string[] {
  if (!html.includes(LINK_CLASS)) return [];
  const box = document.createElement("div");
  box.innerHTML = html;
  return Array.from(new Set(Array.from(box.querySelectorAll(`.${LINK_CLASS}`)).map((el) => el.getAttribute(LINK_ATTR) || "")));
}
