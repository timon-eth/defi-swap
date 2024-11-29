"use client";
import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { metaMaskWallet, trustWallet, injectedWallet, rainbowWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Define project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

// Define the available chains
const chains = [mainnet, sepolia];

// Define wallet list
const walletlist = [
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet, 
      walletConnectWallet
    ]
  },
  {
    groupName: 'Popular',
    wallets: [
      coinbaseWallet, 
      injectedWallet, 
      rainbowWallet, 
      trustWallet, 
    ]
  }
];

// Define config for RainbowKit and Wagmi
const config = getDefaultConfig({
  appName: "Trial",
  projectId,
  chains: [mainnet, sepolia],
  ssr: true,
  wallets: walletlist,
});

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
