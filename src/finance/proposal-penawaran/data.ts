import type { ProposalPenawaran } from "./types";

export const mockProposals: ProposalPenawaran[] = [
  {
    id: "PP-001",
    coverInfo: {
      jobOffer: "INSTALASI & KONFIGURASI REDIS ENTERPRISE",
      companyName: "PT. Mega Inti Teknologi",
      proposalMonth: "Januari 2025",
      address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      phone: "+62 21 1234567",
      email: "info@megainti.co.id",
    },
    proposalNumber: "PP/MIT/0125/0002",
    clientInfo: {
      clientName: "Bapenda Jakarta",
      contactPerson: "Bapak Pimpinan",
      address: "Jakarta",
    },
    clientBackground:
      "Proposal penawaran untuk instalasi dan konfigurasi Redis Enterprise di Bapenda Jakarta",
    offeredSolution:
      "PT. Alugra Digital Indonesia akan melaksanakan instalasi dan konfigurasi Redis Enterprise sesuai scope pekerjaan",
    workingMethod: "Assessment, instalasi, konfigurasi DNS, dan persiapan infrastruktur",
    timeline: "Sesuai kesepakatan kontrak",
    portfolio: "Berbagai project instalasi dan konfigurasi enterprise",
    items: [
      {
        number: 1,
        description:
          "Installation & Configuration REDIS - Assessment, analisa, perancangan arsitektur, instalasi, konfigurasi DNS, firewall rules",
        quantity: 1,
        volume: "Packages",
        unitPrice: 1_200_000_000,
        totalPrice: 1_200_000_000,
      },
    ],
    totalEstimatedCost: 1_200_000_000,
    totalEstimatedCostInWords: "Satu Milyar Dua Ratus Juta Rupiah",
    currency: "IDR",
    scopeOfWork: [
      "Preliminary Onsite Work Assessment In Jakarta",
      "Sudah Termasuk 4X Onsite Preventive Maintenance Jakarta",
      "Sudah Termasuk Biaya Transportasi Akomodasi Untuk Pekerjaan Corrective Maintenance",
      "Harga Diatas Adalah Harga Durasi Kontrak",
    ],
    termsAndConditions: [
      "Harga Dalam Rupiah (Belum Termasuk PPN dan Pajak Lain-lain Yang Mungkin Muncul Sesuai Aturan Pemerintah)",
      "Term of Payment: 20% Dibayarkan Setelah PO diterima, 80% Dibayarkan Setelah BAST",
      "Penawaran Ini Tidak Termasuk Jasa Service Yang Tidak Tercantum Dalam Lingkup Pekerjaan",
      "Harga penawaran ini berlaku selama 14 hari kerja",
    ],
    notes:
      "Harga berlaku untuk wilayah Jabodetabek. Harga belum termasuk PPN 11%. Masa berlaku penawaran 14 hari. Pembayaran paling lambat 14 hari setelah invoice diterima.",
    documentApproval: {
      place: "Jakarta",
      date: "2025-01-10",
      signerName: "Eko Budianto",
      signerPosition: "Direktur",
    },
    status: "draft",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "PP-002",
    coverInfo: {
      jobOffer: "PENGEMBANGAN SISTEM MANAJEMEN DOKUMEN",
      companyName: "PT. Alugra Digital Indonesia",
      proposalMonth: "Februari 2025",
      address: "Jl. Gatot Subroto No. 45, Jakarta Selatan",
      phone: "+62 21 5551234",
      email: "contact@alugra.co.id",
    },
    proposalNumber: "PP/ALU/0225/0001",
    clientInfo: {
      clientId: "C001",
      clientName: "PT Bank Mandiri",
      contactPerson: "Budi Santoso",
      email: "budi.santoso@mandiri.co.id",
      phone: "+62 21 7890123",
    },
    items: [
      {
        number: 1,
        description: "Analisis kebutuhan dan desain sistem",
        quantity: 1,
        volume: "Project",
        unitPrice: 150_000_000,
        totalPrice: 150_000_000,
      },
      {
        number: 2,
        description: "Pengembangan aplikasi core",
        quantity: 3,
        volume: "Bulannya",
        unitPrice: 80_000_000,
        totalPrice: 240_000_000,
      },
    ],
    totalEstimatedCost: 390_000_000,
    totalEstimatedCostInWords: "Tiga Ratus Sembilan Puluh Juta Rupiah",
    currency: "IDR",
    scopeOfWork: [
      "Workshop requirement gathering",
      "Design dan development",
      "Testing dan deployment",
      "Training user",
    ],
    termsAndConditions: [
      "Harga belum termasuk PPN",
      "Pembayaran 50% di awal, 50% setelah delivery",
      "Support 3 bulan setelah go-live",
    ],
    documentApproval: {
      place: "Jakarta",
      date: "2025-02-12",
      signerName: "William Kristiawan",
      signerPosition: "Direktur",
    },
    status: "sent",
    createdAt: "2025-02-12T09:00:00Z",
    updatedAt: "2025-02-12T09:00:00Z",
  },
];
