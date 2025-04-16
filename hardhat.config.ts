import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as envEnc from "@chainlink/env-enc";
import "@nomicfoundation/hardhat-viem";


envEnc.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    /*scrollMainnet: {
      url: process.env.RPC_PROVIDER,
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 534352,
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC, // ahora usamos una nueva variable
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 534351, // Scroll Sepolia
    },*/
  }
};

export default config;
