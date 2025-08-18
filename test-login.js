// Test login endpoint
const fetch = require('node-fetch');

async function testLogin() {
    console.log('🧪 Testing login endpoint...\n');

    try {
        // Test login with invalid credentials first
        console.log('1️⃣ Testing login with invalid credentials...');
        const loginResponse = await fetch('http://localhost:3001/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'wrongpassword'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login response status:', loginResponse.status);
        console.log('Login response:', loginData);
        console.log('');

        // Test registration
        console.log('2️⃣ Testing user registration...');
        const registerResponse = await fetch('http://localhost:3001/api/v1/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@brnno.com',
                password: 'testpassword123'
            })
        });

        const registerData = await registerResponse.json();
        console.log('Registration response status:', registerResponse.status);
        console.log('Registration response:', registerData);
        console.log('');

        // Test login with valid credentials
        console.log('3️⃣ Testing login with valid credentials...');
        const validLoginResponse = await fetch('http://localhost:3001/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@brnno.com',
                password: 'testpassword123'
            })
        });

        const validLoginData = await validLoginResponse.json();
        console.log('Valid login response status:', validLoginResponse.status);
        console.log('Valid login response:', validLoginData);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testLogin();
