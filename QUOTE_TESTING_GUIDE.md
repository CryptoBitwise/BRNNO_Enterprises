# Quote Management Testing Guide

This guide covers testing the complete quote management functionality in the BRNNO API.

## Overview

The quote management system allows detailers to:

- Create quotes with multiple line items
- Retrieve quotes with optional status filtering
- Update quote status through the sales pipeline
- Delete draft quotes
- View detailed quote information with client and service details

## API Endpoints

### 1. Create Quote

- **POST** `/api/v1/quotes`
- **Authentication**: Required
- **Description**: Creates a new quote with items for a client

**Request Body:**

```json
{
  "client_id": "uuid",
  "items": [
    {
      "service_id": "uuid",
      "description": "Full exterior wash and wax",
      "unit_price": 149.99,
      "quantity": 1
    }
  ],
  "issued_at": "2024-01-15T10:00:00Z",
  "expires_at": "2024-01-29T10:00:00Z"
}
```

**Response:**

```json
{
  "message": "Quote created successfully",
  "quote": {
    "id": "uuid",
    "quote_number": "Q-1705310400000-123",
    "client_id": "uuid",
    "status": "draft",
    "total_amount": 149.99,
    "issued_at": "2024-01-15T10:00:00Z",
    "expires_at": "2024-01-29T10:00:00Z",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z",
    "items": [...]
  }
}
```

### 2. Get All Quotes

- **GET** `/api/v1/quotes`
- **Authentication**: Required
- **Description**: Retrieves all quotes for the authenticated user

**Query Parameters:**

- `status` (optional): Filter quotes by status (`draft`, `sent`, `approved`, `declined`)

**Examples:**

- `GET /api/v1/quotes` - Get all quotes
- `GET /api/v1/quotes?status=approved` - Get only approved quotes

**Response:**

```json
{
  "message": "Quotes retrieved successfully",
  "quotes": [
    {
      "id": "uuid",
      "quote_number": "Q-1705310400000-123",
      "client_id": "uuid",
      "client_name": "John Doe",
      "client_email": "john@example.com",
      "status": "draft",
      "total_amount": 149.99,
      "item_count": 2,
      "issued_at": "2024-01-15T10:00:00Z",
      "expires_at": "2024-01-29T10:00:00Z",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 1
}
```

### 3. Get Quote by ID

- **GET** `/api/v1/quotes/:id`
- **Authentication**: Required
- **Description**: Retrieves a specific quote with all its items and client details

**Response:**

```json
{
  "message": "Quote retrieved successfully",
  "quote": {
    "id": "uuid",
    "quote_number": "Q-1705310400000-123",
    "client_id": "uuid",
    "client_name": "John Doe",
    "client_email": "john@example.com",
    "status": "draft",
    "total_amount": 149.99,
    "issued_at": "2024-01-15T10:00:00Z",
    "expires_at": "2024-01-29T10:00:00Z",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z",
    "items": [
      {
        "id": "uuid",
        "service_id": "uuid",
        "service_name": "Exterior Wash",
        "description": "Full exterior wash and wax",
        "unit_price": 149.99,
        "quantity": 1,
        "line_total": 149.99
      }
    ]
  }
}
```

### 4. Update Quote Status

- **PATCH** `/api/v1/quotes/:id/status`
- **Authentication**: Required
- **Description**: Updates the status of a quote through the sales pipeline

**Request Body:**

```json
{
  "status": "sent"
}
```

**Valid Status Values:**

- `draft` - Initial state when quote is created
- `sent` - Quote has been sent to client
- `approved` - Client has approved the quote
- `declined` - Client has declined the quote

**Response:**

```json
{
  "message": "Quote status updated successfully",
  "quote": {
    "id": "uuid",
    "quote_number": "Q-1705310400000-123",
    "client_id": "uuid",
    "status": "sent",
    "total_amount": 149.99,
    "issued_at": "2024-01-15T10:00:00Z",
    "expires_at": "2024-01-29T10:00:00Z",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

### 5. Delete Quote

- **DELETE** `/api/v1/quotes/:id`
- **Authentication**: Required
- **Description**: Deletes a quote (only allowed for draft status)

**Response:**

```json
{
  "message": "Quote deleted successfully"
}
```

## Quote Status Workflow

The quote management system follows this workflow:

1. **Draft** - Quote is created and can be edited
2. **Sent** - Quote has been sent to the client
3. **Approved** - Client has approved the quote
4. **Declined** - Client has declined the quote

**Business Rules:**

- Only draft quotes can be deleted
- Status can be updated to any valid status
- All quotes belong to the authenticated user
- Quote items are automatically deleted when the quote is deleted

## Testing Scenarios

### 1. Complete Quote Lifecycle

1. Create a quote (status: draft)
2. Update status to 'sent'
3. Update status to 'approved'
4. Verify quote cannot be deleted when approved

### 2. Status Filtering

1. Create multiple quotes with different statuses
2. Test filtering by each status
3. Verify only quotes with matching status are returned

### 3. Validation Testing

1. Try to create quote without required fields
2. Try to update status with invalid value
3. Try to delete non-draft quote
4. Try to access quote that doesn't belong to user

### 4. Error Handling

1. Test with invalid UUIDs
2. Test with missing authentication
3. Test with non-existent resources

## Running Tests

Use the provided test file to verify all functionality:

```bash
node test-quotes.js
```

This will test:

- User authentication
- Client and service creation
- Quote creation with items
- Quote retrieval and filtering
- Status updates
- Quote deletion
- Error scenarios

## Database Schema

The quote system uses two main tables:

### quotes

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `client_id` (UUID, Foreign Key to clients)
- `quote_number` (VARCHAR, Unique)
- `status` (VARCHAR, Default: 'draft')
- `total_amount` (DECIMAL)
- `issued_at` (TIMESTAMPTZ)
- `expires_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### quote_items

- `id` (UUID, Primary Key)
- `quote_id` (UUID, Foreign Key to quotes)
- `service_id` (UUID, Foreign Key to services)
- `description` (TEXT)
- `unit_price` (DECIMAL)
- `quantity` (INTEGER)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Security Features

- All endpoints require authentication
- Users can only access their own quotes
- Quote deletion is restricted to draft status
- Input validation for all fields
- SQL injection protection through parameterized queries
- Transaction safety for quote creation and deletion
