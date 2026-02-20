import type { Project } from "./types";

export const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    identity: {
      projectId: "PRJ-2025-001",
      namaProject: "Migrasi Cloud Bank Mandiri",
      clientId: "C001",
      clientName: "PT Bank Mandiri",
      scopeProject: "Migrasi infrastruktur ke cloud, training, dan support 6 bulan",
      startDate: "2025-01-15",
      endDate: "2025-07-15",
      projectManagerId: "EMP-002",
      projectManagerName: "Dewi Sartika",
      status: "on_progress",
    },
    documentRelations: {
      proposalIds: ["PROP-001"],
      quotationIds: ["QUO-001"],
      purchaseOrderIds: ["PO-001"],
      invoiceIds: ["INV-001"],
      bastIds: ["BAST-001"],
    },
    finance: {
      income: 125000000,
      expense: 45000000,
      profitLoss: 80000000,
    },
    documents: [
      {
        url: "https://example.com/contract-001.pdf",
        name: "Kontrak Kerja",
        type: "contract",
        uploadedAt: "2025-01-10T09:00:00Z",
      },
    ],
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "PRJ-002",
    identity: {
      projectId: "PRJ-2025-002",
      namaProject: "Audit Keamanan Siber Pertamina",
      clientId: "C002",
      clientName: "PT Pertamina",
      scopeProject: "Audit keamanan sistem, penetration testing, rekomendasi",
      startDate: "2024-11-01",
      endDate: "2025-02-28",
      projectManagerId: "EMP-001",
      projectManagerName: "Achmad Hakim",
      status: "completed",
    },
    documentRelations: {
      proposalIds: [],
      quotationIds: ["QUO-002"],
      purchaseOrderIds: ["PO-002"],
      invoiceIds: ["INV-002"],
      bastIds: ["BAST-002"],
    },
    finance: {
      income: 85000000,
      expense: 32000000,
      profitLoss: 53000000,
    },
    documents: [],
    createdAt: "2024-10-20T14:00:00Z",
    updatedAt: "2025-02-28T16:00:00Z",
  },
];
