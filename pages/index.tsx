import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import Dashboard from '../components/Dashboard';
import Marketplace from '../components/Marketplace';
import ClientWalletButton from '../components/ClientWalletButton';

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'chat' | 'marketplace' | 'dashboard'>('chat');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen psychat-gradient">
      {/* Header */}
      <header className="p-4 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🧠</span>
            </div>
            <h1 className="text-2xl font-bold text-white">PsyChat</h1>
            <span className="text-white/60 text-sm">by MotusDAO</span>
          </div>
          <ClientWalletButton />
        </div>
      </header>

      {/* Navigation */}
      <nav className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
            {[
              { id: 'chat', label: '💬 Chat', desc: 'Therapy Notes' },
              { id: 'marketplace', label: '🏪 Marketplace', desc: 'Data Trading' },
              { id: 'dashboard', label: '📊 Dashboard', desc: 'Earnings & Yield' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 psychat-mobile px-4 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-psy-purple font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-black/30'
                }`}
              >
                <div className="text-sm font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4">
        <div className="max-w-6xl mx-auto">
          {!connected ? (
            <div className="psychat-card p-8 text-center">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to PsyChat
              </h2>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                A privacy-first mental health platform where you own your therapy data, 
                earn from anonymized insights, and access DeFi yields. Connect your Phantom 
                wallet to get started.
              </p>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <ClientWalletButton />
                </div>
                <div className="text-white/60 text-sm">
                  🔒 Your data is encrypted with Arcium ZK proofs<br/>
                  💰 Earn from data marketplace via Raydium AMM<br/>
                  🚀 Auto-compound earnings with Reflect $rUSD
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'chat' && <Chat />}
              {activeTab === 'marketplace' && <Marketplace />}
              {activeTab === 'dashboard' && <Dashboard />}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-white/20 mt-8">
        <div className="max-w-6xl mx-auto text-center text-white/60 text-sm">
          <p>
            Built for Cypherpunk Colosseum • MotusDAO • 
            <span className="text-psy-green"> Phantom</span> • 
            <span className="text-psy-blue"> Arcium</span> • 
            <span className="text-psy-purple"> Raydium</span> • 
            <span className="text-psy-green"> Reflect</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
