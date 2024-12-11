"use client";
import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { metaMaskWallet, trustWallet, injectedWallet, rainbowWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { mainnet, bsc, avalanche, polygon, optimism, arbitrum, sepolia, blast, zora, celo } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Define project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

// Define wallet list
const walletlist = [
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet, // Reference the function (not the result)
      trustWallet, // Reference the function (not the result)
      walletConnectWallet
    ]
  },
  {
    groupName: 'Popular',
    wallets: [
      coinbaseWallet, // Reference the function (not the result)
      injectedWallet, // Reference the function (not the result)
      rainbowWallet, // Reference the function (not the result)
    ]
  }
];

// Define config for RainbowKit and Wagmi
const config = getDefaultConfig({
  appName: "Trial",
  projectId,
  chains: [mainnet, sepolia, bsc, avalanche, polygon, optimism, arbitrum, blast, zora],
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
