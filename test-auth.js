// Test script for BRNNO API Authentication
// Run with: node test-auth.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api/v1/users';

async function testAuth() {
    console.log('🧪 Testing BRNNO API Authentication...\n');

    try {
        // Test 1: Register a new user
        console.log('1️⃣ Testing user registration...');
        const registerResponse = await fetch(`${BASE_URL}/register`, {
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
        console.log('Registration response:', registerData);
        console.log('');

        // Test 2: Login with the registered user
        console.log('2️⃣ Testing user login...');
        const loginResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@brnno.com',
                password: 'testpassword123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);
        console.log('');

        if (loginData.token) {
            // Test 3: Access protected route with token (profile)
            console.log('3️⃣ Testing protected route access (profile)...');
            const profileResponse = await fetch(`${BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const profileData = await profileResponse.json();
            console.log('Profile response:', profileData);
            console.log('');

            // Test 4: Access protected route with token (me)
            console.log('4️⃣ Testing protected route access (me)...');
            const meResponse = await fetch(`${BASE_URL}/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const meData = await meResponse.json();
            console.log('Me response:', meData);
            console.log('');

            // Test 5: Try to access protected route without token
            console.log('5️⃣ Testing protected route without token...');
            const noTokenResponse = await fetch(`${BASE_URL}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const noTokenData = await noTokenResponse.json();
            console.log('No token response:', noTokenData);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testAuth(); 