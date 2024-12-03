import { gql } from "@apollo/client";
import { uniswapClient } from "@/lib/apolloclients";
import { NextResponse } from "next/server";

const GET_VOLUME = gql`
  query Volume {
    swaps(first: 100, orderBy: timestamp, orderDirection: desc) {
      amountUSD
	  timestamp
    }
  }
`;

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { data } = await uniswapClient.query({
        query: GET_VOLUME
      });

      return NextResponse.json({ data: data.swaps }, { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
