'use client'

import React, { useState, useEffect } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
import { Input } from "@/components/ui/input";
import useFetchTokens from '@/hooks/useFetchTokens';
import { Token } from '@/types';

const TokenSearch = () => {
  const { tokens, setTokens } = useSwapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  async function fetchTokens() {
    const res = await fetch("/api/fetchTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: ""
      }),
    })
    const { data } = await res.json();
    console.log(data);
  }
  // Trigger token fetch when input is focused
  useEffect(() => {
    if (isFocused) {
      // useFetchTokens(); // Fetch tokens when focused
      fetchTokens();
    }
  }, [isFocused]); // Run when isFocused state changes

  // Filter tokens based on the search query
  useEffect(() => {
    const filtered = tokens.popularTokens.filter((token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchQuery, tokens.popularTokens]); // Re-run when searchQuery or popularTokens change

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true); // Set focus state to true
  };

  // Handle input blur (optional, reset focus state if needed)
  const handleBlur = () => {
    setIsFocused(false); // Reset focus state when input loses focus
  };

  return (
    <div>
      <Input
        className='my-2'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleFocus} // Trigger fetching on focus
        onBlur={handleBlur} // Optional: reset focus on blur
        placeholder="Search for a token"
      />
      <div>
        {filteredTokens.map((token) => (
          <div key={token.address}>
            {token.symbol}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenSearch;
