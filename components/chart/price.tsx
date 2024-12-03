"use client";

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import dayjs from "dayjs";
import { useMemo } from "react";

const chartConfig = {
  closeValue: {
    label: "Close Value",
    color: "#60a5fa", // Change color if necessary
  },
} satisfies ChartConfig;

interface Props {
  data: any[];
}

export function PriceChart({ data }: Props) {
  // Calculate the minimum and maximum values of the close values
  const minCloseValue = useMemo(() => {
    return Math.min(...data.map((item) => parseFloat(item.close.value)));
  }, [data]);

  const maxCloseValue = useMemo(() => {
    return Math.max(...data.map((item) => parseFloat(item.close.value)));
  }, [data]);

  // Normalize the data by subtracting the minimum value
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: dayjs.unix(parseInt(item.timestamp)).format("YYYY-MM-DD HH:mm:ss"),
      normalizedCloseValue: parseFloat(item.close.value) - minCloseValue, // Subtract the min value to normalize
      originalCloseValue: parseFloat(item.close.value), // Keep the original value
    }));
  }, [data, minCloseValue]);

  // Custom Tooltip function
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { originalCloseValue, time } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-neutral-800 text-white p-2 rounded">
          <p>{`Time: ${time}`}</p>
          <p>{`Close Value: $${originalCloseValue.toFixed(2)}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ChartContainer config={chartConfig} className="h-[50vh] rounded-xl w-full max-w-4xl mx-auto bg-neutral-700 bg-opacity-90">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => dayjs(value).format("MM-DD HH:mm")}
          />
          <Tooltip content={<CustomTooltip />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="normalizedCloseValue" stroke={chartConfig.closeValue.color} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
