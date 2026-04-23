import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Send, CheckCircle2, XCircle, Banknote } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { PeriodSelector } from '@/finance/components/PeriodSelector';
import {
  useVoucherList,
  useSubmitVoucher,
  useReviewVoucher,
  useApproveVoucher,
  usePayVoucher,
  useRejectVoucher,
  useCancelVoucher,
  useDeleteVoucher,
} from '@/hooks/useVouchers';
import { useAccountingPeriods } from '@/hooks/useAccountingPeriods';
import type { Voucher, VoucherType } from './types';

const formatRp = (val: string | number) =>
  `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-zinc-700/80 text-zinc-200 border-[#1E1E22]' },
  SUBMITTED: { label: 'Diajukan', className: 'bg-blue-700/80 text-blue-100' },
  REVIEWED: { label: 'Direview', className: 'bg-yellow-700/80 text-yellow-100' },
  APPROVED: { label: 'Disetujui', className: 'bg-green-700/80 text-green-100' },
  PAID: { label: 'Dibayar', className: 'bg-emerald-700/80 text-emerald-100' },
  REJECTED: { label: 'Ditolak', className: 'bg-red-700/80 text-red-100' },
  CANCELLED: { label: 'Batal', className: 'bg-zinc-600/80 text-zinc-300' },
};

export default function VouchersPage() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [typeTab, setTypeTab] = useState<VoucherType | 'ALL'>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<Voucher | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Voucher | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: periods = [] } = useAccountingPeriods();
  const activePeriod = periods.find((p) => p.year === year && p.month === month);

  const queryParams = {
    ...(activePeriod ? { periodId: activePeriod.id } : { month, year }),
    ...(typeTab !== 'ALL' ? { type: typeTab as VoucherType } : {}),
  };

  const { data, isLoading, isError } = useVoucherList(queryParams);

  const submitMutation = useSubmitVoucher();
  const reviewMutation = useReviewVoucher();
  const approveMutation = useApproveVoucher();
  const payMutation = usePayVoucher();
  const rejectMutation = useRejectVoucher();
  const cancelMutation = useCancelVoucher();
  const deleteMutation = useDeleteVoucher();

  const isPeriodClosed = activePeriod && activePeriod.status !== 'OPEN';

  const handleAction = async (action: string, id: number) => {
    try {
      if (action === 'submit') await submitMutation.mutateAsync(id);
      else if (action === 'review') await reviewMutation.mutateAsync(id);
      else if (action === 'approve') await approveMutation.mutateAsync(id);
      else if (action === 'pay') await payMutation.mutateAsync(id);
      else if (action === 'cancel') await cancelMutation.mutateAsync(id);
      toast.success('Berhasil');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Terjadi kesalahan');
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectTarget.id, reason: rejectReason });
      toast.success('Voucher ditolak');
      setRejectTarget(null);
      setRejectReason('');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menolak voucher');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Voucher dihapus');
      setDeleteTarget(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus voucher');
    }
  };

  const vouchers = data?.vouchers ?? [];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">Voucher</h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Voucher Kas Kecil & Kas Bank per periode
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
              onClick={() => navigate('/finance/vouchers/create', { state: { month, year } })}
              disabled={!!isPeriodClosed}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1" />
              Buat Voucher
            </Button>
          </div>
        </div>

        {isPeriodClosed && (
          <div className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">
            Periode ini sudah {activePeriod?.status === 'LOCKED' ? 'dikunci' : 'ditutup'}. Data hanya
            bisa dilihat.
          </div>
        )}

        {/* Type filter tabs */}
        <Tabs value={typeTab} onValueChange={(v) => setTypeTab(v as VoucherType | 'ALL')}>
          <TabsList className="bg-[#111113] border-[#1E1E22] p-1.5 h-14 rounded-2xl">
            <TabsTrigger
              value="ALL"
              className="data-[state=active]:bg-[#F5A623]/10 data-[state=active]:text-[#F5A623] data-[state=active]:border-[#F5A623]/30 rounded-xl px-6 h-10 font-bold text-[#F0F0F0]"
            >
              Semua
            </TabsTrigger>
            <TabsTrigger
              value="KAS_KECIL"
              className="data-[state=active]:bg-[#F5A623]/10 data-[state=active]:text-[#F5A623] data-[state=active]:border-[#F5A623]/30 rounded-xl px-6 h-10 font-bold text-[#F0F0F0]"
            >
              Kas Kecil
            </TabsTrigger>
            <TabsTrigger
              value="KAS_BANK"
              className="data-[state=active]:bg-[#F5A623]/10 data-[state=active]:text-[#F5A623] data-[state=active]:border-[#F5A623]/30 rounded-xl px-6 h-10 font-bold text-[#F0F0F0]"
            >
              Kas Bank
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Table */}
        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0A0A0B]">
                <TableRow className="hover:bg-transparent border-[#1E1E22]">
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[150px]">
                    Kode Voucher
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[100px]">
                    Jenis Voucher
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Penerima
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Keterangan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[140px]">
                    Jumlah
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">
                    Status
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[160px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={8}
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
                ) : isError ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={8}
                      className="text-center text-red-500 py-10 border-[#1E1E22]"
                    >
                      Gagal memuat data
                    </TableCell>
                  </TableRow>
                ) : vouchers.length === 0 ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={8}
                      className="text-center text-[#6B6B75] py-10 border-[#1E1E22]"
                    >
                      Tidak ada voucher pada periode ini
                    </TableCell>
                  </TableRow>
                ) : (
                  vouchers.map((v) => {
                    const cfg = STATUS_CONFIG[v.status] ?? STATUS_CONFIG.DRAFT;
                    return (
                      <TableRow
                        key={v.id}
                        className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                      >
                        <TableCell className="font-mono text-xs text-[#F0F0F0]">
                          {v.voucherNumber}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs border-[#1E1E22] bg-[#0A0A0B] text-[#F0F0F0]"
                          >
                            {v.voucherType === 'KAS_KECIL' ? 'Kas Kecil' : 'Kas Bank'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[#F0F0F0]">{v.date}</TableCell>
                        <TableCell className="text-sm font-medium text-[#F0F0F0]">
                          {v.payee}
                        </TableCell>
                        <TableCell className="text-sm text-[#6B6B75] truncate max-w-[200px]">
                          {v.description}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-[#F0F0F0]">
                          {formatRp(v.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${cfg.className}`}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-[#1E1E22] rounded-lg"
                              onClick={() => navigate(`/finance/vouchers/${v.id}`)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {v.status === 'DRAFT' && !isPeriodClosed && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-[#1E1E22] rounded-lg"
                                  onClick={() => navigate(`/finance/vouchers/${v.id}/edit`)}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                                  title="Ajukan"
                                  onClick={() => handleAction('submit', v.id)}
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                  onClick={() => setDeleteTarget(v)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                            {v.status === 'SUBMITTED' && !isPeriodClosed && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-yellow-500 hover:bg-yellow-500/10 rounded-lg"
                                  title="Review"
                                  onClick={() => handleAction('review', v.id)}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                  title="Tolak"
                                  onClick={() => setRejectTarget(v)}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                            {v.status === 'REVIEWED' && !isPeriodClosed && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-green-500 hover:bg-green-500/10 rounded-lg"
                                  title="Setujui"
                                  onClick={() => handleAction('approve', v.id)}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                  title="Tolak"
                                  onClick={() => setRejectTarget(v)}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                            {v.status === 'APPROVED' && !isPeriodClosed && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                                title="Bayar"
                                onClick={() => handleAction('pay', v.id)}
                              >
                                <Banknote className="w-3.5 h-3.5" />
                              </Button>
                            )}
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

        {/* Reject dialog */}
        <Dialog
          open={!!rejectTarget}
          onOpenChange={(o) => {
            if (!o) {
              setRejectTarget(null);
              setRejectReason('');
            }
          }}
        >
          <DialogContent className="sm:max-w-md bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">Tolak Voucher</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-[#6B6B75]">
                Masukkan alasan penolakan untuk voucher{' '}
                <strong className="text-[#F0F0F0]">{rejectTarget?.voucherNumber}</strong>.
              </p>
              <div className="space-y-1">
                <Label className="text-[#F0F0F0]">Alasan Penolakan</Label>
                <Input
                  placeholder="Alasan penolakan..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason('');
                }}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                disabled={!rejectReason.trim() || rejectMutation.isPending}
                onClick={handleReject}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Tolak
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#F0F0F0]">
                Hapus Voucher?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B6B75]">
                Voucher <strong className="text-[#F0F0F0]">{deleteTarget?.voucherNumber}</strong>{' '}
                akan dihapus permanen.
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
