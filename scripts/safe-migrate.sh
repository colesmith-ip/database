#!/bin/bash

# Safe migration script that backs up before migrating
# Usage: ./scripts/safe-migrate.sh

set -e

echo "🛡️  Starting safe migration process..."

# Step 1: Create backup
echo "📦 Creating backup before migration..."
./scripts/backup-database.sh

# Step 2: Run migration in preview mode first
echo "🔍 Previewing migration changes..."
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma

echo "⚠️  Please review the changes above. Do you want to proceed? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🚀 Applying migration..."
    npx prisma migrate deploy
    echo "✅ Migration completed successfully!"
else
    echo "❌ Migration cancelled by user"
    exit 1
fi
