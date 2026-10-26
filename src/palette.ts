// The color palette shared by every color picker (pills, text, quotes, table cells). Pickers show it
// in two rows of 7: the hues, then pink, brown and the neutrals, with the "none" button last.
import { escapeHtml } from "./markdown";

export const PILL_COLORS = [
  { id: "violet", hex: "#7c5cff" },
  { id: "blue", hex: "#3f8ce0" },
  { id: "turquoise", hex: "#22b8b0" },
  { id: "green", hex: "#4caf72" },
  { id: "yellow", hex: "#d6b214" },
  { id: "orange", hex: "#f2780c" },
  { id: "red", hex: "#e04f4f" },
  { id: "pink", hex: "#e05a86" },
  { id: "brown", hex: "#9c6b3e" },
  { id: "white", hex: "#ffffff" },
  { id: "light gray", hex: "#b8b8c0" },
  { id: "gray", hex: "#8b8994" },
  { id: "black", hex: "#2a2a30" },
];

// One button per palette color (data-color="#hex"), plus a "none" one (data-color="") when
// `noneTitle` is given.
export function swatchesHtml(title: string, noneTitle?: string): string {
  let html = PILL_COLORS.map(
    (c) => `<button type="button" class="pill-swatch" data-color="${c.hex}" style="--sw:${c.hex}" title="${escapeHtml(c.id)}" aria-label="${escapeHtml(title + " " + c.id)}"></button>`
  ).join("");
  if (noneTitle) {
    html += `<button type="button" class="pill-swatch pill-swatch-none" data-color="" title="${escapeHtml(noneTitle)}" aria-label="${escapeHtml(noneTitle)}"><svg viewBox="0 0 16 16" fill="none"><path d="M4.5 11.5 11.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>`;
  }
  return html;
}
