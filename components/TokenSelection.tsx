'use client'

import React, { useState } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
import { Token } from '@/types/index';
import { Input } from "@/components/ui/input"

const TokenSelection = () => {
  const { tokens, setSwapTokenIn, setSwapTokenOut } = useSwapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [customTokenAddress, setCustomTokenAddress] = useState('');

  const filteredTokens = tokens.popularTokens.filter((token) =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomTokenAdd = () => {
    const customToken: Token = {
      address: customTokenAddress,
      symbol: 'Custom',
      name: 'Custom Token',
      decimals: 18,
    };
    setSwapTokenIn(customToken);
    setSwapTokenOut(customToken);
  };

  return (
    <div>
      <Input
        className='my-2'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a token"
      />
      <div>
        {filteredTokens.map((token) => (
          <div key={token.address} onClick={() => setSwapTokenIn(token)}>
            {token.symbol}
          </div>
        ))}
      </div>
      <div>
        <Input
          className='my-2'
          value={customTokenAddress}
          onChange={(e) => setCustomTokenAddress(e.target.value)}
          placeholder="Enter custom token address"
        />
        <button
          className="before:ease relative h-8 w-48 rounded-xl md:w-44 overflow-hidden bg-[#00f0ff] text-black transition-all before:absolute before:top-1/2 before:h-0 before:w-64 before:origin-center before:-translate-x-20 before:rotate-45 before:bg-[#10e4f1] before:duration-300 hover:sbg-[#10e4f1] hover:before:h-64 hover:before:-translate-y-32"
          style={{ boxShadow: "2px 2px 5px 1px #00f0ff" }}
          onClick={handleCustomTokenAdd}
        >
          <span className="relative z-10">Add Custom Token</span>
        </button>
      </div>
    </div>
  );
};

export default TokenSelection;
