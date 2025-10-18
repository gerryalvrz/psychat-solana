import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptedText from './DecryptedText';
import { HoloText } from './ui/holo';
import { ComplexMolecule, WaterMolecule } from './ui';

type HeroTerminalProps = {
  onConnect: () => Promise<void> | void;
  onNavigate: (tab: 'home' | 'chat' | 'learn') => void;
};

type HistoryLine = {
  id: string;
  text: string;
  tone?: 'success' | 'error' | 'info';
};

export default function HeroTerminal({ onConnect, onNavigate }: HeroTerminalProps) {
  const [history, setHistory] = useState<HistoryLine[]>(() => [
    { id: 'h1', text: 'psychat> type `help` to list commands', tone: 'info' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAutoTriggerRef = useRef<boolean>(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const print = useCallback((lines: Array<string | HistoryLine>) => {
    setHistory(prev => [
      ...prev,
      ...lines.map((l, idx) => typeof l === 'string' ? ({ id: `${Date.now()}-${idx}` , text: l }) : l)
    ]);
  }, []);

  const commands = useMemo(() => ({
    help: async () => {
      print([
        { text: 'Available commands:', id: 'c-help-0', tone: 'info' },
        '  help    - show this help',
        '  connect - connect your wallet',
        '  chat    - open chat',
        '  learn   - view how it works',
        '  clear   - clear terminal'
      ]);
    },
    connect: async () => {
      try {
        setIsProcessing(true);
        await onConnect();
        print([{ id: 'c-conn-ok', text: 'Wallet connected.', tone: 'success' }]);
      } catch (e) {
        print([{ id: 'c-conn-err', text: 'Connection failed. Try again or open the wallet.', tone: 'error' }]);
      } finally {
        setIsProcessing(false);
      }
    },
    chat: async () => {
      if (!isAutoTriggerRef.current) {
        onNavigate('chat');
        print([{ id: 'c-chat', text: 'Opening chat...', tone: 'info' }]);
      } else {
        // In auto (scroll) mode, do not navigate away; only simulate output
        print([{ id: 'c-chat-auto', text: 'Chat module ready. (scroll-triggered)', tone: 'info' }]);
      }
    },
    learn: async () => {
      onNavigate('learn');
      print([{ id: 'c-learn', text: 'Scrolling to How it Works...', tone: 'info' }]);
    },
    clear: async () => {
      setHistory([]);
    }
  }), [onConnect, onNavigate, print]);

  const runCommand = useCallback(async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(null);
    const [cmd] = trimmed.split(/\s+/);
    setHistory(prev => ([...prev, { id: `${Date.now()}-cmd`, text: `> ${trimmed}` }]));
    setInputValue('');
    const fn = (commands as Record<string, () => Promise<void>>)[cmd.toLowerCase()];
    if (fn) {
      await fn();
    } else {
      print([{ id: 'c-unknown', text: `Unknown command: ${cmd}. Type 'help'.`, tone: 'error' }]);
    }
  }, [commands, print]);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputValue.trim();
    if (!raw) return;
    await runCommand(raw);
  }, [inputValue, runCommand]);

  useEffect(() => {
    const handler = (e: any) => {
      if (!e.detail?.cmd) return;
      // Insert into input briefly for visual continuity
      setInputValue(e.detail.cmd);
      setTimeout(() => {
        isAutoTriggerRef.current = true;
        void runCommand(e.detail.cmd).finally(() => {
          isAutoTriggerRef.current = false;
        });
      }, 50);
    };
    window.addEventListener('hero:run', handler);
    return () => window.removeEventListener('hero:run', handler);
  }, [runCommand]);

  return (
    <div className="w-full flex justify-center relative overflow-hidden crystal-layer-system">
      {/* Crystal Grid Background */}
      <div className="absolute inset-0 crystal-grid-sparse -z-10" />
      
      {/* Multilayer Crystal Background */}
      <motion.div
        className="absolute inset-0 -z-10 crystal-layer-1"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Crystal Geometric Overlays */}
      <div className="absolute inset-0 geometric-overlay-dense -z-10" />
      
      {/* Floating Crystal Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 crystal-layer-2 -z-10"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.8, 1],
          rotate: [0, 90, 180, 360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(45deg, rgba(0,255,255,0.05), rgba(255,0,255,0.05))',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 crystal-layer-2 -z-10"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 50, -100, 0],
          scale: [1, 0.8, 1.2, 1],
          rotate: [360, 270, 180, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(45deg, rgba(157,104,255,0.05), rgba(0,255,255,0.05))',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        }}
      />

      {/* Atomic Structure Background Elements */}
      <div className="absolute top-10 left-10 crystal-layer-3 z-20">
        <ComplexMolecule className="opacity-60" />
      </div>
      
      <div className="absolute bottom-10 right-10 crystal-layer-1 z-20">
        <WaterMolecule className="opacity-50" />
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 crystal-layer-2 z-20">
        <ComplexMolecule className="opacity-40" />
      </div>
      
      {/* Additional atomic elements around the terminal */}
      <div className="absolute top-5 right-5 crystal-layer-1 z-20">
        <WaterMolecule className="opacity-70" />
      </div>
      
      <div className="absolute bottom-5 left-5 crystal-layer-2 z-20">
        <ComplexMolecule className="opacity-50" />
      </div>
      
      {/* More atomic elements for better coverage */}
      <div className="absolute top-1/3 right-1/3 crystal-layer-3 z-20">
        <WaterMolecule className="opacity-45" />
      </div>
      
      <div className="absolute bottom-1/3 left-1/3 crystal-layer-1 z-20">
        <ComplexMolecule className="opacity-55" />
      </div>
      
      {/* Animated crystal particles */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-4 h-4 crystal-layer-2 z-20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.6), rgba(255,0,255,0.3))',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-6 h-6 crystal-layer-3 z-20"
        animate={{
          scale: [1, 0.8, 1.2, 1],
          opacity: [0.4, 0.9, 0.4],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(157,104,255,0.7), rgba(0,255,255,0.4))',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        }}
      />

      <div className="w-full max-w-4xl mx-2 sm:mx-4 relative z-10">
        {/* Terminal Frame */}
        <div
          className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-md overflow-hidden shadow-2xl crt-curvature"
          role="region"
          aria-label="PsyChat interactive terminal hero"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Header */}
          <div className="bg-black/90 border-b border-gray-600/60 px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="ml-4 text-gray-300 text-xs font-mono select-none">PsyChat Terminal v1.1</div>
          </div>

          {/* Body */}
          <div className="relative">
            {/* CRT overlays */}
            <div className="absolute inset-0 pointer-events-none crt-scanlines"></div>
            <div className="absolute inset-0 pointer-events-none crt-vignette"></div>

            <div className="relative p-4 sm:p-6 font-mono text-green-400 bg-black/20 backdrop-blur-sm leading-relaxed text-sm sm:text-base">
              {/* Headline */}
              <div className="mb-4">
                <DecryptedText
                  text="Welcome to PsyChat"
                  speed={60}
                  maxIterations={12}
                  sequential={true}
                  revealDirection="start"
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                  className="text-green-400 text-2xl md:text-4xl crt-glow"
                  encryptedClassName="text-green-700"
                  animateOn="view"
                />
                <HoloText size="sm" className="text-green-500/80 text-xs sm:text-sm md:text-base">
                  Own your therapy data. Earn from anonymized insights. Privacy by design.
                </HoloText>
              </div>

              {/* History */}
              <div
                ref={scrollRef}
                className="h-40 sm:h-48 md:h-56 overflow-y-auto pr-2 custom-scrollbar focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                tabIndex={0}
              >
                {history.map(line => (
                  <div key={line.id} className={
                    line.tone === 'success' ? 'text-emerald-400' : line.tone === 'error' ? 'text-red-400' : 'text-green-400'
                  }>
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Prompt */}
              <form onSubmit={onSubmit} className="mt-4 flex items-center gap-2" aria-labelledby="terminal-prompt-label" aria-describedby="terminal-prompt-hint">
                <span id="terminal-prompt-label" className="sr-only">Terminal command prompt</span>
                <span className="text-green-500" aria-hidden>$</span>
                <input
                  ref={inputRef}
                  aria-label="Terminal prompt"
                  className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-700 min-h-[40px] sm:min-h-0"
                  placeholder={isProcessing ? 'processing…' : 'type a command and press enter'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setInputValue('');
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      if (commandHistory.length === 0) return;
                      setHistoryIndex(prev => {
                        const next = prev === null ? commandHistory.length - 1 : Math.max(0, prev - 1);
                        setInputValue(commandHistory[next] ?? '');
                        return next;
                      });
                    }
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (commandHistory.length === 0) return;
                      setHistoryIndex(prev => {
                        if (prev === null) return null;
                        const next = Math.min(commandHistory.length - 1, prev + 1);
                        setInputValue(commandHistory[next] ?? '');
                        return next;
                      });
                    }
                  }}
                  disabled={isProcessing}
                />
                <div className="w-2 h-4 bg-green-500 animate-pulse" aria-hidden></div>
              </form>
              <HoloText size="xs" id="terminal-prompt-hint" className="mt-2 text-xs text-green-700">
                Try: help · connect · chat · learn · clear
              </HoloText>

              {/* Mobile quick commands */}
              <div className="mt-3 flex flex-wrap gap-2 md:hidden" aria-label="Quick commands">
                {['help','connect','chat','learn','clear'].map(cmd => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => setInputValue(cmd)}
                    className="px-3 py-2 rounded-md bg-emerald-900/40 text-emerald-300 text-xs border border-emerald-700/40 active:scale-[0.98]"
                    aria-label={`Insert ${cmd} command`}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


