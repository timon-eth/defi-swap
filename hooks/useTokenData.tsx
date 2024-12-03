import { useContractRead } from 'wagmi';
import { ethers } from 'ethers';
import GeneralArtifact from '@/lib/GeneralArtifact.json';

export const useTokenData = (tokenAddress: string, userAddress: string) => {
  const { data: tokenBalance } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: GeneralArtifact.abi,
    functionName: "balanceOf",
    args: ['0x1f3d42d995036a56aa4da0dcb6add4fc1a41d058'], // Pass the wallet address as an argument to balanceOf
  });

  const { data: tokenDecimals } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: GeneralArtifact.abi,
    functionName: "decimals",
  });

  const formattedBalance = tokenBalance && tokenDecimals
    ? ethers.utils.formatUnits(tokenBalance.toString(), tokenDecimals.toString()) // Ensure tokenBalance is a string or BigNumberish
    : "0";

  return { formattedBalance, tokenBalance, tokenDecimals };
};
