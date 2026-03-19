import { z } from 'zod';

export const ASSET_CATEGORIES = ['BUILDING', 'MACHINERY', 'VEHICLES', 'FURNITURE', 'ELECTRONICS'] as const;
export const ASSET_STATUSES = ['ACTIVE', 'SOLD', 'SCRAPPED'] as const;
export const DEPRECIATION_METHODS = ['SLM', 'WDV', 'MANUAL'] as const;

export const ASSET_CATEGORY_LABELS: Record<string, string> = {
  BUILDING: 'Gedung/Bangunan',
  MACHINERY: 'Mesin',
  VEHICLES: 'Kendaraan',
  FURNITURE: 'Perabot',
  ELECTRONICS: 'Elektronik',
};

export const DEPRECIATION_METHOD_LABELS: Record<string, string> = {
  SLM: 'Garis Lurus (SLM)',
  WDV: 'Saldo Menurun (WDV)',
  MANUAL: 'Manual',
};

export const assetFormSchema = z.object({
  assetCode: z.string().optional().nullable().or(z.literal('')),
  assetTypeCode: z.string().min(1, 'Jenis aset wajib dipilih'),
  name: z.string().min(1, 'Nama aset wajib diisi'),
  specification: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.enum(ASSET_CATEGORIES),
  purchaseDate: z.string().min(1, 'Tanggal perolehan wajib diisi'),
  purchaseAmount: z.coerce.number().positive('Harga perolehan harus lebih dari 0'),
  salvageValue: z.coerce.number().min(0).optional().default(0),
  usefulLifeMonths: z.coerce.number().int().positive().optional().nullable(),
  location: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  vendor: z.string().optional().nullable(),
  attachmentUrl: z.string().url('URL tidak valid').optional().nullable(),
  depreciationMethod: z.enum(DEPRECIATION_METHODS).default('SLM'),
  coaAssetAccount: z.string().optional().nullable(),
  coaDepreciationExpenseAccount: z.string().optional().nullable(),
  coaAccumulatedDepreciationAccount: z.string().optional().nullable(),
  status: z.enum(ASSET_STATUSES).default('ACTIVE'),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
