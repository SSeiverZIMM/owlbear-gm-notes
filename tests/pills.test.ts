import { describe, expect, it } from "vitest";
import { markPills, restorePills } from "../src/structure";

// Stands in for Chrome's list command dropping a pill: the span goes, its content stays.
function dropPills(root: Element) {
  root.querySelectorAll(".note-pill").forEach((p) => p.replaceWith(...Array.from(p.childNodes)));
}
function run(html: string, change: (surface: HTMLElement) => void): string {
  const surface = document.createElement("div");
  surface.innerHTML = html;
  const marks = markPills(surface, Array.from(surface.children));
  change(surface);
  restorePills(surface, marks);
  return surface.innerHTML;
}

const P = '<span class="note-pill" style="--pill-c: #3f8ce0;">whole</span>';

describe("pills kept through native list commands", () => {
  it("puts a dropped pill back where it was", () => {
    expect(
      run(`<ul><li>${P}</li></ul>`, (s) => {
        s.innerHTML = "<ol><li>whole</li></ol>";
      })
    ).toBe(`<ol><li>${P}</li></ol>`);
  });

  it("keeps the pill's own formatting and the text around it", () => {
    const pill = '<span class="note-pill" style="--pill-c: #e05a86;"><b>bold</b> pill</span>';
    expect(run(`<p>a ${pill} z</p>`, dropPills)).toBe(`<p>a ${pill} z</p>`);
  });

  it("matches lines in order when several have the same text", () => {
    expect(
      run(`<p>whole</p><p>${P}</p>`, (s) => {
        dropPills(s);
        s.innerHTML = s.innerHTML.replace(/<p>/g, "<li>").replace(/<\/p>/g, "</li>");
        s.innerHTML = `<ul>${s.innerHTML}</ul>`;
      })
    ).toBe(`<ul><li>whole</li><li>${P}</li></ul>`);
  });

  it("restores two pills in the same line", () => {
    const a = '<span class="note-pill">x</span>';
    const b = '<span class="note-pill" style="--pill-c: #4caf72;">y</span>';
    expect(run(`<p>${a} and ${b}</p>`, dropPills)).toBe(`<p>${a} and ${b}</p>`);
  });

  it("leaves things alone when the text changed", () => {
    expect(
      run(`<ul><li>${P}</li></ul>`, (s) => {
        s.innerHTML = "<ol><li>whale</li></ol>";
      })
    ).toBe("<ol><li>whale</li></ol>");
  });

  it("does nothing when the pill survived", () => {
    expect(run(`<ul><li>${P}</li></ul>`, () => {})).toBe(`<ul><li>${P}</li></ul>`);
  });

  it("ignores zero-width caret anchors", () => {
    expect(run(`<p>a​${P}</p>`, dropPills)).toBe(`<p>a​${P}</p>`);
  });

  it("reads a quote's own line apart from the list inside it", () => {
    expect(
      run(`<blockquote><ul><li>${P}</li></ul></blockquote>`, (s) => {
        s.innerHTML = "<blockquote>whole</blockquote>";
      })
    ).toBe(`<blockquote>${P}</blockquote>`);
  });

  it("restores each piece of a pill split at its line break", () => {
    const pill = '<span class="note-pill" style="--pill-c: #7c5cff;">n<br>w</span>';
    expect(
      run(`<h3>${pill}</h3>`, (s) => {
        s.innerHTML = '<ul><li>n</li></ul><h3><span class="note-pill" style="--pill-c: #7c5cff;">w</span></h3>';
      })
    ).toBe('<ul><li><span class="note-pill" style="--pill-c: #7c5cff;">n</span></li></ul><h3><span class="note-pill" style="--pill-c: #7c5cff;">w</span></h3>');
  });
});
