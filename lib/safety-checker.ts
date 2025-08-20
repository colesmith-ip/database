// Safety checker for dangerous database operations
// This module provides warnings and confirmations for potentially destructive operations

export interface SafetyWarning {
  operation: string;
  risk: string;
  consequences: string[];
  alternatives: string[];
  requiresConfirmation: boolean;
}

export class DatabaseSafetyChecker {
  private static readonly DANGEROUS_OPERATIONS: Record<string, SafetyWarning> = {
    'force-reset': {
      operation: 'Database Force Reset',
      risk: 'Will permanently delete ALL data in the database',
      consequences: [
        'All people, organizations, and relationships will be lost',
        'All email conversations and marketing data will be deleted',
        'All pipeline items, tasks, and events will be removed',
        'All custom fields and configurations will be reset',
        'This cannot be undone without a backup'
      ],
      alternatives: [
        'Use database migrations instead',
        'Create a backup first with npm run db:backup',
        'Use npm run db:migrate:safe for safe schema changes'
      ],
      requiresConfirmation: true
    },
    'migrate-reset': {
      operation: 'Migration Reset',
      risk: 'Will reset all migrations and delete all data',
      consequences: [
        'All database data will be permanently deleted',
        'Migration history will be reset',
        'Schema will be recreated from scratch'
      ],
      alternatives: [
        'Use npm run db:migrate:deploy for safe migrations',
        'Create a backup before making changes',
        'Use schema introspection to understand current state'
      ],
      requiresConfirmation: true
    },
    'drop-table': {
      operation: 'Drop Table',
      risk: 'Will permanently delete a table and all its data',
      consequences: [
        'All data in the specified table will be lost',
        'Related foreign key constraints will be affected',
        'This operation cannot be undone'
      ],
      alternatives: [
        'Use soft deletes instead',
        'Archive data before dropping',
        'Use migrations to safely remove tables'
      ],
      requiresConfirmation: true
    },
    'delete-all': {
      operation: 'Delete All Records',
      risk: 'Will delete all records from a table',
      consequences: [
        'All records in the table will be permanently removed',
        'This affects all users and their data',
        'Cannot be undone without a backup'
      ],
      alternatives: [
        'Use WHERE clauses to delete specific records',
        'Implement soft deletes',
        'Archive data instead of deleting'
      ],
      requiresConfirmation: true
    }
  };

  static checkOperation(operation: string): SafetyWarning | null {
    const normalizedOp = operation.toLowerCase().replace(/[^a-z-]/g, '');
    
    for (const [key, warning] of Object.entries(this.DANGEROUS_OPERATIONS)) {
      if (normalizedOp.includes(key)) {
        return warning;
      }
    }
    
    return null;
  }

  static async confirmDangerousOperation(warning: SafetyWarning): Promise<boolean> {
    console.log('\n🚨 DANGEROUS OPERATION DETECTED 🚨');
    console.log(`Operation: ${warning.operation}`);
    console.log(`Risk: ${warning.risk}`);
    console.log('\n⚠️  WARNING: This operation will PERMANENTLY DELETE data!');
    console.log('\nPotential consequences:');
    warning.consequences.forEach(consequence => {
      console.log(`• ${consequence}`);
    });
    
    console.log('\n✅ SAFE ALTERNATIVES:');
    warning.alternatives.forEach(alternative => {
      console.log(`• ${alternative}`);
    });
    
    console.log('\n🚨 Are you ABSOLUTELY SURE you want to proceed?');
    console.log('Type "YES I UNDERSTAND THE RISKS" to continue, or anything else to cancel:');
    
    // In a real implementation, this would read from stdin
    // For now, we'll simulate a confirmation check
    return false; // Default to safe - require explicit override
  }

  static isProductionEnvironment(): boolean {
    return process.env.NODE_ENV === 'production' || 
           process.env.VERCEL_ENV === 'production' ||
           process.env.DATABASE_URL?.includes('supabase.com') === true;
  }

  static async safeExecute<T>(
    operation: string, 
    executeFn: () => Promise<T>,
    forceOverride?: boolean
  ): Promise<T> {
    const warning = this.checkOperation(operation);
    
    if (warning && !forceOverride) {
      const confirmed = await this.confirmDangerousOperation(warning);
      if (!confirmed) {
        throw new Error('Dangerous operation cancelled by user');
      }
    }

    if (this.isProductionEnvironment() && !forceOverride) {
      console.log('\n🚨 PRODUCTION ENVIRONMENT DETECTED! 🚨');
      console.log('You are about to perform a dangerous operation in PRODUCTION!');
      console.log('This could affect real users and real data!');
      console.log('\nType "PRODUCTION DANGER" to proceed, or anything else to cancel:');
      
      // In a real implementation, this would read from stdin
      throw new Error('Production operation cancelled for safety');
    }

    return executeFn();
  }
}

// Export convenience functions
export const checkOperation = DatabaseSafetyChecker.checkOperation.bind(DatabaseSafetyChecker);
export const confirmDangerousOperation = DatabaseSafetyChecker.confirmDangerousOperation.bind(DatabaseSafetyChecker);
export const isProductionEnvironment = DatabaseSafetyChecker.isProductionEnvironment.bind(DatabaseSafetyChecker);
export const safeExecute = DatabaseSafetyChecker.safeExecute.bind(DatabaseSafetyChecker);
