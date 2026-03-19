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
  name?: string;
  position?: string;
  contact?: string;
}

/** Vendor info - Nama Vendor, No. Telepon, PIC (optional when clientId is used) */
export interface VendorInfo {
  vendorName?: string;
  phone?: string;
  pic?: VendorPic;
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

export type PurchaseOrderStatus = 'DRAFT' | 'APPROVED' | 'SENT' | 'RECEIVED';

/** Main Purchase Order entity */
export interface PurchaseOrder {
  id: string;
  clientId?: number | null;
  projectId?: number | null;
  status?: PurchaseOrderStatus;
  /** JSONB column — may be null for older records */
  companyInfo: CompanyInfo | null;
  /** JSONB column — may be null for older records */
  orderInfo: OrderInfo | null;
  /** JSONB column — may be null for older records */
  vendorInfo: VendorInfo | null;
  lineItems: PurchaseOrderLineItem[];
  paymentProcedure?: string | null;
  otherTerms?: string | null;
  /** JSONB column — may be null for older records */
  approval: DocumentApproval | null;
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PurchaseOrderCreateInput = {
  clientId?: number | null;
  projectId?: number | null;
  companyInfo: CompanyInfo;
  orderInfo: OrderInfo;
  vendorInfo: VendorInfo;
  lineItems: PurchaseOrderLineItem[];
  paymentProcedure?: string;
  otherTerms?: string;
  approval: DocumentApproval;
};

export type PurchaseOrderUpdateInput = Partial<PurchaseOrderCreateInput> & {
  status?: PurchaseOrderStatus;
};
