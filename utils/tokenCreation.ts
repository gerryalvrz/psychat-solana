import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from '@solana/spl-token';
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata';

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  decimals: number;
  supply: number;
}

export interface CreateTokenResult {
  mint: PublicKey;
  signature: string;
  explorerUrl: string;
}

/**
 * Creates a new SPL token with metadata on Solana devnet
 * @param connection - Solana connection
 * @param payer - Keypair to pay for the transaction
 * @param metadata - Token metadata
 * @returns Promise<CreateTokenResult>
 */
export async function createTokenWithMetadata(
  connection: Connection,
  payer: Keypair,
  metadata: TokenMetadata
): Promise<CreateTokenResult> {
  try {
    console.log('🚀 Starting token creation process...');
    console.log(`Token: ${metadata.name} (${metadata.symbol})`);

    // 1. Create the mint account
    console.log('📝 Creating mint account...');
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, // mint authority
      payer.publicKey, // freeze authority
      metadata.decimals,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );

    console.log(`✅ Mint created: ${mint.toString()}`);

    // 2. Create associated token account for the payer
    console.log('💼 Creating associated token account...');
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    console.log(`✅ Token account created: ${tokenAccount.address.toString()}`);

    // 3. Mint initial supply to the payer's token account
    console.log(`💰 Minting ${metadata.supply} tokens...`);
    const mintAmount = metadata.supply * Math.pow(10, metadata.decimals);
    
    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer,
      mintAmount
    );

    console.log(`✅ Minted ${metadata.supply} tokens`);

    // 4. Create metadata account
    console.log('📋 Creating metadata account...');
    const [metadataAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Create metadata instruction
    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: mint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: `https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json`, // You can replace this with your own metadata JSON
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: payer.publicKey,
                verified: true,
                share: 100,
              },
            ],
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    );

    // 5. Create and send transaction
    console.log('📤 Creating transaction...');
    const transaction = new Transaction().add(createMetadataInstruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;

    console.log('✍️ Signing transaction...');
    transaction.sign(payer);

    console.log('📡 Sending transaction...');
    const signature = await connection.sendTransaction(transaction, [payer], {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    console.log('⏳ Confirming transaction...');
    await connection.confirmTransaction(signature, 'confirmed');

    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

    console.log('🎉 Token creation successful!');
    console.log(`📊 Mint Address: ${mint.toString()}`);
    console.log(`🔗 Explorer: ${explorerUrl}`);

    return {
      mint,
      signature,
      explorerUrl,
    };
  } catch (error) {
    console.error('❌ Error creating token:', error);
    throw error;
  }
}

/**
 * Creates a devnet connection
 */
export function createDevnetConnection(): Connection {
  return new Connection('https://api.devnet.solana.com', 'confirmed');
}

/**
 * Generates a new keypair for testing
 */
export function generateTestKeypair(): Keypair {
  return Keypair.generate();
}

/**
 * Airdrops SOL to a keypair for testing
 */
export async function airdropSol(
  connection: Connection,
  keypair: Keypair,
  amount: number = 1
): Promise<void> {
  console.log(`💧 Requesting ${amount} SOL airdrop...`);
  const signature = await connection.requestAirdrop(
    keypair.publicKey,
    amount * LAMPORTS_PER_SOL
  );
  
  await connection.confirmTransaction(signature);
  console.log(`✅ Airdrop successful: ${signature}`);
}

/**
 * Gets the balance of a token account
 */
export async function getTokenBalance(
  connection: Connection,
  tokenAccount: PublicKey
): Promise<number> {
  const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
  return accountInfo.value.uiAmount || 0;
}
