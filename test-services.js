// Test script for BRNNO API Service Management
// Run with: node test-services.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const USERS_URL = `${BASE_URL}/api/v1/users`;
const SERVICES_URL = `${BASE_URL}/api/v1/services`;

async function testServiceManagement() {
  console.log('🧪 Testing BRNNO API Service Management...\n');

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
        email: 'servicetest@brnno.com',
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
        email: 'servicetest@brnno.com',
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

    // Step 3: Create a new service
    console.log('3️⃣ Creating a new service...');
    const createServiceResponse = await fetch(`${SERVICES_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: 'Full Detail Package',
        description: 'Complete interior and exterior detailing including wash, wax, and interior cleaning',
        price: 149.99,
        duration_minutes: 180
      })
    });

    const createServiceData = await createServiceResponse.json();
    console.log('Create service response:', createServiceData);
    
    let serviceId = '';
    if (createServiceData.service && createServiceData.service.id) {
      serviceId = createServiceData.service.id;
      console.log('✅ Service created with ID:', serviceId);
    } else {
      console.error('❌ Failed to create service');
      return;
    }
    console.log('');

    // Step 4: Get all services
    console.log('4️⃣ Getting all services...');
    const getServicesResponse = await fetch(`${SERVICES_URL}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });

    const getServicesData = await getServicesResponse.json();
    console.log('Get services response:', getServicesData);
    console.log('');

    // Step 5: Get specific service
    console.log('5️⃣ Getting specific service...');
    const getServiceResponse = await fetch(`${SERVICES_URL}/${serviceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });

    const getServiceData = await getServiceResponse.json();
    console.log('Get specific service response:', getServiceData);
    console.log('');

    // Step 6: Update service
    console.log('6️⃣ Updating service...');
    const updateServiceResponse = await fetch(`${SERVICES_URL}/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: 'Premium Full Detail Package',
        description: 'Complete interior and exterior detailing including wash, wax, interior cleaning, and paint protection',
        price: 199.99,
        duration_minutes: 240
      })
    });

    const updateServiceData = await updateServiceResponse.json();
    console.log('Update service response:', updateServiceData);
    console.log('');

    // Step 7: Test validation (missing required field)
    console.log('7️⃣ Testing validation (missing name)...');
    const validationResponse = await fetch(`${SERVICES_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        description: 'Test service without name',
        price: 100.00
      })
    });

    const validationData = await validationResponse.json();
    console.log('Validation response:', validationData);
    console.log('');

    // Step 8: Test without authentication (should fail)
    console.log('8️⃣ Testing without authentication (should fail)...');
    const noAuthResponse = await fetch(`${SERVICES_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const noAuthData = await noAuthResponse.json();
    console.log('No auth response:', noAuthData);
    console.log('');

    // Step 9: Delete service
    console.log('9️⃣ Deleting service...');
    const deleteServiceResponse = await fetch(`${SERVICES_URL}/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });

    const deleteServiceData = await deleteServiceResponse.json();
    console.log('Delete service response:', deleteServiceData);
    console.log('');

    console.log('🎉 All service management tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testServiceManagement(); 