import { NextRequest, NextResponse } from 'next/server'
import { saveGmailIntegration } from '../../../../actions/marketing'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Check for OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/marketing/integrations/gmail?error=${encodeURIComponent(error)}`
    )
  }

  // Verify state parameter
  const storedState = request.cookies.get('gmail_oauth_state')?.value
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/marketing/integrations/gmail?error=${encodeURIComponent('Invalid state parameter')}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/marketing/integrations/gmail?error=${encodeURIComponent('No authorization code received')}`
    )
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/gmail/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code for token')
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    // Get user info to get the email address
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userInfo = await userInfoResponse.json()
    const email = userInfo.email

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + expires_in * 1000)

    // Save the integration to database
    // For now, we'll use a placeholder user ID - in a real app, you'd get this from the session
    const userId = 'current-user-id' // This should come from your authentication system
    
    await saveGmailIntegration(
      userId,
      access_token,
      refresh_token,
      email,
      expiresAt
    )

    // Clear the state cookie
    const response = NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/marketing/integrations/gmail?success=true`
    )
    response.cookies.delete('gmail_oauth_state')
    
    return response

  } catch (error) {
    console.error('Gmail OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/marketing/integrations/gmail?error=${encodeURIComponent('Failed to complete Gmail integration')}`
    )
  }
}
