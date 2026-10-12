// Hidden parts of a note: blocks marked data-secret, which the GM sees (striped) and players never
// do. A hidden heading or toggle hides its whole section, by the same rules as folding (up to the
// next heading of its level or higher, or a line that leaves it). Hidden parts are taken out of the
// note before its public copy is uploaded (stripSecret): hiding them only on the player's screen
// would leave them readable by anyone with the room's key.
import { exitLevel, headingLevel } from "./sections";

export const SECRET_ATTR = "data-secret";
// The top-level blocks that can be hidden.
export const SECRET_TAGS = /^(P|DIV|H[1-4]|BLOCKQUOTE|UL|OL|HR|TABLE)$/;

/** For each of a note's top-level blocks, in order, whether players don't see it: hidden itself,
 * or inside a hidden section. */
export function secretCoverage(blocks: Element[]): boolean[] {
  let until = 0;
  return blocks.map((el) => {
    const level = headingLevel(el);
    const exit = exitLevel(el);
    if (until && ((level && level <= until) || (exit && exit <= until))) until = 0;
    const own = el.hasAttribute(SECRET_ATTR);
    const covered = !!until || own;
    if (!until && level && own) until = level;
    return covered;
  });
}

function parse(html: string): HTMLElement {
  const box = document.createElement("div");
  box.innerHTML = html;
  return box;
}

/** The note as players get it: every hidden part taken out. */
export function stripSecret(html: string): string {
  if (!html.includes(SECRET_ATTR)) return html;
  const box = parse(html);
  const blocks = Array.prototype.slice.call(box.children) as Element[];
  const covered = secretCoverage(blocks);
  blocks.forEach((el, i) => {
    if (covered[i]) el.remove();
  });
  // A stray mark on something that isn't a top-level block hides nothing; none goes out either.
  box.querySelectorAll(`[${SECRET_ATTR}]`).forEach((el) => el.removeAttribute(SECRET_ATTR));
  return box.innerHTML;
}

/** How many separate hidden parts the note has (runs of hidden blocks in a row). */
export function secretPartCount(html: string): number {
  if (!html.includes(SECRET_ATTR)) return 0;
  const covered = secretCoverage(Array.prototype.slice.call(parse(html).children) as Element[]);
  return covered.filter((c, i) => c && !covered[i - 1]).length;
}

/** A hidden heading whose whole section is also marked block by block (as Markdown import marks
 * it) keeps the only mark it needs, its own: lines added to that section later are then hidden too. */
export function compactSecret(box: Element) {
  const blocks = Array.prototype.slice.call(box.children) as Element[];
  blocks.forEach((el, i) => {
    const level = headingLevel(el);
    if (!level || !el.hasAttribute(SECRET_ATTR)) return;
    const section: Element[] = [];
    for (let j = i + 1; j < blocks.length; j++) {
      const l = headingLevel(blocks[j]);
      const exit = exitLevel(blocks[j]);
      if ((l && l <= level) || (exit && exit <= level)) break;
      section.push(blocks[j]);
    }
    if (section.every((b) => b.hasAttribute(SECRET_ATTR))) section.forEach((b) => b.removeAttribute(SECRET_ATTR));
  });
}
