import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';
import { ArciumIntegration, WalrusIntegration } from '../utils/sponsorIntegrations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  encrypted?: boolean;
  hnftMinted?: boolean;
}

export default function Chat() {
  const { publicKey, signTransaction } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [optInMint, setOptInMint] = useState(true);
  const [provider, setProvider] = useState<'openai' | 'xai'>((process.env.NEXT_PUBLIC_DEFAULT_PROVIDER as 'openai' | 'xai') || 'openai');
  const [model, setModel] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_MODEL || (provider === 'xai' ? 'grok-4-latest' : 'gpt-4o-mini'));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Simulate Anchor program call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock transaction signature
      const mockTxId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setIsMinting(false);
      return mockTxId;
    } catch (error) {
      setIsMinting(false);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !publicKey) return;

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

      if (optInMint) {
        // Encrypt user+assistant exchange for HNFT
        const conversationBlob = JSON.stringify([{ role: 'user', content: userText }, { role: 'assistant', content: aiText }, { sentiment }]);
        const { encrypted, proof, walrusCid } = await encryptWithArcium(conversationBlob);

        // Mint HNFT with sentiment category (mock category mapping)
        const txId = await mintHNFT(encrypted, proof, sentiment);

        // Mark latest two messages as minted/encrypted indicators
        setMessages(prev => prev.map(m => {
          if (m.id === userId) return { ...m, encrypted: true, hnftMinted: true };
          if (m.id === aiMsg.id) return { ...m, encrypted: true, hnftMinted: true };
          return m;
        }));

        console.log('HNFT minted:', txId, 'Walrus CID:', walrusCid, 'Sentiment:', sentiment);
      }
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
              {isEncrypting && message.id === messages[messages.length - 1]?.id && (
                <div className="mt-2 text-psy-blue text-sm">
                  🔄 Encrypting with Arcium ZK proofs...
                </div>
              )}
              {isMinting && message.id === messages[messages.length - 1]?.id && (
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
