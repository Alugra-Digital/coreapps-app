import { api } from '@/lib/api/client';
import type {
  AssetAcquisitionJournal,
  CreateAssetAcquisitionJournalInput,
  UpdateAssetAcquisitionJournalInput,
} from '@/finance/asset-acquisition-journals/types';
import type {
  AssetDepreciationJournal,
  GenerateDepreciationInput,
  GenerateResult,
  PostAllResult,
} from '@/finance/asset-depreciation-journals/types';

const ACQ_BASE = '/api/finance/asset-acquisition-journals';
const DEP_BASE = '/api/finance/asset-depreciation-journals';

// ── Acquisition Journals (Jurnal Memori Aset) ────────────────────────────────

export async function getAcquisitionJournals(periodId: number): Promise<AssetAcquisitionJournal[]> {
  return api.get<AssetAcquisitionJournal[]>(`${ACQ_BASE}?periodId=${periodId}`);
}

export async function getAcquisitionJournalById(id: number): Promise<AssetAcquisitionJournal> {
  return api.get<AssetAcquisitionJournal>(`${ACQ_BASE}/${id}`);
}

export async function createAcquisitionJournal(input: CreateAssetAcquisitionJournalInput): Promise<AssetAcquisitionJournal> {
  return api.post<AssetAcquisitionJournal>(ACQ_BASE, input);
}

export async function updateAcquisitionJournal(id: number, input: UpdateAssetAcquisitionJournalInput): Promise<AssetAcquisitionJournal> {
  return api.put<AssetAcquisitionJournal>(`${ACQ_BASE}/${id}`, input);
}

export async function postAcquisitionJournal(id: number): Promise<AssetAcquisitionJournal> {
  return api.post<AssetAcquisitionJournal>(`${ACQ_BASE}/${id}/post`, {});
}

export async function deleteAcquisitionJournal(id: number): Promise<void> {
  return api.delete<void>(`${ACQ_BASE}/${id}`);
}

// ── Depreciation Journals (Jurnal Penyusutan Aset) ────────────────────────────

export async function getDepreciationJournals(periodId: number): Promise<AssetDepreciationJournal[]> {
  return api.get<AssetDepreciationJournal[]>(`${DEP_BASE}?periodId=${periodId}`);
}

export async function generateDepreciationJournals(input: GenerateDepreciationInput): Promise<GenerateResult> {
  return api.post<GenerateResult>(`${DEP_BASE}/generate`, input);
}

export async function postAllDepreciationJournals(input: GenerateDepreciationInput): Promise<PostAllResult> {
  return api.post<PostAllResult>(`${DEP_BASE}/post-all`, input);
}

export async function deleteDepreciationJournal(id: number): Promise<void> {
  return api.delete<void>(`${DEP_BASE}/${id}`);
}
