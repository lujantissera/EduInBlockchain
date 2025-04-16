// scripts/addResourceScripts.ts

const { createWalletClient, http } = require("viem");
const { scrollSepolia } = require("viem/chains");
const { privateKeyToAccount } = require("viem/accounts");
const { abi } = require("../viem-version/abi");
require("dotenv").config();

const contractAddress = "0x6e791cc5876294f7f8257954b396a5d26878f898";

const main = async () => {
  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

  const client = createWalletClient({
    account,
    chain: scrollSepolia,
    transport: http(process.env.SCROLL_SEPOLIA_RPC),
  });

  console.log("🚀 Usando la cuenta:", account.address);

  const hash = await client.writeContract({
    abi,
    address: contractAddress,
    functionName: "addResource",
    args: [
      "Tutorial sobre Viem",
      "https://viem.sh/",
      "0xa9fe4a683c376deea63ae80d179e3e2a0f8abcfcd8f9e48994cd7a3dcff368b3",
    ],
  });

  console.log("📨 Tx enviada:", hash);
};

main().catch((err) => {
  console.error("💥 Error en la ejecución:", err);
});
