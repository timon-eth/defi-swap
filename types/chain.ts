
export type NetworkKey = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'bnb' | 'blast' | 'avalanche' | 'celo' | 'worldchain' | 'zora' | 'zksync' | 'ethereum_sepolia';

export const networkImages: Record<NetworkKey, string> = {
  ethereum: '/images/swap/chains/all.png',
  polygon: '/images/swap/chains/polygon.png',
  arbitrum: '/images/swap/chains/arbitrium.png',
  optimism: '/images/swap/chains/optimisim.png',
  base: '/images/swap/chains/base.png',
  bnb: '/images/swap/chains/binance.png',
  avalanche: '/images/swap/chains/avalanche.png',
  celo: '/images/swap/chains/celo.png',
  zora: '/images/swap/chains/zora.png',
  zksync: '/images/swap/chains/zksync.png',
  blast: '/images/swap/chains/blast.png',
  worldchain: '/images/swap/chains/world-chain.png',
  ethereum_sepolia: '/images/swap/chains/eth.png'
};

export const networks = [
  { key: 'ethereum', label: 'All Ethereum', image: networkImages.ethereum, id: 1 },
  { key: 'polygon', label: 'Polygon', image: networkImages.polygon, id: 137 },
  { key: 'arbitrum', label: 'Arbitrium', image: networkImages.arbitrum, id: 42161  },
  { key: 'optimism', label: 'Optimism', image: networkImages.optimism, id: 10 },
  { key: 'base', label: 'Base', image: networkImages.base, id: 8453 },
  { key: 'bnb', label: 'BNB Chain', image: networkImages.bnb, id: 56 },
  { key: 'blast', label: 'Blast', image: networkImages.blast, id: 43113 },
  { key: 'avalanche', label: 'Avalanche', image: networkImages.avalanche, id: 43114 },
  { key: 'celo', label: 'Celo', image: networkImages.celo, id: 42220 },
  { key: 'worldchain', label: 'World Chain', image: networkImages.worldchain, id: 1 },
  { key: 'zora', label: 'Zora Network', image: networkImages.zora, id: 1 },
  { key: 'ethereum_sepolia', label: 'Sepolia', image: networkImages.ethereum_sepolia, id: 11155111 },
];