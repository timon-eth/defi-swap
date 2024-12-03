import { ApolloClient, InMemoryCache } from "@apollo/client";

export const uniswapClient = new ApolloClient({
  uri: 'https://gateway-arbitrum.network.thegraph.com/api/65794dcb7fb81d416de0be7d79d211eb/deployments/id/QmZeCuoZeadgHkGwLwMeguyqUKz1WPWQYKcKyMCeQqGhsF',
  cache: new InMemoryCache(),
});
