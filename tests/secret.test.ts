import { describe, expect, it } from "vitest";
import { compactSecret, secretCoverage, secretPartCount, stripSecret } from "../src/secret";
import { htmlToMarkdown, markdownToHtml } from "../src/markdown";
import { sanitizeNoteHtml } from "../src/sanitizeHtml";
import { normalizeHtml, splitBlock } from "../src/structure";

function coverage(html: string): boolean[] {
  const box = document.createElement("div");
  box.innerHTML = html;
  return secretCoverage(Array.from(box.children));
}

describe("hidden parts: what players don't see", () => {
  it("hides a marked block on its own, even inside a section", () => {
    expect(coverage('<h2>A</h2><p>a</p><p data-secret="">s</p><p>b</p>')).toEqual([false, false, true, false]);
  });

  it("hides a hidden heading's whole section, up to the next heading of its level or higher", () => {
    expect(coverage('<h2 data-secret="">A</h2><p>a</p><h3>B</h3><p>b</p><h2>C</h2><p>c</p>')).toEqual([true, true, true, true, false, false]);
    expect(coverage('<h3 data-secret="">A</h3><p>a</p><h1>B</h1>')).toEqual([true, true, false]);
  });

  it("doesn't hide a line that left the hidden section, nor what follows it", () => {
    expect(coverage('<h4 data-secret="">t</h4><p>a</p><p data-exit="4">out</p><p>after</p>')).toEqual([true, true, false, false]);
    // Leaving only a deeper section doesn't leave the hidden one.
    expect(coverage('<h2 data-secret="">A</h2><h4>t</h4><p>a</p><p data-exit="4">x</p><p>y</p>')).toEqual([true, true, true, true, true]);
  });

  it("strips hidden parts from the public copy, leaving the rest as it was", () => {
    const html = '<p>pub</p><p data-secret="">s</p><h2 data-secret="">A</h2><p>a</p><h2>B</h2><p>b</p>';
    expect(stripSecret(html)).toBe("<p>pub</p><h2>B</h2><p>b</p>");
    expect(stripSecret("<p>nothing hidden</p>")).toBe("<p>nothing hidden</p>");
    // Everything hidden: nothing left (players see the title only).
    expect(stripSecret('<h1 data-secret="">A</h1><p>a</p>')).toBe("");
  });

  it("never lets a stray mark out, nor what's under a nested one", () => {
    expect(stripSecret('<blockquote><p data-secret="">x</p></blockquote>')).toBe("<blockquote><p>x</p></blockquote>");
  });

  it("counts separate hidden parts", () => {
    expect(secretPartCount("<p>a</p>")).toBe(0);
    expect(secretPartCount('<p data-secret="">a</p><p data-secret="">b</p><p>c</p><h3 data-secret="">d</h3><p>e</p>')).toBe(2);
  });

  it("keeps only the heading's mark when its whole section is marked", () => {
    const box = document.createElement("div");
    box.innerHTML = '<h2 data-secret="">A</h2><p data-secret="">a</p><ul data-secret=""><li>x</li></ul><h2>B</h2>';
    compactSecret(box);
    expect(box.innerHTML).toBe('<h2 data-secret="">A</h2><p>a</p><ul><li>x</li></ul><h2>B</h2>');
    box.innerHTML = '<h2 data-secret="">A</h2><p data-secret="">a</p><p>b</p>';
    compactSecret(box);
    expect(box.innerHTML).toBe('<h2 data-secret="">A</h2><p data-secret="">a</p><p>b</p>');
  });
});

describe("hidden parts survive the editor's own conversions", () => {
  it("passes the sanitizer on blocks only", () => {
    expect(sanitizeNoteHtml('<p data-secret="">a</p><table data-secret=""><tbody><tr><td>x</td></tr></tbody></table>')).toBe(
      '<p data-secret="">a</p><table data-secret=""><tbody><tr><td>x</td></tr></tbody></table>'
    );
    expect(sanitizeNoteHtml('<p>a<span data-secret="">b</span></p>')).toBe("<p>a<span>b</span></p>");
  });

  it("stays on every piece of a hidden line split around a block it held", () => {
    // Built by hand: the HTML parser itself would close the <p> before the list.
    const p = document.createElement("p");
    p.setAttribute("data-secret", "");
    p.innerHTML = "a";
    const list = document.createElement("ul");
    list.innerHTML = "<li>x</li>";
    p.append(list, "b");
    expect(splitBlock(p).map((el) => el.outerHTML).join("")).toBe(
      '<p data-secret="">a</p><ul data-secret=""><li>x</li></ul><p data-secret="">b</p>'
    );
  });

  it("turns an old <div> line into a hidden paragraph", () => {
    expect(normalizeHtml('<div data-secret="">a</div>')).toBe('<p data-secret="">a</p>');
  });
});

describe("hidden parts in Markdown", () => {
  it("exports each run of hidden blocks between markers", () => {
    const md = htmlToMarkdown('<p>pub</p><p data-secret="">s1</p><p data-secret="">s2</p><h2 data-secret="">A</h2><p>a</p><h2>B</h2>');
    expect(md).toBe(["pub", "<!-- hidden -->", "s1", "s2", "## A", "a", "<!-- /hidden -->", "## B"].join("\n\n"));
  });

  it("imports what's between markers as hidden, in English or Spanish", () => {
    expect(markdownToHtml("pub\n\n<!-- hidden -->\nsecret\n- x\n<!-- /hidden -->\nafter")).toBe(
      '<p>pub</p><p data-secret="">secret</p><ul data-secret=""><li>x</li></ul><p>after</p>'
    );
    expect(markdownToHtml("<!--oculto-->\na\n<!-- /OCULTO -->\nb")).toBe('<p data-secret="">a</p><p>b</p>');
  });

  it("hides to the end when the closing marker is missing", () => {
    expect(markdownToHtml("a\n<!-- hidden -->\nb\n\nc")).toBe('<p>a</p><p data-secret="">b</p><p data-secret="">c</p>');
  });

  it("marks only the heading of a section wrapped whole", () => {
    expect(markdownToHtml("<!-- hidden -->\n## A\na\n<!-- /hidden -->\n## B")).toBe('<h2 data-secret="">A</h2><p>a</p><h2>B</h2>');
  });

  it("round-trips", () => {
    const html = '<p>pub</p><h3 data-secret="">A</h3><p>a</p><h2>B</h2><p data-secret="">s</p>';
    expect(markdownToHtml(htmlToMarkdown(html))).toBe(html);
  });
});
