"use client";

import { useEffect, useState } from "react";
import { Volume } from "@/components/chart/volume";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setTvlData] = useState<any>([]);
  const [swapdata, setSwapData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function tvl() {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/tvl", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return 0;
      }
      const { data } = await response.json();
      setTvlData(data);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function volume() {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/volume", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return 0;
      }
      const { data } = await response.json();

      console.log(data);
      setSwapData(data);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    volume();

    const interval = setInterval(() => {
      volume();  // Call the volume function every 5 seconds
    }, 5000);

    // Cleanup interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="flex flex-col items-center justify-center mx-auto mt-[90vh]">
        <Volume data={swapdata}></Volume>
        {children}
      </div>
  );
}
