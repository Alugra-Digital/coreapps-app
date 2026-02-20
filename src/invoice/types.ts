/** Company info (seller) - Kop Surat, Nama Perusahaan, Logo, Alamat, Telepon */
export interface CompanyInfo {
  letterhead?: string;
  companyName: string;
  logoUrl?: string;
  address: string;
  phone: string;
}

/** Invoice info - Nama Invoice, No. Invoice, Tanggal Inv., Faktur Pajak, Jatuh Tempo */
export interface InvoiceInfo {
  invoiceName: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxInvoice?: string;
  dueDate: string;
}

/** Billing PIC - Nama, Jabatan, Kontak */
export interface BillingPic {
  name: string;
  position: string;
  contact?: string;
}

/** Billing info (buyer) - Nama Perusahaan, Alamat, Telepon, PIC */
export interface BillingInfo {
  companyName: string;
  address: string;
  phone: string;
  pic: BillingPic;
}

/** Line item - No, Item, Qty, Unit, Price, Subtotal, DPP, Tax, Price After Tax */
export interface InvoiceLineItem {
  number: number;
  itemDescription: string;
  quantity: number;
  unit: string;
  price: number;
  subtotal: number;
  dpp?: number;
  taxRate?: number;
  taxAmount?: number;
  priceAfterTax?: number;
}

/** Payment info - Bank, No. Rek, Cabang, Nama Akun, NPWP */
export interface PaymentInfo {
  bank: string;
  accountNumber: string;
  branch: string;
  accountName: string;
  npwp?: string;
}

/** Document approval - Jabatan, Nama, TTD */
export interface DocumentApproval {
  position: string;
  name: string;
  signatureUrl?: string;
}

/** Main Invoice entity */
export interface Invoice {
  id: string;
  companyInfo: CompanyInfo;
  invoiceInfo: InvoiceInfo;
  billingInfo: BillingInfo;
  lineItems: InvoiceLineItem[];
  paymentInfo: PaymentInfo;
  approval: DocumentApproval;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type InvoiceCreateInput = Omit<Invoice, "id" | "createdAt" | "updatedAt">;
export type InvoiceUpdateInput = Partial<InvoiceCreateInput>;
