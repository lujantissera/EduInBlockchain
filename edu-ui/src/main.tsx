import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';

import {
  WagmiProvider,
  http,
} from 'wagmi';


import { scrollSepolia } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'EduResources DApp',
  projectId: 'edu-resources-testnet',
  chains: [scrollSepolia],
  transports: {
    [scrollSepolia.id]: http(import.meta.env.VITE_SCROLL_SEPOLIA_RPC), // 👈 usás la variable
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <App />
      </RainbowKitProvider>
    </WagmiProvider>
  </React.StrictMode>
);
