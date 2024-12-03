'use client'

import TokenInSelection from '@/components/swap/tokenin-selection';
import TokenOutSelection from '@/components/swap/tokenout-selection';
import { Connect } from '@/components/swap/connect';
import React, { useState, useEffect } from 'react';
import { Token } from '@/types';
import { useSwapStore } from '@/stores/useSwapStore';
import { ethers, BigNumber } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import IUniswapV3PoolArtifact from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import ISwapRouterArtifact from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';
import IUniswapV3FactoryArtifact from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import GeneralArtifact from '@/lib/GeneralArtifact.json';
import { Pool } from '@uniswap/v3-sdk';
import { Token as UniswapToken } from '@uniswap/sdk-core';
import { toast } from "sonner";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


type Slot0Data = [BigNumber, BigNumber, number, BigNumber];

export default function Swap() {
  const { setSwapTokens } = useSwapStore();
  const { address, chainId } = useAccount();
  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [outAmount, setOutAmount] = useState('');
  const [slippage, setSlippage] = useState('');
  const [slipvalue, setSlipvalue] = useState<number>(0.3);
  const [sliperror, setSliperror] = useState('');
  const [txn, setTxn] = useState<`0x${string}`>();
  const [loading, setLoading] = useState(false);
  const { data: hash, writeContractAsync, isError, isPending, isPaused, isSuccess } = useContractWrite()

  // Get pool for tokenA -> tokenB
  const { data: poolAddress, isLoading: poolloading, isLoadingError: poolloadingError } = useContractRead({
    address: process.env.NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS as `0x${string}`,
    abi: IUniswapV3FactoryArtifact.abi,
    functionName: 'getPool',
    args: [tokenIn?.address, tokenOut?.address, slipvalue * Number(process.env.NEXT_PUBLIC_SLIPPAGE_CONSTANT)],
  });

  const { data: slot0Data } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'slot0',
  });

  const { data: feeAmount } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'fee',
  });

  const { data: liquidityAmount } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'liquidity',
  });

  // Step 1: Get pool for tokenA -> ETH
  const { data: poolAtoETH } = useContractRead({
    address: process.env.NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS as `0x${string}`,
    abi: IUniswapV3FactoryArtifact.abi,
    functionName: 'getPool',
    args: [tokenIn?.address, `${process.env.NEXT_PUBLIC_STABLE_TOKEN_ADDRESS}`, 3000],
  });

  const { data: feeAmountAtoETH } = useContractRead({
    address: poolAtoETH as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'fee',
  });

  const { data: liquidityAmountAtoETH } = useContractRead({
    address: poolAtoETH as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'liquidity',
  });

  const { data: slot0AtoETH } = useContractRead({
    address: poolAtoETH as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'slot0',
  });

  // Step 2: Get pool for ETH -> tokenB
  const { data: poolETHtoB } = useContractRead({
    address: process.env.NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS as `0x${string}`,
    abi: IUniswapV3FactoryArtifact.abi,
    functionName: 'getPool',
    args: [`${process.env.NEXT_PUBLIC_STABLE_TOKEN_ADDRESS}`, tokenOut?.address, 3000],
  });

  const { data: slot0ETHtoB } = useContractRead({
    address: poolETHtoB as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'slot0',
  });

  const { data: feeAmountETHtoB } = useContractRead({
    address: poolETHtoB as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'fee',
  });

  const { data: liquidityAmountETHtoB } = useContractRead({
    address: poolETHtoB as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'liquidity',
  });

  const { data: token0 } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: IUniswapV3PoolArtifact.abi,
    functionName: 'token0',
  });

  const swap = async () => {
    if(!tokenIn?.address || tokenOut?.address || amount || outAmount){
      toast("Action Alert", {
        description: `Please enter all required values.`,
        action: {
          label: "Warning",
          onClick: () => console.log("Alert"),
        },
      });
      return;
    }
    const parsedAmountA = ethers.utils.parseUnits(amount.toString(), tokenIn?.decimals);
    const parsedAmountB = ethers.utils.parseUnits(amount.toString(), tokenOut?.decimals);
    const address = ethers.utils.getAddress(process.env.NEXT_PUBLIC_UNISWAP_ROUTER_ADDRESS!);

    try {
      writeContractAsync({
        address: tokenIn?.address as `0x${string}`,
        abi: GeneralArtifact.abi,
        functionName: 'approve',
        args: [address, parsedAmountA],
      })

      const params = {
        tokenIn: tokenIn?.address,
        tokenOut: tokenOut?.address,
        fee: feeAmount,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
        amountIn: parsedAmountB,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      };

      let txn = await writeContractAsync({
        address: address as `0x${string}`,
        abi: ISwapRouterArtifact.abi,
        functionName: 'exactInputSingle',
        args: [params],
        gas: BigInt(ethers.utils.hexlify(700000))
      });
      setTxn(txn);

    } catch (e) {
      console.log(e);
    }
  }

  const slipChange = (value: string) => {
    if (Number(value) < 0.1 || Number(value) > 1) {
      setSliperror("0.1 from 1");
    } else {
      setSliperror(""); // Clear the error if the value is within range
      setSlipvalue(Number(value));
    }
    setSlippage(value);
  };

  useEffect(() => {
    setSwapTokens(tokenIn!, tokenOut!, amount);
  }, [tokenIn, tokenOut, amount, setSwapTokens]);

  useEffect(() => {
    if (tokenIn?.address == '' || !tokenIn?.address || tokenOut?.address == '' || !tokenOut?.address)
      return;
    if (poolAddress) {
      if (poolAddress == process.env.NEXT_PUBLIC_POOL_NULL && slot0AtoETH && slot0ETHtoB && feeAmountAtoETH && liquidityAmountAtoETH && feeAmountETHtoB && liquidityAmountETHtoB) {
        const tokenS = new UniswapToken(Number(process.env.NEXT_PUBLIC_STABLE_TOKEN_CHAIN), `${process.env.NEXT_PUBLIC_STABLE_TOKEN_ADDRESS}`, Number(process.env.NEXT_PUBLIC_STABLE_TOKEN_DECIMALS));
        const tokenA = new UniswapToken(chainId!, tokenIn?.address!, tokenIn?.decimals!);
        const tokenB = new UniswapToken(chainId!, tokenOut?.address!, tokenOut?.decimals!);

        const [sqrtRatioAtoETH, tickAtoETH] = slot0AtoETH as Slot0Data;
        const [sqrtRatioETHtoB, tickETHtoB] = slot0ETHtoB as Slot0Data;

        const feeAtoETH = Number(feeAmountAtoETH);
        const liquidityAtoETH = liquidityAmountAtoETH!.toString();

        const feeETHtoB = Number(feeAmountETHtoB);
        const liquidityETHtoB = liquidityAmountETHtoB!.toString();

        try {
          const poolAtoETHInstance = new Pool(
            tokenA,
            tokenS,
            feeAtoETH,
            sqrtRatioAtoETH.toString(),
            liquidityAtoETH,
            Number(tickAtoETH)
          );

          const poolETHtoBInstance = new Pool(
            tokenS,
            tokenB,
            feeETHtoB,
            sqrtRatioETHtoB.toString(),
            liquidityETHtoB,
            Number(tickETHtoB)
          );

          // Get the outputAmount via indirect swap: tokenA -> ETH -> tokenB
          const priceAtoETH = parseFloat(poolAtoETHInstance.token1Price.toFixed(6));
          const priceETHtoB = parseFloat(poolETHtoBInstance.token1Price.toFixed(6));

          const indirectPrice = priceETHtoB / priceAtoETH;  // tokenA -> ETH -> tokenB

          // Calculate the outputAmount
          const outputAmount = indirectPrice * Number(amount);
          console.log(poolAtoETH, poolETHtoB, outputAmount);
          setOutAmount(`${outputAmount.toPrecision(6)}`);

        } catch (e) {
          toast("Pool Loading Failed", {
            description: `${e}`,
            action: {
              label: "Alert",
              onClick: () => console.log("Alert"),
            },
          });
        }

      } else {
        if (slot0Data && feeAmount && liquidityAmount) {
          const tokenA = new UniswapToken(tokenOut?.chain!, tokenOut?.address!, tokenOut?.decimals!);
          const tokenB = new UniswapToken(tokenIn.chain!, tokenIn?.address!, tokenIn?.decimals!);
          const [sqrtRatioX96Amount, tickAmount] = slot0Data as Slot0Data;

          const fee = Number(feeAmount);
          const tick = Number(tickAmount);
          try {
            const pool = new Pool(
              tokenB,
              tokenA,
              fee,
              sqrtRatioX96Amount.toString(),
              liquidityAmount.toString(),
              tick
            );
            if (tokenA.address != token0) {
              if (Number(amount) == 0) {
                setOutAmount(`0`);
              } else {
                let outputAmount = (Number(amount) / parseFloat(pool.token1Price.toFixed(6))).toPrecision(6);
                setOutAmount(`${outputAmount}`);
              }
            }
            else {
              const outputAmount = (Number(amount) * parseFloat(pool.token1Price.toFixed(6))).toPrecision(6);
              setOutAmount(`${outputAmount}`);
            }
            console.log(poolAddress, pool.token1Price.toFixed(2));
          } catch (e) {
            toast("Pool Loading Failed", {
              description: `${e}`,
              action: {
                label: "Alert",
                onClick: () => console.log("Alert"),
              },
            })
          }
          setLoading(false);
        } else {
          setLoading(true);
        }
      }
    }
    else {
      if (!poolloading) {
        toast("Pool Loading Failed", {
          description: `Pool Loading Failed`,
          action: {
            label: "Alert",
            onClick: () => console.log("Alert"),
          },
        })
      }
    }
  }, [poolAddress, slot0Data, slot0AtoETH, slot0ETHtoB, feeAmount, liquidityAmount, tokenIn, tokenOut, amount, setSwapTokens]);


  return (
    <Card className='items-center flex flex-col'>
      <CardHeader>
        <h1 className='text-[#00f0ff]'>Swap</h1>
      </CardHeader>
      <CardContent className="space-y-2">
        <TokenInSelection amount={amount} tokenIn={tokenIn} setAmount={setAmount} setTokenIn={setTokenIn}/>
        <Separator className="w-4/5 mx-auto" />
        <TokenOutSelection outAmount={outAmount} tokenOut={tokenOut} setOutAmount={setOutAmount} setTokenOut={setTokenOut} />
      </CardContent>
      <CardFooter className='flex flex-col'>
        <Accordion className='w-full px-2' type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Setting</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-row py-2 px-1'>
                <Label className='w-1/2 my-auto text-[#00f0ff]'>
                  Max slippage
                  <span className='text-red-700 font-[12px]'>
                    {sliperror != "" && <p>{sliperror}</p>}
                  </span>
                </Label>
                <Input
                  className='w-1/2'
                  defaultValue={0.3}
                  value={slippage}
                  type="number"
                  step={0.1}
                  onChange={(e) => { slipChange(e.target.value) }}
                >
                </Input>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {address ? <Button className='w-full bg-neutral-500 rounded-xl' onClick={() => { swap() }}>Swap</Button> : <Connect></Connect>}
      </CardFooter>
      {isPending && <AlertDialog open={isSuccess || isError || isPaused}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuccess && "Transaction Confirmed"}
              {isError && "Transaction Failed"}
              {isPaused && "Transaction Paused"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuccess && "The swap was completed successfully."}
              {isError && "An error occurred while executing the transaction."}
              {isPaused && "The transaction was paused for a while."}
              <a className='p-2' href='#'>{txn?.slice(0, 8)}...</a>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>}
    </Card>
  );
}
