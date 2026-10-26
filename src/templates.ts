import localforage from "localforage";
import { getPluginId } from "./pluginId";
import { sanitizeNote } from "./notes";
import type { Note } from "./notes";
import type { Language } from "./i18n";

export type BuiltinTemplateId =
  | "npc"
  | "location"
  | "sessionPrep"
  | "sessionRecap"
  | "monster5e"
  | "dhAdversary"
  | "dhEnvironment"
  | "demo";
const BUILTIN_IDS: BuiltinTemplateId[] = ["npc", "location", "sessionPrep", "sessionRecap", "monster5e", "dhAdversary", "dhEnvironment", "demo"];
// Built-ins added in a later version reach existing installs through "restore default templates"
// (see missingBuiltins), for the same reason.
// "demo" (the formatting tour) only reaches new installs, seeded with the rest: adding it to existing
// template lists would let a device that seeds it later re-push one the GM already deleted on
// another device, since cloud sync keeps no record of deleted built-ins.

// A template is a saved note body to start new notes from — the same shape as a Note, plus an
// optional `builtin` id. A built-in template stores no text of its own: its title and body come from
// DEFAULTS in whatever language the GM has chosen right now (see resolveTemplate), so switching
// language translates it. A note created from it copies the text once, in that moment's language, and
// never changes afterwards. Renaming a built-in turns it into an ordinary template (see
// toCustomTemplate); deleting it removes it in every language, since it's one stored entry.
export type Template = Note & { builtin?: BuiltinTemplateId };

// Templates are global to this browser, not per room like notes: a "NPC" or "Session recap" layout
// is useful in every campaign, so the GM shouldn't have to recreate it in each room. Same IndexedDB
// database as notes, under a key that isn't scoped by room id.
const store = localforage.createInstance({ name: getPluginId("notes-db") });
const TEMPLATES_KEY = "templates";

function isBuiltinId(value: unknown): value is BuiltinTemplateId {
  return typeof value === "string" && (BUILTIN_IDS as string[]).includes(value);
}

export function sanitizeTemplate(value: unknown): Template | undefined {
  const note = sanitizeNote(value);
  if (!note) return undefined;
  const builtin = (value as { builtin?: unknown }).builtin;
  return isBuiltinId(builtin) ? { ...note, builtin } : note;
}

function sanitizeTemplates(value: unknown): Template[] {
  if (!Array.isArray(value)) return [];
  return value.map(sanitizeTemplate).filter((t): t is Template => t !== undefined);
}

/** Built-ins seeded by the first version of this feature were stored as plain text in the language
 * of that moment. Any that still match a built-in's text exactly (in either language) are turned
 * back into language-following built-ins; one the GM has already renamed no longer matches and is
 * left as their own. Returns whether anything changed. */
function migrateSeededTextToBuiltins(templates: Template[]): boolean {
  let changed = false;
  for (const template of templates) {
    if (template.builtin) continue;
    const match = BUILTIN_IDS.find((id) =>
      (Object.keys(DEFAULTS[id]) as Language[]).some(
        (lang) => DEFAULTS[id][lang].title === template.title && DEFAULTS[id][lang].html === template.html
      )
    );
    if (match) {
      template.builtin = match;
      template.title = "";
      template.html = "";
      changed = true;
    }
  }
  return changed;
}

/** The title and body to show / copy right now: a built-in's text in the current language, or the
 * template's own stored text. */
export function resolveTemplate(template: Template, language: Language): { title: string; html: string } {
  return template.builtin ? DEFAULTS[template.builtin][language] : { title: template.title, html: template.html };
}

/** A built-in being renamed becomes the GM's own: it keeps the body it currently shows (in the
 * current language) and stops following language changes. */
export function toCustomTemplate(template: Template, language: Language): void {
  if (!template.builtin) return;
  const { html } = resolveTemplate(template, language);
  template.html = html;
  delete template.builtin;
}

/** Returns the stored templates. The very first time (nothing stored yet), seeds the
 * built-ins — after that an empty list stays empty (deleting every template doesn't bring the
 * built-ins back). */
export async function getTemplates(): Promise<Template[]> {
  const stored = await store.getItem<unknown>(TEMPLATES_KEY);
  if (stored !== null && stored !== undefined) {
    const templates = sanitizeTemplates(stored);
    if (migrateSeededTextToBuiltins(templates)) {
      await store.setItem(TEMPLATES_KEY, templates);
    }
    return templates;
  }
  const seeded = defaultTemplates();
  await store.setItem(TEMPLATES_KEY, seeded);
  return seeded;
}

/** Built-ins not currently in the list (deleted at some point, or added in a later version). */
export function missingBuiltins(templates: Template[]): BuiltinTemplateId[] {
  const present = new Set(templates.map((t) => t.builtin).filter(Boolean));
  return BUILTIN_IDS.filter((id) => !present.has(id));
}

/** A fresh copy of a built-in, for "restore default templates". */
export function newBuiltinTemplate(builtin: BuiltinTemplateId): Template {
  const now = Date.now();
  return { id: `t${now}-${builtin}`, title: "", html: "", updatedAt: now, builtin };
}

export async function setTemplates(templates: Template[]): Promise<void> {
  await store.setItem(TEMPLATES_KEY, templates);
}

// ---------- built-in templates ----------
// Plain blocks the editor already produces (h2, p, ul/li, strong), so a note started from one
// behaves exactly like one typed by hand.

function section(title: string, body: string): string {
  return `<h2>${title}</h2>${body}`;
}
function fields(labels: string[]): string {
  return `<ul>${labels.map((label) => `<li><strong>${label}:</strong> </li>`).join("")}</ul>`;
}
const EMPTY_LIST = "<ul><li><br></li></ul>";
const EMPTY_PARAGRAPH = "<p><br></p>";

// Stat blocks are tables, empty: the structure of a game's stat block, none of its content. They all
// get set widths adding up to the same total (just under the panel's default width), so a stat
// block's tables line up; sized by content, an empty value column would get almost no room.
const EMPTY_CELL = "<td><br></td>";
const STAT_BLOCK_WIDTH = 380;
function colgroup(widths: number[]): string {
  return `<colgroup>${widths.map((w) => `<col style="--col-w: ${w}px;">`).join("")}</colgroup>`;
}
// Labels down a header column, a value cell next to each.
function labelTable(labels: string[]): string {
  const rows = labels.map((label) => `<tr><th scope="row">${label}</th>${EMPTY_CELL}</tr>`).join("");
  return `<table data-header-col="">${colgroup([160, STAT_BLOCK_WIDTH - 160])}<tbody>${rows}</tbody></table>`;
}
// Labels across a header row, one empty row under them; even columns.
function headerTable(labels: string[]): string {
  const n = labels.length;
  const widths = labels.map((_l, i) => Math.floor(STAT_BLOCK_WIDTH / n) + (i < STAT_BLOCK_WIDTH % n ? 1 : 0));
  const head = labels.map((label) => `<th scope="col">${label}</th>`).join("");
  return `<table>${colgroup(widths)}<tbody><tr>${head}</tr><tr>${labels.map(() => EMPTY_CELL).join("")}</tr></tbody></table>`;
}

type TemplateSpec = { title: string; html: string };

// The "tour" template: a note that shows off every kind of formatting by describing itself.
function pill(text: string, color: string): string {
  return `<span class="note-pill" style="--pill-c: ${color};">${text}</span>`;
}
function colored(text: string, color: string): string {
  return `<span style="color: ${color};">${text}</span>`;
}
// The tour's table explains itself, row by row: [header, text]. The "Colors" row is painted, the
// "Merging" text spans the row below it (whose text is never used), and the columns have set widths.
// The wide table is wider than the panel, to show sideways scrolling and the cut-off edge.
type DemoTables = { tour: string[][]; wide: string[][] };
function demoTables(t: DemoTables): { tour: string; wide: string } {
  const [head, ...rows] = t.tour;
  const body = rows
    .map(([label, text], i) => {
      const th = `<th scope="row">${label}</th>`;
      if (i === 2) return `<tr>${th}<td style="--cell-c: #4caf72;">${text}</td></tr>`;
      if (i === 3) return `<tr>${th}<td rowspan="2" style="--cell-c: #7c5cff;">${text}</td></tr>`;
      if (i === 4) return `<tr>${th}</tr>`;
      return `<tr>${th}<td>${text}</td></tr>`;
    })
    .join("");
  const tour =
    `<table data-header-col="">${colgroup([130, 250])}<tbody>` +
    `<tr>${head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr>${body}</tbody></table>`;
  const [wideHead, wideRow] = t.wide;
  const wide =
    `<table>${colgroup([150, 150, 150, 150])}<tbody>` +
    `<tr>${wideHead.map((h) => `<th scope="col">${h}</th>`).join("")}</tr>` +
    `<tr>${wideRow.map((c, i) => (i === 3 ? `<td style="--cell-c: #d6b214;">${c}</td>` : `<td>${c}</td>`)).join("")}</tr>` +
    `</tbody></table>`;
  return { tour, wide };
}
function demoHtml(t: Record<string, string>, tables: DemoTables): string {
  const { tour, wide } = demoTables(tables);
  return (
    `<h1>${t.h1}</h1><h2>${t.h2}</h2><h3>${t.h3}</h3>` +
    `<blockquote>${t.quote}</blockquote>` +
    `<blockquote style="--quote-c: #f2780c;">${t.quote2}</blockquote>` +
    `<hr><p>${t.divider}</p>` +
    `<ul><li>${t.list}<ul><li>${t.sublist}<ul><li>${t.onItGoes}</li></ul></li></ul></li>` +
    `<li>${colored(t.colorStart, "#3f8ce0")}${t.colorEnd}</li></ul>` +
    `<ol><li>${t.numbered}<ol><li>${t.letters}<ol><li>${t.roman}</li></ol></li></ol></li><li>${t.count}</li></ol>` +
    `<p>${t.formatting.replace("{colored}", colored(t.coloredWord, "#7c5cff")).replace("{text}", colored(t.textWord, "#e05a86"))}</p>` +
    `<p>${t.pills
      .split(" ")
      .map((w, i) => pill(w, ["#4caf72", "#9c6b3e", "#3f8ce0", "#d6b214", "#e05a86", "#7c5cff", "#b8b8c0", "#8b8994"][i % 8]))
      .join(" ")}</p>` +
    `<p>${pill(t.twoLines, "#f2780c")}</p>` +
    `<h2>${t.tablesHeading}</h2><p>${t.tableIntro}</p>${tour}<p>${t.tableMenu}</p>${wide}` +
    `<h2>${t.togglesHeading}</h2>` +
    `<h4>${t.toggle}</h4><p>${t.toggleBody1}</p><p>${t.toggleBody2}</p>` +
    `<p data-exit="4">${t.backToNormal}</p>` +
    `<h4 data-collapsed="">${t.folded}</h4><p>${t.foldedBody}</p>` +
    `<h2 data-collapsed="">${t.headingFolds}</h2><p>${t.headingBody}</p>` +
    `<ul><li>${t.item1}</li><li>${t.item2}</li><li>${t.item3}</li><li>${t.item4}</li></ul>` +
    `<p data-exit="2">${t.stepOut}</p>` +
    `<hr><p data-exit="1"><i>${t.deleteMe}</i></p>`
  );
}


const DEFAULTS: Record<BuiltinTemplateId, Record<Language, TemplateSpec>> = {
  npc: {
    zh: {
      title: "NPC",
      html:
        section("概述", fields(["角色定位", "外貌", "性格", "口头禅或习惯"])) +
        section("动机", fields(["想要什么", "害怕什么"])) +
        section("知晓或隐瞒之事", EMPTY_LIST) +
        section("人际关系", EMPTY_LIST) +
        section("笔记", EMPTY_PARAGRAPH),
    },
    es: {
      title: "PNJ",
      html:
        section("Resumen", fields(["Rol", "Apariencia", "Personalidad", "Voz o tic"])) +
        section("Motivación", fields(["Qué quiere", "Qué teme"])) +
        section("Qué sabe o esconde", EMPTY_LIST) +
        section("Relaciones", EMPTY_LIST) +
        section("Notas", EMPTY_PARAGRAPH),
    },
    en: {
      title: "NPC",
      html:
        section("Overview", fields(["Role", "Appearance", "Personality", "Voice or quirk"])) +
        section("Motivation", fields(["Wants", "Fears"])) +
        section("Knows or hides", EMPTY_LIST) +
        section("Relationships", EMPTY_LIST) +
        section("Notes", EMPTY_PARAGRAPH),
    },
  },
  location: {
    zh: {
      title: "地点",
      html:
        section("第一印象", fields(["视觉", "听觉", "嗅觉"])) +
        section("谁在这里", EMPTY_LIST) +
        section("正在发生什么", EMPTY_PARAGRAPH) +
        section("秘密", EMPTY_LIST) +
        section("剧情钩子", EMPTY_LIST),
    },
    es: {
      title: "Lugar",
      html:
        section("Primera impresión", fields(["Vista", "Sonido", "Olor"])) +
        section("Quién está aquí", EMPTY_LIST) +
        section("Qué está pasando", EMPTY_PARAGRAPH) +
        section("Secretos", EMPTY_LIST) +
        section("Ganchos", EMPTY_LIST),
    },
    en: {
      title: "Location",
      html:
        section("First impression", fields(["Sight", "Sound", "Smell"])) +
        section("Who's here", EMPTY_LIST) +
        section("What's happening", EMPTY_PARAGRAPH) +
        section("Secrets", EMPTY_LIST) +
        section("Hooks", EMPTY_LIST),
    },
  },
  sessionPrep: {
    zh: {
      title: "团前准备",
      html:
        section("开场", EMPTY_PARAGRAPH) +
        section("可能的场景", EMPTY_LIST) +
        section("秘密与线索", EMPTY_LIST) +
        section("NPC", EMPTY_LIST) +
        section("地点", EMPTY_LIST) +
        section("奖励", EMPTY_LIST),
    },
    es: {
      title: "Preparación de sesión",
      html:
        section("Inicio", EMPTY_PARAGRAPH) +
        section("Escenas posibles", EMPTY_LIST) +
        section("Secretos y pistas", EMPTY_LIST) +
        section("PNJs", EMPTY_LIST) +
        section("Lugares", EMPTY_LIST) +
        section("Recompensas", EMPTY_LIST),
    },
    en: {
      title: "Session prep",
      html:
        section("Opening", EMPTY_PARAGRAPH) +
        section("Possible scenes", EMPTY_LIST) +
        section("Secrets and clues", EMPTY_LIST) +
        section("NPCs", EMPTY_LIST) +
        section("Locations", EMPTY_LIST) +
        section("Rewards", EMPTY_LIST),
    },
  },
  monster5e: {
    zh: {
      title: "怪物（D&D 5e）",
      html:
        labelTable(["体型与类型", "阵营", "护甲等级", "生命值", "速度"]) +
        headerTable(["力量", "敏捷", "体质", "智力", "感知", "魅力"]) +
        labelTable(["豁免检定", "技能", "抗性", "免疫", "感官", "语言", "挑战等级"]) +
        section("特性", EMPTY_PARAGRAPH) +
        section("动作", EMPTY_PARAGRAPH) +
        section("附赠动作", EMPTY_PARAGRAPH) +
        section("反应", EMPTY_PARAGRAPH) +
        section("传奇动作", EMPTY_PARAGRAPH),
    },
    es: {
      title: "Monstruo (D&D 5e)",
      html:
        labelTable(["Tamaño y tipo", "Alineamiento", "Clase de Armadura", "Puntos de golpe", "Velocidad"]) +
        headerTable(["FUE", "DES", "CON", "INT", "SAB", "CAR"]) +
        labelTable(["Tiradas de salvación", "Habilidades", "Resistencias", "Inmunidades", "Sentidos", "Idiomas", "Desafío"]) +
        section("Rasgos", EMPTY_PARAGRAPH) +
        section("Acciones", EMPTY_PARAGRAPH) +
        section("Acciones adicionales", EMPTY_PARAGRAPH) +
        section("Reacciones", EMPTY_PARAGRAPH) +
        section("Acciones legendarias", EMPTY_PARAGRAPH),
    },
    en: {
      title: "Monster (D&D 5e)",
      html:
        labelTable(["Size and type", "Alignment", "Armor Class", "Hit Points", "Speed"]) +
        headerTable(["STR", "DEX", "CON", "INT", "WIS", "CHA"]) +
        labelTable(["Saving Throws", "Skills", "Resistances", "Immunities", "Senses", "Languages", "Challenge"]) +
        section("Traits", EMPTY_PARAGRAPH) +
        section("Actions", EMPTY_PARAGRAPH) +
        section("Bonus Actions", EMPTY_PARAGRAPH) +
        section("Reactions", EMPTY_PARAGRAPH) +
        section("Legendary Actions", EMPTY_PARAGRAPH),
    },
  },
  dhAdversary: {
    zh: {
      title: "敌手（Daggerheart）",
      html:
        labelTable(["阶级", "类型", "描述", "动机与战术"]) +
        headerTable(["难度", "阈值", "生命", "压力"]) +
        headerTable(["攻击", "武器", "距离", "伤害"]) +
        labelTable(["专长"]) +
        section("特性", EMPTY_PARAGRAPH),
    },
    es: {
      title: "Adversario (Daggerheart)",
      html:
        labelTable(["Rango", "Tipo", "Descripción", "Motivos y tácticas"]) +
        headerTable(["Dificultad", "Umbrales", "PG", "Estrés"]) +
        headerTable(["ATQ", "Arma", "Alcance", "Daño"]) +
        labelTable(["Experiencia"]) +
        section("Características", EMPTY_PARAGRAPH),
    },
    en: {
      title: "Adversary (Daggerheart)",
      html:
        labelTable(["Tier", "Type", "Description", "Motives &amp; Tactics"]) +
        headerTable(["Difficulty", "Thresholds", "HP", "Stress"]) +
        headerTable(["ATK", "Weapon", "Range", "Damage"]) +
        labelTable(["Experience"]) +
        section("Features", EMPTY_PARAGRAPH),
    },
  },
  dhEnvironment: {
    zh: {
      title: "环境（Daggerheart）",
      html:
        labelTable(["阶级", "类型", "描述", "驱动力", "潜在敌手", "难度"]) +
        section("特性", EMPTY_PARAGRAPH),
    },
    es: {
      title: "Entorno (Daggerheart)",
      html:
        labelTable(["Rango", "Tipo", "Descripción", "Impulsos", "Posibles adversarios", "Dificultad"]) +
        section("Características", EMPTY_PARAGRAPH),
    },
    en: {
      title: "Environment (Daggerheart)",
      html:
        labelTable(["Tier", "Type", "Description", "Impulses", "Potential Adversaries", "Difficulty"]) +
        section("Features", EMPTY_PARAGRAPH),
    },
  },
  sessionRecap: {
    zh: {
      title: "团后回顾",
      html:
        section("场次", fields(["日期", "参与者"])) +
        section("发生了什么", EMPTY_PARAGRAPH) +
        section("关键决定", EMPTY_LIST) +
        section("战利品与奖励", EMPTY_LIST) +
        section("未了线索", EMPTY_LIST),
    },
    es: {
      title: "Resumen de sesión",
      html:
        section("Sesión", fields(["Fecha", "Participantes"])) +
        section("Qué pasó", EMPTY_PARAGRAPH) +
        section("Decisiones importantes", EMPTY_LIST) +
        section("Botín y recompensas", EMPTY_LIST) +
        section("Hilos abiertos", EMPTY_LIST),
    },
    en: {
      title: "Session recap",
      html:
        section("Session", fields(["Date", "Players"])) +
        section("What happened", EMPTY_PARAGRAPH) +
        section("Key decisions", EMPTY_LIST) +
        section("Loot and rewards", EMPTY_LIST) +
        section("Open threads", EMPTY_LIST),
    },
  },
  demo: {
    zh: {
      title: "这是一篇笔记",
      html: demoHtml({
        h1: "这是一个标题",
        h2: "这是一个小标题",
        h3: "这是一个小小标题（我们有点上头）",
        quote: "这是一段引用",
        quote2: "这是另一段引用，换了个颜色",
        divider: "\u2191 分隔线，为你准备的",
        list: "这是一个列表",
        sublist: "带一个子列表",
        onItGoes: "就这样一直下去\u2026",
        colorStart: "给一行开头上色",
        colorEnd: " 它的项目符号也会跟着变色",
        numbered: "这是一个有序列表",
        letters: "子列表用字母编号",
        roman: "然后是罗马数字，就是任性",
        count: "什么都数一数！",
        formatting: "可以用 <b>加粗</b>、<i>斜体</i>、<u>下划线</u>、<s>删除线</s> 或 {colored} {text}",
        coloredWord: "彩色",
        textWord: "文字",
        pills: "还能 创建 五颜六色 的 色丸",
        twoLines: "色丸也可以<br>占两行",
        tablesHeading: "表格！",
        tableIntro: "这里有一个会自我介绍的：",
        tableMenu: "其余功能都在表格菜单里：把光标放进单元格，点工具栏上的表格按钮。",
        togglesHeading: "折叠块",
        toggle: "这一行是折叠块——点它的箭头折叠下面的内容",
        toggleBody1: "折叠块下缩进的所有内容，折叠时都会隐藏。",
        toggleBody2: "适合放不需要一直看到的东西。",
        backToNormal: "这一行用「减少缩进」（或 Shift+Tab）退出了折叠块，所以始终可见。「增加缩进」（或 Tab）可以把它放回去。",
        folded: "这个折叠块已经折叠了。来，点开它",
        foldedBody: "你好！你找到了隐藏文字。这里没别的了，抱歉。",
        headingFolds: "标题也能折叠（这个已折叠）",
        headingBody: "一整个章节，收好备用。",
        item1: "列表",
        item2: "引用",
        item3: "甚至表格",
        item4: "其实什么都行",
        stepOut: "这一行退出了那个章节，每层一个 Shift+Tab。",
        deleteMe: "这是一个示例模板。不需要的话，可以在 + 菜单里删除它。",
      }, {
        tour: [
          ["这是一张表格", "它自己也知道"],
          ["表头列", "第一行和第一列都可以是表头。这张表两者都是"],
          ["格式", `单元格支持 <b>加粗</b>、<i>斜体</i>、${colored("颜色", "#e05a86")} 和 ${pill("色丸", "#3f8ce0")}`],
          ["颜色", "可以给一个单元格、一整行或一整列上色"],
          ["合并", "这个单元格吞掉了下面那个。想拆开随时可以"],
          ["（真的）", ""],
          ["移动", "抓住行左侧或列上方的圆点，拖到别处即可"],
          ["列宽", "拖动列的边界。双击则自动适应文字宽度"],
        ],
        wide: [
          ["这张表很宽", "宽到超出了面板", "所以要横向滚动", "你拉到底了！"],
          ["看到右边缘了吗", "看起来像被切断", "因为还有内容", "圆角又出现了"],
        ],
      }),
    },
    es: {
      title: "Esto es una nota",
      html: demoHtml({
        h1: "Esto es un título",
        h2: "Esto es un subtítulo",
        h3: "Y esto es un sub-subtítulo (nos entusiasmamos)",
        quote: "Esto es una cita",
        quote2: "Esta es otra cita, de otro color",
        divider: "\u2191 Líneas divisorias, para tu comodidad",
        list: "Esto es una lista",
        sublist: "Con una sub-lista",
        onItGoes: "Y así sigue\u2026",
        colorStart: "Coloreá el inicio de una línea",
        colorEnd: " y su viñeta lo acompaña",
        numbered: "Esto es una lista numerada",
        letters: "Las sub-listas usan letras",
        roman: "Y después números romanos, porque sí",
        count: "¡Contá todo!",
        formatting: "Podés usar <b>negrita</b>, <i>cursiva</i>, <u>subrayado</u>, <s>tachado</s> o {colored} {text}",
        coloredWord: "texto",
        textWord: "de color",
        pills: "Y crear píldoras de muchos colores y grises",
        twoLines: "Las píldoras pueden<br>ocupar dos líneas",
        tablesHeading: "¡Tablas!",
        tableIntro: "Acá hay una que se explica sola:",
        tableMenu: "Todo lo demás está en el menú de tabla: poné el cursor en una celda y tocá el botón de tabla de la barra.",
        togglesHeading: "Desplegables",
        toggle: "Esta línea es un desplegable: tocá su flecha para plegar lo de abajo",
        toggleBody1: "Todo lo que tiene sangría debajo de un desplegable se oculta al plegarlo.",
        toggleBody2: "Ideal para lo que no necesitás ver todo el tiempo.",
        backToNormal: "Esta línea salió del desplegable con «Reducir sangría» (o Shift+Tab), así que queda visible siempre. «Aumentar sangría» (o Tab) la devuelve.",
        folded: "Este desplegable ya está plegado. Dale, abrilo",
        foldedBody: "¡Hola! Encontraste el texto oculto. No hay nada más acá, perdón.",
        headingFolds: "Los títulos también se pliegan (este está plegado)",
        headingBody: "Una sección entera, guardada hasta que la necesites.",
        item1: "Listas",
        item2: "Citas",
        item3: "Tablas, incluso",
        item4: "Lo que quieras, en realidad",
        stepOut: "Y esta línea salió de esa sección, un Shift+Tab por nivel.",
        deleteMe: "Esta es una plantilla de ejemplo. Si no la necesitás, podés borrarla desde el menú +.",
      }, {
        tour: [
          ["Esto es una tabla", "Y lo sabe"],
          ["Columna de encabezado", "La primera fila y la primera columna pueden ser encabezados. Esta tabla tiene ambas"],
          ["Formato", `Las celdas aceptan <b>negrita</b>, <i>cursiva</i>, ${colored("color", "#e05a86")} y ${pill("píldoras", "#3f8ce0")}`],
          ["Colores", "Pintá una celda, una fila entera o una columna entera"],
          ["Combinar", "Esta celda se tragó a la de abajo. Separala cuando quieras"],
          ["(en serio)", ""],
          ["Mover", "Agarrá los puntos a la izquierda de una fila, o arriba de una columna, y arrastrala a otro lado"],
          ["Anchos", "Arrastrá el borde de una columna. Con doble clic, la columna se ajusta a su texto"],
        ],
        wide: [
          ["Esta tabla es ancha", "Demasiado ancha para el panel", "Así que se desplaza de costado", "¡Llegaste!"],
          ["¿Ves el borde derecho?", "Parece cortado", "Porque hay más", "Esquinas redondeadas otra vez"],
        ],
      }),
    },
    en: {
      title: "This is a note",
      html: demoHtml({
        h1: "This is a header",
        h2: "This is a subheader",
        h3: "And this is a sub-subheader (we got carried away)",
        quote: "This is a quote",
        quote2: "This is another quote, in a different color",
        divider: "\u2191 Divider lines, for your convenience",
        list: "This is a list",
        sublist: "With a sublist",
        onItGoes: "And on it goes\u2026",
        colorStart: "Color the start of a line",
        colorEnd: " and its bullet follows",
        numbered: "This is a numbered list",
        letters: "Sublists get letters",
        roman: "And then roman numerals, because why not",
        count: "Count everything!",
        formatting: "You can use <b>bold</b>, <i>italic</i>, <u>underline</u>, <s>strike through</s> or {colored} {text}",
        coloredWord: "colored",
        textWord: "text",
        pills: "And make pills in multiple colors and grays",
        twoLines: "Pills can even<br>span two lines",
        tablesHeading: "Tables!",
        tableIntro: "Here’s one explaining itself:",
        tableMenu: "Everything else lives in the table menu: put the caret in a cell and click the table button in the toolbar.",
        togglesHeading: "Toggles",
        toggle: "This line is a toggle \u2014 click its arrow to fold what's below",
        toggleBody1: "Everything indented under a toggle hides when you fold it.",
        toggleBody2: "Perfect for things you don't need to see all the time.",
        backToNormal: "This line left the toggle with “Decrease indent” (or Shift+Tab), so it stays visible either way. “Increase indent” (or Tab) puts it back.",
        folded: "This toggle is already folded. Go on, open it",
        foldedBody: "Hi! You found the hidden text. There's nothing else here, sorry.",
        headingFolds: "Headings fold too (this one is folded)",
        headingBody: "A whole section, tucked away until you need it.",
        item1: "Lists",
        item2: "Quotes",
        item3: "Tables, even",
        item4: "Anything, really",
        stepOut: "And this line stepped out of that section, one Shift+Tab per level.",
        deleteMe: "This is an example template. If you don't need it, you can delete it from the + menu.",
      }, {
        tour: [
          ["This is a table", "And it knows it"],
          ["Header column", "The first row and column can be headers. This table has both"],
          ["Formatting", `Cells take <b>bold</b>, <i>italic</i>, ${colored("color", "#e05a86")} and ${pill("pills", "#3f8ce0")}`],
          ["Colors", "Paint a cell, a whole row or a whole column"],
          ["Merging", "This cell swallowed the one below it. Split it back whenever you want"],
          ["(really)", ""],
          ["Moving", "Grab the dots left of a row, or above a column, and drag it somewhere else"],
          ["Widths", "Drag a column’s border. Double-click it and the column fits its text"],
        ],
        wide: [
          ["This table is wide", "Too wide for the panel", "So it scrolls sideways", "You made it!"],
          ["Notice the right edge?", "It looks cut off", "Because there’s more", "Rounded corners again"],
        ],
      }),
    },
  },
};

function defaultTemplates(): Template[] {
  const now = Date.now();
  return BUILTIN_IDS.map((builtin, index) => ({
    id: `t${now}-${index}`,
    title: "",
    html: "",
    updatedAt: now,
    builtin,
  }));
}
