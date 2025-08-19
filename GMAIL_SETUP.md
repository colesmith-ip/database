# Gmail API Integration Setup Guide

This guide will help you set up Gmail API integration for your CRM to send email campaigns.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for Gmail API)

## Step 2: Enable Gmail API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click on "Gmail API" and click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Set the following:
   - **Name**: "CRM Gmail Integration" (or any name you prefer)
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for local development)
     - `https://your-domain.vercel.app` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/gmail/callback` (for local development)
     - `https://your-domain.vercel.app/api/auth/gmail/callback` (for production)
5. Click "Create"
6. Note down your **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

Add the following environment variables to your `.env` file and Vercel:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="https://your-domain.vercel.app/api/auth/gmail/callback"
```

## Step 5: Test the Integration

1. Deploy your application to Vercel
2. Go to the Marketing section in your CRM
3. Navigate to "Integrations" > "Gmail"
4. Click "Connect Gmail"
5. You'll be redirected to Google to authorize the application
6. After authorization, you'll be redirected back to your CRM

## Required Gmail API Scopes

The integration requests the following permissions:
- `https://www.googleapis.com/auth/gmail.send` - Send emails on your behalf
- `https://www.googleapis.com/auth/gmail.readonly` - Read email metadata for tracking
- `https://www.googleapis.com/auth/userinfo.email` - Get your email address
- `https://www.googleapis.com/auth/userinfo.profile` - Get your profile information

## Security Notes

- The integration only requests the minimum permissions needed
- Access tokens are stored securely in your database
- Refresh tokens are used to maintain long-term access
- You can revoke access at any time from your Google account settings

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in your Google Cloud Console matches exactly
- Check that your domain is correct (no trailing slashes)

### "Access denied" error
- Ensure the Gmail API is enabled in your Google Cloud project
- Check that your OAuth consent screen is configured properly

### Token refresh issues
- The system automatically refreshes tokens when they expire
- If you see refresh errors, the user may need to re-authorize

## Multiple Users

Each user can connect their own Gmail account:
- Individual missionaries connect their personal Gmail accounts
- Admins can connect organization Gmail accounts
- Each user's tokens are stored separately and securely

## Email Sending Limits

Gmail API has the following limits:
- 1 billion queries per day per project
- 250 queries per user per second
- 420 queries per user per 100 seconds

For most mission organizations, these limits are more than sufficient.
