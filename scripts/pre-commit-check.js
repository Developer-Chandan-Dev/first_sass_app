#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-commit checks...\n');

let hasErrors = false;

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    console.log(`✅ ${description} passed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.stdout || error.message);
    console.error('');
    hasErrors = true;
    return false;
  }
}

// Check for TypeScript errors
runCommand('npm run type-check', 'TypeScript type checking');

// Check for ESLint errors
runCommand('npm run lint', 'ESLint code quality check');

// Check for Prettier formatting
runCommand('npm run format:check', 'Prettier code formatting check');

// Try to build the project
runCommand('npm run build', 'Next.js build check');

if (hasErrors) {
  console.log(
    '💥 Pre-commit checks failed! Please fix the errors above before committing.'
  );
  process.exit(1);
} else {
  console.log('🎉 All checks passed! Ready to commit.');

  // Add all changed files
  console.log('📁 Adding all changed files to git...');
  try {
    execSync('git add .', { stdio: 'inherit' });
    console.log('✅ Files added successfully');

    // Prompt for commit message
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('💬 Enter commit message: ', (message) => {
      if (message.trim()) {
        try {
          execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
          console.log('✅ Commit successful!');
        } catch (error) {
          console.error('❌ Commit failed:', error.message);
        }
      } else {
        console.log('❌ Commit cancelled - no message provided');
      }
      rl.close();
    });
  } catch (error) {
    console.error('❌ Failed to add files:', error.message);
  }
}
