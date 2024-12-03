import { create } from 'zustand';
import { AppState, Token, Transaction, Route, TokensState } from '@/types';

// Define the store interface
interface Store extends AppState {
  setWallet: (address: string, balance: string, network: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setTokens: (tokens: TokensState) => void;
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
    tokenIn: { chain: 1, address: '', symbol: '', name: '', decimals: 18, project: { id: '', isSpam: false, logoUrl: '' }, market: { price: { value: 0 }, pricePercentChange: { value: 0 }, volume24H: { value: 0 } } },
    tokenOut: { chain: 1, address: '', symbol: '', name: '', decimals: 18, project: { id: '', isSpam: false, logoUrl: '' }, market: { price: { value: 0 }, pricePercentChange: { value: 0 }, volume24H: { value: 0 } } },
    amount: '0',
    route: { path: [], priceImpact: '', estimatedGas: '' },
    price: '0',
  },
  tokens: {
    popularTokens: [], // Can be populated from an API or static data
    searchTokens: [],
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

  setTokens: (tokens: TokensState) =>
    set((state) => ({
      tokens: { ...state.tokens, ...tokens }, // Spread the new tokens object to merge with current state
    })),

  setSwapTokens: (tokenIn: Token, tokenOut: Token, amount: string) =>
    set((state) => ({
      swap: { ...state.swap, tokenIn, tokenOut, amount: parseFloat(amount).toString() }, // Convert amount to a number, if needed
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
