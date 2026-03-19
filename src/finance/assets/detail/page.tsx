import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, MapPin, Building2, Calendar, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAssetById } from '@/hooks/useAssets';
import { ASSET_CATEGORY_LABELS, DEPRECIATION_METHOD_LABELS } from '../schema';

const formatRp = (val: string | number | null | undefined) =>
  val != null ? `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}` : '—';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Aktif', className: 'bg-green-700/80 text-green-100' },
  SOLD: { label: 'Dijual', className: 'bg-blue-700/80 text-blue-100' },
  SCRAPPED: { label: 'Diafkir', className: 'bg-zinc-600/80 text-zinc-300' },
};

export default function AssetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: asset, isLoading } = useAssetById(id ? Number(id) : undefined);

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-32 flex flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 rounded-lg border border-[#1E1E22] p-2 flex items-center justify-center">
              <span className="h-5 w-5 rounded bg-[#F5A623]/30 loader-cube" />
            </div>
            <p className="text-[#6B6B75] text-sm font-medium">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  if (!asset)
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-500">Aset tidak ditemukan.</p>
        </div>
      </div>
    );

  const cfg = STATUS_CONFIG[asset.status] ?? STATUS_CONFIG.ACTIVE;
  const nbv = Number(asset.valueAfterDepreciation ?? asset.purchaseAmount);
  const totalDep = Number(asset.totalDepreciation ?? 0);
  const purchaseAmt = Number(asset.purchaseAmount);
  const salvage = Number(asset.salvageValue ?? 0);
  const monthlyDep = asset.usefulLifeMonths
    ? (purchaseAmt - salvage) / asset.usefulLifeMonths
    : null;
  const depPct = purchaseAmt > 0 ? (totalDep / purchaseAmt) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B6B75] hover:text-[#F5A623] hover:bg-[#1E1E22] rounded-xl"
              onClick={() => navigate('/finance/assets')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
                  {asset.name}
                </h1>
                <Badge className={`text-xs ${cfg.className}`}>{cfg.label}</Badge>
              </div>
              <p className="text-[#6B6B75] text-sm font-mono">{asset.assetCode ?? '—'}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
            onClick={() => navigate(`/finance/assets/${asset.id}/edit`)}
          >
            <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
        </div>

        {/* NBV summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: 'Harga Perolehan',
              value: formatRp(purchaseAmt),
              color: 'text-[#F0F0F0]',
            },
            {
              label: 'Total Penyusutan',
              value: formatRp(totalDep),
              color: 'text-red-500',
            },
            {
              label: 'Nilai Buku Bersih (NBV)',
              value: formatRp(nbv),
              color: 'text-green-500',
            },
          ].map((c) => (
            <Card key={c.label} className="bg-[#111113] border-[#1E1E22]">
              <CardContent className="pt-4">
                <p className="text-xs text-[#6B6B75]">{c.label}</p>
                <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Depreciation progress bar */}
        {purchaseAmt > 0 && (
          <Card className="bg-[#111113] border-[#1E1E22]">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B75]">Progress Penyusutan</span>
                <span className="font-medium text-[#F0F0F0]">{depPct.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#1E1E22] rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(depPct, 100)}%` }}
                />
              </div>
              {monthlyDep != null && (
                <p className="text-xs text-[#6B6B75]">
                  Penyusutan per bulan: <strong className="text-[#F0F0F0]">{formatRp(monthlyDep)}</strong>
                  {asset.usefulLifeMonths &&
                    ` · Masa manfaat: ${asset.usefulLifeMonths} bulan`}
                  {` · Nilai residu: ${formatRp(salvage)}`}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Asset details */}
          <Card className="bg-[#111113] border-[#1E1E22]">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#F0F0F0]">
                Detail Aset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#6B6B75]" />
                <span className="text-[#6B6B75]">Kategori:</span>
                <span className="text-[#F0F0F0]">
                  {ASSET_CATEGORY_LABELS[asset.category] ?? asset.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6B6B75]" />
                <span className="text-[#6B6B75]">Tgl Perolehan:</span>
                <span className="text-[#F0F0F0]">{asset.purchaseDate?.slice(0, 10)}</span>
              </div>
              {asset.vendor && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Vendor:</span>
                  <span className="text-[#F0F0F0]">{asset.vendor}</span>
                </div>
              )}
              {asset.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Lokasi:</span>
                  <span className="text-[#F0F0F0]">{asset.location}</span>
                </div>
              )}
              {asset.department && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Departemen:</span>
                  <span className="text-[#F0F0F0]">{asset.department}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* COA settings */}
          <Card className="bg-[#111113] border-[#1E1E22]">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#F0F0F0]">
                Akun & Penyusutan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-[#6B6B75]">Metode:</span>
                <span className="ml-2 text-[#F0F0F0]">
                  {DEPRECIATION_METHOD_LABELS[asset.depreciationMethod] ??
                    asset.depreciationMethod}
                </span>
              </div>
              {asset.coaAssetAccount && (
                <div>
                  <span className="text-[#6B6B75]">Akun Aset:</span>
                  <span className="ml-2 font-mono text-[#F0F0F0]">
                    {asset.coaAssetAccount}
                  </span>
                </div>
              )}
              {asset.coaDepreciationExpenseAccount && (
                <div>
                  <span className="text-[#6B6B75]">Beban Penyusutan:</span>
                  <span className="ml-2 font-mono text-[#F0F0F0]">
                    {asset.coaDepreciationExpenseAccount}
                  </span>
                </div>
              )}
              {asset.coaAccumulatedDepreciationAccount && (
                <div>
                  <span className="text-[#6B6B75]">Akumulasi Penyusutan:</span>
                  <span className="ml-2 font-mono text-[#F0F0F0]">
                    {asset.coaAccumulatedDepreciationAccount}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
