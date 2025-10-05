import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

export default function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="psychat-button px-6 py-3 opacity-50">
        Loading...
      </div>
    );
  }

  return <WalletMultiButton className="psychat-button" />;
}

