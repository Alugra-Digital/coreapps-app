/** Company info (header) - Kop Surat, Nama Perusahaan, Logo, Alamat, Telepon */
export interface CompanyInfo {
  letterhead?: string;
  companyName: string;
  logoUrl?: string;
  address: string;
  phone: string;
}

/** Order info - Tanggal PO, No. PO, Doc. Reference */
export interface OrderInfo {
  poDate: string;
  poNumber: string;
  docReference?: string;
}

/** Vendor PIC - Nama, Jabatan, Kontak */
export interface VendorPic {
  name: string;
  position: string;
  contact?: string;
}

/** Vendor info - Nama Vendor, No. Telepon, PIC */
export interface VendorInfo {
  vendorName: string;
  phone: string;
  pic: VendorPic;
}

/** Line item - No, Item, Qty, Unit, Price, Subtotal, Tax, Price After Tax */
export interface PurchaseOrderLineItem {
  number: number;
  itemDescription: string;
  quantity: number;
  unit: string;
  price: number;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  priceAfterTax?: number;
}

/** Document approval - Jabatan, Nama, TTD */
export interface DocumentApproval {
  position: string;
  name: string;
  signatureUrl?: string;
}

/** Main Purchase Order entity */
export interface PurchaseOrder {
  id: string;
  companyInfo: CompanyInfo;
  orderInfo: OrderInfo;
  vendorInfo: VendorInfo;
  lineItems: PurchaseOrderLineItem[];
  paymentProcedure?: string;
  otherTerms?: string;
  approval: DocumentApproval;
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PurchaseOrderCreateInput = Omit<PurchaseOrder, "id" | "createdAt" | "updatedAt">;
export type PurchaseOrderUpdateInput = Partial<PurchaseOrderCreateInput>;
