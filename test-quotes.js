// Test script for BRNNO API Quote Management
// Run with: node test-quotes.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';
let testQuoteId = '';
let testClientId = '';
let testServiceId = '';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'testpassword123'
};

const testClient = {
    name: 'Test Client',
    email: 'client@example.com',
    phone: '555-1234',
    address: '123 Test St'
};

const testService = {
    name: 'Test Service',
    description: 'A test service',
    price: 100.00
};

const testQuote = {
    client_id: '', // Will be set after client creation
    items: [
        {
            service_id: '', // Will be set after service creation
            description: 'Test item',
            unit_price: 100.00,
            quantity: 2
        }
    ]
};

// Helper function to make authenticated requests
const makeAuthRequest = async (method, url, data = null) => {
    const config = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        config.data = data;
    }

    return axios(config);
};

// Test suite
async function runTests() {
    console.log('🚀 Starting Quote Management Tests...\n');

    try {
        // 1. Login to get auth token
        console.log('1. Testing user login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
        authToken = loginResponse.data.token;
        console.log('✅ Login successful\n');

        // 2. Create a test client
        console.log('2. Creating test client...');
        const clientResponse = await makeAuthRequest('POST', '/clients', testClient);
        testClientId = clientResponse.data.client.id;
        testQuote.client_id = testClientId;
        console.log('✅ Client created\n');

        // 3. Create a test service
        console.log('3. Creating test service...');
        const serviceResponse = await makeAuthRequest('POST', '/services', testService);
        testServiceId = serviceResponse.data.service.id;
        testQuote.items[0].service_id = testServiceId;
        console.log('✅ Service created\n');

        // 4. Create a quote
        console.log('4. Creating test quote...');
        const quoteResponse = await makeAuthRequest('POST', '/quotes', testQuote);
        testQuoteId = quoteResponse.data.quote.id;
        console.log('✅ Quote created with ID:', testQuoteId, '\n');

        // 5. Get all quotes (should include the one we just created)
        console.log('5. Testing get all quotes...');
        const allQuotesResponse = await makeAuthRequest('GET', '/quotes');
        console.log('✅ Found', allQuotesResponse.data.count, 'quotes');
        console.log('   Quote status:', allQuotesResponse.data.quotes[0].status, '\n');

        // 6. Get quotes filtered by status
        console.log('6. Testing get quotes by status (draft)...');
        const draftQuotesResponse = await makeAuthRequest('GET', '/quotes?status=draft');
        console.log('✅ Found', draftQuotesResponse.data.count, 'draft quotes\n');

        // 7. Get specific quote by ID
        console.log('7. Testing get quote by ID...');
        const specificQuoteResponse = await makeAuthRequest('GET', `/quotes/${testQuoteId}`);
        console.log('✅ Quote retrieved:', specificQuoteResponse.data.quote.quote_number);
        console.log('   Items count:', specificQuoteResponse.data.quote.items.length, '\n');

        // 8. Update quote status to 'sent'
        console.log('8. Testing update quote status to "sent"...');
        const updateStatusResponse = await makeAuthRequest('PATCH', `/quotes/${testQuoteId}/status`, {
            status: 'sent'
        });
        console.log('✅ Quote status updated to:', updateStatusResponse.data.quote.status, '\n');

        // 9. Try to update to invalid status (should fail)
        console.log('9. Testing invalid status update...');
        try {
            await makeAuthRequest('PATCH', `/quotes/${testQuoteId}/status`, {
                status: 'invalid_status'
            });
            console.log('❌ Should have failed with invalid status');
        } catch (error) {
            console.log('✅ Correctly rejected invalid status:', error.response.data.error, '\n');
        }

        // 10. Update status to 'approved'
        console.log('10. Testing update quote status to "approved"...');
        const approveResponse = await makeAuthRequest('PATCH', `/quotes/${testQuoteId}/status`, {
            status: 'approved'
        });
        console.log('✅ Quote status updated to:', approveResponse.data.quote.status, '\n');

        // 11. Try to delete approved quote (should fail)
        console.log('11. Testing delete approved quote (should fail)...');
        try {
            await makeAuthRequest('DELETE', `/quotes/${testQuoteId}`);
            console.log('❌ Should have failed - cannot delete approved quote');
        } catch (error) {
            console.log('✅ Correctly prevented deletion of approved quote:', error.response.data.error, '\n');
        }

        // 12. Create another quote for deletion test
        console.log('12. Creating another quote for deletion test...');
        const deleteQuoteResponse = await makeAuthRequest('POST', '/quotes', testQuote);
        const deleteQuoteId = deleteQuoteResponse.data.quote.id;
        console.log('✅ Quote created for deletion test:', deleteQuoteId, '\n');

        // 13. Delete the draft quote
        console.log('13. Testing delete draft quote...');
        const deleteResponse = await makeAuthRequest('DELETE', `/quotes/${deleteQuoteId}`);
        console.log('✅ Quote deleted successfully:', deleteResponse.data.message, '\n');

        // 14. Verify quote is deleted
        console.log('14. Verifying quote is deleted...');
        try {
            await makeAuthRequest('GET', `/quotes/${deleteQuoteId}`);
            console.log('❌ Quote should not exist');
        } catch (error) {
            console.log('✅ Quote correctly deleted (404 error):', error.response.data.error, '\n');
        }

        console.log('🎉 All quote management tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the tests
runTests(); 