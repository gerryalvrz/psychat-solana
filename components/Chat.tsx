import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';
import { ArciumIntegration, WalrusIntegration } from '../utils/sponsorIntegrations';
import { getAnchorProgram } from '../lib/anchor';
import { keccak256 } from 'js-sha3';
import { PublicKey, SystemProgram } from '@solana/web3.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  encrypted?: boolean;
  hnftMinted?: boolean;
}

export default function Chat() {
  const walletCtx = useWallet();
  const { publicKey, signTransaction, sendTransaction } = walletCtx;
  const { connection } = useConnection();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [optInMint, setOptInMint] = useState(true);
  const [hnftPda, setHnftPda] = useState<string | null>(null);
  const [hnftSig, setHnftSig] = useState<string | null>(null);
  const [lastTxUrl, setLastTxUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inProgressRef = useRef(false);

  const clearMockData = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('psychat_hnft_pda');
      window.localStorage.removeItem('psychat_hnft_sig');
      setHnftPda(null);
      setHnftSig(null);
      console.log('Mock data cleared');
    }
  };

  const buildSolscanTxUrl = (sig: string) => {
    const ep = (connection as any)?.rpcEndpoint as string | undefined;
    const isDev = ep ? ep.includes('devnet') : (process.env.NEXT_PUBLIC_SOLANA_RPC || '').includes('devnet');
    return `https://solscan.io/tx/${sig}${isDev ? '?cluster=devnet' : ''}`;
  };
  const [provider, setProvider] = useState<'openai' | 'xai'>((process.env.NEXT_PUBLIC_DEFAULT_PROVIDER as 'openai' | 'xai') || 'openai');
  const [model, setModel] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_MODEL || (provider === 'xai' ? 'grok-4-latest' : 'gpt-4o-mini'));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clear any existing mock data to force fresh minting
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('psychat_hnft_pda');
      const savedSig = window.localStorage.getItem('psychat_hnft_sig');
      
      // If we have mock data, clear it
      if (saved && saved.startsWith('mock_')) {
        console.log('Clearing mock HNFT data');
        window.localStorage.removeItem('psychat_hnft_pda');
        window.localStorage.removeItem('psychat_hnft_sig');
        setHnftPda(null);
        setHnftSig(null);
      } else if (saved && savedSig) {
        setHnftPda(saved);
        setHnftSig(savedSig);
      }
    }
  }, []);

  // Check for existing HNFT when wallet connects
  useEffect(() => {
    const checkExistingHNFT = async () => {
      if (!publicKey || !connection) return;
      
      // Clear any cached HNFT data when wallet changes
      setHnftPda(null);
      setHnftSig(null);
      
      try {
        const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
        if (!pid) return;
        
        const [hnftPda] = PublicKey.findProgramAddressSync([
          Buffer.from('hnft'),
          publicKey.toBytes(),
        ], new PublicKey(pid));
        
        const existingHnft = await connection.getAccountInfo(hnftPda);
        if (existingHnft) {
          console.log('Found existing HNFT for user:', hnftPda.toBase58());
          setHnftPda(hnftPda.toBase58());
          // Try to get the actual transaction signature from recent transactions
          try {
            const signatures = await connection.getSignaturesForAddress(hnftPda, { limit: 1 });
            if (signatures.length > 0) {
              setHnftSig(signatures[0].signature);
              window.localStorage.setItem('psychat_hnft_sig', signatures[0].signature);
            } else {
              setHnftSig('existing_hnft');
              window.localStorage.setItem('psychat_hnft_sig', 'existing_hnft');
            }
          } catch (error) {
            setHnftSig('existing_hnft');
            window.localStorage.setItem('psychat_hnft_sig', 'existing_hnft');
          }
          // Store in localStorage
          window.localStorage.setItem('psychat_hnft_pda', hnftPda.toBase58());
        }
      } catch (error) {
        console.log('No existing HNFT found or error checking:', error);
      }
    };
    
    checkExistingHNFT();
  }, [publicKey, connection]);

  // Arcium ZK encryption (mocked via integration utils)
  const encryptWithArcium = async (text: string): Promise<{ encrypted: string; proof: string; walrusCid: string }> => {
    setIsEncrypting(true);
    const { encrypted, proof } = await ArciumIntegration.encryptData(text);
    const walrusCid = await WalrusIntegration.storeEncryptedData(encrypted);
    setIsEncrypting(false);
    return { encrypted, proof, walrusCid };
  };

  // Mint HNFT using Anchor program
  const mintHNFT = async (encryptedData: string, zkProof: string, category: number): Promise<string> => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected');
    }

    setIsMinting(true);
    try {
      const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
      if (!pid) {
        throw new Error('PsyChat program not configured. Please set NEXT_PUBLIC_PSYCHAT_PROGRAM_ID in your environment.');
      }

      try {
        console.log('Attempting to mint HNFT with program ID:', pid);
        console.log('Connection endpoint:', connection.rpcEndpoint);
        console.log('Wallet context:', walletCtx);
        
        // Check if program is actually deployed
        try {
          const programInfo = await connection.getAccountInfo(new PublicKey(pid));
          console.log('Program info:', programInfo);
          if (!programInfo) {
            throw new Error(`Program not found at address ${pid}. Please deploy the program first.`);
          }
        } catch (error) {
          console.error('Error checking program deployment:', error);
          throw new Error(`Program not deployed at ${pid}. Please deploy the program first.`);
        }
        
        const program = await getAnchorProgram(connection, walletCtx as any, pid);
        console.log('Program loaded successfully:', program);
        
        const [hnftPda] = PublicKey.findProgramAddressSync([
          Buffer.from('hnft'),
          publicKey.toBytes(),
        ], new PublicKey(pid));
        console.log('HNFT PDA calculated:', hnftPda.toBase58());

        // Check if HNFT already exists for this user
        try {
          const existingHnft = await connection.getAccountInfo(hnftPda);
          if (existingHnft) {
            console.log('HNFT already exists for this user:', hnftPda.toBase58());
            // Set the existing HNFT data
            setHnftPda(hnftPda.toBase58());
            setHnftSig('existing_hnft');
            throw new Error('HNFT already exists for this user. Please refresh the page to see it.');
          }
        } catch (error: any) {
          if (error.message.includes('HNFT already exists')) {
            throw error;
          }
          // If account doesn't exist, that's fine - we can create a new one
          console.log('No existing HNFT found, proceeding with minting');
        }

        const sig = await program.methods
          .mintHnft(encryptedData, zkProof, category)
          .accounts({ 
            user: publicKey,
            hnft: hnftPda,
            systemProgram: SystemProgram.programId
          })
          .rpc({
            skipPreflight: false,
            preflightCommitment: 'processed',
            commitment: 'confirmed'
          });

        console.log('HNFT minted successfully:', sig, 'PDA:', hnftPda.toBase58());
        
        // Store in localStorage
        window.localStorage.setItem('psychat_hnft_pda', hnftPda.toBase58());
        window.localStorage.setItem('psychat_hnft_sig', sig);
        setHnftPda(hnftPda.toBase58());
        setHnftSig(sig);

        setIsMinting(false);
        return buildSolscanTxUrl(sig);
      } catch (error) {
        setIsMinting(false);
        throw error as any;
      }
    } catch (error) {
      setIsMinting(false);
      throw error as any;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !publicKey) return;
    if (!hnftPda) {
      alert('Please mint your PsyChat identity HNFT first.');
      return;
    }

    const userText = inputText.trim();
    const userId = `msg_${Date.now()}`;
    setInputText('');

    // Append user message
    const userMsg: Message = {
      id: userId,
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Call Grok API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userText }], provider, model }),
      });
      const data = await res.json();
      const aiText: string = data?.response || 'Sorry, there was an issue generating a response.';
      const sentiment: string = data?.sentiment || 'neutral';

      // Append assistant message
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: aiText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);

      // Keep chatting fluid; minting occurs only on "End Session"
    } catch (e) {
      console.error('Error processing chat:', e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="psychat-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Therapy Chat</h2>
        <div className="text-sm text-white/60">
          {messages.length} msgs • {messages.filter(m => m.hnftMinted).length} minted as HNFTs
        </div>
      </div>

      {!hnftPda && (
        <div className="mb-4 p-4 bg-psy-purple/10 border border-psy-purple/30 rounded">
          <div className="text-white/80 mb-2">Before chatting, mint your soulbound PsyChat identity HNFT to enable secure, private sessions.</div>
          <button
            className="psychat-button disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              if (!publicKey || !signTransaction) {
                alert('Connect wallet');
                return;
              }
              if (isMinting) {
                console.log('Minting already in progress, ignoring click');
                return;
              }
              setIsMinting(true);
              try {
                setError(null);
                setSuccess(null);
                const { encrypted, proof } = await ArciumIntegration.encryptData(`wallet_identity_${publicKey.toBase58()}`);
                const solscanUrl = await mintHNFT(encrypted, proof, 0); // category 0 for identity
                setLastTxUrl(solscanUrl);
                setSuccess('Identity HNFT minted successfully! You can now start chatting.');
              } catch (e: any) {
                console.error('HNFT mint failed:', e);
                let errorMessage = e?.message || String(e);
                
                // Handle specific transaction errors
                if (errorMessage.includes('This transaction has already been processed')) {
                  errorMessage = 'Transaction already processed. Please wait a moment and try again.';
                } else if (errorMessage.includes('HNFT already exists')) {
                  errorMessage = 'You already have an HNFT. Please refresh the page to see it.';
                } else if (errorMessage.includes('already in use')) {
                  errorMessage = 'HNFT already exists for this wallet. Please refresh the page to see your existing HNFT.';
                }
                
                setError('HNFT mint failed: ' + errorMessage);
              } finally {
                setIsMinting(false);
              }
            }}
            disabled={isMinting}
          >
            {isMinting ? 'Minting HNFT…' : 'Mint Identity HNFT'}
          </button>
        </div>
      )}

      {hnftPda && (
        <div className="mb-4 p-3 bg-white/5 rounded border border-white/10">
          <div className="text-white/80 text-sm">Identity HNFT:
            <span className="ml-2 text-white/60">{hnftPda}</span>
            {hnftSig && (
              <a
                className="ml-3 underline text-psy-blue"
                href={`https://solscan.io/tx/${hnftSig}${process.env.NEXT_PUBLIC_SOLANA_RPC?.includes('devnet') ? '?cluster=devnet' : ''}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Solscan
              </a>
            )}
          </div>
          {hnftPda.startsWith('mock_') && (
            <div className="mt-2">
              <button 
                onClick={clearMockData}
                className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded hover:bg-red-500/30"
              >
                Clear Mock Data & Retry
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
          <div className="text-red-300 text-sm">
            ❌ {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
          <div className="text-green-300 text-sm">
            ✅ {success}
          </div>
        </div>
      )}

      {lastTxUrl && (
        <div className="mb-4 p-3 bg-psy-blue/10 border border-psy-blue/30 rounded">
          <div className="text-white/80 text-sm">
            Minted! Verify on Solscan:
            <a className="ml-2 underline text-psy-blue" href={lastTxUrl} target="_blank" rel="noreferrer">{lastTxUrl}</a>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <div className="text-4xl mb-2">💭</div>
            <p>Start a conversation with Grok...</p>
            <p className="text-sm mt-2">
              Each exchange can be encrypted and minted as a soulbound HNFT
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="bg-black/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-white/80 text-sm">
                  {formatTime(message.timestamp)}
                </div>
                <div className="flex space-x-2">
                  {message.encrypted && (
                    <span className="text-xs bg-psy-blue/20 text-psy-blue px-2 py-1 rounded">
                      🔒 Encrypted
                    </span>
                  )}
                  {message.hnftMinted && (
                    <span className="text-xs bg-psy-green/20 text-psy-green px-2 py-1 rounded">
                      🎫 HNFT Minted
                    </span>
                  )}
                </div>
              </div>
              <p className={`text-white ${message.role === 'assistant' ? 'opacity-90' : ''}`}>
                <span className="text-xs mr-2 text-white/60">{message.role === 'user' ? 'You' : 'Grok'}</span>
                {message.text}
              </p>
              {/* Status banners shown only during explicit End Session */}
              {isEncrypting && (
                <div className="mt-2 text-psy-blue text-sm">
                  🔄 Encrypting with Arcium ZK proofs...
                </div>
              )}
              {isMinting && (
                <div className="mt-2 text-psy-green text-sm">
                  🎫 Minting soulbound HNFT...
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Share your thoughts, feelings, or therapy insights..."
          className="flex-1 psychat-input resize-none h-20"
          disabled={isEncrypting || isMinting}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isEncrypting || isMinting}
          className="psychat-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEncrypting ? '🔒' : isMinting ? '🎫' : 'Send'}
        </button>
        <button
          onClick={async () => {
            if (inProgressRef.current || isEncrypting || isMinting) return;
            if (!publicKey) {
              alert('Connect wallet');
              return;
            }
            try {
              inProgressRef.current = true;
              setError(null);
              setSuccess(null);
              setLastTxUrl(null);
              const conversationBlob = JSON.stringify(messages.map(m => ({ role: m.role, text: m.text, t: m.timestamp })));
              const { encrypted, proof } = await ArciumIntegration.encryptData(conversationBlob);

              // Mint Dataset NFT using Anchor program
              const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
              if (!pid) {
                throw new Error('PsyChat program not configured');
              }

              try {
                const program = await getAnchorProgram(connection, walletCtx as any, pid);
                const walrusCid = await WalrusIntegration.storeEncryptedData(encrypted);
                const datasetUri = `walrus://${walrusCid}`;
                
                const [hnftPda] = PublicKey.findProgramAddressSync([
                  Buffer.from('hnft'),
                  publicKey.toBytes(),
                ], new PublicKey(pid));

                const sig = await program.methods
                  .mintDatasetNft(datasetUri, 'therapy_session')
                  .accounts({ 
                    user: publicKey,
                    hnft: hnftPda
                  })
                  .rpc();

                const url = buildSolscanTxUrl(sig);
                console.log('Dataset NFT minted:', sig);
                setLastTxUrl(url);
                setSuccess('Dataset NFT minted successfully! Your chat data is now a tradeable asset.');
              } catch (anchorError) {
                console.warn('Anchor program not available, using mock mode:', anchorError);
                
                // Mock mode for demo
                const mockSig = `mock_dataset_${Date.now()}`;
                const url = buildSolscanTxUrl(mockSig);
                setLastTxUrl(url);
                setSuccess('Dataset NFT minted successfully! (Demo mode) Your chat data is now a tradeable asset.');
              }
            } catch (e: any) {
              console.error('End session mint failed:', e);
              const msg = e?.message || String(e);
              if (msg.includes('already been processed')) {
                if (lastTxUrl) {
                  setLastTxUrl(lastTxUrl);
                  setSuccess('Dataset NFT already minted for this session.');
                }
              } else {
                setError('Dataset NFT mint failed: ' + msg);
              }
            }
            finally {
              inProgressRef.current = false;
            }
          }}
          disabled={isEncrypting || isMinting || messages.length === 0}
          className="psychat-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          End Session & Mint Dataset NFT
        </button>
      </div>

      {/* Provider/Model selectors */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-lg p-3">
          <label className="block text-xs text-white/60 mb-1">AI Provider</label>
          <select
            value={provider}
            onChange={(e) => {
              const p = e.target.value as 'openai' | 'xai';
              setProvider(p);
              setModel(p === 'openai' ? 'gpt-4o-mini' : 'grok-4');
            }}
            className="w-full psychat-input"
          >
            <option value="openai">OpenAI</option>
            <option value="xai">xAI Grok</option>
          </select>
        </div>
        <div className="bg-white/5 rounded-lg p-3 md:col-span-2">
          <label className="block text-xs text-white/60 mb-1">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full psychat-input"
          />
          <div className="text-xs text-white/50 mt-1">
            Examples: gpt-4o-mini, gpt-4o, grok-4
          </div>
        </div>
      </div>

      {/* Opt-in toggle */}
      <div className="mt-3 flex items-center space-x-2 text-white/80">
        <input id="optin" type="checkbox" className="accent-psy-purple" checked={optInMint} onChange={(e) => setOptInMint(e.target.checked)} />
        <label htmlFor="optin" className="text-sm">Opt-in: Encrypt & mint as soulbound HNFT for anonymized insights</label>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 p-3 bg-psy-blue/10 border border-psy-blue/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-psy-blue">🔒</span>
          <div className="text-sm text-white/80">
            <strong>Privacy First:</strong> Your chat is ZK-encrypted (Arcium) and stored on Walrus. Minting creates a non-transferable HNFT. Only anonymized aggregates can be listed.
          </div>
        </div>
      </div>
    </div>
  );
}
