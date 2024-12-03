"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import dayjs from "dayjs";
import { useMemo } from "react";

const chartConfig = {
  amountUSD: {
    label: "Volume",
    color: "#60a5fa", // Change color if necessary
  },
} satisfies ChartConfig;

interface Props {
  data: any[];
}

export function Volume({ data }: Props) {
  // Directly use the data as is without further processing
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: dayjs.unix(parseInt(item.timestamp)).format("YYYY-MM-DD HH:mm:ss"),
      volume: parseFloat(item.amountUSD), // Assuming amountUSD is a string, convert it to float
    }));
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-[#00f0ff] text-xl mb-2">Real Time Volume</p>
      <ChartContainer config={chartConfig} className="min-h-[200px] rounded-xl w-full max-w-4xl mx-auto bg-neutral-700 bg-opacity-90">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => dayjs(value).format("MM-DD HH:mm")}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="volume" fill={chartConfig.amountUSD.color} radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
