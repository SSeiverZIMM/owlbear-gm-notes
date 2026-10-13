import type { ToolbarStrings } from "./i18n";
import { escapeHtml } from "./markdown";
import { swatchesHtml } from "./palette";
import { buildTablePicker } from "./tableEditor";

// The editor's toolbar: its buttons, in order, and the markup for them and their dropdowns. What
// each button does lives with the editor (main.ts), which handles the toolbar's clicks.
interface ToolbarButtonSpec {
  cmd?: string;
  label?: string;
  titleKey?: keyof ToolbarStrings;
  style?: string;
  value?: string;
  picker?: "pill" | "textColor" | "quoteColor" | "block" | "table" | "list";
  sep?: boolean;
  svg?: string;
}

const TOOLBAR_BUTTONS: ToolbarButtonSpec[] = [
  { cmd: "bold", label: "B", titleKey: "bold", style: "font-weight:700;" },
  { cmd: "italic", label: "I", titleKey: "italic", style: "font-style:italic;" },
  { cmd: "underline", label: "U", titleKey: "underline", style: "text-decoration:underline;" },
  { cmd: "strikeThrough", label: "S", titleKey: "strike", style: "text-decoration:line-through;" },
  { picker: "pill" },
  { picker: "textColor" },
  { sep: true },
  { picker: "block" },
  { picker: "quoteColor" },
  { cmd: "divider", titleKey: "divider", svg: '<svg viewBox="0 0 16 16" fill="none"><path d="M2 8h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' },
  { picker: "table" },
  { sep: true },
  { picker: "list" },
  { cmd: "outdent", titleKey: "outdent", svg: '<svg viewBox="0 0 16 16" fill="none"><path d="M5.5 4.5 2.5 8l3 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 3.5h5.5M8 8h5.5M8 12.5h5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
  { cmd: "indent", titleKey: "indent", svg: '<svg viewBox="0 0 16 16" fill="none"><path d="M2.5 4.5 5.5 8l-3 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 3.5h5.5M8 8h5.5M8 12.5h5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
  { sep: true },
  { cmd: "removeFormat", titleKey: "removeFormat", svg: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 3h7M6.5 3v7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M2.5 13.5 13.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
  { cmd: "toggleSecret", titleKey: "secret", svg: '<svg viewBox="0 0 16 16" fill="none"><path d="M1.8 8s2.3-4.2 6.2-4.2S14.2 8 14.2 8s-2.3 4.2-6.2 4.2S1.8 8 1.8 8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="8" cy="8" r="1.9" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 13.5 13.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
];

function buildColorPicker(pickerId: string, btnId: string, swatchesId: string, title: string, iconSvg: string, noneTitle?: string): string {
  const swatches = swatchesHtml(title, noneTitle);
  return (
    `<div class="pill-picker" id="${pickerId}">` +
    `<button type="button" class="pill-picker-btn" id="${btnId}" title="${title}" aria-haspopup="true" aria-expanded="false">${iconSvg}</button>` +
    `<div class="pill-swatches color-swatches" id="${swatchesId}" hidden>${swatches}</div>` +
    `</div>`
  );
}

export type BlockTag = "P" | "H1" | "H2" | "H3" | "H4" | "BLOCKQUOTE";
// Block types offered by the block menu, in menu order. H4 is the "toggle" level: styled exactly
// like a plain paragraph, so it reads as normal text that can collapse what follows it.
export const BLOCK_TYPES: { tag: BlockTag; key: "paragraph" | "h1" | "h2" | "h3" | "toggle"; short: string }[] = [
  { tag: "P", key: "paragraph", short: "Aa" },
  { tag: "H1", key: "h1", short: "H1" },
  { tag: "H2", key: "h2", short: "H2" },
  { tag: "H3", key: "h3", short: "H3" },
  { tag: "H4", key: "toggle", short: "\u25b8" },
];

// Same dropdown shell as the color pickers (.pill-picker/.pill-swatches, so it shares their opening,
// clamping and click-outside closing); its items are ordinary formatBlock toolbar buttons, handled by
// the toolbar's own click listener.
function buildBlockPicker(idPrefix: string, tb: ToolbarStrings): string {
  const items = BLOCK_TYPES.map(
    (t) => `<button type="button" class="block-item block-item-${t.tag.toLowerCase()}" data-cmd="formatBlock" data-value="${t.tag}">${escapeHtml(tb[t.key])}</button>`
  ).join("");
  return (
    `<div class="pill-picker block-picker" id="${idPrefix}BlockPicker">` +
    `<button type="button" class="pill-picker-btn block-picker-btn" id="${idPrefix}BlockPickerBtn" title="${tb.blockType}" aria-haspopup="true" aria-expanded="false">` +
    `<span class="block-picker-label" id="${idPrefix}BlockPickerLabel">Aa</span>` +
    `<svg viewBox="0 0 16 16" fill="none"><path d="M4.5 6.5 8 10l3.5-3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>` +
    `</button>` +
    `<div class="pill-swatches block-menu" id="${idPrefix}BlockMenu" hidden>${items}</div>` +
    `</div>`
  );
}

// The list menu: one button for every kind of list, its icon one line of each. Its items are
// ordinary list toolbar buttons (handled by the toolbar's click listener, like the block menu's).
const LIST_TYPES: { cmd: string; key: "bulletList" | "numberList" | "checkList"; svg: string }[] = [
  { cmd: "insertUnorderedList", key: "bulletList", svg: '<svg viewBox="0 0 16 16" fill="none"><circle cx="2.3" cy="4" r="1.1" fill="currentColor"/><circle cx="2.3" cy="8" r="1.1" fill="currentColor"/><circle cx="2.3" cy="12" r="1.1" fill="currentColor"/><path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
  { cmd: "checkList", key: "checkList", svg: '<svg viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="4" height="4" rx=".8" stroke="currentColor" stroke-width="1.1"/><rect x="1" y="9.6" width="4" height="4" rx=".8" stroke="currentColor" stroke-width="1.1"/><path d="M1.9 11.6l.9.9 1.5-1.8" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 4h6.5M7.5 11.6h6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
  { cmd: "insertOrderedList", key: "numberList", svg: '<svg viewBox="0 0 16 16" fill="none"><text x="0" y="5.2" font-size="4.2" fill="currentColor">1</text><text x="0" y="9.2" font-size="4.2" fill="currentColor">2</text><text x="0" y="13.2" font-size="4.2" fill="currentColor">3</text><path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
];
const LIST_MENU_ICON =
  '<svg viewBox="0 0 16 16" fill="none"><circle cx="2.5" cy="2.9" r="1.55" fill="currentColor"/><text x="0.6" y="10.3" font-size="6.2" font-weight="700" fill="currentColor">1</text><rect x="0.85" y="11.75" width="3.5" height="3.5" rx=".7" stroke="currentColor" stroke-width="1.2"/><path d="M6.8 2.9h7.7M6.8 8.3h7.7M6.8 13.5h7.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
function buildListPicker(idPrefix: string, tb: ToolbarStrings): string {
  const items = LIST_TYPES.map(
    (t) => `<button type="button" class="list-item" data-cmd="${t.cmd}" data-value="">${t.svg}<span>${escapeHtml(tb[t.key])}</span></button>`
  ).join("");
  return (
    `<div class="pill-picker list-picker" id="${idPrefix}ListPicker">` +
    `<button type="button" class="pill-picker-btn" id="${idPrefix}ListPickerBtn" title="${tb.listMenu}" aria-haspopup="true" aria-expanded="false">${LIST_MENU_ICON}</button>` +
    `<div class="pill-swatches block-menu list-menu" id="${idPrefix}ListMenu" hidden>${items}</div>` +
    `</div>`
  );
}

// Toolbar commands that act on whole blocks, which table cells don't hold (cells take inline
// formatting only: bold, color, pills, line breaks...).
export const BLOCK_ONLY_CMDS = new Set(["formatBlock", "insertUnorderedList", "insertOrderedList", "checkList", "indent", "outdent"]);

function renderToolbarButton(b: ToolbarButtonSpec, idPrefix: string, tb: ToolbarStrings): string {
  if (b.sep) return '<span class="tb-sep"></span>';
  if (b.picker === "block") return buildBlockPicker(idPrefix, tb);
  if (b.picker === "list") return buildListPicker(idPrefix, tb);
  if (b.picker === "table") return buildTablePicker(idPrefix, tb);
  if (b.picker === "pill") {
    return buildColorPicker(
      idPrefix + "PillPicker", idPrefix + "PillPickerBtn", idPrefix + "PillSwatches", tb.pill,
      '<svg viewBox="0 0 16 16" fill="none"><rect x="1.5" y="5.4" width="13" height="5.2" rx="2.6" stroke="currentColor" stroke-width="1.4"/></svg>',
      tb.pillNone
    );
  }
  if (b.picker === "textColor") {
    return buildColorPicker(
      idPrefix + "TextColorPicker", idPrefix + "TextColorPickerBtn", idPrefix + "TextColorSwatches", tb.textColor,
      '<svg viewBox="0 0 16 16" fill="none"><text x="8" y="11.2" font-size="13" font-weight="700" text-anchor="middle" fill="currentColor">A</text><rect x="1.5" y="13" width="13" height="2.2" rx="1.1" fill="currentColor"/></svg>',
      tb.textColorNone
    );
  }
  if (b.picker === "quoteColor") {
    return buildColorPicker(
      idPrefix + "QuoteColorPicker", idPrefix + "QuoteColorPickerBtn", idPrefix + "QuoteColorSwatches", tb.quoteColor,
      '<svg viewBox="0 0 16 16" fill="none"><rect x="3" y="2.5" width="2.3" height="11" rx="1.15" fill="currentColor"/><path d="M8.3 5h4M8.3 8h4M8.3 11h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
      tb.quoteColorNone
    );
  }
  const inner = b.svg || b.label || "";
  const title = b.titleKey ? tb[b.titleKey] : "";
  return `<button type="button" data-cmd="${b.cmd}" data-value="${b.value || ""}" title="${title}" style="${b.style || ""}">${inner}</button>`;
}

export function renderToolbar(idPrefix: string, tb: ToolbarStrings): string {
  return `<div class="toolbar" id="${idPrefix}Toolbar">${TOOLBAR_BUTTONS.map((b) => renderToolbarButton(b, idPrefix, tb)).join("")}</div>`;
}
