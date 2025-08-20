import { prisma } from './prisma'

export interface GmailTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

export async function refreshGmailToken(refreshToken: string): Promise<GmailTokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Gmail token')
  }

  return response.json()
}

export async function sendGmailEmail(
  accessToken: string,
  to: string,
  subject: string,
  body: string,
  fromEmail: string,
  fromName: string
) {
  // Create the email message in Gmail API format
  const email = [
    `From: ${fromName} <${fromEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    body
  ].join('\r\n')

  // Encode the email in base64
  const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  return response.json()
}

export async function getGmailAccessToken(userId: string): Promise<string | null> {
  const integration = await prisma.gmailIntegration.findUnique({
    where: { userId }
  })

  if (!integration) {
    return null
  }

  // Check if token is expired
  if (integration.expiresAt < new Date()) {
    try {
      // Refresh the token
      const tokenData = await refreshGmailToken(integration.refreshToken)
      
      // Update the integration with new token
      await prisma.gmailIntegration.update({
        where: { userId },
        data: {
          accessToken: tokenData.access_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        }
      })

      return tokenData.access_token
    } catch (error) {
      console.error('Failed to refresh Gmail token:', error)
      return null
    }
  }

  return integration.accessToken
}

export async function sendEmailCampaign(
  campaignId: string,
  recipientEmails: string[]
) {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId }
  })

  if (!campaign) {
    throw new Error('Campaign not found')
  }

  const accessToken = await getGmailAccessToken(campaign.ownerUserId || '')
  if (!accessToken) {
    throw new Error('Gmail access token not available')
  }

  const results = []

  for (const email of recipientEmails) {
    try {
      await sendGmailEmail(
        accessToken,
        email,
        campaign.subject,
        campaign.content,
        'your-email@yourmission.org', // Default sender email
        'Your Mission Organization' // Default sender name
      )

      // Update recipient status
      await prisma.emailCampaignRecipient.updateMany({
        where: {
          campaignId,
          person: {
            email: email
          }
        },
        data: {
          status: 'sent',
          sentAt: new Date()
        }
      })

      results.push({ email, status: 'sent' })
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error)
      
      // Update recipient status
      await prisma.emailCampaignRecipient.updateMany({
        where: {
          campaignId,
          person: {
            email: email
          }
        },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      })

      results.push({ email, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return results
}
