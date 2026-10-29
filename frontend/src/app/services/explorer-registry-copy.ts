type Status = 'live' | 'unavailable' | 'checking';
const labels = {
  en: { live:'Live', unavailable:'Unavailable', checking:'Checking', statusChecking:'Status is being checked', lightningChecking:'Lightning status is checked independently of Bitcoin' },
  es: { live:'Activo', unavailable:'No disponible', checking:'Comprobando', statusChecking:'Se está comprobando el estado', lightningChecking:'El estado de Lightning se comprueba independientemente del de Bitcoin' },
  fr: { live:'En ligne', unavailable:'Indisponible', checking:'Vérification', statusChecking:'Vérification de l’état en cours', lightningChecking:'L’état de Lightning est vérifié indépendamment de celui de Bitcoin' },
  de: { live:'Online', unavailable:'Nicht verfügbar', checking:'Wird geprüft', statusChecking:'Status wird geprüft', lightningChecking:'Der Lightning-Status wird unabhängig von Bitcoin geprüft' },
  it: { live:'Online', unavailable:'Non disponibile', checking:'Verifica', statusChecking:'Verifica dello stato in corso', lightningChecking:'Lo stato di Lightning viene verificato indipendentemente da Bitcoin' },
};
function language(locale: string): keyof typeof labels {
  const code = locale?.toLowerCase().split(/[-_]/)[0];
  return code && Object.prototype.hasOwnProperty.call(labels, code) ? code as keyof typeof labels : 'en';
}
export function explorerStatusCopy(locale: string, status: Status, latency = '') {
  const words = labels[language(locale)];
  return { label: words[status], title: status === 'live' ? words.live + latency : status === 'unavailable' ? words.unavailable : words.statusChecking };
}
export function lightningStatusCopy(locale: string) {
  const words = labels[language(locale)];
  return {label: words.checking, title: words.lightningChecking};
}
/** Translate known generic icon descriptions; preserve brand names and custom text. */
export function explorerIconAlt(locale: string, source: string): string {
  const code = language(locale);
  if (code === 'en' || !source) return source;
  const match = source.match(/^(.+?) (logo|explorer)$/i);
  if (!match) return source;
  const [, name, kind] = match;
  return code === 'de' ? `${name}-${kind.toLowerCase() === 'logo' ? 'Logo' : 'Explorer'}`
    : kind.toLowerCase() === 'logo' ? `${code === 'it' ? 'Logo di' : 'Logo de'} ${name}`
    : code === 'fr' ? `Explorateur ${name}` : code === 'it' ? `Esploratore ${name}` : `Explorador de ${name}`;
}
/** Translate only recognized registry templates, never substitute guessed text. */
export function explorerSearchPlaceholder(locale: string, source: string): string {
  const code = language(locale);
  if (code === 'en') return source;
  const phrases: Record<string, Record<'es'|'fr'|'de'|'it', string>> = {
    'Wave a taxi, paste anything here.': { es:'Llama a un taxi, pega cualquier cosa aquí.', fr:'Appelez un taxi, collez quelque chose ici.', de:'Ruf ein Taxi, füge hier etwas ein.', it:'Chiama un taxi, incolla qui quello che vuoi.' },
    'Search a Bitcoin block, transaction, or address': { es:'Busca un bloque, una transacción o una dirección Bitcoin', fr:'Rechercher un bloc, une transaction ou une adresse Bitcoin', de:'Bitcoin-Block, -Transaktion oder -Adresse suchen', it:'Cerca un blocco, una transazione o un indirizzo Bitcoin' },
    'Search an Ethereum block, transaction, or address': { es:'Busca un bloque, una transacción o una dirección Ethereum', fr:'Rechercher un bloc, une transaction ou une adresse Ethereum', de:'Ethereum-Block, -Transaktion oder -Adresse suchen', it:'Cerca un blocco, una transazione o un indirizzo Ethereum' },
    'Search a Monero block height, block hash, or tx hash': { es:'Busca una altura o un hash de bloque, o un hash de transacción Monero', fr:'Rechercher une hauteur ou un hash de bloc, ou un hash de transaction Monero', de:'Monero-Blockhöhe, Block-Hash oder Transaktions-Hash suchen', it:'Cerca l’altezza o l’hash di un blocco oppure l’hash di una transazione Monero' },
    'Search a Lightning node or channel': { es:'Busca un nodo o canal Lightning', fr:'Rechercher un nœud ou un canal Lightning', de:'Lightning-Knoten oder -Kanal suchen', it:'Cerca un nodo o un canale Lightning' },
  };
  const translated = phrases[source];
  if (translated) return translated[code];
  return source;
}
export function genericSearchPlaceholder(locale: string, name: string): string {
  const code = language(locale);
  return code === 'es' ? `Buscar ${name}` : code === 'fr' ? `Rechercher ${name}` : code === 'de' ? `${name} suchen` : code === 'it' ? `Cerca ${name}` : `Search ${name}`;
}
