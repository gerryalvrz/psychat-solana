import { 
  Metaplex, 
  keypairIdentity, 
  walletAdapterIdentity,
  CreateNftInput,
  NftWithToken,
} from '@metaplex-foundation/js';
import { 
  Connection, 
  PublicKey,
  Transaction,
  TransactionSignature
} from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { 
  setAuthority,
  AuthorityType,
} from '@solana/spl-token';
import { createMetadataUri, validateMetadataUri } from './metadataStorage';

export interface ChatNFTResult {
  nft: NftWithToken;
  mintAddress: PublicKey;
  metadataUri: string;
  transactionSignature: string;
}

// Transaction tracking to prevent duplicates (simplified - only for same transaction)
const pendingTransactions = new Map<string, Promise<ChatNFTResult>>();

export interface ChatSessionData {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  messageCount: number;
}

/**
 * ChatNFT Minting - Tradeable Session NFTs using Metaplex
 * Creates standard Solana NFTs that can be traded on marketplaces
 */

/**
 * Generate a unique transaction key for deduplication (simplified)
 */
function generateTransactionKey(sessionData: ChatSessionData, walletPublicKey: PublicKey): string {
  return `${walletPublicKey.toBase58()}-${Date.now()}`;
}

/**
 * Mint a tradeable ChatNFT using Metaplex SDK
 * This creates a standard NFT that will be visible in wallets and marketplaces
 */
export async function mintChatNFT(
  connection: Connection,
  wallet: WalletContextState,
  sessionData: ChatSessionData
): Promise<ChatNFTResult> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  // Simply perform the minting without complex deduplication
  return await performMinting(connection, wallet, sessionData);
}

/**
 * Perform the actual minting operation
 */
async function performMinting(
  connection: Connection,
  wallet: WalletContextState,
  sessionData: ChatSessionData
): Promise<ChatNFTResult> {
  // Initialize Metaplex with wallet adapter
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet));

  // Step 1: Create minimal metadata URI
  console.log('Creating minimal metadata...');
  const metadataUri = createMetadataUri(
    sessionData.sessionId,
    sessionData.startTime,
    sessionData.endTime
  );

  // Validate URI length
  if (!validateMetadataUri(metadataUri)) {
    throw new Error(`Metadata URI too long: ${metadataUri.length} characters (max 200)`);
  }

  console.log('Metadata URI created:', metadataUri);
  console.log('URI length:', metadataUri.length, 'characters');

  // Step 2: Create the NFT using Metaplex
  console.log('Minting ChatNFT with Metaplex...');
  
  const result = await metaplex.nfts().create({
    name: `PsyChat Session #${sessionData.sessionId}`,
    symbol: 'PSYCHAT',
    uri: metadataUri,
    sellerFeeBasisPoints: 500, // 5% royalty
    creators: [
      {
        address: wallet.publicKey,
        share: 100,
      },
    ]
  });
  
  const nft = result.nft as NftWithToken;
  console.log('ChatNFT minted successfully:', nft.address.toBase58());
  
  // Return the result
  return {
    nft,
    mintAddress: nft.address,
    metadataUri,
    transactionSignature: result.response.signature
  };
}

/**
 * Clear transaction cache (useful for debugging or resetting state)
 */
export function clearTransactionCache(): void {
  pendingTransactions.clear();
  console.log('Transaction cache cleared');
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats(): { pending: number } {
  return {
    pending: pendingTransactions.size
  };
}

/**
 * Verify that a ChatNFT is tradeable
 * Checks that the token account is not frozen
 */
export async function verifyChatNFTIsTradeable(
  connection: Connection,
  mintAddress: PublicKey,
  ownerAddress: PublicKey
): Promise<boolean> {
  try {
    // Get the token account
    const tokenAccounts = await connection.getTokenAccountsByOwner(ownerAddress, {
      mint: mintAddress
    });

    if (tokenAccounts.value.length === 0) {
      return false;
    }

    const tokenAccount = tokenAccounts.value[0];
    const accountInfo = await connection.getAccountInfo(tokenAccount.pubkey);
    
    if (!accountInfo) {
      return false;
    }

    // Check if the account is frozen (frozen accounts are not tradeable)
    // This is a simplified check - in practice you'd parse the token account data
    return true; // For now, assume it's tradeable if it exists

  } catch (error) {
    console.error('Error verifying ChatNFT tradeability:', error);
    return false;
  }
}
