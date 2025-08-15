# Database Setup Commands

## After PostgreSQL is Running:

### 1. Test Connection
```bash
node test-db-connection.js
```

### 2. Update .env File
Choose one based on your PostgreSQL setup:

```bash
# For Postgres.app (default user)
echo 'DATABASE_URL="postgresql://postgres@localhost:5432/hello_crm_db?schema=public"' > .env

# For custom user setup
echo 'DATABASE_URL="postgresql://crm_user:your_password@localhost:5432/hello_crm_db?schema=public"' > .env

# For Docker setup
echo 'DATABASE_URL="postgresql://postgres:password123@localhost:5432/hello_crm_db?schema=public"' > .env
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Create Database Tables
```bash
npm run db:migrate
```

### 5. Seed Sample Data
```bash
npm run db:seed
```

### 6. Test Your CRM
- People: http://localhost:3000/people
- Organizations: http://localhost:3000/organizations

## Troubleshooting

### If migration fails:
```bash
# Reset and try again
npx prisma migrate reset --force
npm run db:migrate
npm run db:seed
```

### If connection still fails:
```bash
# Check PostgreSQL status
brew services list | grep postgres  # If using Homebrew
ps aux | grep postgres              # Check if postgres is running

# Test direct connection
psql -U postgres -h localhost -d hello_crm_db
```

### Quick PostgreSQL Commands:
```bash
# Create database manually if needed
createdb -U postgres hello_crm_db

# Connect to database
psql -U postgres -d hello_crm_db

# In psql prompt:
\l          # List databases
\dt         # List tables
\q          # Quit
```

