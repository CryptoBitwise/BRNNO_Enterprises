# BRNNO API Authentication Testing Guide

This guide will help you test the complete authentication system using Postman, Insomnia, or curl commands.

## 🧪 Testing the Complete Authentication Flow

### Prerequisites

- Your BRNNO API server is running on `http://localhost:3001`
- You have a database set up with the users table (run `database/schema.sql`)
- Your `.env` file has the correct `DATABASE_URL` and `JWT_SECRET`

---

## 📋 Test Steps

### 1. REGISTER a New User

**Method:** POST  
**URL:** `http://localhost:3001/api/v1/users/register`  
**Headers:** `Content-Type: application/json`  
**Body:**

```json
{
  "email": "test@brnno.com",
  "password": "testpassword123"
}
```

**Expected Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "test@brnno.com",
    "created_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

### 2. LOGIN with the Registered User

**Method:** POST  
**URL:** `http://localhost:3001/api/v1/users/login`  
**Headers:** `Content-Type: application/json`  
**Body:**

```json
{
  "email": "test@brnno.com",
  "password": "testpassword123"
}
```

**Expected Response (200 OK):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@brnno.com"
  }
}
```

**⚠️ Important:** Copy the entire `token` value for the next steps!

---

### 3. TEST Protected Route (FAIL) - No Token

**Method:** GET  
**URL:** `http://localhost:3001/api/v1/users/me`  
**Headers:** `Content-Type: application/json`  
**Body:** None

**Expected Response (401 Unauthorized):**

```json
{
  "error": "Access token required"
}
```

This proves the "security guard" is working! 🔒

---

### 4. TEST Protected Route (SUCCESS) - With Token

**Method:** GET  
**URL:** `http://localhost:3001/api/v1/users/me`  
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200 OK):**

```json
{
  "message": "Current user profile retrieved successfully",
  "user": {
    "id": 1,
    "email": "test@brnno.com",
    "created_at": "2025-08-06T02:44:04.787Z"
  }
}
```

---

## 🛠️ Testing with Different Tools

### Using Postman

1. **Create a new collection** called "BRNNO API Tests"
2. **Set up environment variables:**
   - `base_url`: `http://localhost:3001`
   - `token`: (leave empty initially)
3. **Create requests for each step above**
4. **For step 4:** Use the "Authorization" tab, select "Bearer Token", and paste your token

### Using Insomnia

1. **Create a new project** called "BRNNO API"
2. **Set up environment variables** similar to Postman
3. **Create requests** for each endpoint
4. **For authentication:** Use the "Auth" tab and select "Bearer Token"

### Using curl (Command Line)

```bash
# 1. Register
curl -X POST http://localhost:3001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brnno.com","password":"testpassword123"}'

# 2. Login (save the token)
curl -X POST http://localhost:3001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brnno.com","password":"testpassword123"}'

# 3. Test without token (should fail)
curl -X GET http://localhost:3001/api/v1/users/me

# 4. Test with token (should succeed)
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Automated Testing

You can also run the automated test script:

```bash
node test-auth.js
```

This will test the complete flow automatically and show you the results.

---

## 🔍 Troubleshooting

### Common Issues

1. **"Database connection error"**
   - Check your `DATABASE_URL` in `.env`
   - Make sure PostgreSQL is running
   - Verify the database exists

2. **"Access token required"**
   - This is expected when testing without a token
   - Make sure you're including the `Authorization` header with `Bearer` prefix

3. **"Invalid or expired token"**
   - Tokens expire after 8 hours
   - Make sure you're using the token from the login response
   - Check that the token format is correct

4. **"User not found"**
   - The user might have been deleted from the database
   - Try registering a new user first

---

## ✅ Success Criteria

Your authentication system is working correctly if:

1. ✅ Registration creates a new user (201 response)
2. ✅ Login returns a JWT token (200 response)
3. ✅ Protected routes reject requests without tokens (401 response)
4. ✅ Protected routes accept requests with valid tokens (200 response)
5. ✅ User data is returned without password hash

---

## 🎯 Next Steps

Once testing is complete, you can:

1. **Add more protected routes** using the `authenticateToken` middleware
2. **Implement user profile updates**
3. **Add password reset functionality**
4. **Create role-based access control**
5. **Add refresh tokens for better security**

Your BRNNO API authentication system is now complete and secure! 🔐
