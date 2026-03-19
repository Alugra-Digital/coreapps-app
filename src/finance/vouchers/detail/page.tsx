import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Send,
  CheckCircle2,
  XCircle,
  Banknote,
  X,
  User,
  Calendar,
  CreditCard,
  FileText,
  Paperclip,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  useVoucherById,
  useSubmitVoucher,
  useReviewVoucher,
  useApproveVoucher,
  usePayVoucher,
  useRejectVoucher,
  useCancelVoucher,
} from '@/hooks/useVouchers';
import { exportVoucherToPDF } from '@/lib/export';
import { Download } from 'lucide-react';

const formatRp = (val: string | number) =>
  `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-zinc-700/80 text-zinc-200' },
  SUBMITTED: { label: 'Diajukan', className: 'bg-blue-700/80 text-blue-100' },
  REVIEWED: { label: 'Direview', className: 'bg-yellow-700/80 text-yellow-100' },
  APPROVED: { label: 'Disetujui', className: 'bg-green-700/80 text-green-100' },
  PAID: { label: 'Dibayar', className: 'bg-emerald-700/80 text-emerald-100' },
  REJECTED: { label: 'Ditolak', className: 'bg-red-700/80 text-red-100' },
  CANCELLED: { label: 'Batal', className: 'bg-zinc-600/80 text-zinc-300' },
};

const WORKFLOW_STEPS: Array<{ status: string; label: string }> = [
  { status: 'DRAFT', label: 'Draft' },
  { status: 'SUBMITTED', label: 'Diajukan' },
  { status: 'REVIEWED', label: 'Direview' },
  { status: 'APPROVED', label: 'Disetujui' },
  { status: 'PAID', label: 'Dibayar' },
];

const STATUS_ORDER: Record<string, number> = {
  DRAFT: 0,
  SUBMITTED: 1,
  REVIEWED: 2,
  APPROVED: 3,
  PAID: 4,
  REJECTED: -1,
  CANCELLED: -1,
};

export default function VoucherDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data: voucher, isLoading, isError } = useVoucherById(id ? Number(id) : undefined);

  const submitMutation = useSubmitVoucher();
  const reviewMutation = useReviewVoucher();
  const approveMutation = useApproveVoucher();
  const payMutation = usePayVoucher();
  const rejectMutation = useRejectVoucher();
  const cancelMutation = useCancelVoucher();

  const handleAction = async (action: string) => {
    if (!voucher) return;
    try {
      if (action === 'submit') await submitMutation.mutateAsync(voucher.id);
      else if (action === 'review') await reviewMutation.mutateAsync(voucher.id);
      else if (action === 'approve') await approveMutation.mutateAsync(voucher.id);
      else if (action === 'pay') await payMutation.mutateAsync(voucher.id);
      else if (action === 'cancel') await cancelMutation.mutateAsync(voucher.id);
      toast.success('Berhasil');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Terjadi kesalahan');
    }
  };

  const handleReject = async () => {
    if (!voucher || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: voucher.id, reason: rejectReason });
      toast.success('Voucher ditolak');
      setRejectDialogOpen(false);
      setRejectReason('');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menolak');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-32 flex flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 rounded-lg border border-[#1E1E22] p-2 flex items-center justify-center">
              <span className="h-5 w-5 rounded bg-[#F5A623]/30 loader-cube" />
            </div>
            <p className="text-[#6B6B75] text-sm font-medium">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }
  if (isError || !voucher) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500">Voucher tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[voucher.status] ?? STATUS_CONFIG.DRAFT;
  const currentOrder = STATUS_ORDER[voucher.status] ?? 0;
  const totalDebit = voucher.lines.reduce((s, l) => s + Number(l.debit), 0);
  const totalCredit = voucher.lines.reduce((s, l) => s + Number(l.credit), 0);
  const isRejectedOrCancelled = ['REJECTED', 'CANCELLED'].includes(voucher.status);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back + header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B6B75] hover:text-[#F5A623] hover:bg-[#1E1E22] rounded-xl"
              onClick={() => navigate('/finance/vouchers')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight font-mono text-[#F0F0F0]">
                  {voucher.voucherNumber}
                </h1>
                <Badge className={`text-xs ${cfg.className}`}>{cfg.label}</Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-[#1E1E22] bg-[#0A0A0B] text-[#F0F0F0]"
                >
                  {voucher.voucherType === 'KAS_KECIL' ? 'Kas Kecil' : 'Kas Bank'}
                </Badge>
              </div>
              <p className="text-[#6B6B75] text-sm">{voucher.date}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              size="sm"
              variant="outline"
              className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10"
              onClick={() => {
                if (voucher) {
                  const lines = voucher.lines.map(l => ({
                    description: l.description,
                    amount: l.debit || l.credit || '0',
                  }));
                  exportVoucherToPDF(voucher, lines);
                }
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              PDF
            </Button>
            {voucher.status === 'DRAFT' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
                  onClick={() => navigate(`/finance/vouchers/${voucher.id}/edit`)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10"
                  onClick={() => handleAction('submit')}
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Ajukan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#6B6B75] text-[#6B6B75] hover:bg-[#1E1E22]"
                  onClick={() => handleAction('cancel')}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Batalkan
                </Button>
              </>
            )}
            {voucher.status === 'SUBMITTED' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623]/10"
                  onClick={() => handleAction('review')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Review
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Tolak
                </Button>
              </>
            )}
            {voucher.status === 'REVIEWED' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10"
                  onClick={() => handleAction('approve')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Setujui
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Tolak
                </Button>
              </>
            )}
            {voucher.status === 'APPROVED' && (
              <Button
                size="sm"
                variant="outline"
                className="border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10"
                onClick={() => handleAction('pay')}
              >
                <Banknote className="w-3.5 h-3.5 mr-1" /> Tandai Dibayar
              </Button>
            )}
          </div>
        </div>

        {/* Workflow stepper */}
        {!isRejectedOrCancelled && (
          <Card className="bg-[#111113] border-[#1E1E22]">
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const stepOrder = STATUS_ORDER[step.status] ?? 0;
                  const isDone = stepOrder < currentOrder;
                  const isActive = stepOrder === currentOrder;
                  return (
                    <div key={step.status} className="flex items-center gap-2 flex-1">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 transition-colors
                      ${isDone ? 'bg-green-600 border-green-600 text-white' : ''}
                      ${isActive ? 'bg-[#F5A623] border-[#F5A623] text-black' : ''}
                      ${!isDone && !isActive ? 'border-[#6B6B75] text-[#6B6B75]' : ''}
                    `}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span
                        className={`text-xs ${
                          isActive ? 'font-semibold text-[#F0F0F0]' : 'text-[#6B6B75]'
                        }`}
                      >
                        {step.label}
                      </span>
                      {idx < WORKFLOW_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            stepOrder < currentOrder ? 'bg-green-600' : 'bg-[#1E1E22]'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection/cancellation notice */}
        {voucher.status === 'REJECTED' && voucher.rejectionReason && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <strong>Alasan Penolakan:</strong> {voucher.rejectionReason}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Details */}
          <Card className="bg-[#111113] border-[#1E1E22]">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#F0F0F0]">
                Detail Voucher
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#6B6B75]" />
                <span className="text-[#6B6B75]">Penerima:</span>
                <span className="font-medium text-[#F0F0F0]">{voucher.payee}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6B6B75]" />
                <span className="text-[#6B6B75]">Keterangan:</span>
                <span className="text-[#F0F0F0]">{voucher.description}</span>
              </div>
              {voucher.paymentMethod && (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Metode:</span>
                  <span className="text-[#F0F0F0]">{voucher.paymentMethod}</span>
                </div>
              )}
              {voucher.receivedBy && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Diterima oleh:</span>
                  <span className="text-[#F0F0F0]">{voucher.receivedBy}</span>
                </div>
              )}
              {voucher.attachmentUrl && (
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#6B6B75]" />
                  <a
                    href={voucher.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F5A623] underline text-xs truncate hover:text-[#D98E1C]"
                  >
                    Lihat Lampiran
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="bg-[#111113] border-[#1E1E22]">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#F0F0F0]">
                Riwayat Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {voucher.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Dibuat:</span>
                  <span className="text-[#F0F0F0]">
                    {new Date(voucher.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              {voucher.reviewedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Direview:</span>
                  <span className="text-[#F0F0F0]">
                    {new Date(voucher.reviewedAt).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              {voucher.approvedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Disetujui:</span>
                  <span className="text-[#F0F0F0]">
                    {new Date(voucher.approvedAt).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              {voucher.paidAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6B6B75]" />
                  <span className="text-[#6B6B75]">Dibayar:</span>
                  <span className="text-[#F0F0F0]">
                    {new Date(voucher.paidAt).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Accounting lines */}
        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#F0F0F0]">
                Baris Akuntansi
              </CardTitle>
              <span className="text-lg font-bold text-[#F0F0F0]">
                {formatRp(voucher.totalAmount)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0A0A0B]">
                <TableRow className="hover:bg-transparent border-[#1E1E22]">
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[120px]">
                    No. Akun
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Nama Akun
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Keterangan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Debit
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Kredit
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voucher.lines.map((line, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                  >
                    <TableCell className="font-mono text-xs text-[#F0F0F0]">
                      {line.accountNumber}
                    </TableCell>
                    <TableCell className="text-sm text-[#F0F0F0]">{line.accountName}</TableCell>
                    <TableCell className="text-xs text-[#6B6B75]">
                      {line.description ?? '—'}
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-500">
                      {Number(line.debit) > 0 ? formatRp(line.debit) : '—'}
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-500">
                      {Number(line.credit) > 0 ? formatRp(line.credit) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="bg-[#1E1E22]" />
            <div className="flex justify-end gap-8 px-4 py-3 text-sm">
              <span>
                Total Debit: <strong className="text-green-500">{formatRp(totalDebit)}</strong>
              </span>
              <span>
                Total Kredit: <strong className="text-red-500">{formatRp(totalCredit)}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reject dialog */}
        <Dialog
          open={rejectDialogOpen}
          onOpenChange={(o) => {
            if (!o) {
              setRejectDialogOpen(false);
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
                Masukkan alasan penolakan untuk voucher ini.
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
                  setRejectDialogOpen(false);
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
      </div>
    </div>
  );
}
