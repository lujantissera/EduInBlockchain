import {
    createPublicClient,
    custom,
    http,
    defineChain,
    createWalletClient,
    formatEther,
  } from "viem";
  import { privateKeyToAccount } from "viem/accounts";

  import { abi, bytecode } from "../viem-version/abi";
  import { config as loadEnv } from "dotenv";
  loadEnv(); 

  
  const providerApiKey = process.env.SCROLL_SEPOLIA_RPC || "";
  const deployerPrivateKey = process.env.PRIVATE_KEY || "";
  const envEnc = loadEnv();
  const scrollSepolia = defineChain({
    id: 534351,
    name: "Scroll Sepolia",
    network: "scroll-sepolia",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [providerApiKey],
      },
    },
    blockExplorers: {
      default: {
        name: "ScrollScan",
        url: "https://sepolia.scrollscan.com",
      },
    },
  });
  
  async function main() {
    if (!deployerPrivateKey) {
      throw new Error("🚨 Falta la PRIVATE_KEY en .env.enc");
    }
  
    const publicClient = createPublicClient({
      chain: scrollSepolia,
      transport: http(),
    });
  
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const deployer = createWalletClient({
        account,
        chain: scrollSepolia,
        transport: http(), 
      });
  
    const blockNumber = await publicClient.getBlockNumber();
    console.log("📦 Último bloque:", blockNumber.toString());
  
    console.log("👤 Deployer address:", deployer.account.address);
  
    const balance = await publicClient.getBalance({
      address: deployer.account.address,
    });
  
    console.log(
      `💰 Deployer balance: ${formatEther(balance)} ${scrollSepolia.nativeCurrency.symbol}`
    );
  
    // 🚀 Deploy del contrato
    console.log("📤 Deploying contract EduResources...");
    const hash = await deployer.deployContract({
      abi,
      bytecode,
      // args: [], // si el constructor necesita parámetros, los ponés acá
    });
  
    console.log("🧾 Deploy transaction hash:", hash);
  
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
    console.log("✅ Contrato desplegado en:", receipt.contractAddress);
  }
  
  main().catch((error) => {
    console.error("💥 Error en el deploy:", error);
    process.exitCode = 1;
  });
  