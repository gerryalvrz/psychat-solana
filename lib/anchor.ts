import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

// Load IDL dynamically based on environment variable
const loadIdl = async () => {
  const idlPath = process.env.NEXT_PUBLIC_PSYCHAT_IDL_PATH || '/idl/psychat.json';
  const response = await fetch(idlPath);
  return await response.json();
};

export async function getAnchorProgram(connection: Connection, wallet: any, programIdStr: string): Promise<Program> {
  try {
    const programId = new PublicKey(programIdStr);
    
    console.log('Creating Anchor program with program ID:', programId.toBase58());
    console.log('Connection endpoint:', connection.rpcEndpoint);
    
    // Create AnchorProvider with wallet
    const provider = new AnchorProvider(
      connection,
      wallet,
      {
        preflightCommitment: 'processed',
        commitment: 'processed',
      }
    );
    
    // Load the IDL dynamically
    const programIdl = await loadIdl() as Idl;
    
    // Create the Program instance
    const program = new Program(programIdl, provider);
    
    console.log('Anchor program created successfully');
    return program;
  } catch (error) {
    console.error('Failed to create Anchor program:', error);
    throw new Error('Program creation failed: ' + (error as Error).message);
  }
}