// Test script for MXE initialization with proper cluster configuration
const anchor = require('@coral-xyz/anchor');
const { PublicKey, Keypair } = require('@solana/web3.js');
const { getClusterAccAddress, getMXEAccAddress, getCompDefAccAddress, getCompDefAccOffset } = require('@arcium-hq/client');

// Configuration
const CLUSTER_OFFSET = 1078779259; // Valid devnet cluster offset
const PROGRAM_ID = new PublicKey('EFs8XpQ9QHy6ZiMr91ejUe8up9S9TuMuJsFDgfzhSjan');
const RPC_URL = 'https://api.devnet.solana.com';

async function testMXEInitialization() {
  console.log('🧪 Testing MXE Initialization with Proper Cluster Configuration...\n');
  
  try {
    // Setup connection and provider
    const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');
    const wallet = new anchor.Wallet(Keypair.generate()); // Use a test wallet
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    
    // Load the program IDL (you'll need to generate this)
    console.log('1. Setting up connection to devnet...');
    console.log(`   Program ID: ${PROGRAM_ID.toString()}`);
    console.log(`   Cluster Offset: ${CLUSTER_OFFSET}`);
    console.log(`   RPC URL: ${RPC_URL}`);
    
    // Get cluster account address
    const clusterAccount = getClusterAccAddress(CLUSTER_OFFSET);
    console.log(`   Cluster Account: ${clusterAccount.toString()}`);
    
    // Get MXE account address
    const mxeAccount = getMXEAccAddress(PROGRAM_ID);
    console.log(`   MXE Account: ${mxeAccount.toString()}`);
    
    // Check if cluster account exists
    console.log('\n2. Checking cluster account...');
    const clusterAccountInfo = await connection.getAccountInfo(clusterAccount);
    if (clusterAccountInfo) {
      console.log('   ✅ Cluster account exists');
    } else {
      console.log('   ❌ Cluster account does not exist - this might be the issue');
      console.log('   💡 Try using a different cluster offset: 3726127828 or 768109697');
    }
    
    // Check if MXE account exists
    console.log('\n3. Checking MXE account...');
    const mxeAccountInfo = await connection.getAccountInfo(mxeAccount);
    if (mxeAccountInfo) {
      console.log('   ✅ MXE account exists');
    } else {
      console.log('   ❌ MXE account does not exist - needs to be initialized');
    }
    
    // Try to initialize computation definitions
    console.log('\n4. Attempting to initialize computation definitions...');
    
    // For each encrypted instruction, try to initialize
    const encryptedInstructions = [
      'encrypt_conversation',
      'decrypt_conversation', 
      'generate_decryption_key'
    ];
    
    for (const instructionName of encryptedInstructions) {
      try {
        const compDefOffset = getCompDefAccOffset(instructionName);
        const compDefAccount = getCompDefAccAddress(PROGRAM_ID, compDefOffset);
        
        console.log(`   Checking ${instructionName}:`);
        console.log(`     Offset: ${compDefOffset}`);
        console.log(`     Account: ${compDefAccount.toString()}`);
        
        const compDefInfo = await connection.getAccountInfo(compDefAccount);
        if (compDefInfo) {
          console.log(`     ✅ ${instructionName} computation definition exists`);
        } else {
          console.log(`     ❌ ${instructionName} computation definition missing`);
        }
      } catch (error) {
        console.log(`     ❌ Error checking ${instructionName}: ${error.message}`);
      }
    }
    
    console.log('\n5. Recommendations:');
    console.log('   📋 To fix the ConstraintExecutable error:');
    console.log('   1. Ensure you\'re using a valid cluster offset (1078779259, 3726127828, or 768109697)');
    console.log('   2. Initialize computation definitions with proper cluster configuration');
    console.log('   3. Make sure the cluster account exists on devnet');
    console.log('   4. Use the correct program structure with proper account constraints');
    
    console.log('\n✅ MXE initialization test completed!');
    
  } catch (error) {
    console.error('❌ MXE initialization test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check if the cluster offset is valid for devnet');
    console.log('   - Ensure the program is properly deployed');
    console.log('   - Verify account constraints in your program');
  }
}

// Run the test
testMXEInitialization();
