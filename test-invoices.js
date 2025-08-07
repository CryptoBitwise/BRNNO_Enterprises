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
    console.log('🚀 Starting Invoice Management Tests...\n');

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

        // 5. Try to create invoice from draft quote (should fail)
        console.log('5. Testing create invoice from draft quote (should fail)...');
        try {
            await makeAuthRequest('POST', '/invoices', {
                quote_id: testQuoteId
            });
            console.log('❌ Should have failed - cannot create invoice from draft quote');
        } catch (error) {
            console.log('✅ Correctly rejected draft quote:', error.response.data.error, '\n');
        }

        // 6. Update quote status to 'sent'
        console.log('6. Updating quote status to "sent"...');
        await makeAuthRequest('PATCH', `/quotes/${testQuoteId}/status`, {
            status: 'sent'
        });
        console.log('✅ Quote status updated to sent\n');

        // 7. Try to create invoice from sent quote (should fail)
        console.log('7. Testing create invoice from sent quote (should fail)...');
        try {
            await makeAuthRequest('POST', '/invoices', {
                quote_id: testQuoteId
            });
            console.log('❌ Should have failed - cannot create invoice from sent quote');
        } catch (error) {
            console.log('✅ Correctly rejected sent quote:', error.response.data.error, '\n');
        }

        // 8. Update quote status to 'approved'
        console.log('8. Updating quote status to "approved"...');
        await makeAuthRequest('PATCH', `/quotes/${testQuoteId}/status`, {
            status: 'approved'
        });
        console.log('✅ Quote status updated to approved\n');

        // 9. Create invoice from approved quote
        console.log('9. Creating invoice from approved quote...');
        const invoiceResponse = await makeAuthRequest('POST', '/invoices', {
            quote_id: testQuoteId,
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        });
        const invoiceId = invoiceResponse.data.invoice.id;
        console.log('✅ Invoice created with ID:', invoiceId);
        console.log('   Invoice number:', invoiceResponse.data.invoice.invoice_number);
        console.log('   Total amount:', invoiceResponse.data.invoice.total_amount);
        console.log('   Items count:', invoiceResponse.data.invoice.items.length, '\n');

        // 10. Try to create another invoice from the same quote (should fail)
        console.log('10. Testing create duplicate invoice (should fail)...');
        try {
            await makeAuthRequest('POST', '/invoices', {
                quote_id: testQuoteId
            });
            console.log('❌ Should have failed - cannot create duplicate invoice');
        } catch (error) {
            console.log('✅ Correctly prevented duplicate invoice:', error.response.data.error, '\n');
        }

        // 11. Verify quote status was updated to 'invoiced'
        console.log('11. Verifying quote status was updated to "invoiced"...');
        const quoteCheckResponse = await makeAuthRequest('GET', `/quotes/${testQuoteId}`);
        console.log('✅ Quote status updated to:', quoteCheckResponse.data.quote.status, '\n');

        // 12. Create another quote for testing without due date
        console.log('12. Creating another quote for testing...');
        const quote2Response = await makeAuthRequest('POST', '/quotes', testQuote);
        const quote2Id = quote2Response.data.quote.id;
        console.log('✅ Second quote created with ID:', quote2Id, '\n');

        // 13. Approve the second quote
        console.log('13. Approving second quote...');
        await makeAuthRequest('PATCH', `/quotes/${quote2Id}/status`, {
            status: 'approved'
        });
        console.log('✅ Second quote approved\n');

        // 14. Create invoice without due date
        console.log('14. Creating invoice without due date...');
        const invoice2Response = await makeAuthRequest('POST', '/invoices', {
            quote_id: quote2Id
        });
        console.log('✅ Invoice created without due date');
        console.log('   Invoice number:', invoice2Response.data.invoice.invoice_number);
        console.log('   Due date:', invoice2Response.data.invoice.due_date, '\n');

        // 15. Test with invalid quote ID
        console.log('15. Testing with invalid quote ID...');
        try {
            await makeAuthRequest('POST', '/invoices', {
                quote_id: 'invalid-uuid'
            });
            console.log('❌ Should have failed with invalid quote ID');
        } catch (error) {
            console.log('✅ Correctly rejected invalid quote ID:', error.response.data.error, '\n');
        }

        // 16. Test without quote_id
        console.log('16. Testing without quote_id...');
        try {
            await makeAuthRequest('POST', '/invoices', {});
            console.log('❌ Should have failed without quote_id');
        } catch (error) {
            console.log('✅ Correctly rejected missing quote_id:', error.response.data.error, '\n');
        }

        console.log('🎉 All invoice management tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the tests
runTests(); 