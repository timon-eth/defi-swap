'use client'

import React, { use, useState, useEffect, useRef } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
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
import Image from 'next/image';

import AllNetImage from '@/public/images/swap/chains/all.png';
import EthNetImage from '@/public/images/swap/chains/eth.png';
import BscNetImage from '@/public/images/swap/chains/binance.png';
import OptiNetImage from '@/public/images/swap/chains/optimisim.png';
import BaseNetImage from '@/public/images/swap/chains/base.png';
import AvaxNetImage from '@/public/images/swap/chains/avalanche.png';
import PolNetImage from '@/public/images/swap/chains/polygon.png';
import ArbNetImage from '@/public/images/swap/chains/arbitrium.png';
import BlastNetImage from '@/public/images/swap/chains/blast.png';
import CeloNetImage from '@/public/images/swap/chains/celo.png';
import WorldNetImage from '@/public/images/swap/chains/world-chain.png';
import ZoraNetImage from '@/public/images/swap/chains/zora.png';
import ZksyncNetImage from '@/public/images/swap/chains/zksync.png';
import { Token } from '@/types';
const networkImages = {
  ethereum: AllNetImage,
  polygon: PolNetImage,
  arbitrum: ArbNetImage,
  optimism: OptiNetImage,
  base: BaseNetImage,
  bnb: BscNetImage,
  blast: BlastNetImage,
  avalanche: AvaxNetImage,
  celo: CeloNetImage,
  worldchain: WorldNetImage,
  zora: ZoraNetImage,
  zksync: ZksyncNetImage,
};

type props = {
  amount: string,
  tokenIn: Token | null,
  setAmount: (val: string) => void;
  setTokenIn: (val: Token) => void;
};

import { useAccount, useContractRead } from 'wagmi';
import { ethers } from 'ethers';

const tokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const TokenInSelection = ({ amount, tokenIn, setAmount, setTokenIn }: props) => {
  const { tokens, setTokens, setSwapTokens } = useSwapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { address } = useAccount();
  const { data: tokenBalance, isLoading, isError } = useContractRead({
    address: tokenIn?.address as `0x${string}`,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address], // Pass the wallet address as an argument to balanceOf
  });

  const { data: tokenDecimals } = useContractRead({
    address: tokenIn?.address as `0x${string}`,
    abi: tokenAbi,
    functionName: "decimals",
  });

  const formattedBalance = tokenBalance && tokenDecimals
    ? ethers.formatUnits(tokenBalance.toString(), tokenDecimals.toString()) // Ensure tokenBalance is a string or BigNumberish
    : "0";

  const [modal, setModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  type NetworkKey = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'bnb' | 'blast' | 'avalanche' | 'celo' | 'worldchain' | 'zora' | 'zksync';

  const [checkedValue, setCheckedValue] = useState<NetworkKey>('ethereum');

  async function fetchUserTokens() {
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
    })
    const { data } = await res.json();
    setTokens({ popularTokens: [], searchTokens: [], userTokens: data });
  }

  async function fetchSearchChainsTokens() {
    const res = await fetch("/api/tokens/fetchSearchChainsTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chains: [`${checkedValue.toUpperCase()}`],
        query: searchQuery
      }),
    })
    const { data } = await res.json();
    setTokens({ popularTokens: [], searchTokens: data, userTokens: [] });
  }

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
  return (
    <div className='flex flex-row bg-neutral-800 rounded-2xl p-4'>
      <input
        className='bg-neutral-800 text-white outline-none px-4 text-[50px] w-48 ml-auto'
        placeholder='0'
        value={amount}
        onChange={(e) => { setAmount(e.target.value) }}
      />
      <div className='flex flex-col'>
        <p className='my-2 text-stone-300 ml-auto'>Token In</p>
        <button
          onClick={() => setModal(true)}
          className='before:ease relative h-8 w-36 rounded-xl overflow-hidden bg-[#00f0ff] text-black transition-all before:absolute before:top-1/2 before:h-0 before:w-48 before:origin-center before:-translate-x-20 before:rotate-45 before:bg-[#2ccce4] before:duration-300 hover:sbg-[#2ccce4] hover:before:h-64 hover:before:-translate-y-32'
          style={{ boxShadow: "2px 2px 5px 1px #00f0ff" }}
        >
          <span className="relative z-10 flex flex-row mx-auto justify-center">
            {tokenIn?.project.logoUrl && <Image className='w-6 h-6 rounded-full mx-2' src={tokenIn?.project.logoUrl || ''} width={12} height={12} alt='main'></Image>}
            {tokenIn?.symbol || 'Select Token'}
            <ArrowRight className='w-3 mx-1' />
          </span>
        </button>
        <div className='flex flex-row mt-2'>
          <p className='text-[#00f0ff]'>Value: {formattedBalance}</p>
          <p className='ml-auto text-[#00f0ff]'>{tokenIn?.symbol}</p>
        </div>
      </div>

      <Dialog open={modal}>
        <DialogContent className='bg-neutral-700 bg-opacity-90' ref={modalRef}>
          <DialogHeader>
            <p className="text-[#00f0ff] text-xl">Select a token</p>
            <div className='flex flex-row p-1 rounded-xl bg-neutral-700'>
              <input
                className='my-2 w-4/5 my-auto outline-none border-none bg-neutral-700 bg-opacity-20 text-white px-2'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a token"
              />
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className='w-16 ml-auto rounded-xl bg-neutral-900 bg-opacity-50'
                  >
                    <span className='flex flex-row items-center'>
                      <Image className='w-6 h-6 rounded-full mr-1' src={networkImages[checkedValue]} alt={checkedValue}></Image>
                      <ChevronsUpDown className='text-sm mr-6' />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" ref={dropdownRef}>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'ethereum' && true}
                    onCheckedChange={() => setCheckedValue('ethereum')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={AllNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    All Ethereum
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'polygon' && true}
                    onCheckedChange={() => setCheckedValue('polygon')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={PolNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Polygon
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'arbitrum' && true}
                    onCheckedChange={() => setCheckedValue('arbitrum')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={ArbNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Arbitrium
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'optimism' && true}
                    onCheckedChange={() => setCheckedValue('optimism')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={OptiNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Optimism
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'base' && true}
                    onCheckedChange={() => setCheckedValue('base')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={BaseNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Base
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'bnb' && true}
                    onCheckedChange={() => setCheckedValue('bnb')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={BscNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    BNB Chain
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'blast' && true}
                    onCheckedChange={() => setCheckedValue('blast')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={BlastNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Blast
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'avalanche' && true}
                    onCheckedChange={() => setCheckedValue('avalanche')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={AvaxNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Avalanceh
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'celo' && true}
                    onCheckedChange={() => setCheckedValue('celo')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={CeloNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Celo
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'worldchain' && true}
                    onCheckedChange={() => setCheckedValue('worldchain')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={WorldNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    World Chain
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'zora' && true}
                    onCheckedChange={() => setCheckedValue('zora')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={ZoraNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Zora Network
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={checkedValue == 'zksync' && true}
                    onCheckedChange={() => setCheckedValue('zksync')}
                    className='flex flex-row cursor-pointer'
                  >
                    <Image src={ZksyncNetImage} className='w-8 h-8 mx-2' alt={checkedValue}></Image>
                    Zksync
                  </DropdownMenuCheckboxItem>
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
            {tokens.searchTokens.map((token) => (
              <div className='p-2 rounded-xl my-1 hover:bg-neutral-500 flex flex-row cursor-pointer' onClick={() => { setTokenIn(token); setModal(false) }} key={token.address}>
                {token.project.logoUrl ? (
                  <Image className='rounded-full mr-4' width={50} height={50} src={token.project.logoUrl} alt={token.name} />
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
              {tokens.userTokens.map((token: Token) => (
                <div className='p-2 rounded-xl my-1 hover:bg-neutral-500 flex flex-row cursor-pointer' onClick={() => { setTokenIn(token); setModal(false) }} key={token.address}>
                  {token.project.logoUrl ? (
                    <Image className='rounded-full mr-4' width={50} height={50} src={token.project.logoUrl} alt={token.name} />
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
