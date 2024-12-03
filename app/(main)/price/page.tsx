'use client'
import { columns } from "@/components/tables/pool-table/columns";
import { PoolTable } from "@/components/tables/pool-table/pool-table";
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
} from "@/components/ui/alert-dialog";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PriceChart } from "@/components/chart/price";

export default function Page() {
  const params = useSearchParams();
  const [data, setData] = useState<any>([]);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false); // State to track screen width
  const [maximized, setMaximized] = useState<boolean>(false); // State to track if the screen was maximized

  async function fetchToken() {
    if (params.get('chain') && params.get('address')) {
      let chain = params.get('chain');
      let address = params.get('address');
      setLoading(true);
      try {
        const res = await fetch("/api/price", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operationName: 'TokenPrice',
            chain: chain,
            address: address,
            duration: "DAY"
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const { data, tprice } = await res.json();
        setData(data);
        setPrice(tprice);

      } catch (error) {
        console.error('Error fetching search chains tokens:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is the breakpoint for 'md' in Tailwind
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetchToken();
  }, [params]);

  const handleMaximize = () => {
    setMaximized(true);
    if (typeof window !== 'undefined') {
      window.resizeTo(screen.width, screen.height);
    }
  };

  return (
    <>
      {isSmallScreen && !maximized && (
        <AlertDialog open={isSmallScreen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Screen size is too small!</AlertDialogTitle>
              <AlertDialogDescription>
                Currently, the table cannot be displayed properly on resolutions smaller than 768px.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMaximize}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="space-y-4 w-full mt-12 md:p-8 pt-6 flex flex-col items-center">
        <p className="text-[#00f0ff] text-xl mb-2">$ {price}</p>
        <PriceChart data={data}></PriceChart>
      </div>
    </>
  );
}
