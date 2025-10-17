import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import Dashboard from '../components/Dashboard';
import Marketplace from '../components/Marketplace';
import VideoChat from '../components/VideoChat';
import Profile from './profile';
import ClientWalletButton from '../components/ClientWalletButton';
import LetterGlitch from '../components/backgrounds/LetterGlitch';
import SpotlightCard from '../components/SpotlightCard';
import Carousel from '../components/Carousel';
import Dock from '../components/Dock';
import DecryptedText from '../components/DecryptedText';
import FaultyTerminal from '../components/FaultyTerminal';
// import TerminalLoader from '../components/TerminalLoader';
import { 
  HiHome, 
  HiChat, 
  HiVideoCamera, 
  HiShoppingBag, 
  HiChartBar,
  HiUser
} from 'react-icons/hi';

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'videochat' | 'marketplace' | 'dashboard' | 'profile'>('home');
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  if (!mounted || showLoader) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 15, 35, 0.95) 100%)',
        backdropFilter: 'blur(2px)'
      }}>
        {/* FaultyTerminal Background */}
        <div className="absolute inset-0 z-0">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={0.3}
            glitchAmount={0.5}
            flickerAmount={0.3}
            noiseAmp={0.8}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#00ff00"
            mouseReact={true}
            mouseStrength={0.3}
            pageLoadAnimation={false}
            brightness={0.4}
          />
        </div>
        
        {/* Terminal Container */}
        <div className="w-full max-w-4xl mx-4 relative z-10">
          {/* Terminal Header */}
          <div className="bg-black border border-gray-500 px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500"></div>
            <div className="w-2 h-2 bg-yellow-500"></div>
            <div className="w-2 h-2 bg-green-500"></div>
            <div className="ml-4 text-gray-300 text-xs font-mono">
              PsyChat Terminal v1.0.0
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-black border border-gray-500 p-6 font-mono text-green-500 min-h-[400px]">
            {/* Terminal Prompt */}
            <div className="flex items-center mb-4">
              <span className="text-green-500 mr-2">$</span>
              <span className="text-gray-400">psycat --init --lunarpunk</span>
              <div className="w-2 h-4 bg-green-500 ml-1 animate-pulse"></div>
            </div>

            {/* Welcome Message with Decrypted Animation */}
            <div className="space-y-2 mb-6">
              <DecryptedText
                text="Welcome to the Lunarpunk world,"
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="A new kind of Liquid Public Goods."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="An AI Dataconomy that empowers humans."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="From Degen to Regen tokenomics."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="Self-custody and sovereignty."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
              <DecryptedText
                text="This is the future of mental health in Web3."
                speed={80}
                maxIterations={15}
                sequential={true}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                className="text-green-500"
                encryptedClassName="text-gray-500"
                animateOn="view"
              />
            </div>

            {/* Loading Animation */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-500">Loading PsyChat modules...</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-yellow-500 animate-bounce"></div>
                  <div className="w-1 h-1 bg-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              
              <div className="w-full bg-gray-800 h-1 mb-4">
                <div className="bg-green-500 h-1 animate-pulse"></div>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="mt-8 pt-4 border-t border-gray-500">
              <div className="text-gray-400 text-sm">
                <div>Initializing Web3 connection...</div>
                <div>Loading AI models...</div>
                <div>Setting up decentralized storage...</div>
              </div>
            </div>

            {/* Cursor */}
            <div className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <LetterGlitch 
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
          glitchSpeed={50}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
        />
      </div>
      <div className="relative z-10">
        {/* Header */}
        <header className="p-4 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => setShowLoader(true)}
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

      {/* Dock Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Dock 
          items={[
            { icon: <HiHome className="text-green-400" size={24} />, label: 'Home', onClick: () => setActiveTab('home') },
            { icon: <HiChat className="text-green-400" size={24} />, label: 'Chat', onClick: () => setActiveTab('chat') },
            { icon: <HiVideoCamera className="text-green-400" size={24} />, label: 'Video', onClick: () => setActiveTab('videochat') },
            { icon: <HiShoppingBag className="text-green-400" size={24} />, label: 'Marketplace', onClick: () => setActiveTab('marketplace') },
            { icon: <HiChartBar className="text-green-400" size={24} />, label: 'Dashboard', onClick: () => setActiveTab('dashboard') },
            { icon: <HiUser className="text-green-400" size={24} />, label: 'Profile', onClick: () => setActiveTab('profile') },
          ]}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>

      {/* Main Content */}
      <main className="p-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {!connected ? (
            <SpotlightCard className="p-8 text-center" spotlightColor="rgba(97, 220, 163, 0.2)">
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
            </SpotlightCard>
          ) : (
            <>
              {activeTab === 'home' && (
                <div className="space-y-12">
                  {/* Hero Section */}
                  <SpotlightCard className="p-8 text-center" spotlightColor="rgba(97, 220, 163, 0.2)">
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
                  </SpotlightCard>

                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SpotlightCard className="p-6" spotlightColor="rgba(248, 113, 113, 0.2)">
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
                    </SpotlightCard>

                    <SpotlightCard className="p-6" spotlightColor="rgba(74, 222, 128, 0.2)">
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
                    </SpotlightCard>
                  </div>

                  {/* How It Works */}
                  <SpotlightCard className="p-8" spotlightColor="rgba(147, 51, 234, 0.2)">
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
                  </SpotlightCard>

                  {/* Key Features */}
                  <SpotlightCard className="p-8" spotlightColor="rgba(97, 179, 220, 0.2)">
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
                  </SpotlightCard>

                  {/* Data Buyers */}
                  <SpotlightCard className="p-8" spotlightColor="rgba(97, 220, 163, 0.2)">
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
                  </SpotlightCard>

                  {/* Technology Stack */}
                  <SpotlightCard className="p-8" spotlightColor="rgba(147, 51, 234, 0.2)">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">Powered by Web3</h3>
                    <div style={{ height: '600px', position: 'relative' }} className="flex justify-center">
                      <Carousel
                        baseWidth={300}
                        autoplay={true}
                        autoplayDelay={3000}
                        pauseOnHover={true}
                        loop={true}
                        round={false}
                        items={[
                          {
                            title: 'Solana',
                            description: 'Fast & Cheap blockchain',
                            id: 1,
                            icon: <span className="text-2xl">🔗</span>
                          },
                          {
                            title: 'Phantom',
                            description: 'Wallet integration',
                            id: 2,
                            icon: <span className="text-2xl">👻</span>
                          },
                          {
                            title: 'Arcium',
                            description: 'ZK Privacy protection',
                            id: 3,
                            icon: <span className="text-2xl">🔒</span>
                          },
                          {
                            title: 'Raydium',
                            description: 'AMM Trading',
                            id: 4,
                            icon: <span className="text-2xl">🏪</span>
                          },
                          {
                            title: 'Reflect',
                            description: '$rUSD Payments',
                            id: 5,
                            icon: <span className="text-2xl">💰</span>
                          }
                        ]}
                      />
                    </div>
                  </SpotlightCard>

                  {/* MotusDAO Ecosystem */}
                  <SpotlightCard className="p-8" spotlightColor="rgba(97, 179, 220, 0.2)">
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
                  </SpotlightCard>

                  {/* Impact Metrics */}
                  <SpotlightCard className="p-8" spotlightColor="rgba(97, 220, 163, 0.2)">
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
                  </SpotlightCard>

                  {/* Call to Action */}
                  <SpotlightCard className="p-8 text-center" spotlightColor="rgba(147, 51, 234, 0.2)">
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
                  </SpotlightCard>
                </div>
              )}
              {activeTab === 'chat' && <Chat />}
              {activeTab === 'videochat' && <VideoChat />}
              {activeTab === 'marketplace' && <Marketplace />}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'profile' && <Profile />}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-white/20 mt-8 pb-24">
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
    </div>
  );
}
