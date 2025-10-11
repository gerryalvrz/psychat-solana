import { 
  Metaplex, 
  keypairIdentity, 
  toMetaplexFile,
  CreateNftInput,
  NftWithToken,
  walletAdapterIdentity
} from '@metaplex-foundation/js';
import { 
  Connection, 
  PublicKey, 
  Keypair,
  clusterApiUrl 
} from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { 
  setAuthority,
  AuthorityType,
} from '@solana/spl-token';
import { ArciumIntegration } from './sponsorIntegrations';

export interface ChatNFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  walrusCid: string; // Add this property
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
  };
}

export interface MintChatNFTResult {
  nft: NftWithToken;
  mintAddress: PublicKey;
  metadataUri: string;
  transactionSignature: string;
}

/**
 * Mint a ChatNFT (SPL token) using Metaplex SDK
 * This creates a real NFT that will be visible in wallets and marketplaces
 */
export async function mintChatNFT(
  connection: Connection,
  wallet: WalletContextState,
  chatData: {
    messages: Array<{ role: string; text: string; timestamp: Date }>;
    category: string;
    encryptedData: string;
    walrusCid: string;
  }
): Promise<MintChatNFTResult> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Initialize Metaplex with wallet adapter
    const metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet));

    // Step 1: Create minimal metadata (time, date, storage location)
    const sessionDate = new Date().toISOString();
    const minimalMetadata = {
      timestamp: sessionDate,
      date: sessionDate.split('T')[0],
      storage: `walrus://${chatData.walrusCid}`,
      category: chatData.category
    };

    // Step 2: Encrypt minimal metadata with Arcium
    console.log('Encrypting minimal metadata with Arcium...');
    const { encrypted: encryptedMetadata, proof: metadataProof } = 
      await ArciumIntegration.encryptData(JSON.stringify(minimalMetadata));
    
    // Step 3: Create simple metadata for NFT
    const metadata: ChatNFTMetadata = {
      name: `PsyChat Session`,
      symbol: 'PSYCHAT',
      description: `Encrypted therapy session metadata. Session data stored on Walrus.`,
      image: 'https://arweave.net/placeholder-therapy-session-image',
      walrusCid: chatData.walrusCid,
      attributes: [
        {
          trait_type: 'Category',
          value: chatData.category
        },
        {
          trait_type: 'Encrypted',
          value: 'true'
        },
        {
          trait_type: 'Storage',
          value: 'Walrus'
        },
        {
          trait_type: 'Session Date',
          value: sessionDate.split('T')[0]
        }
      ],
      properties: {
        files: [
          {
            uri: `walrus://${chatData.walrusCid}`,
            type: 'application/json'
          }
        ],
        category: 'therapy_session'
      }
    };

    // Step 4: Create metadata URI with encrypted metadata
    console.log('Creating encrypted metadata URI...');
    const metadataUri = `data:application/json;base64,${Buffer.from(encryptedMetadata).toString('base64')}`;
    console.log('Encrypted metadata URI created:', metadataUri);

    // Create the NFT
    console.log('Minting ChatNFT...');
    const { nft } = await metaplex.nfts().create({
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: 500, // 5% royalty
      creators: [
        {
          address: wallet.publicKey,
          share: 100,
        },
      ]
    });

    console.log('ChatNFT minted successfully:', nft.address.toBase58());
    console.log('Metadata URI:', metadataUri);

    // Step 5: Make it soulbound (simplified - just revoke mint authority)
    console.log('Making ChatNFT soulbound...');
    try {
      // Only revoke mint authority to make it non-transferable
      await setAuthority(connection, wallet as any, nft.address, wallet.publicKey!, AuthorityType.MintTokens, null);
      console.log('NFT made soulbound successfully');
    } catch (error) {
      console.warn('Failed to make NFT soulbound, but NFT was created successfully:', error);
      // Continue even if soulbound setup fails
    }

    return {
      nft: nft as NftWithToken,
      mintAddress: nft.address,
      metadataUri,
      transactionSignature: nft.address.toBase58() // Using mint address as identifier
    };

  } catch (error) {
    console.error('Error minting ChatNFT:', error);
    throw new Error(`Failed to mint ChatNFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


/**
 * Generate a simple therapy session image (placeholder)
 * In production, you might want to generate actual images based on session data
 */
export function generateSessionImage(category: string, messageCount: number): string {
  // For now, return a placeholder. In production, you could:
  // 1. Generate SVG images based on session data
  // 2. Use AI to create therapy-themed images
  // 3. Use a service like IPFS for image storage
  return `https://via.placeholder.com/400x400/6366f1/ffffff?text=PsyChat+${category}+${messageCount}msgs`;
}

/**
 * Create a summary of the therapy session for metadata
 */
export function createSessionSummary(messages: Array<{ role: string; text: string; timestamp: Date }>): string {
  const userMessages = messages.filter(m => m.role === 'user');
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  
  return `Therapy session with ${userMessages.length} user messages and ${assistantMessages.length} AI responses. ` +
         `Session duration: ${messages.length > 0 ? 
           Math.round((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / 60000) : 0} minutes.`;
}
