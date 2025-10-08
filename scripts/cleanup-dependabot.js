#!/usr/bin/env node

/**
 * Dependabot Cleanup Script
 * 
 * This script helps you quickly manage existing Dependabot PRs
 * 
 * Usage: node scripts/cleanup-dependabot.js
 */

const { execSync } = require('child_process');

console.log('🧹 Dependabot Cleanup Helper\n');

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'pipe' });
} catch (error) {
  console.log('❌ Not in a git repository');
  process.exit(1);
}

console.log('📋 Quick Actions for Managing Dependabot PRs:\n');

console.log('1. **View All Dependabot PRs:**');
console.log('   gh pr list --author dependabot[bot] --state open');
console.log('');

console.log('2. **View PRs by Type:**');
console.log('   # Security updates (high priority)');
console.log('   gh pr list --author dependabot[bot] --state open --search "security"');
console.log('');
console.log('   # Patch updates (medium priority)');
console.log('   gh pr list --author dependabot[bot] --state open --search "patch"');
console.log('');
console.log('   # Minor updates (low priority)');
console.log('   gh pr list --author dependabot[bot] --state open --search "minor"');
console.log('');

console.log('3. **Batch Actions:**');
console.log('   # Merge all patch updates');
console.log('   gh pr list --author dependabot[bot] --state open --json number,title | jq -r \'.[] | select(.title | contains("patch")) | .number\' | xargs -I {} gh pr merge {} --squash');
console.log('');
console.log('   # Close all minor updates (if you want to ignore them)');
console.log('   gh pr list --author dependabot[bot] --state open --json number,title | jq -r \'.[] | select(.title | contains("minor")) | .number\' | xargs -I {} gh pr close {}');
console.log('');

console.log('4. **Individual Actions:**');
console.log('   # Merge a specific PR');
console.log('   gh pr merge [PR_NUMBER] --squash');
console.log('');
console.log('   # Close a specific PR');
console.log('   gh pr close [PR_NUMBER]');
console.log('');
console.log('   # Add auto-merge to a PR');
console.log('   gh pr merge [PR_NUMBER] --auto --squash');
console.log('');

console.log('5. **Priority Guidelines:**');
console.log('   🔴 **High Priority** - Security updates (merge immediately)');
console.log('   🟡 **Medium Priority** - Patch updates (review and merge)');
console.log('   🟢 **Low Priority** - Minor updates (batch merge weekly)');
console.log('   ⚠️  **Review Carefully** - Major updates (test thoroughly)');
console.log('');

console.log('6. **Time-Saving Tips:**');
console.log('   - Use @dependabot merge for trusted updates');
console.log('   - Batch similar updates together');
console.log('   - Set up auto-merge in repository settings');
console.log('   - Review in batches (weekly) instead of daily');
console.log('');

console.log('7. **Repository Settings:**');
console.log('   Go to Settings > General > Pull Requests:');
console.log('   - ✅ Enable "Automatically delete head branches"');
console.log('   - ✅ Enable "Allow auto-merge"');
console.log('   - ✅ Enable "Allow auto-merge for Dependabot"');
console.log('');

console.log('8. **Current Configuration Status:**');
console.log('   ✅ Dependabot PR limit: 3 (npm), 2 (others)');
console.log('   ✅ Schedule: Weekly (Mondays)');
console.log('   ✅ Ignore rules: Major updates for critical deps');
console.log('');

console.log('🚀 Quick Start:');
console.log('');
console.log('1. Run: gh pr list --author dependabot[bot] --state open');
console.log('2. Identify security updates and merge them first');
console.log('3. Batch merge patch updates');
console.log('4. Review minor updates and merge if safe');
console.log('5. Close or postpone major updates');
console.log('');

console.log('💡 Pro Tip:');
console.log('Set up auto-merge for patch updates by adding this comment to PRs:');
console.log('@dependabot merge when CI passes');
console.log('');

console.log('✨ Happy dependency managing!');
