import { gql } from "@apollo/client";
import { uniswapClient } from "@/lib/apolloclients";
import { NextResponse } from "next/server";

const GET_TVL = gql`
query getDailyTVL($fromTimestamp: Int!, $toTimestamp: Int!) {
  pairDayDatas( 
    first: 1000, 
    orderBy: date, 
    orderDirection: asc, 
    where: { 
        date_gte: $fromTimestamp, 
        date_lte: $toTimestamp 
    }
  ) {
      date
      reserveUSD
  }
}
`;

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const fromDate = new Date('March 11, 2020 09:00:00 GMT');
      const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
      const toTimestamp = Math.floor(Date.now() / 1000);
      console.log(fromTimestamp, toTimestamp)
      const { data } = await uniswapClient.query({
        query: GET_TVL,
        variables: {
          fromTimestamp: fromTimestamp,
          toTimestamp: toTimestamp
        }
      });
      // console.log(data)
      return NextResponse.json({ data: data }, { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
