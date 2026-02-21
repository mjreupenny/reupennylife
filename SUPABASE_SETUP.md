# Supabase Setup Guide

This guide walks you through setting up Supabase for the Reupenny Life Agency app.

## Prerequisites

- [Supabase account](https://supabase.com) (free tier works)
- Supabase CLI installed: `npm install -g supabase`

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Fill in:
   - **Name**: `reupennylife` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to your users
4. Wait for project to finish provisioning (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase dashboard, go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon public` key)

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and update the Supabase variables:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   ```

### 4. Run Database Migrations

You have two options:

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to your project dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run**

#### Option B: Using Supabase CLI (Recommended for local dev)

1. Link your project:
   ```bash
   npx supabase link --project-ref your-project-id
   ```
   
2. Push migrations:
   ```bash
   npx supabase db push
   ```

### 5. Verify Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see 4 tables:
   - `users` (with 2 admin accounts seeded)
   - `agents` (with 6 sample agents)
   - `sales`
   - `activity`

3. Check the **users** table - you should see the two admin accounts:
   - sfg.miller.reupenny@gmail.com
   - sfg.seta.reupenny@gmail.com

### 6. Test the Connection

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Check the browser console - you should NOT see the Supabase warning about missing env vars
4. Try logging in with Google OAuth (make sure `VITE_GOOGLE_CLIENT_ID` is also set)

## Local Development (Optional)

To run Supabase locally with Docker:

```bash
# Start local Supabase
npx supabase start

# This will output local connection details
# Update your .env with these local URLs for development

# Stop local Supabase
npx supabase stop
```

## Database Schema Overview

- **users**: OAuth users with approval workflow (pending → approved)
- **agents**: Agent roster managed by admins
- **sales**: Sales records linked to agents
- **activity**: Daily activity tracking per agent

## Row Level Security (RLS)

Currently, RLS policies allow all operations via the anon key. The app handles authorization in the application layer via the Google OAuth approval gate.

**Future enhancement**: Migrate to Supabase Auth for tighter security policies.

## Troubleshooting

### "Missing VITE_SUPABASE_URL" warning
- Make sure `.env` file exists and has the correct variables
- Restart your dev server after creating/updating `.env`

### Migration errors
- Verify you're using PostgreSQL 15+ (Supabase default)
- Check for syntax errors in the SQL file
- Ensure no previous migration ran partially

### Connection refused
- Check your Supabase project is not paused (free tier pauses after inactivity)
- Verify the URL and anon key are correct
- Check your network/firewall settings

## Next Steps

1. Configure Google OAuth (see `.env.example`)
2. Update admin emails in `src/lib/supabase.ts` if needed
3. Customize the database schema in `supabase/migrations/` as your app evolves
4. Consider setting up Supabase Auth for production

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
