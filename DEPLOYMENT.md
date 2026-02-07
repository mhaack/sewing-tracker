# Deployment Guide for Netlify

This guide describes how to deploy the Sewing Tracker app to Netlify.

## Prerequisites

1. **GitHub/GitLab Repository**: Your code should be in a Git repository
2. **Netlify Account**: Create a free account at [netlify.com](https://netlify.com)
3. **Supabase Project**: A configured Supabase project with the database

## Step 1: Netlify Configuration

The `netlify.toml` file is already prepared and contains:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing redirects

## Step 2: Deploy to Netlify

### Option A: Via Netlify UI (recommended)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Build settings will be automatically loaded from `netlify.toml`
6. Click "Deploy site"

### Option B: Via Netlify CLI

```bash
# Install the Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

## Step 3: Set Environment Variables

**Important**: You must add your Supabase credentials as environment variables in Netlify:

1. In Netlify, go to: **Site settings** → **Environment variables**
2. Add the following variables:

   - **Variable**: `VITE_SUPABASE_URL`  
     **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   
   - **Variable**: `VITE_SUPABASE_ANON_KEY`  
     **Value**: Your Supabase Anon/Public Key

3. Save the changes
4. Trigger a new deployment (Deploy → Trigger deploy)

## Step 4: Find Your Supabase Credentials

You can find your Supabase credentials in your Supabase dashboard:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → this is your `VITE_SUPABASE_URL`
   - **anon/public key** → this is your `VITE_SUPABASE_ANON_KEY`

## Step 5: Initialize Database

If not done yet, run the migration in Supabase:

1. Go to the **SQL Editor** in your Supabase dashboard
2. Copy and paste the content of `supabase/migrations/001_create_projects_table.sql`
3. Execute the SQL script to create the complete database schema
4. Optional: Execute `supabase/seed.sql` for sample data

**Note:** Only one migration file is needed - it creates the complete database schema with all fields.

## Done!

Your app should now be live! Netlify will give you a URL like:
- `https://your-app-name.netlify.app`

## Troubleshooting

### Build fails
- Check if all dependencies are listed in `package.json`
- Review the build logs in Netlify for error messages

### App shows errors after deployment
- Verify that environment variables are set correctly
- Open the browser console for detailed error messages
- Ensure that Supabase database migrations have been executed

### Further Help
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)

## Automatic Deployments

Netlify automatically deploys on every push to your main/master branch. You can adjust this in the Site Settings.

## Custom Domain (optional)

To use your own domain:

1. Go to **Domain settings** in Netlify
2. Click "Add custom domain"
3. Follow the instructions for DNS setup
