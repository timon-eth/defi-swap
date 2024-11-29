'use client'

import React, { useEffect } from 'react';
import { useSwapStore } from '@/stores/useSwapStore'; // Import the Zustand store

const TokenSwapComponent = () => {
  // Access state and setters from the store
  const { wallet, swap, tokens, setWalletAddress, setWalletBalance, setSwapAmount } = useSwapStore();

  useEffect(() => {
    // Example of setting wallet information
    setWalletAddress('0x1234...abcd'); // Set the wallet address (could come from a wallet provider)
    setWalletBalance('100.5'); // Set wallet balance (could come from a blockchain API)
  }, [setWalletAddress, setWalletBalance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwapAmount(e.target.value); // Update the swap amount in the store
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
