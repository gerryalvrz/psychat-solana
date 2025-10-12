import { 
  Connection, 
  PublicKey, 
  SystemProgram 
} from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { getAnchorProgram } from '../../lib/anchor';

export interface HNFTResult {
  hnftAddress: PublicKey;
  transactionSignature: string;
}

export interface ChatNFTRegistration {
  chatNFTMint: PublicKey;
  walrusCid: string;
}

/**
 * HNFT SBT Operations - Identity Container Management
 * Handles soulbound identity tokens for users
 */

/**
 * Ensure user has an HNFT (Health NFT) identity container
 * Creates one if it doesn't exist
 */
export async function ensureHNFTExists(
  connection: Connection,
  wallet: WalletContextState,
  encryptedData: string,
  zkProof: string,
  category: string = 'therapy_session'
): Promise<HNFTResult> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    const programId = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
    if (!programId) {
      throw new Error('PsyChat program not configured');
    }

    const program = await getAnchorProgram(connection, wallet, programId);
    
    // Derive HNFT PDA
    const [hnftPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('hnft'), wallet.publicKey.toBytes()],
      new PublicKey(programId)
    );

    // Check if HNFT already exists by checking account info
    try {
      const accountInfo = await connection.getAccountInfo(hnftPda);
      if (accountInfo) {
        console.log('HNFT already exists for user:', hnftPda.toBase58());
        return {
          hnftAddress: hnftPda,
          transactionSignature: 'existing'
        };
      }
    } catch (error) {
      // Account doesn't exist, create it
      console.log('Creating new HNFT for user...');
    }

    // Convert data to required format
    const encryptedDataBytes = new Uint8Array(64);
    const dataBytes = new TextEncoder().encode(encryptedData);
    encryptedDataBytes.set(dataBytes.slice(0, 64));

    const zkProofBytes = new Uint8Array(32);
    const proofBytes = new TextEncoder().encode(zkProof);
    zkProofBytes.set(proofBytes.slice(0, 32));

    const categoryByte = category === 'therapy_session' ? 0 : 1;

    // Mint HNFT
    const tx = await program.methods
      .mintHnft(
        Array.from(encryptedDataBytes),
        Array.from(zkProofBytes),
        categoryByte
      )
      .accounts({
        user: wallet.publicKey,
        hnft: hnftPda,
        systemProgram: SystemProgram.programId
      })
      .rpc();

    console.log('HNFT created successfully:', hnftPda.toBase58());
    console.log('Transaction signature:', tx);

    return {
      hnftAddress: hnftPda,
      transactionSignature: tx
    };

  } catch (error) {
    console.error('Error ensuring HNFT exists:', error);
    throw new Error(`Failed to ensure HNFT exists: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Register a ChatNFT in the user's HNFT identity container
 * Links the tradeable NFT to the soulbound identity
 */
export async function registerChatNFT(
  connection: Connection,
  wallet: WalletContextState,
  registration: ChatNFTRegistration
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    const programId = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
    if (!programId) {
      throw new Error('PsyChat program not configured');
    }

    const program = await getAnchorProgram(connection, wallet, programId);
    
    // Derive PDAs
    const [hnftPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('hnft'), wallet.publicKey.toBytes()],
      new PublicKey(programId)
    );
    
    const [datasetPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('dataset'), hnftPda.toBytes()],
      new PublicKey(programId)
    );

    // Convert Walrus CID to required format
    const walrusCidBytes = new Uint8Array(32);
    const cidBytes = new TextEncoder().encode(registration.walrusCid);
    walrusCidBytes.set(cidBytes.slice(0, 32));

    const categoryBytes = new Uint8Array(16);
    const category = 'therapy_session';
    const categoryTextBytes = new TextEncoder().encode(category);
    categoryBytes.set(categoryTextBytes.slice(0, 16));

    // Register ChatNFT in Dataset PDA
    const tx = await program.methods
      .mintDatasetNft(
        registration.chatNFTMint,
        Array.from(walrusCidBytes),
        Array.from(categoryBytes)
      )
      .accounts({
        user: wallet.publicKey,
        hnft: hnftPda,
        dataset: datasetPda,
        systemProgram: SystemProgram.programId
      })
      .rpc();

    console.log('ChatNFT registered in HNFT identity:', datasetPda.toBase58());
    console.log('Transaction signature:', tx);

    return tx;

  } catch (error) {
    console.error('Error registering ChatNFT:', error);
    throw new Error(`Failed to register ChatNFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all ChatNFTs associated with a user's HNFT identity
 * Note: This is a simplified implementation for MVP
 * In production, you'd want to implement proper account filtering
 */
export async function getChatNFTsForUser(
  connection: Connection,
  userPublicKey: PublicKey
): Promise<PublicKey[]> {
  try {
    const programId = process.env.NEXT_PUBLIC_PSYCHAT_PROGRAM_ID;
    if (!programId) {
      throw new Error('PsyChat program not configured');
    }

    // For MVP, return empty array
    // In production, implement proper account scanning
    console.log('Getting ChatNFTs for user:', userPublicKey.toBase58());
    console.log('Note: Full ChatNFT querying not implemented in MVP');
    
    return [];

  } catch (error) {
    console.error('Error fetching ChatNFTs for user:', error);
    return [];
  }
}
