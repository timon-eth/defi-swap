'use client'

import TokenInSelection from '@/components/swap/tokenin-selection';
import TokenOutSelection from '@/components/swap/tokenout-selection';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Connect } from '@/components/swap/connect';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator';
import React, { useState, useEffect } from 'react';
import { Token } from '@/types';
import { useSwapStore } from '@/stores/useSwapStore';
import { Button } from '@/components/ui/button';
import { useAccount, useBalance } from 'wagmi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Swap() {
  const { setSwapTokens } = useSwapStore();
  const { address } = useAccount();
  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [outAmount, setOutAmount] = useState('');

  useEffect(() => {
    if (tokenIn && tokenOut && amount) {
      setSwapTokens(tokenIn, tokenOut, amount);
    }
  }, [tokenIn, tokenOut, amount, setSwapTokens]);

  return (
    <Card>
      <CardHeader>
        <h1 className='text-[#00f0ff]'>Swap</h1>
      </CardHeader>
      <CardContent className="space-y-2">
        <TokenInSelection amount={amount} tokenIn={tokenIn} setAmount={setAmount} setTokenIn={setTokenIn} />
        <Separator className="w-4/5 mx-auto" />
        <TokenOutSelection outAmount={outAmount} tokenOut={tokenOut} setOutAmount={setOutAmount} setTokenOut={setTokenOut} />
      </CardContent>
      <CardFooter className='flex flex-col'>
        <Accordion className='w-full px-2' type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Setting</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-row py-2 px-1'>
                <Label className='w-1/2 my-auto text-[#00f0ff]'>Max slippage</Label>
                <Input className='w-1/2'></Input>
              </div>
              <div className='flex flex-row py-2 px-1'>
                <Label className='w-1/2 my-auto text-[#00f0ff]'>Transaction deadline</Label>
                <Input className='w-1/2'></Input>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {address ? <Button className='w-full bg-neutral-500 rounded-xl'>Swap</Button> : <Connect></Connect>}
      </CardFooter>
    </Card>
  );
}
