import { useEffect } from 'react';
import { useSwapStore } from '@/stores/useSwapStore';
import { Token } from '@/types';

const useFetchTokens = () => {
  const { setTokens } = useSwapStore();

  useEffect(() => {
    const fetchTokens = async () => {
      const url = `https://raw.githubusercontent.com/Uniswap/token-lists/master/tokenlist.json`;

      try {
        const response = await fetch(url);
        const data = await response.json(); // Let TypeScript infer the response type

        // Ensure you are mapping over the fetched data correctly
        const tokens: Token[] = data.tokens.map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
        }));

        console.log(tokens); // Debugging log
        setTokens(tokens); // Save tokens to the store
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, [setTokens]); // Dependency array only needs `setTokens` if it's part of the state.

};

export default useFetchTokens;
