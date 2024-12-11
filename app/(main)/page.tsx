'use client'

import TokenInSelection from '@/components/swap/tokenin-selection';
import TokenOutSelection from '@/components/swap/tokenout-selection';
import { Connect } from '@/components/swap/connect';
import React, { useState, useEffect } from 'react';
import { Token } from '@/types';
import { useSwapStore } from '@/stores/useSwapStore';
import { ethers, BigNumber } from 'ethers';
import { useAccount, useContractRead, useContractWrite, useWaitForTransactionReceipt, useEstimateGas } from 'wagmi';
import {
  fetchBalance,
  waitForTransaction,
  prepareTransactionRequest
} from '@wagmi/core';
import IUniswapV3PoolArtifact from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import ISwapRouterArtifact from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';
import IUniswapV3FactoryArtifact from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import GeneralArtifact from '@/lib/GeneralArtifact.json';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

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
import { LoadingSpinner } from '@/components/ui/loading';
import { parseEther } from 'viem';

type Slot0Data = [BigNumber, BigNumber, number, BigNumber];

export default function Swap() {
  const { setSwapTokens } = useSwapStore();
  const { address, chainId } = useAccount();
  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [outAmount, setOutAmount] = useState('');
  const [slippage, setSlippage] = useState('0.3');
  const [slipvalue, setSlipvalue] = useState<number>(0.5);
  const [sliperror, setSliperror] = useState('');
  const [txn, setTxn] = useState<`0x${string}`>();
  const { data: hash, writeContractAsync, isError, isPending, isPaused, isSuccess, writeContract, reset } = useContractWrite();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const factoryaddress = chainId == 11155111 ? process.env.NEXT_PUBLIC_UNISWAP_SEPOLIA_FACTORY_ADDRESS : process.env.NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS;
  const routeraddress = chainId == 11155111 ? process.env.NEXT_PUBLIC_UNISWAP_SEPOLIA_ROUTER_ADDRESS : process.env.NEXT_PUBLIC_UNISWAP_ROUTER_ADDRESS;

  // Get pool for tokenA -> tokenB
  const { data: poolAddress, isLoading: poolloading, isLoadingError: poolloadingError } = useContractRead({
    address: factoryaddress as `0x${string}`,
    abi: IUniswapV3FactoryArtifact.abi,
    functionName: 'getPool',
    args: [tokenIn?.address, tokenOut?.address, 3000],
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
    address: factoryaddress as `0x${string}`,
    abi: IUniswapV3FactoryArtifact.abi,
    functionName: 'getPool',
    args: [tokenIn?.address, `${process.env.NEXT_PUBLIC_STABLE_TOKEN_ADDRESS}`, slipvalue * Number(process.env.NEXT_PUBLIC_SLIPPAGE_CONSTANT)],
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
    address: factoryaddress as `0x${string}`,
    abi: IUniswapV3FactoryArtifact.abi,
    functionName: 'getPool',
    args: [`${process.env.NEXT_PUBLIC_STABLE_TOKEN_ADDRESS}`, tokenOut?.address, slipvalue * Number(process.env.NEXT_PUBLIC_SLIPPAGE_CONSTANT)],
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
    if (!tokenIn?.address || !tokenOut?.address || !amount || !outAmount) {
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
    const r_address = ethers.utils.getAddress(routeraddress!);

    try {
      const approveTx = await writeContractAsync({
        address: tokenIn?.address as `0x${string}`,
        abi: GeneralArtifact.abi,
        functionName: 'approve',
        args: [r_address, parsedAmountA],
      });

      if (approveTx) {
        console.log(tokenIn?.address, tokenOut?.address, feeAmount, address, Math.floor(Date.now() / 1000) + 60 * 10, parsedAmountA)
        const params = {
          tokenIn: tokenIn?.address,
          tokenOut: tokenOut?.address,
          fee: feeAmount,
          recipient: address,
          deadline: Math.floor(Date.now() / 1000) + 60 * 10,
          amountIn: parsedAmountA,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0
        };

        const swaptxn = await writeContractAsync({
          address: r_address as `0x${string}`,
          abi: ISwapRouterArtifact.abi,
          functionName: 'exactInputSingle',
          args: [params],
          gas: BigInt(ethers.utils.hexlify(1000000)),
          value: parseEther('0.01')
        });
        setTxn(swaptxn);
      }
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
          } catch (e) {
            toast("Pool Loading Failed", {
              description: `${e}`,
              action: {
                label: "Alert",
                onClick: () => console.log("Alert"),
              },
            })
          }
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

  useEffect(() => {
    if (isSuccess || isError || isConfirmed || isPaused) {
      setIsOpen(true);  // Open the dialog when any of these states change
    }
    else {
      setIsOpen(false);
    }
  }, [isSuccess, isError, isConfirmed, isPaused]);

  return (
    <Card className='items-center flex flex-col'>
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
                <Label className='w-1/2 my-auto text-[#00f0ff]'>
                  Fee
                </Label>
                <p className='text-[#00f0ff] ml-auto'>{slipvalue}%</p>
              </div>
              <div className='flex flex-row py-2 px-1'>
                <Label className='w-1/2 my-auto text-[#00f0ff]'>
                  Max slippage
                  <span className='text-red-700 font-[12px]'>
                    {sliperror != "" && <p>{sliperror}</p>}
                  </span>
                </Label>
                <Input
                  className='w-1/2 text-right'
                  defaultValue={0.3}
                  value={slippage}
                  type="number"
                  step={0.1}
                  onChange={(e) => { slipChange(e.target.value) }}
                >
                </Input>
              </div>
              <div className='flex flex-row py-2 px-1'>
                <Label className='w-1/2 my-auto text-[#00f0ff]'>
                  Order routing
                </Label>
                <p className='text-[#00f0ff] ml-auto'>UniswapX</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {address ? <Button className='w-full bg-neutral-500 rounded-xl' disabled={isConfirming} onClick={() => { swap() }}>Swap{isConfirming && <LoadingSpinner></LoadingSpinner>}</Button> : <Connect></Connect>}
      </CardFooter>
      <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isConfirmed && "The token was exchanged successfully."}
              {isSuccess && "Transaction Confirmed"}
              {isError && "Transaction Failed"}
              {isPaused && "Transaction Paused"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuccess && "Click here to see the current transaction status."}
              {isSuccess && "The swap was completed successfully."}
              {isError && "An error occurred while executing the transaction."}
              {isPaused && "The transaction was paused for a while."}
              <a className='p-2' href={`https://sepolia.etherscan.io/tx/${txn}`}>{txn?.slice(0, 8)}...</a>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {setIsOpen(false);}}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
