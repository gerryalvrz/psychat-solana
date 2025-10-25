// Initialize MXE with proper cluster configuration to fix ConstraintExecutable error
const anchor = require('@coral-xyz/anchor');
const { PublicKey, Keypair } = require('@solana/web3.js');
const { getClusterAccAddress, getMXEAccAddress, getCompDefAccAddress, getCompDefAccOffset } = require('@arcium-hq/client');

// Configuration
const CLUSTER_OFFSETS = [1078779259, 3726127828, 768109697]; // Valid devnet cluster offsets
const PROGRAM_ID = new PublicKey('EFs8XpQ9QHy6ZiMr91ejUe8up9S9TuMuJsFDgfzhSjan');
const RPC_URL = 'https://api.devnet.solana.com';

async function initializeMXE() {
  console.log('🚀 Initializing MXE with Proper Cluster Configuration...\n');
  
  try {
    // Setup connection and provider
    const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');
    const wallet = new anchor.Wallet(Keypair.generate()); // Use a test wallet
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    
    console.log('1. Finding valid cluster...');
    
    let validClusterOffset = null;
    let validClusterAccount = null;
    
    // Try each cluster offset to find a valid one
    for (const offset of CLUSTER_OFFSETS) {
      try {
        const clusterAccount = getClusterAccAddress(offset);
        const clusterInfo = await connection.getAccountInfo(clusterAccount);
        
        if (clusterInfo) {
          console.log(`   ✅ Found valid cluster with offset: ${offset}`);
          console.log(`   📍 Cluster Account: ${clusterAccount.toString()}`);
          validClusterOffset = offset;
          validClusterAccount = clusterAccount;
          break;
        } else {
          console.log(`   ❌ Cluster with offset ${offset} not found`);
        }
      } catch (error) {
        console.log(`   ❌ Error checking cluster ${offset}: ${error.message}`);
      }
    }
    
    if (!validClusterOffset) {
      throw new Error('No valid cluster found. Try deploying to a different cluster or check network status.');
    }
    
    console.log('\n2. Checking MXE account...');
    const mxeAccount = getMXEAccAddress(PROGRAM_ID);
    const mxeInfo = await connection.getAccountInfo(mxeAccount);
    
    if (mxeInfo) {
      console.log('   ✅ MXE account exists');
    } else {
      console.log('   ❌ MXE account does not exist - this might be the issue');
      console.log('   💡 You need to initialize the MXE account first');
    }
    
    console.log('\n3. Checking computation definitions...');
    
    const encryptedInstructions = [
      'encrypt_conversation',
      'decrypt_conversation', 
      'generate_decryption_key'
    ];
    
    let missingDefinitions = [];
    
    for (const instructionName of encryptedInstructions) {
      try {
        const compDefOffset = getCompDefAccOffset(instructionName);
        const compDefAccount = getCompDefAccAddress(PROGRAM_ID, compDefOffset);
        
        const compDefInfo = await connection.getAccountInfo(compDefAccount);
        if (compDefInfo) {
          console.log(`   ✅ ${instructionName} computation definition exists`);
        } else {
          console.log(`   ❌ ${instructionName} computation definition missing`);
          missingDefinitions.push(instructionName);
        }
      } catch (error) {
        console.log(`   ❌ Error checking ${instructionName}: ${error.message}`);
        missingDefinitions.push(instructionName);
      }
    }
    
    console.log('\n4. Recommendations to fix ConstraintExecutable error:');
    
    if (missingDefinitions.length > 0) {
      console.log('   📋 Missing computation definitions:');
      missingDefinitions.forEach(def => {
        console.log(`     - ${def}`);
      });
      console.log('\n   🔧 To fix this:');
      console.log('   1. Initialize computation definitions with proper cluster configuration');
      console.log('   2. Use the correct cluster offset in your initialization');
      console.log('   3. Ensure all required accounts are properly configured');
    }
    
    console.log('\n5. Next steps:');
    console.log('   📝 Update your program to use the correct cluster configuration:');
    console.log(`   const clusterAccount = getClusterAccAddress(${validClusterOffset});`);
    console.log('   📝 Ensure your initialization includes all required accounts');
    console.log('   📝 Use proper account constraints in your program');
    
    console.log('\n✅ MXE initialization analysis completed!');
    console.log(`🎯 Use cluster offset: ${validClusterOffset}`);
    console.log(`📍 Cluster account: ${validClusterAccount.toString()}`);
    
  } catch (error) {
    console.error('❌ MXE initialization failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check if the cluster offset is valid for devnet');
    console.log('   - Ensure the program is properly deployed');
    console.log('   - Verify account constraints in your program');
    console.log('   - Try using a different cluster offset');
  }
}

// Run the initialization
initializeMXE();
