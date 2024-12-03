"use client";

import { TokenData } from "@/types/data";
import { ColumnDef, CellContext  } from "@tanstack/react-table";

function formatNumber(number: number) {
  if (number >= 1e12) {
      return (number / 1e12).toFixed(2) + 'T';
  } else if (number >= 1e9) {
      return (number / 1e9).toFixed(2) + 'B';
  } else if (number >= 1e6) {
      return (number / 1e6).toFixed(2) + 'M';
  } else if (number >= 1e3) {
      return (number / 1e3).toFixed(2) + 'K';
  } else {
      return (number/1).toFixed(2);
  }
}

export const columns: ColumnDef<TokenData>[] = [
  {
    accessorKey:'pair',
    header: "Name/Sysbol",
    cell: (context: CellContext<TokenData, unknown>) => {
      const rowData = context.row.original;
      return rowData.name + "/" + (rowData.symbol);
    },
  },
  {
    header: "Derived ETH",
    cell: (context: CellContext<TokenData, unknown>) => {
      const rowData = context.row.original;
      return rowData.derivedETH;
    }
  },
  {
    header: "TotalSupply",
    cell: (context: CellContext<TokenData, unknown>) => {
      const rowData = context.row.original;
      return rowData.totalSupply;
    }
  },
  {
    header: "Price USD",    
    cell: (context: CellContext<TokenData, unknown>) => {
      const rowData = context.row.original;
      return rowData.tokenDayData.priceUSD;
    }
  },
  {
    header: "VolumeUSD",
    cell: (context: CellContext<TokenData, unknown>) => {
      const rowData = context.row.original;
      const fdv = rowData.volumeUSD;
      return formatNumber(fdv);
    },
  },
];
