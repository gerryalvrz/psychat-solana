const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} = require('@solana/spl-token');
const {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID: TOKEN_METADATA_PROGRAM_ID,
} = require('@metaplex-foundation/mpl-token-metadata');

/**
 * Creates a new SPL token with metadata on Solana devnet
 */
async function createTokenWithMetadata(connection, payer, metadata) {
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
            uri: `https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json`,
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
function createDevnetConnection() {
  return new Connection('https://api.devnet.solana.com', 'confirmed');
}

/**
 * Generates a new keypair for testing
 */
function generateTestKeypair() {
  return Keypair.generate();
}

/**
 * Airdrops SOL to a keypair for testing
 */
async function airdropSol(connection, keypair, amount = 1) {
  console.log(`💧 Requesting ${amount} SOL airdrop...`);
  const signature = await connection.requestAirdrop(
    keypair.publicKey,
    amount * LAMPORTS_PER_SOL
  );
  
  await connection.confirmTransaction(signature);
  console.log(`✅ Airdrop successful: ${signature}`);
}

/**
 * Creates the $PSY token on Solana devnet
 */
async function createPSYToken() {
  console.log('🎯 Creating $PSY Token on Solana Devnet');
  console.log('=====================================');

  try {
    // 1. Set up connection and wallet
    const connection = createDevnetConnection();
    const payer = generateTestKeypair();

    console.log(`🔑 Generated wallet: ${payer.publicKey.toString()}`);

    // 2. Airdrop SOL for transaction fees
    await airdropSol(connection, payer, 2); // Request 2 SOL

    // 3. Define PSY token metadata
    const psyMetadata = {
      name: 'PsyChat Token',
      symbol: 'PSY',
      description: 'The native token of PsyChat - a revolutionary AI-powered chat platform on Solana',
      image: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
      decimals: 9,
      supply: 1000000000, // 1 billion PSY tokens
    };

    console.log('\n📋 Token Details:');
    console.log(`Name: ${psyMetadata.name}`);
    console.log(`Symbol: ${psyMetadata.symbol}`);
    console.log(`Decimals: ${psyMetadata.decimals}`);
    console.log(`Supply: ${psyMetadata.supply.toLocaleString()} tokens`);
    console.log(`Description: ${psyMetadata.description}`);

    // 4. Create the token
    console.log('\n🚀 Creating PSY token...');
    const result = await createTokenWithMetadata(
      connection,
      payer,
      psyMetadata
    );

    // 5. Display results
    console.log('\n🎉 PSY Token Created Successfully!');
    console.log('==================================');
    console.log(`Mint Address: ${result.mint.toString()}`);
    console.log(`Transaction Signature: ${result.signature}`);
    console.log(`Explorer URL: ${result.explorerUrl}`);
    
    console.log('\n📊 Token Information:');
    console.log(`- Total Supply: 1,000,000,000 PSY`);
    console.log(`- Decimals: 9`);
    console.log(`- Network: Solana Devnet`);
    console.log(`- Program: SPL Token Program`);

    console.log('\n🔗 Useful Links:');
    console.log(`- View on Solana Explorer: ${result.explorerUrl}`);
    console.log(`- Add to Phantom Wallet: Use mint address ${result.mint.toString()}`);

    return result;
  } catch (error) {
    console.error('❌ Failed to create PSY token:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  createPSYToken()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createPSYToken };
