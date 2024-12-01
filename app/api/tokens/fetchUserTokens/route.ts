import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const json = await req.json();
  const { url, email, address, operationName, chain, orderBy } = json;

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
          "operationName": operationName,
          "variables": {
            "page": 1,
            "pageSize": 100,
            "orderBy": orderBy,
            "chain": chain
          },
          "query": "query TopTokens($chain: Chain, $page: Int = 1, $pageSize: Int = 100, $orderBy: TokenSortableField = POPULARITY) {\n  topTokens(chain: $chain, page: $page, pageSize: $pageSize, orderBy: $orderBy) {\n    ...TokenParts\n    __typename\n  }\n}\n\nfragment TokenParts on Token {\n  ...TokenBasicInfoParts\n  ...TokenBasicProjectParts\n  ...TokenFeeDataParts\n  ...TokenProtectionInfoParts\n  __typename\n}\n\nfragment TokenBasicInfoParts on Token {\n  id\n  address\n  chain\n  decimals\n  name\n  standard\n  symbol\n  __typename\n}\n\nfragment TokenBasicProjectParts on Token {\n  project {\n    id\n    isSpam\n    logoUrl\n    name\n    safetyLevel\n    spamCode\n    tokens {\n      chain\n      address\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TokenFeeDataParts on Token {\n  feeData {\n    buyFeeBps\n    sellFeeBps\n    __typename\n  }\n  __typename\n}\n\nfragment TokenProtectionInfoParts on Token {\n  protectionInfo {\n    result\n    attackTypes\n    __typename\n  }\n  __typename\n}"
        }),
      }
    );
    const { data } = await response.json();
    const { topTokens } = data;
    return NextResponse.json({data: topTokens})
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch data from server" },
      { status: 500 }
    );
  }
}