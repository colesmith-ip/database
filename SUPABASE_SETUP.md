# Supabase Auth Setup Guide

## Current Issue
Your Supabase project is currently only being used as a database provider. The authentication system is not properly configured, which is why invite emails show `http://localhost:3000`.

## Setup Steps

### 1. Get Your Supabase Project URL and Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 2. Update Your Environment Variables

Add these to your `.env` file:

```bash
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Update Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the same three variables above

### 4. Configure Supabase Auth Settings

1. In your Supabase Dashboard, go to **Authentication** → **Settings**
2. Update **Site URL** to your Vercel URL:
   ```
   https://database-nm1fat61y-cole-smiths-projects-9b883fc1.vercel.app
   ```
3. Add your localhost URL for development:
   ```
   http://localhost:3000
   ```

### 5. Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Update the **Confirm signup** template
3. Make sure the **Action URL** points to your Vercel domain
4. Update the **Invite user** template similarly

### 6. Test the Setup

After updating the environment variables, your invite emails should now point to your Vercel URL instead of localhost.

## Alternative: Use Supabase Auth UI

If you want to add a complete authentication system, you can also install:

```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

This will give you pre-built login/signup components.

## Current Status

✅ **Database**: Connected via Prisma  
❌ **Auth**: Not configured (needs environment variables)  
❌ **Email Templates**: Pointing to localhost (needs Supabase dashboard update)
