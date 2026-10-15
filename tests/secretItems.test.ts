import { describe, expect, it } from "vitest";
import { secretPartCount, stripSecret } from "../src/secret";
import { htmlToMarkdown, markdownToHtml } from "../src/markdown";
import { sanitizeNoteHtml } from "../src/sanitizeHtml";

describe("hidden list items", () => {
  it("go away alone, the rest of the list stays", () => {
    expect(stripSecret('<ul><li>a</li><li data-secret="">b</li><li>c</li></ul>')).toBe("<ul><li>a</li><li>c</li></ul>");
  });

  it("don't take their sub-items with them", () => {
    expect(stripSecret('<ul><li>a</li><li data-secret="">b</li><ul><li>b1</li></ul><li>c</li></ul>')).toBe("<ul><li>a</li><ul><li>b1</li></ul><li>c</li></ul>");
  });

  it("leave no empty list behind", () => {
    expect(stripSecret('<p>x</p><ul><li data-secret="">only</li></ul>')).toBe("<p>x</p>");
    expect(stripSecret('<ul><li>a</li><ul><li data-secret="">sub</li></ul></ul>')).toBe("<ul><li>a</li></ul>");
  });

  it("work in numbered lists and checklists", () => {
    expect(stripSecret('<ol><li>one</li><li data-secret="">two</li><li>three</li></ol>')).toBe("<ol><li>one</li><li>three</li></ol>");
    expect(stripSecret('<ul data-check=""><li data-checked="" data-secret="">x</li><li>y</li></ul>')).toBe('<ul data-check=""><li>y</li></ul>');
  });

  it("count as parts: one per run of hidden lines", () => {
    expect(secretPartCount('<ul><li data-secret="">a</li><li data-secret="">b</li><li>c</li><li data-secret="">d</li></ul>')).toBe(2);
    expect(secretPartCount('<ul><li data-secret="">a</li><ul><li data-secret="">a1</li></ul><li data-secret="">b</li></ul>')).toBe(1);
  });

  it("pass the sanitizer", () => {
    expect(sanitizeNoteHtml('<ul><li data-secret="">a</li></ul>')).toBe('<ul><li data-secret="">a</li></ul>');
  });

  it("carry the marker in Markdown, both ways", () => {
    const html = '<ul><li>a</li><li data-secret="">b</li></ul><ol><li data-secret="">one</li></ol>';
    const md = htmlToMarkdown(html);
    expect(md).toBe("- a\n- b <!-- hidden -->\n\n1. one <!-- hidden -->");
    expect(markdownToHtml(md)).toBe(html);
    expect(markdownToHtml("- [ ] task <!-- oculto -->")).toBe('<ul data-check=""><li data-secret="">task</li></ul>');
  });
});
