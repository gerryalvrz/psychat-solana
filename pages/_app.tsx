import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import { useMemo, useEffect, useState } from 'react';
import '../styles/globals.css';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // Configure network with safe default to devnet on Vercel unless overridden
  const envNetwork = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'devnet' | 'mainnet' | 'testnet' | undefined) || 'devnet';
  const network = envNetwork === 'mainnet' ? WalletAdapterNetwork.Mainnet : envNetwork === 'testnet' ? WalletAdapterNetwork.Testnet : WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOLANA_RPC) return process.env.NEXT_PUBLIC_SOLANA_RPC;
    return clusterApiUrl(network);
  }, [network]);

  // Configure wallets (Phantom for sponsor integration)
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering wallet components on server
  if (!mounted) {
    return (
      <div className="min-h-screen psychat-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold text-white mb-4">PsyChat</h1>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
