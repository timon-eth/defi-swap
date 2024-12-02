export interface Token {
  chain: string;
  address: string;  // Token contract address
  symbol: string;   // Token symbol (e.g., ETH, USDT)
  name: string;     // Full name of the token
  decimals: number; // Number of decimals (for token math)
  project: {
    id: string,
    isSpam: boolean,
    logoUrl: string
  },
  market: {
    price: {
      value: number,
    }
    pricePercentChange: {
      value: number,
    }
    volume24H: {
      value: number
    }
  }
}

export interface Transaction {
  hash: string;     // Transaction hash
  timestamp: number; // Transaction timestamp
  status: 'pending' | 'success' | 'failed'; // Transaction status
}

export interface Route {
  path: string[];   // Path of token addresses for the swap route
  priceImpact: string; // Price impact in percentage
  estimatedGas: string; // Gas estimate for the transaction
}

export interface AppState {
  wallet: {
    address: string;
    balance: string;
    network: string;
    transactions: Transaction[];
  };
  swap: {
    tokenIn: Token;
    tokenOut: Token;
    amount: string;
    route: Route;
    price: string;
  };
  tokens: {
    popularTokens: Token[];
    userTokens: Token[];
    searchTokens: Token[],
  };
}

export interface TokensState {
  popularTokens: Token[];
  userTokens: Token[];
  searchTokens: Token[];
}

export type NetworkKey = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'bnb' | 'blast' | 'avalanche' | 'celo' | 'worldchain' | 'zora' | 'zksync';

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
};

export const networks = [
  { key: 'ethereum', label: 'All Ethereum', image: networkImages.ethereum },
  { key: 'polygon', label: 'Polygon', image: networkImages.polygon },
  { key: 'arbitrum', label: 'Arbitrium', image: networkImages.arbitrum },
  { key: 'optimism', label: 'Optimism', image: networkImages.optimism },
  { key: 'base', label: 'Base', image: networkImages.base },
  { key: 'bnb', label: 'BNB Chain', image: networkImages.bnb },
  { key: 'blast', label: 'Blast', image: networkImages.blast },
  { key: 'avalanche', label: 'Avalanche', image: networkImages.avalanche },
  { key: 'celo', label: 'Celo', image: networkImages.celo },
  { key: 'worldchain', label: 'World Chain', image: networkImages.worldchain },
  { key: 'zora', label: 'Zora Network', image: networkImages.zora },
];