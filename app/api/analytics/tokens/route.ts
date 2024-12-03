import { gql } from "@apollo/client";
import { uniswapClient } from "@/lib/apolloclients";
import { NextResponse } from "next/server";

const GET_UNISWAP_TOKENS = gql`
query {
  tokens {
    id
    symbol
    name
    derivedETH
    totalSupply
    volumeUSD
    tokenDayData(first: 2, orderBy: date, orderDirection: desc) {
      priceUSD
      volumeUSD
      date
    }
  }
}
`;

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { data } = await uniswapClient.query({
        query: GET_UNISWAP_TOKENS
      });

      return NextResponse.json({ data: data.tokens, count: data.tokens.length }, { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
