const fetch = require('node-fetch');

async function quickTest() {
    console.log('🧪 Quick login test...\n');

    try {
        // Test registration
        console.log('1️⃣ Testing registration...');
        const registerResponse = await fetch('http://localhost:3001/api/v1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@brnno.com',
                password: 'test123'
            })
        });

        console.log('Registration status:', registerResponse.status);
        const registerData = await registerResponse.json();
        console.log('Registration response:', registerData);
        console.log('');

        // Test login
        console.log('2️⃣ Testing login...');
        const loginResponse = await fetch('http://localhost:3001/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@brnno.com',
                password: 'test123'
            })
        });

        console.log('Login status:', loginResponse.status);
        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

quickTest();
