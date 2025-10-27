use arcium_client::prelude::*;
use arcium_macros::*;

declare_id!("EFs8XpQ9QHy6ZiMr91ejUe8up9S9TuMuJsFDgfzhSjan");

#[arcium_program]
pub mod arcium_chat_mxe {
    use super::*;

    /// Initialize encrypt conversation computation definition
    pub fn init_encrypt_conversation_comp_def(ctx: Context<InitEncryptConversationCompDef>) -> Result<()> {
        init_comp_def(ctx.accounts, true, 0, None, None)?;
        Ok(())
    }

    /// Initialize decrypt conversation computation definition
    pub fn init_decrypt_conversation_comp_def(ctx: Context<InitDecryptConversationCompDef>) -> Result<()> {
        init_comp_def(ctx.accounts, true, 0, None, None)?;
        Ok(())
    }

    /// Initialize generate decryption key computation definition
    pub fn init_generate_decryption_key_comp_def(ctx: Context<InitGenerateDecryptionKeyCompDef>) -> Result<()> {
        init_comp_def(ctx.accounts, true, 0, None, None)?;
        Ok(())
    }
}


#[init_computation_definition_accounts("encrypt_conversation", payer)]
#[derive(Accounts)]
pub struct InitEncryptConversationCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        address = derive_mxe_pda!()
    )]
    pub mxe_account: Box<Account<'info, MXEAccount>>,
    #[account(mut)]
    pub comp_def_account: UncheckedAccount<'info>,
    pub arcium_program: Program<'info, Arcium>,
    pub system_program: Program<'info, System>,
}

#[init_computation_definition_accounts("decrypt_conversation", payer)]
#[derive(Accounts)]
pub struct InitDecryptConversationCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        address = derive_mxe_pda!()
    )]
    pub mxe_account: Box<Account<'info, MXEAccount>>,
    #[account(mut)]
    pub comp_def_account: UncheckedAccount<'info>,
    pub arcium_program: Program<'info, Arcium>,
    pub system_program: Program<'info, System>,
}

#[init_computation_definition_accounts("generate_decryption_key", payer)]
#[derive(Accounts)]
pub struct InitGenerateDecryptionKeyCompDef<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        address = derive_mxe_pda!()
    )]
    pub mxe_account: Box<Account<'info, MXEAccount>>,
    #[account(mut)]
    pub comp_def_account: UncheckedAccount<'info>,
    pub arcium_program: Program<'info, Arcium>,
    pub system_program: Program<'info, System>,
}
