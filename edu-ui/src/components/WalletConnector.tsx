import { ConnectButton } from '@rainbow-me/rainbowkit';

const WalletConnector = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
      <ConnectButton />
    </div>
  );
};

export default WalletConnector;
