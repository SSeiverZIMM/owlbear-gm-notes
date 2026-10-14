// The extension's background page: always loaded, for everyone in the room, so it's kept tiny (the
// Owlbear SDK and nothing else). It holds the GM's context-menu entry for linking map items to notes
// (see itemLinks.ts): "Link note" on items without one, "Open note" on items with one. It follows
// the player's role, language and Settings switch, re-registering only when one of those changes.
import OBR from "@owlbear-rodeo/sdk";
import type { Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./pluginId";
import { ITEM_LINK_CHANNEL, ITEM_LINK_KEY, ITEM_LINKS_PREF_KEY, isFreshRequest, itemLabel, writeItemLinkRequest } from "./itemLinks";
import type { ItemLinkMessage, ItemLinkRequest } from "./itemLinks";

const MENU_ID = getPluginId("item-link-menu");
const LANGUAGE_KEY = getPluginId("language");
const LABELS = {
  en: { link: "Link note", open: "Open note", unnamed: "item" },
  es: { link: "Vincular nota", open: "Abrir nota", unnamed: "objeto" },
};

OBR.onReady(() => {
  let current = "";
  // The menu's last request, until the panel takes it (see itemLinks.ts).
  let pending: ItemLinkRequest | null = null;
  const send = (message: ItemLinkMessage) => void OBR.broadcast.sendMessage(ITEM_LINK_CHANNEL, message, { destination: "LOCAL" });
  OBR.broadcast.onMessage(ITEM_LINK_CHANNEL, (event) => {
    const message = event.data as ItemLinkMessage;
    if (message.type === "hello" && isFreshRequest(pending)) send({ type: "request", request: pending });
    else if (message.type === "taken" && pending && message.at === pending.at) pending = null;
  });
  function request(r: Omit<ItemLinkRequest, "at">) {
    pending = { ...r, at: Date.now() };
    writeItemLinkRequest(pending);
    send({ type: "request", request: pending });
    void OBR.action.open();
  }
  async function sync() {
    const [role, metadata] = await Promise.all([OBR.player.getRole(), OBR.player.getMetadata()]);
    const enabled = role === "GM" && metadata[ITEM_LINKS_PREF_KEY] !== false;
    const language = metadata[LANGUAGE_KEY] === "es" ? "es" : "en";
    const state = enabled ? language : "off";
    if (state === current) return;
    current = state;
    if (!enabled) {
      await OBR.contextMenu.remove(MENU_ID);
      return;
    }
    const t = LABELS[language];
    await OBR.contextMenu.create({
      id: MENU_ID,
      icons: [
        { icon: "/item-link.svg", label: t.link, filter: { roles: ["GM"], every: [{ key: ["metadata", ITEM_LINK_KEY], value: undefined }] } },
        { icon: "/item-link.svg", label: t.open, filter: { roles: ["GM"], some: [{ key: ["metadata", ITEM_LINK_KEY], value: undefined, operator: "!=" }] } },
      ],
      onClick(context) {
        const items = context.items as Item[];
        const linked = items.find((i) => typeof i.metadata[ITEM_LINK_KEY] === "string");
        if (linked) {
          request({ action: "open", itemIds: [linked.id], names: [itemLabel(linked as never, t.unnamed)], noteId: linked.metadata[ITEM_LINK_KEY] as string });
        } else {
          request({ action: "link", itemIds: items.map((i) => i.id), names: items.map((i) => itemLabel(i as never, t.unnamed)) });
        }
      },
    });
  }
  void sync();
  // Player changes include every selection change: sync() only acts when role, language or the
  // switch actually changed.
  OBR.player.onChange(() => void sync());
});
