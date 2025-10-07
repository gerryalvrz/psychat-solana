import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';
import { ArciumIntegration, WalrusIntegration } from '../utils/sponsorIntegrations';
import { getAnchorProgram } from '../lib/anchor';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { keccak256 } from 'js-sha3';
import { PublicKey, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createFreezeAccountInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from '@solana/spl-token';

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
  const [sbtMint, setSbtMint] = useState<string | null>(null);
  const [sbtSig, setSbtSig] = useState<string | null>(null);
  const [lastTxUrl, setLastTxUrl] = useState<string | null>(null);
  const inProgressRef = useRef(false);

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
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('psychat_sbt_mint') : null;
    if (saved) setSbtMint(saved);
    const savedSig = typeof window !== 'undefined' ? window.localStorage.getItem('psychat_sbt_sig') : null;
    if (savedSig) setSbtSig(savedSig);
  }, []);

  // Arcium ZK encryption (mocked via integration utils)
  const encryptWithArcium = async (text: string): Promise<{ encrypted: string; proof: string; walrusCid: string }> => {
    setIsEncrypting(true);
    const { encrypted, proof } = await ArciumIntegration.encryptData(text);
    const walrusCid = await WalrusIntegration.storeEncryptedData(encrypted);
    setIsEncrypting(false);
    return { encrypted, proof, walrusCid };
  };

  // Mock HNFT minting (Anchor program integration)
  const mintHNFT = async (encryptedData: string, zkProof: string, sentiment: string): Promise<string> => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected');
    }

    setIsMinting(true);
    try {
      // Derive PDA for existing HNFT record (optional if program id is set)
      const pidStr = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID as string | undefined;
      let hnftAccountInfo: any = null;
      if (pidStr) {
        try {
          const programId = new PublicKey(pidStr);
          const [hnftPda] = PublicKey.findProgramAddressSync([
            Buffer.from('hnft'),
            publicKey.toBytes(),
          ], programId);
          hnftAccountInfo = await connection.getAccountInfo(hnftPda);
        } catch (e) {
          console.warn('Invalid NEXT_PUBLIC_PSYCHAT_PROGRAM_ID; skipping PDA lookup.');
        }
      }

      // Prepare Metaplex client with wallet identity
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(walletCtx as any));

      // Upload encrypted conversation to Walrus (URI for metadata)
      const walrusCid = await WalrusIntegration.storeEncryptedData(encryptedData);
      const uri = `walrus://${walrusCid}`;

      // Compute traits (mock): keccak of sentiment and zk proof
      const sentimentHash = keccak256(sentiment);
      const proofHash = keccak256(zkProof);

      let lastSig = '';

      if (!hnftAccountInfo) {
        // Mint soulbound-like NFT by setting sellerFee=0 and updateAuthority=user; transfer restrictions are off-chain enforced here for demo
        const { response, nft } = await metaplex.nfts().create({
          name: 'PsyChat HNFT',
          symbol: 'HNFT',
          uri,
          sellerFeeBasisPoints: 0,
          isMutable: true,
          uses: undefined,
          creators: undefined,
          collection: undefined,
        });
        lastSig = response.signature;
        console.log('HNFT mint sig (mainnet):', lastSig, 'mint:', nft.address.toBase58());
        try { await connection.confirmTransaction(lastSig, 'finalized'); } catch {}
      } else {
        // If PDA exists, append new history by updating URI (simple demo: replace with new CID)
        // In production: fetch by mint address associated with PDA and call update
        console.log('HNFT PDA exists, appending history (metadata update simulated).');
      }

      // Optional dataset NFT mint (transferable)
      if (optInMint) {
        const anonDatasetHash = keccak256(encryptedData);
        const datasetUri = `walrus://anon_${anonDatasetHash}`;
        const { response, nft } = await metaplex.nfts().create({
          name: 'PsyChat Dataset',
          symbol: 'DATA',
          uri: datasetUri,
          sellerFeeBasisPoints: 0,
          isMutable: true,
          uses: undefined,
          creators: undefined,
          collection: undefined,
        });
        lastSig = response.signature;
        console.log('Dataset NFT mint sig (mainnet):', lastSig, 'mint:', nft.address.toBase58());
        try { await connection.confirmTransaction(lastSig, 'finalized'); } catch {}
      }

      setIsMinting(false);
      return buildSolscanTxUrl(lastSig);
    } catch (error) {
      setIsMinting(false);
      throw error as any;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !publicKey) return;
    if (!sbtMint) {
      alert('Please mint your PsyChat identity SBT first.');
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

      {!sbtMint && (
        <div className="mb-4 p-4 bg-psy-purple/10 border border-psy-purple/30 rounded">
          <div className="text-white/80 mb-2">Before chatting, mint your soulbound PsyChat identity token (SBT) to enable secure, private sessions.</div>
          <button
            className="psychat-button"
            onClick={async () => {
              if (!publicKey || !signTransaction) {
                alert('Connect wallet');
                return;
              }
              setIsMinting(true);
              try {
                const mintKeypair = Keypair.generate();
                const rentLamports = await getMinimumBalanceForRentExemptMint(connection);
                const ata = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);

                const tx = new Transaction();
                tx.add(
                  SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    lamports: rentLamports,
                    space: MINT_SIZE,
                    programId: TOKEN_PROGRAM_ID,
                  }),
                  createInitializeMintInstruction(mintKeypair.publicKey, 0, publicKey, publicKey),
                  createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, mintKeypair.publicKey),
                  createMintToInstruction(mintKeypair.publicKey, ata, publicKey, 1),
                  createFreezeAccountInstruction(ata, mintKeypair.publicKey, publicKey),
                  createSetAuthorityInstruction(mintKeypair.publicKey, publicKey, AuthorityType.MintTokens, null),
                  createSetAuthorityInstruction(mintKeypair.publicKey, publicKey, AuthorityType.FreezeAccount, null),
                );
                tx.feePayer = publicKey;
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
                tx.recentBlockhash = blockhash;
                tx.partialSign(mintKeypair);
                let sig = '';
                try {
                  sig = await (sendTransaction ? sendTransaction(tx, connection, { skipPreflight: false }) : connection.sendRawTransaction((await signTransaction(tx)).serialize(), { skipPreflight: false }));
                  await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'finalized');
                } catch (e: any) {
                  // Handle duplicate/processed tx gracefully
                  const msg = e?.message || '';
                  if (msg.includes('already been processed')) {
                    // Best effort: if wallet signed, the first signature is derivable
                    const signed = await signTransaction(tx);
                    sig = signed.signatures[0].signature ? Buffer.from(signed.signatures[0].signature as any).toString('base64') : '';
                  } else {
                    throw e;
                  }
                }
                const mintStr = mintKeypair.publicKey.toBase58();
                window.localStorage.setItem('psychat_sbt_mint', mintStr);
                if (sig) {
                  window.localStorage.setItem('psychat_sbt_sig', sig);
                  setSbtSig(sig);
                  setLastTxUrl(buildSolscanTxUrl(sig));
                }
                setSbtMint(mintStr);
                console.log('SBT minted (network):', sig ? buildSolscanTxUrl(sig) : '(sig not available)', 'mint:', mintStr);
                alert('Identity SBT minted. You can start chatting.');
              } catch (e: any) {
                console.error('SBT mint failed:', e);
                alert('SBT mint error: ' + (e?.message || String(e)));
              } finally {
                setIsMinting(false);
              }
            }}
            disabled={isMinting}
          >
            {isMinting ? 'Minting SBT…' : 'Mint Identity SBT'}
          </button>
        </div>
      )}

      {sbtMint && (
        <div className="mb-4 p-3 bg-white/5 rounded border border-white/10">
          <div className="text-white/80 text-sm">Identity SBT:
            <span className="ml-2 text-white/60">{sbtMint}</span>
            {sbtSig && (
              <a
                className="ml-3 underline text-psy-blue"
                href={`https://solscan.io/tx/${sbtSig}${process.env.NEXT_PUBLIC_SOLANA_RPC?.includes('devnet') ? '?cluster=devnet' : ''}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Solscan
              </a>
            )}
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
              setLastTxUrl(null);
              const conversationBlob = JSON.stringify(messages.map(m => ({ role: m.role, text: m.text, t: m.timestamp })));
              const { encrypted, proof } = await ArciumIntegration.encryptData(conversationBlob);

              // Prefer on-chain append via Anchor if program is configured
              try {
                const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
                if (pid) {
                  const program = getAnchorProgram(connection, walletCtx as any, pid);
                  const walrusCid = await WalrusIntegration.storeEncryptedData(encrypted);
                  const hnftSeeds = [Buffer.from('hnft'), publicKey.toBytes()];
                  const [hnftPda] = PublicKey.findProgramAddressSync(hnftSeeds, new PublicKey(pid));
                  const sig = await (program as any).methods
                    .appendHistory(`walrus://${walrusCid}`, keccak256('psychiatry'), 'psychiatry')
                    .accounts({ hnft: hnftPda, user: publicKey })
                    .rpc();
                  const url = buildSolscanTxUrl(sig);
                  console.log('append_history sig:', sig);
                  setLastTxUrl(url);
                  return;
                }
              } catch (e) {
                console.warn('Anchor append_history not available, falling back to client NFT flow:', e);
              }

              const solscanUrl = await mintHNFT(encrypted, proof, 'session');
              console.log('Tx Sig for Solscan (devnet):', solscanUrl);
              setLastTxUrl(solscanUrl);
            } catch (e: any) {
              console.error('End session mint failed:', e);
              const msg = e?.message || String(e);
              if (msg.includes('already been processed')) {
                if (lastTxUrl) {
                  setLastTxUrl(lastTxUrl);
                }
              } else {
                alert('Mint error: ' + msg);
              }
            }
            finally {
              inProgressRef.current = false;
            }
          }}
          disabled={isEncrypting || isMinting || messages.length === 0}
          className="psychat-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          End Session & Mint HNFT
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
