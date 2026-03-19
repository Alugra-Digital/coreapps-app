import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Search, DollarSign, TrendingDown, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { useAssets, useDeleteAsset } from '@/hooks/useAssets';
import type { Asset, AssetCategory } from './types';
import { ASSET_CATEGORY_LABELS } from './schema';

const formatRp = (val: string | number | null | undefined) =>
  val != null ? `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}` : '—';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Aktif', className: 'bg-green-700/80 text-green-100' },
  SOLD: { label: 'Dijual', className: 'bg-blue-700/80 text-blue-100' },
  SCRAPPED: { label: 'Diafkir', className: 'bg-zinc-600/80 text-zinc-300' },
};

export default function AssetsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'ALL'>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);

  const { data: assets = [], isLoading } = useAssets();
  const deleteMutation = useDeleteAsset();

  const filtered = assets.filter((a) => {
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.assetCode ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Aset berhasil dihapus');
      setDeleteTarget(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus aset');
    }
  };

  const totalNBV = filtered.reduce(
    (s, a) => s + Number(a.valueAfterDepreciation ?? a.purchaseAmount),
    0
  );
  const totalCost = filtered.reduce((s, a) => s + Number(a.purchaseAmount), 0);
  const totalDepreciation = filtered.reduce((s, a) => s + Number(a.totalDepreciation ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Daftar Aset Tetap
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Laporan aset tetap dan jadwal penyusutan
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/finance/assets/create')}
            className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah Aset
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FinanceStatCard
            title="Total Harga Perolehan"
            value={formatRp(totalCost)}
            description="Total nilai perolehan aset"
            icon={<DollarSign className="h-6 w-6" />}
            color="#3b82f6"
          />
          <FinanceStatCard
            title="Total Penyusutan"
            value={formatRp(totalDepreciation)}
            description="Akumulasi penyusutan"
            icon={<TrendingDown className="h-6 w-6" />}
            color="#ef4444"
          />
          <FinanceStatCard
            title="Nilai Buku Bersih (NBV)"
            value={formatRp(totalNBV)}
            description="Nilai bersih setelah penyusutan"
            icon={<Wallet className="h-6 w-6" />}
            color="#22c55e"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B75]" />
            <Input
              placeholder="Cari kode / nama aset..."
              className="pl-10 bg-[#111113] border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl py-2.5 pr-4 focus:ring-1 focus:ring-[#F5A623] outline-none transition-all placeholder:text-[#6B6B75]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as AssetCategory | 'ALL')}
          >
            <SelectTrigger className="w-[180px] bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#111113] border-[#1E1E22]">
              <SelectItem value="ALL" className="text-[#F0F0F0] focus:bg-[#1E1E22]">
                Semua Kategori
              </SelectItem>
              {Object.entries(ASSET_CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-[#F0F0F0] focus:bg-[#1E1E22]">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0A0A0B]">
                <TableRow className="hover:bg-transparent border-[#1E1E22]">
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">
                    Kode Aset
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Nama Aset
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[120px]">
                    Kategori
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">
                    Tgl. Perolehan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Harga Perolehan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Total Penyusutan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    NBV
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[80px]">
                    Status
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={9}
                      className="text-center text-[#6B6B75] py-16 border-[#1E1E22]"
                    >
                      <div className="h-32 flex flex-col items-center justify-center gap-4">
                        <div className="h-10 w-10 rounded-lg border border-[#1E1E22] p-2 flex items-center justify-center">
                          <span className="h-5 w-5 rounded bg-[#F5A623]/30 loader-cube" />
                        </div>
                        <p className="text-sm font-medium">Memuat data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={9}
                      className="text-center text-[#6B6B75] py-10 border-[#1E1E22]"
                    >
                      Tidak ada aset ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((asset) => {
                    const nbv = Number(
                      asset.valueAfterDepreciation ?? asset.purchaseAmount
                    );
                    const totalDep = Number(asset.totalDepreciation ?? 0);
                    const cfg = STATUS_CONFIG[asset.status] ?? STATUS_CONFIG.ACTIVE;
                    return (
                      <TableRow
                        key={asset.id}
                        className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                      >
                        <TableCell className="font-mono text-xs text-[#F0F0F0]">
                          {asset.assetCode ?? '—'}
                        </TableCell>
                        <TableCell className="font-medium text-sm text-[#F0F0F0]">
                          {asset.name}
                        </TableCell>
                        <TableCell className="text-sm text-[#F0F0F0]">
                          {ASSET_CATEGORY_LABELS[asset.category] ?? asset.category}
                        </TableCell>
                        <TableCell className="text-sm text-[#F0F0F0]">
                          {asset.purchaseDate?.slice(0, 10)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-[#F0F0F0]">
                          {formatRp(asset.purchaseAmount)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-red-500">
                          {formatRp(totalDep)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-green-500">
                          {formatRp(nbv)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${cfg.className}`}>
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-[#1E1E22] rounded-lg"
                              onClick={() => navigate(`/finance/assets/${asset.id}`)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-[#1E1E22] rounded-lg"
                              onClick={() => navigate(`/finance/assets/${asset.id}/edit`)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              onClick={() => setDeleteTarget(asset)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#F0F0F0]">
                Hapus Aset?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B6B75]">
                Aset <strong className="text-[#F0F0F0]">{deleteTarget?.name}</strong> akan
                dinonaktifkan (soft delete).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22]">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
