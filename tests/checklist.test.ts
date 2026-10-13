import { describe, expect, it } from "vitest";
import { htmlToMarkdown, markdownToHtml } from "../src/markdown";
import { sanitizeNoteHtml } from "../src/sanitizeHtml";

describe("checklists", () => {
  it("export as Markdown task items", () => {
    expect(htmlToMarkdown('<ul data-check=""><li>todo</li><li data-checked="">done</li></ul>')).toBe("- [ ] todo\n- [x] done");
  });

  it("export sub-items with their own boxes", () => {
    expect(htmlToMarkdown('<ul data-check=""><li>a</li><ul data-check=""><li data-checked="">a1</li></ul></ul>')).toBe("- [ ] a\n  - [x] a1");
  });

  it("import Markdown task items as a checklist", () => {
    expect(markdownToHtml("- [ ] todo\n- [x] done\n- [] empty box")).toBe(
      '<ul data-check=""><li>todo</li><li data-checked="">done</li><li>empty box</li></ul>'
    );
  });

  it("keep a task list apart from a bullet list next to it", () => {
    expect(markdownToHtml("- [ ] task\n- bullet")).toBe('<ul data-check=""><li>task</li></ul><ul><li>bullet</li></ul>');
  });

  it("round-trip", () => {
    const html = '<ul data-check=""><li>one</li><li data-checked="">two</li></ul>';
    expect(markdownToHtml(htmlToMarkdown(html))).toBe(html);
  });

  it("pass the sanitizer only where they belong", () => {
    expect(sanitizeNoteHtml('<ul data-check=""><li data-checked="">x</li></ul>')).toBe('<ul data-check=""><li data-checked="">x</li></ul>');
    expect(sanitizeNoteHtml('<ol data-check=""><li>x</li></ol><p data-checked="">y</p>')).toBe("<ol><li>x</li></ol><p>y</p>");
  });
});
