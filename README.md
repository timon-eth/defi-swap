# DeFi Swap DApp

A modern decentralized token swap interface built with **Next.js** and **Uniswap V3 SDK**, designed for user-friendly, efficient token swaps and excellent UX. The DApp integrates wallet authentication, token selection, and analytics to provide a complete decentralized finance (DeFi) experience.

---

## Features

- **Wallet Integration**: Connect with **MetaMask** or **WalletConnect** to manage wallet information, including address and balance.
- **Token Swap**: Seamless swapping of ERC20 tokens using Uniswap V3, with options to adjust slippage, visualize routes, and estimate gas.
- **Analytics Panel**: View live price charts, 24h volume, liquidity depth, and recent trades for selected token pairs.
- **Smart Features**: Price impact warnings, slippage protection, gas price optimization, and transaction tracking.
- **Responsive Design**: Fully responsive UI/UX for both mobile and desktop devices.

---

## Technical Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Web3**: ethers.js, WalletConnect
- **State Management**: Zustand
- **Uniswap V3 Integration**: Uniswap V3 SDK

---

## Environment Variables

Make sure to configure the following environment variables in your `.env.local` file:

```plaintext
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS=uniswap_factory_address
NEXT_PUBLIC_UNISWAP_ROUTER_ADDRESS=uniswap_v3_router_address
NEXT_PUBLIC_POOL_NULL=null_address_for_uniswap_pool
NEXT_PUBLIC_STABLE_TOKEN_CHAIN=ethereum_or_other_chain_id
NEXT_PUBLIC_STABLE_TOKEN_ADDRESS=stable_token_address
NEXT_PUBLIC_STABLE_TOKEN_DECIMALS=stable_token_decimals
```
---

## Installation

### Prerequisites

- **Node.js** (>= 14.0.0)
- **npm** or **yarn**
- You will also need a Web3 wallet like **MetaMask** or **WalletConnect** for interacting with the app.

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/defi-swap-dapp.git
    cd defi-swap-dapp
2. **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
3. **Configure environment variables**:

    ```bash
        Copy the .env.example file to .env.local and update it with your actual environment variables (see the section above).
    ```
4. **Run the development server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Smart Features

- **Gas Price Optimization**: Suggests the best gas prices to optimize costs.
- **Slippage Protection**: Set slippage tolerance to protect against price fluctuations.
- **Transaction Error Handling**: In case of failed transactions, users are notified with actionable steps.
- **Price Impact Warnings**: Alerts the user if the token swap will result in significant price impact.

## Contributing

We welcome contributions to the DeFi Swap DApp! To get started:

1. **Fork the repository**
2. **Create a new branch**:
   ```bash
   git checkout -b feature-branch
   ```
3. **Make your changes to the code**
4. **Commit your changes**
    ```bash
   git commit -am `'Add feature'`
   ```
5. **Commit your changes**
    ```bash
   Push to the branch
   ```
6. **Open a pull request from your forked repository to the main repository**

## Acknowledgements

We would like to express our gratitude to the following projects and technologies that made this project possible:

- **[Uniswap V3 SDK](https://github.com/Uniswap/uniswap-v3-sdk)**: 
  - Provides the core functionality for token swapping, interacting with liquidity pools, and optimizing transaction routes within the Uniswap V3 ecosystem.

- **[Next.js](https://nextjs.org/)**: 
  - A powerful React framework for building modern web applications. Next.js enabled server-side rendering, static site generation, and a smooth developer experience for building this DApp.

- **[ethers.js](https://docs.ethers.io/v5/)**: 
  - A JavaScript library that provides simple and complete interaction with the Ethereum blockchain. Used for connecting to Web3 wallets, signing transactions, and interacting with smart contracts on the Ethereum network.

- **[Tailwind CSS](https://tailwindcss.com/)**: 
  - A utility-first CSS framework that allows for fast and efficient UI development. Tailwind CSS helped us rapidly build responsive, customizable, and aesthetically-pleasing layouts for the DeFi Swap DApp.

- **[WalletConnect](https://walletconnect.org/)**: 
  - A protocol for connecting Web3 wallets like MetaMask, Trust Wallet, and others to decentralized applications (DApps). WalletConnect enabled multi-wallet support, ensuring a seamless user experience across different platforms.

## License

This project is licensed under the **MIT License**.

- **MIT License**: You are free to use, modify, and distribute this software, provided that the original copyright notice and license are included in all copies or substantial portions of the software.

- For more details, please refer to the [LICENSE](LICENSE) file located in the repository.
