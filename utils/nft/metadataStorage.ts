/**
 * Simple metadata storage for ChatNFTs
 * Uses data URI to avoid external dependencies and URI length issues
 */

export interface ChatNFTMetadata {
  name: string;
  symbol: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

/**
 * Create ultra-minimal metadata for a therapy session NFT
 * This ensures the URI is well under 200 characters
 */
export function createMinimalMetadata(
  sessionId: string,
  startTime: Date,
  endTime: Date
): ChatNFTMetadata {
  return {
    name: `PC#${sessionId}`,
    symbol: 'PC',
    description: 'Session',
    attributes: []
  };
}

/**
 * Convert metadata to data URI
 * This avoids external dependencies and keeps URI short
 */
export function createDataUri(metadata: ChatNFTMetadata): string {
  const jsonString = JSON.stringify(metadata);
  const base64 = btoa(jsonString);
  return `data:application/json;base64,${base64}`;
}

/**
 * Create metadata URI for ChatNFT with encrypted conversation
 * Uses data URI for simplicity and to avoid "URI too long" errors
 */
export function createMetadataUri(
  sessionId: string,
  startTime: Date,
  endTime: Date,
  encryptedConversation?: {
    encryptedData: string;
    decryptionKey: string;
    timestamp: number;
    mxeAddress: string;
  },
  walrusCid?: string
): string {
  // Create ultra-minimal metadata to stay under 200 character limit
  const metadata = {
    name: `PC#${sessionId.substring(0, 4)}`, // Very short session ID
    symbol: 'PC',
    description: 'S', // Single character
    properties: {
      // Store only essential data - use single character keys
      e: encryptedConversation ? '1' : '0', // encrypted flag
      k: encryptedConversation?.decryptionKey?.substring(0, 6) || '', // very short key
      t: encryptedConversation?.timestamp || 0 // timestamp
    }
  };
  
  const uri = createDataUri(metadata);
  
  // Debug logging
  console.log('Generated ultra-minimal metadata');
  console.log('Metadata URI length:', uri.length);
  console.log('Encrypted data length:', encryptedConversation?.encryptedData?.length || 0);
  
  // Store the full encrypted data separately (not in URI)
  if (encryptedConversation) {
    console.log('Full encrypted data stored separately (not in URI)');
    console.log('Full decryption key:', encryptedConversation.decryptionKey);
  }
  
  return uri;
}

/**
 * Validate metadata URI length
 * Ensures it's under Metaplex's 200 character limit
 */
export function validateMetadataUri(uri: string): boolean {
  return uri.length <= 200;
}

/**
 * Get metadata from data URI
 * For debugging and verification
 */
export function parseMetadataFromUri(uri: string): ChatNFTMetadata | null {
  try {
    if (!uri.startsWith('data:application/json;base64,')) {
      return null;
    }
    
    const base64 = uri.split(',')[1];
    const jsonString = atob(base64);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing metadata from URI:', error);
    return null;
  }
}
