import type { Quotation } from "./types";

export const mockQuotations: Quotation[] = [
  {
    id: "QT-001",
    quotationNumber: "QT/ALG/0125/001",
    quotationDate: "2025-01-15",
    validUntil: "2025-02-15",
    clientId: "C001",
    clientName: "PT Bank Mandiri",
    projectId: "proj-1",
    projectName: "Cloud Migration",
    serviceOffered: "IT Consulting & Implementation",
    quotationMonth: "Januari 2025",
    lineItems: [
      {
        number: 1,
        description: "Consulting - Cloud Architecture",
        quantity: 40,
        unit: "Jam",
        unitPrice: 500000,
        subtotal: 20000000,
      },
      {
        number: 2,
        description: "Implementation Support",
        quantity: 20,
        unit: "Hari",
        unitPrice: 1500000,
        subtotal: 30000000,
      },
    ],
    subtotal: 50000000,
    taxAmount: 5500000,
    taxTypeId: "tax-ppn",
    grandTotal: 55500000,
    paymentTerms: "Net 30",
    validityPeriod: "30 hari",
    termsConditions: "Syarat dan ketentuan berlaku",
    status: "sent",
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
];
