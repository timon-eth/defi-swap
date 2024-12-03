'use client'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

export default function Page() {
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  let index = 0;

  async function onPage() {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/address", {
        method: "POST",
        body: JSON.stringify({ address: address }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return 0;
      }
      const { data } = await response.json();
      setData(data);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (address) {
      onPage();
    }
  }, [address])

  return (
    <>
      {!loading && data.length > 0 ? <div className="p-7">
        <p className="text-[#00f0ff] text-xl mb-2">User History</p>
        <Table className="!shadow-xl p-7">
          <TableCaption>Transaction History</TableCaption>
          <TableHeader>
            <TableRow>
              <TableCell className="!text-center !font-bold">Token 0 Address</TableCell>
              <TableCell className="!font-bold">Token 0 Symbol</TableCell>
              <TableCell className="!font-bold">Token 0 Amount</TableCell>
              <TableCell className="!text-center !font-bold">Token 1 Address</TableCell>
              <TableCell className="!font-bold">Token 1 Symbol</TableCell>
              <TableCell className="!font-bold">Token 1 Amount</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.swaps.map((row: any) => (
              <TableRow key={index++}>
                <TableCell>{row.pool.token0.id || ''}</TableCell>
                <TableCell>{row.pool.token0.symbol || ''}</TableCell>
                <TableCell>{row.amount0 || 0}</TableCell>
                <TableCell>{row.pool.token1.id || ''}</TableCell>
                <TableCell>{row.pool.token1.symbol || ''}</TableCell>
                <TableCell>{row.amount1 || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> : <Skeleton className='w-[650px] h-[30vh] text-[#00f0ff] justify-center text-center pt-32 px-12' >There are currently no Swap transactions that you have performed in Uniswap.</Skeleton>}
    </>
  );
};
