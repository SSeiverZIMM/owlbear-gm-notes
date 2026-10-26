export type Language = "es" | "en" | "zh";

export interface ToolbarStrings {
  bold: string;
  italic: string;
  underline: string;
  strike: string;
  pill: string;
  pillNone: string;
  textColor: string;
  textColorNone: string;
  blockType: string;
  paragraph: string;
  h1: string;
  h2: string;
  h3: string;
  toggle: string;
  quoteColor: string;
  quoteColorNone: string;
  divider: string;
  table: string;
  tableSize: (cols: number, rows: number) => string;
  tableOptions: string;
  tableRowAbove: string;
  tableRowBelow: string;
  tableColLeft: string;
  tableColRight: string;
  tableRowUp: string;
  tableRowDown: string;
  tableRowDrag: string;
  tableColMoveLeft: string;
  tableColMoveRight: string;
  tableColDrag: string;
  tableMove: string;
  tableWidths: string;
  tableDeleteRow: string;
  tableDeleteCol: string;
  tableMergeRight: string;
  tableMergeDown: string;
  tableSplit: string;
  tableDistribute: string;
  tableFitContent: string;
  tableFitFrame: string;
  tableColor: string;
  tableColorCell: string;
  tableColorRow: string;
  tableColorCol: string;
  tableColorNone: string;
  tableHeaderRow: string;
  tableHeaderCol: string;
  tableDelete: string;
  listMenu: string;
  bulletList: string;
  checkList: string;
  numberList: string;
  outdent: string;
  indent: string;
  removeFormat: string;
  secret: string;
}

export interface Strings {
  notesLabel: string;
  searchPlaceholder: string;
  newNoteTitle: string;
  settingsTitle: string;
  gmGateSub: string;
  emptySearch: string;
  emptyList: string;
  untitled: string;
  emptyNote: string;
  renameTitle: string;
  pinTitle: string;
  unpinTitle: string;
  sortRecent: string;
  sortAlpha: string;
  sortTitle: string;
  moreActions: string;
  duplicateNote: string;
  copySuffix: string;
  renameAria: string;
  deleteTitle: string;
  trashLink: (n: number) => string;
  trashTitle: string;
  trashBack: string;
  trashEmptyBtn: string;
  trashEmptyConfirm: (n: number) => string;
  trashEmptyList: string;
  trashRestoreTitle: string;
  trashDeleteTitle: string;
  trashDeleteConfirm: (title: string) => string;
  trashDeletedAgo: string;
  trashExpiresIn: (days: number) => string;
  deleteAria: string;
  editedAgo: string;
  timeNow: string;
  timeMin: string;
  timeHour: string;
  timeDay: string;
  editorEmpty: string;
  titlePlaceholder: string;
  bodyPlaceholder: string;
  savedPrefix: string;
  savedInstant: string;
  savingLabel: string;
  wordsCount: (n: number) => string;
  newNoteDefaultTitle: string;
  blankNote: string;
  templatesLabel: string;
  templatesEmpty: string;
  restoreTemplates: string;
  restoreTemplatesHint: string;
  saveAsTemplateTitle: string;
  saveAsTemplateAria: string;
  templateSaved: (title: string) => string;
  renameTemplateTitle: string;
  renameTemplateAria: string;
  deleteTemplateTitle: string;
  deleteTemplateAria: string;
  resizeTitle: string;
  settingsClose: string;
  settingsInfo: string;
  linkPickerTitle: string;
  linkPickerEmpty: string;
  linkOpen: (title: string) => string;
  linkTrashed: string;
  linkMissing: string;
  settingsAccentLabel: string;
  settingsLangLabel: string;
  settingsHelpLabel: string;
  helpHint: string;
  helpLink: string;
  settingsStorageLabel: string;
  storageMeterText: (usedKB: string) => string;
  storageBannerGeneric: string;
  accentAutoTitle: string;
  exportTitle: string;
  exportAria: string;
  settingsBackupLabel: string;
  backupHint: string;
  exportAllBtn: string;
  importBtn: string;
  importNoneFound: string;
  importSuccess: (notes: number, templates: number) => string;
  importNothingNew: string;
  templatesFolder: string;
  clearAllBtn: string;
  clearAllConfirm: (n: number) => string;
  brandVisible: string;
  brandEditable: string;
  shareMenuTitle: string;
  shareModePrivate: string;
  shareModePrivateHint: string;
  shareModeVisible: string;
  shareModeVisibleHint: string;
  shareModeEditable: string;
  shareModeEditableHint: string;
  publishSignedOutTitle: string;
  publishConfirmTitle: string;
  publishConfirmHint: string;
  publishConfirmSecret: (n: number) => string;
  publishConfirmBtn: string;
  publishCancelBtn: string;
  publishError: string;
  publishEditableConfirmTitle: string;
  publishEditableConfirmHint: string;
  publishEditableConfirmSecret: (n: number) => string;
  publishEditableConfirmShowBtn: string;
  publicDotTitle: string;
  editableDotTitle: string;
  editableDotPlayerTitle: string;
  lockedBy: (name: string) => string;
  finishEditing: string;
  finishEditingTitle: string;
  someone: string;
  editableSignedOut: string;
  undoPlayerEdits: string;
  undoPlayerEditsBusy: (name: string) => string;
  settingsItemLinksLabel: string;
  itemLinksHint: string;
  itemLinksOnBtn: string;
  itemLinksOffBtn: string;
  itemPickBanner: (name: string, more: number) => string;
  itemPickCancel: string;
  linkedItemsLabel: string;
  connectionsTitle: string;
  linkedFrom: string;
  linkedItemSelect: string;
  linkedItemUnlink: string;
  itemNoteTrashed: (title: string) => string;
  itemNoteMissing: (name: string) => string;
  unnamedItem: string;
  settingsSecretLabel: string;
  secretEyeHint: string;
  secretEyeClickBtn: string;
  secretEyeLockBtn: string;
  secretEyeShow: string;
  secretEyeLocked: string;
  settingsSharedLabel: string;
  sharedKeyHint: string;
  regenerateKeyBtn: string;
  regenerateKeyConfirm: string;
  regenerateKeyError: string;
  signOutPublicTitle: string;
  signOutPublicHint: (n: number) => string;
  signOutUnpublishBtn: (n: number) => string;
  signOutKeepBtn: (n: number) => string;
  sharedLoading: string;
  sharedEmpty: string;
  sharedLoadError: string;
  exportFormatTitle: string;
  exportFormatHint: string;
  exportFormatJsonBtn: string;
  exportFormatMdBtn: string;
  settingsCloudLabel: string;
  cloudSyncHint: string;
  cloudSignInBtn: string;
  cloudSignOutBtn: string;
  cloudSyncNowBtn: string;
  cloudSignInError: string;
  cloudSignedOutTitle: string;
  cloudStatusTitle: (status: string) => string;
  toolbar: ToolbarStrings;
}

const STRINGS: Record<Language, Strings> = {
  es: {
    notesLabel: "Notas",
    searchPlaceholder: "Buscar notas…",
    newNoteTitle: "Nueva nota",
    settingsTitle: "Configuración",
    gmGateSub: "Acceso de GM requerido.",
    emptySearch: "Sin resultados para tu búsqueda.",
    emptyList: "Todavía no hay notas.<br>Creá la primera con el botón “+”.",
    untitled: "Sin título",
    emptyNote: "Nota vacía",
    renameTitle: "Renombrar nota",
    pinTitle: "Fijar arriba",
    unpinTitle: "Dejar de fijar",
    sortRecent: "Recientes",
    sortAlpha: "A–Z",
    sortTitle: "Cambiar el orden de la lista",
    moreActions: "Más acciones",
    duplicateNote: "Duplicar",
    copySuffix: " (copia)",
    renameAria: "Renombrar ",
    deleteTitle: "Mover a la papelera",
    trashLink: (n) => `Papelera (${n})`,
    trashTitle: "Papelera",
    trashBack: "Volver a las notas",
    trashEmptyBtn: "Vaciar papelera",
    trashEmptyConfirm: (n) => (n === 1 ? "¿Eliminar para siempre la nota de la papelera? No se puede deshacer." : `¿Eliminar para siempre las ${n} notas de la papelera? No se puede deshacer.`),
    trashEmptyList: "La papelera está vacía.",
    trashRestoreTitle: "Restaurar",
    trashDeleteTitle: "Eliminar para siempre",
    trashDeleteConfirm: (title) => `¿Eliminar para siempre “${title}”? No se puede deshacer.`,
    trashDeletedAgo: "borrada hace ",
    trashExpiresIn: (d) => (d <= 1 ? " · último día" : ` · quedan ${d} días`),
    deleteAria: "Eliminar ",
    editedAgo: "editado hace ",
    timeNow: "ahora",
    timeMin: " min",
    timeHour: " h",
    timeDay: " d",
    editorEmpty: "Seleccioná una nota, o creá una nueva con el botón “+” para empezar a escribir.",
    titlePlaceholder: "Título de la nota",
    bodyPlaceholder: "Escribí aquí las notas de tu partida…",
    savedPrefix: "Guardado hace ",
    savedInstant: "un instante",
    savingLabel: "Guardando…",
    wordsCount: (n) => n + (n === 1 ? " palabra" : " palabras"),
    newNoteDefaultTitle: "Nueva nota",
    blankNote: "Nota en blanco",
    templatesLabel: "Plantillas",
    restoreTemplates: "Restaurar plantillas predeterminadas",
    restoreTemplatesHint: "Vuelve a agregar las plantillas predeterminadas que borraste o renombraste. No modifica tus plantillas.",
    templatesEmpty: "Todavía no hay plantillas. Guardá cualquier nota como plantilla con el botón de su fila en la lista de notas.",
    saveAsTemplateTitle: "Guardar como plantilla",
    saveAsTemplateAria: "Guardar como plantilla: ",
    templateSaved: (title) => `Plantilla “${title}” guardada.`,
    renameTemplateTitle: "Renombrar plantilla",
    renameTemplateAria: "Renombrar plantilla ",
    deleteTemplateTitle: "Eliminar plantilla",
    deleteTemplateAria: "Eliminar plantilla ",
    resizeTitle: "Redimensionar panel (doble clic: tamaño por defecto)",
    settingsClose: "Cerrar",
    settingsInfo: "Más información",
    linkPickerTitle: "Enlazar a una nota",
    linkPickerEmpty: "Ninguna nota coincide",
    linkOpen: (t) => `Abrir «${t}»`,
    linkTrashed: "Esta nota está en la papelera",
    linkMissing: "Esta nota ya no existe",
    settingsAccentLabel: "Color de acento",
    settingsLangLabel: "Idioma",
    settingsHelpLabel: "Ayuda",
    helpHint: "Abre el manual de GM Notes (el README en GitHub) en una pestaña nueva.",
    helpLink: "Ver manual",
    settingsStorageLabel: "Espacio usado en este dispositivo",
    storageMeterText: (usedKB) => `${usedKB} KB`,
    storageBannerGeneric: "No se pudo guardar el último cambio. Si estás en una ventana privada o con el almacenamiento del navegador bloqueado, probá desactivarlo para esta página.",
    accentAutoTitle: "Automático (seguir Owlbear)",
    exportTitle: "Exportar nota",
    exportAria: "Exportar ",
    settingsBackupLabel: "Respaldo de notas",
    backupHint: "Las notas se guardan en este dispositivo, no en la sala. Exportalas a un archivo para llevarlas a otro dispositivo o como respaldo, e importalas cuando quieras. Exportar todas también incluye tus plantillas.",
    exportAllBtn: "Exportar todas",
    importBtn: "Importar",
    importNoneFound: "No se encontró ninguna nota ni plantilla válida en el/los archivo(s) elegido(s).",
    importSuccess: (notes, templates) => {
      const parts: string[] = [];
      if (notes) parts.push(notes === 1 ? "1 nota" : `${notes} notas`);
      if (templates) parts.push(templates === 1 ? "1 plantilla" : `${templates} plantillas`);
      return `Se importó: ${parts.join(" y ")}.`;
    },
    importNothingNew: "Las plantillas del archivo ya estaban guardadas — no se agregó nada nuevo.",
    templatesFolder: "plantillas",
    clearAllBtn: "Borrar todas las notas",
    clearAllConfirm: (n) => (n === 1 ? "¿Mover la nota de esta sala a la papelera? Podés restaurarla durante 30 días." : `¿Mover las ${n} notas de esta sala a la papelera? Podés restaurarlas durante 30 días.`),
    brandVisible: "Visible",
    brandEditable: "Pública",
    shareMenuTitle: "Compartir esta nota con los jugadores",
    shareModePrivate: "Privada",
    shareModePrivateHint: "Solo vos la ves",
    shareModeVisible: "Visible",
    shareModeVisibleHint: "Los jugadores la leen",
    shareModeEditable: "Pública",
    shareModeEditableHint: "Los jugadores la editan, de a uno",
    publishSignedOutTitle: "Para compartir notas con los jugadores, iniciá sesión en Configuración",
    publishConfirmTitle: "¿Compartir esta nota?",
    publishConfirmSecret: (n) => (n === 1 ? "La parte oculta de la nota no se comparte." : `Las ${n} partes ocultas de la nota no se comparten.`),
    publishConfirmHint: "Todos los jugadores de la sala van a poder verla, pero no editarla. Lo que cambies después también lo van a ver.",
    publishConfirmBtn: "Compartir",
    publishCancelBtn: "Cancelar",
    publishError: "No se pudo compartir la nota. Probá de nuevo.",
    publishEditableConfirmTitle: "¿Hacer pública esta nota?",
    publishEditableConfirmHint: "Todos los jugadores de la sala van a poder verla y editarla, de a uno por vez. Vas a ver sus cambios, y podés deshacerlos desde el menú ⋯ de la nota.",
    publishEditableConfirmSecret: (n) => (n === 1 ? "Su parte oculta se va a mostrar: una nota pública no tiene partes ocultas." : `Sus ${n} partes ocultas se van a mostrar: una nota pública no tiene partes ocultas.`),
    publishEditableConfirmShowBtn: "Mostrar y compartir",
    publicDotTitle: "Visible para los jugadores",
    editableDotTitle: "Pública: los jugadores la editan",
    editableDotPlayerTitle: "Podés editarla",
    lockedBy: (name) => `${name} está editando`,
    finishEditing: "Terminar",
    finishEditingTitle: "Terminar de editar: libera la nota para que otros la editen",
    someone: "Alguien",
    editableSignedOut: "Para editar una nota pública, iniciá sesión en Configuración.",
    undoPlayerEdits: "Deshacer los cambios de los jugadores",
    undoPlayerEditsBusy: (name) => `${name} está editando esta nota. Probá cuando termine.`,
    settingsItemLinksLabel: "Objetos vinculados",
    itemLinksHint: "Con click derecho sobre cualquier objeto del mapa podés vincularle una nota y, después, abrirla desde ahí mismo. Desactivalo para sacar esa opción del menú; los vínculos se conservan.",
    itemLinksOnBtn: "Activados",
    itemLinksOffBtn: "Desactivados",
    itemPickBanner: (name, more) => (more ? `Elegí la nota para «${name}» (+${more})` : `Elegí la nota para «${name}»`),
    itemPickCancel: "Cancelar",
    linkedItemsLabel: "Vinculada a:",
    connectionsTitle: "Objetos vinculados y notas que enlazan a esta",
    linkedFrom: "Enlazada desde",
    linkedItemSelect: "Seleccionar en el mapa",
    linkedItemUnlink: "Desvincular",
    itemNoteTrashed: (t) => `La nota vinculada, «${t}», está en la papelera. ¿Restaurarla?`,
    itemNoteMissing: (name) => `La nota vinculada a «${name}» no está en este dispositivo (se borró, o no se sincronizó). ¿Desvincular el objeto?`,
    unnamedItem: "objeto",
    settingsSecretLabel: "Partes ocultas",
    secretEyeHint: "Hacer click en el ojito junto a una parte oculta la vuelve a mostrar a los jugadores. Bloquealo si preferís que el ojito solo la señale.",
    secretEyeClickBtn: "Mostrar con un click",
    secretEyeLockBtn: "Bloqueado",
    secretEyeShow: "Mostrar a los jugadores",
    secretEyeLocked: "Oculto a los jugadores",
    settingsSharedLabel: "Notas compartidas",
    sharedKeyHint: "Los jugadores ven las notas públicas gracias a una clave guardada en la sala. Si alguien que ya no está en la sala la conserva, regenerala: desde ese momento deja de verlas. Los que están en la sala no notan nada.",
    regenerateKeyBtn: "Regenerar clave",
    regenerateKeyConfirm: "¿Regenerar la clave de las notas compartidas? Quien tenga la clave vieja deja de ver las notas públicas.",
    regenerateKeyError: "No se pudo regenerar la clave. Probá de nuevo.",
    signOutPublicTitle: "Tenés notas públicas",
    signOutPublicHint: (n) => `Sin sesión iniciada no se pueden actualizar ni despublicar: los jugadores van a seguir viendo ${n === 1 ? "tu nota pública tal como está" : `tus ${n} notas públicas tal como están`} ahora, hasta que vuelvas a iniciar sesión.`,
    signOutUnpublishBtn: (n) => (n === 1 ? "Despublicarla y cerrar sesión" : "Despublicar todas y cerrar sesión"),
    signOutKeepBtn: (n) => (n === 1 ? "Cerrar sesión y dejarla visible" : "Cerrar sesión y dejarlas visibles"),
    sharedLoading: "Cargando las notas compartidas…",
    sharedEmpty: "El GM todavía no compartió ninguna nota.",
    sharedLoadError: "No se pudieron cargar las notas compartidas. Probá cerrar y volver a abrir GM Notes.",
    exportFormatTitle: "Formato de exportación",
    exportFormatHint: "Markdown es texto plano y legible — bueno para llevar una nota a otro lado. JSON conserva todo tal cual y es lo que espera Importar.",
    exportFormatJsonBtn: "JSON",
    exportFormatMdBtn: "Markdown",
    settingsCloudLabel: "Sincronización en la nube",
    cloudSyncHint: "Iniciá sesión con Google para sincronizar tus notas con tu propia cuenta, así te siguen a otro dispositivo. Solo vos podés verlas — iniciar sesión no comparte nada con jugadores ni otros GMs.",
    cloudSignInBtn: "Iniciar sesión con Google",
    cloudSignOutBtn: "Cerrar sesión",
    cloudSyncNowBtn: "Sincronizar ahora",
    cloudSignInError: "No se pudo iniciar sesión. Probá de nuevo.",
    cloudSignedOutTitle: "Sin sincronizar — iniciá sesión en Configuración",
    cloudStatusTitle: (status) => ({
      synced: "Sincronizado con la nube",
      pending: "Cambios pendientes de sincronizar — clic para sincronizar ahora",
      syncing: "Sincronizando…",
      error: "Error al sincronizar — clic para reintentar",
    })[status] || "Sincronización en la nube",
    toolbar: {
      bold: "Negrita (Ctrl+B)", italic: "Cursiva (Ctrl+I)", underline: "Subrayado (Ctrl+U)", strike: "Tachado",
      pill: "Píldora de color", pillNone: "Quitar color", textColor: "Color de texto", textColorNone: "Color por defecto",
      blockType: "Tipo de bloque", paragraph: "Texto normal", h1: "Título 1", h2: "Título 2", h3: "Título 3", toggle: "Desplegable",
      quoteColor: "Cita", quoteColorNone: "Quitar cita", divider: "Línea divisoria",
      table: "Tabla", tableSize: (c, r) => `${c} ${c === 1 ? "columna" : "columnas"} × ${r} ${r === 1 ? "fila" : "filas"}`,
      tableOptions: "Opciones de tabla", tableRowAbove: "Insertar fila arriba", tableRowBelow: "Insertar fila abajo",
      tableColLeft: "Insertar columna a la izquierda", tableColRight: "Insertar columna a la derecha",
      tableRowUp: "Mover fila arriba", tableRowDown: "Mover fila abajo", tableRowDrag: "Arrastrar para mover la fila",
      tableColMoveLeft: "Mover columna a la izquierda", tableColMoveRight: "Mover columna a la derecha", tableColDrag: "Arrastrar para mover la columna",
      tableMove: "Mover", tableWidths: "Ancho de columnas",
      tableDeleteRow: "Eliminar fila", tableDeleteCol: "Eliminar columna",
      tableMergeRight: "Combinar con la celda de la derecha", tableMergeDown: "Combinar con la celda de abajo", tableSplit: "Separar celda", tableDistribute: "Distribuir columnas", tableFitContent: "Ajustar al contenido", tableFitFrame: "Ajustar al marco",
      tableColor: "Color de fondo", tableColorCell: "Celda", tableColorRow: "Fila", tableColorCol: "Columna", tableColorNone: "Sin color",
      tableHeaderRow: "Fila de encabezado", tableHeaderCol: "Columna de encabezado", tableDelete: "Eliminar tabla",
      listMenu: "Listas", bulletList: "Lista con viñetas", checkList: "Casillas", numberList: "Lista numerada", outdent: "Reducir sangría",
      indent: "Aumentar sangría", removeFormat: "Quitar formato",
      secret: "Ocultar a los jugadores",
    },
  },
  en: {
    notesLabel: "Notes",
    searchPlaceholder: "Search notes…",
    newNoteTitle: "New note",
    settingsTitle: "Settings",
    gmGateSub: "GM access required.",
    emptySearch: "No results for your search.",
    emptyList: "No notes yet.<br>Create the first one with the “+” button.",
    untitled: "Untitled",
    emptyNote: "Empty note",
    renameTitle: "Rename note",
    pinTitle: "Pin to the top",
    unpinTitle: "Unpin",
    sortRecent: "Recent",
    sortAlpha: "A–Z",
    sortTitle: "Change the list's order",
    moreActions: "More actions",
    duplicateNote: "Duplicate",
    copySuffix: " (copy)",
    renameAria: "Rename ",
    deleteTitle: "Move to trash",
    trashLink: (n) => `Trash (${n})`,
    trashTitle: "Trash",
    trashBack: "Back to the notes",
    trashEmptyBtn: "Empty trash",
    trashEmptyConfirm: (n) => (n === 1 ? "Delete the note in the trash for good? This can't be undone." : `Delete the ${n} notes in the trash for good? This can't be undone.`),
    trashEmptyList: "The trash is empty.",
    trashRestoreTitle: "Restore",
    trashDeleteTitle: "Delete for good",
    trashDeleteConfirm: (title) => `Delete “${title}” for good? This can't be undone.`,
    trashDeletedAgo: "deleted ",
    trashExpiresIn: (d) => (d <= 1 ? " · last day" : ` · ${d} days left`),
    deleteAria: "Delete ",
    editedAgo: "edited ",
    timeNow: "now",
    timeMin: "m ago",
    timeHour: "h ago",
    timeDay: "d ago",
    editorEmpty: "Select a note, or create a new one with the “+” button to start writing.",
    titlePlaceholder: "Note title",
    bodyPlaceholder: "Write your session notes here…",
    savedPrefix: "Saved ",
    savedInstant: "a moment ago",
    savingLabel: "Saving…",
    wordsCount: (n) => n + (n === 1 ? " word" : " words"),
    newNoteDefaultTitle: "New note",
    blankNote: "Blank note",
    templatesLabel: "Templates",
    restoreTemplates: "Restore default templates",
    restoreTemplatesHint: "Adds back the default templates you deleted or renamed. Your own templates aren't changed.",
    templatesEmpty: "No templates yet. Save any note as a template with the button on its row in the notes list.",
    saveAsTemplateTitle: "Save as template",
    saveAsTemplateAria: "Save as template: ",
    templateSaved: (title) => `Saved “${title}” as a template.`,
    renameTemplateTitle: "Rename template",
    renameTemplateAria: "Rename template ",
    deleteTemplateTitle: "Delete template",
    deleteTemplateAria: "Delete template ",
    resizeTitle: "Resize panel (double-click: default size)",
    settingsClose: "Close",
    settingsInfo: "More info",
    linkPickerTitle: "Link to a note",
    linkPickerEmpty: "No matching notes",
    linkOpen: (t) => `Open “${t}”`,
    linkTrashed: "This note is in the trash",
    linkMissing: "This note no longer exists",
    settingsAccentLabel: "Accent color",
    settingsLangLabel: "Language",
    settingsHelpLabel: "Help",
    helpHint: "Opens the GM Notes manual (the README on GitHub) in a new tab.",
    helpLink: "View manual",
    settingsStorageLabel: "Storage used on this device",
    storageMeterText: (usedKB) => `${usedKB} KB`,
    storageBannerGeneric: "Couldn't save your last change. If you're in a private window or have browser storage blocked, try allowing it for this page.",
    accentAutoTitle: "Auto (follow Owlbear)",
    exportTitle: "Export note",
    exportAria: "Export ",
    settingsBackupLabel: "Notes backup",
    backupHint: "Notes are stored on this device, not in the room. Export them to a file to take them to another device or as a backup, and import them back whenever you want. Export all also includes your templates.",
    exportAllBtn: "Export all",
    importBtn: "Import",
    importNoneFound: "No valid notes or templates were found in the chosen file(s).",
    importSuccess: (notes, templates) => {
      const parts: string[] = [];
      if (notes) parts.push(notes === 1 ? "1 note" : `${notes} notes`);
      if (templates) parts.push(templates === 1 ? "1 template" : `${templates} templates`);
      return `Imported ${parts.join(" and ")}.`;
    },
    importNothingNew: "The templates in the file were already saved — nothing new was added.",
    templatesFolder: "templates",
    clearAllBtn: "Clear all notes",
    clearAllConfirm: (n) => (n === 1 ? "Move this room's note to the trash? You can restore it for 30 days." : `Move this room's ${n} notes to the trash? You can restore them for 30 days.`),
    brandVisible: "Visible",
    brandEditable: "Public",
    shareMenuTitle: "Share this note with the players",
    shareModePrivate: "Private",
    shareModePrivateHint: "Only you see it",
    shareModeVisible: "Visible",
    shareModeVisibleHint: "Players read it",
    shareModeEditable: "Public",
    shareModeEditableHint: "Players edit it, one at a time",
    publishSignedOutTitle: "To share notes with the players, sign in from Settings",
    publishConfirmTitle: "Share this note?",
    publishConfirmSecret: (n) => (n === 1 ? "The note's hidden part isn't shared." : `The note's ${n} hidden parts aren't shared.`),
    publishConfirmHint: "Every player in the room will be able to see it, but not edit it. They'll also see whatever you change afterwards.",
    publishConfirmBtn: "Share",
    publishCancelBtn: "Cancel",
    publishError: "Couldn't share the note. Please try again.",
    publishEditableConfirmTitle: "Make this note public?",
    publishEditableConfirmHint: "Every player in the room will be able to see and edit it, one at a time. You'll see their changes, and you can undo them from the note's ⋯ menu.",
    publishEditableConfirmSecret: (n) => (n === 1 ? "Its hidden part will be shown: a public note has no hidden parts." : `Its ${n} hidden parts will be shown: a public note has no hidden parts.`),
    publishEditableConfirmShowBtn: "Show and share",
    publicDotTitle: "Visible to the players",
    editableDotTitle: "Public: players edit it",
    editableDotPlayerTitle: "You can edit it",
    lockedBy: (name) => `${name} is editing`,
    finishEditing: "Done",
    finishEditingTitle: "Done editing: frees the note for others to edit",
    someone: "Someone",
    editableSignedOut: "To edit a public note, sign in from Settings.",
    undoPlayerEdits: "Undo the players' changes",
    undoPlayerEditsBusy: (name) => `${name} is editing this note. Try again once they're done.`,
    settingsItemLinksLabel: "Linked items",
    itemLinksHint: "Right-click any item on the map to link a note to it, and then open that note from right there. Turn it off to take that option out of the menu; the links are kept.",
    itemLinksOnBtn: "On",
    itemLinksOffBtn: "Off",
    itemPickBanner: (name, more) => (more ? `Pick the note for “${name}” (+${more})` : `Pick the note for “${name}”`),
    itemPickCancel: "Cancel",
    linkedItemsLabel: "Linked to:",
    connectionsTitle: "Linked items, and notes that link here",
    linkedFrom: "Linked from",
    linkedItemSelect: "Select on the map",
    linkedItemUnlink: "Unlink",
    itemNoteTrashed: (t) => `The linked note, “${t}”, is in the trash. Restore it?`,
    itemNoteMissing: (name) => `The note linked to “${name}” isn't on this device (deleted, or not synced). Unlink the item?`,
    unnamedItem: "item",
    settingsSecretLabel: "Hidden parts",
    secretEyeHint: "Clicking the eye next to a hidden part shows it to players again. Lock it if you'd rather the eye only mark it.",
    secretEyeClickBtn: "Show on click",
    secretEyeLockBtn: "Locked",
    secretEyeShow: "Show to players",
    secretEyeLocked: "Hidden from players",
    settingsSharedLabel: "Shared notes",
    sharedKeyHint: "Players see the public notes through a key stored in the room. If someone no longer in the room still has it, regenerate it: from then on they stop seeing them. Those in the room won't notice a thing.",
    regenerateKeyBtn: "Regenerate key",
    regenerateKeyConfirm: "Regenerate the shared notes key? Anyone holding the old key stops seeing the public notes.",
    regenerateKeyError: "Couldn't regenerate the key. Please try again.",
    signOutPublicTitle: "You have public notes",
    signOutPublicHint: (n) => `Signed out, they can't be updated or unpublished: players will keep seeing ${n === 1 ? "your public note as it is" : `your ${n} public notes as they are`} now, until you sign in again.`,
    signOutUnpublishBtn: (n) => (n === 1 ? "Unpublish it and sign out" : "Unpublish all and sign out"),
    signOutKeepBtn: (n) => (n === 1 ? "Sign out and keep it visible" : "Sign out and keep them visible"),
    sharedLoading: "Loading the shared notes…",
    sharedEmpty: "The GM hasn't shared any notes yet.",
    sharedLoadError: "Couldn't load the shared notes. Try closing GM Notes and opening it again.",
    exportFormatTitle: "Export format",
    exportFormatHint: "Markdown is plain, readable text — good for taking a note elsewhere. JSON keeps everything exactly as-is and is what Import expects back.",
    exportFormatJsonBtn: "JSON",
    exportFormatMdBtn: "Markdown",
    settingsCloudLabel: "Cloud sync",
    cloudSyncHint: "Sign in with Google to sync your notes to your own account, so they follow you to another device. Only you can see them — signing in does not share anything with players or other GMs.",
    cloudSignInBtn: "Sign in with Google",
    cloudSignOutBtn: "Sign out",
    cloudSyncNowBtn: "Sync now",
    cloudSignInError: "Couldn't sign in. Please try again.",
    cloudSignedOutTitle: "Not syncing — sign in from Settings",
    cloudStatusTitle: (status) => ({
      synced: "Synced with the cloud",
      pending: "Changes waiting to sync — click to sync now",
      syncing: "Syncing…",
      error: "Sync failed — click to retry",
    })[status] || "Cloud sync",
    toolbar: {
      bold: "Bold (Ctrl+B)", italic: "Italic (Ctrl+I)", underline: "Underline (Ctrl+U)", strike: "Strikethrough",
      pill: "Color pill", pillNone: "Remove color", textColor: "Text color", textColorNone: "Default color",
      blockType: "Block type", paragraph: "Normal text", h1: "Heading 1", h2: "Heading 2", h3: "Heading 3", toggle: "Toggle",
      quoteColor: "Quote", quoteColorNone: "Remove quote", divider: "Divider",
      table: "Table", tableSize: (c, r) => `${c} ${c === 1 ? "column" : "columns"} × ${r} ${r === 1 ? "row" : "rows"}`,
      tableOptions: "Table options", tableRowAbove: "Insert row above", tableRowBelow: "Insert row below",
      tableColLeft: "Insert column left", tableColRight: "Insert column right",
      tableRowUp: "Move row up", tableRowDown: "Move row down", tableRowDrag: "Drag to move the row",
      tableColMoveLeft: "Move column left", tableColMoveRight: "Move column right", tableColDrag: "Drag to move the column",
      tableMove: "Move", tableWidths: "Column widths",
      tableDeleteRow: "Delete row", tableDeleteCol: "Delete column",
      tableMergeRight: "Merge with cell on the right", tableMergeDown: "Merge with cell below", tableSplit: "Split cell", tableDistribute: "Distribute columns", tableFitContent: "Fit to content", tableFitFrame: "Fit to frame",
      tableColor: "Background color", tableColorCell: "Cell", tableColorRow: "Row", tableColorCol: "Column", tableColorNone: "No color",
      tableHeaderRow: "Header row", tableHeaderCol: "Header column", tableDelete: "Delete table",
      listMenu: "Lists", bulletList: "Bullet list", checkList: "Checklist", numberList: "Numbered list", outdent: "Decrease indent",
      indent: "Increase indent", removeFormat: "Clear formatting",
      secret: "Hide from players",
    },
  },
  zh: {
    notesLabel: "笔记",
    searchPlaceholder: "搜索笔记…",
    newNoteTitle: "新建笔记",
    settingsTitle: "设置",
    gmGateSub: "需要 GM 权限。",
    emptySearch: "没有匹配的搜索结果。",
    emptyList: "还没有笔记。<br>点“+”按钮创建第一篇。",
    untitled: "无标题",
    emptyNote: "空笔记",
    renameTitle: "重命名笔记",
    pinTitle: "置顶",
    unpinTitle: "取消置顶",
    sortRecent: "最近",
    sortAlpha: "A–Z",
    sortTitle: "更改列表排序",
    moreActions: "更多操作",
    duplicateNote: "复制",
    copySuffix: " （副本）",
    renameAria: "重命名 ",
    deleteTitle: "移入回收站",
    trashLink: (n) => `回收站 (${n})`,
    trashTitle: "回收站",
    trashBack: "返回笔记",
    trashEmptyBtn: "清空回收站",
    trashEmptyConfirm: (n) => (n === 1 ? "永久删除回收站中的这篇笔记？此操作无法撤销。" : `永久删除回收站中的 ${n} 篇笔记？此操作无法撤销。`),
    trashEmptyList: "回收站是空的。",
    trashRestoreTitle: "还原",
    trashDeleteTitle: "永久删除",
    trashDeleteConfirm: (title) => `永久删除“${title}”？此操作无法撤销。`,
    trashDeletedAgo: "删除于 ",
    trashExpiresIn: (d) => (d <= 1 ? " · 最后一天" : ` · 剩余 ${d} 天`),
    deleteAria: "删除 ",
    editedAgo: "编辑于 ",
    timeNow: "刚刚",
    timeMin: " 分钟前",
    timeHour: " 小时前",
    timeDay: " 天前",
    editorEmpty: "选择一篇笔记，或点“+”按钮新建一篇开始书写。",
    titlePlaceholder: "笔记标题",
    bodyPlaceholder: "在这里写下你的跑团笔记…",
    savedPrefix: "保存于 ",
    savedInstant: "片刻前",
    savingLabel: "保存中…",
    wordsCount: (n) => `${n} 个字词`,
    newNoteDefaultTitle: "新建笔记",
    blankNote: "空白笔记",
    templatesLabel: "模板",
    restoreTemplates: "恢复默认模板",
    restoreTemplatesHint: "重新添加你删除或重命名过的默认模板。不会改动你自己的模板。",
    templatesEmpty: "还没有模板。在笔记列表中用每行右侧的按钮，可以把任意笔记保存为模板。",
    saveAsTemplateTitle: "保存为模板",
    saveAsTemplateAria: "保存为模板：",
    templateSaved: (title) => `已将“${title}”保存为模板。`,
    renameTemplateTitle: "重命名模板",
    renameTemplateAria: "重命名模板 ",
    deleteTemplateTitle: "删除模板",
    deleteTemplateAria: "删除模板 ",
    resizeTitle: "调整面板大小（双击：恢复默认大小）",
    settingsClose: "关闭",
    settingsInfo: "更多信息",
    linkPickerTitle: "链接到笔记",
    linkPickerEmpty: "没有匹配的笔记",
    linkOpen: (t) => `打开「${t}」`,
    linkTrashed: "这篇笔记在回收站中",
    linkMissing: "这篇笔记已不存在",
    settingsAccentLabel: "主题色",
    settingsLangLabel: "语言",
    settingsHelpLabel: "帮助",
    helpHint: "在新标签页打开 GM Notes 手册（GitHub 上的 README）。",
    helpLink: "查看手册",
    settingsStorageLabel: "本设备已用空间",
    storageMeterText: (usedKB) => `${usedKB} KB`,
    storageBannerGeneric: "最近一次修改保存失败。如果你正在使用隐私窗口，或浏览器存储被禁用，请尝试为本页面启用存储。",
    accentAutoTitle: "自动（跟随枭熊）",
    exportTitle: "导出笔记",
    exportAria: "导出 ",
    settingsBackupLabel: "笔记备份",
    backupHint: "笔记保存在本设备上，而非房间里。导出为文件即可转移到其他设备或作为备份，之后随时可以导入。「导出全部」也会包含你的模板。",
    exportAllBtn: "导出全部",
    importBtn: "导入",
    importNoneFound: "在所选文件中未找到有效的笔记或模板。",
    importSuccess: (notes, templates) => {
      const parts: string[] = [];
      if (notes) parts.push(`${notes} 篇笔记`);
      if (templates) parts.push(`${templates} 个模板`);
      return `已导入：${parts.join("和")}。`;
    },
    importNothingNew: "文件中的模板此前已保存过——没有新增任何内容。",
    templatesFolder: "模板",
    clearAllBtn: "清空全部笔记",
    clearAllConfirm: (n) => (n === 1 ? "把这个房间的这篇笔记移入回收站？30 天内可以还原。" : `把这个房间的 ${n} 篇笔记移入回收站？30 天内可以还原。`),
    brandVisible: "可见",
    brandEditable: "公开",
    shareMenuTitle: "与玩家共享这篇笔记",
    shareModePrivate: "私有",
    shareModePrivateHint: "只有你能看到",
    shareModeVisible: "可见",
    shareModeVisibleHint: "玩家可以阅读",
    shareModeEditable: "公开",
    shareModeEditableHint: "玩家可以轮流编辑",
    publishSignedOutTitle: "要与玩家共享笔记，请先在设置中登录",
    publishConfirmTitle: "共享这篇笔记？",
    publishConfirmSecret: (n) => (n === 1 ? "笔记的隐藏部分不会被共享。" : `笔记的 ${n} 处隐藏部分不会被共享。`),
    publishConfirmHint: "房间里的所有玩家都能看到它，但不能编辑。你之后的修改他们也会看到。",
    publishConfirmBtn: "共享",
    publishCancelBtn: "取消",
    publishError: "共享笔记失败，请重试。",
    publishEditableConfirmTitle: "将这篇笔记设为公开？",
    publishEditableConfirmHint: "房间里的所有玩家都能看到并编辑它，同一时间一人编辑。你会看到他们的修改，也可以在笔记的 ⋯ 菜单里撤销。",
    publishEditableConfirmSecret: (n) => (n === 1 ? "它的隐藏部分将会显示：公开笔记没有隐藏部分。" : `它的 ${n} 处隐藏部分将会显示：公开笔记没有隐藏部分。`),
    publishEditableConfirmShowBtn: "显示并共享",
    publicDotTitle: "玩家可见",
    editableDotTitle: "公开：玩家可编辑",
    editableDotPlayerTitle: "你可以编辑",
    lockedBy: (name) => `${name} 正在编辑`,
    finishEditing: "完成",
    finishEditingTitle: "结束编辑：释放笔记，供其他人编辑",
    someone: "有人",
    editableSignedOut: "要编辑公开笔记，请先在设置中登录。",
    undoPlayerEdits: "撤销玩家的修改",
    undoPlayerEditsBusy: (name) => `${name} 正在编辑这篇笔记，请等对方完成后再试。`,
    settingsItemLinksLabel: "物件关联",
    itemLinksHint: "右键点击地图上的任意物件即可为其关联一篇笔记，之后可以直接从那里打开。关闭后该选项将从菜单中移除；已有的关联会保留。",
    itemLinksOnBtn: "开启",
    itemLinksOffBtn: "关闭",
    itemPickBanner: (name, more) => (more ? `为「${name}」选择笔记（+${more}）` : `为「${name}」选择笔记`),
    itemPickCancel: "取消",
    linkedItemsLabel: "已关联到：",
    connectionsTitle: "已关联的物件，以及链接到这篇笔记",
    linkedFrom: "被链接自",
    linkedItemSelect: "在地图上选中",
    linkedItemUnlink: "取消关联",
    itemNoteTrashed: (t) => `关联的笔记「${t}」在回收站中。要还原吗？`,
    itemNoteMissing: (name) => `关联到「${name}」的笔记不在这台设备上（已删除，或未同步）。要取消物件的关联吗？`,
    unnamedItem: "物件",
    settingsSecretLabel: "隐藏部分",
    secretEyeHint: "点击隐藏部分旁的小眼睛，会重新向玩家显示它。锁定后，小眼睛只起标记作用。",
    secretEyeClickBtn: "点击显示",
    secretEyeLockBtn: "已锁定",
    secretEyeShow: "向玩家显示",
    secretEyeLocked: "对玩家隐藏",
    settingsSharedLabel: "共享笔记",
    sharedKeyHint: "玩家通过房间中保存的密钥查看公开笔记。如果已离开房间的人仍持有密钥，重新生成即可：从那一刻起对方将无法再看到。房间内的玩家不会察觉任何变化。",
    regenerateKeyBtn: "重新生成密钥",
    regenerateKeyConfirm: "重新生成共享笔记密钥？持有旧密钥的人将无法再看到公开笔记。",
    regenerateKeyError: "重新生成密钥失败，请重试。",
    signOutPublicTitle: "你有公开笔记",
    signOutPublicHint: (n) => `退出登录后无法更新或下架：在你再次登录前，玩家会继续看到${n === 1 ? "你当前的公开笔记" : `你当前的 ${n} 篇公开笔记`}。`,
    signOutUnpublishBtn: (n) => (n === 1 ? "下架并退出登录" : "全部下架并退出登录"),
    signOutKeepBtn: (n) => (n === 1 ? "退出登录并保持可见" : "退出登录并保持可见"),
    sharedLoading: "正在加载共享笔记…",
    sharedEmpty: "GM 还没有共享任何笔记。",
    sharedLoadError: "加载共享笔记失败。请尝试关闭并重新打开 GM Notes。",
    exportFormatTitle: "导出格式",
    exportFormatHint: "Markdown 是纯文本，便于把笔记带到别处。JSON 完整保留所有内容，也是「导入」所期望的格式。",
    exportFormatJsonBtn: "JSON",
    exportFormatMdBtn: "Markdown",
    settingsCloudLabel: "云端同步",
    cloudSyncHint: "登录 Google 账号即可把笔记同步到你自己的账户，让它跟随你到其他设备。只有你能看到——登录不会向玩家或其他 GM 共享任何内容。",
    cloudSignInBtn: "使用 Google 登录",
    cloudSignOutBtn: "退出登录",
    cloudSyncNowBtn: "立即同步",
    cloudSignInError: "登录失败，请重试。",
    cloudSignedOutTitle: "未同步——请在设置中登录",
    cloudStatusTitle: (status) => ({
      synced: "已同步到云端",
      pending: "有更改待同步——点击立即同步",
      syncing: "同步中…",
      error: "同步失败——点击重试",
    })[status] || "云端同步",
    toolbar: {
      bold: "加粗 (Ctrl+B)", italic: "斜体 (Ctrl+I)", underline: "下划线 (Ctrl+U)", strike: "删除线",
      pill: "色丸", pillNone: "移除颜色", textColor: "文字颜色", textColorNone: "默认颜色",
      blockType: "块类型", paragraph: "正文", h1: "标题 1", h2: "标题 2", h3: "标题 3", toggle: "折叠块",
      quoteColor: "引用", quoteColorNone: "移除引用", divider: "分隔线",
      table: "表格", tableSize: (c, r) => `${c} 列 × ${r} 行`,
      tableOptions: "表格选项", tableRowAbove: "在上方插入行", tableRowBelow: "在下方插入行",
      tableColLeft: "在左侧插入列", tableColRight: "在右侧插入列",
      tableRowUp: "上移行", tableRowDown: "下移行", tableRowDrag: "拖动以移动行",
      tableColMoveLeft: "左移列", tableColMoveRight: "右移列", tableColDrag: "拖动以移动列",
      tableMove: "移动", tableWidths: "列宽",
      tableDeleteRow: "删除行", tableDeleteCol: "删除列",
      tableMergeRight: "与右侧单元格合并", tableMergeDown: "与下方单元格合并", tableSplit: "拆分单元格", tableDistribute: "均分列宽", tableFitContent: "适应内容", tableFitFrame: "适应边框",
      tableColor: "背景颜色", tableColorCell: "单元格", tableColorRow: "行", tableColorCol: "列", tableColorNone: "无颜色",
      tableHeaderRow: "表头行", tableHeaderCol: "表头列", tableDelete: "删除表格",
      listMenu: "列表", bulletList: "无序列表", checkList: "清单", numberList: "有序列表", outdent: "减少缩进",
      indent: "增加缩进", removeFormat: "清除格式",
      secret: "对玩家隐藏",
    },
  },
};

export function getStrings(language: Language): Strings {
  return STRINGS[language];
}
