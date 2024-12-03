import { gql } from "@apollo/client";
import { uniswapClient } from "@/lib/apolloclients";
import { NextResponse } from "next/server";

const SWAP_QUERY = gql`
  query swaps($address: Bytes!) {
    swaps(orderBy: timestamp, orderDirection: desc, where: { recipient: $address }) {
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      sender
      recipient
      amount0
      amount1
    }
  }
`;

export async function POST(req: Request) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    // Parse the request body
    const json = await req.json();
    const { address } = json;

    console.log(address);

    // Validate the address (e.g., check if it's a valid Ethereum address)
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      );
    }

    // Perform the GraphQL query with the provided address
    const { data } = await uniswapClient.query({
      query: SWAP_QUERY,
      variables: { address },
    });

    console.log(data);

    // Return the data in a structured way
    return NextResponse.json(
      { data: data.swaps, count: data.swaps.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);

    // Return a more descriptive error to the client
    return NextResponse.json(
      { error: "Internal Server Error", message: error },
      { status: 500 }
    );
  }
}
