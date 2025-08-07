# Invoice Management Testing Guide

This guide covers testing the invoice management functionality in the BRNNO API, specifically the conversion of approved quotes to invoices.

## Overview

The invoice management system allows detailers to:

- Convert approved quotes into invoices
- Generate unique invoice numbers automatically
- Track invoice status and payment information
- Maintain data integrity through database transactions
- Prevent duplicate invoice creation from the same quote

## API Endpoints

### Create Invoice from Quote

- **POST** `/api/v1/invoices`
- **Authentication**: Required
- **Description**: Converts an approved quote into an invoice

**Request Body:**

```json
{
  "quote_id": "uuid",
  "due_date": "2024-02-15T10:00:00Z"
}
```

**Parameters:**

- `quote_id` (required): The ID of the approved quote to convert
- `due_date` (optional): When the invoice payment is due

**Response:**

```json
{
  "message": "Invoice created successfully from quote",
  "invoice": {
    "id": "uuid",
    "invoice_number": "INV-1705310400000-123",
    "client_id": "uuid",
    "client_name": "John Doe",
    "client_email": "john@example.com",
    "quote_id": "uuid",
    "status": "unpaid",
    "total_amount": 200.00,
    "issued_date": "2024-01-15T10:00:00Z",
    "due_date": "2024-02-15T10:00:00Z",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z",
    "items": [
      {
        "id": "uuid",
        "description": "Full exterior wash and wax",
        "unit_price": 100.00,
        "quantity": 2,
        "line_total": 200.00
      }
    ]
  }
}
```

## Business Rules

### Quote-to-Invoice Conversion Rules

1. **Quote Status**: Only quotes with status 'approved' can be converted to invoices
2. **Quote Ownership**: Users can only convert their own quotes
3. **Duplicate Prevention**: Each quote can only be converted to one invoice
4. **Quote Items**: Quote must have at least one item to create an invoice
5. **Status Update**: Original quote status is updated to 'invoiced' after conversion

### Invoice Properties

- **Invoice Number**: Automatically generated (format: INV-timestamp-random)
- **Status**: Defaults to 'unpaid'
- **Issued Date**: Automatically set to current timestamp
- **Total Amount**: Copied from the original quote
- **Items**: All quote items are copied to invoice items

## Database Schema

### invoices

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `client_id` (UUID, Foreign Key to clients)
- `quote_id` (UUID, Foreign Key to quotes, nullable)
- `invoice_number` (VARCHAR, Unique)
- `status` (VARCHAR, Default: 'unpaid')
- `total_amount` (DECIMAL)
- `issued_date` (TIMESTAMPTZ, Default: now())
- `due_date` (TIMESTAMPTZ, nullable)
- `paid_at` (TIMESTAMPTZ, nullable)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### invoice_items

- `id` (UUID, Primary Key)
- `invoice_id` (UUID, Foreign Key to invoices)
- `description` (TEXT)
- `unit_price` (DECIMAL)
- `quantity` (INTEGER)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Testing Scenarios

### 1. Successful Invoice Creation

1. Create a quote with items
2. Update quote status to 'approved'
3. Create invoice from the approved quote
4. Verify invoice is created with correct data
5. Verify quote status is updated to 'invoiced'

### 2. Quote Status Validation

1. Try to create invoice from draft quote (should fail)
2. Try to create invoice from sent quote (should fail)
3. Try to create invoice from declined quote (should fail)
4. Create invoice from approved quote (should succeed)

### 3. Duplicate Prevention

1. Create invoice from approved quote
2. Try to create another invoice from the same quote (should fail)
3. Verify error message indicates duplicate prevention

### 4. Data Integrity

1. Verify all quote items are copied to invoice items
2. Verify total amounts match between quote and invoice
3. Verify client information is preserved
4. Verify invoice number is unique

### 5. Error Handling

1. Test with invalid quote ID
2. Test with non-existent quote ID
3. Test with quote that doesn't belong to user
4. Test without quote_id parameter
5. Test with quote that has no items

## Running Tests

Use the provided test file to verify all functionality:

```bash
node test-invoices.js
```

This will test:

- User authentication
- Quote creation and approval workflow
- Invoice creation from approved quotes
- Status validation and error handling
- Duplicate prevention
- Data integrity verification

## Workflow Example

### Complete Quote-to-Invoice Flow

1. **Create Quote**

   ```bash
   POST /api/v1/quotes
   {
     "client_id": "uuid",
     "items": [
       {
         "service_id": "uuid",
         "description": "Full detail service",
         "unit_price": 150.00,
         "quantity": 1
       }
     ]
   }
   ```

2. **Update Quote Status to Approved**

   ```bash
   PATCH /api/v1/quotes/{quote_id}/status
   {
     "status": "approved"
   }
   ```

3. **Create Invoice from Quote**

   ```bash
   POST /api/v1/invoices
   {
     "quote_id": "uuid",
     "due_date": "2024-02-15T10:00:00Z"
   }
   ```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Quote ID is required"
}
```

### 400 Bad Request - Invalid Status

```json
{
  "error": "Only approved quotes can be converted to invoices"
}
```

### 400 Bad Request - Duplicate Invoice

```json
{
  "error": "An invoice already exists for this quote"
}
```

### 400 Bad Request - No Items

```json
{
  "error": "Quote has no items to convert to invoice"
}
```

### 404 Not Found

```json
{
  "error": "Quote not found or access denied"
}
```

### 401 Unauthorized

```json
{
  "error": "User not authenticated"
}
```

## Security Features

- All endpoints require authentication
- Users can only convert their own quotes
- Input validation for all fields
- SQL injection protection through parameterized queries
- Transaction safety for invoice creation
- Automatic quote status update to prevent duplicate conversion

## Integration with Quote System

The invoice system integrates seamlessly with the quote management system:

- **Quote Status Flow**: draft → sent → approved → invoiced
- **Data Consistency**: Invoice data is copied from quote to ensure accuracy
- **Audit Trail**: Quote ID is preserved in invoice for tracking
- **Status Management**: Quote status prevents duplicate invoice creation

## Future Enhancements

Potential future features for the invoice system:

1. **Invoice Management**: Get, update, and delete invoices
2. **Payment Tracking**: Mark invoices as paid with payment date
3. **Invoice Status Updates**: Update invoice status (unpaid, paid, overdue)
4. **Invoice Templates**: Customizable invoice templates
5. **PDF Generation**: Generate PDF invoices for clients
6. **Email Integration**: Send invoices via email
7. **Payment Reminders**: Automated payment reminder system
8. **Invoice Analytics**: Payment tracking and reporting
