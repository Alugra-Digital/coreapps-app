export interface KasBankTransactionLine {
  id: number;
  kasBankTransactionId: number;
  accountNumber: string;
  accountName?: string | null;
  debit: string;
  credit: string;
  description?: string | null;
  createdAt?: string;
}

export interface KasBankTransaction {
  id: number;
  periodId: number;
  transactionCode: string;
  transNumber?: string | null;
  date: string;
  coaAccount: string;
  description: string;
  inflow: string;
  outflow: string;
  openingBalance?: string;
  runningBalance: string;
  reference?: string | null;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  lines?: KasBankTransactionLine[];
  voucherCode?: string | null;
}

export interface KasBankSummary {
  totalInflow: number;
  totalOutflow: number;
  closingBalance: number;
}

export interface KasBankListResponse {
  periodId: number;
  summary: KasBankSummary;
  transactions: KasBankTransaction[];
}

export interface KasBankTransactionLineInput {
  accountNumber: string;
  accountName?: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface CreateKasBankInput {
  periodId: number;
  date: string;
  coaAccount: string;
  description: string;
  inflow: number;
  outflow: number;
  reference?: string | null;
  lines?: KasBankTransactionLineInput[];
  voucherCode?: string;
}

export type UpdateKasBankInput = Partial<Omit<CreateKasBankInput, 'periodId'>>;
