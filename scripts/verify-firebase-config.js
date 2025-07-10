require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verifying Firebase Configuration...\n');

// Expected values from your Firebase console
const expectedValues = {
    appId: "1:229216146002:web:bdcca9ed6f58524cad058b",
    measurementId: "G-JQH8078EG7"
};

// Current values from environment
const currentValues = {
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('📋 Configuration Comparison:');
console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│ Expected (from Firebase Console) │ Current (from .env.local) │');
console.log('├─────────────────────────────────────────────────────────────┤');
console.log(`│ App ID: ${expectedValues.appId.padEnd(30)} │ ${(currentValues.appId || 'Not set').padEnd(30)} │`);
console.log(`│ Measurement ID: ${expectedValues.measurementId.padEnd(20)} │ ${(currentValues.measurementId || 'Not set').padEnd(30)} │`);
console.log('└─────────────────────────────────────────────────────────────┘\n');

// Check for mismatches
const mismatches = [];

if (currentValues.appId !== expectedValues.appId) {
    mismatches.push({
        field: 'App ID',
        expected: expectedValues.appId,
        current: currentValues.appId || 'Not set'
    });
}

if (currentValues.measurementId !== expectedValues.measurementId) {
    mismatches.push({
        field: 'Measurement ID',
        expected: expectedValues.measurementId,
        current: currentValues.measurementId || 'Not set'
    });
}

if (mismatches.length === 0) {
    console.log('✅ All Firebase configuration values match!');
} else {
    console.log('❌ Configuration mismatches found:');
    mismatches.forEach(mismatch => {
        console.log(`   ${mismatch.field}:`);
        console.log(`     Expected: ${mismatch.expected}`);
        console.log(`     Current:  ${mismatch.current}`);
    });
    console.log('\n💡 To fix, update your .env.local file with the correct values:');
    console.log(`   NEXT_PUBLIC_FIREBASE_APP_ID="${expectedValues.appId}"`);
    console.log(`   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="${expectedValues.measurementId}"`);
} 