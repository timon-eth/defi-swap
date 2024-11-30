'use client'

import React, { useState, useEffect } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Token } from '@/types';

const TokenSearch = () => {
  const { tokens, setTokens } = useSwapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  async function fetchTokens() {
    const res = await fetch("/api/fetchPopularTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "TopTokens",
        chain: "ETHEREUM",
        orderBy: "POPULARITY"
      }),
    })
    const { data } = await res.json();
    setTokens(data);
  }

  async function fetchSearchTokens() {
    const res = await fetch("/api/fetchSearchTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery
      }),
    })
    const { data } = await res.json();
    setTokens(data);
  }

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      if(searchQuery == ""){
        fetchTokens();
      }
      else{
        fetchSearchTokens();
      }
    }, 500);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchQuery]); 

  useEffect(() => {
    if (isFocused) {
      fetchTokens();
    }
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className='sm:w-[400px]'>
      <Input
        className='my-2 w-full'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleFocus} // Trigger fetching on focus
        onBlur={handleBlur} // Optional: reset focus on blur
        placeholder="Search for a token"
      />
      {isFocused && <ScrollArea className='h-[400px] w-full rounded-md border p-2'>
        {tokens.popularTokens.map((token) => (
          <div className='bg-stone-200 p-2 rounded-xl my-1' key={token.address}>
            <p className='text-xl'>{token.name}</p>
            <p className='text-sm'>{token.symbol}</p>
          </div>
        ))}
      </ScrollArea>}
    </div>
  );
};

export default TokenSearch;
