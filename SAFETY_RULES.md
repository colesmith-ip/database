# 🛡️ Hard-Coded Safety Rules

## Overview
This document describes the hard-coded safety measures that prevent accidental data loss, even if you explicitly ask for dangerous operations.

## 🚨 Automatic Warnings

### 1. **Command-Line Protection**
When you run dangerous commands, you'll get warnings like this:

```bash
🚨 DANGEROUS OPERATION DETECTED 🚨
Command: npx prisma db push --force-reset
Risk: Force reset will delete ALL database data

⚠️  WARNING: This operation will PERMANENTLY DELETE data!

Potential consequences:
• All people, organizations, and relationships will be lost
• All email conversations and marketing data will be deleted
• All pipeline items, tasks, and events will be removed
• This cannot be undone without a backup

✅ SAFE ALTERNATIVES:
• Use 'npm run db:backup' first to create a backup
• Use 'npm run db:migrate:safe' for safe migrations
• Use 'npx prisma migrate deploy' instead of reset

Are you ABSOLUTELY SURE you want to proceed? (type 'YES I UNDERSTAND THE RISKS' to continue)
```

### 2. **Production Environment Detection**
If you're in production, you'll get additional warnings:

```bash
🚨 PRODUCTION ENVIRONMENT DETECTED! 🚨
You are about to perform a dangerous operation in PRODUCTION!
This could affect real users and real data!

Type "PRODUCTION DANGER" to proceed, or anything else to cancel:
```

## 🔒 Protected Commands

### **Automatically Intercepted:**
- `npx prisma db push --force-reset`
- `npx prisma migrate reset`
- `npx prisma db push` (now uses safe wrapper)
- Any command containing `--force-reset`
- Any command containing `migrate reset`
- Any command containing `DROP TABLE`
- Any command containing `DELETE FROM` without `WHERE`

### **Safe Alternatives:**
- `npm run db:backup` - Create backup first
- `npm run db:migrate:safe` - Safe migration with backup
- `npm run db:migrate:deploy` - Deploy migrations safely
- `npm run prisma:safe` - Use safe Prisma wrapper

## 🛠️ How It Works

### 1. **Shell Script Protection**
- `scripts/dangerous-command-check.sh` - Core safety logic
- `scripts/safe-prisma.sh` - Wrapper for Prisma commands
- `scripts/safe-migrate.sh` - Safe migration with backup

### 2. **TypeScript Protection**
- `lib/safety-checker.ts` - Programmatic safety checks
- Can be imported and used in your code

### 3. **Git Hook Protection**
- `.git/hooks/pre-commit` - Checks commits for dangerous patterns
- Prevents committing code with dangerous operations

### 4. **Package.json Protection**
- All dangerous commands now use safe wrappers
- New safe commands available

## 🚫 What's Blocked

### **Even if you explicitly ask for it:**
1. **Force resets** - Will warn and require double confirmation
2. **Migration resets** - Will warn about data loss
3. **Production operations** - Extra warnings for production environments
4. **Dangerous commits** - Git hook prevents committing dangerous code

### **Required Confirmations:**
- Type `YES I UNDERSTAND THE RISKS` for dangerous operations
- Type `DELETE EVERYTHING` for destructive operations
- Type `PRODUCTION DANGER` for production operations

## 🎯 Safety Philosophy

### **"Better Safe Than Sorry"**
- Default to **blocking** dangerous operations
- Require **explicit confirmation** for destructive actions
- Provide **safe alternatives** for every dangerous operation
- **Multiple layers** of protection

### **"Trust But Verify"**
- Even if you're the one asking for it, we'll still warn you
- Production environments get extra scrutiny
- All dangerous operations are logged and tracked

## 📋 Override Instructions

### **If you REALLY need to bypass safety:**
1. **Set environment variable**: `FORCE_DANGEROUS_OPERATIONS=true`
2. **Use direct commands**: `npx prisma db push --force-reset` (will still warn)
3. **Modify scripts**: Edit the safety scripts (not recommended)

### **Emergency Override:**
```bash
# Only use in true emergencies
export FORCE_DANGEROUS_OPERATIONS=true
npm run db:reset
```

## 🔧 Customization

### **Adding New Dangerous Patterns:**
Edit `scripts/dangerous-command-check.sh`:
```bash
if [[ "$command" == *"YOUR_PATTERN"* ]]; then
    check_dangerous_command "$command" "Your risk description"
    return 0
fi
```

### **Modifying Warnings:**
Edit `lib/safety-checker.ts`:
```typescript
'your-pattern': {
  operation: 'Your Operation Name',
  risk: 'Your risk description',
  consequences: ['Your consequences'],
  alternatives: ['Your alternatives'],
  requiresConfirmation: true
}
```

## 📞 Emergency Contacts

### **If you need to bypass safety in an emergency:**
1. **Check backups first**: `npm run db:backup`
2. **Document the emergency**: Why you need to bypass safety
3. **Use override**: `FORCE_DANGEROUS_OPERATIONS=true`
4. **Restore immediately**: Use backups to restore data

## 🎉 Benefits

### **What this protects you from:**
- ✅ **Accidental data loss** during development
- ✅ **Production disasters** from dangerous commands
- ✅ **Committing dangerous code** to version control
- ✅ **Schema changes** without proper backups
- ✅ **Migration issues** that could cause data loss

### **Peace of Mind:**
- Your data is **protected by default**
- You get **warnings before** dangerous operations
- You have **safe alternatives** for everything
- **Multiple layers** of protection

---

**Remember: These safety measures are here to protect your data, even from yourself! 🛡️**
