import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
// import TokenSwap from '@/components/TokenSwap';
import TokenSelection from '@/components/TokenSelection';
import PriceImpact from '@/components/PriceImpact';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectButton/>
      <TokenSelection/>
      <PriceImpact/>
    </main>
  )
}
