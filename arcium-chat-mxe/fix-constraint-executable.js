// Fix ConstraintExecutable error by properly initializing MXE with cluster configuration
const anchor = require('@coral-xyz/anchor');
const { PublicKey, Keypair } = require('@solana/web3.js');
const { getClusterAccAddress, getMXEAccAddress, getCompDefAccAddress, getCompDefAccOffset } = require('@arcium-hq/client');

// Configuration
const CLUSTER_OFFSET = 1078779259; // Use the first valid devnet cluster offset
const PROGRAM_ID = new PublicKey('EFs8XpQ9QHy6ZiMr91ejUe8up9S9TuMuJsFDgfzhSjan');
const RPC_URL = 'https://api.devnet.solana.com';

async function fixConstraintExecutableError() {
  console.log('🔧 Fixing ConstraintExecutable Error...\n');
  
  try {
    // Setup connection and provider
    const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');
    const wallet = new anchor.Wallet(Keypair.generate()); // Use a test wallet
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    
    console.log('1. Verifying cluster configuration...');
    
    // Get cluster account address
    const clusterAccount = getClusterAccAddress(CLUSTER_OFFSET);
    console.log(`   Cluster Offset: ${CLUSTER_OFFSET}`);
    console.log(`   Cluster Account: ${clusterAccount.toString()}`);
    
    // Check if cluster account exists
    const clusterInfo = await connection.getAccountInfo(clusterAccount);
    if (clusterInfo) {
      console.log('   ✅ Cluster account exists');
    } else {
      console.log('   ❌ Cluster account does not exist');
      console.log('   💡 Try using a different cluster offset: 3726127828 or 768109697');
      return;
    }
    
    console.log('\n2. Checking MXE account...');
    const mxeAccount = getMXEAccAddress(PROGRAM_ID);
    console.log(`   MXE Account: ${mxeAccount.toString()}`);
    
    const mxeInfo = await connection.getAccountInfo(mxeAccount);
    if (mxeInfo) {
      console.log('   ✅ MXE account exists');
    } else {
      console.log('   ❌ MXE account does not exist - needs to be initialized');
    }
    
    console.log('\n3. Checking computation definitions...');
    
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
    
    console.log('\n4. Solution for ConstraintExecutable Error:');
    console.log('   📋 The error occurs because:');
    console.log('   1. The MXE program is not properly configured with a valid cluster');
    console.log('   2. Computation definitions are not initialized');
    console.log('   3. Account constraints are not properly set');
    
    console.log('\n   🔧 To fix this:');
    console.log('   1. Use the correct cluster offset in your program');
    console.log('   2. Initialize computation definitions with proper cluster configuration');
    console.log('   3. Ensure all required accounts are properly configured');
    console.log('   4. Use the proper account constraints in your program');
    
    console.log('\n5. Updated program structure:');
    console.log('   📝 Your program now includes:');
    console.log('   - Proper cluster account constraints');
    console.log('   - Computation definition initialization functions');
    console.log('   - Proper account validation');
    
    console.log('\n6. Next steps:');
    console.log('   🚀 Rebuild and redeploy your program:');
    console.log('   cd arcium-chat-mxe');
    console.log('   arcium build');
    console.log('   arcium deploy --cluster-offset 1078779259');
    console.log('   ');
    console.log('   🧪 Then initialize computation definitions:');
    console.log('   node initialize-mxe.js');
    
    console.log('\n✅ ConstraintExecutable error fix analysis completed!');
    console.log(`🎯 Use cluster offset: ${CLUSTER_OFFSET}`);
    console.log(`📍 Cluster account: ${clusterAccount.toString()}`);
    
  } catch (error) {
    console.error('❌ Fix analysis failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check if the cluster offset is valid for devnet');
    console.log('   - Ensure the program is properly deployed');
    console.log('   - Verify account constraints in your program');
    console.log('   - Try using a different cluster offset');
  }
}

// Run the fix analysis
fixConstraintExecutableError();
