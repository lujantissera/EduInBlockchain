import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { viem } from "hardhat";
import { toHex ,formatEther} from "viem";

async function main() {
  const EduResources = await ethers.getContractFactory("EduResources");
  const edu = await EduResources.deploy();

  await edu.waitForDeployment();
  const address = edu.target;

  console.log(`✅ EduResources deployed at: ${address}`);
  const publicClient = await viem.getPublicClient();
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block:", blockNumber);
  const [deployer] = await viem.getWalletClients();
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Balance del deployer:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );      // 📦 Guardamos dirección y ABI para el frontend
  const contractData = {
    address,
    abi: EduResources.interface.formatJson()
  };

  const frontendDir = path.resolve(__dirname, "../frontend/src/contracts");
  fs.mkdirSync(frontendDir, { recursive: true });

  fs.writeFileSync(
    `${frontendDir}/EduResources.json`,
    JSON.stringify(contractData, null, 2)
  );

  console.log("📁 ABI + address exported to frontend/src/contracts/EduResources.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
