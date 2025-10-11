import {
  createTokenWithMetadata,
  createDevnetConnection,
  generateTestKeypair,
  airdropSol,
  TokenMetadata,
} from '../utils/tokenCreation';

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
    const psyMetadata: TokenMetadata = {
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

export { createPSYToken };
