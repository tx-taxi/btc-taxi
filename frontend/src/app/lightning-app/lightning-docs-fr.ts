/** French Lightning FAQ labels and REST descriptions; protocol fields remain unchanged. */
export const frenchLightningFaqTitles: Record<string, string> = {
  'lightning-explore': 'Que puis-je explorer ?',
  'lightning-search': 'Comment trouver un nœud ou un canal ?',
  'lightning-capacity': 'Que signifie la capacité d’un canal ?',
  'lightning-fees': 'Que montrent les frais de routage ?',
  'lightning-payments': 'Puis-je voir un paiement Lightning ?',
  'lightning-locations': 'D’où viennent les emplacements des nœuds ?',
  'lightning-status': 'Que signifient l’état d’un canal et les pénalités ?',
  'lightning-freshness': 'À quel point les statistiques du réseau sont-elles récentes ?',
  'lightning-bitcoin': 'Pourquoi les transactions d’ouverture et de fermeture renvoient-elles vers Bitcoin ?',
};

export const frenchLightningFaqCategories: Record<string, string> = {
  lightning: 'Réseau Lightning',
  Lightning: 'Lightning',
  Search: 'Recherche',
  Channels: 'Canaux',
  Fees: 'Frais',
  Payments: 'Paiements',
  Maps: 'Cartes',
  Statistics: 'Statistiques',
  Bitcoin: 'Bitcoin',
};

/** Values are a title and description; callers add the GET prefix as in the source. */
export const frenchLightningRestDocs: Record<string, [string, string]> = {
  'get-lightning-network-stats': ['Statistiques du réseau', '<p>Renvoie les statistiques de l’ensemble du réseau, notamment le nombre total de canaux et de nœuds, la capacité totale ainsi que les frais moyens et médians.</p><p>Pour <code>:interval</code>, utilisez l’une de ces valeurs : <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>.</p>'],
  'get-lightning-nodes-channels': ['Nœuds et canaux', '<p>Renvoie les nœuds et canaux Lightning correspondant à la recherche textuelle <code>:query</code>, sans distinction de casse, dans les alias et clés publiques des nœuds ainsi que dans les identifiants de canal complets et courts.</p>'],
  'get-lightning-nodes-country': ['Nœuds par pays', '<p>Renvoie les nœuds Lightning du réseau public dans le pays demandé par <code>:country</code>, indiqué sous forme de code pays ISO alpha-2.</p>'],
  'get-country-node-stats': ['Statistiques des nœuds par pays', '<p>Renvoie la capacité agrégée et le nombre de nœuds du réseau public par pays. Les capacités sont exprimées en satoshis.</p>'],
  'get-isp-nodes': ['Nœuds par fournisseur', '<p>Renvoie les nœuds hébergés par le fournisseur <code>:isp</code>, indiqué par son ASN.</p>'],
  'get-isp-node-stats': ['Statistiques des nœuds par fournisseur', '<p>Renvoie la capacité agrégée ainsi que les nombres de nœuds et de canaux par fournisseur. Les capacités sont exprimées en satoshis.</p>'],
  'get-top-100-nodes': ['100 principaux nœuds', '<p>Renvoie deux listes des 100 principaux nœuds : l’une classée par liquidité (capacité agrégée des canaux) et l’autre par connectivité (nombre de canaux ouverts).</p>'],
  'get-top-100-nodes-liquidity': ['100 nœuds les plus liquides', '<p>Renvoie les 100 nœuds ayant la liquidité la plus élevée, mesurée par la capacité agrégée de leurs canaux.</p>'],
  'get-top-100-nodes-connectivity': ['100 nœuds les plus connectés', '<p>Renvoie les 100 nœuds ayant la connectivité la plus élevée, mesurée par leur nombre de canaux ouverts.</p>'],
  'get-top-100-oldest-nodes': ['100 nœuds les plus anciens', '<p>Renvoie les 100 nœuds les plus anciens.</p>'],
  'get-node-stats': ['Statistiques d’un nœud', '<p>Renvoie les détails du nœud ayant la clé publique <code>:pubKey</code> indiquée.</p>'],
  'get-historical-node-stats': ['Historique des statistiques d’un nœud', '<p>Renvoie les statistiques historiques du nœud ayant la clé publique <code>:pubKey</code> indiquée.</p>'],
  'get-channel': ['Canal', '<p>Renvoie les informations sur le canal Lightning ayant l’identifiant <code>:channelId</code> indiqué.</p>'],
  'get-channels-from-txid': ['Canaux par identifiant de transaction', '<p>Renvoie les canaux correspondant au <code>:txid</code> indiqué ; plusieurs identifiants de transaction peuvent être spécifiés.</p>'],
  'get-channels-from-pubkey': ['Canaux par clé publique de nœud', '<p>Renvoie les canaux du nœud identifié par <code>:pubKey</code>. Dix canaux sont renvoyés par page ; utilisez <code>:index</code> pour parcourir les pages. <code>:channelStatus</code> peut valoir <code>open</code>, <code>active</code> ou <code>closed</code>.</p>'],
  'get-channel-geodata': ['Données géographiques des canaux', '<p>Renvoie une liste de canaux accompagnés des données géographiques de leurs nœuds.</p>'],
  'get-channel-geodata-node': ['Données géographiques des canaux d’un nœud', '<p>Renvoie les canaux et leurs données géographiques pour le nœud ayant la clé publique <code>:pubKey</code> indiquée.</p>'],
};
