'use client'

import React, { useState, useEffect } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Token } from '@/types';
import { ArrowDown, ArrowUp, Star } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

const TokenSearch = () => {
  const { tokens, setTokens } = useSwapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchPopularTokens() {
    setLoading(true);
    try {
      const res = await fetch("/api/tokens/fetchPopularTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "TrendingTokens",
          chain: "ETHEREUM",
        }),
      })


      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const { data } = await res.json();
      setTokens({ popularTokens: data, searchTokens: [], userTokens: [] });
    } catch (error) {
      console.error('Error fetching Popular tokens:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSearchTokens() {
    setLoading(true);
    try {
      const res = await fetch("/api/tokens/fetchSearchTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery
        }),
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const { data } = await res.json();
      setTokens({ popularTokens: [], searchTokens: data, userTokens: [] });
    } catch (error) {
      console.error('Error fetching Popular tokens:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      if (searchQuery === "") {
        fetchPopularTokens();
      } else {
        fetchSearchTokens();
      }
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);  // Clear the timer when the component unmounts
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (isFocused) {
      if (searchQuery === "") {
        fetchPopularTokens();
      } else {
        fetchSearchTokens();
      }
    }
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className='fixed z-10 top-12 w-[350px] sm:w-[400px]'>
      <Input
        className='my-2 w-full'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleFocus} // Trigger fetching on focus
        onBlur={handleBlur} // Optional: reset focus on blur
        placeholder="Search for a token"
      />
      {isFocused &&
        <>
          {tokens.searchTokens.length > 0 && <ScrollArea className='h-[400px] bg-neutral-700 bg-opacity-90 w-full px-4 py-2 rounded-md border'>
            <p className='text-stone-100 flex flex-row py-2'>
              <Star className='text-sm mr-1' />
              Search Tokens
            </p>
            <Separator className='bg-white'></Separator>
            {loading &&
              <div className="flex items-center space-x-4 pt-4 px-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[270px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
              </div>}
            {tokens.searchTokens.map((token) => (
              <div className='p-2 rounded-xl my-1 hover:bg-neutral-500 flex flex-row cursor-pointer' key={token.address}>
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
                <div className='flex flex-col ml-auto'>
                  <p className='ml-auto'>
                    <span className='mx-1'>$</span>
                    {token.market.price?.value ? token.market.price.value.toFixed(2) : '0'}
                  </p>
                  <p className='flex flex-row'>
                    {token.market.pricePercentChange?.value
                      ? token.market.pricePercentChange.value.toFixed(2)
                      : '0.00'}%
                    <span>
                      {token.market.pricePercentChange?.value > 0 ? (
                        <ArrowUp className='text-sm w-4 text-[#00f0ff]' />
                      ) : (
                        <ArrowDown className='text-sm w-4 text-[#00f0ff]' />
                      )}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>}
          {tokens.popularTokens.length > 0 && <ScrollArea className='h-[400px] bg-neutral-700 bg-opacity-90 w-full px-4 py-2 rounded-md border'>
            <p className='text-stone-100 flex flex-row py-2'>
              <Star className='text-sm mr-1' />
              Popular Tokens
            </p>
            <Separator className='bg-white'></Separator>
            {loading &&
              <div className="flex items-center space-x-4 px-2 pt-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[270px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
              </div>}
            {tokens.popularTokens.map((token) => (
              <div className='p-2 rounded-xl my-1 hover:bg-neutral-500 flex flex-row cursor-pointer' key={token.address}>
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
                <div className='flex flex-col ml-auto'>
                  <p className='ml-auto'>
                    <span className='mx-1'>$</span>
                    {token.market.price?.value ? token.market.price.value.toFixed(2) : '0'}
                  </p>
                  <p className='flex flex-row'>
                    {token.market.pricePercentChange?.value
                      ? token.market.pricePercentChange.value.toFixed(2)
                      : '0.00'}%
                    <span>
                      {token.market.pricePercentChange?.value > 0 ? (
                        <ArrowUp className='text-sm w-4 text-[#00f0ff]' />
                      ) : (
                        <ArrowDown className='text-sm w-4 text-[#00f0ff]' />
                      )}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>}
        </>
      }

    </div>
  );
};

export default TokenSearch;
