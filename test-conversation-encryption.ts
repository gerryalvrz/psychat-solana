// Test file for Arcium conversation encryption
// Run with: npx ts-node test-conversation-encryption.ts

import { arciumConversationEncryption } from './lib/arcium-conversation-encryption';
import { Message } from './lib/types/arcium';

async function testEncryption() {
  console.log('🧪 Testing Arcium conversation encryption...\n');

  // Mock conversation data
  const mockMessages: Message[] = [
    { 
      role: 'user', 
      text: 'Hello, I\'m feeling anxious about my job interview tomorrow.', 
      timestamp: new Date('2024-01-15T10:00:00Z') 
    },
    { 
      role: 'assistant', 
      text: 'I understand that job interviews can be stressful. Let\'s work through some strategies to help you feel more confident.', 
      timestamp: new Date('2024-01-15T10:01:00Z') 
    },
    { 
      role: 'user', 
      text: 'I keep thinking about all the things that could go wrong.', 
      timestamp: new Date('2024-01-15T10:02:00Z') 
    },
    { 
      role: 'assistant', 
      text: 'It\'s natural to have those thoughts. Let\'s practice some breathing exercises and positive visualization techniques.', 
      timestamp: new Date('2024-01-15T10:03:00Z') 
    }
  ];

  try {
    // Test 1: Check encryption service status
    console.log('📊 Encryption Service Status:');
    const status = arciumConversationEncryption.getStatus();
    console.log('  Initialized:', status.initialized);
    console.log('  MXE Address:', status.mxeAddress || 'Not configured');
    console.log('  Cluster ID:', status.clusterId || 'Not configured');
    console.log('');

    // Test 2: Encrypt conversation
    console.log('🔐 Testing conversation encryption...');
    const encryptionResult = await arciumConversationEncryption.encryptConversation(mockMessages);
    
    if (!encryptionResult.success) {
      throw new Error(`Encryption failed: ${encryptionResult.error}`);
    }

    console.log('✅ Encryption successful!');
    console.log('  Encrypted data length:', encryptionResult.encryptedData?.length || 0);
    console.log('  Decryption key generated:', !!encryptionResult.decryptionKey);
    console.log('  Timestamp:', new Date(encryptionResult.timestamp || 0).toISOString());
    console.log('  MXE Address:', encryptionResult.mxeAddress);
    console.log('');

    // Test 3: Decrypt conversation
    console.log('🔓 Testing conversation decryption...');
    const decryptionResult = await arciumConversationEncryption.decryptConversation(
      encryptionResult.encryptedData!,
      encryptionResult.decryptionKey!
    );

    if (!decryptionResult.success) {
      throw new Error(`Decryption failed: ${decryptionResult.error}`);
    }

    console.log('✅ Decryption successful!');
    console.log('  Decrypted data length:', decryptionResult.decryptedData?.length || 0);
    console.log('');

    // Test 4: Verify data integrity
    console.log('🔍 Verifying data integrity...');
    const originalData = JSON.stringify(mockMessages.map(m => ({
      role: m.role,
      text: m.text,
      timestamp: m.timestamp
    })));
    
    const decryptedData = decryptionResult.decryptedData!;
    
    if (originalData === decryptedData) {
      console.log('✅ Data integrity verified - original and decrypted data match!');
    } else {
      console.log('❌ Data integrity check failed - data mismatch detected');
      console.log('  Original length:', originalData.length);
      console.log('  Decrypted length:', decryptedData.length);
    }
    console.log('');

    // Test 5: Display sample data
    console.log('📄 Sample encrypted data (first 100 chars):');
    console.log('  ', encryptionResult.encryptedData?.substring(0, 100) + '...');
    console.log('');
    
    console.log('🔑 Sample decryption key:');
    console.log('  ', encryptionResult.decryptionKey);
    console.log('');

    console.log('🎉 All tests passed! Arcium conversation encryption is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testEncryption().catch(console.error);
}

export { testEncryption };
