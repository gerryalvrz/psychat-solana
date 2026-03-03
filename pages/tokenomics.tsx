import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ─── Animated background grid ────────────────────────────────────────────────
const GridBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,191,165,0.12) 0%, transparent 70%)',
      }}
    />
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ id, className = '', style, children }) => (
  <section
    id={id}
    className={`relative w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-28 ${className}`}
    style={style}
  >
    {children}
  </section>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionHeading: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div className="mb-12">
    <h2
      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
      style={{ fontFamily: 'Jura, Inter, sans-serif' }}
    >
      {title}
    </h2>
    {sub && (
      <p className="text-base sm:text-lg text-white/50 max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
        {sub}
      </p>
    )}
  </div>
);

// ─── Teal accent text ─────────────────────────────────────────────────────────
const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: '#00E5FF' }}>{children}</span>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider: React.FC = () => (
  <div
    className="w-full h-px"
    style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)' }}
  />
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Tokenomics() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const demandLoops = [
    {
      emoji: '🧠',
      title: 'PsyChat Requires $PSY',
      label: 'Service Demand',
      desc: 'PsyChat — our AI-powered clinical support tool — requires $PSY to access. Every therapy session, every AI query, every clinical tool interaction creates natural, recurring buy pressure. This is consumption demand, not speculation.',
    },
    {
      emoji: '🏢',
      title: 'Companies Buy $PSY for Data Access',
      label: 'Data Marketplace',
      desc: 'Pharmaceutical companies, insurance providers, and research institutions buy $PSY on the open market to access anonymized mental health datasets. This value flows directly to the users who generated the data. Corporate treasury demand is the strongest form of buy pressure.',
    },
    {
      emoji: '🌱',
      title: 'Endowment & Impact Yield',
      label: 'Perpetual Impact Fund',
      desc: 'Instead of traditional donations that get spent and disappear, donors and investors deposit capital into a yield-generating structure. The principal stays intact or returns to the donor. The yield funds MotusDAO operations and Mental Basic Income distributions. This adds deep liquidity and TVL without sell pressure.',
    },
    {
      emoji: '🔄',
      title: 'Earned Rewards Through Engagement',
      label: 'Mental Basic Income',
      desc: 'Users earn $PSY through mental health engagement — attending therapy, sharing data, completing research surveys, using PsyChat. These are earned rewards tied to real activity, creating a circular economy where participation generates value.',
    },
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      label: 'LIVE',
      color: '#00BFA5',
      bgColor: 'rgba(0,191,165,0.08)',
      borderColor: 'rgba(0,191,165,0.3)',
      labelBg: 'rgba(0,191,165,0.15)',
      badge: '✅',
      sublabel: 'Now',
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
      phase: 'Phase 2',
      label: 'BUILDING',
      color: '#F59E0B',
      bgColor: 'rgba(245,158,11,0.06)',
      borderColor: 'rgba(245,158,11,0.25)',
      labelBg: 'rgba(245,158,11,0.15)',
      badge: '🔨',
      sublabel: 'Q2–Q3 2026',
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
      phase: 'Phase 3',
      label: 'VISION',
      color: '#818CF8',
      bgColor: 'rgba(129,140,248,0.06)',
      borderColor: 'rgba(129,140,248,0.25)',
      labelBg: 'rgba(129,140,248,0.15)',
      badge: '🔮',
      sublabel: 'Q4 2026+',
      items: [
        'Mental Health Data Marketplace — Users own and monetize their clinical data',
        'Mental Basic Income — Earned rewards through mental health engagement',
        'Perpetual Impact Fund — Yield philanthropy for sustainable mental health funding',
        'Research Data Access — Institutions pay $PSY for anonymized, aggregated datasets',
        'Community Endowment — Governed fund for scholarships, grants, and underserved regions',
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
    { field: 'Contract Address', value: '[Updated at launch]' },
    { field: 'Trading Fee', value: '1% → Project Wallet' },
    { field: 'Launch Type', value: 'Fair Launch — Bonding Curve' },
    { field: 'Liquidity', value: 'Locked from Day 1' },
    { field: 'Pre-sale', value: 'None' },
    { field: 'VC Allocation', value: 'None' },
  ];

  const audienceTabs = [
    {
      label: 'Crypto-Native',
      content:
        "You're buying into a project with live products, real transaction volume, and 5 years of development. The 1% trading fee funds ongoing development — every trade makes the infrastructure stronger. CyreneAI's 100% bond rate means this is a curated launch, not a casino.",
    },
    {
      label: 'DeSci',
      content:
        '$PSY is the coordination layer for a mental health data marketplace where users own their data. Mental Basic Income, privacy-first architecture, and yield philanthropy — this is decentralized science applied to the most valuable data category on earth.',
    },
    {
      label: 'Practitioners',
      content:
        '$PSY connects you to the MotusDAO ecosystem — AI clinical tools, professional certification, client acquisition, and eventually, participation in the value your clinical work creates. 80-hour ACA course with NFT certification.',
    },
    {
      label: 'Builders',
      content:
        'RootRouter SDK cuts LLM costs 40–70%. prism-protocol handles privacy. AgentMotus provides multi-agent operations. Real infrastructure you can integrate with. $PSY coordinates the builder ecosystem.',
    },
  ];

  return (
    <>
      <Head>
        <title>PsyChat — $PSY Tokenomics</title>
        <meta
          name="description"
          content="$PSY is the coordination token for mental health infrastructure. Fair launch on CyreneAI — March 3, 2026. Learn about token utility, demand loops, roadmap, and the MotusDAO ecosystem."
        />
        <meta property="og:title" content="PsyChat — $PSY Tokenomics" />
        <meta
          property="og:description"
          content="The coordination token for mental health infrastructure. Fair launch on CyreneAI, March 3, 2026."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PsyChat — $PSY Tokenomics" />
        <meta
          name="twitter:description"
          content="The coordination token for mental health infrastructure. Fair launch on CyreneAI, March 3, 2026."
        />
      </Head>

      <div
        className="min-h-screen w-full text-white antialiased"
        style={{ background: '#0A1628', fontFamily: 'Inter, sans-serif' }}
      >

        {/* ── Back nav ─────────────────────────────────────────────────────── */}
        <div className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              PsyChat
            </Link>
            <span className="text-xs text-white/30" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              $PSY · March 3, 2026
            </span>
            <a
              href="https://cyreneai.com/preview-page/psychat"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}
            >
              Join Launch ↗
            </a>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1 · HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-14"
          style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 60%, #0A1628 100%)' }}
        >
          <GridBackground />

          {/* Glow orb */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: '600px',
              height: '400px',
              background: 'radial-gradient(ellipse, rgba(0,191,165,0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden
          />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8 tracking-widest uppercase"
              style={{
                border: '1px solid rgba(0,229,255,0.2)',
                background: 'rgba(0,229,255,0.06)',
                color: '#00E5FF',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Fair Launch · CyreneAI · March 3, 2026
            </div>

            {/* Main title */}
            <h1
              className="text-7xl sm:text-8xl lg:text-9xl font-black mb-6 leading-none tracking-tight"
              style={{
                fontFamily: 'Orbitron, JetBrains Mono, monospace',
                background: 'linear-gradient(135deg, #00BFA5 0%, #00E5FF 50%, #00BFA5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 40px rgba(0,229,255,0.4))',
              }}
            >
              $PSY
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl sm:text-2xl lg:text-3xl text-white/80 mb-4 font-light"
              style={{ fontFamily: 'Jura, Inter, sans-serif' }}
            >
              The coordination token for mental health infrastructure
            </p>

            {/* Tagline */}
            <p
              className="text-sm sm:text-base text-white/40 mb-12 tracking-wide"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Fair launch on CyreneAI &nbsp;·&nbsp; March 3, 2026 &nbsp;·&nbsp; 3:00 PM UTC
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://cyreneai.com/preview-page/psychat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: 'linear-gradient(135deg, #00BFA5, #00E5FF)',
                  color: '#0A1628',
                  boxShadow: '0 0 30px rgba(0,229,255,0.3)',
                }}
              >
                Join Launch on CyreneAI
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
              <a
                href="https://psychat.motusdao.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  border: '1px solid rgba(0,229,255,0.3)',
                  background: 'rgba(0,229,255,0.06)',
                  color: '#00E5FF',
                }}
              >
                Try PsyChat
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs">
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>scroll</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </section>

        <Divider />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2 · PROJECT VISION
        ═══════════════════════════════════════════════════════════════════ */}
        <Section id="vision" style={{ background: '#0A1628' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Why $PSY Exists" />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
              <div className="space-y-5">
                <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                  Mental health generates extremely valuable data. Current platforms extract this data — users get
                  nothing. MotusDAO has spent 5 years building mental health infrastructure that inverts this model.
                </p>
                <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                  <Accent>$PSY</Accent> is the coordination token that aligns early participants with a mental health
                  data marketplace — where users own their data, share in the value it creates, and practitioners
                  coordinate through transparent on-chain incentives.
                </p>
                <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                  $PSY is not a memecoin. It&apos;s not governance. It&apos;s an economic primitive for a new kind of
                  mental health economy.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '5 Years', label: 'Building through the bear market' },
                  { value: '100+', label: 'Psychologists on the platform' },
                  { value: '10+', label: 'Countries represented' },
                  { value: '$700+/mo', label: 'Transaction volume' },
                ].map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-2xl p-6"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(0,229,255,0.1)',
                    }}
                  >
                    <div
                      className="text-2xl sm:text-3xl font-black mb-2"
                      style={{
                        fontFamily: 'Orbitron, monospace',
                        color: '#00E5FF',
                        textShadow: '0 0 20px rgba(0,229,255,0.4)',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white/50 text-sm leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3 · TOKEN UTILITY — FOUR DEMAND LOOPS
        ═══════════════════════════════════════════════════════════════════ */}
        <Section id="utility" style={{ background: '#0D1F3C' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="How $PSY Works"
              sub="Four interlocking demand loops that create a sustainable token economy"
            />

            {/* 4 demand loop cards */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
              {demandLoops.map((loop, i) => (
                <div
                  key={loop.label}
                  className="rounded-2xl p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(0,229,255,0.12)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}
                    >
                      {loop.emoji}
                    </div>
                    <span
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: '#00BFA5', fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      Loop {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold text-base mb-2"
                      style={{ fontFamily: 'Jura, Inter, sans-serif' }}
                    >
                      {loop.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{loop.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Flow diagram */}
            <div
              className="rounded-2xl p-8 sm:p-10"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(0,229,255,0.1)',
              }}
            >
              <h3
                className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-8 text-center"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Token Flow Diagram
              </h3>

              {/* ── Row 1: COMPANIES → PAY USERS FOR DATA → USERS ── */}
              <div className="flex flex-col sm:flex-row items-center gap-0">
                <FlowNode label="COMPANIES" sublabel="buy $PSY" color="#00BFA5" />
                <FlowArrow label="PAY USERS FOR DATA" />
                <FlowNode label="USERS" sublabel="earn $PSY" color="#00E5FF" />
              </div>

              {/* ── Vertical drop from USERS ── */}
              <div className="flex flex-col items-end sm:pr-0" style={{ paddingRight: 'calc(0px)' }}>
                <div className="flex flex-col items-center" style={{ marginRight: '0', alignSelf: 'flex-end', width: '160px' }}>
                  <VerticalArrow label="use $PSY for services" />
                </div>
              </div>

              {/* ── Row 2: USE $PSY FOR SERVICES ── */}
              <div className="flex flex-col sm:flex-row items-center gap-0 justify-end">
                <FlowNode label="USE $PSY FOR SERVICES" sublabel="PsyChat · Therapy · AI" color="#818CF8" />
              </div>

              {/* ── Vertical drop to FEES ── */}
              <div className="flex justify-end">
                <div className="flex flex-col items-center" style={{ width: '220px' }}>
                  <VerticalArrow label="" />
                </div>
              </div>

              {/* ── Row 3: FEES → PROJECT WALLET ── */}
              <div className="flex flex-col sm:flex-row items-center gap-0 justify-end">
                <FlowNode label="FEES (1%)" sublabel="per transaction" color="#F59E0B" />
                <FlowArrow label="→" />
                <FlowNode label="PROJECT WALLET" sublabel="" color="#F59E0B" />
              </div>

              {/* ── Vertical drop to DEV ── */}
              <div className="flex justify-end">
                <div className="flex flex-col items-center" style={{ width: '160px' }}>
                  <VerticalArrow label="" />
                </div>
              </div>

              {/* ── Row 4: DEVELOPMENT + MBI POOL ── */}
              <div className="flex justify-end">
                <FlowNode label="DEVELOPMENT + MBI POOL" sublabel="ongoing funding" color="#F59E0B" />
              </div>

              {/* ── Separator ── */}
              <div
                className="my-6"
                style={{ borderTop: '1px dashed rgba(0,229,255,0.1)' }}
              />

              {/* ── Row 5: DONORS → ENDOWMENT ── */}
              <div className="flex flex-col sm:flex-row items-center gap-0">
                <FlowNode label="DONORS / INVESTORS" sublabel="principal preserved" color="#10B981" />
                <FlowArrow label="→" />
                <FlowNode label="ENDOWMENT" sublabel="principal preserved" color="#10B981" />
              </div>

              {/* ── Vertical drop from ENDOWMENT ── */}
              <div className="flex" style={{ paddingLeft: '220px' }}>
                <div className="flex flex-col items-center" style={{ width: '160px' }}>
                  <VerticalArrow label="" />
                </div>
              </div>

              {/* ── Row 6: YIELD → MBI DISTRIBUTIONS + OPERATIONS ── */}
              <div className="flex flex-col sm:flex-row items-center gap-0">
                <FlowNode label="YIELD" sublabel="principal stays intact" color="#00BFA5" />
                <FlowArrow label="→" />
                <FlowNode label="MBI DISTRIBUTIONS + OPERATIONS" sublabel="" color="#00E5FF" />
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4 · LAUNCH STRATEGY
        ═══════════════════════════════════════════════════════════════════ */}
        <Section id="launch" style={{ background: '#0A1628' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="Fair Launch on CyreneAI"
              sub="No pre-sale. No VC. No private rounds. Everyone enters the same curve."
            />

            <div className="grid lg:grid-cols-2 gap-10 mb-12">
              {/* How CyreneAI Works */}
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(0,229,255,0.12)',
                }}
              >
                <h3
                  className="text-white font-semibold text-lg mb-4"
                  style={{ fontFamily: 'Jura, Inter, sans-serif' }}
                >
                  How CyreneAI Works
                </h3>
                <p className="text-white/65 text-sm leading-relaxed">
                  CyreneAI is a curated, invite-only fair launch platform on Solana. It&apos;s the only launchpad with
                  a 100% bond rate — every token launched on CyreneAI successfully bonds. Projects are vetted before
                  launch, and liquidity is locked from Day 1.
                </p>
              </div>

              {/* Revenue Model callout */}
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'rgba(0,229,255,0.05)',
                  border: '1px solid rgba(0,229,255,0.25)',
                }}
              >
                <div
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: '#00E5FF', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Revenue Model
                </div>
                <p
                  className="text-white font-semibold text-xl mb-3"
                  style={{ fontFamily: 'Jura, Inter, sans-serif' }}
                >
                  1% of all $PSY trading fees → Project Wallet
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Every trade directly funds development of live infrastructure. The team does not need to sell tokens
                  to fund development. Revenue scales with trading activity. Fully transparent, fully on-chain.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* The Mechanism — numbered timeline */}
              <div>
                <h3
                  className="text-white font-semibold text-lg mb-6"
                  style={{ fontFamily: 'Jura, Inter, sans-serif' }}
                >
                  The Mechanism
                </h3>
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
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(0,191,165,0.15)', border: '1px solid rgba(0,191,165,0.4)', color: '#00BFA5' }}
                        >
                          {i + 1}
                        </div>
                        {i < 5 && (
                          <div
                            className="w-px flex-1 my-1"
                            style={{ background: 'rgba(0,191,165,0.15)', minHeight: '24px' }}
                          />
                        )}
                      </div>
                      <div className="pb-6 pt-1">
                        <p className="text-white/65 text-sm leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What We Don't Have */}
              <div
                className="rounded-2xl p-8 h-fit"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h3
                  className="text-white font-semibold text-lg mb-6"
                  style={{ fontFamily: 'Jura, Inter, sans-serif' }}
                >
                  What We Don&apos;t Have
                </h3>
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
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(0,191,165,0.15)' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00BFA5" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/75 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5 · ROADMAP
        ═══════════════════════════════════════════════════════════════════ */}
        <Section id="roadmap" style={{ background: '#0D1F3C' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="Roadmap"
              sub="What's live, what's building, and what's next — clearly separated."
            />

            <div className="grid md:grid-cols-3 gap-6">
              {roadmapPhases.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-2xl p-7 flex flex-col gap-5"
                  style={{
                    background: phase.bgColor,
                    border: `1px solid ${phase.borderColor}`,
                  }}
                >
                  {/* Phase header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                        style={{ background: phase.labelBg, color: phase.color, fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {phase.badge} {phase.label}
                      </span>
                    </div>
                    <h3
                      className="text-white font-semibold text-lg"
                      style={{ fontFamily: 'Jura, Inter, sans-serif', color: phase.color }}
                    >
                      {phase.phase}
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {phase.sublabel}
                    </p>
                  </div>

                  {/* Items */}
                  <ul className="space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-2.5 items-start">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: phase.color }}
                        />
                        <span className="text-white/65 text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6 · TOKEN DETAILS
        ═══════════════════════════════════════════════════════════════════ */}
        <Section id="token-details" style={{ background: '#0A1628' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Token Information" />

            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(0,229,255,0.12)' }}
            >
              {tokenDetails.map((row, i) => (
                <div
                  key={row.field}
                  className="flex flex-col sm:flex-row sm:items-center"
                  style={{
                    borderBottom: i < tokenDetails.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}
                >
                  <div
                    className="sm:w-48 lg:w-64 px-6 py-4 text-xs font-semibold tracking-widest uppercase flex-shrink-0"
                    style={{ color: '#00BFA5', fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {row.field}
                  </div>
                  <div
                    className="flex-1 px-6 py-4 text-white/80 text-sm sm:border-l"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                  >
                    {row.value === '[Updated at launch]' ? (
                      <span className="text-white/30 italic">{row.value}</span>
                    ) : (
                      row.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 7 · FOR YOUR AUDIENCE
        ═══════════════════════════════════════════════════════════════════ */}
        <Section id="audience" style={{ background: '#0D1F3C' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Who Is $PSY For?" />

            {/* Tab buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {audienceTabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={
                    activeTab === i
                      ? {
                          background: 'linear-gradient(135deg, rgba(0,191,165,0.2), rgba(0,229,255,0.2))',
                          border: '1px solid rgba(0,229,255,0.4)',
                          color: '#00E5FF',
                          fontFamily: 'Jura, Inter, sans-serif',
                        }
                      : {
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.5)',
                          fontFamily: 'Jura, Inter, sans-serif',
                        }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div
              className="rounded-2xl p-8 sm:p-10 min-h-[160px]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,229,255,0.1)',
              }}
            >
              <p
                className="text-white/75 text-base sm:text-lg leading-relaxed max-w-3xl"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {audienceTabs[activeTab].content}
              </p>
            </div>

            {/* All audience cards (visible on larger screens as grid fallback) */}
            <div className="mt-8 grid md:grid-cols-2 gap-5 hidden sm:grid">
              {audienceTabs.map((tab, i) => (
                <div
                  key={tab.label}
                  className="rounded-2xl p-7 cursor-pointer transition-all hover:-translate-y-0.5"
                  onClick={() => setActiveTab(i)}
                  style={{
                    background: activeTab === i ? 'rgba(0,229,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: activeTab === i ? '1px solid rgba(0,229,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <h4
                    className="text-white font-semibold text-base mb-3"
                    style={{ fontFamily: 'Jura, Inter, sans-serif', color: activeTab === i ? '#00E5FF' : 'white' }}
                  >
                    For {tab.label}
                  </h4>
                  <p className="text-white/55 text-sm leading-relaxed">{tab.content}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 8 · CTA / FOOTER
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-24 text-center overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0,191,165,0.1) 0%, transparent 70%)',
            }}
            aria-hidden
          />
          <GridBackground />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Jura, Inter, sans-serif' }}
            >
              Join the Launch
            </h2>
            <p className="text-white/50 mb-10 text-base">March 3, 2026 · 3:00 PM UTC · CyreneAI</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <a
                href="https://cyreneai.com/preview-page/psychat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #00BFA5, #00E5FF)',
                  color: '#0A1628',
                  boxShadow: '0 0 40px rgba(0,229,255,0.25)',
                }}
              >
                Launch on CyreneAI — March 3, 3 PM UTC
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
              <a
                href="https://psychat.motusdao.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  border: '1px solid rgba(0,229,255,0.3)',
                  background: 'rgba(0,229,255,0.05)',
                  color: '#00E5FF',
                }}
              >
                Explore PsyChat Now
              </a>
            </div>

            {/* Links row */}
            <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
              {[
                { label: 'app.motusdao.org', href: 'https://app.motusdao.org' },
                { label: 'motusdao.org', href: 'https://motusdao.org' },
                { label: '@MotusDAO', href: 'https://twitter.com/MotusDAO' },
                { label: 'GitHub', href: 'https://github.com/Motus-DAO' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/80 transition-colors"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <Divider />

            {/* Disclaimer */}
            <p className="mt-8 text-white/25 text-xs leading-relaxed max-w-2xl mx-auto">
              $PSY is a coordination token. It is not a security, not financial advice, and not a guarantee of
              returns. All information about future utility represents development goals, not promises. Trade
              responsibly.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}

// ─── Helper components for the flow diagram ──────────────────────────────────

const FlowNode: React.FC<{ label: string; sublabel: string; color: string }> = ({
  label,
  sublabel,
  color,
}) => (
  <div
    className="rounded-xl px-4 py-3 text-center flex-shrink-0"
    style={{
      background: `${color}14`,
      border: `1px solid ${color}40`,
      minWidth: '120px',
    }}
  >
    <div className="text-xs font-bold tracking-wide" style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>
      {label}
    </div>
    <div className="text-white/40 text-xs mt-0.5">{sublabel}</div>
  </div>
);

const FlowArrow: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-row items-center gap-1 px-2 py-1" style={{ minWidth: '60px' }}>
    {label && label !== '→' && (
      <span className="text-white/30 text-xs whitespace-nowrap mr-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {label}
      </span>
    )}
    <div className="h-px flex-1" style={{ background: 'rgba(0,229,255,0.25)', minWidth: '24px' }} />
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth="2.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </div>
);

const VerticalArrow: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center py-1" style={{ minHeight: '36px' }}>
    <div className="w-px flex-1" style={{ background: 'rgba(0,229,255,0.25)', minHeight: '20px' }} />
    {label && (
      <span className="text-white/30 text-xs my-1 whitespace-nowrap" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {label}
      </span>
    )}
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth="2.5" style={{ transform: 'rotate(90deg)' }}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </div>
);
