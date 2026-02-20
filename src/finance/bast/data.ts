import type { BAST } from "./types";

export const mockBasts: BAST[] = [
  {
    id: "BAST-001",
    coverInfo: {
      jobOffer: "Jasa Konsultasi Migrasi Cloud",
      companyName: "PT Rubbick Indonesia",
      bastMonth: "2025-02",
      address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      phone: "+62 21 1234567",
    },
    documentInfo: {
      bastNumber: "BAST-2025-001",
      bastDate: "2025-02-15",
      relatedPoOrInvoice: "PO-2025-001 / INV-2025-001",
    },
    deliveringParty: {
      name: "Budi Santoso",
      position: "Project Manager",
      company: "PT Rubbick Indonesia",
      signatureUrl: "",
    },
    receivingParty: {
      name: "Achmad Hakim",
      position: "IT Manager",
      company: "PT Bank Mandiri",
      signatureUrl: "",
    },
    createdAt: "2025-02-15T10:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "BAST-002",
    coverInfo: {
      jobOffer: "Penyediaan Perangkat Laptop",
      companyName: "PT Rubbick Indonesia",
      bastMonth: "2025-02",
      address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      phone: "+62 21 1234567",
    },
    documentInfo: {
      bastNumber: "BAST-2025-002",
      bastDate: "2025-02-20",
      relatedPoOrInvoice: "PO-2025-002",
    },
    deliveringParty: {
      name: "Siti Aminah",
      position: "Sales Manager",
      company: "PT Rubbick Indonesia",
      signatureUrl: "",
    },
    receivingParty: {
      name: "Maria Wijaya",
      position: "Purchasing Officer",
      company: "PT Pertamina",
      signatureUrl: "",
    },
    createdAt: "2025-02-20T14:30:00Z",
    updatedAt: "2025-02-20T14:30:00Z",
  },
];
