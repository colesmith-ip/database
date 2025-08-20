# Production Data Safety Guide

## 🛡️ Data Protection Rules

### ❌ NEVER DO THESE IN PRODUCTION:
```bash
# DANGEROUS - Will delete ALL data
npx prisma db push --force-reset

# DANGEROUS - Will reset ALL data  
npx prisma migrate reset

# DANGEROUS - Raw database operations without backup
psql $DATABASE_URL -c "DROP TABLE..."
```

### ✅ SAFE COMMANDS FOR PRODUCTION:

#### 1. Creating Backups
```bash
# Create a backup before any changes
npm run db:backup
```

#### 2. Safe Migrations
```bash
# Safe migration with automatic backup
npm run db:migrate:safe

# Or deploy migrations manually (after backing up)
npm run db:backup
npm run db:migrate:deploy
```

#### 3. Adding New Data
```bash
# Seed new data (safe - doesn't delete existing)
npm run db:seed
npm run db:seed:conversations
```

## 🏗️ Schema Change Process

### For Minor Changes (adding fields, tables):
1. **Backup first**: `npm run db:backup`
2. **Update schema**: Edit `prisma/schema.prisma`
3. **Create migration**: `npx prisma migrate dev --name describe_change`
4. **Test locally**: Verify everything works
5. **Deploy safely**: `npm run db:migrate:deploy` (on production)

### For Major Changes (removing fields, changing types):
1. **Plan carefully**: Write migration strategy
2. **Backup multiple times**: Before each step
3. **Use multi-step migrations**: Don't change everything at once
4. **Test on staging**: Always test on copy of production data first

## 🚀 Vercel/Supabase Specific Safety

### Environment Separation:
- **Development**: Use local SQLite or separate Supabase project
- **Production**: Your main Supabase database

### Supabase Safety Features:
- **Point-in-time recovery**: Supabase keeps backups automatically
- **Database branching**: Create staging branches for testing
- **Read replicas**: For safe read operations

### Vercel Deployment:
- Vercel only runs `npm run build` and `npx prisma generate`
- It does NOT run migrations automatically
- You control when migrations happen

## 📦 Backup Strategy

### Automatic Supabase Backups:
- Supabase automatically backs up your database
- You can restore from any point in the last 7 days (or more on paid plans)

### Manual Backups:
```bash
# Before any major changes
npm run db:backup

# Store backups in multiple places
# - Local backups/ folder
# - Cloud storage (S3, Google Drive, etc.)
# - Version control (for schema snapshots)
```

## 🚨 Emergency Recovery

If data is accidentally lost:

1. **Stop all writes** to the database immediately
2. **Check Supabase dashboard** for point-in-time recovery options
3. **Use latest backup** from your manual backup system
4. **Contact Supabase support** if needed (they have additional backups)

## 🎯 Best Practices

1. **Always backup before changes**
2. **Test migrations on staging data first**
3. **Use migrations, not direct schema pushes**
4. **Keep multiple backup copies**
5. **Document all schema changes**
6. **Never work directly on production during peak hours**

## 📝 Change Log Template

When making schema changes, document them:

```markdown
## Schema Change: [Date]
**Description**: Added email tracking tables
**Migration**: 20241215_add_email_tracking
**Backup**: database_backup_20241215_143022.sql
**Risk Level**: Low (additive only)
**Rollback Plan**: Drop new tables if needed
```
