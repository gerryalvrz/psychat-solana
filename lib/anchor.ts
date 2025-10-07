// Minimal dynamic Anchor loader to avoid hard dependency during local dev
// Returns an object compatible with program.methods.*.accounts().rpc() pattern or throws if unavailable

import type { Connection, PublicKey } from '@solana/web3.js';

export function getAnchorProgram(connection: Connection, wallet: any, programIdStr: string): any {
  try {
    // Defer require to runtime to avoid TS/module resolution errors if not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const anchor = require('@coral-xyz/anchor');
    const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
    const idlPath = (process.env.NEXT_PUBLIC_PSYCHAT_IDL_PATH as string) || '/target/idl/psychat.json';
    return {
      methods: new Proxy(
        {},
        {
          get: (_t, methodName: string) => {
            return (...args: any[]) => {
              return {
                accounts: (_accounts: Record<string, any>) => {
                  return {
                    async rpc() {
                      // Load IDL on-demand
                      return await (async () => {
                        let idl: any;
                        try {
                          // Try to require local idl when running in node
                          // eslint-disable-next-line @typescript-eslint/no-var-requires
                          idl = require(`.${idlPath}`);
                        } catch {
                          // Fallback: attempt fetch in browser
                          const res = await fetch(idlPath);
                          idl = await res.json();
                        }
                        const programId = new (require('@solana/web3.js').PublicKey)(programIdStr);
                        const program = new anchor.Program(idl, programId, provider);
                        // Invoke the actual anchor method
                        return await (program as any).methods[methodName](...args).accounts(_accounts).rpc();
                      })();
                    },
                  };
                },
              };
            };
          },
        }
      ),
    };
  } catch (e) {
    throw new Error('Anchor SDK unavailable');
  }
}


