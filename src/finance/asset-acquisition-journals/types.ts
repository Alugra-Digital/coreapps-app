export type AssetJournalStatus = 'DRAFT' | 'POSTED';

export interface AssetAcquisitionJournal {
  id: number;
  periodId: number;
  assetId: number;
  journalCode: string;
  date: string;
  description: string;
  debitAccount: string;
  debitAccountName: string;
  creditAccount: string;
  creditAccountName: string;
  amount: string;
  notes?: string | null;
  status: AssetJournalStatus;
  journalEntryId?: number | null;
  createdBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  assetName?: string | null;
  assetCode?: string | null;
}

export interface CreateAssetAcquisitionJournalInput {
  periodId: number;
  assetId: number;
  date: string;
  description: string;
  debitAccount: string;
  debitAccountName: string;
  creditAccount: string;
  creditAccountName: string;
  amount: number;
  notes?: string | null;
}

export type UpdateAssetAcquisitionJournalInput = Partial<
  Omit<CreateAssetAcquisitionJournalInput, 'periodId' | 'assetId'>
>;
