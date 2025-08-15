import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
  try {
    // Simple connection test
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'Database connected successfully' })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { status: 'Database connection failed', error: String(error) },
      { status: 500 }
    )
  }
}

