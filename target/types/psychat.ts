/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/psychat.json`.
 */
export type Psychat = {
  "address": "DK9t6EFKWMZr1FwQxuuXwRe2GJ75MuqQ7qdeqKYiqCA6",
  "metadata": {
    "name": "psychat",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "PsyChat - Solana-native mental health platform"
  },
  "instructions": [
    {
      "name": "appendHistory",
      "docs": [
        "Append Walrus URI and trait to existing HNFT record (mock confidential)"
      ],
      "discriminator": [
        23,
        178,
        163,
        49,
        68,
        161,
        163,
        233
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "hnft",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "traitId",
          "type": "string"
        },
        {
          "name": "traitData",
          "type": "string"
        }
      ]
    },
    {
      "name": "autoCompound",
      "docs": [
        "Auto-compound earnings into DeFi yields",
        "Integrates with Raydium yield farming and Reflect $rUSD"
      ],
      "discriminator": [
        190,
        236,
        229,
        204,
        126,
        66,
        94,
        179
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "compound",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  111,
                  117,
                  110,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "yieldPool",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "claimUbi",
      "docs": [
        "Claim UBI in $rUSD via Reflect (mocked)"
      ],
      "discriminator": [
        64,
        169,
        95,
        14,
        86,
        53,
        145,
        231
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "zkpProof",
          "type": "string"
        },
        {
          "name": "category",
          "type": "string"
        }
      ]
    },
    {
      "name": "listData",
      "docs": [
        "List anonymized data on Raydium-powered marketplace",
        "Creates liquidity pool for data trading"
      ],
      "discriminator": [
        223,
        24,
        83,
        147,
        168,
        177,
        116,
        86
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "hnft",
          "writable": true
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "hnft"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "u8"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "mintDatasetNft",
      "docs": [
        "Mint a dataset NFT linked to the user's HNFT; stores dataset URI and category",
        "This creates a tradeable asset separate from the soulbound HNFT"
      ],
      "discriminator": [
        14,
        198,
        66,
        68,
        138,
        247,
        91,
        157
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "hnft",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "dataset",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  116,
                  97,
                  115,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "hnft"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "datasetUri",
          "type": "string"
        },
        {
          "name": "category",
          "type": "string"
        }
      ]
    },
    {
      "name": "mintHnft",
      "docs": [
        "Mint a soulbound HNFT (Health NFT) for encrypted therapy data",
        "Integrates with Arcium ZK proofs for privacy-preserving encryption",
        "Only ONE HNFT per user allowed (soulbound identity)"
      ],
      "discriminator": [
        37,
        104,
        143,
        128,
        57,
        189,
        62,
        137
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "hnft",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "encryptedData",
          "type": "string"
        },
        {
          "name": "zkProof",
          "type": "string"
        },
        {
          "name": "category",
          "type": "u8"
        }
      ]
    },
    {
      "name": "placeBid",
      "docs": [
        "Place bid on data listing using Reflect $rUSD",
        "Integrates with Raydium AMM for fair pricing"
      ],
      "discriminator": [
        238,
        77,
        148,
        91,
        200,
        151,
        92,
        146
      ],
      "accounts": [
        {
          "name": "bidder",
          "writable": true,
          "signer": true
        },
        {
          "name": "listing",
          "writable": true
        },
        {
          "name": "bid",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "listing"
              },
              {
                "kind": "account",
                "path": "bidder"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bidAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stakeUbi",
      "docs": [
        "Stake UBI yields via Raydium (mocked)"
      ],
      "discriminator": [
        120,
        129,
        225,
        119,
        178,
        130,
        133,
        207
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "autoCompoundRecord",
      "discriminator": [
        219,
        204,
        79,
        227,
        199,
        218,
        217,
        128
      ]
    },
    {
      "name": "bid",
      "discriminator": [
        143,
        246,
        48,
        245,
        42,
        145,
        180,
        88
      ]
    },
    {
      "name": "dataListing",
      "discriminator": [
        75,
        232,
        231,
        86,
        134,
        68,
        100,
        8
      ]
    },
    {
      "name": "dataset",
      "discriminator": [
        242,
        85,
        87,
        90,
        234,
        188,
        241,
        17
      ]
    },
    {
      "name": "hnft",
      "discriminator": [
        170,
        138,
        17,
        104,
        131,
        230,
        224,
        8
      ]
    }
  ],
  "events": [
    {
      "name": "autoCompounded",
      "discriminator": [
        206,
        143,
        131,
        74,
        130,
        68,
        120,
        149
      ]
    },
    {
      "name": "bidPlaced",
      "discriminator": [
        135,
        53,
        176,
        83,
        193,
        69,
        108,
        61
      ]
    },
    {
      "name": "dataListed",
      "discriminator": [
        146,
        98,
        239,
        186,
        115,
        104,
        238,
        100
      ]
    },
    {
      "name": "datasetNftMinted",
      "discriminator": [
        71,
        53,
        196,
        57,
        238,
        23,
        86,
        38
      ]
    },
    {
      "name": "hnftMinted",
      "discriminator": [
        62,
        183,
        95,
        121,
        216,
        227,
        245,
        226
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidZkProof",
      "msg": "Invalid ZK proof"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6002,
      "name": "alreadyListed",
      "msg": "HNFT already listed"
    },
    {
      "code": 6003,
      "name": "listingInactive",
      "msg": "Listing is inactive"
    },
    {
      "code": 6004,
      "name": "bidTooLow",
      "msg": "Bid amount too low"
    },
    {
      "code": 6005,
      "name": "hnftAlreadyExists",
      "msg": "HNFT already exists for this user"
    }
  ],
  "types": [
    {
      "name": "autoCompoundRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "yieldPool",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "autoCompounded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "yieldPool",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "bid",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "listing",
            "type": "pubkey"
          },
          {
            "name": "bidder",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "bidPlaced",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "listing",
            "type": "pubkey"
          },
          {
            "name": "bidder",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "dataListed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "listing",
            "type": "pubkey"
          },
          {
            "name": "hnft",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "dataListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hnft",
            "type": "pubkey"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": "u8"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "bidCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "dataset",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "hnft",
            "type": "pubkey"
          },
          {
            "name": "datasetUri",
            "type": "string"
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "isTradeable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "datasetNftMinted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "dataset",
            "type": "pubkey"
          },
          {
            "name": "hnft",
            "type": "pubkey"
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "hnft",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "encryptedData",
            "type": "string"
          },
          {
            "name": "zkProof",
            "type": "string"
          },
          {
            "name": "category",
            "type": "u8"
          },
          {
            "name": "mintTimestamp",
            "type": "i64"
          },
          {
            "name": "isListed",
            "type": "bool"
          },
          {
            "name": "isSoulbound",
            "type": "bool"
          },
          {
            "name": "listingPrice",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "hnftMinted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "hnft",
            "type": "pubkey"
          },
          {
            "name": "category",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
