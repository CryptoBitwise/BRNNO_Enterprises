# BRNNO API Service Management Testing Guide

This guide will help you test the complete service management system using Postman, Insomnia, or curl commands.

## 🧪 Testing the Complete Service Management Flow

### Prerequisites
- Your BRNNO API server is running on `http://localhost:3001`
- You have a database set up with the users and services tables
- You have a valid JWT token from logging in (see `TESTING_GUIDE.md`)

---

## 📋 Test Steps

### 1. CREATE a New Service

**Method:** POST  
**URL:** `http://localhost:3001/api/v1/services`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**
```json
{
  "name": "Full Detail Package",
  "description": "Complete interior and exterior detailing including wash, wax, and interior cleaning",
  "price": 149.99,
  "duration_minutes": 180
}
```

**Expected Response (201 Created):**
```json
{
  "message": "Service created successfully",
  "service": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Full Detail Package",
    "description": "Complete interior and exterior detailing including wash, wax, and interior cleaning",
    "price": 149.99,
    "duration_minutes": 180,
    "created_at": "2025-08-06T02:44:04.787Z",
    "updated_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

### 2. GET All Services

**Method:** GET  
**URL:** `http://localhost:3001/api/v1/services`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Expected Response (200 OK):**
```json
{
  "message": "Services retrieved successfully",
  "services": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Full Detail Package",
      "description": "Complete interior and exterior detailing including wash, wax, and interior cleaning",
      "price": 149.99,
      "duration_minutes": 180,
      "created_at": "2025-08-06T02:44:04.787Z",
      "updated_at": "2025-08-06T02:44:04.787Z"
    }
  ],
  "count": 1
}
```

---

### 3. GET a Specific Service

**Method:** GET  
**URL:** `http://localhost:3001/api/v1/services/550e8400-e29b-41d4-a716-446655440000`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Expected Response (200 OK):**
```json
{
  "message": "Service retrieved successfully",
  "service": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Full Detail Package",
    "description": "Complete interior and exterior detailing including wash, wax, and interior cleaning",
    "price": 149.99,
    "duration_minutes": 180,
    "created_at": "2025-08-06T02:44:04.787Z",
    "updated_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

### 4. UPDATE a Service

**Method:** PUT  
**URL:** `http://localhost:3001/api/v1/services/550e8400-e29b-41d4-a716-446655440000`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**
```json
{
  "name": "Premium Full Detail Package",
  "description": "Complete interior and exterior detailing including wash, wax, interior cleaning, and paint protection",
  "price": 199.99,
  "duration_minutes": 240
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Service updated successfully",
  "service": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Premium Full Detail Package",
    "description": "Complete interior and exterior detailing including wash, wax, interior cleaning, and paint protection",
    "price": 199.99,
    "duration_minutes": 240,
    "created_at": "2025-08-06T02:44:04.787Z",
    "updated_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

### 5. DELETE a Service

**Method:** DELETE  
**URL:** `http://localhost:3001/api/v1/services/550e8400-e29b-41d4-a716-446655440000`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Expected Response (200 OK):**
```json
{
  "message": "Service deleted successfully"
}
```

---

## 🛠️ Testing with Different Tools

### Using Postman

1. **Set up environment variables:**
   - `base_url`: `http://localhost:3001`
   - `token`: Your JWT token from login
   - `service_id`: (will be set after creating a service)

2. **Create requests for each endpoint above**
3. **Use the "Authorization" tab** with "Bearer Token" type
4. **Use environment variables** like `{{base_url}}/api/v1/services`

### Using Insomnia

1. **Set up environment variables** similar to Postman
2. **Create requests** for each endpoint
3. **Use the "Auth" tab** with "Bearer Token" type

### Using curl (Command Line)

```bash
# 1. Create a service
curl -X POST http://localhost:3001/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Full Detail Package",
    "description": "Complete interior and exterior detailing",
    "price": 149.99,
    "duration_minutes": 180
  }'

# 2. Get all services
curl -X GET http://localhost:3001/api/v1/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Get specific service (replace SERVICE_ID)
curl -X GET http://localhost:3001/api/v1/services/SERVICE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Update service (replace SERVICE_ID)
curl -X PUT http://localhost:3001/api/v1/services/SERVICE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Premium Full Detail Package",
    "price": 199.99
  }'

# 5. Delete service (replace SERVICE_ID)
curl -X DELETE http://localhost:3001/api/v1/services/SERVICE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔍 Validation Testing

### Test Required Fields

Try creating a service without required fields:

```bash
# Missing name
curl -X POST http://localhost:3001/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Complete detailing",
    "price": 149.99
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Service name is required"
}
```

### Test Price Validation

```bash
# Negative price
curl -X POST http://localhost:3001/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Service",
    "price": -50.00
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Price must be a positive number"
}
```

### Test Duration Validation

```bash
# Invalid duration
curl -X POST http://localhost:3001/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Service",
    "price": 100.00,
    "duration_minutes": -30
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Duration must be a positive number"
}
```

---

## 🔍 Security Testing

### Test Without Authentication

Try accessing any service endpoint without the `Authorization` header:

```bash
curl -X GET http://localhost:3001/api/v1/services
```

**Expected Response (401 Unauthorized):**
```json
{
  "error": "Access token required"
}
```

### Test with Invalid Token

Try accessing with an invalid token:

```bash
curl -X GET http://localhost:3001/api/v1/services \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response (403 Forbidden):**
```json
{
  "error": "Invalid or expired token"
}
```

---

## 🔍 Troubleshooting

### Common Issues:

1. **"Access token required"**
   - Make sure you're including the `Authorization` header
   - Ensure the token format is `Bearer YOUR_TOKEN`

2. **"Service not found or access denied"**
   - The service ID might be incorrect
   - The service might belong to a different user
   - The service might have been deleted

3. **"Service name is required"**
   - Make sure you're sending the `name` field in the request body
   - Check that the JSON is properly formatted

4. **"Service price is required"**
   - Make sure you're sending the `price` field in the request body
   - Price must be a number, not a string

5. **"Price must be a positive number"**
   - Ensure the price is a number (not a string)
   - Ensure the price is greater than or equal to 0

6. **"Duration must be a positive number"**
   - Ensure duration_minutes is a number (not a string)
   - Ensure duration_minutes is greater than 0

7. **"User not authenticated"**
   - Your JWT token might have expired (tokens expire after 8 hours)
   - Try logging in again to get a fresh token

---

## ✅ Success Criteria

Your service management system is working correctly if:

1. ✅ You can create services with authentication (201 response)
2. ✅ You can retrieve all services for the authenticated user (200 response)
3. ✅ You can retrieve specific services by ID (200 response)
4. ✅ You can update services (200 response)
5. ✅ You can delete services (200 response)
6. ✅ All endpoints reject requests without authentication (401 response)
7. ✅ Users can only access their own services (proper isolation)
8. ✅ Required field validation works (400 responses)
9. ✅ Price and duration validation works (400 responses)

---

## 🎯 Next Steps

Once testing is complete, you can:

1. **Add service categories/tags**
2. **Implement service search functionality**
3. **Add service availability scheduling**
4. **Create service packages/bundles**
5. **Add service reviews and ratings**
6. **Implement service analytics and reporting**

Your BRNNO API service management system is now complete and secure! 🎯 