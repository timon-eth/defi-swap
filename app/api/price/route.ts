import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const json = await req.json();
  const { duration, operationName, chain, address } = json;
  try {
    const response = await fetch(
      `https://interface.gateway.uniswap.org/v1/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://app.uniswap.org"
        },
        body: JSON.stringify(
          {
            "operationName": operationName,
            "variables": {
              "address": address,
              "fallback": false,
              "chain": chain,
              "duration": duration
            },
            "query": "query TokenPrice($chain: Chain!, $address: String = null, $duration: HistoryDuration!, $fallback: Boolean = false) {\n  token(chain: $chain, address: $address) {\n    id\n    address\n    chain\n    market(currency: USD) {\n      id\n      price {\n        id\n        value\n        __typename\n      }\n      ohlc(duration: $duration) @skip(if: $fallback) {\n        ...CandlestickOHLC\n        __typename\n      }\n      priceHistory(duration: $duration) @include(if: $fallback) {\n        ...PriceHistoryFallback\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment CandlestickOHLC on TimestampedOhlc {\n  id\n  timestamp\n  open {\n    id\n    value\n    __typename\n  }\n  high {\n    id\n    value\n    __typename\n  }\n  low {\n    id\n    value\n    __typename\n  }\n  close {\n    id\n    value\n    __typename\n  }\n  __typename\n}\n\nfragment PriceHistoryFallback on TimestampedAmount {\n  id\n  value\n  timestamp\n  __typename\n}"
          }
        ),
      }
    );
    const { data } = await response.json();
    const { token } = data;
    const { market } = token;
    const { ohlc } = market; 
    const { price } = market;
    return NextResponse.json({ data: ohlc, tprice:price.value })
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch data from server" },
      { status: 500 }
    );
  }
}