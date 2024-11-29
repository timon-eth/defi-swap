'use client'

import React, { useEffect } from 'react';
import { useSwapStore } from '@/stores/useSwapStore'; // Import the Zustand store
import {
  useAccount,
  useBalance,
  useChainId
} from "wagmi";

const TokenSwapComponent = () => {
  // Access state and setters from the store
  const { wallet, swap, setWallet} = useSwapStore();
  const { address, isConnected } = useAccount();
  const fallbackChainId = useChainId();
  const { data: balance } = useBalance({
    address,
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallet(`0x${address}`, `${balance?.value}`, e.target.value);
  };

  return (
    <div>
      <h1>Token Swap</h1>
      <p>Wallet Address: {wallet.address}</p>
      <p>Wallet Balance: {wallet.balance} ETH</p>

      <input
        type="number"
        value={swap.amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
      />

      <p>Swap Price: {swap.price}</p>
      <p>Token In: {swap.tokenIn.symbol}</p>
      <p>Token Out: {swap.tokenOut.symbol}</p>
    </div>
  );
};

export default TokenSwapComponent;
