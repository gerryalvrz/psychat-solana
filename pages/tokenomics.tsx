import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HoloPanel, HoloButton, HoloText, HoloDivider } from '../components/ui/holo';
import { ComplexMolecule, WaterMolecule } from '../components/ui';

// ─── Fade-in variants ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08 } }),
};

// ─── Background depth layer ───────────────────────────────────────────────────
const DepthBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>
    {/* Base gradient */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #050C1A 0%, #0B101A 40%, #070D1F 100%)' }} />

    {/* Crystal grid */}
    <div className="absolute inset-0 crystal-grid-sparse opacity-30" />

    {/* Depth glows */}
    <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full"
      style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
    <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] rounded-full"
      style={{ background: 'radial-gradient(ellipse, rgba(225,68,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
      style={{ background: 'radial-gradient(ellipse, rgba(157,104,255,0.04) 0%, transparent 60%)', filter: 'blur(80px)' }} />

    {/* Molecules */}
    <div className="absolute top-[8%] right-[6%] opacity-20">
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <ComplexMolecule />
      </motion.div>
    </div>
    <div className="absolute bottom-[12%] left-[4%] opacity-15">
      <motion.div animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}>
        <WaterMolecule />
      </motion.div>
    </div>
    <div className="absolute top-[45%] right-[3%] opacity-10">
      <motion.div animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}>
        <WaterMolecule />
      </motion.div>
    </div>
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ id, className = '', style, children }) => (
  <section id={id} className={`relative w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-28 ${className}`} style={style}>
    {children}
  </section>
);

// ─── Section heading with holo accent ────────────────────────────────────────
const SectionHeading: React.FC<{ title: string; sub?: string; accent?: 'cyan' | 'magenta' }> = ({
  title, sub, accent = 'cyan'
}) => (
  <div className="mb-12">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-8 h-px" style={{ background: accent === 'cyan' ? 'rgba(0,229,255,0.6)' : 'rgba(225,68,255,0.6)', boxShadow: accent === 'cyan' ? '0 0 8px rgba(0,229,255,0.8)' : '0 0 8px rgba(225,68,255,0.8)' }} />
      <div style={{ fontFamily: 'Jura, Inter, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}>
        <HoloText size="xl" weight="bold" as="div">{title}</HoloText>
      </div>
    </div>
    {sub && (
      <p className="text-white/45 text-base sm:text-lg max-w-2xl ml-12" style={{ fontFamily: 'Inter, sans-serif' }}>
        {sub}
      </p>
    )}
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => (
  <motion.div variants={fadeUp} custom={index} initial="hidden" whileInView="show" viewport={{ once: true }}>
    <HoloPanel variant="elevated" size="lg" className="text-center h-full">
      <div
        className="text-2xl sm:text-3xl font-black mb-2 neon-solid-cyan"
        style={{ fontFamily: 'Orbitron, monospace' }}
      >
        {value}
      </div>
      <div className="text-white/50 text-sm leading-snug">{label}</div>
    </HoloPanel>
  </motion.div>
);

// ─── Flow diagram nodes ───────────────────────────────────────────────────────
const FlowNode: React.FC<{ label: string; sublabel: string; color: string }> = ({ label, sublabel, color }) => (
  <div
    className="rounded-xl px-4 py-3 text-center flex-shrink-0 relative overflow-hidden"
    style={{ background: `${color}14`, border: `1px solid ${color}50`, minWidth: '130px' }}
  >
    <div className="text-xs font-bold tracking-wide" style={{ color, fontFamily: 'JetBrains Mono, monospace', textShadow: `0 0 8px ${color}` }}>
      {label}
    </div>
    {sublabel && <div className="text-white/40 text-xs mt-0.5">{sublabel}</div>}
    {/* corner accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: color }} />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: color }} />
  </div>
);

const FlowArrow: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex flex-row items-center gap-1 px-2 py-1" style={{ minWidth: '50px' }}>
    {label && label !== '→' && (
      <span className="text-white/25 text-xs whitespace-nowrap mr-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {label}
      </span>
    )}
    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(0,229,255,0.1), rgba(0,229,255,0.4))', minWidth: '24px' }} />
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth="2.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </div>
);

const VerticalArrow: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex flex-col items-center py-1" style={{ minHeight: '36px' }}>
    <div className="w-px flex-1" style={{ background: 'linear-gradient(180deg, rgba(0,229,255,0.4), rgba(0,229,255,0.1))', minHeight: '20px' }} />
    {label && (
      <span className="text-white/25 text-xs my-1 whitespace-nowrap" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {label}
      </span>
    )}
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth="2.5" style={{ transform: 'rotate(90deg)' }}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Tokenomics() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const wallet = useWallet();
  const scriptLoaded = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  // Load Jupiter Plugin script once
  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const existing = document.querySelector('script[src="https://plugin.jup.ag/plugin-v1.js"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://plugin.jup.ag/plugin-v1.js';
    script.async = true;
    script.onload = () => {
      const Jupiter = (window as any).Jupiter;
      if (Jupiter) {
        Jupiter.init({
          displayMode: 'integrated',
          integratedTargetId: 'jupiter-plugin',
          enableWalletPassthrough: true,
          passthroughWalletContextState: wallet,
          formProps: {
            initialInputMint: 'So11111111111111111111111111111111111111112',
            initialOutputMint: 'rHX3T6NEUEEJCiYdsis4w8skE8kL2nkD9tHiS6mcyai',
          },
        });
      }
    };
    document.body.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync wallet state into Jupiter Plugin after connect/disconnect
  useEffect(() => {
    const Jupiter = (window as any).Jupiter;
    if (Jupiter?.syncProps) {
      Jupiter.syncProps({ passthroughWalletContextState: wallet });
    }
  }, [wallet.connected, wallet.publicKey, wallet]);
  if (!mounted) return null;

  const demandLoops = [
    {
      emoji: '🧠', label: 'Loop 1', title: 'PsyChat Requires $PSY', variant: 'elevated' as const,
      desc: 'PsyChat — our AI-powered clinical support tool — requires $PSY to access. Every therapy session, every AI query, every clinical tool interaction creates natural, recurring buy pressure. This is consumption demand, not speculation.',
    },
    {
      emoji: '🏢', label: 'Loop 2', title: 'Companies Buy $PSY for Data Access', variant: 'floating' as const,
      desc: 'Pharmaceutical companies, insurance providers, and research institutions buy $PSY on the open market to access anonymized mental health datasets. This value flows directly to the users who generated the data. Corporate treasury demand is the strongest form of buy pressure.',
    },
    {
      emoji: '🌱', label: 'Loop 3', title: 'Endowment & Impact Yield', variant: 'elevated' as const,
      desc: 'Instead of traditional donations that get spent and disappear, donors and investors deposit capital into a yield-generating structure. The principal stays intact or returns to the donor. The yield funds MotusDAO operations and Mental Basic Income distributions.',
    },
    {
      emoji: '🔄', label: 'Loop 4', title: 'Earned Rewards Through Engagement', variant: 'floating' as const,
      desc: 'Users earn $PSY through mental health engagement — attending therapy, sharing data, completing research surveys, using PsyChat. Earned rewards tied to real activity, creating a circular economy where participation generates value.',
    },
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1', label: 'LIVE', sublabel: 'Now', badge: '✅',
      color: '#00BFA5', borderColor: 'rgba(0,191,165,0.35)', labelBg: 'rgba(0,191,165,0.12)',
      items: [
        'app.motusdao.org — Operations platform for 100+ mental health professionals',
        'psychat.motusdao.org — AI-powered clinical support tool',
        '$PSY token launch on CyreneAI — Fair launch with locked liquidity',
        '1% trading fee revenue — Self-funding mechanism from Day 1',
        'Multi-chain infrastructure — Celo + Solana',
        'Agent architecture — AgentMotus multi-agent operations',
      ],
    },
    {
      phase: 'Phase 2', label: 'BUILDING', sublabel: 'Q2–Q3 2026', badge: '🔨',
      color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)', labelBg: 'rgba(245,158,11,0.1)',
      items: [
        'PsyChat $PSY-gated access tiers — Premium AI features for token holders',
        'Academy integration — $PSY payments for ACA 80-hour course enrollment',
        'NFT certification — On-chain professional credentials for practitioners',
        'Practitioner staking — Reputation and quality signals through $PSY stake',
        'prism-protocol — Privacy layer for sensitive clinical data',
        'RootRouter SDK — 40–70% LLM cost reduction for builders',
      ],
    },
    {
      phase: 'Phase 3', label: 'VISION', sublabel: 'Q4 2026+', badge: '🔮',
      color: '#818CF8', borderColor: 'rgba(129,140,248,0.3)', labelBg: 'rgba(129,140,248,0.1)',
      items: [
        'Mental Health Data Marketplace — Users own and monetize their clinical data',
        'Mental Basic Income — Earned rewards through mental health engagement',
        'Perpetual Impact Fund — Yield philanthropy for sustainable mental health funding',
        'Research Data Access — Institutions pay $PSY for anonymized datasets',
        'Community Endowment — Governed fund for scholarships, grants, underserved regions',
        'Cross-chain data sovereignty — Privacy-first, multi-chain health data rails',
      ],
    },
  ];

  const tokenDetails = [
    { field: 'Token Name', value: 'PsyChat ($PSY)' },
    { field: 'Blockchain', value: 'Solana' },
    { field: 'Token Standard', value: 'SPL-2022' },
    { field: 'Launchpad', value: 'CyreneAI (cyreneai.com)' },
    { field: 'Launch Date', value: 'March 3, 2026 — 3:00 PM UTC' },
    { field: 'Contract Address', value: 'rHX3T6NEUEEJCiYdsis4w8skE8kL2nkD9tHiS6mcyai' },
    { field: 'Trading Fee', value: '1% → Project Wallet' },
    { field: 'Launch Type', value: 'Fair Launch — Bonding Curve' },
    { field: 'Liquidity', value: 'Locked from Day 1' },
    { field: 'Pre-sale', value: 'None' },
    { field: 'VC Allocation', value: 'None' },
  ];

  const audienceTabs = [
    {
      label: 'Crypto-Native',
      content: "You're buying into a project with live products, real transaction volume, and 5 years of development. The 1% trading fee funds ongoing development — every trade makes the infrastructure stronger. CyreneAI's 100% bond rate means this is a curated launch, not a casino.",
    },
    {
      label: 'DeSci',
      content: '$PSY is the coordination layer for a mental health data marketplace where users own their data. Mental Basic Income, privacy-first architecture, and yield philanthropy — this is decentralized science applied to the most valuable data category on earth.',
    },
    {
      label: 'Practitioners',
      content: '$PSY connects you to the MotusDAO ecosystem — AI clinical tools, professional certification, client acquisition, and eventually, participation in the value your clinical work creates. 80-hour ACA course with NFT certification.',
    },
    {
      label: 'Builders',
      content: 'RootRouter SDK cuts LLM costs 40–70%. prism-protocol handles privacy. AgentMotus provides multi-agent operations. Real infrastructure you can integrate with. $PSY coordinates the builder ecosystem.',
    },
  ];

  return (
    <>
      <Head>
        <title>PsyChat — $PSY Tokenomics</title>
        <meta name="description" content="$PSY is the coordination token for mental health infrastructure. Fair launch on CyreneAI — March 3, 2026. Learn about token utility, demand loops, roadmap, and the MotusDAO ecosystem." />
        <meta property="og:title" content="PsyChat — $PSY Tokenomics" />
        <meta property="og:description" content="The coordination token for mental health infrastructure. Fair launch on CyreneAI, March 3, 2026." />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen w-full text-white antialiased psychat-gradient">
        <DepthBackground />

        {/* ── Top nav bar ──────────────────────────────────────────────────── */}
        <div
          className="fixed top-0 left-0 right-0 z-50 crystal-glass"
          style={{ borderBottom: '1px solid rgba(0,229,255,0.1)', backdropFilter: 'blur(20px)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              PsyChat
            </Link>
            <span className="text-xs text-white/25 tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              $PSY · NOW LIVE
            </span>
            <a
              href="https://jup.ag/tokens/rHX3T6NEUEEJCiYdsis4w8skE8kL2nkD9tHiS6mcyai"
              target="_blank" rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <HoloButton variant="primary" size="sm">Trade $PSY ↗</HoloButton>
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 · HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-14 overflow-hidden">

          {/* Hero-specific glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(0,191,165,0.18) 0%, transparent 65%)', filter: 'blur(50px)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(225,68,255,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }} />

            {/* Geometric accent lines */}
            <div className="absolute top-[15%] left-[10%] w-32 h-px crystal-line opacity-40" />
            <div className="absolute top-[15%] left-[10%] w-px h-32 crystal-line opacity-40" />
            <div className="absolute bottom-[15%] right-[10%] w-32 h-px crystal-line-magenta opacity-40" />
            <div className="absolute bottom-[15%] right-[10%] w-px h-32 crystal-line-magenta opacity-40" />

            {/* Crystal grid on hero */}
            <div className="absolute inset-0 crystal-grid-sparse opacity-20" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Eyebrow pill */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs mb-10 tracking-widest uppercase crystal-glass"
                style={{ border: '1px solid rgba(0,229,255,0.25)', color: '#00E5FF', fontFamily: 'JetBrains Mono, monospace' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Now Live · $PSY · Solana
              </div>
            </motion.div>

            {/* $PSY main title */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="font-black leading-none tracking-tight mb-6"
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(5rem, 18vw, 11rem)',
                background: 'linear-gradient(135deg, #00BFA5 0%, #00FFFF 40%, #E144FF 80%, #00BFA5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 50px rgba(0,229,255,0.5)) drop-shadow(0 0 80px rgba(225,68,255,0.3))',
                backgroundSize: '200% 200%',
              }}
            >
              $PSY
            </motion.h1>

            {/* Subtitle */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
              <div className="mb-4" style={{ fontFamily: 'Jura, Inter, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', opacity: 0.8 }}>
                <HoloText size="xl" weight="normal" as="p">
                  The coordination token for mental health infrastructure
                </HoloText>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="text-white/35 text-sm sm:text-base mb-12 tracking-widest"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Now trading on Jupiter &nbsp;·&nbsp; Launched March 3, 2026
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://jup.ag/tokens/rHX3T6NEUEEJCiYdsis4w8skE8kL2nkD9tHiS6mcyai" target="_blank" rel="noopener noreferrer">
                <HoloButton variant="primary" size="lg" className="w-full sm:w-auto">
                  Trade $PSY on Jupiter ↗
                </HoloButton>
              </a>
              <a href="https://psychat.motusdao.org" target="_blank" rel="noopener noreferrer">
                <HoloButton variant="ghost" size="lg" className="w-full sm:w-auto">
                  Try PsyChat
                </HoloButton>
              </a>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs">
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>scroll</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 · PROJECT VISION
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="vision">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading title="Why $PSY Exists" />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">
              {/* Copy */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} className="space-y-5">
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  Mental health generates extremely valuable data. Current platforms extract this data — users get nothing. MotusDAO has spent 5 years building mental health infrastructure that inverts this model.
                </p>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  <span className="neon-solid-cyan font-semibold">$PSY</span> is the coordination token that aligns early participants with a mental health data marketplace — where users own their data, share in the value it creates, and practitioners coordinate through transparent on-chain incentives.
                </p>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  $PSY is not a memecoin. It&apos;s not governance. It&apos;s an economic primitive for a new kind of mental health economy.
                </p>

                {/* Inline accent bar */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-12 h-px crystal-line" />
                  <span className="text-xs text-white/30 tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    5 years of infrastructure
                  </span>
                </div>
              </motion.div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '5 Years', label: 'Building through the bear market', i: 1 },
                  { value: '100+', label: 'Psychologists on the platform', i: 2 },
                  { value: '10+', label: 'Countries represented', i: 3 },
                  { value: '$700+/mo', label: 'Transaction volume', i: 4 },
                ].map((stat) => (
                  <StatCard key={stat.value} value={stat.value} label={stat.label} index={stat.i} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 · FOUR DEMAND LOOPS
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="utility">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading
                title="How $PSY Works"
                sub="Four interlocking demand loops that create a sustainable token economy"
                accent="magenta"
              />
            </motion.div>

            {/* 4 cards */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
              {demandLoops.map((loop, i) => (
                <motion.div key={loop.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
                  <HoloPanel variant={loop.variant} size="lg" className="h-full flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 crystal-glass"
                        style={{ border: '1px solid rgba(0,229,255,0.2)' }}>
                        {loop.emoji}
                      </div>
                      <span className="text-xs font-semibold tracking-widest uppercase neon-solid-cyan" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {loop.label}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base mb-2" style={{ fontFamily: 'Jura, Inter, sans-serif' }}>
                        {loop.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">{loop.desc}</p>
                    </div>
                  </HoloPanel>
                </motion.div>
              ))}
            </div>

            {/* Flow diagram */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <HoloPanel variant="default" size="xl">
                <h3 className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-8 text-center"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  Token Flow Diagram
                </h3>

                <div className="space-y-0 overflow-x-auto">
                  {/* Row 1 */}
                  <div className="flex flex-col sm:flex-row items-center gap-0">
                    <FlowNode label="COMPANIES" sublabel="buy $PSY" color="#00BFA5" />
                    <FlowArrow label="PAY USERS FOR DATA" />
                    <FlowNode label="USERS" sublabel="earn $PSY" color="#00E5FF" />
                  </div>

                  {/* Vertical from USERS */}
                  <div className="flex flex-col items-end">
                    <div className="flex flex-col items-center" style={{ width: '160px' }}>
                      <VerticalArrow label="use $PSY for services" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="flex flex-col sm:flex-row items-center gap-0 justify-end">
                    <FlowNode label="USE $PSY FOR SERVICES" sublabel="PsyChat · Therapy · AI" color="#818CF8" />
                  </div>

                  <div className="flex justify-end">
                    <div className="flex flex-col items-center" style={{ width: '210px' }}>
                      <VerticalArrow />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="flex flex-col sm:flex-row items-center gap-0 justify-end">
                    <FlowNode label="FEES (1%)" sublabel="per transaction" color="#F59E0B" />
                    <FlowArrow />
                    <FlowNode label="PROJECT WALLET" sublabel="" color="#F59E0B" />
                  </div>

                  <div className="flex justify-end">
                    <div className="flex flex-col items-center" style={{ width: '160px' }}>
                      <VerticalArrow />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="flex justify-end">
                    <FlowNode label="DEVELOPMENT + MBI POOL" sublabel="ongoing funding" color="#F59E0B" />
                  </div>

                  {/* Separator */}
                  <div className="my-6 border-t border-dashed border-white/8" />

                  {/* Row 5 */}
                  <div className="flex flex-col sm:flex-row items-center gap-0">
                    <FlowNode label="DONORS / INVESTORS" sublabel="principal preserved" color="#10B981" />
                    <FlowArrow />
                    <FlowNode label="ENDOWMENT" sublabel="principal preserved" color="#10B981" />
                  </div>

                  <div className="flex" style={{ paddingLeft: '220px' }}>
                    <div className="flex flex-col items-center" style={{ width: '140px' }}>
                      <VerticalArrow />
                    </div>
                  </div>

                  {/* Row 6 */}
                  <div className="flex flex-col sm:flex-row items-center gap-0">
                    <FlowNode label="YIELD" sublabel="principal stays intact" color="#00BFA5" />
                    <FlowArrow />
                    <FlowNode label="MBI DISTRIBUTIONS + OPERATIONS" sublabel="" color="#00E5FF" />
                  </div>
                </div>
              </HoloPanel>
            </motion.div>
          </div>
        </Section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 · LAUNCH STRATEGY
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="launch">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading
                title="Fair Launch on CyreneAI"
                sub="No pre-sale. No VC. No private rounds. Everyone enters the same curve."
              />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* How CyreneAI Works */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
                <HoloPanel variant="elevated" size="xl" className="h-full">
                  <div className="mb-4" style={{ fontFamily: 'Jura, Inter, sans-serif' }}><HoloText size="base" weight="semibold" as="div">How CyreneAI Works</HoloText></div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    CyreneAI is a curated, invite-only fair launch platform on Solana. It&apos;s the only launchpad with a 100% bond rate — every token launched on CyreneAI successfully bonds. Projects are vetted before launch, and liquidity is locked from Day 1.
                  </p>
                </HoloPanel>
              </motion.div>

              {/* Revenue model callout */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}>
                <HoloPanel variant="floating" size="xl" className="h-full">
                  <div className="text-xs font-semibold tracking-widest uppercase mb-3 neon-solid-magenta" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Revenue Model
                  </div>
                  <p className="text-white font-semibold text-xl mb-3" style={{ fontFamily: 'Jura, Inter, sans-serif' }}>
                    1% of all $PSY trading fees → Project Wallet
                  </p>
                  <p className="text-white/55 text-sm leading-relaxed">
                    Every trade directly funds development of live infrastructure. The team does not need to sell tokens to fund development. Revenue scales with trading activity. Fully transparent, fully on-chain.
                  </p>
                </HoloPanel>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Mechanism timeline */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}>
                <HoloPanel variant="default" size="xl" className="h-full">
                  <div className="mb-6" style={{ fontFamily: 'Jura, Inter, sans-serif' }}><HoloText size="base" weight="semibold" as="div">The Mechanism</HoloText></div>
                  <div className="space-y-0">
                    {[
                      'CyreneAI deploys the $PSY token contract',
                      'A portion of the SAFT allocation is fractionalized into 100 transparent cliffs',
                      'Each cliff (0.01%) unlocks automatically as the bonding curve fills',
                      'Price discovery happens through the bonding curve — early buyers get lower prices',
                      'Once bonded, liquidity is locked permanently',
                      'Trading is open and permissionless from Day 1',
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 crystal-glass"
                            style={{ border: '1px solid rgba(0,191,165,0.5)', color: '#00BFA5', textShadow: '0 0 8px rgba(0,191,165,0.8)' }}>
                            {i + 1}
                          </div>
                          {i < 5 && <div className="w-px flex-1 my-1" style={{ background: 'rgba(0,191,165,0.15)', minHeight: '20px' }} />}
                        </div>
                        <div className="pb-5 pt-1">
                          <p className="text-white/60 text-sm leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </HoloPanel>
              </motion.div>

              {/* What we don't have */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={4}>
                <HoloPanel variant="default" size="xl" className="h-full">
                  <div className="mb-6" style={{ fontFamily: 'Jura, Inter, sans-serif' }}><HoloText size="base" weight="semibold" as="div">What We Don&apos;t Have</HoloText></div>
                  <div className="space-y-3">
                    {[
                      'No private sale',
                      'No seed round',
                      'No VC allocation',
                      'No advisor tokens',
                      'No hidden wallets',
                      'No surprise unlock schedules',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 crystal-glass"
                          style={{ border: '1px solid rgba(0,191,165,0.4)' }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#00BFA5" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white/70 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </HoloPanel>
              </motion.div>
            </div>
          </div>
        </Section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 · ROADMAP
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="roadmap">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading
                title="Roadmap"
                sub="What's live, what's building, and what's next — clearly separated."
                accent="magenta"
              />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {roadmapPhases.map((phase, i) => (
                <motion.div key={phase.phase} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
                  <HoloPanel
                    variant={i === 0 ? 'elevated' : i === 1 ? 'default' : 'floating'}
                    size="xl"
                    className="h-full flex flex-col gap-5"
                  >
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
                        style={{ background: phase.labelBg, color: phase.color, fontFamily: 'JetBrains Mono, monospace', textShadow: `0 0 8px ${phase.color}` }}
                      >
                        {phase.badge} {phase.label}
                      </span>
                      <h3 className="font-semibold text-lg" style={{ fontFamily: 'Jura, Inter, sans-serif', color: phase.color }}>
                        {phase.phase}
                      </h3>
                      <p className="text-white/35 text-xs mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {phase.sublabel}
                      </p>
                    </div>
                    <ul className="space-y-3 flex-1">
                      {phase.items.map((item) => (
                        <li key={item} className="flex gap-2.5 items-start">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: phase.color, boxShadow: `0 0 4px ${phase.color}` }} />
                          <span className="text-white/60 text-sm leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </HoloPanel>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 · TOKEN DETAILS
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="token-details">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading title="Token Information" />
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <HoloPanel variant="elevated" size="lg" className="overflow-hidden p-0">
                {tokenDetails.map((row, i) => (
                  <div
                    key={row.field}
                    className="flex flex-col sm:flex-row sm:items-center"
                    style={{ borderBottom: i < tokenDetails.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(0,229,255,0.02)' : 'transparent' }}
                  >
                    <div
                      className="sm:w-52 lg:w-64 px-6 py-4 text-xs font-semibold tracking-widest uppercase flex-shrink-0 neon-solid-cyan"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {row.field}
                    </div>
                    <div className="flex-1 px-6 py-4 text-white/75 text-sm sm:border-l font-mono break-all" style={{ borderColor: 'rgba(0,229,255,0.08)' }}>
                      {row.value}
                    </div>
                  </div>
                ))}
              </HoloPanel>
            </motion.div>
          </div>
        </Section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7 · TRADE $PSY — JUPITER TERMINAL EMBED
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="trade">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading
                title="Trade $PSY"
                sub="Swap directly below — powered by Jupiter, the leading Solana DEX aggregator"
                accent="cyan"
              />
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {/* Jupiter Terminal integrated embed */}
              <div
                className="rounded-2xl overflow-hidden crystal-glass"
                style={{ border: '1px solid rgba(0,229,255,0.2)', minHeight: '560px' }}
              >
                <div id="jupiter-plugin" style={{ height: '560px', width: '100%' }} />
              </div>

              {/* Fallback / external link */}
              <p className="text-center text-white/30 text-xs mt-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Having trouble?&nbsp;
                <a
                  href="https://jup.ag/tokens/rHX3T6NEUEEJCiYdsis4w8skE8kL2nkD9tHiS6mcyai"
                  target="_blank" rel="noopener noreferrer"
                  className="text-cyan-400/60 hover:text-cyan-400 transition-colors underline"
                >
                  Open on Jupiter ↗
                </a>
              </p>
            </motion.div>
          </div>
        </Section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 8 · AUDIENCE TABS
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="audience">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <SectionHeading title="Who Is $PSY For?" accent="magenta" />
            </motion.div>

            {/* Tab buttons */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap gap-3 mb-8">
              {audienceTabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className="transition-all duration-200"
                >
                  <HoloButton
                    variant={activeTab === i ? 'primary' : 'ghost'}
                    size="md"
                  >
                    {tab.label}
                  </HoloButton>
                </button>
              ))}
            </motion.div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HoloPanel variant="elevated" size="xl">
                <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {audienceTabs[activeTab].content}
                </p>
              </HoloPanel>
            </motion.div>

            {/* Card grid for larger screens */}
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {audienceTabs.map((tab, i) => (
                <motion.div key={tab.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
                  <HoloPanel
                    variant={activeTab === i ? 'elevated' : 'default'}
                    size="lg"
                    interactive
                    onClick={() => setActiveTab(i)}
                    className="cursor-pointer"
                  >
                    <h4 className="font-semibold text-base mb-3" style={{ fontFamily: 'Jura, Inter, sans-serif' }}>
                      <span className={activeTab === i ? 'neon-solid-cyan' : 'text-white/70'}>
                        For {tab.label}
                      </span>
                    </h4>
                    <p className="text-white/50 text-sm leading-relaxed">{tab.content}</p>
                  </HoloPanel>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <HoloDivider />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 8 · CTA / FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-28 text-center overflow-hidden">
          {/* Footer depth glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(0,191,165,0.12) 0%, transparent 65%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(225,68,255,0.07) 0%, transparent 65%)', filter: 'blur(60px)' }} />
            {/* Corner lines */}
            <div className="absolute top-8 left-8 w-24 h-px crystal-line opacity-30" />
            <div className="absolute top-8 left-8 w-px h-24 crystal-line opacity-30" />
            <div className="absolute top-8 right-8 w-24 h-px crystal-line-magenta opacity-30" />
            <div className="absolute top-8 right-8 w-px h-24 crystal-line-magenta opacity-30" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="mb-3" style={{ fontFamily: 'Jura, Inter, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                <HoloText size="xl" weight="bold" as="div">Trade $PSY Now</HoloText>
              </div>
              <p className="text-white/35 mb-10 text-sm tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                NOW LIVE · SOLANA · JUPITER DEX
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <a href="https://jup.ag/tokens/rHX3T6NEUEEJCiYdsis4w8skE8kL2nkD9tHiS6mcyai" target="_blank" rel="noopener noreferrer">
                <HoloButton variant="primary" size="lg" className="w-full sm:w-auto">
                  Trade $PSY on Jupiter ↗
                </HoloButton>
              </a>
              <a href="https://psychat.motusdao.org" target="_blank" rel="noopener noreferrer">
                <HoloButton variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore PsyChat Now
                </HoloButton>
              </a>
            </motion.div>

            <HoloDivider />

            {/* Links row */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
              className="flex flex-wrap justify-center gap-8 text-sm my-10">
              {[
                { label: 'app.motusdao.org', href: 'https://app.motusdao.org' },
                { label: 'motusdao.org', href: 'https://motusdao.org' },
                { label: '@MotusDAO', href: 'https://twitter.com/MotusDAO' },
                { label: 'GitHub', href: 'https://github.com/Motus-DAO' },
              ].map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="text-white/35 hover:text-white/80 transition-colors"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {link.label}
                </a>
              ))}
            </motion.div>

            <HoloDivider />

            {/* Disclaimer */}
            <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}
              className="mt-8 text-white/20 text-xs leading-relaxed max-w-2xl mx-auto">
              $PSY is a coordination token. It is not a security, not financial advice, and not a guarantee of returns. All information about future utility represents development goals, not promises. Trade responsibly.
            </motion.p>
          </div>
        </section>

      </div>
    </>
  );
}
