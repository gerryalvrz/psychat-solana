const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function setupWaitlistTable() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables!');
      console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
      process.exit(1);
    }

    console.log('🔗 Connecting to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_create_waitlist_table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Read migration file successfully');

    // Execute the SQL using rpc (raw SQL execution)
    console.log('🏗️ Creating waitlist table...');
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    });

    if (error) {
      console.error('❌ Error executing migration:', error);

      // If rpc doesn't work, try direct table creation approach
      console.log('🔄 Trying alternative approach...');

      // Check if table already exists
      const { data: existingTable, error: checkError } = await supabase
        .from('waitlist')
        .select('id')
        .limit(1);

      if (!checkError) {
        console.log('✅ Waitlist table already exists!');
        return;
      }

      // Try to create table using individual statements
      console.log('📋 Creating table with individual statements...');

      // This approach won't work with anon key due to permissions
      console.log('⚠️ Anon key cannot create tables. Please run this SQL in your Supabase dashboard:');
      console.log('');
      console.log('='.repeat(80));
      console.log(sqlContent);
      console.log('='.repeat(80));
      console.log('');
      console.log('Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');

      return;
    }

    console.log('✅ Waitlist table created successfully!');
    console.log('🎉 Your waitlist is ready to accept signups!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);

    // Fallback: show the SQL they need to run
    console.log('');
    console.log('🔧 Please run this SQL in your Supabase dashboard SQL Editor:');
    console.log('');
    console.log('='.repeat(80));

    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_create_waitlist_table.sql');
    try {
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      console.log(sqlContent);
    } catch (readError) {
      console.log('Could not read migration file. Please check supabase/migrations/001_create_waitlist_table.sql');
    }

    console.log('='.repeat(80));
    console.log('');
    console.log('Dashboard URL: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
  }
}

// Run the setup
setupWaitlistTable();