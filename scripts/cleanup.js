const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning up build artifacts...');

// Directories to clean
const dirsToClean = [
    '.next',
    'out',
    'build',
    'dist',
    'node_modules/.cache'
];

// Files to clean
const filesToClean = [
    '*.tsbuildinfo',
    'next-env.d.ts'
];

// Clean directories
dirsToClean.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
        console.log(`🗑️  Removing ${dir}...`);
        try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`✅ Removed ${dir}`);
        } catch (error) {
            console.log(`⚠️  Could not remove ${dir}: ${error.message}`);
        }
    } else {
        console.log(`ℹ️  ${dir} does not exist, skipping...`);
    }
});

// Clean files
filesToClean.forEach(pattern => {
    console.log(`🗑️  Cleaning ${pattern}...`);
    try {
        execSync(`del /f /q ${pattern}`, { stdio: 'inherit' });
    } catch (error) {
        // File might not exist, that's okay
    }
});

console.log('✨ Cleanup complete!');
console.log('');
console.log('Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run dev'); 