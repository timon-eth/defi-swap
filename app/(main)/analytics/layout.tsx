"use client";

import { useEffect, useState } from "react";
import { Volume } from "@/components/chart/volume";

export default function PoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [swapdata, setSwapData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      volume(); 
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
      <div className="flex flex-col items-center justify-center mx-auto mt-[90vh]">
        <Volume data={swapdata}></Volume>
        {children}
      </div>
  );
}
