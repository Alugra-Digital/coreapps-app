import type { PurchaseOrder } from "./types";

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    companyInfo: {
      letterhead: "PT Rubbick Indonesia",
      companyName: "PT Rubbick Indonesia",
      logoUrl: "",
      address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      phone: "+62 21 1234567",
    },
    orderInfo: {
      poDate: "2025-02-01",
      poNumber: "PO-2025-001",
      docReference: "REF-QUOTE-001",
    },
    vendorInfo: {
      vendorName: "PT Supplier Teknologi",
      phone: "+62 21 7654321",
      pic: {
        name: "Budi Santoso",
        position: "Sales Manager",
        contact: "budi@supplier.com",
      },
    },
    lineItems: [
      {
        number: 1,
        itemDescription: "Laptop Dell Latitude 5520",
        quantity: 5,
        unit: "Unit",
        price: 15000000,
        subtotal: 75000000,
        taxRate: 11,
        taxAmount: 8250000,
        priceAfterTax: 83250000,
      },
      {
        number: 2,
        itemDescription: "Monitor LG 27 inch",
        quantity: 10,
        unit: "Unit",
        price: 3500000,
        subtotal: 35000000,
        taxRate: 11,
        taxAmount: 3850000,
        priceAfterTax: 38850000,
      },
    ],
    paymentProcedure: "DP 50% saat order, Pelunasan 50% saat delivery",
    otherTerms: "Garansi 1 tahun untuk semua barang",
    approval: {
      position: "Direktur",
      name: "Achmad Hakim",
      signatureUrl: "",
    },
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "PO-002",
    companyInfo: {
      letterhead: "PT Rubbick Indonesia",
      companyName: "PT Rubbick Indonesia",
      logoUrl: "",
      address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      phone: "+62 21 1234567",
    },
    orderInfo: {
      poDate: "2025-02-05",
      poNumber: "PO-2025-002",
      docReference: "REF-QUOTE-002",
    },
    vendorInfo: {
      vendorName: "CV Office Supplies",
      phone: "+62 21 9876543",
      pic: {
        name: "Siti Aminah",
        position: "Account Executive",
        contact: "081234567890",
      },
    },
    lineItems: [
      {
        number: 1,
        itemDescription: "Kertas HVS A4 70gr",
        quantity: 50,
        unit: "Rim",
        price: 45000,
        subtotal: 2250000,
        taxRate: 11,
        taxAmount: 247500,
        priceAfterTax: 2497500,
      },
    ],
    paymentProcedure: "Net 30 hari",
    approval: {
      position: "Finance Accounting",
      name: "Maria Wijaya",
      signatureUrl: "",
    },
    createdAt: "2025-02-05T14:30:00Z",
    updatedAt: "2025-02-05T14:30:00Z",
  },
];
