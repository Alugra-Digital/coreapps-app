import { api } from '@/lib/api/client';
import type { Asset, CreateAssetInput, UpdateAssetInput } from '@/finance/assets/types';

export interface AssetType {
  code: string;
  name: string;
  usefulLifeMonths: number;
  depreciationMethod: string;
}

const BASE = '/api/assets';

export async function getAssets(): Promise<Asset[]> {
  return api.get<Asset[]>(BASE);
}

export async function getAssetById(id: number): Promise<Asset> {
  return api.get<Asset>(`${BASE}/${id}`);
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  return api.post<Asset>(BASE, input);
}

export async function updateAsset(id: number, input: UpdateAssetInput): Promise<Asset> {
  return api.put<Asset>(`${BASE}/${id}`, input);
}

export async function deleteAsset(id: number): Promise<void> {
  return api.delete<void>(`${BASE}/${id}`);
}

export async function getAssetTypes(): Promise<AssetType[]> {
  return api.get<AssetType[]>(`${BASE}/types`);
}

export async function checkAssetCode(code: string): Promise<{ exists: boolean }> {
  return api.get<{ exists: boolean }>(`${BASE}/check-code/${code}`);
}

export async function getNextAssetCode(typeCode: string, month: number, year: number): Promise<{ code: string }> {
  return api.get<{ code: string }>(`${BASE}/next-code/${typeCode}/${month}/${year}`);
}
