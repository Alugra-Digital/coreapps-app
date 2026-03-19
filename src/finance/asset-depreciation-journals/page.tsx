import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Send, Trash2, BarChart3, TrendingDown, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import { useAccountingPeriods } from '@/hooks/useAccountingPeriods';
import {
  useDepreciationJournals,
  useGenerateDepreciation,
  usePostAllDepreciation,
  useDeleteDepreciationJournal,
} from '@/hooks/useAssetJournals';
import type { AssetDepreciationJournal } from './types';
import { exportToExcel, type ExcelColumn } from '@/lib/export';
import { FileText } from 'lucide-react';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const formatRp = (val: string | number | null | undefined) =>
  val != null ? `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}` : '—';

export default function AssetDepreciationJournalsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [deleteTarget, setDeleteTarget] = useState<AssetDepreciationJournal | null>(null);

  const { data: periods = [] } = useAccountingPeriods();
  const activePeriod = periods.find((p) => p.year === year && p.month === month);

  const { data: journals = [], isLoading } = useDepreciationJournals(activePeriod?.id);
  const generateMutation = useGenerateDepreciation();
  const postAllMutation = usePostAllDepreciation();
  const deleteMutation = useDeleteDepreciationJournal();

  const isPeriodClosed = activePeriod && activePeriod.status !== 'OPEN';
  const hasDrafts = journals.some((j) => j.status === 'DRAFT');
  const totalAmount = journals.reduce((s, j) => s + Number(j.amount), 0);
  const postedCount = journals.filter((j) => j.status === 'POSTED').length;

  const handleGenerate = async () => {
    if (!activePeriod) {
      toast.error('Buat periode terlebih dahulu');
      return;
    }
    try {
      const result = await generateMutation.mutateAsync({ periodId: activePeriod.id });
      toast.success(result.message);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal generate penyusutan');
    }
  };

  const handlePostAll = async () => {
    if (!activePeriod) return;
    try {
      const result = await postAllMutation.mutateAsync({ periodId: activePeriod.id });
      toast.success(result.message);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal posting penyusutan');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Entri penyusutan dihapus');
      setDeleteTarget(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Jurnal Penyusutan Aset
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Generate dan posting jurnal penyusutan bulanan
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <PeriodSelector
              year={year}
              month={month}
              onChange={(y, m) => {
                setYear(y);
                setMonth(m);
              }}
            />
            <Button
              size="sm"
              variant="outline"
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
              onClick={handleGenerate}
              disabled={!!isPeriodClosed || generateMutation.isPending}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${
                  generateMutation.isPending ? 'animate-spin' : ''
                }`}
              />
              Generate Penyusutan
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (journals.length === 0) {
                  toast.error('Tidak ada data untuk di-export');
                  return;
                }
                const monthName = MONTHS[month - 1];
                const filename = `Penyusutan-${monthName}-${year}`;
                const exportData = journals.map(j => ({
                  kodeAset: j.assetCode ?? '—',
                  namaAset: j.assetName ?? `ID: ${j.assetId}`,
                  tanggal: j.date,
                  keterangan: j.description ?? '—',
                  jumlahPenyusutan: formatRp(j.amount),
                  status: j.status === 'POSTED' ? 'Diposting' : 'Draft',
                }));
                const columns: ExcelColumn[] = [
                  { header: 'Kode Aset', key: 'kodeAset', width: 15 },
                  { header: 'Nama Aset', key: 'namaAset', width: 30 },
                  { header: 'Tanggal', key: 'tanggal', width: 15 },
                  { header: 'Keterangan', key: 'keterangan', width: 30 },
                  { header: 'Jumlah Penyusutan', key: 'jumlahPenyusutan', width: 18 },
                  { header: 'Status', key: 'status', width: 12 },
                ];
                exportToExcel(exportData, columns, { filename });
                toast.success('Data berhasil di-export ke Excel');
              }}
              disabled={isLoading || journals.length === 0}
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-6 rounded-xl"
            >
              <FileText className="w-4 h-4 mr-1" />
              Export Excel
            </Button>
            {hasDrafts && !isPeriodClosed && (
              <Button
                size="sm"
                onClick={handlePostAll}
                disabled={postAllMutation.isPending}
                className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#F5A623]/10"
              >
                <Send className="w-4 h-4 mr-1" />
                Post Semua
              </Button>
            )}
          </div>
        </div>

        {isPeriodClosed && (
          <div className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">
            Periode ini sudah ditutup. Data hanya bisa dilihat.
          </div>
        )}

        {journals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FinanceStatCard
              title="Total Aset"
              value={String(journals.length)}
              description="Aset dengan penyusutan"
              icon={<BarChart3 className="h-6 w-6" />}
              color="#3b82f6"
            />
            <FinanceStatCard
              title="Total Penyusutan Bulan Ini"
              value={formatRp(totalAmount)}
              description="Total beban penyusutan"
              icon={<TrendingDown className="h-6 w-6" />}
              color="#ef4444"
            />
            <FinanceStatCard
              title="Sudah Diposting"
              value={`${postedCount} / ${journals.length}`}
              description="Jurnal yang sudah diposting"
              icon={<CheckCircle className="h-6 w-6" />}
              color="#22c55e"
            />
          </div>
        )}

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
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Keterangan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Jumlah Penyusutan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[90px]">
                    Status
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={7}
                      className="text-center text-[#6B6B75] py-16 border-[#1E1E22]"
                    >
                      <div className="h-32 flex flex-col items-center justify-center gap-4">
                        <div className="h-10 w-10 rounded-lg border border-[#1E1E22] p-2 flex items-center justify-center">
                          <span className="h-5 w-5 rounded bg-[#F5A623]/30 loader-cube" />
                        </div>
                        <p className="text-sm font-medium">Memuat...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : journals.length === 0 ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={7}
                      className="text-center text-[#6B6B75] py-10 border-[#1E1E22]"
                    >
                      Belum ada penyusutan untuk periode ini.
                      {!isPeriodClosed && activePeriod && (
                        <span className="block mt-1 text-xs">
                          Klik <strong className="text-[#F0F0F0]">Generate Penyusutan</strong> untuk
                          membuat entri secara otomatis.
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  journals.map((j) => (
                    <TableRow
                      key={j.id}
                      className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                    >
                      <TableCell className="font-mono text-xs text-[#F0F0F0]">
                        {j.assetCode ?? '—'}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#F0F0F0]">
                        {j.assetName ?? j.assetId}
                      </TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">
                        {new Date(j.date).toISOString().slice(0, 10)}
                      </TableCell>
                      <TableCell className="text-xs text-[#6B6B75]">
                        {j.description ?? '—'}
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-red-500">
                        {formatRp(j.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${
                            j.status === 'POSTED'
                              ? 'bg-green-700/80 text-green-100'
                              : 'bg-zinc-700/80 text-zinc-200'
                          }`}
                        >
                          {j.status === 'POSTED' ? 'Diposting' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {j.status === 'DRAFT' && !isPeriodClosed && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            onClick={() => setDeleteTarget(j)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#F0F0F0]">
                Hapus Entri Penyusutan?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B6B75]">
                Entri penyusutan untuk{' '}
                <strong className="text-[#F0F0F0]">{deleteTarget?.assetName}</strong> akan dihapus dan
                nilai buku aset akan dikembalikan.
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
