import { PrismaClient } from '@prisma/client'

// Enhanced database query wrapper with better error handling
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T | null = null
): Promise<T | null> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query error:', error)
    
    // Check if it's a connection error
    const isConnectionError = error instanceof Error && (
      error.message.includes('Can\'t reach database server') ||
      error.message.includes('Connection') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    )
    
    // During build time or connection issues, return fallback
    if (process.env.NODE_ENV === 'production' || isConnectionError) {
      console.warn('Database connection not available, returning fallback value')
      return fallbackValue
    }
    
    // In development, throw the error for debugging
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Enhanced Prisma client with connection retry
let prismaClient: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
  }
  return prismaClient
}

// Graceful shutdown
export async function disconnectPrisma() {
  if (prismaClient) {
    await prismaClient.$disconnect()
    prismaClient = null
  }
}

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = getPrismaClient()
    await client.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}
