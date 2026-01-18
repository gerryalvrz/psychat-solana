# Supabase Setup for PsyChat Waitlist

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose your organization and project name
3. Select a database password (save this securely)
4. Choose your region (preferably close to your users)

## 2. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project dashboard under Settings > API.

## 3. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_create_waitlist_table.sql`
4. Click "Run" to create the waitlist table

## 4. Test the Waitlist

1. Start your development server: `npm run dev`
2. Navigate to the homepage
3. Scroll down to the "Join Beta Waitlist" section
4. Click the button to open the waitlist modal
5. Fill out the form and submit

## Database Schema

The waitlist table includes:
- `id`: Auto-incrementing primary key
- `name`: User's name (required)
- `email`: User's email (required, unique)
- `created_at`: Timestamp of when they joined
- `updated_at`: Timestamp of last update

## Security

- Row Level Security (RLS) is enabled
- Anyone can insert (join waitlist)
- Only authenticated users can view entries (for admin purposes)
- Email uniqueness is enforced

## Viewing Waitlist Entries

To view waitlist entries in Supabase:
1. Go to your project dashboard
2. Click on "Table Editor" in the sidebar
3. Select the "waitlist" table
4. You can view, edit, or export the data

## Alternative: Use Supabase CLI

If you want to use the local development setup (requires Docker):

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
npx supabase start

# Apply migrations
npx supabase db push

# View local dashboard
npx supabase dashboard
```