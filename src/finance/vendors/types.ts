export interface VendorPic {
  name: string;
  position?: string;
  contact?: string;
}

export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  address?: string;
  phone?: string;
  email?: string;
  npwp?: string;
  pic?: VendorPic;
  bankName?: string;
  bankAccount?: string;
  bankBranch?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type VendorCreateInput = Omit<Vendor, "id" | "createdAt" | "updatedAt">;
export type VendorUpdateInput = Partial<VendorCreateInput>;
