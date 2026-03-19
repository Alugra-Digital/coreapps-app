export interface KasKecilTransaction {
  id: number;
  periodId: number;
  transNumber: string;
  date: string;
  description: string;
  debit: string;
  credit: string;
  runningBalance: string;
  attachmentUrl?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  voucherCode?: string | null;
}

export interface KasKecilSummary {
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
}

export interface KasKecilListResponse {
  periodId: number;
  summary: KasKecilSummary;
  transactions: KasKecilTransaction[];
}

export interface CreateKasKecilInput {
  periodId: number;
  date: string;
  description: string;
  debit: number;
  credit: number;
  attachmentUrl?: string | null;
  accountNumber: string;
  accountName: string;
  saldoFromPeriodId?: number | null;
  voucherCode?: string;
}

export type UpdateKasKecilInput = Partial<Omit<CreateKasKecilInput, 'periodId'>>;
