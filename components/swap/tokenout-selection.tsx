'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useSwapStore } from '@/stores/useSwapStore';
import { useTokenData } from '@/hooks/useTokenData';
import { Token } from '@/types';
import { NetworkKey, networkImages, networks } from '@/types/chain';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronsUpDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useBalance } from 'wagmi';

type props = {
  outAmount: string,
  tokenOut: Token | null,
  setOutAmount: (val: string) => void;
  setTokenOut: (val: Token) => void;
};

const TokenInSelection = ({ outAmount, tokenOut, setOutAmount, setTokenOut }: props) => {
  const { tokens, setTokens } = useSwapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { address, chainId } = useAccount();
  const { formattedBalance } = useTokenData(tokenOut?.address || '', address || '');
  const { data: balance } = useBalance({
    address, chainId
  });

  const [modal, setModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [testmode, setTestmode] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [checkedValue, setCheckedValue] = useState<NetworkKey>('ethereum');
  const [loading, setLoading] = useState(false);

  async function fetchUserTokens() {
    setLoading(true);
    try {
      const res = await fetch("/api/tokens/fetchUserTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "TopTokens",
          chain: `${checkedValue.toUpperCase()}`,
          orderBy: "POPULARITY"
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const { data } = await res.json();
      setTokens({ popularTokens: [], searchTokens: [], userTokens: data });
    } catch (error) {
      console.error('Error fetching user tokens:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSearchChainsTokens() {
    setLoading(true);
    try {
      const res = await fetch("/api/tokens/fetchSearchChainsTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chains: [`${checkedValue.toUpperCase()}`],
          query: searchQuery
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const { data } = await res.json();
      setTokens({ popularTokens: [], searchTokens: data, userTokens: [] });
    } catch (error) {
      console.error('Error fetching search chains tokens:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chainId == 11155111) {
      setTestmode(true);
      setCheckedValue('ethereum_sepolia');
    }
  }, [chainId])

  useEffect(() => {
    if (modal) {
      fetchUserTokens();
    }
  }, [modal, checkedValue]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        fetchSearchChainsTokens();
      }
      else {
        fetchUserTokens();
      }
    }, 500);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);  // Clear timer on cleanup
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (modalRef.current && modalRef.current.contains(event.target as Node)) ||
        (dropdownRef.current && dropdownRef.current.contains(event.target as Node))
      ) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      else {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setModal(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTokenSelection = (token: Token) => {
    setTokenOut(token);

    const network = networks.find((network) => network.key === checkedValue);
    if (network) {
      setTokenOut({
        ...token,  // Retain other properties of token
        chain: network.id,  // Update the chain to the corresponding network id
      });
    }

    setModal(false);
  };
  return (
    <div className='flex flex-row bg-neutral-800 rounded-2xl p-4'>
      <input
        className='bg-neutral-800 text-white outline-none pl-2 text-[50px] w-48 ml-auto'
        placeholder='0'
        value={outAmount}
        onChange={(e) => {
          const value = e.target.value;
          // Only update the state if the value is a valid number (including empty string)
          if (/^\d*\.?\d*$/.test(value)) {
            setOutAmount(value);
          }
        }}
      />
      <div className='flex flex-col'>
        <p className='my-2 text-stone-300 ml-auto'>Token Out</p>
        <button
          onClick={() => setModal(true)}
          className='before:ease relative h-8 w-36 rounded-xl overflow-hidden bg-[#00f0ff] text-black transition-all before:absolute before:top-1/2 before:h-0 before:w-48 before:origin-center before:-translate-x-20 before:rotate-45 before:bg-[#2ccce4] before:duration-300 hover:sbg-[#2ccce4] hover:before:h-64 hover:before:-translate-y-32'
          style={{ boxShadow: "2px 2px 5px 1px #00f0ff" }}
        >
          <span className="relative z-10 flex flex-row mx-auto justify-center">
            {tokenOut?.project.logoUrl ?
              <Image className='w-6 h-6 rounded-full mx-2' src={tokenOut?.project.logoUrl.replace("ipfs://", "https://ipfs.io/ipfs/") || ''} width={12} height={12} alt='main'></Image>
              : tokenOut?.symbol && <div className='rounded-full w-6 h-6 bg-stone-300 mx-2'>{tokenOut?.symbol.slice(0, 1)}</div>}
            {tokenOut?.symbol || 'Select Token'}
            <ArrowRight className='w-3 mx-1' />
          </span>
        </button>
        {
          tokenOut?.symbol == 'ETH' ?
            <p className='text-stone-300 ml-auto my-1'>
              {parseFloat(balance?.formatted || '0').toFixed(3)}
              <span className='text-[#00f0ff] mx-2'>
                ETH
              </span>
            </p>
            : tokenOut?.symbol && <p className='text-stone-300 ml-auto my-1'>
              {parseFloat(formattedBalance).toFixed(3)}
              <span className='text-[#00f0ff] mx-2'>
                {tokenOut?.symbol}
              </span>
            </p>
        }
      </div>

      <Dialog open={modal}>
        <DialogContent className='bg-neutral-700 bg-opacity-90 w-[400px]' ref={modalRef}>
          <DialogHeader>
            <DialogTitle><p className="text-[#00f0ff] text-xl">Select a token</p></DialogTitle>
            <div className='flex flex-row p-1 rounded-xl bg-neutral-700'>
              <input
                className='my-2 w-4/5 my-auto outline-none border-none bg-neutral-700 bg-opacity-20 text-white px-2'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a token"
              />
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-16 ml-auto rounded-xl bg-neutral-900 bg-opacity-50">
                    <span className="flex flex-row items-center">
                      <Image className="rounded-full mr-1" width={20} height={20} src={networkImages[checkedValue]} alt={checkedValue} />
                      <ChevronsUpDown className="text-sm mr-6" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" ref={dropdownRef}>
                  {testmode ?
                    <>
                      <DropdownMenuCheckboxItem
                        key='ethereum_sepolia'
                        checked={checkedValue === 'ethereum_sepolia'}
                        onCheckedChange={() => setCheckedValue('ethereum_sepolia')}
                        className="flex flex-row cursor-pointer"
                      >
                        <Image src={networkImages.ethereum_sepolia} className="mx-2" width={20} height={20} alt={'ethereum_sepolia'} />
                        Sepolia
                      </DropdownMenuCheckboxItem>
                    </> :
                    <>
                      {networks.map((network) => (
                        <DropdownMenuCheckboxItem
                          key={network.key}
                          checked={checkedValue === network.key}
                          onCheckedChange={() => setCheckedValue(network.key as NetworkKey)}
                          className="flex flex-row cursor-pointer"
                        >
                          <Image src={network.image} className="mx-2" width={20} height={20} alt={network.key} />
                          {network.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogHeader>
          <DialogDescription>
            Tokens
          </DialogDescription>
          {searchQuery != "" ? <ScrollArea className='h-[400px] bg-neutral-700 bg-opacity-90 w-full px-4 py-2 rounded-md border'>
            <p className='text-stone-100 flex flex-row py-2'>
              Search Tokens
            </p>
            {loading &&
              <div className="flex items-center space-x-4 px-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[220px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>}
            {tokens.searchTokens.map((token) => (
              <div className='p-2 rounded-xl my-1 hover:bg-neutral-500 flex flex-row cursor-pointer' onClick={() => { handleTokenSelection(token) }} key={token.address}>
                {token.project.logoUrl ? (
                  <Image className='rounded-full mr-4' width={50} height={50} src={token.project.logoUrl.replace("ipfs://", "https://ipfs.io/ipfs/")} alt={token.name} />
                ) : (
                  <div className='w-[50px] h-[50px] bg-white rounded-full mr-4 text-center items-center text-black py-3'>
                    {token.name.substring(0, 3).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className='text-md'>{token.name}</p>
                  <p className='text-sm'>{token.symbol}</p>
                </div>
              </div>
            ))}
          </ScrollArea> :
            <ScrollArea className='h-[400px] bg-neutral-700 bg-opacity-90 w-full px-4 py-2 rounded-md border'>
              <p className='text-stone-100 flex flex-row py-2'>
                Tokens
              </p>
              {loading &&
                <div className="flex items-center space-x-4 px-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[220px]" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                </div>}
              {tokens.userTokens.map((token: Token) => (
                <div className='p-2 rounded-xl my-1 hover:bg-neutral-500 flex flex-row cursor-pointer' onClick={() => { handleTokenSelection(token) }} key={token.address}>
                  {token.project.logoUrl ? (
                    <Image className='rounded-full mr-4' width={50} height={50} src={token.project.logoUrl.replace("ipfs://", "https://ipfs.io/ipfs/")} alt={token.name} />
                  ) : (
                    <div className='w-[50px] h-[50px] bg-white rounded-full mr-4 text-center items-center text-black py-3'>
                      {token.name.substring(0, 3).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className='text-md'>{token.name}</p>
                    <p className='text-sm'>{token.symbol}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          }
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default TokenInSelection;
