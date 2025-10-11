/**
 * Utility to clean up old transaction data from localStorage
 * This helps prevent conflicts from previous failed attempts
 */
export function cleanupOldTransactions() {
  const keysToRemove: string[] = [];
  
  // Find all transaction-related keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('tx_') || key.startsWith('mint_'))) {
      keysToRemove.push(key);
    }
  }
  
  // Remove old transaction data
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`Cleaned up ${keysToRemove.length} old transaction records`);
}

/**
 * Clean up transactions older than 1 hour
 */
export function cleanupOldTransactionsByAge() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('tx_') || key.startsWith('mint_'))) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.timestamp && data.timestamp < oneHourAgo) {
          keysToRemove.push(key);
        }
      } catch (e) {
        // If we can't parse it, remove it
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  if (keysToRemove.length > 0) {
    console.log(`Cleaned up ${keysToRemove.length} old transaction records`);
  }
}
