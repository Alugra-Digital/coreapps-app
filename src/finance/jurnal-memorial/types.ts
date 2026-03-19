export type JurnalMemorialStatus = 'DRAFT' | 'POSTED';

export interface JurnalMemorialLine {
  id?: number;
  jurnalMemorialId?: number;
  accountNumber: string;
  accountName: string;
  debit: string;
  credit: string;
  lineDescription?: string | null;
}

export interface JurnalMemorial {
  id: number;
  periodId: number;
  journalCode: string;
  date: string;
  description: string;
  status: JurnalMemorialStatus;
  lines: JurnalMemorialLine[];
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface JurnalMemorialListResponse {
  periodId: number;
  journals: JurnalMemorial[];
}

export interface CreateJurnalMemorialLineInput {
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  lineDescription?: string | null;
}

export interface CreateJurnalMemorialInput {
  periodId: number;
  date: string;
  description: string;
  lines: CreateJurnalMemorialLineInput[];
}

export interface UpdateJurnalMemorialInput {
  date?: string;
  description?: string;
  lines?: CreateJurnalMemorialLineInput[];
}
