import type { Vendor } from "./types";

export const mockVendors: Vendor[] = [
  {
    id: "V001",
    name: "PT Teknologi Nusantara",
    companyName: "PT Teknologi Nusantara",
    address: "Jl. Sudirman No. 100",
    phone: "021-5551234",
    email: "vendor@teknus.co.id",
    npwp: "02.345.678.9-012.000",
    pic: { name: "Bambang Wijaya", position: "Finance", contact: "08123456789" },
    bankName: "BCA",
    bankAccount: "1234567890",
    bankBranch: "Jakarta Pusat",
    isActive: true,
  },
  {
    id: "V002",
    name: "CV Mitra Jaya",
    companyName: "CV Mitra Jaya",
    address: "Jl. Gatot Subroto 50",
    phone: "021-5555678",
    email: "info@mitrajaya.co.id",
    pic: { name: "Siti Aminah", position: "Owner", contact: "08234567890" },
    bankName: "Mandiri",
    bankAccount: "9876543210",
    bankBranch: "Jakarta Selatan",
    isActive: true,
  },
];
