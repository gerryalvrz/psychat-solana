import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import Dashboard from '../components/Dashboard';
import Marketplace from '../components/Marketplace';
import ClientWalletButton from '../components/ClientWalletButton';

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'marketplace' | 'dashboard'>('home');
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
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🧠</span>
            </div>
            <h1 className="text-2xl font-bold text-white">PsyChat</h1>
            <span className="text-white/60 text-sm">by MotusDAO</span>
          </button>
          <ClientWalletButton />
        </div>
      </header>

      {/* Navigation */}
      <nav className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
            {[
              { id: 'home', label: '🏠 Home', desc: 'About PsyChat' },
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
                The future of mental health is here. Own your therapy data, earn from anonymized insights, 
                and build sustainable wealth through the dataconomy. Your privacy is protected, your data is valuable.
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
              {activeTab === 'home' && (
                <div className="space-y-12">
                  {/* Hero Section */}
                  <div className="psychat-card p-8 text-center">
                    <div className="text-6xl mb-4">🧠</div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Welcome to PsyChat
                    </h2>
                    <p className="text-xl text-white/80 mb-6 max-w-3xl mx-auto">
                      The future of mental health is here. Own your therapy data, earn from anonymized insights, 
                      and build sustainable wealth through the dataconomy. Your privacy is protected, your data is valuable.
                    </p>
                    <div className="flex justify-center mb-8">
                      <ClientWalletButton />
                    </div>
                  </div>

                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="psychat-card p-6">
                      <div className="text-4xl mb-4">😔</div>
                      <h3 className="text-2xl font-bold text-red-400 mb-4">The Problem</h3>
                      <ul className="space-y-3 text-white/80">
                        <li className="flex items-start">
                          <span className="text-red-400 mr-2">❌</span>
                          Mental health data is exploited by Big Tech
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-400 mr-2">❌</span>
                          Users earn nothing from their valuable data
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-400 mr-2">❌</span>
                          Privacy is compromised for profit
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-400 mr-2">❌</span>
                          No transparency in data usage
                        </li>
                      </ul>
                    </div>

                    <div className="psychat-card p-6">
                      <div className="text-4xl mb-4">✨</div>
                      <h3 className="text-2xl font-bold text-green-400 mb-4">Our Solution</h3>
                      <ul className="space-y-3 text-white/80">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✅</span>
                          You own your therapy data completely
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✅</span>
                          Earn 70% from anonymized data sales
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✅</span>
                          ZK-encrypted privacy protection
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✅</span>
                          Full transparency in data buyers
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="psychat-card p-8">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">How PsyChat Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-psy-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🎫</span>
                        </div>
                        <h4 className="text-xl font-semibold text-white mb-3">1. Mint HNFT</h4>
                        <p className="text-white/70 text-sm mb-3">
                          Create your soulbound digital identity. This non-transferable token represents you in the dataconomy.
                        </p>
                        <div className="text-xs text-psy-purple bg-psy-purple/10 px-3 py-1 rounded-full">
                          Soulbound Identity
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-psy-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">💬</span>
                        </div>
                        <h4 className="text-xl font-semibold text-white mb-3">2. Chat Privately</h4>
                        <p className="text-white/70 text-sm mb-3">
                          Engage with AI therapy using Grok. All conversations are ZK-encrypted and stored privately.
                        </p>
                        <div className="text-xs text-psy-blue bg-psy-blue/10 px-3 py-1 rounded-full">
                          ZK-Encrypted
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-psy-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">💰</span>
                        </div>
                        <h4 className="text-xl font-semibold text-white mb-3">3. Earn from Data</h4>
                        <p className="text-white/70 text-sm mb-3">
                          Your chat sessions become tradeable Dataset NFTs. See exactly who's buying and why.
                        </p>
                        <div className="text-xs text-psy-green bg-psy-green/10 px-3 py-1 rounded-full">
                          70% Revenue Share
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-psy-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🚀</span>
                        </div>
                        <h4 className="text-xl font-semibold text-white mb-3">4. Stake & Grow</h4>
                        <p className="text-white/70 text-sm mb-3">
                          Claim UBI and auto-compound earnings into DeFi yields. Build sustainable wealth.
                        </p>
                        <div className="text-xs text-psy-orange bg-psy-orange/10 px-3 py-1 rounded-full">
                          Auto-Compound
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="psychat-card p-8">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🔒</div>
                        <h4 className="text-xl font-semibold text-white mb-3">Privacy First</h4>
                        <p className="text-white/70 text-sm">
                          Arcium ZK proofs ensure your data is encrypted while proving integrity. 
                          Only anonymized aggregates can be sold.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-4xl mb-4">👁️</div>
                        <h4 className="text-xl font-semibold text-white mb-3">Full Transparency</h4>
                        <p className="text-white/70 text-sm">
                          See exactly who's buying your data and why. AI companies, research labs, 
                          and wellness apps with verified ethics approval.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-4xl mb-4">💎</div>
                        <h4 className="text-xl font-semibold text-white mb-3">Fair Economics</h4>
                        <p className="text-white/70 text-sm">
                          70% of all revenue goes to you. The remaining 30% supports platform 
                          development and infrastructure.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Buyers */}
                  <div className="psychat-card p-8">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">Who's Buying Your Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-psy-blue mb-2">12</div>
                        <div className="text-sm text-white/60">AI Companies</div>
                        <div className="text-xs text-white/50">OpenAI, Anthropic, Google</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-psy-green mb-2">8</div>
                        <div className="text-sm text-white/60">Research Labs</div>
                        <div className="text-xs text-white/50">Stanford, MIT, Harvard</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-psy-purple mb-2">5</div>
                        <div className="text-sm text-white/60">Wellness Apps</div>
                        <div className="text-xs text-white/50">Headspace, Calm, BetterHelp</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-psy-orange mb-2">3</div>
                        <div className="text-sm text-white/60">Corporate</div>
                        <div className="text-xs text-white/50">Fortune 500 Companies</div>
                      </div>
                    </div>
                    
                    <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
                      <div className="text-sm text-white/80">
                        <strong>Verified & Ethics-Approved:</strong> All data buyers are verified and ethics-approved. 
                        Your mental health insights help advance AI empathy, academic research, and wellness innovation.
                      </div>
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div className="psychat-card p-8">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">Powered by Web3</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🔗</div>
                        <div className="text-sm font-semibold text-white">Solana</div>
                        <div className="text-xs text-white/60">Fast & Cheap</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">👻</div>
                        <div className="text-sm font-semibold text-white">Phantom</div>
                        <div className="text-xs text-white/60">Wallet</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🔒</div>
                        <div className="text-sm font-semibold text-white">Arcium</div>
                        <div className="text-xs text-white/60">ZK Privacy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏪</div>
                        <div className="text-sm font-semibold text-white">Raydium</div>
                        <div className="text-xs text-white/60">AMM Trading</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <div className="text-sm font-semibold text-white">Reflect</div>
                        <div className="text-xs text-white/60">$rUSD Payments</div>
                      </div>
                    </div>
                  </div>

                  {/* MotusDAO Ecosystem */}
                  <div className="psychat-card p-8">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">MotusDAO Complete Ecosystem</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div className="bg-psy-purple/10 border border-psy-purple/20 rounded-lg p-6">
                        <div className="text-3xl mb-4">🎯</div>
                        <h4 className="text-xl font-semibold text-white mb-3">PsyChat: Top of Funnel</h4>
                        <p className="text-white/80 text-sm mb-4">
                          PsyChat serves as the entry point, providing accessible AI therapy while identifying 
                          patients who need human intervention. This creates a sustainable funnel to 
                          qualified psychologists.
                        </p>
                        <div className="space-y-2 text-sm text-white/70">
                          <div className="flex items-center">
                            <span className="text-psy-purple mr-2">→</span>
                            AI-Human Hybrid Care Model
                          </div>
                          <div className="flex items-center">
                            <span className="text-psy-purple mr-2">→</span>
                            Price Accessible Mental Health
                          </div>
                          <div className="flex items-center">
                            <span className="text-psy-purple mr-2">→</span>
                            Economically Sound & Sustainable
                          </div>
                        </div>
                      </div>

                      <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-6">
                        <div className="text-3xl mb-4">🎓</div>
                        <h4 className="text-xl font-semibold text-white mb-3">MotusDAO Academy</h4>
                        <p className="text-white/80 text-sm mb-4">
                          Professional training program bridging the gap between AI and mental health 
                          state-of-the-art practices. Ensures ethical AI implementation and legal compliance.
                        </p>
                        <div className="space-y-2 text-sm text-white/70">
                          <div className="flex items-center">
                            <span className="text-psy-blue mr-2">→</span>
                            AI-Mental Health Integration Training
                          </div>
                          <div className="flex items-center">
                            <span className="text-psy-blue mr-2">→</span>
                            Ethical AI Implementation
                          </div>
                          <div className="flex items-center">
                            <span className="text-psy-blue mr-2">→</span>
                            Legal Compliance & Best Practices
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-psy-purple/20 to-psy-blue/20 border border-psy-purple/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4 text-center">Complete Ethical AI Solution</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/80">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🤖</div>
                          <div className="font-semibold mb-1">AI-First Approach</div>
                          <div className="text-xs text-white/60">Accessible, scalable mental health support</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">👨‍⚕️</div>
                          <div className="font-semibold mb-1">Human Oversight</div>
                          <div className="text-xs text-white/60">Qualified professionals when needed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">⚖️</div>
                          <div className="font-semibold mb-1">Legal Compliance</div>
                          <div className="text-xs text-white/60">Ethical standards & regulatory adherence</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div className="psychat-card p-8">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">Impact & Vision</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-psy-green mb-2">$500M</div>
                        <div className="text-sm text-white/60">Total Addressable Market</div>
                        <div className="text-xs text-white/50 mt-1">Mental health data economy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-psy-blue mb-2">40%</div>
                        <div className="text-sm text-white/60">Therapy Cost Reduction</div>
                        <div className="text-xs text-white/50 mt-1">Through tokenized subsidies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-psy-purple mb-2">1M+</div>
                        <div className="text-sm text-white/60">Scalable Users</div>
                        <div className="text-xs text-white/50 mt-1">Platform capacity</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-6">
                      <div className="text-sm text-white/80">
                        <strong>MotusDAO Vision:</strong> PsyChat is the entry point to our complete ecosystem. 
                        We're building a sustainable, ethical AI-human hybrid mental health solution that 
                        democratizes access while maintaining professional standards and legal compliance.
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="psychat-card p-8 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">Ready to Join the Dataconomy?</h3>
                    <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                      Connect your wallet and start earning from your mental health data today. 
                      Your privacy is protected, your data is valuable.
                    </p>
                    <div className="flex justify-center">
                      <ClientWalletButton />
                    </div>
                    <div className="text-white/60 text-sm mt-4">
                      🔒 Your data is encrypted with Arcium ZK proofs<br/>
                      💰 Earn from data marketplace via Raydium AMM<br/>
                      🚀 Auto-compound earnings with Reflect $rUSD
                    </div>
                  </div>
                </div>
              )}
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
