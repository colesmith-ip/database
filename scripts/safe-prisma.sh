#!/bin/bash

# Safe Prisma wrapper - intercepts dangerous commands
# Usage: ./scripts/safe-prisma.sh [prisma-command] [args...]

set -e

# Source the dangerous command checker
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/dangerous-command-check.sh"

# Build the full command
FULL_COMMAND="npx prisma $*"

# Check for dangerous patterns
if scan_for_dangerous_patterns "$FULL_COMMAND"; then
    # The function will handle the warning and confirmation
    # If it returns, the user confirmed and we can proceed
    echo "Proceeding with confirmed dangerous operation..."
fi

# Check production environment
check_production_environment

# Execute the command
echo "Executing: $FULL_COMMAND"
exec npx prisma "$@"
