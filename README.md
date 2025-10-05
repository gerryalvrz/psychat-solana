# 🧠 PsyChat
## Solana-Native Mental Health Platform MVP

**Built for:** Cypherpunk Colosseum Hackathon 2025  
**Track:** Consumer Apps  
**Organization:** MotusDAO  
**Sponsors:** Phantom, Arcium, Raydium, Reflect, Triton  

---

## 🎯 Vision

PsyChat is a privacy-first mental health platform that empowers users to own their therapy data, earn from anonymized insights, and access sustainable DeFi yields. Built on Solana with 4+ sponsor integrations, it represents the future of mental health in Web3.

## ✨ Key Features

### 🔒 Privacy-First Design
- **Arcium ZK Encryption:** Client-side zero-knowledge proofs protect personal data
- **Soulbound HNFTs:** Non-transferable Health NFTs ensure data ownership
- **Anonymized Insights:** Only aggregated, privacy-preserving data is shared

### 🏪 Decentralized Marketplace
- **Raydium AMM Integration:** Fair pricing and instant liquidity for data trading
- **Reflect $rUSD Payments:** Stablecoin efficiency for therapy payments
- **Research Access:** Institutions can bid on anonymized mental health insights

### 💰 Sustainable UBI Streams
- **Auto-Compound Earnings:** DeFi yields from data sales (5-15% APY)
- **Multiple Yield Options:** Raydium pools, Forward Industries treasury, MotusDAO $PSY staking
- **Mobile-First UX:** Solana Mobile SDK + Dialect Blinks for viral sharing

## 🏗️ Architecture

### Frontend (Next.js)
```
pages/
├── index.tsx              # Main app with wallet integration
├── _app.tsx              # Wallet adapter setup
components/
├── Chat.tsx              # Therapy notes interface
├── Marketplace.tsx       # Data trading marketplace
└── Dashboard.tsx         # Earnings & yield farming
```

### Backend (Anchor)
```
programs/psychat/src/
└── lib.rs                # HNFT minting, marketplace, auto-compound
```

### Sponsor Integrations
```
utils/
└── sponsorIntegrations.ts # Phantom, Arcium, Raydium, Reflect, Dialect Blinks, Walrus
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Solana CLI
- Anchor Framework
- Phantom Wallet
 - Triton RPC (Devnet) or Surfpool access
 - OpenAI or xAI Grok API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/motusdao/psychat.git
cd psychat
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment (.env.local)**
Create `.env.local` in project root:
```bash
# Use OpenAI by default (paid subscription)
OPENAI_API_KEY=sk-...

# Optional: xAI Grok (set to use Grok)
XAI_API_KEY=xai-...

# Optional UI defaults
NEXT_PUBLIC_DEFAULT_PROVIDER=openai   # or xai
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4o-mini # or grok-4
```

4. **Set up Solana environment (use Triton RPC for devnet)**
```bash
solana config set --url https://api.devnet.triton.one
solana-keygen new --outfile ~/.config/solana/id.json
```

5. **Build and deploy Anchor program**
```bash
cd programs/psychat
anchor build
anchor deploy
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open in browser**
```
http://localhost:3000
```

### Grok vs OpenAI in the App
- In Chat, use the AI Provider dropdown to select OpenAI or xAI Grok.
- Models: examples `gpt-4o-mini`, `gpt-4o` (OpenAI) or `grok-4` (xAI).
- The backend auto-selects OpenAI if `OPENAI_API_KEY` is set; otherwise uses xAI if `XAI_API_KEY` is present.

## 🔧 Sponsor Integrations

### Phantom Wallet (Primary Sponsor)
- **Mobile-first wallet integration**
- **iOS/Android support via Solana Mobile SDK**
- **Seamless transaction signing**

```typescript
import { PhantomIntegration } from './utils/sponsorIntegrations';

// Connect Phantom wallet
const publicKey = await PhantomIntegration.connectWallet();

// Sign transactions
const signedTx = await PhantomIntegration.signTransaction(transaction);
```

### Arcium ZK Privacy (Privacy Sponsor)
- **Zero-knowledge encryption for therapy notes**
- **Privacy-preserving analytics**
- **Data integrity verification**

```typescript
import { ArciumIntegration } from './utils/sponsorIntegrations';

// Encrypt therapy data
const { encrypted, proof } = await ArciumIntegration.encryptData(therapyNote);

// Verify ZK proof
const isValid = await ArciumIntegration.verifyProof(proof, encrypted);
```

### Raydium AMM (DeFi Sponsor)
- **Automated market maker for data pricing**
- **Liquidity pools for data trading**
- **Yield farming integration**

```typescript
import { RaydiumIntegration } from './utils/sponsorIntegrations';

// Create liquidity pool
const poolId = await RaydiumIntegration.createLiquidityPool(
  connection, tokenA, tokenB, amountA, amountB
);

// Execute token swap
const txId = await RaydiumIntegration.swapTokens(
  connection, poolId, inputAmount, outputToken
);
```

### Reflect $rUSD (Stablecoin Sponsor)
### Triton RPC (Infra Sponsor)
- High-performance devnet RPC for hackathon testing
- Use with Surfpool for free devnet access

```bash
solana config set --url https://api.devnet.triton.one
```

### xAI Grok (AI Sponsor)
- Grok-4 model via OpenAI SDK-compatible API
- Base URL: `https://api.x.ai/v1`

```bash
export XAI_API_KEY=your_key_here
```

- **Stablecoin payments for therapy**
- **Auto-compound functionality**
- **DeFi yield optimization**

```typescript
import { ReflectIntegration } from './utils/sponsorIntegrations';

// Mint $rUSD
const txId = await ReflectIntegration.mintRUSD(amount);

// Auto-compound earnings
const compoundTx = await ReflectIntegration.autoCompound(amount);
```

## 📱 Mobile Experience

### Solana Mobile SDK
- **Native mobile wallet integration**
- **Optimized for Solana Mobile devices**
- **Seamless dApp Store experience**

### Dialect Blinks
- **Viral sharing of data listings**
- **One-tap payments and interactions**
- **Social media integration**

## 🎯 MotusDAO Department Alignment

### Data Sovereignty & Privacy
- ✅ Client-side ZK encryption with Arcium
- ✅ Soulbound HNFTs for data ownership
- ✅ Walrus decentralized storage

### Therapeutic Marketplace
- ✅ Raydium AMM for fair data pricing
- ✅ Anonymized insights for research
- ✅ Reflect $rUSD for therapy payments

### Investment & Resilience
- ✅ Auto-compound DeFi yields (5-15% APY)
- ✅ Multiple yield farming options
- ✅ Sustainable UBI streams

### AI & Analytics
- ✅ Privacy-preserving trend analysis
- ✅ Anonymized data aggregation
- ✅ Research insights generation

### Community Outreach
- ✅ Mobile-first design
- ✅ Dialect Blinks for viral sharing
- ✅ Solana Mobile SDK integration

## 📊 Impact Metrics

### Market Opportunity
- **$500M TAM** in mental health data economy
- **1M+ users** scalable platform capacity
- **40% therapy cost reduction** through tokenized subsidies

### Technical Metrics
- **~500 LOC frontend** (Next.js components)
- **~200 LOC backend** (Anchor program)
- **4 sponsor SDKs** integrated
- **Mobile-responsive** design

### User Benefits
- **Data ownership:** Users control their mental health data
- **Earnings potential:** Sustainable income from data insights
- **Privacy protection:** ZK encryption ensures data security
- **DeFi integration:** Auto-compound earnings into yields

## 🛠️ Development

### Code Structure
```
psychat/
├── pages/                 # Next.js pages
├── components/           # React components
├── programs/psychat/      # Anchor program
├── utils/                # Sponsor integrations
├── docs/                 # Documentation
└── styles/               # Tailwind CSS
```

### Key Files
- `pages/index.tsx` - Main application interface
- `components/Chat.tsx` - Therapy notes with ZK encryption
- `components/Marketplace.tsx` - Raydium-powered data trading
- `components/Dashboard.tsx` - Earnings and yield farming
- `programs/psychat/src/lib.rs` - Anchor program logic
- `utils/sponsorIntegrations.ts` - Sponsor SDK integrations

### Testing
```bash
# Run frontend tests
npm test

# Test Anchor program
anchor test

# Deploy to devnet
anchor deploy

# Verify RPC endpoint
solana config get
```

### Verify on Solscan (Devnet)

- After minting from the Chat "End Session & Mint HNFT" button, check the console for the transaction signature link.
- Paste the signature into: `https://solscan.io/tx/<SIG>?cluster=devnet`
- For HNFT: inspect the token mint and metadata; history URI points to Walrus, traits include sentiment.
- For Dataset NFT: verify metadata shows category and anonymized dataset hash.
- PDA data: check the derived PDA for `seeds=["hnft", userPubkey]` to view stored traits.

## 🎬 Demo

### 3-Minute Demo Script
See `docs/demo_script.md` for the complete demo presentation including:
- **Hook (30s):** Problem and solution overview
- **Flow (90s):** Live demonstration of core features
- **Impact (60s):** Market opportunity and technical innovation

### Key Demo Points
1. **Chat Interface:** Type therapy note → ZK encryption → HNFT minting
2. **Marketplace:** Browse listings → Place bid → Raydium AMM pricing
3. **Dashboard:** View earnings → Auto-compound → DeFi yields
4. **Mobile:** Solana Mobile SDK → Dialect Blinks → Viral sharing

## 🏆 Hackathon Submission

### Judging Criteria Alignment
- **40% Novelty/Impact:** First mental health data ownership platform on Solana
- **30% Execution:** 4+ sponsor integrations, working MVP
- **20% UX:** Mobile-first design, seamless wallet integration
- **10% Business Plan:** $500M TAM, sustainable UBI model

### Sponsor Integration Bonus
- ✅ **Phantom:** Primary wallet, mobile UX
- ✅ **Arcium:** ZK privacy, data encryption
- ✅ **Raydium:** AMM marketplace, yield farming
- ✅ **Reflect:** $rUSD payments, auto-compound
 - ✅ **Triton:** Devnet RPC + Surfpool

## 📄 License

MIT License - Open source per hackathon rules

## 🤝 Contributing

Built by the MotusDAO community for the Cypherpunk Colosseum hackathon.

### Team
- **MotusDAO:** Mental health Web3 platform
- **Cypherpunk Colosseum:** Solana hackathon
- **Sponsors:** Phantom, Arcium, Raydium, Reflect

## 🔗 Links

- **GitHub:** [github.com/motusdao/psychat](https://github.com/motusdao/psychat)
- **Demo:** [psychat.app](https://psychat.app)
- **MotusDAO:** [motusdao.org](https://motusdao.org)
- **Cypherpunk Colosseum:** [cypherpunkcolosseum.com](https://cypherpunkcolosseum.com)

---

**Built with ❤️ for the cypherpunk future of mental health**

*PsyChat - Own your data, earn from insights, heal the world*
