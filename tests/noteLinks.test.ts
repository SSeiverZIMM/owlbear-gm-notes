import { describe, expect, it } from "vitest";
import { linkHtml, linkedIds, publicLinks, syncLinks } from "../src/noteLinks";
import { sanitizeNoteHtml } from "../src/sanitizeHtml";
import { htmlToMarkdown } from "../src/markdown";
import { normalizeHtml } from "../src/structure";

const L = (id: string, t: string) => linkHtml(id, t);

describe("links between notes", () => {
  it("show their note's current title and mark the gone ones", () => {
    const box = document.createElement("div");
    box.innerHTML = `<p>${L("a", "Old")} ${L("b", "Bee")} ${L("c", "Sea")}</p>`;
    const changed = syncLinks(box, (id) => (id === "a" ? { title: "New", gone: false } : id === "b" ? { title: "Bee", gone: true } : null), "Untitled");
    expect(changed).toBe(true);
    const links = box.querySelectorAll(".note-link");
    expect(links[0].textContent).toBe("New");
    expect(links[0].hasAttribute("data-missing")).toBe(false);
    expect(links[1].hasAttribute("data-missing")).toBe(true);
    expect(links[2].hasAttribute("data-missing")).toBe(true);
  });

  it("go to players only when they point at a public note; otherwise just their text", () => {
    const html = `<p>See ${L("pub", "x")} and ${L("priv", "Secret plans")}.</p>`;
    const out = publicLinks(html, (id) => (id === "pub" ? { title: "Tavern", public: true } : id === "priv" ? { title: "Secret plans", public: false } : null));
    expect(out).toBe(`<p>See ${L("pub", "Tavern")} and Secret plans.</p>`);
  });

  it("list the notes a note links to", () => {
    expect(linkedIds(`<p>${L("a", "A")}${L("b", "B")}${L("a", "A")}</p>`)).toEqual(["a", "b"]);
    expect(linkedIds("<p>none</p>")).toEqual([]);
  });

  it("survive the sanitizer, rebuilt from id and text only", () => {
    expect(sanitizeNoteHtml('<p><span class="note-link" data-note="abc-1" style="color:red" onclick="x()"><b>T</b></span></p>')).toBe(`<p>${L("abc-1", "T")}</p>`);
  });

  it("with a bad id, lose the link but keep the text", () => {
    expect(sanitizeNoteHtml('<p><span class="note-link" data-note="a b<">T</span></p>')).toBe("<p><span>T</span></p>");
  });

  it("are left alone by the structure repair", () => {
    const html = `<p>a ${L("x", "X")} b</p>`;
    expect(normalizeHtml(html)).toBe(html);
  });

  it("export to Markdown wiki-style", () => {
    expect(htmlToMarkdown(`<p>Go to ${L("x", "The Tavern")}</p>`)).toBe("Go to [[The Tavern]]");
  });
});
