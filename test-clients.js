// Test script for BRNNO API Client Management
// Run with: node test-clients.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const USERS_URL = `${BASE_URL}/api/v1/users`;
const CLIENTS_URL = `${BASE_URL}/api/v1/clients`;

async function testClientManagement() {
    console.log('🧪 Testing BRNNO API Client Management...\n');

    let authToken = '';

    try {
        // Step 1: Register a user (if not already exists)
        console.log('1️⃣ Registering a test user...');
        const registerResponse = await fetch(`${USERS_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'clienttest@brnno.com',
                password: 'testpassword123'
            })
        });

        if (registerResponse.status === 409) {
            console.log('User already exists, proceeding to login...');
        } else {
            const registerData = await registerResponse.json();
            console.log('Registration response:', registerData);
        }
        console.log('');

        // Step 2: Login to get authentication token
        console.log('2️⃣ Logging in to get authentication token...');
        const loginResponse = await fetch(`${USERS_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'clienttest@brnno.com',
                password: 'testpassword123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (loginData.token) {
            authToken = loginData.token;
            console.log('✅ Authentication token obtained');
        } else {
            console.error('❌ Failed to get authentication token');
            return;
        }
        console.log('');

        // Step 3: Create a new client
        console.log('3️⃣ Creating a new client...');
        const createClientResponse = await fetch(`${CLIENTS_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                name: 'Acme Corporation',
                email: 'contact@acme.com',
                phone: '+1-555-0123',
                notes: 'Major client for Q4 project'
            })
        });

        const createClientData = await createClientResponse.json();
        console.log('Create client response:', createClientData);

        let clientId = '';
        if (createClientData.client && createClientData.client.id) {
            clientId = createClientData.client.id;
            console.log('✅ Client created with ID:', clientId);
        } else {
            console.error('❌ Failed to create client');
            return;
        }
        console.log('');

        // Step 4: Get all clients
        console.log('4️⃣ Getting all clients...');
        const getClientsResponse = await fetch(`${CLIENTS_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        const getClientsData = await getClientsResponse.json();
        console.log('Get clients response:', getClientsData);
        console.log('');

        // Step 5: Get specific client
        console.log('5️⃣ Getting specific client...');
        const getClientResponse = await fetch(`${CLIENTS_URL}/${clientId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        const getClientData = await getClientResponse.json();
        console.log('Get specific client response:', getClientData);
        console.log('');

        // Step 6: Update client
        console.log('6️⃣ Updating client...');
        const updateClientResponse = await fetch(`${CLIENTS_URL}/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                name: 'Acme Corporation Ltd',
                email: 'info@acme.com',
                phone: '+1-555-0124',
                notes: 'Major client for Q4 project - Updated contact info'
            })
        });

        const updateClientData = await updateClientResponse.json();
        console.log('Update client response:', updateClientData);
        console.log('');

        // Step 7: Test without authentication (should fail)
        console.log('7️⃣ Testing without authentication (should fail)...');
        const noAuthResponse = await fetch(`${CLIENTS_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const noAuthData = await noAuthResponse.json();
        console.log('No auth response:', noAuthData);
        console.log('');

        // Step 8: Delete client
        console.log('8️⃣ Deleting client...');
        const deleteClientResponse = await fetch(`${CLIENTS_URL}/${clientId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        const deleteClientData = await deleteClientResponse.json();
        console.log('Delete client response:', deleteClientData);
        console.log('');

        console.log('🎉 All client management tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testClientManagement(); 