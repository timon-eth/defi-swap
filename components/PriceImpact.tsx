'use client'

import { useEffect, useState } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
import { Token } from '@/types/index';
import { SwapRouter } from '@uniswap/v3-sdk';

const PriceImpact = () => {
  const { swap } = useSwapStore();
  const [priceImpact, setPriceImpact] = useState<string>('');

//   useEffect(() => {
//     const calculatePriceImpact = async () => {
//       if (!swap.tokenIn || !swap.tokenOut || !swap.amount) return;

//       const route = await SwapRouter.swapCallParameters();
//       setPriceImpact(route.priceImpact.toFixed(2));
//     };

//     calculatePriceImpact();
//   }, [swap]);

  return (
    <div>
      <p>Price Impact: {priceImpact}%</p>
      {parseFloat(priceImpact) > 1 && <span>Warning: High price impact!</span>}
    </div>
  );
};

export default PriceImpact;
