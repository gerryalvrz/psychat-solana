import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chat from '../components/Chat';
import Dashboard from '../components/Dashboard';
import Marketplace from '../components/Marketplace';
import VideoChat from '../components/VideoChat';
import Profile from './profile';
import ClientWalletButton from '../components/ClientWalletButton';
// import LetterGlitch from '../components/backgrounds/LetterGlitch';
import Dock from '../components/Dock';
import DecryptedText from '../components/DecryptedText';
import FaultyTerminal from '../components/FaultyTerminal';
// import TerminalLoader from '../components/TerminalLoader';
import { HoloPanel, HoloButton, HoloText, HoloDivider } from '../components/ui/holo';
import { ComplexMolecule, WaterMolecule } from '../components/ui';
import GridDistortion from '../components/GridDistortion';
import BackgroundLayer from '../components/BackgroundLayer';
import { 
  HiHome, 
  HiChat, 
  HiVideoCamera, 
  HiShoppingBag, 
  HiChartBar,
  HiUser
} from 'react-icons/hi';

// Section Components
import {
  HeroTerminalSection,
  HowItWorksSection,
  DataconomySection,
  ProblemSolutionSection,
  FeaturesShowcaseSection,
  BuyersInsightSection,
  EcosystemImpactSection,
  JoinCTASection
} from '../components/sections';

export default function Home() {
  const { connected, connect } = useWallet();
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
      <div className="fixed inset-0 flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 15, 35, 0.95) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 100
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
            <button 
              onClick={handleLoaderComplete}
              className="w-2 h-2 bg-red-500 hover:bg-red-400 transition-colors cursor-pointer rounded-full"
              title="Close loader"
            ></button>
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
              <span className="text-gray-400">psychat --init --lunarpunk</span>
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
    <div className="min-h-screen relative overflow-hidden cursor-crosshair" style={{ backgroundColor: '#0B101A' }}>
      {/* GridDistortion Background - Single source of truth */}
      <BackgroundLayer layer="deep">
        <GridDistortion
          imageSrc=""
          grid={12}
          mouse={0.15}
          strength={0.08}
          relaxation={0.95}
          className="w-full h-full"
        />
      </BackgroundLayer>
      
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="p-4 border-b border-white/20 relative z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => setShowLoader(true)}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold font-futuristic tracking-wider text-white">
              PsyChat
            </h1>
            <span className="text-sm text-white/70">by MotusDAO</span>
          </button>
          <ClientWalletButton />
        </div>
      </header>

      {/* Dock Navigation */}
      <div className="fixed inset-y-0 left-0 z-50">
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
      <main className="p-4 pl-24 pb-24">
        <div className="max-w-6xl mx-auto">
          {!connected ? (
            <div className="max-w-4xl mx-auto">
              <div>
                {/* Terminal Header */}
                <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div className="ml-4 text-gray-300 text-sm font-mono">PsyChat Terminal v1.0.0</div>
                </div>
                {/* Terminal Body */}
                <div className="bg-black border-2 border-gray-700 rounded-b-lg p-6 font-mono text-green-400">
                  {/* Prompt */}
                  <div className="flex items-center mb-4">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-gray-400">psychat --welcome --connect</span>
                    <div className="w-2 h-4 bg-green-400 ml-1 animate-pulse" />
                  </div>
                  {/* Content */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">ᴪ</div>
                    <h2 className="text-3xl font-bold text-green-400 mb-4">Welcome to PsyChat</h2>
                    <p className="text-green-300/80 mb-6 max-w-2xl mx-auto">
                      The future of mental health is here. Own your therapy data, earn from anonymized insights, and build sustainable wealth through the dataconomy. Your privacy is protected, your data is valuable.
                    </p>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <ClientWalletButton />
                      </div>
                      <div className="text-green-300/70 text-sm">
                        🔒 Your data is encrypted with Arcium ZK proofs<br/>
                        💰 Earn from data marketplace via Raydium AMM<br/>
                        🚀 Auto-compound earnings with Reflect $rUSD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'home' && (
                <main>
                  <HeroTerminalSection
                    onConnect={async () => {
                      try {
                        await connect?.();
                      } catch (e) {
                        // swallow; component will print failure line
                      }
                    }}
                    onNavigate={(tab) => {
                      if (tab === 'chat') {
                        setActiveTab('chat');
                      }
                      if (tab === 'learn') {
                        const el = document.querySelector('[data-how-it-works]');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                  />
                  
                  {/* Section Divider */}
                  <div className="my-16">
                    <HoloDivider variant="horizontal" thickness="medium" />
                  </div>
                  
                  <DataconomySection />
                  
                  {/* Section Divider */}
                  <div className="my-16">
                    <HoloDivider variant="horizontal" thickness="medium" />
                  </div>
                  
                  <HowItWorksSection />
                  
                  {/* Section Divider */}
                  <div className="my-16">
                    <HoloDivider variant="horizontal" thickness="medium" />
                  </div>
                  
                  <ProblemSolutionSection />
                  
                  {/* Section Divider */}
                  <div className="my-16">
                    <HoloDivider variant="horizontal" thickness="medium" />
                  </div>
                  
                  <FeaturesShowcaseSection />
                  
                  {/* Section Divider */}
                  <div className="my-16">
                    <HoloDivider variant="horizontal" thickness="medium" />
                  </div>
                  
                  <BuyersInsightSection />
                  
                  {/* Section Divider */}
                  <div className="my-16">
                    <HoloDivider variant="horizontal" thickness="medium" />
                  </div>
                  
                  <EcosystemImpactSection />
                  
                  {/* Section Divider */}
                  <div className="my-16">
                    <HoloDivider variant="horizontal" thickness="medium" />
                  </div>
                  
                  <JoinCTASection />
                </main>
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
            <span className="text-green-400"> Phantom</span> • 
            <span className="text-blue-400"> Arcium</span> • 
            <span className="text-purple-400"> Raydium</span> • 
            <span className="text-green-400"> Reflect</span>
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
