import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Line = dynamic(() => import('react-chartjs-2').then(m => m.Line), { ssr: false });
// Lazy register to avoid SSR issues
const lazyRegister = async () => {
  const chartMod = await import('chart.js');
  const ChartJS = (chartMod as any).Chart;
  const { LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip } = chartMod as any;
  ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);
};

interface Earnings {
  totalEarned: number;
  currency: 'SOL' | 'rUSD';
  fromDataSales: number;
  fromYieldFarming: number;
  autoCompounded: number;
}

interface YieldOption {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  protocol: 'Raydium' | 'Forward Industries' | 'MotusDAO Treasury';
  risk: 'Low' | 'Medium' | 'High';
  minStake: number;
}

interface HNFTStats {
  totalMinted: number;
  totalListed: number;
  totalSold: number;
  averagePrice: number;
}

export default function Dashboard() {
  const { publicKey, wallet } = useWallet() as any;
  const { connection } = useConnection();
  const [earnings, setEarnings] = useState<Earnings>({
    totalEarned: 12.5,
    currency: 'SOL',
    fromDataSales: 8.2,
    fromYieldFarming: 4.3,
    autoCompounded: 2.1,
  });

  const [hnftStats, setHnftStats] = useState<HNFTStats>({
    totalMinted: 15,
    totalListed: 8,
    totalSold: 5,
    averagePrice: 2.1,
  });

  const [yieldOptions, setYieldOptions] = useState<YieldOption[]>([]);
  const [selectedYield, setSelectedYield] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  useEffect(() => {
    // Register chart elements on client
    lazyRegister();

    // Mock yield farming options
    const mockYieldOptions: YieldOption[] = [
      {
        id: 'raydium-sol-usdc',
        name: 'SOL-USDC Pool',
        apy: 15.2,
        tvl: 2500000,
        protocol: 'Raydium',
        risk: 'Low',
        minStake: 0.1,
      },
      {
        id: 'forward-treasury',
        name: 'Forward Industries Treasury',
        apy: 12.8,
        tvl: 1800000,
        protocol: 'Forward Industries',
        risk: 'Low',
        minStake: 1.0,
      },
      {
        id: 'motusdao-psy',
        name: '$PSY Token Staking',
        apy: 18.5,
        tvl: 950000,
        protocol: 'MotusDAO Treasury',
        risk: 'Medium',
        minStake: 0.5,
      },
    ];
    setYieldOptions(mockYieldOptions);
  }, []);

  const handleStake = async () => {
    if (!selectedYield || !stakeAmount) return;

    setIsStaking(true);
    try {
      // Try on-chain stake via Anchor if configured; fallback to mock
      const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
      if (pid && publicKey) {
        try {
          const { getAnchorProgram } = await import('../lib/anchor');
          const program = getAnchorProgram(connection, wallet, pid);
          const sig = await (program as any).methods
            .stakeUbi()
            .accounts({ user: publicKey })
            .rpc();
          console.log('Stake UBI sig:', sig);
        } catch (e) {
          console.warn('Anchor stakeUbi unavailable, using mock:', e);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const amount = parseFloat(stakeAmount);
      setEarnings(prev => ({
        ...prev,
        autoCompounded: prev.autoCompounded + amount,
      }));

      setStakeAmount('');
      setSelectedYield('');
      console.log('Successfully staked via Reflect $rUSD');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatAPY = (apy: number) => {
    return `${apy.toFixed(1)}% APY`;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      Low: 'text-green-400',
      Medium: 'text-yellow-400',
      High: 'text-red-400',
    };
    return colors[risk as keyof typeof colors] || colors.Medium;
  };

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="psychat-card p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Earnings Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Total Earned</div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(earnings.totalEarned, earnings.currency)}
            </div>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">From Data Sales</div>
            <div className="text-xl font-semibold text-psy-green">
              {formatCurrency(earnings.fromDataSales, earnings.currency)}
            </div>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">From Yield Farming</div>
            <div className="text-xl font-semibold text-psy-blue">
              {formatCurrency(earnings.fromYieldFarming, earnings.currency)}
            </div>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Auto-Compounded</div>
            <div className="text-xl font-semibold text-psy-purple">
              {formatCurrency(earnings.autoCompounded, earnings.currency)}
            </div>
          </div>
        </div>

        <div className="bg-psy-green/10 border border-psy-green/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-psy-green">💰</span>
            <span className="font-semibold text-white">UBI Stream Active</span>
          </div>
          <p className="text-sm text-white/80">
            Your data earnings are automatically compounding at 5-15% APY, 
            creating a sustainable Universal Basic Income stream from your mental health insights.
          </p>
        </div>
      </div>

      {/* HNFT Statistics */}
      <div className="psychat-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Your HNFT Portfolio</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{hnftStats.totalMinted}</div>
            <div className="text-sm text-white/60">Total Minted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-psy-blue">{hnftStats.totalListed}</div>
            <div className="text-sm text-white/60">Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-psy-green">{hnftStats.totalSold}</div>
            <div className="text-sm text-white/60">Sold</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-psy-purple">
              {formatCurrency(hnftStats.averagePrice, 'SOL')}
            </div>
            <div className="text-sm text-white/60">Avg Price</div>
          </div>
        </div>
      </div>

      {/* Growth & UBI Chart */}
      <div className="psychat-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Growth & UBI Projection</h3>
        <div className="bg-white/5 rounded-lg p-4">
          {typeof window !== 'undefined' && (
            <Line
              data={{
                labels: ['Month 1', 'Month 3', 'Month 6', 'Month 12'],
                datasets: [
                  {
                    label: 'User Growth',
                    data: [100, 1000, 10000, 1000000],
                    borderColor: '#4BC0C0',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    fill: false,
                  },
                  {
                    label: 'UBI Earnings ($)',
                    data: [10, 100, 1000, 10000],
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { labels: { color: '#ffffff' } } },
                scales: {
                  x: { ticks: { color: '#cccccc' }, grid: { color: 'rgba(255,255,255,0.08)' } },
                  y: { beginAtZero: true, ticks: { color: '#cccccc' }, grid: { color: 'rgba(255,255,255,0.08)' } },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Yield Farming Options */}
      <div className="psychat-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">DeFi Yield Options</h3>
        <p className="text-white/70 mb-6">
          Auto-compound your earnings into high-yield DeFi protocols via Reflect $rUSD
        </p>

        <div className="space-y-4 mb-6">
          {yieldOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                selectedYield === option.id
                  ? 'border-psy-purple bg-psy-purple/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setSelectedYield(option.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{option.name}</h4>
                  <p className="text-sm text-white/60">{option.protocol}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-psy-green">
                    {formatAPY(option.apy)}
                  </div>
                  <div className="text-sm text-white/60">
                    TVL: ${(option.tvl / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm font-medium ${getRiskColor(option.risk)}`}>
                  {option.risk} Risk
                </span>
                <span className="text-sm text-white/60">
                  Min: {option.minStake} {earnings.currency}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Staking Interface */}
        {selectedYield && (
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">
              Stake in {yieldOptions.find(o => o.id === selectedYield)?.name}
            </h4>
            <div className="flex space-x-3">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount to stake"
                className="flex-1 psychat-input"
              />
              <button
                onClick={handleStake}
                disabled={!stakeAmount || isStaking}
                className="psychat-button px-6 disabled:opacity-50"
              >
                {isStaking ? 'Staking...' : 'Stake'}
              </button>
            </div>
            <div className="text-xs text-white/60 mt-2">
              Powered by Reflect $rUSD • Auto-compound enabled
            </div>
          </div>
        )}
      </div>

      {/* Impact Metrics */}
      <div className="psychat-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Impact Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-psy-green mb-2">$500M</div>
            <div className="text-sm text-white/60">Total Addressable Market</div>
            <div className="text-xs text-white/50 mt-1">
              Mental health data economy
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-psy-blue mb-2">40%</div>
            <div className="text-sm text-white/60">Therapy Cost Reduction</div>
            <div className="text-xs text-white/50 mt-1">
              Through tokenized subsidies
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-psy-purple mb-2">1M+</div>
            <div className="text-sm text-white/60">Scalable Users</div>
            <div className="text-xs text-white/50 mt-1">
              Platform capacity
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-psy-blue/10 border border-psy-blue/20 rounded-lg">
          <div className="text-sm text-white/80">
            <strong>MotusDAO Vision:</strong> PsyChat aligns with our mission to democratize 
            mental health access through Web3 technology. By tokenizing therapy data and 
            creating sustainable UBI streams, we're building a more equitable mental health ecosystem.
          </div>
        </div>
      </div>
    </div>
  );
}
