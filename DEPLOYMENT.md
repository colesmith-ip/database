# Deployment Guide for Hello CRM

## Prerequisites
- GitHub repository: `colesmith-ip/database`
- Vercel account
- Supabase account

## Step 1: Set up Supabase Database

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `hello-crm`
   - Set a secure database password
   - Choose a region close to your users

2. **Get your database connection string:**
   - In your Supabase dashboard, go to Settings → Database
   - Copy the connection string (it looks like: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`)

## Step 2: Deploy to Vercel

1. **Connect your GitHub repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `colesmith-ip/database`
   - Select the repository

2. **Configure environment variables:**
   - In the Vercel project settings, go to Environment Variables
   - Add the following variables:
     ```
     DATABASE_URL = [your-supabase-connection-string]
     NEXTAUTH_SECRET = [generate-a-random-secret]
     NEXTAUTH_URL = [your-vercel-domain]
     ```

3. **Deploy:**
   - Vercel will automatically detect it's a Next.js project
   - Click "Deploy"
   - Wait for the build to complete

## Step 3: Set up the Database

1. **Run database migrations:**
   - In your Vercel project, go to Functions → View Function Logs
   - Look for any Prisma errors
   - If needed, you can run migrations manually via Vercel CLI

2. **Alternative: Use Prisma Studio locally:**
   - Temporarily update your local `.env` to use the Supabase connection string
   - Run: `npx prisma db push`
   - Run: `npx prisma db seed` (if you have seed data)

## Step 4: Verify Deployment

1. **Check your Vercel domain:**
   - Your app should be available at `https://[project-name].vercel.app`

2. **Test the application:**
   - Navigate to your deployed URL
   - Test creating a pipeline
   - Test adding people/organizations
   - Verify all features work

## Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Verify your `DATABASE_URL` is correct
   - Check that your Supabase project is active
   - Ensure the password in the connection string is correct

2. **Build Failures:**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation passes locally

3. **Environment Variables:**
   - Make sure all required env vars are set in Vercel
   - Check that `NEXTAUTH_URL` matches your Vercel domain

### Local Development vs Production:

- **Local:** Uses SQLite (`file:./dev.db`)
- **Production:** Uses Supabase PostgreSQL
- The Prisma schema automatically adapts to the database provider

## Environment Variables Reference

```env
# Required for Production
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional
NEXT_PUBLIC_ANALYTICS_ID=""
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify Supabase database is accessible
3. Test locally with production database URL
4. Check GitHub repository for latest changes
