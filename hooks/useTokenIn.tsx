import { ethers } from 'ethers';
import { useContractRead } from 'wagmi';
import GeneralArtifact from '@/lib/GeneralArtifact.json';

const useTokenIn = (fromTokenAddress: string, amount: string, decimal: number) => {
  if (!fromTokenAddress || !amount || !decimal) {
    return 0;
  }

  const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimal);
  const router = process.env.NEXT_PUBLIC_UNISWAP_ROUTER_ADDRESS;

  const { data: approve, isError } = useContractRead({
    address: fromTokenAddress as `0x${string}`,
    abi: GeneralArtifact.abi,
    functionName: 'approve',
    args: [router , parsedAmount], // Add the correct arguments here
  });

  if (isError) {
    console.error('Error reading approval data');
    return 0;
  }

  return approve;
};
export default useTokenIn;
