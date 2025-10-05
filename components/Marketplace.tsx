import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';

interface DataListing {
  id: string;
  title: string;
  description: string;
  category: 'anxiety' | 'depression' | 'stress' | 'relationships' | 'general';
  price: number;
  currency: 'SOL' | 'rUSD';
  seller: string;
  bids: number;
  endTime: Date;
  liquidity: number;
}

interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
}

export default function Marketplace() {
  const { publicKey } = useWallet();
  const [listings, setListings] = useState<DataListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<DataListing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'anxiety' | 'depression' | 'stress' | 'relationships'>('all');

  // Mock data for demo
  useEffect(() => {
    const mockListings: DataListing[] = [
      {
        id: '1',
        title: 'Anxiety Trends Q3 2024',
        description: 'Aggregated insights from 1,200+ therapy sessions focusing on anxiety patterns, triggers, and coping mechanisms.',
        category: 'anxiety',
        price: 2.5,
        currency: 'SOL',
        seller: 'MotusDAO Research',
        bids: 12,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        liquidity: 15000,
      },
      {
        id: '2',
        title: 'Depression Recovery Patterns',
        description: 'Anonymized data from 800+ users showing recovery trajectories and effective intervention points.',
        category: 'depression',
        price: 1.8,
        currency: 'rUSD',
        seller: 'PsyChat Community',
        bids: 8,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        liquidity: 8500,
      },
      {
        id: '3',
        title: 'Workplace Stress Analytics',
        description: 'Professional stress patterns and productivity correlations from remote work data.',
        category: 'stress',
        price: 3.2,
        currency: 'SOL',
        seller: 'Corporate Wellness',
        bids: 15,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        liquidity: 22000,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="psychat-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Data Marketplace</h2>
          <div className="text-sm text-white/60">
            Powered by Raydium AMM • {listings.length} listings
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2 mb-4">
          {['all', 'anxiety', 'depression', 'stress', 'relationships'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === cat
                  ? 'bg-psy-purple text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-sm text-white/60">
          💡 Anonymized mental health insights • 🔒 ZK-verified data integrity • 💰 Earn from your data
        </div>
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
              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(listing.category)}`}>
                {listing.category}
              </span>
              <span className="text-xs text-white/60">
                {formatTimeRemaining(listing.endTime)}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {listing.title}
            </h3>

            <p className="text-white/70 text-sm mb-4 line-clamp-2">
              {listing.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Price:</span>
                <span className="text-white font-semibold">
                  {listing.price} {listing.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Bids:</span>
                <span className="text-psy-green">{listing.bids}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Liquidity:</span>
                <span className="text-psy-blue">${listing.liquidity.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full psychat-button mt-4">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="psychat-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">
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
                <span className="text-white/60 text-sm">
                  by {selectedListing.seller}
                </span>
              </div>

              <p className="text-white/80">
                {selectedListing.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60 mb-1">Current Price</div>
                  <div className="text-2xl font-bold text-white">
                    {selectedListing.price} {selectedListing.currency}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60 mb-1">Total Bids</div>
                  <div className="text-2xl font-bold text-psy-green">
                    {selectedListing.bids}
                  </div>
                </div>
              </div>

              <div className="bg-psy-blue/10 border border-psy-blue/20 rounded-lg p-4">
                <div className="text-sm text-white/80 mb-2">
                  <strong>Raydium AMM Integration:</strong> This listing is powered by Raydium's 
                  automated market maker for fair pricing and instant liquidity.
                </div>
                <div className="text-sm text-white/60">
                  Liquidity Pool: ${selectedListing.liquidity.toLocaleString()}
                </div>
              </div>

              {/* Bid Section */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">Place Bid</h4>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Bid amount"
                    className="flex-1 psychat-input"
                  />
                  <button
                    onClick={() => handleBid(selectedListing.id)}
                    disabled={!bidAmount || isBidding}
                    className="psychat-button px-6 disabled:opacity-50"
                  >
                    {isBidding ? 'Bidding...' : 'Bid'}
                  </button>
                </div>
                <div className="text-xs text-white/60">
                  Payment via Reflect $rUSD • Auto-compound to DeFi yields
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="psychat-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold text-white mb-2">ZK Privacy</h4>
            <p className="text-sm text-white/70">
              Data is anonymized with Arcium ZK proofs to protect privacy while proving data integrity.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🏪</div>
            <h4 className="font-semibold text-white mb-2">Raydium AMM</h4>
            <p className="text-sm text-white/70">
              Fair pricing and instant liquidity through Raydium's automated market maker.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-white mb-2">Reflect Payments</h4>
            <p className="text-sm text-white/70">
              Secure payments with Reflect $rUSD and auto-compound earnings into DeFi yields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
