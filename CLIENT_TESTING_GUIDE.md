# BRNNO API Client Management Testing Guide

This guide will help you test the complete client management system using Postman, Insomnia, or curl commands.

## 🧪 Testing the Complete Client Management Flow

### Prerequisites
- Your BRNNO API server is running on `http://localhost:3001`
- You have a database set up with the users and clients tables
- You have a valid JWT token from logging in (see `TESTING_GUIDE.md`)

---

## 📋 Test Steps

### 1. CREATE a New Client

**Method:** POST  
**URL:** `http://localhost:3001/api/v1/clients`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "notes": "Major client for Q4 project"
}
```

**Expected Response (201 Created):**
```json
{
  "message": "Client created successfully",
  "client": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "notes": "Major client for Q4 project",
    "created_at": "2025-08-06T02:44:04.787Z",
    "updated_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

### 2. GET All Clients

**Method:** GET  
**URL:** `http://localhost:3001/api/v1/clients`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Expected Response (200 OK):**
```json
{
  "message": "Clients retrieved successfully",
  "clients": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "notes": "Major client for Q4 project",
      "created_at": "2025-08-06T02:44:04.787Z",
      "updated_at": "2025-08-06T02:44:04.787Z"
    }
  ],
  "count": 1
}
```

---

### 3. GET a Specific Client

**Method:** GET  
**URL:** `http://localhost:3001/api/v1/clients/550e8400-e29b-41d4-a716-446655440000`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Expected Response (200 OK):**
```json
{
  "message": "Client retrieved successfully",
  "client": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "notes": "Major client for Q4 project",
    "created_at": "2025-08-06T02:44:04.787Z",
    "updated_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

### 4. UPDATE a Client

**Method:** PUT  
**URL:** `http://localhost:3001/api/v1/clients/550e8400-e29b-41d4-a716-446655440000`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Body:**
```json
{
  "name": "Acme Corporation Ltd",
  "email": "info@acme.com",
  "phone": "+1-555-0124",
  "notes": "Major client for Q4 project - Updated contact info"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Client updated successfully",
  "client": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation Ltd",
    "email": "info@acme.com",
    "phone": "+1-555-0124",
    "notes": "Major client for Q4 project - Updated contact info",
    "created_at": "2025-08-06T02:44:04.787Z",
    "updated_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

### 5. DELETE a Client

**Method:** DELETE  
**URL:** `http://localhost:3001/api/v1/clients/550e8400-e29b-41d4-a716-446655440000`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_JWT_TOKEN`

**Expected Response (200 OK):**
```json
{
  "message": "Client deleted successfully"
}
```

---

## 🛠️ Testing with Different Tools

### Using Postman

1. **Set up environment variables:**
   - `base_url`: `http://localhost:3001`
   - `token`: Your JWT token from login
   - `client_id`: (will be set after creating a client)

2. **Create requests for each endpoint above**
3. **Use the "Authorization" tab** with "Bearer Token" type
4. **Use environment variables** like `{{base_url}}/api/v1/clients`

### Using Insomnia

1. **Set up environment variables** similar to Postman
2. **Create requests** for each endpoint
3. **Use the "Auth" tab** with "Bearer Token" type

### Using curl (Command Line)

```bash
# 1. Create a client
curl -X POST http://localhost:3001/api/v1/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "notes": "Major client for Q4 project"
  }'

# 2. Get all clients
curl -X GET http://localhost:3001/api/v1/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Get specific client (replace CLIENT_ID)
curl -X GET http://localhost:3001/api/v1/clients/CLIENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Update client (replace CLIENT_ID)
curl -X PUT http://localhost:3001/api/v1/clients/CLIENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Acme Corporation Ltd",
    "email": "info@acme.com"
  }'

# 5. Delete client (replace CLIENT_ID)
curl -X DELETE http://localhost:3001/api/v1/clients/CLIENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔍 Security Testing

### Test Without Authentication

Try accessing any client endpoint without the `Authorization` header:

```bash
curl -X GET http://localhost:3001/api/v1/clients
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
curl -X GET http://localhost:3001/api/v1/clients \
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

2. **"Client not found or access denied"**
   - The client ID might be incorrect
   - The client might belong to a different user
   - The client might have been deleted

3. **"Client name is required"**
   - Make sure you're sending the `name` field in the request body
   - Check that the JSON is properly formatted

4. **"User not authenticated"**
   - Your JWT token might have expired (tokens expire after 8 hours)
   - Try logging in again to get a fresh token

---

## ✅ Success Criteria

Your client management system is working correctly if:

1. ✅ You can create clients with authentication (201 response)
2. ✅ You can retrieve all clients for the authenticated user (200 response)
3. ✅ You can retrieve specific clients by ID (200 response)
4. ✅ You can update clients (200 response)
5. ✅ You can delete clients (200 response)
6. ✅ All endpoints reject requests without authentication (401 response)
7. ✅ Users can only access their own clients (proper isolation)

---

## 🎯 Next Steps

Once testing is complete, you can:

1. **Add client search functionality**
2. **Implement client categories/tags**
3. **Add client contact history**
4. **Create client import/export features**
5. **Add client analytics and reporting**

Your BRNNO API client management system is now complete and secure! 🎯 