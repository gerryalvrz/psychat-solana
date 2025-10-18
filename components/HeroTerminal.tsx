import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DecryptedText from './DecryptedText';

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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl mx-2 sm:mx-4 relative">
        {/* Terminal Frame */}
        <div
          className="bg-black border border-gray-600/60 rounded-md overflow-hidden shadow-2xl crt-curvature"
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

            <div className="relative p-4 sm:p-6 font-mono text-green-400 bg-black/100 leading-relaxed text-sm sm:text-base">
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
                <div className="text-green-500/80 text-xs sm:text-sm md:text-base">
                  Own your therapy data. Earn from anonymized insights. Privacy by design.
                </div>
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
              <div id="terminal-prompt-hint" className="mt-2 text-xs text-green-700">
                Try: help · connect · chat · learn · clear
              </div>

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


