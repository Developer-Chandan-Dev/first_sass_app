#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('⚡ Running quick error checks...\n');

const checks = [
  { cmd: 'npm run type-check', name: 'TypeScript' },
  { cmd: 'npm run lint', name: 'ESLint' },
  { cmd: 'npm run format:check', name: 'Prettier' },
];

let hasErrors = false;

for (const check of checks) {
  try {
    console.log(`🔍 Checking ${check.name}...`);
    execSync(check.cmd, { stdio: 'pipe' });
    console.log(`✅ ${check.name} - OK`);
  } catch (error) {
    console.log(`❌ ${check.name} - ERRORS FOUND`);
    hasErrors = true;
  }
}

console.log('\n' + '='.repeat(40));
if (hasErrors) {
  console.log('💥 Errors found! Run individual commands to see details:');
  console.log('   npm run type-check');
  console.log('   npm run lint');
  console.log('   npm run format:check');
} else {
  console.log('🎉 All checks passed!');
}
