// Initialize computation definitions for the MXE program
const anchor = require('@coral-xyz/anchor');
const { PublicKey, Keypair } = require('@solana/web3.js');
const { getClusterAccAddress, getMXEAccAddress, getCompDefAccAddress, getCompDefAccOffset } = require('@arcium-hq/client');

// Configuration
const CLUSTER_OFFSET = 1078779259;
const PROGRAM_ID = new PublicKey('EFs8XpQ9QHy6ZiMr91ejUe8up9S9TuMuJsFDgfzhSjan');
const RPC_URL = 'https://api.devnet.solana.com';

async function initializeComputationDefinitions() {
  console.log('🚀 Initializing Computation Definitions...\n');
  
  try {
    // Setup connection and provider
    const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');
    const wallet = new anchor.Wallet(Keypair.generate()); // Use a test wallet
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    
    console.log('1. Setting up connection...');
    console.log(`   Program ID: ${PROGRAM_ID.toString()}`);
    console.log(`   Cluster Offset: ${CLUSTER_OFFSET}`);
    console.log(`   RPC URL: ${RPC_URL}`);
    
    // Get cluster account address
    const clusterAccount = getClusterAccAddress(CLUSTER_OFFSET);
    console.log(`   Cluster Account: ${clusterAccount.toString()}`);
    
    // Get MXE account address
    const mxeAccount = getMXEAccAddress(PROGRAM_ID);
    console.log(`   MXE Account: ${mxeAccount.toString()}`);
    
    console.log('\n2. Checking cluster account...');
    const clusterInfo = await connection.getAccountInfo(clusterAccount);
    if (clusterInfo) {
      console.log('   ✅ Cluster account exists');
    } else {
      console.log('   ❌ Cluster account does not exist');
      return;
    }
    
    console.log('\n3. Checking MXE account...');
    const mxeInfo = await connection.getAccountInfo(mxeAccount);
    if (mxeInfo) {
      console.log('   ✅ MXE account exists');
    } else {
      console.log('   ❌ MXE account does not exist - needs to be initialized');
      console.log('   💡 You may need to initialize the MXE account first');
    }
    
    console.log('\n4. Checking computation definitions...');
    
    const encryptedInstructions = [
      'encrypt_conversation',
      'decrypt_conversation', 
      'generate_decryption_key'
    ];
    
    for (const instructionName of encryptedInstructions) {
      try {
        const compDefOffset = getCompDefAccOffset(instructionName);
        const compDefAccount = getCompDefAccAddress(PROGRAM_ID, compDefOffset);
        
        console.log(`   ${instructionName}:`);
        console.log(`     Offset: ${compDefOffset}`);
        console.log(`     Account: ${compDefAccount.toString()}`);
        
        const compDefInfo = await connection.getAccountInfo(compDefAccount);
        if (compDefInfo) {
          console.log(`     ✅ Computation definition exists`);
        } else {
          console.log(`     ❌ Computation definition missing - needs initialization`);
        }
      } catch (error) {
        console.log(`     ❌ Error checking ${instructionName}: ${error.message}`);
      }
    }
    
    console.log('\n5. Next steps:');
    console.log('   📝 To initialize computation definitions, you need to:');
    console.log('   1. Use the Arcium TypeScript client library');
    console.log('   2. Call the initialization functions for each computation definition');
    console.log('   3. Ensure proper cluster configuration');
    
    console.log('\n6. Example initialization code:');
    console.log('   ```typescript');
    console.log('   // Initialize encrypt conversation computation definition');
    console.log('   await program.methods.initEncryptConversationCompDef()');
    console.log('     .accounts({');
    console.log('       payer: wallet.publicKey,');
    console.log('       mxeAccount: mxeAccount,');
    console.log('       compDefAccount: compDefAccount,');
    console.log('       arciumProgram: arciumProgram,');
    console.log('       systemProgram: SystemProgram.programId,');
    console.log('     })');
    console.log('     .rpc();');
    console.log('   ```');
    
    console.log('\n✅ Computation definitions analysis completed!');
    console.log(`🎯 Use cluster offset: ${CLUSTER_OFFSET}`);
    console.log(`📍 Cluster account: ${clusterAccount.toString()}`);
    console.log(`📍 MXE account: ${mxeAccount.toString()}`);
    
  } catch (error) {
    console.error('❌ Initialization analysis failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check if the cluster offset is valid for devnet');
    console.log('   - Ensure the program is properly deployed');
    console.log('   - Verify account constraints in your program');
  }
}

// Run the initialization analysis
initializeComputationDefinitions();
