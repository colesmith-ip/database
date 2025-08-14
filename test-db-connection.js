const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Testing database connection...')
    await prisma.$queryRaw`SELECT sqlite_version() as version`
    console.log('✅ Database connection successful!')
    
    console.log('🔍 Testing Prisma schema...')
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Prisma is working!')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error.message)
    
    if (error.message.includes("Can't reach database server")) {
      console.log('\n💡 Solutions:')
      console.log('1. Make sure PostgreSQL is running on port 5432')
      console.log('2. Check your DATABASE_URL in .env file')
      console.log('3. Try: pg_ctl status (to check PostgreSQL status)')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
