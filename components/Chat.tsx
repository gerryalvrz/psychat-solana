import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArciumIntegration, WalrusIntegration } from '../utils/sponsorIntegrations';
import { arciumConversationEncryption } from '../lib/arcium-conversation-encryption';
import { storeEncryptedConversation } from '../lib/encrypted-data-storage';
import { getAnchorProgram } from '../lib/anchor';
import { registerChatNFT } from '../utils/identity/hnftOperations';
import { mintChatNFT } from '../utils/nft/chatNFTMinting';
import { cleanupOldTransactions } from '../utils/cleanupTransactions';
import { keccak256 } from 'js-sha3';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { HoloPanel, HoloButton, HoloText } from '../components/ui/holo';
import { ComplexMolecule, WaterMolecule } from '../components/ui';

// New chat components
import HNFTIdentityCard from './chat/HNFTIdentityCard';
import HNFTStatusCompact from './chat/HNFTStatusCompact';
import ChatTerminal from './chat/ChatTerminal';
import ChatNFTList from './chat/ChatNFTList';
import ChatNFTStatusCompact from './chat/ChatNFTStatusCompact';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  encrypted?: boolean;
  hnftMinted?: boolean;
}

interface ChatNFT {
  transactionSignature: string;
  sessionId: string;
  timestamp: Date;
  messageCount?: number;
}

interface ChatProps {
  onNavigateToVideo?: () => void;
}

export default function Chat({ onNavigateToVideo }: ChatProps) {
  const walletCtx = useWallet();
  const { publicKey, signTransaction, sendTransaction } = walletCtx;
  const { connection } = useConnection();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'encrypted' | 'error'>('idle');
  const [optInMint, setOptInMint] = useState(true);
  const [hnftPda, setHnftPda] = useState<string | null>(null);
  const [hnftSig, setHnftSig] = useState<string | null>(null);
  const [lastTxUrl, setLastTxUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inProgressRef = useRef(false);
  
  // New state for HNFT section expansion
  const [isHNFTExpanded, setIsHNFTExpanded] = useState(true);
  
  // State for HNFT section visibility
  const [isHNFTVisible, setIsHNFTVisible] = useState(true);
  
  // AI thinking state for typing indicator
  const [isAIThinking, setIsAIThinking] = useState(false);

  // ChatNFT state management
  const [chatNFTs, setChatNFTs] = useState<ChatNFT[]>([]);
  const [isChatNFTListExpanded, setIsChatNFTListExpanded] = useState(false);
  const [isChatNFTVisible, setIsChatNFTVisible] = useState(true);

  const clearMockData = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('psychat_hnft_pda');
      window.localStorage.removeItem('psychat_hnft_sig');
      window.localStorage.removeItem('psychat_chat_nfts');
      setHnftPda(null);
      setHnftSig(null);
      setChatNFTs([]);
      console.log('Mock data cleared');
    }
  };

  const buildSolscanTxUrl = (sig: string) => {
    // Check multiple sources to determine if we're on devnet
    const envNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || '';
    const connectionEndpoint = (connection as any)?.rpcEndpoint || '';
    
    // Determine if we're on devnet (default to devnet unless explicitly mainnet)
    let isDevnet = true; // Default to devnet for safety
    
    // Check if explicitly set to mainnet
    if (envNetwork === 'mainnet') {
      isDevnet = false;
    } else if (envNetwork === 'devnet' || envNetwork === 'testnet') {
      isDevnet = true;
    } else {
      // Check RPC endpoints for network indicators
      const endpointStr = `${rpcEndpoint}${connectionEndpoint}`.toLowerCase();
      if (endpointStr.includes('mainnet') && !endpointStr.includes('devnet') && !endpointStr.includes('testnet')) {
        isDevnet = false;
      } else {
        // Default to devnet if unclear
        isDevnet = true;
      }
    }
    
    return `https://explorer.solana.com/tx/${sig}${isDevnet ? '?cluster=devnet' : ''}`;
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.history.back();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Auto-hide HNFT section on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsHNFTVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Clean up old transaction data on component mount
    cleanupOldTransactions();
  }, []);

  // Set initial HNFT expansion state
  useEffect(() => {
    // When HNFT is minted, automatically collapse to show compact sidebar
    if (hnftPda) {
      // Small delay to allow user to see the success state before collapsing
      const timer = setTimeout(() => {
        setIsHNFTExpanded(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [hnftPda]);

  // Handle HNFT card close - collapse but keep available
  const handleHNFTClose = () => {
    console.log('Closing HNFT card, setting isHNFTExpanded to false');
    setIsHNFTExpanded(false);
  };

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

      // Load ChatNFTs from localStorage
      const savedChatNFTs = window.localStorage.getItem('psychat_chat_nfts');
      if (savedChatNFTs) {
        try {
          const parsedChatNFTs = JSON.parse(savedChatNFTs);
          // Convert timestamp strings back to Date objects
          const chatNFTsWithDates = parsedChatNFTs.map((nft: any) => ({
            ...nft,
            timestamp: new Date(nft.timestamp)
          }));
          setChatNFTs(chatNFTsWithDates);
        } catch (error) {
          console.error('Error parsing saved ChatNFTs:', error);
        }
      }
    }
  }, []);

  // Check for existing HNFT when wallet connects
  useEffect(() => {
    const checkExistingHNFT = async () => {
      console.log('checkExistingHNFT - publicKey:', publicKey, 'connection:', !!connection);
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

  // Mint HNFT using Anchor program (Identity container only)
  const mintHNFT = async (): Promise<string> => {
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
        console.log('Attempting to mint HNFT (identity container) with program ID:', pid);
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

        // Use dummy data to satisfy current program interface (identity only)
        const dummyEncryptedData = Buffer.alloc(64).fill(0);
        const dummyZkProof = Buffer.alloc(32).fill(0); 
        const identityCategory = 0; // Identity category

        const sig = await program.methods
          .mintHnft(dummyEncryptedData, dummyZkProof, identityCategory)
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

        console.log('Transaction signature received:', sig);
        
        // Verify the transaction actually succeeded
        console.log('Verifying transaction status...');
        const status = await connection.getSignatureStatus(sig);
        
        if (!status || !status.value) {
          throw new Error(`Transaction verification failed: Unable to get status for signature ${sig}`);
        }
        
        if (status.value.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}. Signature: ${sig}`);
        }
        
        // Verify the HNFT account was actually created
        console.log('Verifying HNFT account creation...');
        const hnftAccount = await connection.getAccountInfo(hnftPda);
        if (!hnftAccount) {
          throw new Error(`Transaction succeeded but HNFT account not found at ${hnftPda.toBase58()}. This may indicate a program error.`);
        }
        
        console.log('HNFT (identity container) minted successfully:', sig, 'PDA:', hnftPda.toBase58());
        
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
      // Set AI thinking state
      setIsAIThinking(true);
      
      // Call Psychat API (using Grok)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userText }], provider: 'xai', model: 'grok-4-latest' }),
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
    } finally {
      setIsAIThinking(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle HNFT minting with error handling
  const handleMintHNFT = async (): Promise<string> => {
    if (!publicKey || !signTransaction) {
      alert('Connect wallet');
      return '';
    }
    if (isMinting) {
      console.log('Minting already in progress, ignoring click');
      return '';
    }
    setIsMinting(true);
    try {
      setError(null);
      setSuccess(null);
      const solscanUrl = await mintHNFT(); // Identity container only
      setLastTxUrl(solscanUrl);
      
      // Update HNFT state immediately after successful minting
      const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
      if (pid) {
        const [hnftPda] = PublicKey.findProgramAddressSync([
          Buffer.from('hnft'),
          publicKey.toBytes(),
        ], new PublicKey(pid));
        
        // Update state immediately
        setHnftPda(hnftPda.toBase58());
        setHnftSig(solscanUrl.split('/').pop() || 'minted');
        
        // Store in localStorage
        window.localStorage.setItem('psychat_hnft_pda', hnftPda.toBase58());
        window.localStorage.setItem('psychat_hnft_sig', solscanUrl.split('/').pop() || 'minted');
        
        console.log('HNFT state updated immediately:', hnftPda.toBase58());
      }
      
      setSuccess('Identity HNFT minted successfully! You can now start chatting.');
      return solscanUrl;
    } catch (e: any) {
      console.error('HNFT mint failed:', e);
      let errorMessage = e?.message || String(e);
      
      // Handle specific transaction errors
      if (errorMessage.includes('This transaction has already been processed')) {
        errorMessage = 'Transaction already processed. Please wait a moment and try again.';
      } else if (errorMessage.includes('HNFT already exists')) {
        // If HNFT already exists, check for it and update state
        const pid = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
        if (pid) {
          try {
            const [hnftPda] = PublicKey.findProgramAddressSync([
              Buffer.from('hnft'),
              publicKey.toBytes(),
            ], new PublicKey(pid));
            
            const existingHnft = await connection.getAccountInfo(hnftPda);
            if (existingHnft) {
              setHnftPda(hnftPda.toBase58());
              setHnftSig('existing_hnft');
              window.localStorage.setItem('psychat_hnft_pda', hnftPda.toBase58());
              window.localStorage.setItem('psychat_hnft_sig', 'existing_hnft');
              setSuccess('HNFT already exists! You can now start chatting.');
              return '';
            }
          } catch (checkError) {
            console.error('Error checking existing HNFT:', checkError);
          }
        }
        errorMessage = 'HNFT already exists for this wallet. Please refresh the page to see your existing HNFT.';
      } else if (errorMessage.includes('already in use')) {
        errorMessage = 'HNFT already exists for this wallet. Please refresh the page to see your existing HNFT.';
      }
      
      setError('HNFT mint failed: ' + errorMessage);
      return '';
    } finally {
      setIsMinting(false);
    }
  };

  // Handle end session with ChatNFT minting (HNFT must exist first)
  const handleEndSession = async () => {
    if (inProgressRef.current || isEncrypting || isMinting) return;
    if (!publicKey) {
      alert('Connect wallet');
      return;
    }
    
    // Check if user has HNFT - mandatory for chat
    if (!hnftPda) {
      setError('Please mint your HNFT identity first before ending the session.');
      return;
    }
    
    try {
      inProgressRef.current = true;
      setError(null);
      setSuccess(null);
      setLastTxUrl(null);
      
      // Step 1: Encrypt entire conversation with Arcium MPC (seamless)
      console.log('🔐 Encrypting conversation history with Arcium MPC...');
      setEncryptionStatus('encrypting');
      
      let encryptionResult;
      try {
        encryptionResult = await arciumConversationEncryption.encryptConversation(messages);
        
        if (!encryptionResult.success) {
          console.warn('⚠️ Encryption failed, proceeding without encryption:', encryptionResult.error);
          setEncryptionStatus('error');
          // Continue without encryption - don't throw error
          encryptionResult = null;
        } else {
          setEncryptionStatus('encrypted');
          console.log('✅ Conversation encrypted successfully');
        }
      } catch (error) {
        console.warn('⚠️ Encryption error, proceeding without encryption:', error);
        setEncryptionStatus('error');
        // Continue without encryption - don't throw error
        encryptionResult = null;
      }
      
      // Step 2: Store encrypted data separately (not in metadata URI)
      console.log('📦 Storing encrypted conversation data...');
      const sessionId = Date.now().toString();
      const walrusCid = `mock_walrus_${Date.now()}`;
      
      // Store full encrypted data separately from metadata
      if (encryptionResult && encryptionResult.success && encryptionResult.encryptedData && encryptionResult.decryptionKey) {
        storeEncryptedConversation(sessionId, {
          encryptedData: encryptionResult.encryptedData,
          decryptionKey: encryptionResult.decryptionKey,
          timestamp: encryptionResult.timestamp || Date.now(),
          mxeAddress: encryptionResult.mxeAddress || 'unknown'
        }, walrusCid);
      }
      
      // Step 3: Create tradeable ChatNFT with Metaplex (HNFT already exists)
      console.log('Creating tradeable ChatNFT with Metaplex...');
      const sessionStartTime = messages.length > 0 ? messages[0].timestamp : new Date();
      const sessionEndTime = new Date();
      
      const chatNFTResult = await mintChatNFT(connection, walletCtx, {
        sessionId,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        messageCount: messages.length,
        encryptedConversation: encryptionResult ? {
          encryptedData: encryptionResult.encryptedData!,
          decryptionKey: encryptionResult.decryptionKey!,
          timestamp: encryptionResult.timestamp!,
          mxeAddress: encryptionResult.mxeAddress!
        } : undefined,
        walrusCid: walrusCid
      });
      
      console.log('ChatNFT minted:', chatNFTResult.mintAddress.toBase58());
      console.log('Metadata URI:', chatNFTResult.metadataUri);
      
      const solscanUrl = buildSolscanTxUrl(chatNFTResult.transactionSignature);
      
      // Store ChatNFT data
      const newChatNFT = {
        transactionSignature: chatNFTResult.transactionSignature,
        sessionId,
        timestamp: new Date(),
        messageCount: messages.length
      };

      // Update state and localStorage
      setChatNFTs(prev => {
        const updated = [...prev, newChatNFT];
        localStorage.setItem('psychat_chat_nfts', JSON.stringify(updated));
        return updated;
      });

      // Show confirmation in sidebar by expanding ChatNFT list
      setIsChatNFTListExpanded(true);
      
      const encryptionStatusText = encryptionResult ? 
        ' (encrypted conversation stored separately)' : 
        ' (no encryption)';
      setSuccess(`✅ ChatNFT minted successfully${encryptionStatusText}! View it in the sidebar panel.`);
      setLastTxUrl(solscanUrl);
    } catch (e: any) {
      console.error('End session mint failed:', e);
      const msg = e?.message || String(e);
      
      // Handle specific error cases with improved messaging
      if (msg.includes('already been processed') || msg.includes('already processed')) {
        setSuccess('✅ ChatNFT already minted for this session. Please check your wallet.');
        // Try to extract transaction signature from error message if available
        const sigMatch = msg.match(/signature[:\s]+([A-Za-z0-9]{64,88})/i);
        if (sigMatch) {
          const solscanUrl = buildSolscanTxUrl(sigMatch[1]);
          setLastTxUrl(solscanUrl);
          
          // Store ChatNFT data even for duplicate errors
          const newChatNFT = {
            transactionSignature: sigMatch[1],
            sessionId: Date.now().toString(),
            timestamp: new Date(),
            messageCount: messages.length
          };
          setChatNFTs(prev => {
            const updated = [...prev, newChatNFT];
            localStorage.setItem('psychat_chat_nfts', JSON.stringify(updated));
            return updated;
          });
          setIsChatNFTListExpanded(true);
        }
      } else if (msg.includes('Transaction already in progress')) {
        setSuccess('⏳ Transaction in progress. Please wait for completion.');
      } else if (msg.includes('This session has already been minted')) {
        setSuccess('✅ This session has already been minted as an NFT. Please check your wallet.');
        // Try to extract transaction signature from error message if available
        const sigMatch = msg.match(/signature[:\s]+([A-Za-z0-9]{64,88})/i);
        if (sigMatch) {
          const solscanUrl = buildSolscanTxUrl(sigMatch[1]);
          setLastTxUrl(solscanUrl);
          
          // Store ChatNFT data even for duplicate errors
          const newChatNFT = {
            transactionSignature: sigMatch[1],
            sessionId: Date.now().toString(),
            timestamp: new Date(),
            messageCount: messages.length
          };
          setChatNFTs(prev => {
            const updated = [...prev, newChatNFT];
            localStorage.setItem('psychat_chat_nfts', JSON.stringify(updated));
            return updated;
          });
          setIsChatNFTListExpanded(true);
        }
      } else if (msg.includes('NFT_ALREADY_PROCESSED:')) {
        setSuccess('✅ ChatNFT minted successfully! The transaction was already processed. Please check your wallet.');
        
        // Try to extract transaction signature from error message
        const sigMatch = msg.match(/Transaction:\s+([A-Za-z0-9]{64,88})/);
        if (sigMatch) {
          const solscanUrl = buildSolscanTxUrl(sigMatch[1]);
          setLastTxUrl(solscanUrl);
          
          // Store ChatNFT data even for duplicate errors
          const newChatNFT = {
            transactionSignature: sigMatch[1],
            sessionId: Date.now().toString(),
            timestamp: new Date(),
            messageCount: messages.length
          };
          setChatNFTs(prev => {
            const updated = [...prev, newChatNFT];
            localStorage.setItem('psychat_chat_nfts', JSON.stringify(updated));
            return updated;
          });
          setIsChatNFTListExpanded(true);
        }
        
        // This is actually a success case, not an error - skip HNFT registration
        return; // Exit early to skip HNFT registration
      } else if (msg.includes('Transaction already processed - check your wallet')) {
        setSuccess('✅ ChatNFT minted successfully! The transaction was already processed. Please check your wallet.');
        // This is actually a success case, not an error
      } else if (msg.includes('Transaction simulation failed')) {
        setError('Transaction simulation failed. Please try again or check your wallet connection.');
      } else if (msg.includes('out of memory') || msg.includes('memory allocation failed')) {
        setError('Transaction too complex. Please try with a shorter conversation.');
      } else if (msg.includes('insufficient funds') || msg.includes('Insufficient SOL')) {
        setError('Insufficient SOL for transaction fees. Please add more SOL to your wallet.');
      } else if (msg.includes('Wallet not connected')) {
        setError('Please connect your wallet first.');
      } else {
        setError('ChatNFT mint failed: ' + msg);
      }
    }
    finally {
      inProgressRef.current = false;
    }
  };

  // Debug log (commented out to reduce console spam)
  // console.log('Current state:', { hnftPda, isHNFTExpanded });

  return (
    <div className="chat-section-container relative fixed inset-0 z-40 chat-section-background overflow-hidden">
      
      {/* Crystal corner accents */}
      <div className="crystal-corner-tl" />
      <div className="crystal-corner-tr" />
      <div className="crystal-corner-bl" />
      <div className="crystal-corner-br" />
      
      {/* Sharp geometric lines */}
      <div className="absolute top-0 left-1/4 right-1/4 h-0.5 crystal-line" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 crystal-line-magenta" />
      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 crystal-line-purple" />
      <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 crystal-line" />
      
      {/* Geometric overlay */}
      <div className="geometric-overlay" />
      
      {/* Layout wrapper */}
      <div className="flex gap-4 h-full p-4">
        {/* HNFT Section - Conditional rendering */}
        {isHNFTVisible && (
          <>
            {!hnftPda ? (
              /* Show full HNFT card when no HNFT exists */
              <div className="hnft-section-expanded w-full max-w-md mx-auto">
                <HNFTIdentityCard
                  hnftPda={hnftPda}
                  hnftSig={hnftSig || ''}
                  onMint={handleMintHNFT}
                  isMinting={isMinting}
                  error={error}
                  success={success}
                  isExpanded={true}
                  onToggle={() => setIsHNFTExpanded(!isHNFTExpanded)}
                  onClose={handleHNFTClose}
                  publicKey={publicKey}
                />
              </div>
            ) : isHNFTExpanded ? (
              /* Show expanded HNFT card when HNFT exists and expanded */
              <div className="hnft-section-expanded w-80">
                <HNFTIdentityCard
                  hnftPda={hnftPda}
                  hnftSig={hnftSig || ''}
                  onMint={handleMintHNFT}
                  isMinting={isMinting}
                  error={error}
                  success={success}
                  isExpanded={isHNFTExpanded}
                  onToggle={() => setIsHNFTExpanded(!isHNFTExpanded)}
                  onClose={handleHNFTClose}
                  publicKey={publicKey}
                />
              </div>
            ) : isChatNFTListExpanded ? (
              /* Show expanded ChatNFT list when ChatNFT is expanded */
              <div className="hnft-section-expanded w-80">
                <ChatNFTList
                  chatNFTs={chatNFTs}
                  isExpanded={isChatNFTListExpanded}
                  onToggle={() => setIsChatNFTListExpanded(!isChatNFTListExpanded)}
                />
              </div>
            ) : (
              /* Show compact sidebar when HNFT exists but collapsed */
              <div className="hnft-sidebar relative z-50 space-y-4">
                <HNFTStatusCompact
                  hnftPda={hnftPda}
                  hnftSig={hnftSig || ''}
                  onExpand={() => {
                    console.log('Expanding HNFT card, setting isHNFTExpanded to true');
                    setIsHNFTExpanded(true);
                    // Collapse ChatNFT when expanding HNFT
                    setIsChatNFTListExpanded(false);
                  }}
                  onHide={() => setIsHNFTVisible(false)}
                />
                
                {/* Add ChatNFT Status Compact */}
                <ChatNFTStatusCompact
                  chatNFTCount={chatNFTs.length}
                  onExpand={() => {
                    console.log('Expanding ChatNFT list and main sidebar');
                    setIsHNFTExpanded(true);
                    setIsChatNFTListExpanded(true);
                    // Collapse HNFT when expanding ChatNFT
                    setIsHNFTExpanded(false);
                  }}
                  onHide={() => {
                    console.log('Hiding ChatNFT section');
                    setIsChatNFTVisible(false);
                  }}
                />
              </div>
            )}
          </>
        )}
        
        {/* Chat Terminal - Always show, but with different states */}
        <div className="chat-terminal-section flex-1 h-full w-full overflow-hidden">
          <ChatTerminal
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={handleSendMessage}
            isEncrypting={isEncrypting}
            isMinting={isMinting}
            isAIThinking={isAIThinking}
            encryptionStatus={encryptionStatus}
            onEndSession={handleEndSession}
            onToggleHNFT={() => setIsHNFTVisible(!isHNFTVisible)}
            isHNFTVisible={isHNFTVisible}
            hasHNFT={!!hnftPda}
            onNavigateToVideo={onNavigateToVideo}
          />
        </div>

        {/* Floating HNFT Toggle Button - Only show when HNFT is hidden */}
        {hnftPda && !isHNFTVisible && (
          <button
            onClick={() => setIsHNFTVisible(true)}
            className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-electric-cyan/20 hover:bg-electric-cyan/30 border border-electric-cyan/30 hover:border-electric-cyan/50 flex items-center justify-center text-electric-cyan hover:text-electric-cyan/80 transition-all duration-200 hover:scale-105 shadow-lg"
            title="Show Panel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}

      </div>
    </div>
  );
}
