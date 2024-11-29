export interface Token {
  address: string;  // Token contract address
  symbol: string;   // Token symbol (e.g., ETH, USDT)
  name: string;     // Full name of the token
  decimals: number; // Number of decimals (for token math)
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
  };
}