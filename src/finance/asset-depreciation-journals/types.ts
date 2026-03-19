export type AssetJournalStatus = 'DRAFT' | 'POSTED';

export interface AssetDepreciationJournal {
  id: number;
  assetId: number;
  periodId?: number | null;
  date: string;
  amount: string;
  description?: string | null;
  status: AssetJournalStatus;
  journalEntryId?: number | null;
  createdAt?: string;
  assetName?: string | null;
  assetCode?: string | null;
  coaDepreciationExpense?: string | null;
  coaAccumulatedDepreciation?: string | null;
}

export interface GenerateDepreciationInput {
  periodId: number;
}

export interface GenerateResult {
  generated: number;
  skipped: number;
  message: string;
}

export interface PostAllResult {
  posted: number;
  message: string;
}
