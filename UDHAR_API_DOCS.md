# Udhar Transactions API Documentation

Complete CRUD operations for managing shopkeeper credit/debt transactions.

## Base URL
`/api/udhar/transactions`

---

## Endpoints

### 1. CREATE Transaction (POST)
**Endpoint:** `POST /api/udhar/transactions`

**Request Body:**
```json
{
  "customerId": "string (required)",
  "type": "purchase | payment (required)",
  "amount": "number (required)",
  "paidAmount": "number (optional, for purchases)",
  "description": "string (required)",
  "items": [
    {
      "name": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "paymentMethod": "cash | upi | card | other (optional, for payments)",
  "dueDate": "ISO date string (optional, for purchases)"
}
```

**Response:** `201 Created`
```json
{
  "_id": "string",
  "userId": "string",
  "customerId": "string",
  "type": "purchase | payment",
  "amount": "number",
  "paidAmount": "number",
  "description": "string",
  "items": [...],
  "paymentMethod": "string",
  "status": "completed | pending",
  "remainingAmount": "number",
  "dueDate": "date",
  "date": "date",
  "createdAt": "date"
}
```

---

### 2. GET All Transactions (GET)
**Endpoint:** `GET /api/udhar/transactions`

**Query Parameters:**
- `customerId` (optional) - Filter by specific customer

**Response:** `200 OK`
```json
[
  {
    "_id": "string",
    "type": "purchase | payment",
    "amount": "number",
    "paidAmount": "number",
    "description": "string",
    "items": [...],
    "paymentMethod": "string",
    "status": "completed | pending",
    "remainingAmount": "number",
    "dueDate": "date",
    "date": "date",
    "customerId": { ... }
  }
]
```

---

### 3. GET Single Transaction (GET)
**Endpoint:** `GET /api/udhar/transactions/[id]`

**Response:** `200 OK`
```json
{
  "_id": "string",
  "userId": "string",
  "customerId": { ... },
  "type": "purchase | payment",
  "amount": "number",
  "paidAmount": "number",
  "description": "string",
  "items": [...],
  "paymentMethod": "string",
  "status": "completed | pending",
  "remainingAmount": "number",
  "dueDate": "date",
  "date": "date",
  "createdAt": "date"
}
```

---

### 4. UPDATE Transaction (PUT)
**Endpoint:** `PUT /api/udhar/transactions/[id]`

**Request Body:**
```json
{
  "amount": "number (required)",
  "paidAmount": "number (optional)",
  "description": "string (required)",
  "items": [
    {
      "name": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "paymentMethod": "cash | upi | card | other (optional)",
  "dueDate": "ISO date string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "transaction": { ... }
}
```

**Notes:**
- Automatically recalculates `remainingAmount` and `status` for purchases
- Updates customer's `totalOutstanding` balance
- Reverses old transaction and applies new values

---

### 5. DELETE Transaction (DELETE)
**Endpoint:** `DELETE /api/udhar/transactions/[id]`

**Response:** `200 OK`
```json
{
  "message": "Transaction deleted"
}
```

**Notes:**
- Automatically reverses the transaction from customer's `totalOutstanding`
- Permanently deletes the transaction record

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found
```json
{
  "error": "Transaction not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to [operation] transaction"
}
```

---

## Features

✅ **Complete CRUD Operations**
- Create new transactions (purchases/payments)
- Read all transactions or filter by customer
- Read single transaction by ID
- Update existing transactions
- Delete transactions

✅ **Automatic Calculations**
- Remaining amount for purchases
- Transaction status (completed/pending)
- Customer outstanding balance updates

✅ **Optional Fields**
- Items list for purchases
- Payment method for payments
- Due date for purchases
- Paid amount for purchases

✅ **Data Integrity**
- Customer balance automatically updated on create/update/delete
- Transaction reversal on updates and deletes
- User authorization on all endpoints

---

## Usage Examples

### Create a Purchase
```javascript
const response = await fetch('/api/udhar/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: '123',
    type: 'purchase',
    amount: 500,
    paidAmount: 100,
    description: 'Groceries',
    dueDate: '2024-12-31',
    items: [
      { name: 'Rice', quantity: 2, price: 200 },
      { name: 'Oil', quantity: 1, price: 300 }
    ]
  })
});
```

### Get Customer Transactions
```javascript
const response = await fetch('/api/udhar/transactions?customerId=123');
const transactions = await response.json();
```

### Update Transaction
```javascript
const response = await fetch('/api/udhar/transactions/txn123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 600,
    paidAmount: 200,
    description: 'Updated groceries',
    dueDate: '2024-12-25'
  })
});
```

### Delete Transaction
```javascript
const response = await fetch('/api/udhar/transactions/txn123', {
  method: 'DELETE'
});
```
