export const EDU_CONTRACT_ADDRESS = "0x6E791Cc5876294F7F8257954B396A5D26878f898"; // 🛑 Reemplazá esto con la dirección real en Scroll Sepolia

export const EDU_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getResourcesCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_resourceId", "type": "uint256" }],
    "name": "getResource",
    "outputs": [
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "resourceLink", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bytes32", "name": "contentHash", "type": "bytes32" },
      { "internalType": "address", "name": "addedBy", "type": "address" },
      { "internalType": "uint256", "name": "upvotes", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
