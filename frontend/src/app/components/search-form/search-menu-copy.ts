/** Copy shared by the Bitcoin and Lightning explorer switchers. */
const copy = {
  en: {
    choose: 'Choose search chain', selectedAria: 'Selected explorer', selected: 'SELECTED',
    unavailable: 'Explorer registry unavailable', loading: 'Loading explorers', automatic: 'Automatic Routing',
    viewHub: 'View Hub', hint: 'Or go straight to', searchExample: '[your search]',
    native: 'NATIVE EXPLORERS', external: '3RD-PARTY EXPLORERS', opened: 'Opened',
    open: 'Open', switch: 'Switch', found: 'Found', possible: 'Possible', search: 'Search',
    additional: (name: string) => `${name} additional explorers`,
    openExplorer: (name: string) => `Open ${name}`,
    openNewTab: (name: string) => `Open ${name} in a new tab`,
    switchTo: (name: string) => `Switch to ${name}`,
    additionalOptions: (name: string, count: number, expanded: boolean) => `${expanded ? 'Hide' : 'Show'} ${count} additional ${name} ${count === 1 ? 'option' : 'options'}`,
  },
  es: {
    choose: 'Elegir cadena de búsqueda', selectedAria: 'Explorador seleccionado', selected: 'SELECCIONADO',
    unavailable: 'Registro de exploradores no disponible', loading: 'Cargando exploradores', automatic: 'Enrutamiento automático',
    viewHub: 'Ver inicio', hint: 'O ve directamente a', searchExample: '[tu búsqueda]',
    native: 'EXPLORADORES NATIVOS', external: 'EXPLORADORES EXTERNOS', opened: 'Abierto',
    open: 'Abrir', switch: 'Cambiar', found: 'Encontrado', possible: 'Posible', search: 'Buscar',
    additional: (name: string) => `Otros exploradores de ${name}`,
    openExplorer: (name: string) => `Abrir ${name}`,
    openNewTab: (name: string) => `Abrir ${name} en una pestaña nueva`,
    switchTo: (name: string) => `Cambiar a ${name}`,
    additionalOptions: (name: string, count: number, expanded: boolean) => `${expanded ? 'Ocultar' : 'Mostrar'} ${count} ${count === 1 ? 'opción adicional' : 'opciones adicionales'} de ${name}`,
  },
  fr: {
    choose: 'Choisir la blockchain à explorer', selectedAria: 'Explorateur sélectionné', selected: 'SÉLECTIONNÉ',
    unavailable: 'Registre des explorateurs indisponible', loading: 'Chargement des explorateurs', automatic: 'Routage automatique',
    viewHub: 'Voir l’accueil', hint: 'Ou accédez directement à', searchExample: '[votre recherche]',
    native: 'EXPLORATEURS NATIFS', external: 'EXPLORATEURS TIERS', opened: 'Ouvert',
    open: 'Ouvrir', switch: 'Changer', found: 'Trouvé', possible: 'Possible', search: 'Rechercher',
    additional: (name: string) => `Autres explorateurs de ${name}`,
    openExplorer: (name: string) => `Ouvrir ${name}`,
    openNewTab: (name: string) => `Ouvrir ${name} dans un nouvel onglet`,
    switchTo: (name: string) => `Passer à ${name}`,
    additionalOptions: (name: string, count: number, expanded: boolean) => `${expanded ? 'Masquer' : 'Afficher'} ${count} ${count === 1 ? 'option supplémentaire' : 'options supplémentaires'} pour ${name}`,
  },
  de: {
    choose: 'Blockchain für die Suche auswählen', selectedAria: 'Ausgewählter Explorer', selected: 'AUSGEWÄHLT',
    unavailable: 'Explorer-Verzeichnis nicht verfügbar', loading: 'Explorer werden geladen', automatic: 'Automatische Weiterleitung',
    viewHub: 'Zur Startseite', hint: 'Oder direkt zu', searchExample: '[deine Suche]',
    native: 'NATIVE EXPLORER', external: 'EXPLORER VON DRITTANBIETERN', opened: 'Geöffnet',
    open: 'Öffnen', switch: 'Wechseln', found: 'Gefunden', possible: 'Möglich', search: 'Suchen',
    additional: (name: string) => `Weitere Explorer für ${name}`,
    openExplorer: (name: string) => `${name} öffnen`,
    openNewTab: (name: string) => `${name} in einem neuen Tab öffnen`,
    switchTo: (name: string) => `Zu ${name} wechseln`,
    additionalOptions: (name: string, count: number, expanded: boolean) => `${count} weitere ${count === 1 ? 'Option' : 'Optionen'} für ${name} ${expanded ? 'ausblenden' : 'anzeigen'}`,
  },
};

export function searchMenuCopy(locale: string) {
  const language = locale?.toLowerCase().split(/[-_]/)[0];
  return copy[language as keyof typeof copy] || copy.en;
}
