#!/bin/bash

# Dangerous command checker - warns before destructive operations
# Usage: source this script, then call check_dangerous_command

set -e

# Colors for warnings
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

check_dangerous_command() {
    local command="$1"
    local reason="$2"
    
    echo -e "${RED}🚨 DANGEROUS OPERATION DETECTED 🚨${NC}"
    echo -e "${YELLOW}Command: $command${NC}"
    echo -e "${YELLOW}Risk: $reason${NC}"
    echo ""
    echo -e "${RED}⚠️  WARNING: This operation will PERMANENTLY DELETE data!${NC}"
    echo ""
    echo "Potential consequences:"
    echo "• All people, organizations, and relationships will be lost"
    echo "• All email conversations and marketing data will be deleted"
    echo "• All pipeline items, tasks, and events will be removed"
    echo "• This cannot be undone without a backup"
    echo ""
    echo "If you have production data, this could be catastrophic!"
    echo ""
    echo -e "${GREEN}✅ SAFE ALTERNATIVES:${NC}"
    echo "• Use 'npm run db:backup' first to create a backup"
    echo "• Use 'npm run db:migrate:safe' for safe migrations"
    echo "• Use 'npx prisma migrate deploy' instead of reset"
    echo ""
    echo -e "${RED}Are you ABSOLUTELY SURE you want to proceed? (type 'YES I UNDERSTAND THE RISKS' to continue)${NC}"
    read -r confirmation
    
    if [[ "$confirmation" != "YES I UNDERSTAND THE RISKS" ]]; then
        echo -e "${GREEN}✅ Operation cancelled. Your data is safe!${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}⚠️  Final warning: This will delete ALL data. Proceed? (type 'DELETE EVERYTHING' to confirm)${NC}"
    read -r final_confirmation
    
    if [[ "$final_confirmation" != "DELETE EVERYTHING" ]]; then
        echo -e "${GREEN}✅ Operation cancelled. Your data is safe!${NC}"
        exit 1
    fi
    
    echo -e "${RED}🚨 Proceeding with destructive operation...${NC}"
    echo -e "${YELLOW}Remember: You were warned!${NC}"
}

# Check if we're in a production-like environment
check_production_environment() {
    if [[ "$NODE_ENV" == "production" ]] || [[ "$VERCEL_ENV" == "production" ]]; then
        echo -e "${RED}🚨 PRODUCTION ENVIRONMENT DETECTED! 🚨${NC}"
        echo -e "${YELLOW}You are about to perform a dangerous operation in PRODUCTION!${NC}"
        echo ""
        echo "This could affect real users and real data!"
        echo ""
        echo -e "${RED}Are you sure you want to continue? (type 'PRODUCTION DANGER' to proceed)${NC}"
        read -r prod_confirmation
        
        if [[ "$prod_confirmation" != "PRODUCTION DANGER" ]]; then
            echo -e "${GREEN}✅ Production operation cancelled.${NC}"
            exit 1
        fi
    fi
}

# Function to check for dangerous patterns in commands
scan_for_dangerous_patterns() {
    local command="$1"
    
    # Check for dangerous patterns
    if [[ "$command" == *"--force-reset"* ]] || [[ "$command" == *"force-reset"* ]]; then
        check_dangerous_command "$command" "Force reset will delete ALL database data"
        return 0
    fi
    
    if [[ "$command" == *"migrate reset"* ]] || [[ "$command" == *"db reset"* ]]; then
        check_dangerous_command "$command" "Migration reset will delete ALL data and recreate schema"
        return 0
    fi
    
    if [[ "$command" == *"DROP TABLE"* ]] || [[ "$command" == *"drop table"* ]]; then
        check_dangerous_command "$command" "DROP TABLE will permanently delete table and all data"
        return 0
    fi
    
    if [[ "$command" == *"DELETE FROM"* ]] && [[ "$command" != *"WHERE"* ]]; then
        check_dangerous_command "$command" "DELETE without WHERE clause will delete ALL rows"
        return 0
    fi
    
    return 1
}

# Export functions for use in other scripts
export -f check_dangerous_command
export -f check_production_environment
export -f scan_for_dangerous_patterns
