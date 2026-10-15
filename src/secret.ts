// Hidden parts of a note: what players never see. Each line is hidden on its own, by its own mark
// (data-secret): a top-level block (paragraph, heading, quote, divider, table), or a list item. No
// mark reaches past its own line: a hidden heading doesn't hide its section, a hidden item doesn't
// hide its sub-items. Hidden parts are taken out of the note before its public copy is uploaded
// (stripSecret): hiding them only on the player's screen would leave them readable by anyone with
// the room's key.
//
// Notes from before (secretModel absent) followed other rules: a hidden heading hid its section, a
// hidden list or item everything in it. expandSecretMarks() turns those into marks of their own,
// once per note, so that nothing they hid comes into view.
import { exitLevel, headingLevel } from "./sections";

export const SECRET_ATTR = "data-secret";
/** The current rules (see above), recorded on each note once its marks follow them. */
export const SECRET_MODEL = 2;
// The top-level blocks that can carry a mark (lists carry theirs on their items).
export const SECRET_TAGS = /^(P|DIV|H[1-4]|BLOCKQUOTE|UL|OL|HR|TABLE)$/;

const LIST = /^(UL|OL)$/;
const marked = (el: Element) => el.hasAttribute(SECRET_ATTR);
const items = (el: Element) => (Array.prototype.slice.call(el.querySelectorAll("li")) as HTMLElement[]).filter((li) => !li.closest("td, th"));
// A block's own lines, outside its lists (a quote's text around a list it holds).
function hasOwnText(el: Element): boolean {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll("ul, ol").forEach((l) => l.remove());
  return !!(copy.textContent || "").replace(/[\s​]/g, "");
}

/** A top-level block's lines that hide on their own: its list items (a quote's own text too), or
 * the block itself. */
export function blockUnits(el: HTMLElement): HTMLElement[] {
  const lis = el.tagName === "TABLE" ? [] : items(el);
  if (!lis.length) return [el];
  return !LIST.test(el.tagName) && hasOwnText(el) ? [el, ...lis] : lis;
}
/** The lines that hide on their own, in document order (see blockUnits). */
export function secretUnits(root: Element): HTMLElement[] {
  return (Array.prototype.slice.call(root.children) as HTMLElement[]).flatMap(blockUnits);
}

/** For each top-level block: whether it's hidden whole (its own mark). */
export function secretCoverage(blocks: Element[]): boolean[] {
  return blocks.map(marked);
}

/** The note as players get it: every hidden line taken out. */
export function stripSecret(html: string): string {
  if (!html.includes(SECRET_ATTR)) return html;
  const box = parse(html);
  (Array.prototype.slice.call(box.children) as Element[]).forEach((el) => {
    if (marked(el)) el.remove();
  });
  box.querySelectorAll(`li[${SECRET_ATTR}]`).forEach((li) => li.remove());
  // Lists left with no item at all go too.
  let emptied = true;
  while (emptied) {
    emptied = false;
    box.querySelectorAll("ul, ol").forEach((list) => {
      if (!list.querySelector("li")) {
        list.remove();
        emptied = true;
      }
    });
  }
  // A stray mark on something that isn't a line hides nothing; none goes out either.
  box.querySelectorAll(`[${SECRET_ATTR}]`).forEach((el) => el.removeAttribute(SECRET_ATTR));
  return box.innerHTML;
}

/** How many separate hidden parts the note has: runs of hidden lines in a row. */
export function secretPartCount(html: string): number {
  if (!html.includes(SECRET_ATTR)) return 0;
  const units = secretUnits(parse(html));
  return units.filter((u, i) => marked(u) && !(i > 0 && marked(units[i - 1]))).length;
}

/** Turns marks made under the old rules into marks of their own (see the top). Returns whether it
 * changed anything. */
export function expandSecretMarksIn(box: Element): boolean {
  let changed = false;
  const mark = (el: Element) => {
    if (!marked(el)) {
      el.setAttribute(SECRET_ATTR, "");
      changed = true;
    }
  };
  // A block hidden whole, its lists' items each (a list's own mark goes: its items carry it now).
  const markBlock = (el: Element) => {
    const lis = el.tagName === "TABLE" ? [] : items(el);
    if (!lis.length) {
      mark(el);
      return;
    }
    lis.forEach(mark);
    if (LIST.test(el.tagName)) {
      if (marked(el)) {
        el.removeAttribute(SECRET_ATTR);
        changed = true;
      }
    } else if (hasOwnText(el)) mark(el);
  };
  // 1. A hidden heading hid its section.
  let until = 0;
  (Array.prototype.slice.call(box.children) as Element[]).forEach((el) => {
    const level = headingLevel(el);
    const exit = exitLevel(el);
    if (until && ((level && level <= until) || (exit && exit <= until))) until = 0;
    const own = marked(el);
    if (until || own) markBlock(el);
    if (!until && level && own) until = level;
  });
  // 2. A hidden item hid its sub-items.
  box.querySelectorAll(`li[${SECRET_ATTR}]`).forEach((li) => {
    for (let n = li.nextElementSibling; n && LIST.test(n.tagName); n = n.nextElementSibling) items(n).forEach(mark);
  });
  return changed;
}
export function expandSecretMarks(html: string): string {
  if (!html.includes(SECRET_ATTR)) return html;
  const box = parse(html);
  return expandSecretMarksIn(box) ? box.innerHTML : html;
}

function parse(html: string): HTMLElement {
  const box = document.createElement("div");
  box.innerHTML = html;
  return box;
}
