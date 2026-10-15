import { describe, expect, it } from "vitest";
import { expandSecretMarks, secretPartCount, secretUnits, stripSecret } from "../src/secret";
import { htmlToMarkdown, markdownToHtml } from "../src/markdown";
import { sanitizeNoteHtml } from "../src/sanitizeHtml";
import { normalizeHtml, splitBlock } from "../src/structure";

const units = (html: string) => {
  const box = document.createElement("div");
  box.innerHTML = html;
  return secretUnits(box).map((u) => u.tagName + ":" + (u.firstChild?.textContent ?? ""));
};

describe("hidden parts: each line on its own", () => {
  it("lists the lines that hide on their own", () => {
    expect(units("<p>a</p><ul><li>b</li><ul><li>c</li></ul></ul><h2>d</h2>")).toEqual(["P:a", "LI:b", "LI:c", "H2:d"]);
  });

  it("a hidden heading hides itself only, not its section", () => {
    expect(stripSecret('<h2 data-secret="">A</h2><p>a</p>')).toBe("<p>a</p>");
  });

  it("strips each hidden line from the public copy", () => {
    expect(stripSecret('<p>pub</p><p data-secret="">s</p><p>more</p>')).toBe("<p>pub</p><p>more</p>");
    expect(stripSecret("<p>nothing hidden</p>")).toBe("<p>nothing hidden</p>");
    expect(stripSecret('<h1 data-secret="">A</h1><p data-secret="">a</p>')).toBe("");
  });

  it("counts runs of hidden lines", () => {
    expect(secretPartCount("<p>a</p>")).toBe(0);
    expect(secretPartCount('<p data-secret="">a</p><p data-secret="">b</p><p>c</p><h3 data-secret="">d</h3>')).toBe(2);
  });
});

describe("notes from before: converted once, players seeing the same", () => {
  it("a hidden heading's section gets marks of its own", () => {
    expect(expandSecretMarks('<h2 data-secret="">A</h2><p>a</p><ul><li>x</li></ul><h2>B</h2><p>b</p>')).toBe(
      '<h2 data-secret="">A</h2><p data-secret="">a</p><ul><li data-secret="">x</li></ul><h2>B</h2><p>b</p>'
    );
  });

  it("a line that had left the section stays shown", () => {
    expect(expandSecretMarks('<h4 data-secret="">t</h4><p>a</p><p data-exit="4">out</p>')).toBe('<h4 data-secret="">t</h4><p data-secret="">a</p><p data-exit="4">out</p>');
  });

  it("a hidden list's mark moves to its items; a hidden item's to its sub-items", () => {
    expect(expandSecretMarks('<ul data-secret=""><li>a</li><li>b</li></ul>')).toBe('<ul><li data-secret="">a</li><li data-secret="">b</li></ul>');
    expect(expandSecretMarks('<ul><li data-secret="">a</li><ul><li>a1</li></ul><li>b</li></ul>')).toBe('<ul><li data-secret="">a</li><ul><li data-secret="">a1</li></ul><li>b</li></ul>');
  });

  it("what players get doesn't change", () => {
    const old = '<p>pub</p><h3 data-secret="">A</h3><p>a</p><ul><li>x</li></ul><h2>B</h2><p>b</p>';
    expect(stripSecret(expandSecretMarks(old))).toBe("<p>pub</p><h2>B</h2><p>b</p>");
  });
});

describe("hidden parts survive the editor's own conversions", () => {
  it("passes the sanitizer on blocks and items only", () => {
    expect(sanitizeNoteHtml('<p data-secret="">a</p><table data-secret=""><tbody><tr><td>x</td></tr></tbody></table>')).toBe(
      '<p data-secret="">a</p><table data-secret=""><tbody><tr><td>x</td></tr></tbody></table>'
    );
    expect(sanitizeNoteHtml('<p>a<span data-secret="">b</span></p>')).toBe("<p>a<span>b</span></p>");
  });

  it("stays on every piece of a hidden line split around a block it held", () => {
    const p = document.createElement("p");
    p.setAttribute("data-secret", "");
    p.innerHTML = "a";
    const list = document.createElement("ul");
    list.innerHTML = "<li>x</li>";
    p.append(list, "b");
    expect(splitBlock(p).map((el) => el.outerHTML).join("")).toBe('<p data-secret="">a</p><ul data-secret=""><li>x</li></ul><p data-secret="">b</p>');
  });

  it("turns an old <div> line into a hidden paragraph", () => {
    expect(normalizeHtml('<div data-secret="">a</div>')).toBe('<p data-secret="">a</p>');
  });
});

describe("hidden parts in Markdown", () => {
  it("exports each run of hidden blocks between markers", () => {
    const md = htmlToMarkdown('<p>pub</p><p data-secret="">s1</p><h2 data-secret="">A</h2><p>a</p>');
    expect(md).toBe(["pub", "<!-- hidden -->", "s1", "## A", "<!-- /hidden -->", "a"].join("\n\n"));
  });

  it("imports what's between markers as hidden lines, in English or Spanish", () => {
    expect(markdownToHtml("pub\n\n<!-- hidden -->\nsecret\n- x\n<!-- /hidden -->\nafter")).toBe(
      '<p>pub</p><p data-secret="">secret</p><ul><li data-secret="">x</li></ul><p>after</p>'
    );
    expect(markdownToHtml("<!--oculto-->\na\n<!-- /OCULTO -->\nb")).toBe('<p data-secret="">a</p><p>b</p>');
  });

  it("hides to the end when the closing marker is missing", () => {
    expect(markdownToHtml("a\n<!-- hidden -->\nb\n\nc")).toBe('<p>a</p><p data-secret="">b</p><p data-secret="">c</p>');
  });

  it("round-trips", () => {
    const html = '<p>pub</p><h3 data-secret="">A</h3><p>a</p><ul><li data-secret="">x</li><li>y</li></ul>';
    expect(markdownToHtml(htmlToMarkdown(html))).toBe(html);
  });
});
