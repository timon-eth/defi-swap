import { create } from 'zustand';
import { AppState, Token, Transaction, Route } from '@/types';

// Define the store interface
interface Store extends AppState {
  setWallet: (address: string, balance: string, network: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setTokens: (tokens: Token[]) => void;
  setSwapTokens: (tokenIn: Token, tokenOut: Token, amount: string) => void;
  setRoute: (route: Route) => void;
  setPrice: (price: string) => void;
}

// Create the Zustand store
export const useSwapStore = create<Store>((set) => ({
  wallet: {
    address: '',
    balance: '0',
    network: 'Ethereum', // Default network, could be dynamically set based on user's choice
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
    popularTokens: [], // Can be populated from an API or static data
    userTokens: [],
  },

  // Setters
  setWallet: (address: string, balance: string, network: string) =>
    set((state) => ({
      wallet: { ...state.wallet, address, balance, network },
    })),

  setTransactions: (transactions: Transaction[]) =>
    set((state) => ({
      wallet: { ...state.wallet, transactions },
    })),

  setTokens: (tokens: Token[]) =>
    set((state) => ({
      tokens: { ...state.tokens, popularTokens: tokens }, // Directly update the tokens state
    })),

  setSwapTokens: (tokenIn: Token, tokenOut: Token, amount: string) =>
    set((state) => ({
      swap: { ...state.swap, tokenIn, tokenOut, amount },
    })),

  setRoute: (route: Route) =>
    set((state) => ({
      swap: { ...state.swap, route },
    })),

  setPrice: (price: string) =>
    set((state) => ({
      swap: { ...state.swap, price },
    })),
}));
