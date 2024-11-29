import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const json = await req.json();
  const { query } = json;

  try {
    const response = await fetch(
      `https://interface.gateway.uniswap.org/v1/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://app.uniswap.org"
        },
        body: JSON.stringify({
          "operationName": "SearchTokensWeb",
          "variables": {
              "searchQuery": query
          },
          "query": "query SearchTokensWeb($searchQuery: String!, $chains: [Chain!]) {\n  searchTokens(searchQuery: $searchQuery, chains: $chains) {\n    ...SimpleTokenDetails\n    id\n    decimals\n    name\n    chain\n    standard\n    address\n    symbol\n    market(currency: USD) {\n      id\n      price {\n        id\n        value\n        currency\n        __typename\n      }\n      pricePercentChange(duration: DAY) {\n        id\n        value\n        __typename\n      }\n      volume24H: volume(duration: DAY) {\n        id\n        value\n        currency\n        __typename\n      }\n      __typename\n    }\n    project {\n      id\n      name\n      logo {\n        id\n        url\n        __typename\n      }\n      safetyLevel\n      logoUrl\n      isSpam\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SimpleTokenDetails on Token {\n  id\n  address\n  chain\n  decimals\n  name\n  standard\n  symbol\n  project {\n    id\n    isSpam\n    logoUrl\n    name\n    safetyLevel\n    __typename\n  }\n  feeData {\n    buyFeeBps\n    sellFeeBps\n    __typename\n  }\n  protectionInfo {\n    attackTypes\n    result\n    __typename\n  }\n  __typename\n}"
      }),
      }
    );
    const { data } = await response.json();
    const { searchTokens } = data;
    return NextResponse.json({data: searchTokens})
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch data from server" },
      { status: 500 }
    );
  }
}
