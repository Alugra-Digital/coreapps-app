export type AssetCategory = 'BUILDING' | 'MACHINERY' | 'VEHICLES' | 'FURNITURE' | 'ELECTRONICS';
export type AssetStatus = 'ACTIVE' | 'SOLD' | 'SCRAPPED';
export type DepreciationMethod = 'SLM' | 'WDV' | 'MANUAL';

export interface Asset {
  id: number;
  assetCode?: string | null;
  assetTypeCode?: string | null;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  purchaseAmount: string;
  salvageValue?: string | null;
  usefulLifeMonths?: number | null;
  ownerId?: number | null;
  location?: string | null;
  department?: string | null;
  vendor?: string | null;
  specification?: string | null;
  description?: string | null;
  attachmentUrl?: string | null;
  depreciationMethod: DepreciationMethod;
  coaAssetAccount?: string | null;
  coaDepreciationExpenseAccount?: string | null;
  coaAccumulatedDepreciationAccount?: string | null;
  totalDepreciation?: string | null;
  valueAfterDepreciation?: string | null;
  status: AssetStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssetInput {
  assetCode?: string;
  assetTypeCode?: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  purchaseAmount: number;
  salvageValue?: number;
  usefulLifeMonths?: number;
  location?: string;
  department?: string;
  vendor?: string;
  specification?: string;
  description?: string;
  attachmentUrl?: string;
  depreciationMethod?: DepreciationMethod;
  coaAssetAccount?: string;
  coaDepreciationExpenseAccount?: string;
  coaAccumulatedDepreciationAccount?: string;
  status?: AssetStatus;
}

export type UpdateAssetInput = Partial<CreateAssetInput>;
