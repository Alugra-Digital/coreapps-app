# API Mapping - Finance Module (from `src/finance/page.tsx`)

Dokumen ini merangkum struktur JSON untuk data dummy yang dipakai di halaman Finance:
- Revenue growth chart
- Account balances
- Expense breakdown
- Recent transactions
- Key finance metrics

## Base URL

`/api/v1/finance`

---

## 1) GET - Finance Overview

### Endpoint

`GET /api/v1/finance/overview`

### Params (Query)

```json
{
  "period": "monthly",
  "from": "2024-08-01",
  "to": "2024-02-29",
  "currency": "IDR",
  "include": "metrics,revenueGrowth,accountBalances,expenseBreakdown,recentTransactions"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Finance overview fetched successfully",
  "data": {
    "metrics": [
      {
        "key": "totalRevenue",
        "title": "Total Revenue",
        "value": 6640000000,
        "formattedValue": "Rp 6,64 M",
        "changePercent": 12.4,
        "trend": "up"
      },
      {
        "key": "operationalExpenses",
        "title": "Operational Expenses",
        "value": 1930000000,
        "formattedValue": "Rp 1,93 M",
        "changePercent": -2.1,
        "trend": "down"
      },
      {
        "key": "netProfit",
        "title": "Net Profit",
        "value": 4720000000,
        "formattedValue": "Rp 4,72 M",
        "changePercent": 15.8,
        "trend": "up"
      }
    ],
    "revenueGrowth": [
      { "month": "Aug", "value": 65000 },
      { "month": "Sep", "value": 78000 },
      { "month": "Oct", "value": 82000 },
      { "month": "Nov", "value": 95000, "active": true },
      { "month": "Dec", "value": 88000 },
      { "month": "Jan", "value": 92000 },
      { "month": "Feb", "value": 98000 }
    ],
    "accountBalances": [
      {
        "id": 1,
        "name": "Main Operations",
        "number": "Bank Central • 1290",
        "balance": 5310000000,
        "formattedBalance": "Rp 5,31 M"
      },
      {
        "id": 2,
        "name": "Payroll Savings",
        "number": "Federal Reserve • 8820",
        "balance": 1930000000,
        "formattedBalance": "Rp 1,93 M"
      }
    ],
    "expenseBreakdown": [
      { "name": "Operational", "value": 45, "color": "#3b82f6" },
      { "name": "Infrastructure", "value": 25, "color": "#10b981" },
      { "name": "Marketing", "value": 15, "color": "#ef4444" },
      { "name": "Payroll", "value": 10, "color": "#f59e0b" },
      { "name": "Other", "value": 5, "color": "#94a3b8" }
    ],
    "recentTransactions": [
      {
        "id": "TX-9012",
        "date": "2024-02-04",
        "entity": "PT. Alpha Indonesia",
        "category": "Consulting",
        "amount": 192200000,
        "formattedAmount": "Rp 192,2 jt",
        "type": "inbound",
        "status": "Completed"
      }
    ]
  },
  "meta": {
    "generatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

---

## 2) GET - Transaction List

### Endpoint

`GET /api/v1/finance/transactions`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "alpha",
  "type": "inbound",
  "status": "Completed",
  "category": "Consulting",
  "sortBy": "date",
  "sortOrder": "desc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Transactions fetched successfully",
  "data": [
    {
      "id": "TX-9012",
      "date": "2024-02-04",
      "entity": "PT. Alpha Indonesia",
      "category": "Consulting",
      "amount": 192200000,
      "formattedAmount": "Rp 192,2 jt",
      "type": "inbound",
      "status": "Completed"
    },
    {
      "id": "TX-9013",
      "date": "2024-02-03",
      "entity": "Global Logistics",
      "category": "Operation",
      "amount": 50400000,
      "formattedAmount": "Rp 50,4 jt",
      "type": "outbound",
      "status": "Pending"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 3) POST - Create Transaction

### Endpoint

`POST /api/v1/finance/transactions`

### Request Body

```json
{
  "date": "2024-02-05",
  "entity": "Karya Mandiri Corp",
  "category": "Tax Service",
  "amount": 116300000,
  "type": "inbound",
  "status": "Processing"
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "TX-9017",
    "date": "2024-02-05",
    "entity": "Karya Mandiri Corp",
    "category": "Tax Service",
    "amount": 116300000,
    "formattedAmount": "Rp 116,3 jt",
    "type": "inbound",
    "status": "Processing",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

---

## 4) PUT - Update Transaction

### Endpoint

`PUT /api/v1/finance/transactions/:transactionId`

### Params (Path)

```json
{
  "transactionId": "TX-9017"
}
```

### Request Body

```json
{
  "date": "2024-02-06",
  "entity": "Karya Mandiri Corp",
  "category": "Tax Service",
  "amount": 120000000,
  "type": "inbound",
  "status": "Completed"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": "TX-9017",
    "date": "2024-02-06",
    "entity": "Karya Mandiri Corp",
    "category": "Tax Service",
    "amount": 120000000,
    "formattedAmount": "Rp 120 jt",
    "type": "inbound",
    "status": "Completed",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

---

## 5) DELETE - Remove Transaction

### Endpoint

`DELETE /api/v1/finance/transactions/:transactionId`

### Params (Path)

```json
{
  "transactionId": "TX-9017"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "data": {
    "id": "TX-9017",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

---

## Enum Reference

```json
{
  "transactionType": ["inbound", "outbound"],
  "transactionStatus": ["Completed", "Pending", "Processing"],
  "trend": ["up", "down"]
}
```

---

# API Mapping - Invoice Module (from `src/invoice/page.tsx`)

Struktur ini mengikuti tipe di `src/invoice/types.ts` dan endpoint pada `src/api/invoices.ts`.

## Base URL

`/api/finance/invoices`

## Invoice Object (Core Schema)

```json
{
  "id": "inv_01JABCXYZ123",
  "companyInfo": {
    "letterhead": "PT. ERP Nusantara",
    "companyName": "PT. ERP Nusantara",
    "logoUrl": "https://cdn.example.com/logo.png",
    "address": "Jl. Jenderal Sudirman No. 10, Jakarta",
    "phone": "+62-21-555-1234"
  },
  "invoiceInfo": {
    "invoiceName": "Invoice Jasa Konsultasi Februari",
    "invoiceNumber": "INV-2024-0021",
    "invoiceDate": "2024-02-01",
    "taxInvoice": "010.000-24.12345678",
    "dueDate": "2024-02-15"
  },
  "billingInfo": {
    "companyName": "PT. Alpha Indonesia",
    "address": "Jl. Gatot Subroto No. 12, Jakarta",
    "phone": "+62-21-7000-2211",
    "pic": {
      "name": "Budi Santoso",
      "position": "Finance Manager",
      "contact": "+62-812-0000-2222"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "itemDescription": "Jasa Konsultasi Implementasi ERP",
      "quantity": 2,
      "unit": "bulan",
      "price": 45000000,
      "subtotal": 90000000,
      "dpp": 90000000,
      "taxRate": 11,
      "taxAmount": 9900000,
      "priceAfterTax": 99900000
    }
  ],
  "paymentInfo": {
    "bank": "BCA",
    "accountNumber": "1234567890",
    "branch": "KCU Sudirman",
    "accountName": "PT. ERP Nusantara",
    "npwp": "01.234.567.8-901.000"
  },
  "approval": {
    "position": "Director",
    "name": "Andi Pratama",
    "signatureUrl": "https://cdn.example.com/signature.png"
  },
  "notes": "Mohon pembayaran sebelum jatuh tempo.",
  "createdAt": "2026-02-22T00:00:00.000Z",
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```

## 1) GET - List Invoices

### Endpoint

`GET /api/finance/invoices`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "INV-2024",
  "client": "PT. Alpha Indonesia",
  "invoiceDateFrom": "2024-02-01",
  "invoiceDateTo": "2024-02-29",
  "dueDateFrom": "2024-02-01",
  "dueDateTo": "2024-03-31",
  "sortBy": "invoiceInfo.invoiceDate",
  "sortOrder": "desc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Invoices fetched successfully",
  "data": [
    {
      "id": "inv_01JABCXYZ123",
      "companyInfo": {
        "companyName": "PT. ERP Nusantara",
        "address": "Jl. Jenderal Sudirman No. 10, Jakarta",
        "phone": "+62-21-555-1234"
      },
      "invoiceInfo": {
        "invoiceName": "Invoice Jasa Konsultasi Februari",
        "invoiceNumber": "INV-2024-0021",
        "invoiceDate": "2024-02-01",
        "dueDate": "2024-02-15"
      },
      "billingInfo": {
        "companyName": "PT. Alpha Indonesia",
        "address": "Jl. Gatot Subroto No. 12, Jakarta",
        "phone": "+62-21-7000-2211",
        "pic": {
          "name": "Budi Santoso",
          "position": "Finance Manager"
        }
      },
      "lineItems": [
        {
          "number": 1,
          "itemDescription": "Jasa Konsultasi Implementasi ERP",
          "quantity": 2,
          "unit": "bulan",
          "price": 45000000,
          "subtotal": 90000000,
          "priceAfterTax": 99900000
        }
      ],
      "paymentInfo": {
        "bank": "BCA",
        "accountNumber": "1234567890",
        "branch": "KCU Sudirman",
        "accountName": "PT. ERP Nusantara"
      },
      "approval": {
        "position": "Director",
        "name": "Andi Pratama"
      },
      "notes": "Mohon pembayaran sebelum jatuh tempo.",
      "createdAt": "2026-02-22T00:00:00.000Z",
      "updatedAt": "2026-02-22T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## 2) GET - Invoice Detail

### Endpoint

`GET /api/finance/invoices/:id`

### Params (Path)

```json
{
  "id": "inv_01JABCXYZ123"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Invoice detail fetched successfully",
  "data": {
    "id": "inv_01JABCXYZ123",
    "companyInfo": {
      "letterhead": "PT. ERP Nusantara",
      "companyName": "PT. ERP Nusantara",
      "logoUrl": "https://cdn.example.com/logo.png",
      "address": "Jl. Jenderal Sudirman No. 10, Jakarta",
      "phone": "+62-21-555-1234"
    },
    "invoiceInfo": {
      "invoiceName": "Invoice Jasa Konsultasi Februari",
      "invoiceNumber": "INV-2024-0021",
      "invoiceDate": "2024-02-01",
      "taxInvoice": "010.000-24.12345678",
      "dueDate": "2024-02-15"
    },
    "billingInfo": {
      "companyName": "PT. Alpha Indonesia",
      "address": "Jl. Gatot Subroto No. 12, Jakarta",
      "phone": "+62-21-7000-2211",
      "pic": {
        "name": "Budi Santoso",
        "position": "Finance Manager",
        "contact": "+62-812-0000-2222"
      }
    },
    "lineItems": [
      {
        "number": 1,
        "itemDescription": "Jasa Konsultasi Implementasi ERP",
        "quantity": 2,
        "unit": "bulan",
        "price": 45000000,
        "subtotal": 90000000,
        "dpp": 90000000,
        "taxRate": 11,
        "taxAmount": 9900000,
        "priceAfterTax": 99900000
      }
    ],
    "paymentInfo": {
      "bank": "BCA",
      "accountNumber": "1234567890",
      "branch": "KCU Sudirman",
      "accountName": "PT. ERP Nusantara",
      "npwp": "01.234.567.8-901.000"
    },
    "approval": {
      "position": "Director",
      "name": "Andi Pratama",
      "signatureUrl": "https://cdn.example.com/signature.png"
    },
    "notes": "Mohon pembayaran sebelum jatuh tempo.",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 3) POST - Create Invoice

### Endpoint

`POST /api/finance/invoices`

### Request Body

```json
{
  "companyInfo": {
    "letterhead": "PT. ERP Nusantara",
    "companyName": "PT. ERP Nusantara",
    "logoUrl": "https://cdn.example.com/logo.png",
    "address": "Jl. Jenderal Sudirman No. 10, Jakarta",
    "phone": "+62-21-555-1234"
  },
  "invoiceInfo": {
    "invoiceName": "Invoice Jasa Konsultasi Februari",
    "invoiceNumber": "INV-2024-0021",
    "invoiceDate": "2024-02-01",
    "taxInvoice": "010.000-24.12345678",
    "dueDate": "2024-02-15"
  },
  "billingInfo": {
    "companyName": "PT. Alpha Indonesia",
    "address": "Jl. Gatot Subroto No. 12, Jakarta",
    "phone": "+62-21-7000-2211",
    "pic": {
      "name": "Budi Santoso",
      "position": "Finance Manager",
      "contact": "+62-812-0000-2222"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "itemDescription": "Jasa Konsultasi Implementasi ERP",
      "quantity": 2,
      "unit": "bulan",
      "price": 45000000,
      "subtotal": 90000000,
      "dpp": 90000000,
      "taxRate": 11,
      "taxAmount": 9900000,
      "priceAfterTax": 99900000
    }
  ],
  "paymentInfo": {
    "bank": "BCA",
    "accountNumber": "1234567890",
    "branch": "KCU Sudirman",
    "accountName": "PT. ERP Nusantara",
    "npwp": "01.234.567.8-901.000"
  },
  "approval": {
    "position": "Director",
    "name": "Andi Pratama",
    "signatureUrl": "https://cdn.example.com/signature.png"
  },
  "notes": "Mohon pembayaran sebelum jatuh tempo."
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "inv_01JABCXYZ123",
    "companyInfo": {
      "companyName": "PT. ERP Nusantara",
      "address": "Jl. Jenderal Sudirman No. 10, Jakarta",
      "phone": "+62-21-555-1234"
    },
    "invoiceInfo": {
      "invoiceName": "Invoice Jasa Konsultasi Februari",
      "invoiceNumber": "INV-2024-0021",
      "invoiceDate": "2024-02-01",
      "dueDate": "2024-02-15"
    },
    "billingInfo": {
      "companyName": "PT. Alpha Indonesia",
      "address": "Jl. Gatot Subroto No. 12, Jakarta",
      "phone": "+62-21-7000-2211",
      "pic": {
        "name": "Budi Santoso",
        "position": "Finance Manager"
      }
    },
    "lineItems": [
      {
        "number": 1,
        "itemDescription": "Jasa Konsultasi Implementasi ERP",
        "quantity": 2,
        "unit": "bulan",
        "price": 45000000,
        "subtotal": 90000000,
        "priceAfterTax": 99900000
      }
    ],
    "paymentInfo": {
      "bank": "BCA",
      "accountNumber": "1234567890",
      "branch": "KCU Sudirman",
      "accountName": "PT. ERP Nusantara"
    },
    "approval": {
      "position": "Director",
      "name": "Andi Pratama"
    },
    "notes": "Mohon pembayaran sebelum jatuh tempo.",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) PUT - Update Invoice

### Endpoint

`PUT /api/finance/invoices/:id`

### Params (Path)

```json
{
  "id": "inv_01JABCXYZ123"
}
```

### Request Body

```json
{
  "invoiceInfo": {
    "dueDate": "2024-02-20"
  },
  "billingInfo": {
    "pic": {
      "name": "Siti Ananda",
      "position": "Accounting Supervisor",
      "contact": "+62-813-3333-4444"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "itemDescription": "Jasa Konsultasi Implementasi ERP",
      "quantity": 2,
      "unit": "bulan",
      "price": 45000000,
      "subtotal": 90000000,
      "dpp": 90000000,
      "taxRate": 11,
      "taxAmount": 9900000,
      "priceAfterTax": 99900000
    },
    {
      "number": 2,
      "itemDescription": "Support Pasca Implementasi",
      "quantity": 1,
      "unit": "paket",
      "price": 15000000,
      "subtotal": 15000000,
      "dpp": 15000000,
      "taxRate": 11,
      "taxAmount": 1650000,
      "priceAfterTax": 16650000
    }
  ],
  "notes": "Due date diubah sesuai kesepakatan."
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Invoice updated successfully",
  "data": {
    "id": "inv_01JABCXYZ123",
    "invoiceInfo": {
      "invoiceNumber": "INV-2024-0021",
      "invoiceDate": "2024-02-01",
      "dueDate": "2024-02-20"
    },
    "billingInfo": {
      "companyName": "PT. Alpha Indonesia",
      "pic": {
        "name": "Siti Ananda",
        "position": "Accounting Supervisor",
        "contact": "+62-813-3333-4444"
      }
    },
    "lineItems": [
      {
        "number": 1,
        "itemDescription": "Jasa Konsultasi Implementasi ERP",
        "quantity": 2,
        "unit": "bulan",
        "priceAfterTax": 99900000
      },
      {
        "number": 2,
        "itemDescription": "Support Pasca Implementasi",
        "quantity": 1,
        "unit": "paket",
        "priceAfterTax": 16650000
      }
    ],
    "notes": "Due date diubah sesuai kesepakatan.",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) DELETE - Remove Invoice

### Endpoint

`DELETE /api/finance/invoices/:id`

### Params (Path)

```json
{
  "id": "inv_01JABCXYZ123"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Invoice deleted successfully",
  "data": {
    "id": "inv_01JABCXYZ123",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

---

# API Mapping - Payment Module (from `src/payment/page.tsx`)

Struktur ini mengikuti dummy data pada `src/payment/page.tsx` dan tipe card pada `src/payment/components/PaymentEntryCard.tsx`.

## Base URL

`/api/finance/payments`

## Payment Object (Core Schema)

```json
{
  "id": "PAY-9921",
  "source": "Bank Mandiri Transfer",
  "amount": 192200000,
  "formattedAmount": "Rp 192,2 jt",
  "date": "2024-02-22T10:45:00.000Z",
  "displayDate": "Today, 10:45 AM",
  "method": "Wire Transfer",
  "status": "Completed",
  "createdAt": "2026-02-22T00:00:00.000Z",
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```

## 1) GET - Payment Overview

### Endpoint

`GET /api/finance/payments/overview`

### Params (Query)

```json
{
  "month": 2,
  "year": 2024,
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Payment overview fetched successfully",
  "data": {
    "totalProcessed": {
      "value": 4410000000,
      "formattedValue": "Rp 4,41 M",
      "changePercent": 8.2,
      "trend": "up"
    },
    "pendingSettlement": {
      "value": 199000000,
      "formattedValue": "Rp 199 jt",
      "count": 3,
      "description": "03 items awaiting clearance"
    },
    "paymentFailures": {
      "ratePercent": 2.1,
      "formattedRate": "02.1%",
      "changePercent": -0.5,
      "trend": "down",
      "badge": "Healthy"
    },
    "topMethod": {
      "name": "Wire Transfer",
      "displayName": "Transfer",
      "volumePercent": 64,
      "description": "Wire Transfer (64% volume)"
    }
  }
}
```

## 2) GET - Payment List

### Endpoint

`GET /api/finance/payments`

### Params (Query)

```json
{
  "page": 1,
  "limit": 12,
  "search": "mandiri",
  "method": "Wire Transfer",
  "status": "Completed",
  "month": 2,
  "year": 2024,
  "sortBy": "date",
  "sortOrder": "desc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Payments fetched successfully",
  "data": [
    {
      "id": "PAY-9921",
      "source": "Bank Mandiri Transfer",
      "amount": 192200000,
      "formattedAmount": "Rp 192,2 jt",
      "date": "2024-02-22T10:45:00.000Z",
      "displayDate": "Today, 10:45 AM",
      "method": "Wire Transfer",
      "status": "Completed"
    },
    {
      "id": "PAY-9922",
      "source": "Corporate Visa XXXX-4211",
      "amount": 33300000,
      "formattedAmount": "Rp 33,3 jt",
      "date": "2024-02-22T09:12:00.000Z",
      "displayDate": "Today, 09:12 AM",
      "method": "Credit Card",
      "status": "Processing"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 6,
    "totalPages": 1
  }
}
```

## 3) GET - Payment Detail

### Endpoint

`GET /api/finance/payments/:id`

### Params (Path)

```json
{
  "id": "PAY-9921"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Payment detail fetched successfully",
  "data": {
    "id": "PAY-9921",
    "source": "Bank Mandiri Transfer",
    "amount": 192200000,
    "formattedAmount": "Rp 192,2 jt",
    "date": "2024-02-22T10:45:00.000Z",
    "displayDate": "Today, 10:45 AM",
    "method": "Wire Transfer",
    "status": "Completed",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) POST - Create Payment

### Endpoint

`POST /api/finance/payments`

### Request Body

```json
{
  "source": "DBS Treasury Account",
  "amount": 697500000,
  "date": "2024-02-01T09:30:00.000Z",
  "method": "Wire Transfer",
  "status": "Processing"
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": "PAY-9927",
    "source": "DBS Treasury Account",
    "amount": 697500000,
    "formattedAmount": "Rp 697,5 jt",
    "date": "2024-02-01T09:30:00.000Z",
    "displayDate": "Feb 01, 2024",
    "method": "Wire Transfer",
    "status": "Processing",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) PUT - Update Payment

### Endpoint

`PUT /api/finance/payments/:id`

### Params (Path)

```json
{
  "id": "PAY-9927"
}
```

### Request Body

```json
{
  "source": "DBS Treasury Account",
  "amount": 697500000,
  "date": "2024-02-01T09:30:00.000Z",
  "method": "Wire Transfer",
  "status": "Completed"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Payment updated successfully",
  "data": {
    "id": "PAY-9927",
    "source": "DBS Treasury Account",
    "amount": 697500000,
    "formattedAmount": "Rp 697,5 jt",
    "date": "2024-02-01T09:30:00.000Z",
    "displayDate": "Feb 01, 2024",
    "method": "Wire Transfer",
    "status": "Completed",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 6) DELETE - Remove Payment

### Endpoint

`DELETE /api/finance/payments/:id`

### Params (Path)

```json
{
  "id": "PAY-9927"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Payment deleted successfully",
  "data": {
    "id": "PAY-9927",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## Enum Reference (Payment)

```json
{
  "paymentMethod": ["Wire Transfer", "Credit Card", "Direct Debit"],
  "paymentStatus": ["Completed", "Processing", "Failed"],
  "trend": ["up", "down"]
}
```

---

# API Mapping - Purchase Order Module (from `src/finance/purchase-orders/page.tsx`)

Struktur ini mengikuti tipe di `src/finance/purchase-orders/types.ts`, data dummy di `src/finance/purchase-orders/data.ts`, dan endpoint pada `src/api/purchase-orders.ts`.

## Base URL

`/api/finance/purchase-orders`

## Purchase Order Object (Core Schema)

```json
{
  "id": "PO-001",
  "companyInfo": {
    "letterhead": "PT Rubbick Indonesia",
    "companyName": "PT Rubbick Indonesia",
    "logoUrl": "https://cdn.example.com/logo.png",
    "address": "Jl. Sudirman No. 123, Jakarta Pusat 10220",
    "phone": "+62 21 1234567"
  },
  "orderInfo": {
    "poDate": "2025-02-01",
    "poNumber": "PO-2025-001",
    "docReference": "REF-QUOTE-001"
  },
  "vendorInfo": {
    "vendorName": "PT Supplier Teknologi",
    "phone": "+62 21 7654321",
    "pic": {
      "name": "Budi Santoso",
      "position": "Sales Manager",
      "contact": "budi@supplier.com"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "itemDescription": "Laptop Dell Latitude 5520",
      "quantity": 5,
      "unit": "Unit",
      "price": 15000000,
      "subtotal": 75000000,
      "taxRate": 11,
      "taxAmount": 8250000,
      "priceAfterTax": 83250000
    }
  ],
  "paymentProcedure": "DP 50% saat order, Pelunasan 50% saat delivery",
  "otherTerms": "Garansi 1 tahun untuk semua barang",
  "approval": {
    "position": "Direktur",
    "name": "Achmad Hakim",
    "signatureUrl": "https://cdn.example.com/signature.png"
  },
  "createdAt": "2025-02-01T10:00:00Z",
  "updatedAt": "2025-02-01T10:00:00Z"
}
```

## 1) GET - List Purchase Orders

### Endpoint

`GET /api/finance/purchase-orders`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "PO-2025",
  "vendor": "PT Supplier Teknologi",
  "poDateFrom": "2025-02-01",
  "poDateTo": "2025-02-28",
  "sortBy": "orderInfo.poDate",
  "sortOrder": "desc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Purchase orders fetched successfully",
  "data": [
    {
      "id": "PO-001",
      "companyInfo": {
        "companyName": "PT Rubbick Indonesia",
        "address": "Jl. Sudirman No. 123, Jakarta Pusat 10220",
        "phone": "+62 21 1234567"
      },
      "orderInfo": {
        "poDate": "2025-02-01",
        "poNumber": "PO-2025-001",
        "docReference": "REF-QUOTE-001"
      },
      "vendorInfo": {
        "vendorName": "PT Supplier Teknologi",
        "phone": "+62 21 7654321",
        "pic": {
          "name": "Budi Santoso",
          "position": "Sales Manager"
        }
      },
      "lineItems": [
        {
          "number": 1,
          "itemDescription": "Laptop Dell Latitude 5520",
          "quantity": 5,
          "unit": "Unit",
          "price": 15000000,
          "subtotal": 75000000,
          "priceAfterTax": 83250000
        }
      ],
      "paymentProcedure": "DP 50% saat order, Pelunasan 50% saat delivery",
      "otherTerms": "Garansi 1 tahun untuk semua barang",
      "approval": {
        "position": "Direktur",
        "name": "Achmad Hakim"
      },
      "createdAt": "2025-02-01T10:00:00Z",
      "updatedAt": "2025-02-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

## 2) GET - Purchase Order Detail

### Endpoint

`GET /api/finance/purchase-orders/:id`

### Params (Path)

```json
{
  "id": "PO-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Purchase order detail fetched successfully",
  "data": {
    "id": "PO-001",
    "companyInfo": {
      "letterhead": "PT Rubbick Indonesia",
      "companyName": "PT Rubbick Indonesia",
      "logoUrl": "https://cdn.example.com/logo.png",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      "phone": "+62 21 1234567"
    },
    "orderInfo": {
      "poDate": "2025-02-01",
      "poNumber": "PO-2025-001",
      "docReference": "REF-QUOTE-001"
    },
    "vendorInfo": {
      "vendorName": "PT Supplier Teknologi",
      "phone": "+62 21 7654321",
      "pic": {
        "name": "Budi Santoso",
        "position": "Sales Manager",
        "contact": "budi@supplier.com"
      }
    },
    "lineItems": [
      {
        "number": 1,
        "itemDescription": "Laptop Dell Latitude 5520",
        "quantity": 5,
        "unit": "Unit",
        "price": 15000000,
        "subtotal": 75000000,
        "taxRate": 11,
        "taxAmount": 8250000,
        "priceAfterTax": 83250000
      },
      {
        "number": 2,
        "itemDescription": "Monitor LG 27 inch",
        "quantity": 10,
        "unit": "Unit",
        "price": 3500000,
        "subtotal": 35000000,
        "taxRate": 11,
        "taxAmount": 3850000,
        "priceAfterTax": 38850000
      }
    ],
    "paymentProcedure": "DP 50% saat order, Pelunasan 50% saat delivery",
    "otherTerms": "Garansi 1 tahun untuk semua barang",
    "approval": {
      "position": "Direktur",
      "name": "Achmad Hakim",
      "signatureUrl": "https://cdn.example.com/signature.png"
    },
    "createdAt": "2025-02-01T10:00:00Z",
    "updatedAt": "2025-02-01T10:00:00Z"
  }
}
```

## 3) POST - Create Purchase Order

### Endpoint

`POST /api/finance/purchase-orders`

### Request Body

```json
{
  "companyInfo": {
    "letterhead": "PT Rubbick Indonesia",
    "companyName": "PT Rubbick Indonesia",
    "logoUrl": "https://cdn.example.com/logo.png",
    "address": "Jl. Sudirman No. 123, Jakarta Pusat 10220",
    "phone": "+62 21 1234567"
  },
  "orderInfo": {
    "poDate": "2025-02-01",
    "poNumber": "PO-2025-001",
    "docReference": "REF-QUOTE-001"
  },
  "vendorInfo": {
    "vendorName": "PT Supplier Teknologi",
    "phone": "+62 21 7654321",
    "pic": {
      "name": "Budi Santoso",
      "position": "Sales Manager",
      "contact": "budi@supplier.com"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "itemDescription": "Laptop Dell Latitude 5520",
      "quantity": 5,
      "unit": "Unit",
      "price": 15000000,
      "subtotal": 75000000,
      "taxRate": 11,
      "taxAmount": 8250000,
      "priceAfterTax": 83250000
    }
  ],
  "paymentProcedure": "DP 50% saat order, Pelunasan 50% saat delivery",
  "otherTerms": "Garansi 1 tahun untuk semua barang",
  "approval": {
    "position": "Direktur",
    "name": "Achmad Hakim",
    "signatureUrl": "https://cdn.example.com/signature.png"
  }
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Purchase order created successfully",
  "data": {
    "id": "PO-003",
    "companyInfo": {
      "companyName": "PT Rubbick Indonesia",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      "phone": "+62 21 1234567"
    },
    "orderInfo": {
      "poDate": "2025-02-01",
      "poNumber": "PO-2025-001",
      "docReference": "REF-QUOTE-001"
    },
    "vendorInfo": {
      "vendorName": "PT Supplier Teknologi",
      "phone": "+62 21 7654321",
      "pic": {
        "name": "Budi Santoso",
        "position": "Sales Manager"
      }
    },
    "lineItems": [
      {
        "number": 1,
        "itemDescription": "Laptop Dell Latitude 5520",
        "quantity": 5,
        "unit": "Unit",
        "price": 15000000,
        "subtotal": 75000000,
        "priceAfterTax": 83250000
      }
    ],
    "paymentProcedure": "DP 50% saat order, Pelunasan 50% saat delivery",
    "otherTerms": "Garansi 1 tahun untuk semua barang",
    "approval": {
      "position": "Direktur",
      "name": "Achmad Hakim"
    },
    "createdAt": "2025-02-01T10:00:00Z",
    "updatedAt": "2025-02-01T10:00:00Z"
  }
}
```

## 4) PUT - Update Purchase Order

### Endpoint

`PUT /api/finance/purchase-orders/:id`

### Params (Path)

```json
{
  "id": "PO-001"
}
```

### Request Body

```json
{
  "orderInfo": {
    "poDate": "2025-02-02",
    "docReference": "REF-QUOTE-001-REV"
  },
  "vendorInfo": {
    "pic": {
      "name": "Budi Santoso",
      "position": "Senior Sales Manager",
      "contact": "budi@supplier.com"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "itemDescription": "Laptop Dell Latitude 5520",
      "quantity": 6,
      "unit": "Unit",
      "price": 15000000,
      "subtotal": 90000000,
      "taxRate": 11,
      "taxAmount": 9900000,
      "priceAfterTax": 99900000
    }
  ],
  "paymentProcedure": "DP 50% saat order, Pelunasan 50% saat delivery",
  "otherTerms": "Garansi 1 tahun untuk semua barang"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Purchase order updated successfully",
  "data": {
    "id": "PO-001",
    "orderInfo": {
      "poNumber": "PO-2025-001",
      "poDate": "2025-02-02",
      "docReference": "REF-QUOTE-001-REV"
    },
    "vendorInfo": {
      "vendorName": "PT Supplier Teknologi",
      "pic": {
        "name": "Budi Santoso",
        "position": "Senior Sales Manager",
        "contact": "budi@supplier.com"
      }
    },
    "lineItems": [
      {
        "number": 1,
        "itemDescription": "Laptop Dell Latitude 5520",
        "quantity": 6,
        "unit": "Unit",
        "priceAfterTax": 99900000
      }
    ],
    "paymentProcedure": "DP 50% saat order, Pelunasan 50% saat delivery",
    "otherTerms": "Garansi 1 tahun untuk semua barang",
    "updatedAt": "2025-02-02T14:00:00Z"
  }
}
```

## 5) DELETE - Remove Purchase Order

### Endpoint

`DELETE /api/finance/purchase-orders/:id`

### Params (Path)

```json
{
  "id": "PO-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Purchase order deleted successfully",
  "data": {
    "id": "PO-001",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## GET - Purchase Order Overview (Stats)

### Endpoint

`GET /api/finance/purchase-orders/overview`

### Params (Query)

```json
{
  "month": 2,
  "year": 2025,
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Purchase order overview fetched successfully",
  "data": {
    "totalPrice": {
      "value": 126172500,
      "formattedValue": "Rp 126,17 jt",
      "count": 2
    },
    "thisMonthCount": 2,
    "primaryVendor": "PT Supplier Teknologi",
    "vendorCount": 2
  }
}
```

---

# API Mapping - Client Module (from `src/finance/clients/page.tsx`)

Struktur ini mengikuti tipe di `src/finance/clients/types.ts`, data dummy di `src/finance/clients/data.ts`, dan endpoint pada `src/api/clients.ts`.

## Base URL

`/api/finance/clients`

## Client Object (Core Schema)

```json
{
  "id": "C001",
  "name": "PT Bank Mandiri",
  "companyName": "PT Bank Mandiri",
  "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
  "phone": "021-5245879",
  "email": "corporate@bankmandiri.co.id",
  "npwp": "01.234.567.8-901.000",
  "pic": {
    "name": "Budi Santoso",
    "position": "Manager",
    "contact": "08123456789"
  },
  "isActive": true,
  "createdAt": "2026-02-22T00:00:00.000Z",
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```

## 1) GET - List Clients

### Endpoint

`GET /api/finance/clients`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "mandiri",
  "isActive": true,
  "sortBy": "companyName",
  "sortOrder": "asc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Clients fetched successfully",
  "data": [
    {
      "id": "C001",
      "name": "PT Bank Mandiri",
      "companyName": "PT Bank Mandiri",
      "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
      "phone": "021-5245879",
      "email": "corporate@bankmandiri.co.id",
      "npwp": "01.234.567.8-901.000",
      "pic": {
        "name": "Budi Santoso",
        "position": "Manager",
        "contact": "08123456789"
      },
      "isActive": true
    },
    {
      "id": "C002",
      "name": "PT Pertamina",
      "companyName": "PT Pertamina (Persero)",
      "address": "Jl. Medan Merdeka Timur 1A",
      "phone": "021-500000",
      "email": "info@pertamina.com",
      "pic": {
        "name": "Ani Wijaya",
        "position": "Procurement",
        "contact": "08234567890"
      },
      "isActive": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

## 2) GET - Client Detail

### Endpoint

`GET /api/finance/clients/:id`

### Params (Path)

```json
{
  "id": "C001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Client detail fetched successfully",
  "data": {
    "id": "C001",
    "name": "PT Bank Mandiri",
    "companyName": "PT Bank Mandiri",
    "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
    "phone": "021-5245879",
    "email": "corporate@bankmandiri.co.id",
    "npwp": "01.234.567.8-901.000",
    "pic": {
      "name": "Budi Santoso",
      "position": "Manager",
      "contact": "08123456789"
    },
    "isActive": true,
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 3) POST - Create Client

### Endpoint

`POST /api/finance/clients`

### Request Body

```json
{
  "name": "PT Bank Mandiri",
  "companyName": "PT Bank Mandiri",
  "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
  "phone": "021-5245879",
  "email": "corporate@bankmandiri.co.id",
  "npwp": "01.234.567.8-901.000",
  "pic": {
    "name": "Budi Santoso",
    "position": "Manager",
    "contact": "08123456789"
  },
  "isActive": true
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": "C006",
    "name": "PT Bank Mandiri",
    "companyName": "PT Bank Mandiri",
    "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
    "phone": "021-5245879",
    "email": "corporate@bankmandiri.co.id",
    "npwp": "01.234.567.8-901.000",
    "pic": {
      "name": "Budi Santoso",
      "position": "Manager",
      "contact": "08123456789"
    },
    "isActive": true,
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) PUT - Update Client

### Endpoint

`PUT /api/finance/clients/:id`

### Params (Path)

```json
{
  "id": "C001"
}
```

### Request Body

```json
{
  "name": "PT Bank Mandiri",
  "companyName": "PT Bank Mandiri",
  "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
  "phone": "021-5245879",
  "email": "corporate@bankmandiri.co.id",
  "pic": {
    "name": "Budi Santoso",
    "position": "Senior Manager",
    "contact": "08123456789"
  },
  "isActive": true
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "id": "C001",
    "name": "PT Bank Mandiri",
    "companyName": "PT Bank Mandiri",
    "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
    "phone": "021-5245879",
    "email": "corporate@bankmandiri.co.id",
    "pic": {
      "name": "Budi Santoso",
      "position": "Senior Manager",
      "contact": "08123456789"
    },
    "isActive": true,
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) DELETE - Remove Client

### Endpoint

`DELETE /api/finance/clients/:id`

### Params (Path)

```json
{
  "id": "C001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Client deleted successfully",
  "data": {
    "id": "C001",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## GET - Client Overview (Stats)

### Endpoint

`GET /api/finance/clients/overview`

### Params (Query)

```json
{
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Client overview fetched successfully",
  "data": {
    "totalCount": 5,
    "activeCount": 5,
    "activeRate": 100,
    "withPicCount": 4,
    "picCoverage": 80,
    "contactCoverage": 80,
    "spotlightClient": {
      "id": "C001",
      "companyName": "PT Bank Mandiri",
      "email": "corporate@bankmandiri.co.id",
      "phone": "021-5245879",
      "address": "Jl. Jend. Gatot Subroto Kav. 36-38",
      "description": "Strategic client with ongoing monthly billing",
      "tags": ["Priority", "Active Contract", "Monthly Billing"],
      "stats": {
        "projects": 12,
        "invoices": 28,
        "health": "A+"
      }
    },
    "portfolioMix": [
      { "label": "Financial Services", "value": 42 },
      { "label": "Energy & Utilities", "value": 26 },
      { "label": "Manufacturing", "value": 19 },
      { "label": "Others", "value": 13 }
    ],
    "relationshipHealth": [
      { "label": "Excellent", "value": 48 },
      { "label": "Stable", "value": 34 },
      { "label": "Needs Follow Up", "value": 18 }
    ],
    "followUpQueue": [
      {
        "id": "C001",
        "companyName": "PT Bank Mandiri",
        "picName": "Budi Santoso",
        "action": "Call"
      }
    ]
  }
}
```

---

# API Mapping - Vendor Module (from `src/finance/vendors/page.tsx`)

Struktur ini mengikuti tipe di `src/finance/vendors/types.ts`, data dummy di `src/finance/vendors/data.ts`, dan endpoint pada `src/api/vendors.ts`.

## Base URL

`/api/finance/vendors`

## Vendor Object (Core Schema)

```json
{
  "id": "V001",
  "name": "PT Teknologi Nusantara",
  "companyName": "PT Teknologi Nusantara",
  "address": "Jl. Sudirman No. 100",
  "phone": "021-5551234",
  "email": "vendor@teknus.co.id",
  "npwp": "02.345.678.9-012.000",
  "pic": {
    "name": "Bambang Wijaya",
    "position": "Finance",
    "contact": "08123456789"
  },
  "bankName": "BCA",
  "bankAccount": "1234567890",
  "bankBranch": "Jakarta Pusat",
  "isActive": true,
  "createdAt": "2026-02-22T00:00:00.000Z",
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```

## 1) GET - List Vendors

### Endpoint

`GET /api/finance/vendors`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "teknologi",
  "isActive": true,
  "sortBy": "companyName",
  "sortOrder": "asc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Vendors fetched successfully",
  "data": [
    {
      "id": "V001",
      "name": "PT Teknologi Nusantara",
      "companyName": "PT Teknologi Nusantara",
      "address": "Jl. Sudirman No. 100",
      "phone": "021-5551234",
      "email": "vendor@teknus.co.id",
      "npwp": "02.345.678.9-012.000",
      "pic": {
        "name": "Bambang Wijaya",
        "position": "Finance",
        "contact": "08123456789"
      },
      "bankName": "BCA",
      "bankAccount": "1234567890",
      "bankBranch": "Jakarta Pusat",
      "isActive": true
    },
    {
      "id": "V002",
      "name": "CV Mitra Jaya",
      "companyName": "CV Mitra Jaya",
      "address": "Jl. Gatot Subroto 50",
      "phone": "021-5555678",
      "email": "info@mitrajaya.co.id",
      "pic": {
        "name": "Siti Aminah",
        "position": "Owner",
        "contact": "08234567890"
      },
      "bankName": "Mandiri",
      "bankAccount": "9876543210",
      "bankBranch": "Jakarta Selatan",
      "isActive": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

## 2) GET - Vendor Detail

### Endpoint

`GET /api/finance/vendors/:id`

### Params (Path)

```json
{
  "id": "V001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Vendor detail fetched successfully",
  "data": {
    "id": "V001",
    "name": "PT Teknologi Nusantara",
    "companyName": "PT Teknologi Nusantara",
    "address": "Jl. Sudirman No. 100",
    "phone": "021-5551234",
    "email": "vendor@teknus.co.id",
    "npwp": "02.345.678.9-012.000",
    "pic": {
      "name": "Bambang Wijaya",
      "position": "Finance",
      "contact": "08123456789"
    },
    "bankName": "BCA",
    "bankAccount": "1234567890",
    "bankBranch": "Jakarta Pusat",
    "isActive": true,
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 3) POST - Create Vendor

### Endpoint

`POST /api/finance/vendors`

### Request Body

```json
{
  "name": "PT Teknologi Nusantara",
  "companyName": "PT Teknologi Nusantara",
  "address": "Jl. Sudirman No. 100",
  "phone": "021-5551234",
  "email": "vendor@teknus.co.id",
  "npwp": "02.345.678.9-012.000",
  "pic": {
    "name": "Bambang Wijaya",
    "position": "Finance",
    "contact": "08123456789"
  },
  "bankName": "BCA",
  "bankAccount": "1234567890",
  "bankBranch": "Jakarta Pusat",
  "isActive": true
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Vendor created successfully",
  "data": {
    "id": "V003",
    "name": "PT Teknologi Nusantara",
    "companyName": "PT Teknologi Nusantara",
    "address": "Jl. Sudirman No. 100",
    "phone": "021-5551234",
    "email": "vendor@teknus.co.id",
    "npwp": "02.345.678.9-012.000",
    "pic": {
      "name": "Bambang Wijaya",
      "position": "Finance",
      "contact": "08123456789"
    },
    "bankName": "BCA",
    "bankAccount": "1234567890",
    "bankBranch": "Jakarta Pusat",
    "isActive": true,
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) PUT - Update Vendor

### Endpoint

`PUT /api/finance/vendors/:id`

### Params (Path)

```json
{
  "id": "V001"
}
```

### Request Body

```json
{
  "name": "PT Teknologi Nusantara",
  "companyName": "PT Teknologi Nusantara",
  "address": "Jl. Sudirman No. 100",
  "phone": "021-5551234",
  "email": "vendor@teknus.co.id",
  "pic": {
    "name": "Bambang Wijaya",
    "position": "Senior Finance",
    "contact": "08123456789"
  },
  "bankName": "BCA",
  "bankAccount": "1234567890",
  "bankBranch": "Jakarta Pusat",
  "isActive": true
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Vendor updated successfully",
  "data": {
    "id": "V001",
    "name": "PT Teknologi Nusantara",
    "companyName": "PT Teknologi Nusantara",
    "address": "Jl. Sudirman No. 100",
    "phone": "021-5551234",
    "email": "vendor@teknus.co.id",
    "pic": {
      "name": "Bambang Wijaya",
      "position": "Senior Finance",
      "contact": "08123456789"
    },
    "bankName": "BCA",
    "bankAccount": "1234567890",
    "bankBranch": "Jakarta Pusat",
    "isActive": true,
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) DELETE - Remove Vendor

### Endpoint

`DELETE /api/finance/vendors/:id`

### Params (Path)

```json
{
  "id": "V001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Vendor deleted successfully",
  "data": {
    "id": "V001",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## GET - Vendor Overview (Stats)

### Endpoint

`GET /api/finance/vendors/overview`

### Params (Query)

```json
{
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Vendor overview fetched successfully",
  "data": {
    "totalCount": 2,
    "activeCount": 2,
    "activeRate": 100,
    "withPicCount": 2,
    "picCoverage": 100,
    "withBankInfoCount": 2,
    "bankCoverage": 100,
    "spotlightVendor": {
      "id": "V001",
      "companyName": "PT Teknologi Nusantara",
      "email": "vendor@teknus.co.id",
      "phone": "021-5551234",
      "address": "Jl. Sudirman No. 100",
      "description": "Preferred supplier with stable delivery performance",
      "tags": ["Preferred", "Contract Active", "Reliable"],
      "stats": {
        "pos": 16,
        "onTime": "96%",
        "tier": "A"
      }
    },
    "onboardingFunnel": [
      { "label": "Submitted", "value": 24 },
      { "label": "Verification", "value": 14 },
      { "label": "Negotiation", "value": 8 },
      { "label": "Activated", "value": 5 }
    ],
    "paymentTermsMix": [
      { "label": "Net 30", "value": 48 },
      { "label": "Net 14", "value": 27 },
      { "label": "Net 45", "value": 16 },
      { "label": "Others", "value": 9 }
    ],
    "approvalQueue": [
      {
        "id": "V001",
        "companyName": "PT Teknologi Nusantara",
        "nextStep": "Bank verification"
      }
    ],
    "cycleTime": "3.2 d"
  }
}
```

---

# API Mapping - Quotation Module (from `src/finance/quotations/page.tsx`)

Struktur ini mengikuti tipe di `src/finance/quotations/types.ts`, data dummy di `src/finance/quotations/page.tsx` dan `data.ts`, serta endpoint pada `src/api/quotations.ts`.

## Base URL

`/api/finance/quotations`

## Quotation Object (Core Schema)

```json
{
  "id": "Q-001",
  "quotationNumber": "QT-2026-001",
  "quotationDate": "2026-02-01",
  "validUntil": "2026-03-15",
  "clientId": "C001",
  "clientName": "PT Sumber Karya Utama",
  "projectId": "proj-1",
  "projectName": "Office Supply Renewal",
  "serviceOffered": "Office Supply Renewal",
  "quotationMonth": "Februari 2026",
  "lineItems": [
    {
      "number": 1,
      "description": "Consulting - Cloud Architecture",
      "quantity": 40,
      "unit": "Jam",
      "unitPrice": 500000,
      "subtotal": 20000000
    }
  ],
  "subtotal": 154500000,
  "taxAmount": 16995000,
  "taxTypeId": "tax-ppn",
  "grandTotal": 171495000,
  "paymentTerms": "Net 30",
  "validityPeriod": "30 hari",
  "termsConditions": "Syarat dan ketentuan berlaku",
  "status": "sent",
  "picName": "Rani Putri",
  "email": "rani@sumberkarya.id",
  "phone": "+62 812-3456-1101",
  "city": "Jakarta",
  "probability": 88,
  "createdAt": "2026-02-22T00:00:00.000Z",
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```

## 1) GET - List Quotations

### Endpoint

`GET /api/finance/quotations`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "QT-2026",
  "status": "sent",
  "clientId": "C001",
  "validUntilFrom": "2026-03-01",
  "validUntilTo": "2026-03-31",
  "sortBy": "quotationDate",
  "sortOrder": "desc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Quotations fetched successfully",
  "data": [
    {
      "id": "Q-001",
      "quotationNumber": "QT-2026-001",
      "clientName": "PT Sumber Karya Utama",
      "projectName": "Office Supply Renewal",
      "picName": "Rani Putri",
      "email": "rani@sumberkarya.id",
      "phone": "+62 812-3456-1101",
      "city": "Jakarta",
      "validUntil": "2026-03-15",
      "amount": 154500000,
      "grandTotal": 171495000,
      "probability": 88,
      "status": "sent"
    },
    {
      "id": "Q-002",
      "quotationNumber": "QT-2026-002",
      "clientName": "CV Nusa Digital Printing",
      "projectName": "Packaging and Brochure Batch",
      "picName": "Kevin Maulana",
      "email": "kevin@nusahub.co.id",
      "phone": "+62 813-2277-1490",
      "city": "Bandung",
      "validUntil": "2026-03-10",
      "amount": 98200000,
      "grandTotal": 109002000,
      "probability": 72,
      "status": "negotiation"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

## 2) GET - Quotation Detail

### Endpoint

`GET /api/finance/quotations/:id`

### Params (Path)

```json
{
  "id": "Q-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Quotation detail fetched successfully",
  "data": {
    "id": "Q-001",
    "quotationNumber": "QT-2026-001",
    "quotationDate": "2026-02-01",
    "validUntil": "2026-03-15",
    "clientId": "C001",
    "clientName": "PT Sumber Karya Utama",
    "projectId": "proj-1",
    "projectName": "Office Supply Renewal",
    "serviceOffered": "Office Supply Renewal",
    "quotationMonth": "Februari 2026",
    "lineItems": [
      {
        "number": 1,
        "description": "Consulting - Cloud Architecture",
        "quantity": 40,
        "unit": "Jam",
        "unitPrice": 500000,
        "subtotal": 20000000
      }
    ],
    "subtotal": 154500000,
    "taxAmount": 16995000,
    "taxTypeId": "tax-ppn",
    "grandTotal": 171495000,
    "paymentTerms": "Net 30",
    "validityPeriod": "30 hari",
    "termsConditions": "Syarat dan ketentuan berlaku",
    "status": "sent",
    "picName": "Rani Putri",
    "email": "rani@sumberkarya.id",
    "phone": "+62 812-3456-1101",
    "city": "Jakarta",
    "probability": 88,
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 3) POST - Create Quotation

### Endpoint

`POST /api/finance/quotations`

### Request Body

```json
{
  "quotationNumber": "QT-2026-007",
  "quotationDate": "2026-02-22",
  "validUntil": "2026-03-22",
  "clientId": "C002",
  "clientName": "PT Pertamina",
  "projectId": "proj-2",
  "projectName": "Digital Transformation",
  "serviceOffered": "IT Consulting",
  "quotationMonth": "Februari 2026",
  "lineItems": [
    {
      "number": 1,
      "description": "Consulting - Cloud Architecture",
      "quantity": 40,
      "unit": "Jam",
      "unitPrice": 500000,
      "subtotal": 20000000
    }
  ],
  "subtotal": 20000000,
  "taxAmount": 2200000,
  "taxTypeId": "tax-ppn",
  "grandTotal": 22200000,
  "paymentTerms": "Net 30",
  "validityPeriod": "30 hari",
  "termsConditions": "Syarat dan ketentuan berlaku",
  "status": "draft"
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Quotation created successfully",
  "data": {
    "id": "Q-007",
    "quotationNumber": "QT-2026-007",
    "quotationDate": "2026-02-22",
    "validUntil": "2026-03-22",
    "clientId": "C002",
    "clientName": "PT Pertamina",
    "projectName": "Digital Transformation",
    "lineItems": [
      {
        "number": 1,
        "description": "Consulting - Cloud Architecture",
        "quantity": 40,
        "unit": "Jam",
        "unitPrice": 500000,
        "subtotal": 20000000
      }
    ],
    "subtotal": 20000000,
    "taxAmount": 2200000,
    "grandTotal": 22200000,
    "status": "draft",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) PUT - Update Quotation

### Endpoint

`PUT /api/finance/quotations/:id`

### Params (Path)

```json
{
  "id": "Q-001"
}
```

### Request Body

```json
{
  "validUntil": "2026-03-20",
  "lineItems": [
    {
      "number": 1,
      "description": "Consulting - Cloud Architecture",
      "quantity": 50,
      "unit": "Jam",
      "unitPrice": 500000,
      "subtotal": 25000000
    }
  ],
  "subtotal": 25000000,
  "taxAmount": 2750000,
  "grandTotal": 27750000,
  "status": "sent"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Quotation updated successfully",
  "data": {
    "id": "Q-001",
    "quotationNumber": "QT-2026-001",
    "validUntil": "2026-03-20",
    "lineItems": [
      {
        "number": 1,
        "description": "Consulting - Cloud Architecture",
        "quantity": 50,
        "unit": "Jam",
        "subtotal": 25000000
      }
    ],
    "subtotal": 25000000,
    "taxAmount": 2750000,
    "grandTotal": 27750000,
    "status": "sent",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) DELETE - Remove Quotation

### Endpoint

`DELETE /api/finance/quotations/:id`

### Params (Path)

```json
{
  "id": "Q-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Quotation deleted successfully",
  "data": {
    "id": "Q-001",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## GET - Quotation Overview (Stats)

### Endpoint

`GET /api/finance/quotations/overview`

### Params (Query)

```json
{
  "period": "Q1",
  "year": 2026,
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Quotation overview fetched successfully",
  "data": {
    "totalCount": 6,
    "draftCount": 1,
    "sentCount": 2,
    "acceptedCount": 1,
    "negotiationCount": 2,
    "winRate": 17,
    "averageValue": 170483333,
    "averageProbability": 77,
    "spotlightQuotation": {
      "id": "Q-001",
      "quotationNumber": "QT-2026-001",
      "clientName": "PT Sumber Karya Utama",
      "projectName": "Office Supply Renewal",
      "amount": 154500000,
      "grandTotal": 171495000,
      "probability": 88,
      "status": "sent",
      "email": "rani@sumberkarya.id",
      "phone": "+62 812-3456-1101",
      "city": "Jakarta",
      "description": "High-value proposal currently in active pipeline."
    },
    "stageFunnel": [
      { "label": "Draft", "value": 18 },
      { "label": "Sent", "value": 12 },
      { "label": "Negotiation", "value": 9 },
      { "label": "Accepted", "value": 5 }
    ],
    "statusDistribution": [
      { "label": "Draft", "value": 20 },
      { "label": "Sent", "value": 33 },
      { "label": "Negotiation", "value": 32 },
      { "label": "Accepted", "value": 15 }
    ]
  }
}
```

## Enum Reference (Quotation)

```json
{
  "quotationStatus": ["draft", "sent", "negotiation", "accepted", "rejected", "expired"]
}
```

---

# API Mapping - Proposal Penawaran Module (from `src/finance/proposal-penawaran/page.tsx`)

Struktur ini mengikuti tipe di `src/finance/proposal-penawaran/types.ts`, data dummy di `src/finance/proposal-penawaran/page.tsx` dan `data.ts`, serta endpoint pada `src/api/proposal-penawaran.ts`.

## Base URL

`/api/finance/proposal-penawaran`

## Proposal Penawaran Object (Core Schema)

```json
{
  "id": "PP-2026-001",
  "coverInfo": {
    "jobOffer": "Implementation ERP Finance & Procurement",
    "companyName": "PT. Alugra Digital Indonesia",
    "proposalMonth": "Februari 2026",
    "address": "Jl. Gatot Subroto No. 45, Jakarta Selatan",
    "phone": "+62 21 5551234",
    "email": "contact@alugra.co.id",
    "logoUrl": "https://cdn.example.com/logo.png"
  },
  "proposalNumber": "PP/ERP/2026/001",
  "clientInfo": {
    "clientId": "C001",
    "clientName": "PT Nusantara Pangan Distribusi",
    "contactPerson": "Rani Putri",
    "email": "rani@nusantarapangan.co.id",
    "phone": "+62 21 7890123",
    "address": "Jakarta"
  },
  "clientBackground": "Proposal penawaran untuk implementasi ERP Finance & Procurement",
  "offeredSolution": "Implementasi modul Finance dan Procurement sesuai scope",
  "workingMethod": "Assessment, design, development, testing, deployment",
  "timeline": "Sesuai kesepakatan kontrak",
  "portfolio": "Berbagai project implementasi ERP",
  "items": [
    {
      "number": 1,
      "description": "Implementation ERP Finance & Procurement",
      "quantity": 1,
      "volume": "Project",
      "unitPrice": 875000000,
      "totalPrice": 875000000
    }
  ],
  "totalEstimatedCost": 875000000,
  "totalEstimatedCostInWords": "Delapan Ratus Tujuh Puluh Lima Juta Rupiah",
  "currency": "IDR",
  "scopeOfWork": [
    "Gap analysis dan requirement gathering",
    "Design dan konfigurasi modul",
    "Development dan customisasi",
    "UAT dan go-live"
  ],
  "termsAndConditions": [
    "Harga belum termasuk PPN",
    "Pembayaran 50% di awal, 50% setelah delivery",
    "Support 3 bulan setelah go-live"
  ],
  "notes": "Harga berlaku 14 hari kerja.",
  "documentApproval": {
    "place": "Jakarta",
    "date": "2026-02-01",
    "signerName": "Eko Budianto",
    "signerPosition": "Direktur",
    "signatureUrl": "https://cdn.example.com/signature.png"
  },
  "status": "sent",
  "owner": "Rani Putri",
  "submittedAt": "2026-02-01",
  "responseDueAt": "2026-02-25",
  "industry": "Distribution",
  "probability": 82,
  "nextAction": "Product demo with CFO on 24 Feb",
  "createdAt": "2026-02-01T10:00:00Z",
  "updatedAt": "2026-02-01T10:00:00Z"
}
```

## 1) GET - List Proposals

### Endpoint

`GET /api/finance/proposal-penawaran`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "PP-2026",
  "status": "sent",
  "clientId": "C001",
  "sortBy": "submittedAt",
  "sortOrder": "desc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Proposals fetched successfully",
  "data": [
    {
      "id": "PP-2026-001",
      "proposalNumber": "PP/ERP/2026/001",
      "title": "Implementation ERP Finance & Procurement",
      "clientName": "PT Nusantara Pangan Distribusi",
      "industry": "Distribution",
      "owner": "Rani Putri",
      "submittedAt": "2026-02-01",
      "responseDueAt": "2026-02-25",
      "amount": 875000000,
      "totalEstimatedCost": 875000000,
      "probability": 82,
      "status": "sent",
      "nextAction": "Product demo with CFO on 24 Feb"
    },
    {
      "id": "PP-2026-002",
      "proposalNumber": "PP/ERP/2026/002",
      "title": "Warehouse Optimization and Barcode Flow",
      "clientName": "CV Sinar Logistik Prima",
      "industry": "Logistics",
      "owner": "Bagus Yudistira",
      "submittedAt": "2026-02-04",
      "responseDueAt": "2026-02-26",
      "amount": 420000000,
      "totalEstimatedCost": 420000000,
      "probability": 66,
      "status": "draft",
      "nextAction": "Finalize BoQ and SLA appendix"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

## 2) GET - Proposal Detail

### Endpoint

`GET /api/finance/proposal-penawaran/:id`

### Params (Path)

```json
{
  "id": "PP-2026-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Proposal detail fetched successfully",
  "data": {
    "id": "PP-2026-001",
    "coverInfo": {
      "jobOffer": "Implementation ERP Finance & Procurement",
      "companyName": "PT. Alugra Digital Indonesia",
      "proposalMonth": "Februari 2026",
      "address": "Jl. Gatot Subroto No. 45, Jakarta Selatan",
      "phone": "+62 21 5551234",
      "email": "contact@alugra.co.id"
    },
    "proposalNumber": "PP/ERP/2026/001",
    "clientInfo": {
      "clientId": "C001",
      "clientName": "PT Nusantara Pangan Distribusi",
      "contactPerson": "Rani Putri",
      "email": "rani@nusantarapangan.co.id",
      "phone": "+62 21 7890123",
      "address": "Jakarta"
    },
    "clientBackground": "Proposal penawaran untuk implementasi ERP Finance & Procurement",
    "offeredSolution": "Implementasi modul Finance dan Procurement sesuai scope",
    "workingMethod": "Assessment, design, development, testing, deployment",
    "timeline": "Sesuai kesepakatan kontrak",
    "portfolio": "Berbagai project implementasi ERP",
    "items": [
      {
        "number": 1,
        "description": "Implementation ERP Finance & Procurement",
        "quantity": 1,
        "volume": "Project",
        "unitPrice": 875000000,
        "totalPrice": 875000000
      }
    ],
    "totalEstimatedCost": 875000000,
    "totalEstimatedCostInWords": "Delapan Ratus Tujuh Puluh Lima Juta Rupiah",
    "currency": "IDR",
    "scopeOfWork": [
      "Gap analysis dan requirement gathering",
      "Design dan konfigurasi modul",
      "Development dan customisasi",
      "UAT dan go-live"
    ],
    "termsAndConditions": [
      "Harga belum termasuk PPN",
      "Pembayaran 50% di awal, 50% setelah delivery",
      "Support 3 bulan setelah go-live"
    ],
    "notes": "Harga berlaku 14 hari kerja.",
    "documentApproval": {
      "place": "Jakarta",
      "date": "2026-02-01",
      "signerName": "Eko Budianto",
      "signerPosition": "Direktur"
    },
    "status": "sent",
    "owner": "Rani Putri",
    "submittedAt": "2026-02-01",
    "responseDueAt": "2026-02-25",
    "industry": "Distribution",
    "probability": 82,
    "nextAction": "Product demo with CFO on 24 Feb",
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-01T10:00:00Z"
  }
}
```

## 3) POST - Create Proposal

### Endpoint

`POST /api/finance/proposal-penawaran`

### Request Body

```json
{
  "coverInfo": {
    "jobOffer": "Implementation ERP Finance & Procurement",
    "companyName": "PT. Alugra Digital Indonesia",
    "proposalMonth": "Februari 2026",
    "address": "Jl. Gatot Subroto No. 45, Jakarta Selatan",
    "phone": "+62 21 5551234",
    "email": "contact@alugra.co.id"
  },
  "proposalNumber": "PP/ERP/2026/007",
  "clientInfo": {
    "clientId": "C002",
    "clientName": "PT Pertamina",
    "contactPerson": "Budi Santoso",
    "email": "budi@pertamina.com",
    "phone": "+62 21 7890123",
    "address": "Jakarta"
  },
  "clientBackground": "Proposal penawaran untuk implementasi ERP",
  "offeredSolution": "Implementasi modul Finance dan Procurement",
  "workingMethod": "Assessment, design, development, testing, deployment",
  "timeline": "Sesuai kesepakatan kontrak",
  "portfolio": "Berbagai project implementasi ERP",
  "items": [
    {
      "number": 1,
      "description": "Implementation ERP Finance & Procurement",
      "quantity": 1,
      "volume": "Project",
      "unitPrice": 875000000,
      "totalPrice": 875000000
    }
  ],
  "totalEstimatedCost": 875000000,
  "totalEstimatedCostInWords": "Delapan Ratus Tujuh Puluh Lima Juta Rupiah",
  "currency": "IDR",
  "scopeOfWork": [
    "Gap analysis dan requirement gathering",
    "Design dan konfigurasi modul"
  ],
  "termsAndConditions": [
    "Harga belum termasuk PPN",
    "Pembayaran 50% di awal, 50% setelah delivery"
  ],
  "notes": "Harga berlaku 14 hari kerja.",
  "documentApproval": {
    "place": "Jakarta",
    "date": "2026-02-22",
    "signerName": "Eko Budianto",
    "signerPosition": "Direktur"
  },
  "status": "draft"
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Proposal created successfully",
  "data": {
    "id": "PP-2026-007",
    "proposalNumber": "PP/ERP/2026/007",
    "coverInfo": {
      "jobOffer": "Implementation ERP Finance & Procurement",
      "companyName": "PT. Alugra Digital Indonesia",
      "proposalMonth": "Februari 2026"
    },
    "clientInfo": {
      "clientName": "PT Pertamina",
      "contactPerson": "Budi Santoso"
    },
    "items": [
      {
        "number": 1,
        "description": "Implementation ERP Finance & Procurement",
        "quantity": 1,
        "volume": "Project",
        "unitPrice": 875000000,
        "totalPrice": 875000000
      }
    ],
    "totalEstimatedCost": 875000000,
    "currency": "IDR",
    "status": "draft",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) PUT - Update Proposal

### Endpoint

`PUT /api/finance/proposal-penawaran/:id`

### Params (Path)

```json
{
  "id": "PP-2026-001"
}
```

### Request Body

```json
{
  "status": "sent",
  "items": [
    {
      "number": 1,
      "description": "Implementation ERP Finance & Procurement",
      "quantity": 1,
      "volume": "Project",
      "unitPrice": 900000000,
      "totalPrice": 900000000
    }
  ],
  "totalEstimatedCost": 900000000,
  "totalEstimatedCostInWords": "Sembilan Ratus Juta Rupiah",
  "owner": "Rani Putri",
  "submittedAt": "2026-02-01",
  "responseDueAt": "2026-02-25",
  "probability": 85,
  "nextAction": "Product demo with CFO on 24 Feb"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Proposal updated successfully",
  "data": {
    "id": "PP-2026-001",
    "proposalNumber": "PP/ERP/2026/001",
    "totalEstimatedCost": 900000000,
    "status": "sent",
    "owner": "Rani Putri",
    "submittedAt": "2026-02-01",
    "responseDueAt": "2026-02-25",
    "probability": 85,
    "nextAction": "Product demo with CFO on 24 Feb",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) DELETE - Remove Proposal

### Endpoint

`DELETE /api/finance/proposal-penawaran/:id`

### Params (Path)

```json
{
  "id": "PP-2026-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Proposal deleted successfully",
  "data": {
    "id": "PP-2026-001",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## GET - Proposal Overview (Stats)

### Endpoint

`GET /api/finance/proposal-penawaran/overview`

### Params (Query)

```json
{
  "period": "Q1",
  "year": 2026,
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Proposal overview fetched successfully",
  "data": {
    "totalCount": 6,
    "draftCount": 2,
    "sentCount": 2,
    "acceptedCount": 1,
    "rejectedCount": 1,
    "winRate": 17,
    "averageValue": 597500000,
    "averageProbability": 71,
    "spotlightProposal": {
      "id": "PP-2026-001",
      "proposalNumber": "PP/ERP/2026/001",
      "title": "Implementation ERP Finance & Procurement",
      "clientName": "PT Nusantara Pangan Distribusi",
      "owner": "Rani Putri",
      "amount": 875000000,
      "totalEstimatedCost": 875000000,
      "probability": 82,
      "status": "sent",
      "responseDueAt": "2026-02-25"
    },
    "statusDistribution": [
      { "label": "Draft", "value": 33 },
      { "label": "Sent", "value": 33 },
      { "label": "Accepted", "value": 17 },
      { "label": "Rejected", "value": 17 }
    ],
    "actionQueue": [
      {
        "id": "PP-2026-001",
        "proposalNumber": "PP/ERP/2026/001",
        "nextAction": "Product demo with CFO on 24 Feb"
      },
      {
        "id": "PP-2026-002",
        "proposalNumber": "PP/ERP/2026/002",
        "nextAction": "Finalize BoQ and SLA appendix"
      }
    ]
  }
}
```

## Enum Reference (Proposal Penawaran)

```json
{
  "proposalStatus": ["draft", "sent", "accepted", "rejected"]
}
```

---

# API Mapping - Perpajakan (Tax Type) Module (from `src/finance/perpajakan/page.tsx`)

Struktur ini mengikuti tipe di `src/finance/perpajakan/types.ts`, data dummy di `src/finance/perpajakan/page.tsx` dan `data.ts`, serta endpoint pada `src/api/tax-types.ts`.

## Base URL

`/api/finance/tax-types`

## Tax Type Object (Core Schema)

```json
{
  "id": "tax-001",
  "code": "PPN-11",
  "name": "PPN Keluaran 11%",
  "rate": 11,
  "category": "output_tax",
  "description": "Pajak pertambahan nilai atas penyerahan barang/jasa kena pajak domestik.",
  "regulation": "UU HPP 2021",
  "applicableDocuments": ["invoice", "po"],
  "documentUrl": "https://cdn.example.com/regulation.pdf",
  "isActive": true,
  "createdAt": "2026-01-08T09:00:00Z",
  "updatedAt": "2026-02-10T10:00:00Z"
}
```

## 1) GET - List Tax Types

### Endpoint

`GET /api/finance/tax-types`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "PPN",
  "category": "output_tax",
  "isActive": true,
  "applicableDocument": "invoice",
  "sortBy": "code",
  "sortOrder": "asc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Tax types fetched successfully",
  "data": [
    {
      "id": "tax-001",
      "code": "PPN-11",
      "name": "PPN Keluaran 11%",
      "rate": 11,
      "category": "output_tax",
      "description": "Pajak pertambahan nilai atas penyerahan barang/jasa kena pajak domestik.",
      "regulation": "UU HPP 2021",
      "applicableDocuments": ["invoice", "po"],
      "isActive": true
    },
    {
      "id": "tax-003",
      "code": "PPh23-2",
      "name": "PPh 23 Jasa 2%",
      "rate": 2,
      "category": "withholding_tax",
      "description": "PPh Pasal 23 atas jasa tertentu yang dipotong oleh lawan transaksi.",
      "regulation": "PMK No. 141/PMK.03/2015",
      "applicableDocuments": ["invoice", "bast"],
      "isActive": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

## 2) GET - Tax Type Detail

### Endpoint

`GET /api/finance/tax-types/:id`

### Params (Path)

```json
{
  "id": "tax-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Tax type detail fetched successfully",
  "data": {
    "id": "tax-001",
    "code": "PPN-11",
    "name": "PPN Keluaran 11%",
    "rate": 11,
    "category": "output_tax",
    "description": "Pajak pertambahan nilai atas penyerahan barang/jasa kena pajak domestik.",
    "regulation": "UU HPP 2021",
    "applicableDocuments": ["invoice", "po"],
    "documentUrl": "https://cdn.example.com/regulation.pdf",
    "isActive": true,
    "createdAt": "2026-01-08T09:00:00Z",
    "updatedAt": "2026-02-10T10:00:00Z"
  }
}
```

## 3) POST - Create Tax Type

### Endpoint

`POST /api/finance/tax-types`

### Request Body

```json
{
  "code": "PPN-11",
  "name": "PPN Keluaran 11%",
  "rate": 11,
  "category": "output_tax",
  "description": "Pajak pertambahan nilai atas penyerahan barang/jasa kena pajak domestik.",
  "regulation": "UU HPP 2021",
  "applicableDocuments": ["invoice", "po"],
  "documentUrl": "https://cdn.example.com/regulation.pdf",
  "isActive": true
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Tax type created successfully",
  "data": {
    "id": "tax-007",
    "code": "PPN-11",
    "name": "PPN Keluaran 11%",
    "rate": 11,
    "category": "output_tax",
    "description": "Pajak pertambahan nilai atas penyerahan barang/jasa kena pajak domestik.",
    "regulation": "UU HPP 2021",
    "applicableDocuments": ["invoice", "po"],
    "documentUrl": "https://cdn.example.com/regulation.pdf",
    "isActive": true,
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) PUT - Update Tax Type

### Endpoint

`PUT /api/finance/tax-types/:id`

### Params (Path)

```json
{
  "id": "tax-001"
}
```

### Request Body

```json
{
  "code": "PPN-11",
  "name": "PPN Keluaran 11%",
  "rate": 12,
  "category": "output_tax",
  "description": "Template PPN untuk skenario penyesuaian tarif baru.",
  "regulation": "Draft PMK 2026",
  "applicableDocuments": ["invoice"],
  "isActive": false
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Tax type updated successfully",
  "data": {
    "id": "tax-001",
    "code": "PPN-11",
    "name": "PPN Keluaran 11%",
    "rate": 12,
    "category": "output_tax",
    "description": "Template PPN untuk skenario penyesuaian tarif baru.",
    "regulation": "Draft PMK 2026",
    "applicableDocuments": ["invoice"],
    "isActive": false,
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) DELETE - Remove Tax Type

### Endpoint

`DELETE /api/finance/tax-types/:id`

### Params (Path)

```json
{
  "id": "tax-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Tax type deleted successfully",
  "data": {
    "id": "tax-001",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## GET - Tax Type Overview (Stats)

### Endpoint

`GET /api/finance/tax-types/overview`

### Params (Query)

```json
{
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Tax type overview fetched successfully",
  "data": {
    "totalCount": 6,
    "outputTaxCount": 3,
    "withholdingTaxCount": 3,
    "averageRate": 5,
    "complianceCoverage": 100,
    "categoryDistribution": [
      { "label": "Output Tax", "value": 50 },
      { "label": "Withholding Tax", "value": 50 }
    ],
    "withholdingTypesCount": 3,
    "outputTypesCount": 3
  }
}
```

## Enum Reference (Perpajakan)

```json
{
  "taxCategory": ["output_tax", "withholding_tax"],
  "applicableDocument": ["invoice", "po", "bast"]
}
```

---

# API Mapping - BAST Module (from `src/finance/bast/page.tsx`)

Struktur ini mengikuti tipe di `src/finance/bast/types.ts`, data dummy di `src/finance/bast/page.tsx` dan `data.ts`, serta endpoint pada `src/api/bast.ts`.

## Base URL

`/api/finance/basts`

## BAST Object (Core Schema)

```json
{
  "id": "bast-001",
  "coverInfo": {
    "jobOffer": "Jasa Integrasi Sistem ERP Gudang",
    "companyName": "PT Cakra Niaga Digital",
    "bastMonth": "2026-02",
    "address": "Jl. Gatot Subroto No. 17, Jakarta Selatan",
    "phone": "+62 21 5550 2001"
  },
  "documentInfo": {
    "bastNumber": "BAST/FIN/II/2026/001",
    "bastDate": "2026-02-05",
    "relatedPoOrInvoice": "PO-2026-0142"
  },
  "deliveringParty": {
    "name": "Dimas Pratama",
    "position": "Project Manager",
    "company": "PT Delta Karya Solusi",
    "signatureUrl": "https://cdn.example.com/signature.png"
  },
  "receivingParty": {
    "name": "Arini Mahendra",
    "position": "Head of Finance",
    "company": "PT Cakra Niaga Digital",
    "signatureUrl": "https://cdn.example.com/signature.png"
  },
  "createdAt": "2026-02-05T10:00:00Z",
  "updatedAt": "2026-02-05T10:00:00Z"
}
```

## 1) GET - List BASTs

### Endpoint

`GET /api/finance/basts`

### Params (Query)

```json
{
  "page": 1,
  "limit": 10,
  "search": "BAST-001",
  "companyName": "PT Cakra Niaga Digital",
  "bastMonth": "2026-02",
  "bastDateFrom": "2026-02-01",
  "bastDateTo": "2026-02-28",
  "sortBy": "documentInfo.bastDate",
  "sortOrder": "desc"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "BASTs fetched successfully",
  "data": [
    {
      "id": "bast-001",
      "coverInfo": {
        "jobOffer": "Jasa Integrasi Sistem ERP Gudang",
        "companyName": "PT Cakra Niaga Digital",
        "bastMonth": "2026-02",
        "address": "Jl. Gatot Subroto No. 17, Jakarta Selatan",
        "phone": "+62 21 5550 2001"
      },
      "documentInfo": {
        "bastNumber": "BAST/FIN/II/2026/001",
        "bastDate": "2026-02-05",
        "relatedPoOrInvoice": "PO-2026-0142"
      },
      "deliveringParty": {
        "name": "Dimas Pratama",
        "position": "Project Manager",
        "company": "PT Delta Karya Solusi"
      },
      "receivingParty": {
        "name": "Arini Mahendra",
        "position": "Head of Finance",
        "company": "PT Cakra Niaga Digital"
      }
    },
    {
      "id": "bast-002",
      "coverInfo": {
        "jobOffer": "Pengadaan Perangkat Kasir Cabang Barat",
        "companyName": "PT Bintang Ritel Nusantara",
        "bastMonth": "2026-02",
        "address": "Jl. Diponegoro No. 95, Bandung",
        "phone": "+62 22 8891 1003"
      },
      "documentInfo": {
        "bastNumber": "BAST/FIN/II/2026/002",
        "bastDate": "2026-02-11",
        "relatedPoOrInvoice": "INV-2026-0901"
      },
      "deliveringParty": {
        "name": "Raka Adinata",
        "position": "Delivery Lead",
        "company": "PT Delta Karya Solusi"
      },
      "receivingParty": {
        "name": "Sinta Larasati",
        "position": "Procurement Supervisor",
        "company": "PT Bintang Ritel Nusantara"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

## 2) GET - BAST Detail

### Endpoint

`GET /api/finance/basts/:id`

### Params (Path)

```json
{
  "id": "bast-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "BAST detail fetched successfully",
  "data": {
    "id": "bast-001",
    "coverInfo": {
      "jobOffer": "Jasa Integrasi Sistem ERP Gudang",
      "companyName": "PT Cakra Niaga Digital",
      "bastMonth": "2026-02",
      "address": "Jl. Gatot Subroto No. 17, Jakarta Selatan",
      "phone": "+62 21 5550 2001"
    },
    "documentInfo": {
      "bastNumber": "BAST/FIN/II/2026/001",
      "bastDate": "2026-02-05",
      "relatedPoOrInvoice": "PO-2026-0142"
    },
    "deliveringParty": {
      "name": "Dimas Pratama",
      "position": "Project Manager",
      "company": "PT Delta Karya Solusi",
      "signatureUrl": "https://cdn.example.com/signature.png"
    },
    "receivingParty": {
      "name": "Arini Mahendra",
      "position": "Head of Finance",
      "company": "PT Cakra Niaga Digital",
      "signatureUrl": "https://cdn.example.com/signature.png"
    },
    "createdAt": "2026-02-05T10:00:00Z",
    "updatedAt": "2026-02-05T10:00:00Z"
  }
}
```

## 3) POST - Create BAST

### Endpoint

`POST /api/finance/basts`

### Request Body

```json
{
  "coverInfo": {
    "jobOffer": "Jasa Integrasi Sistem ERP Gudang",
    "companyName": "PT Cakra Niaga Digital",
    "bastMonth": "2026-02",
    "address": "Jl. Gatot Subroto No. 17, Jakarta Selatan",
    "phone": "+62 21 5550 2001"
  },
  "documentInfo": {
    "bastNumber": "BAST/FIN/II/2026/007",
    "bastDate": "2026-02-22",
    "relatedPoOrInvoice": "PO-2026-0142"
  },
  "deliveringParty": {
    "name": "Dimas Pratama",
    "position": "Project Manager",
    "company": "PT Delta Karya Solusi",
    "signatureUrl": "https://cdn.example.com/signature.png"
  },
  "receivingParty": {
    "name": "Arini Mahendra",
    "position": "Head of Finance",
    "company": "PT Cakra Niaga Digital",
    "signatureUrl": "https://cdn.example.com/signature.png"
  }
}
```

### Response (201)

```json
{
  "success": true,
  "message": "BAST created successfully",
  "data": {
    "id": "bast-007",
    "coverInfo": {
      "jobOffer": "Jasa Integrasi Sistem ERP Gudang",
      "companyName": "PT Cakra Niaga Digital",
      "bastMonth": "2026-02",
      "address": "Jl. Gatot Subroto No. 17, Jakarta Selatan",
      "phone": "+62 21 5550 2001"
    },
    "documentInfo": {
      "bastNumber": "BAST/FIN/II/2026/007",
      "bastDate": "2026-02-22",
      "relatedPoOrInvoice": "PO-2026-0142"
    },
    "deliveringParty": {
      "name": "Dimas Pratama",
      "position": "Project Manager",
      "company": "PT Delta Karya Solusi"
    },
    "receivingParty": {
      "name": "Arini Mahendra",
      "position": "Head of Finance",
      "company": "PT Cakra Niaga Digital"
    },
    "createdAt": "2026-02-22T00:00:00.000Z",
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 4) PUT - Update BAST

### Endpoint

`PUT /api/finance/basts/:id`

### Params (Path)

```json
{
  "id": "bast-001"
}
```

### Request Body

```json
{
  "documentInfo": {
    "bastDate": "2026-02-06",
    "relatedPoOrInvoice": "PO-2026-0142 / INV-2026-0901"
  },
  "receivingParty": {
    "name": "Arini Mahendra",
    "position": "Head of Finance",
    "company": "PT Cakra Niaga Digital",
    "signatureUrl": "https://cdn.example.com/signature-updated.png"
  }
}
```

### Response (200)

```json
{
  "success": true,
  "message": "BAST updated successfully",
  "data": {
    "id": "bast-001",
    "documentInfo": {
      "bastNumber": "BAST/FIN/II/2026/001",
      "bastDate": "2026-02-06",
      "relatedPoOrInvoice": "PO-2026-0142 / INV-2026-0901"
    },
    "receivingParty": {
      "name": "Arini Mahendra",
      "position": "Head of Finance",
      "company": "PT Cakra Niaga Digital",
      "signatureUrl": "https://cdn.example.com/signature-updated.png"
    },
    "updatedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## 5) DELETE - Remove BAST

### Endpoint

`DELETE /api/finance/basts/:id`

### Params (Path)

```json
{
  "id": "bast-001"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "BAST deleted successfully",
  "data": {
    "id": "bast-001",
    "deleted": true,
    "deletedAt": "2026-02-22T00:00:00.000Z"
  }
}
```

## GET - BAST Overview (Stats)

### Endpoint

`GET /api/finance/basts/overview`

### Params (Query)

```json
{
  "month": 2,
  "year": 2026,
  "currency": "IDR"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "BAST overview fetched successfully",
  "data": {
    "totalCount": 6,
    "thisMonthCount": 2,
    "companyCount": 6,
    "withRelatedDocCount": 5,
    "withoutRelatedDocCount": 1,
    "completionRate": 83,
    "referenceDistribution": [
      { "label": "With PO/Invoice", "value": 83 },
      { "label": "Missing Reference", "value": 17 }
    ],
    "completedReferencesCount": 5,
    "missingReferencesCount": 1
  }
}
```
