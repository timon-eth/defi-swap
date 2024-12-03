export type Swap = {
  token0: any,
  token1: any,
  token0Price: number,
  token1Price: number,
  totalValueLockedUSD: number,
  txCount: number,
  liquidity: number,
  liquidityProviderCount: number
}

export type TokenData = {
  symbol: string,
  name: string,
  derivedETH: string,
  totalSupply: string,
  volumeUSD: number,
  tokenDayData: {
    priceUSD: string,
    volumeUSD: string,
    date: string
  }
}

