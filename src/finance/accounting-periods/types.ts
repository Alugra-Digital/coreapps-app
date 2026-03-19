export type PeriodStatus = 'OPEN' | 'CLOSED' | 'LOCKED';

export interface AccountingPeriod {
  id: number;
  year: number;
  month: number;
  status: PeriodStatus;
  closedAt?: string | null;
  closedBy?: number | null;
  reopenedAt?: string | null;
  reopenedReason?: string | null;
  createdAt?: string;
  periodOpeningBalances?: {
    kasKecil: number;
    kasBank: number;
  };
  kk_sequence?: number;
  km_sequence?: number;
  bk_sequence?: number;
  bm_sequence?: number;
  jm_sequence?: number;
}

export interface CreatePeriodInput {
  year: number;
  month: number;
}

export interface PeriodValidationResult {
  canClose: boolean;
  warnings: string[];
  errors: string[];
}

export interface GenerateNumberResult {
  code: string;
}
