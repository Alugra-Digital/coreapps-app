export type VoucherType = 'KAS_KECIL' | 'KAS_BANK';
export type VoucherStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'APPROVED'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export interface VoucherLine {
  id?: number;
  voucherId?: number;
  accountNumber: string;
  accountName: string;
  description?: string | null;
  debit: string;
  credit: string;
}

export interface Voucher {
  id: number;
  periodId: number;
  voucherNumber: string;
  voucherType: VoucherType;
  date: string;
  payee: string;
  description: string;
  totalAmount: string;
  paymentMethod?: string | null;
  preparedBy?: number | null;
  reviewedBy?: number | null;
  approvedBy?: number | null;
  receivedBy?: string | null;
  status: VoucherStatus;
  reviewedAt?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  rejectionReason?: string | null;
  attachmentUrl?: string | null;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  lines: VoucherLine[];
}

export interface VoucherListResponse {
  periodId: number;
  vouchers: Voucher[];
}

export interface CreateVoucherLineInput {
  accountNumber: string;
  accountName: string;
  description?: string | null;
  debit: number;
  credit: number;
}

export interface CreateVoucherInput {
  periodId: number;
  voucherType: VoucherType;
  date: string;
  payee: string;
  description: string;
  paymentMethod?: string | null;
  receivedBy?: string | null;
  attachmentUrl?: string | null;
  lines: CreateVoucherLineInput[];
}

export type UpdateVoucherInput = Partial<Omit<CreateVoucherInput, 'periodId' | 'voucherType'>>;
