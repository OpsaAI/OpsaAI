#!/usr/bin/env node

/**
 * Dependabot Management Script
 * 
 * This script helps you manage Dependabot PRs efficiently
 * 
 * Usage: node scripts/manage-dependabot.js
 */

const { execSync } = require('child_process');

console.log('📦 Dependabot Management Helper\n');

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'pipe' });
} catch (error) {
  console.log('❌ Not in a git repository');
  process.exit(1);
}

console.log('🔍 Checking for Dependabot PRs...\n');

// Instructions for managing Dependabot
console.log('📋 How to Manage Dependabot PRs:');
console.log('');
console.log('1. **Review PRs by Priority:**');
console.log('   - Security updates (high priority)');
console.log('   - Patch updates (medium priority)');
console.log('   - Minor updates (low priority)');
console.log('   - Major updates (review carefully)');
console.log('');

console.log('2. **Quick Actions:**');
console.log('   - Auto-merge minor/patch updates:');
console.log('     @dependabot merge');
console.log('   - Auto-merge with specific conditions:');
console.log('     @dependabot merge when CI passes');
console.log('   - Close without merging:');
console.log('     @dependabot close');
console.log('');

console.log('3. **Batch Management:**');
console.log('   - Merge multiple minor updates at once');
console.log('   - Group related updates together');
console.log('   - Use "Rebase and merge" for cleaner history');
console.log('');

console.log('4. **Configuration Tips:**');
console.log('   - Limit open PRs: open-pull-requests-limit: 3');
console.log('   - Ignore major updates for critical deps');
console.log('   - Schedule updates weekly instead of daily');
console.log('');

console.log('5. **Common Commands:**');
console.log('   # List all Dependabot PRs');
console.log('   gh pr list --author dependabot[bot]');
console.log('');
console.log('   # Merge a specific PR');
console.log('   gh pr merge [PR_NUMBER] --squash');
console.log('');
console.log('   # Close a PR');
console.log('   gh pr close [PR_NUMBER]');
console.log('');

console.log('6. **Auto-merge Setup:**');
console.log('   Add this to your repository settings:');
console.log('   - Go to Settings > General > Pull Requests');
console.log('   - Enable "Automatically delete head branches"');
console.log('   - Enable "Allow auto-merge"');
console.log('');

console.log('7. **Dependabot Configuration (.github/dependabot.yml):');
console.log('   ```yaml');
console.log('   open-pull-requests-limit: 3  # Limit concurrent PRs');
console.log('   schedule:');
console.log('     interval: "weekly"         # Weekly instead of daily');
console.log('   ignore:');
console.log('     - dependency-name: "next"  # Ignore major updates');
console.log('       update-types: ["version-update:semver-major"]');
console.log('   ```');
console.log('');

console.log('8. **Priority Guidelines:**');
console.log('   - **High Priority**: Security vulnerabilities');
console.log('   - **Medium Priority**: Bug fixes and patches');
console.log('   - **Low Priority**: Minor version updates');
console.log('   - **Review Carefully**: Major version updates');
console.log('');

console.log('9. **Time-Saving Tips:**');
console.log('   - Use GitHub CLI for batch operations');
console.log('   - Set up auto-merge for trusted updates');
console.log('   - Review in batches (weekly)');
console.log('   - Use labels to categorize updates');
console.log('');

console.log('10. **Troubleshooting:**');
console.log('    - If PRs are failing: Check CI logs');
console.log('    - If too many PRs: Reduce open-pull-requests-limit');
console.log('    - If updates are too frequent: Change schedule to monthly');
console.log('');

console.log('🚀 Quick Actions:');
console.log('');
console.log('To see current Dependabot PRs, run:');
console.log('gh pr list --author dependabot[bot] --state open');
console.log('');
console.log('To merge all minor/patch updates:');
console.log('gh pr list --author dependabot[bot] --state open --json number,title | jq -r \'.[] | select(.title | contains("patch") or contains("minor")) | .number\' | xargs -I {} gh pr merge {} --squash');
console.log('');

console.log('✨ Happy dependency managing!');
