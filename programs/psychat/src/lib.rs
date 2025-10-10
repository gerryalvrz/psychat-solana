use anchor_lang::prelude::*;
// use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("DK9t6EFKWMZr1FwQxuuXwRe2GJ75MuqQ7qdeqKYiqCA6");

#[program]
pub mod psychat {
    use super::*;

    /// Mint a soulbound HNFT (Health NFT) for encrypted therapy data
    /// Integrates with Arcium ZK proofs for privacy-preserving encryption
    /// Only ONE HNFT per user allowed (soulbound identity)
    pub fn mint_hnft(
        ctx: Context<MintHNFT>,
        encrypted_data: String,
        zk_proof: String,
        category: u8,
    ) -> Result<()> {
        let hnft = &mut ctx.accounts.hnft;
        let user = &ctx.accounts.user;
        
        // Verify ZK proof (Arcium integration - simplified for hackathon)
        require!(
            verify_zk_proof(&zk_proof, &encrypted_data),
            ErrorCode::InvalidZKProof
        );
        
        // Initialize soulbound HNFT (only one per user)
        hnft.owner = user.key();
        hnft.encrypted_data = encrypted_data;
        hnft.zk_proof = zk_proof;
        hnft.category = category;
        hnft.mint_timestamp = Clock::get()?.unix_timestamp;
        hnft.is_listed = false;
        hnft.is_soulbound = true; // Non-transferable, soulbound to user
        
        emit!(HNFTMinted {
            owner: user.key(),
            hnft: hnft.key(),
            category,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// List anonymized data on Raydium-powered marketplace
    /// Creates liquidity pool for data trading
    pub fn list_data(
        ctx: Context<ListData>,
        price: u64,
        currency: u8, // 0 = SOL, 1 = rUSD
        description: String,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        let hnft = &mut ctx.accounts.hnft;
        
        require!(
            hnft.owner == ctx.accounts.user.key(),
            ErrorCode::Unauthorized
        );
        
        require!(
            !hnft.is_listed,
            ErrorCode::AlreadyListed
        );
        
        // Create marketplace listing
        listing.hnft = hnft.key();
        listing.seller = ctx.accounts.user.key();
        listing.price = price;
        listing.currency = currency;
        listing.description = description;
        listing.created_at = Clock::get()?.unix_timestamp;
        listing.is_active = true;
        listing.bid_count = 0;
        
        // Mark HNFT as listed
        hnft.is_listed = true;
        hnft.listing_price = price;
        
        // Initialize Raydium AMM pool for this listing
        // This would integrate with Raydium SDK for liquidity provision
        
        emit!(DataListed {
            listing: listing.key(),
            hnft: hnft.key(),
            price,
            currency,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Place bid on data listing using Reflect $rUSD
    /// Integrates with Raydium AMM for fair pricing
    pub fn place_bid(
        ctx: Context<PlaceBid>,
        bid_amount: u64,
    ) -> Result<()> {
        let bid = &mut ctx.accounts.bid;
        let listing = &mut ctx.accounts.listing;
        
        require!(
            listing.is_active,
            ErrorCode::ListingInactive
        );
        
        require!(
            bid_amount >= listing.price,
            ErrorCode::BidTooLow
        );
        
        // Create bid record
        bid.listing = listing.key();
        bid.bidder = ctx.accounts.bidder.key();
        bid.amount = bid_amount;
        bid.timestamp = Clock::get()?.unix_timestamp;
        bid.is_active = true;
        
        // Update listing bid count
        listing.bid_count += 1;
        
        // Transfer bid amount to escrow (Reflect $rUSD integration)
        // This would integrate with Reflect SDK for $rUSD payments
        
        emit!(BidPlaced {
            listing: listing.key(),
            bidder: ctx.accounts.bidder.key(),
            amount: bid_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Auto-compound earnings into DeFi yields
    /// Integrates with Raydium yield farming and Reflect $rUSD
    pub fn auto_compound(
        ctx: Context<AutoCompound>,
        amount: u64,
        yield_pool: Pubkey,
    ) -> Result<()> {
        let compound = &mut ctx.accounts.compound;
        
        // Record auto-compound action
        compound.user = ctx.accounts.user.key();
        compound.amount = amount;
        compound.yield_pool = yield_pool;
        compound.timestamp = Clock::get()?.unix_timestamp;
        
        // This would integrate with:
        // 1. Raydium yield farming protocols
        // 2. Reflect $rUSD for stablecoin payments
        // 3. Forward Industries treasury for MotusDAO integration
        
        emit!(AutoCompounded {
            user: ctx.accounts.user.key(),
            amount,
            yield_pool,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }


    /// Append Walrus URI and trait to existing HNFT record (mock confidential)
    pub fn append_history(
        ctx: Context<AppendHistory>,
        uri: String,
        trait_id: String,
        _trait_data: String,
    ) -> Result<()> {
        let hnft = &mut ctx.accounts.hnft;
        require!(hnft.owner == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        // Overwrite encrypted_data with URI pointer for demo; real impl would have separate field
        hnft.encrypted_data = uri;
        hnft.zk_proof = trait_id;
        hnft.category = 0; // not used here, keep shape compatible
        emit!(HNFTMinted {
            owner: ctx.accounts.user.key(),
            hnft: hnft.key(),
            category: hnft.category,
            timestamp: Clock::get()?.unix_timestamp,
        });
        Ok(())
    }

    /// Claim UBI in $rUSD via Reflect (mocked)
    pub fn claim_ubi(_ctx: Context<ClaimUbi>, _zkp_proof: String, _category: String) -> Result<()> {
        // Here we would CPI into Reflect to mint/transfer rUSD and take DAO fee
        // For demo, just succeed
        Ok(())
    }

    /// Stake UBI yields via Raydium (mocked)
    pub fn stake_ubi(_ctx: Context<StakeUbi>) -> Result<()> {
        Ok(())
    }

    /// Mint a dataset NFT linked to the user's HNFT; stores dataset URI and category
    /// This creates a tradeable asset separate from the soulbound HNFT
    pub fn mint_dataset_nft(
        ctx: Context<MintDatasetNft>,
        dataset_uri: String,
        category: String,
    ) -> Result<()> {
        let dataset = &mut ctx.accounts.dataset;
        let user = &ctx.accounts.user;
        let hnft = &ctx.accounts.hnft;
        
        // Verify user owns the HNFT
        require!(
            hnft.owner == user.key(),
            ErrorCode::Unauthorized
        );
        
        // Initialize tradeable dataset NFT
        dataset.owner = user.key();
        dataset.hnft = hnft.key();
        dataset.dataset_uri = dataset_uri;
        dataset.category = category.clone();
        dataset.created_at = Clock::get()?.unix_timestamp;
        dataset.is_tradeable = true; // This can be sold/transferred
        
        emit!(DatasetNFTMinted {
            owner: user.key(),
            dataset: dataset.key(),
            hnft: hnft.key(),
            category: category.clone(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

/// Helper function to verify Arcium ZK proofs
fn verify_zk_proof(proof: &str, data: &str) -> bool {
    // Mock ZK proof verification
    // In production, this would integrate with Arcium SDK
    proof.len() > 0 && data.len() > 0
}

#[derive(Accounts)]
pub struct MintHNFT<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 256 + 256 + 1 + 8 + 1 + 1 + 8, // 571 bytes total
        seeds = [b"hnft", user.key().as_ref()],
        bump
    )]
    pub hnft: Account<'info, HNFT>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListData<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        constraint = hnft.owner == user.key()
    )]
    pub hnft: Account<'info, HNFT>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 1 + 256 + 8 + 1 + 8,
        seeds = [b"listing", hnft.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, DataListing>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    
    #[account(
        mut,
        constraint = listing.is_active
    )]
    pub listing: Account<'info, DataListing>,
    
    #[account(
        init,
        payer = bidder,
        space = 8 + 32 + 32 + 8 + 8 + 1,
        seeds = [b"bid", listing.key().as_ref(), bidder.key().as_ref()],
        bump
    )]
    pub bid: Account<'info, Bid>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AutoCompound<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 32 + 8,
        seeds = [b"compound", user.key().as_ref()],
        bump
    )]
    pub compound: Account<'info, AutoCompoundRecord>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AppendHistory<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"hnft", user.key().as_ref()], bump)]
    pub hnft: Account<'info, HNFT>,
}

#[derive(Accounts)]
pub struct ClaimUbi<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct StakeUbi<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct MintDatasetNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"hnft", user.key().as_ref()], bump)]
    pub hnft: Account<'info, HNFT>,
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 256 + 64 + 8 + 1, // Added 1 byte for is_tradeable
        seeds = [b"dataset", hnft.key().as_ref()],
        bump
    )]
    pub dataset: Account<'info, Dataset>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct HNFT {
    pub owner: Pubkey,
    pub encrypted_data: String, // Arcium ZK encrypted
    pub zk_proof: String,       // Arcium ZK proof
    pub category: u8,           // 0=anxiety, 1=depression, 2=stress, etc.
    pub mint_timestamp: i64,
    pub is_listed: bool,
    pub is_soulbound: bool,     // Non-transferable
    pub listing_price: u64,
}

#[account]
pub struct DataListing {
    pub hnft: Pubkey,
    pub seller: Pubkey,
    pub price: u64,
    pub currency: u8,            // 0=SOL, 1=rUSD
    pub description: String,
    pub created_at: i64,
    pub is_active: bool,
    pub bid_count: u64,
}

#[account]
pub struct Bid {
    pub listing: Pubkey,
    pub bidder: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub is_active: bool,
}

#[account]
pub struct AutoCompoundRecord {
    pub user: Pubkey,
    pub amount: u64,
    pub yield_pool: Pubkey,
    pub timestamp: i64,
}

#[account]
pub struct Dataset {
    pub owner: Pubkey,
    pub hnft: Pubkey,
    pub dataset_uri: String,
    pub category: String,
    pub created_at: i64,
    pub is_tradeable: bool,
}

#[event]
pub struct HNFTMinted {
    pub owner: Pubkey,
    pub hnft: Pubkey,
    pub category: u8,
    pub timestamp: i64,
}

#[event]
pub struct DataListed {
    pub listing: Pubkey,
    pub hnft: Pubkey,
    pub price: u64,
    pub currency: u8,
    pub timestamp: i64,
}

#[event]
pub struct BidPlaced {
    pub listing: Pubkey,
    pub bidder: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct AutoCompounded {
    pub user: Pubkey,
    pub amount: u64,
    pub yield_pool: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct DatasetNFTMinted {
    pub owner: Pubkey,
    pub dataset: Pubkey,
    pub hnft: Pubkey,
    pub category: String,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid ZK proof")]
    InvalidZKProof,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("HNFT already listed")]
    AlreadyListed,
    #[msg("Listing is inactive")]
    ListingInactive,
    #[msg("Bid amount too low")]
    BidTooLow,
    #[msg("HNFT already exists for this user")]
    HNFTAlreadyExists,
}

