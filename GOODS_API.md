# Goods API with Company Verification

This document describes the API endpoints for managing Goods with Company verification.

## Overview

The Goods system requires that all goods belong to a verified company. A company must be verified before goods can be created for it.

## Database Schema

### Companies Table
- `id` (UUID): Primary key
- `name` (TEXT): Company name
- `email` (TEXT): Company email (unique)
- `verified` (BOOLEAN): Verification status (default: false)
- `createdAt` (TIMESTAMP): Creation timestamp
- `updatedAt` (TIMESTAMP): Last update timestamp

### Goods Table
- `id` (UUID): Primary key
- `name` (TEXT): Product name
- `description` (TEXT): Product description (optional)
- `price` (NUMERIC(10,2)): Product price with 2 decimal places
- `companyId` (UUID): Foreign key to companies table
- `createdAt` (TIMESTAMP): Creation timestamp
- `updatedAt` (TIMESTAMP): Last update timestamp

## API Endpoints

### Companies

#### Create a Company
```
POST /api/companies
```

Request body:
```json
{
  "name": "Example Company",
  "email": "company@example.com",
  "verified": false
}
```

Response (201):
```json
{
  "data": {
    "id": "uuid",
    "name": "Example Company",
    "email": "company@example.com",
    "verified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Company created successfully"
}
```

#### Get All Companies
```
GET /api/companies
```

Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Example Company",
      "email": "company@example.com",
      "verified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Verify a Company
```
PATCH /api/companies/{id}/verify
```

Request body:
```json
{
  "verified": true
}
```

Response (200):
```json
{
  "data": {
    "id": "uuid",
    "name": "Example Company",
    "email": "company@example.com",
    "verified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Company verification status updated to true"
}
```

### Goods

#### Create Goods
```
POST /api/goods
```

Request body:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": "100.00",
  "companyId": "uuid"
}
```

**Important**: The company must be verified (`verified: true`) before goods can be created.

Response (201) - Success:
```json
{
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product Description",
    "price": "100.00",
    "companyId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Goods created successfully"
}
```

Response (403) - Company Not Verified:
```json
{
  "error": "Company must be verified before creating goods"
}
```

Response (404) - Company Not Found:
```json
{
  "error": "Company not found"
}
```

#### Get All Goods
```
GET /api/goods
```

Optional query parameter:
- `companyId`: Filter goods by company ID

Response (200):
```json
{
  "data": [
    {
      "goods": {
        "id": "uuid",
        "name": "Product Name",
        "description": "Product Description",
        "price": "100.00",
        "companyId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "company": {
        "id": "uuid",
        "name": "Example Company",
        "email": "company@example.com",
        "verified": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  ]
}
```

## Validation Rules

1. **Company Creation**: 
   - `name` and `email` are required fields
   - `email` must be unique

2. **Goods Creation**:
   - `name`, `price`, and `companyId` are required fields
   - The company must exist in the database
   - **The company must be verified** (`verified: true`) before goods can be created

3. **Company Verification**:
   - Only boolean values (`true` or `false`) are accepted for the `verified` field

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400`: Bad Request (missing required fields, invalid data)
- `403`: Forbidden (company not verified)
- `404`: Not Found (company or goods not found)
- `409`: Conflict (duplicate email)
- `500`: Internal Server Error

## Example Workflow

1. Create a company:
```bash
POST /api/companies
{
  "name": "My Company",
  "email": "contact@mycompany.com"
}
```

2. Verify the company:
```bash
PATCH /api/companies/{company-id}/verify
{
  "verified": true
}
```

3. Create goods for the verified company:
```bash
POST /api/goods
{
  "name": "My Product",
  "description": "A great product",
  "price": "99.99",
  "companyId": "{company-id}"
}
```

4. Query goods (optionally filtered by company):
```bash
GET /api/goods?companyId={company-id}
```
