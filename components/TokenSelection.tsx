'use client'

import React, { use, useState } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
import { Token } from '@/types';
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useAccount,
  useBalance,
  useChains
} from "wagmi";
import SearchContent from './SearchContent';
import { ScrollArea } from "@/components/ui/scroll-area";

const TokenSelection = () => {
  const { tokens, setSwapTokens } = useSwapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amount, setAmount] = useState('');
  const [modal, setModal] = useState<boolean>(false);

  const handleCustomTokenAdd = () => {
    const customToken: Token = {
      address: customTokenAddress,
      symbol: 'Custom',
      name: 'Custom Token',
      decimals: 18,
    };
    setSwapTokens(customToken, customToken, amount);
  };

  return (
    <div className='sm:w-[400px]'>
      <Input
        className='my-2'
        value={customTokenAddress}
        onChange={(e) => setCustomTokenAddress(e.target.value)}
        placeholder="Enter custom token address"
      />
      <button
        className="before:ease relative h-8 w-48 rounded-xl md:w-44 overflow-hidden bg-[#00f0ff] text-black transition-all before:absolute before:top-1/2 before:h-0 before:w-64 before:origin-center before:-translate-x-20 before:rotate-45 before:bg-[#10e4f1] before:duration-300 hover:sbg-[#10e4f1] hover:before:h-64 hover:before:-translate-y-32"
        style={{ boxShadow: "2px 2px 5px 1px #00f0ff" }}
        onClick={() => setModal(true)}
      >
        <span className="relative z-10">Add Custom Token</span>
      </button>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <AlertDialog open={modal} onOpenChange={() => setModal(false)}>
            <AlertDialogContent className="bg-none">
              <AlertDialogHeader>
                <p className="text-[#00f0ff] text-xl">Select a token</p>
                <AlertDialogDescription>
                  Please set wallet
                </AlertDialogDescription>
              </AlertDialogHeader>
              <ScrollArea className='h-[450px] w-full px-4'>
                {tokens.popularTokens.map((token) => (
                  <div className='bg-stone-200 py-2 px-4 rounded-xl my-1' key={token.address}>
                    <p className='text-xl'>{token.name}</p>
                    <p className='text-sm'>{token.symbol}</p>
                  </div>
                ))}
              </ScrollArea>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setModal(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default TokenSelection;
