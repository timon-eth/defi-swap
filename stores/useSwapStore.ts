import { create } from 'zustand'
import { AppState, Token, Transaction, Route } from '@/types/index'; 

interface Store extends AppState {
  setWalletAddress: (address: string) => void;
  setWalletBalance: (balance: string) => void;
  setWalletNetwork: (network: string) => void;
  setTransactions: (transactions: Transaction[]) => void;

  setSwapTokenIn: (tokenIn: Token) => void;
  setSwapTokenOut: (tokenOut: Token) => void;
  setSwapAmount: (amount: string) => void;
  setSwapRoute: (route: Route) => void;
  setSwapPrice: (price: string) => void;

  setPopularTokens: (tokens: Token[]) => void;
  setUserTokens: (tokens: Token[]) => void;
}

export const useSwapStore = create<Store>((set) => ({
  wallet: {
    address: '',
    balance: '0',
    network: 'Ethereum', // Default network (could be dynamic)
    transactions: [],
  },
  swap: {
    tokenIn: { address: '', symbol: '', name: '', decimals: 18 },
    tokenOut: { address: '', symbol: '', name: '', decimals: 18 },
    amount: '0',
    route: { path: [], priceImpact: '', estimatedGas: '' },
    price: '0',
  },
  tokens: {
    popularTokens: [], // Could be fetched from an API or static data
    userTokens: [],
  },

  // Setters
  setWalletAddress: (address: string) => set((state) => ({ wallet: { ...state.wallet, address } })),
  setWalletBalance: (balance: string) => set((state) => ({ wallet: { ...state.wallet, balance } })),
  setWalletNetwork: (network: string) => set((state) => ({ wallet: { ...state.wallet, network } })),
  setTransactions: (transactions: Transaction[]) => set((state) => ({ wallet: { ...state.wallet, transactions } })),

  setSwapTokenIn: (tokenIn: Token) => set((state) => ({ swap: { ...state.swap, tokenIn } })),
  setSwapTokenOut: (tokenOut: Token) => set((state) => ({ swap: { ...state.swap, tokenOut } })),
  setSwapAmount: (amount: string) => set((state) => ({ swap: { ...state.swap, amount } })),
  setSwapRoute: (route: Route) => set((state) => ({ swap: { ...state.swap, route } })),
  setSwapPrice: (price: string) => set((state) => ({ swap: { ...state.swap, price } })),

  setPopularTokens: (tokens: Token[]) => set((state) => ({ tokens: { ...state.tokens, popularTokens: tokens } })),
  setUserTokens: (tokens: Token[]) => set((state) => ({ tokens: { ...state.tokens, userTokens: tokens } })),
}));
