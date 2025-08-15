const { PrismaClient } = require('@prisma/client');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase database connection...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful!');
    
    // Test Prisma schema
    await prisma.person.findMany({ take: 1 });
    console.log('✅ Prisma schema is working!');
    
    console.log('\n🎉 Supabase connection is ready for deployment!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Set DATABASE_URL in your .env file');
    console.log('2. Use the correct Supabase connection string');
    console.log('3. Check that your Supabase project is active');
  } finally {
    await prisma.$disconnect();
  }
}

testSupabaseConnection();
