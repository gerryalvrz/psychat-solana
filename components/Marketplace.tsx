import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { getAnchorProgram } from '../lib/anchor';
import { keccak256 } from 'js-sha3';
import { WalrusIntegration } from '../utils/sponsorIntegrations';
import { PublicKey, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import TokenAMM from './TokenAMM';

interface DataListing {
  id: string;
  title: string;
  description: string;
  category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'general';
  price: number;
        currency: 'PSY' | 'rUSD';
  seller: string;
  buyer: string;
  buyerType: 'AI Training' | 'Academic Research' | 'Consumer Patterns' | 'Corporate Wellness';
  purpose: string;
  bids: number;
  endTime: Date;
  liquidity: number;
  verified: boolean;
  ethicsApproved: boolean;
}

interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
}

export default function Marketplace() {
  const { publicKey, wallet } = useWallet() as any;
  const { connection } = useConnection();
  const [listings, setListings] = useState<DataListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<DataListing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'anxiety' | 'depression' | 'stress' | 'relationships'>('all');
  const [nftMetadata, setNftMetadata] = useState<Map<string, any>>(new Map());
  const [showTrading, setShowTrading] = useState(false);
  const [showBuyerDirectory, setShowBuyerDirectory] = useState(false);

  // Fetch NFT metadata from Metaplex
  const fetchNFTMetadata = async (mintAddress: string) => {
    try {
      const metaplex = Metaplex.make(connection);
      const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
      
      if (nft) {
        setNftMetadata(prev => new Map(prev.set(mintAddress, {
          name: nft.name,
          symbol: nft.symbol,
          description: nft.json?.description || '',
          image: nft.json?.image,
          attributes: nft.json?.attributes || [],
          uri: nft.uri
        })));
      }
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
    }
  };

  // Mock data for demo with buyer transparency
  useEffect(() => {
    const mockListings: DataListing[] = [
      {
        id: '1',
        title: 'Anxiety Patterns in Remote Workers',
        description: 'ZK-verified insights from 2,400+ therapy sessions revealing anxiety triggers, coping mechanisms, and recovery patterns in remote work environments.',
        category: 'anxiety',
        price: 4.2,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'OpenAI Research',
        buyerType: 'AI Training',
        purpose: 'Training GPT-5 on mental health empathy and therapeutic responses for remote workers',
        bids: 1247,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        liquidity: 28000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '2',
        title: 'Depression Recovery Trajectories',
        description: 'Anonymized data from 1,800+ users showing depression recovery patterns, intervention effectiveness, and long-term outcomes with ZK privacy proofs.',
        category: 'depression',
        price: 3.8,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Stanford Psychology Lab',
        buyerType: 'Academic Research',
        purpose: 'Peer-reviewed research on depression intervention timing and effectiveness',
        bids: 892,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        liquidity: 18500,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '3',
        title: 'Workplace Stress & Productivity Analytics',
        description: 'Professional stress patterns, burnout indicators, and productivity correlations from 3,200+ corporate wellness sessions.',
        category: 'stress',
        price: 2.9,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Microsoft Employee Wellness',
        buyerType: 'Corporate Wellness',
        purpose: 'Enhancing employee wellness programs and stress management initiatives',
        bids: 2156,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        liquidity: 35000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '4',
        title: 'Relationship Communication Patterns',
        description: 'Communication styles, conflict resolution strategies, and relationship satisfaction data from 1,500+ couples therapy sessions.',
        category: 'relationships',
        price: 3.5,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'BetterHelp',
        buyerType: 'Consumer Patterns',
        purpose: 'Improving therapist matching algorithms and relationship counseling quality',
        bids: 634,
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        liquidity: 22000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '5',
        title: 'Teen Mental Health Trends',
        description: 'Insights from 2,100+ teen therapy sessions covering social media impact, peer pressure, and academic stress patterns.',
        category: 'anxiety',
        price: 4.7,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'UNICEF Mental Health',
        buyerType: 'Academic Research',
        purpose: 'Global youth mental health policy development and intervention strategies',
        bids: 3421,
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        liquidity: 42000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '6',
        title: 'Meditation & Mindfulness Effectiveness',
        description: 'Data from 1,900+ meditation sessions showing effectiveness patterns, user engagement, and mental health outcomes.',
        category: 'stress',
        price: 2.3,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Headspace Inc.',
        buyerType: 'Consumer Patterns',
        purpose: 'Optimizing meditation app features and personalized mindfulness recommendations',
        bids: 1873,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        liquidity: 16500,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '7',
        title: 'PTSD Recovery Patterns',
        description: 'Trauma recovery insights from 800+ specialized therapy sessions with anonymized PTSD treatment outcomes and coping strategies.',
        category: 'depression',
        price: 5.1,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'NIH Research',
        buyerType: 'Academic Research',
        purpose: 'Clinical research on PTSD treatment effectiveness and recovery timelines',
        bids: 456,
        endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        liquidity: 38000,
        verified: true,
        ethicsApproved: true,
      },
      {
        id: '8',
        title: 'AI Therapy Interaction Patterns',
        description: 'User interaction data from 3,500+ AI therapy sessions showing engagement patterns, effectiveness metrics, and user preferences.',
        category: 'general',
        price: 3.2,
        currency: 'PSY',
        seller: 'PsyChat Community',
        buyer: 'Anthropic AI',
        buyerType: 'AI Training',
        purpose: 'Training Claude for more empathetic and effective AI therapy responses',
        bids: 2894,
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        liquidity: 45000,
        verified: true,
        ethicsApproved: true,
      },
    ];
    setListings(mockListings);
  }, []);

  const filteredListings = listings.filter(listing => 
    filter === 'all' || listing.category === filter
  );

  const handleBid = async (listingId: string) => {
    if (!publicKey || !bidAmount) return;

    setIsBidding(true);
    try {
      // Mock Raydium AMM integration for bidding
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update listing with new bid
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, bids: listing.bids + 1 }
          : listing
      ));

      setBidAmount('');
      console.log('Bid placed successfully via Raydium AMM');
    } catch (error) {
      console.error('Bidding failed:', error);
    } finally {
      setIsBidding(false);
    }
  };

  const handleClaim = async (category: string) => {
    if (!publicKey) return;
    const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
    if (!pid) {
      alert('Program not configured');
      return;
    }
    try {
      const program = await getAnchorProgram(connection, wallet, pid);
      const proof = keccak256(category + '_valid');
      const sig = await (program as any).methods
        .claimUbi(proof, category)
        .accounts({ user: publicKey })
        .rpc();
      console.log('Claim $PSY sig:', sig);
      alert('Claimed $PSY! Verify on Solscan.');
    } catch (e: any) {
      console.error('Claim failed', e);
      alert('Claim failed: ' + (e?.message || String(e)));
    }
  };


  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending soon';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      anxiety: 'bg-yellow-500/20 text-yellow-300',
      depression: 'bg-blue-500/20 text-blue-300',
      stress: 'bg-red-500/20 text-red-300',
      relationships: 'bg-pink-500/20 text-pink-300',
      general: 'bg-gray-500/20 text-gray-300',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getBuyerTypeColor = (buyerType: string) => {
    const colors = {
      'AI Training': 'bg-purple-500/20 text-purple-300',
      'Academic Research': 'bg-blue-500/20 text-blue-300',
      'Consumer Patterns': 'bg-green-500/20 text-green-300',
      'Corporate Wellness': 'bg-orange-500/20 text-orange-300',
    };
    return colors[buyerType as keyof typeof colors] || colors['AI Training'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-display text-h1 text-white">Data Marketplace</h2>
          <div className="text-body text-body-sm text-white/60">
            Powered by Raydium AMM • {listings.length} listings
          </div>
        </div>
        <div className="text-caption text-white/60">
          Verify transactions on <a className="underline" href={`https://solscan.io/?cluster=devnet`} target="_blank" rel="noreferrer">Solscan (devnet)</a>
        </div>

        <div className="text-body text-body-sm text-white/60 mb-4">
          💡 Anonymized mental health insights • 🔒 ZK-verified data integrity • 💰 Earn from your data
        </div>

        {/* How It Works Steps */}
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <h3 className="text-heading text-h3 text-white mb-3">How Your Data Works for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-psy-purple rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                <div>
                  <div className="text-heading text-h6 text-white">Generate Valuable Insights</div>
                  <div className="text-caption text-white/70">Your conversations create anonymized mental health patterns and therapeutic insights</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-psy-blue rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                <div>
                  <div className="text-heading text-h6 text-white">Self-Custody & Sovereignty</div>
                  <div className="text-caption text-white/70">You own your data completely - stored in your wallet, controlled by you</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-psy-green rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                <div>
                  <div className="text-heading text-h6 text-white">Choose to Monetize</div>
                  <div className="text-caption text-white/70">List your insights for verified buyers or keep them private - your choice</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">4</div>
                <div>
                  <div className="text-heading text-h6 text-white">Earn $PSY Tokens</div>
                  <div className="text-caption text-white/70">Get paid in $PSY tokens with 95% revenue share, auto-compound DeFi yields</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-caption text-white/60">
              <strong>Key Benefits:</strong> Complete liquid RWAs ownership • ZK privacy protection • Transparent buyer verification • 
              Fair pricing via Raydium AMM • Your data, your rules
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-4">
        {['all', 'anxiety', 'depression', 'stress', 'relationships'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-3 py-1 rounded-full text-body text-body-sm transition-colors ${
              filter === cat
                ? 'bg-psy-purple text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="psychat-card p-6 cursor-pointer hover:bg-black/30 transition-colors"
            onClick={() => setSelectedListing(listing)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(listing.category)}`}>
                  {listing.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getBuyerTypeColor(listing.buyerType)}`}>
                  {listing.buyerType}
                </span>
              </div>
              <span className="text-xs text-white/60">
                {formatTimeRemaining(listing.endTime)}
              </span>
            </div>

            <h3 className="text-heading text-h3 text-white mb-2">
              {listing.title}
            </h3>

            <div className="mb-3">
              <div className="text-body text-body-sm text-psy-blue mb-1">
                👤 {listing.buyer}
              </div>
              <div className="text-caption text-white/70">
                Purpose: {listing.purpose}
              </div>
            </div>

            <p className="text-body text-body-sm text-white/70 mb-4 line-clamp-2">
              {listing.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-body text-body-sm">
                <span className="text-white/60">Price:</span>
                <span className="text-mono text-body-md text-white">
                  {listing.price} {listing.currency}
                </span>
              </div>
              <div className="flex justify-between text-body text-body-sm">
                <span className="text-white/60">Data Sources:</span>
                <span className="text-mono text-body-md text-psy-green">{listing.bids} sellers</span>
              </div>
              <div className="flex justify-between text-body text-body-sm">
                <span className="text-white/60">Liquidity:</span>
                <span className="text-mono text-body-md text-psy-blue">${listing.liquidity.toLocaleString()}</span>
              </div>
              <div className="flex space-x-2 mt-2">
                {listing.verified && (
                  <span className="text-caption bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    ✓ Verified Buyer
                  </span>
                )}
                {listing.ethicsApproved && (
                  <span className="text-caption bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    ✓ Ethics Approved
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="w-full psychat-button" onClick={() => setSelectedListing(listing)}>
                View Details
              </button>
              <button className="w-full psychat-button bg-psy-green" onClick={() => handleClaim(listing.category)}>
                Claim $PSY
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="psychat-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-display text-h2 text-white">
                {selectedListing.title}
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${getCategoryColor(selectedListing.category)}`}>
                  {selectedListing.category}
                </span>
                <span className="text-body text-body-sm text-white/60">
                  by {selectedListing.seller}
                </span>
              </div>

              <p className="text-body text-body-md text-white/80">
                {selectedListing.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-body text-body-sm text-white/60 mb-1">Current Price</div>
                  <div className="text-mono text-h2 text-white">
                    {selectedListing.price} {selectedListing.currency}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-body text-body-sm text-white/60 mb-1">Data Sources</div>
                  <div className="text-mono text-h2 text-psy-green">
                    {selectedListing.bids} sellers
                  </div>
                </div>
              </div>

              <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
                <div className="text-body text-body-sm text-white/80 mb-2">
                  <strong>Raydium AMM Integration:</strong> This listing is powered by Raydium's 
                  automated market maker for fair pricing and instant liquidity.
                </div>
                <div className="text-body text-body-sm text-white/60">
                  Liquidity Pool: ${selectedListing.liquidity.toLocaleString()}
                </div>
              </div>

              {/* Purchase Section */}
              <div className="space-y-3">
                <h4 className="text-heading text-h4 text-white">Purchase Aggregated Data</h4>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Purchase amount"
                    className="flex-1 psychat-input"
                  />
                  <button
                    onClick={() => handleBid(selectedListing.id)}
                    disabled={!bidAmount || isBidding}
                    className="psychat-button px-6 disabled:opacity-50"
                  >
                    {isBidding ? 'Purchasing...' : 'Purchase'}
                  </button>
                </div>
                <div className="text-caption text-white/60">
                  Access aggregated data from {selectedListing.bids} sellers • Payment via $PSY tokens • 95% revenue to data owners
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Buyer Directory */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading text-h3 text-white">Data Buyer Directory</h3>
          <button
            onClick={() => setShowBuyerDirectory(true)}
            className="psychat-button bg-psy-blue hover:bg-psy-blue/80 transition-colors flex items-center space-x-2"
          >
            <span>🔍</span>
            <span>Explore Buyers</span>
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-psy-blue/10 to-psy-purple/10 border border-psy-blue/20 rounded-lg p-4">
          <div className="text-body text-body-sm text-white/80 mb-2">
            <strong>Full Transparency:</strong> See exactly who's buying your data and why. 
            All buyers are verified and ethics-approved.
          </div>
          <div className="text-caption text-white/60">
            Revenue Split: 95% to you, 5% to platform • All transactions on-chain
          </div>
        </div>
      </div>

      {/* Token Trading Section */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading text-h3 text-white">Token Trading</h3>
          <button
            onClick={() => setShowTrading(!showTrading)}
            className="psychat-button bg-psy-purple hover:bg-psy-purple/80 transition-colors"
          >
            {showTrading ? 'Hide Trading' : 'Show Trading'}
          </button>
        </div>
        
        {!showTrading && (
          <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
            <div className="text-body text-body-sm text-white/80 mb-2">
              <strong>AMM Trading Available:</strong> Trade $PSY and $rUSD tokens with instant liquidity through Raydium AMM.
            </div>
            <div className="text-caption text-white/60">
              Click "Show Trading" to access the trading interface and participate in the PsyChat token economy.
            </div>
          </div>
        )}
        
        {showTrading && (
          <div className="mt-4">
            <TokenAMM />
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="psychat-card p-6">
        <h3 className="text-heading text-h3 text-white mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="text-heading text-h5 text-white mb-2">ZK Privacy</h4>
            <p className="text-body text-body-sm text-white/70">
              Data is anonymized with Arcium ZK proofs to protect privacy while proving data integrity.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🏪</div>
            <h4 className="text-heading text-h5 text-white mb-2">Raydium AMM</h4>
            <p className="text-body text-body-sm text-white/70">
              Fair pricing and instant liquidity through Raydium's automated market maker.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="text-heading text-h5 text-white mb-2">$PSY Token Payments</h4>
            <p className="text-body text-body-sm text-white/70">
              Secure payments with $PSY tokens and auto-compound earnings into DeFi yields.
            </p>
          </div>
        </div>
      </div>

      {/* Data Buyer Directory Modal */}
      {showBuyerDirectory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="psychat-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-display text-h2 text-white">Data Buyer Directory</h3>
              <button
                onClick={() => setShowBuyerDirectory(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* AI Companies */}
              <div className="bg-gradient-to-br from-psy-blue/20 to-psy-blue/5 border border-psy-blue/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-blue rounded-full flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <div className="text-heading text-h4 text-white">AI Companies</div>
                    <div className="text-body text-body-sm text-psy-blue">12 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-body text-body-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">OpenAI</span>
                    <span className="text-mono text-psy-green">$2.3M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Anthropic</span>
                    <span className="text-mono text-psy-green">$1.8M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Google DeepMind</span>
                    <span className="text-mono text-psy-green">$3.1M spent</span>
                  </div>
                </div>
                <div className="mt-3 text-caption text-white/60">
                  Focus: Training LLMs for therapeutic responses and mental health empathy
                </div>
              </div>

              {/* Research Labs */}
              <div className="bg-gradient-to-br from-psy-green/20 to-psy-green/5 border border-psy-green/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-green rounded-full flex items-center justify-center text-white font-bold">R</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Research Labs</div>
                    <div className="text-body text-body-sm text-psy-green">8 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Stanford Psychology</span>
                    <span className="text-psy-green">$890K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">MIT Brain Sciences</span>
                    <span className="text-psy-green">$1.2M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Harvard Medical</span>
                    <span className="text-psy-green">$750K spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Peer-reviewed research on mental health patterns and interventions
                </div>
              </div>

              {/* Wellness Apps */}
              <div className="bg-gradient-to-br from-psy-purple/20 to-psy-purple/5 border border-psy-purple/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-purple rounded-full flex items-center justify-center text-white font-bold">W</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Wellness Apps</div>
                    <div className="text-body text-body-sm text-psy-purple">5 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Headspace</span>
                    <span className="text-psy-green">$1.5M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Calm</span>
                    <span className="text-psy-green">$2.1M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">BetterHelp</span>
                    <span className="text-psy-green">$980K spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Improving user experience and therapeutic matching algorithms
                </div>
              </div>

              {/* Corporate Wellness */}
              <div className="bg-gradient-to-br from-psy-orange/20 to-psy-orange/5 border border-psy-orange/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-psy-orange rounded-full flex items-center justify-center text-white font-bold">C</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Corporate</div>
                    <div className="text-body text-body-sm text-psy-orange">3 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Microsoft</span>
                    <span className="text-psy-green">$1.2M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Salesforce</span>
                    <span className="text-psy-green">$890K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Meta</span>
                    <span className="text-psy-green">$1.6M spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Employee wellness programs and workplace mental health initiatives
                </div>
              </div>

              {/* Government & NGOs */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">G</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Government & NGOs</div>
                    <div className="text-body text-body-sm text-yellow-400">4 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">WHO Mental Health</span>
                    <span className="text-psy-green">$2.8M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">NIH Research</span>
                    <span className="text-psy-green">$1.9M spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">UNICEF</span>
                    <span className="text-psy-green">$1.3M spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Global mental health policy and public health initiatives
                </div>
              </div>

              {/* Academic Institutions */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <div>
                    <div className="text-heading text-h4 text-white">Academic</div>
                    <div className="text-body text-body-sm text-cyan-400">6 Active Buyers</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">UCLA Psychology</span>
                    <span className="text-psy-green">$650K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Oxford Psychiatry</span>
                    <span className="text-psy-green">$780K spent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Yale Medicine</span>
                    <span className="text-psy-green">$920K spent</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  Focus: Clinical research and evidence-based therapy development
                </div>
              </div>
            </div>

            <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
              <div className="text-body text-body-sm text-white/80 mb-2">
                <strong>Verification Process:</strong> All buyers undergo strict verification including ethics review, 
                data usage transparency, and compliance with privacy regulations.
              </div>
              <div className="text-caption text-white/60">
                Total Market Value: $28.7M • Average Purchase: $2,400 • 95% Revenue Share to Data Owners
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
