#!/bin/bash

# Database backup script for production data protection
# Usage: ./scripts/backup-database.sh

set -e

echo "🗄️  Creating database backup..."

# Get current timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/database_backup_${TIMESTAMP}.sql"

# Create backups directory if it doesn't exist
mkdir -p backups

# Create backup using pg_dump (replace with your actual database URL)
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Extract connection details from DATABASE_URL
# This would need to be adapted based on your actual Supabase connection string
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

echo "✅ Database backup created: $BACKUP_FILE"
echo "💾 Backup size: $(du -h $BACKUP_FILE | cut -f1)"

# Optional: Upload to cloud storage (S3, Google Cloud, etc.)
# aws s3 cp "$BACKUP_FILE" "s3://your-backup-bucket/"

echo "🎉 Backup completed successfully!"
