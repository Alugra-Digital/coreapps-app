import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Banknote,
  Search,
  CreditCard,
  Eye,
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { Badge } from '@/components/ui/badge';

import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import { FinancePreviewDialog, usePreviewForm } from '@/finance/components/preview';
import AccountSelectorInline from '@/finance/components/AccountSelectorInline';
import {
  useKasBankList,
  useCreateKasBank,
  useUpdateKasBank,
  useDeleteKasBank,
} from '@/hooks/useKasBank';
import { useAccountingPeriods, useCreatePeriod, useGenerateNextNumber } from '@/hooks/useAccountingPeriods';
import { kasBankFormSchema, type KasBankFormValues } from './schema';
import type { KasBankTransaction } from './types';
import { formatIDR } from '@/lib/export';
import { exportToExcel, exportToPDF, type ExcelColumn, type PDFColumn } from '@/lib/export';
import { kasBankPreviewConfig } from './preview-config';
import { FileText } from 'lucide-react';
import { useFinanceValidation, type ValidationLine } from '@/lib/finance-validation';
import { ScanStrukButton, type ScanStrukResult } from '@/finance/components/ScanStrukButton';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function KasBankPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [coaFilter, setCoaFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<KasBankTransaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KasBankTransaction | null>(null);
  const [voucherCode, setVoucherCode] = useState('');

  const { data: periods = [] } = useAccountingPeriods();
  const createPeriodMutation = useCreatePeriod();
  const generateNextNumber = useGenerateNextNumber();

  const activePeriod = periods.find((p) => p.year === year && p.month === month);

  const queryParams = activePeriod
    ? { periodId: activePeriod.id, coaAccount: coaFilter || undefined }
    : { month, year, coaAccount: coaFilter || undefined };

  const { data, isLoading, isError } = useKasBankList(queryParams);

  const createMutation = useCreateKasBank();
  const updateMutation = useUpdateKasBank();
  const deleteMutation = useDeleteKasBank();

  const form = useForm<KasBankFormValues>({
    resolver: zodResolver(kasBankFormSchema),
    defaultValues: {
      periodId: activePeriod?.id ?? 0,
      date: new Date().toISOString().slice(0, 10),
      coaAccount: '',
      description: '',
      inflow: 0,
      outflow: 0,
      reference: '',
      lines: [],
      voucherCode: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  });

  const inflowValue = form.watch('inflow');
  const outflowValue = form.watch('outflow');
  const linesValue = form.watch('lines');
  const voucherCodeValue = form.watch('voucherCode');

  const validationLines: ValidationLine[] = (linesValue ?? []).map((l) => ({
    accountNumber: l.accountNumber ?? '',
    accountName:   l.accountName ?? '',
    debit:         Number(l.debit)   || 0,
    credit:        Number(l.credit)  || 0,
  }));

  const { handlePreview: handleValidatedPreview } = useFinanceValidation({
    lines:        validationLines,
    periodStatus: activePeriod?.status,
  });

  // Calculate totals from lines
  const totalLinesDebit = linesValue?.reduce((sum, line) => sum + (line.debit || 0), 0) || 0;
  const totalLinesCredit = linesValue?.reduce((sum, line) => sum + (line.credit || 0), 0) || 0;

  const addLine = () => {
    append({
      accountNumber: '',
      accountName: '',
      debit: 0,
      credit: 0,
      description: '',
    });
  };

  // Preview form hook - manages preview dialog flow
  const previewForm = usePreviewForm({
    form,
    onSubmit: async (values) => {
      // This is called after confirming in preview dialog
      if (editTarget) {
        await updateMutation.mutateAsync({
          id: editTarget.id,
          input: {
            date: values.date,
            coaAccount: values.coaAccount,
            description: values.description,
            inflow: Number(values.inflow),
            outflow: Number(values.outflow),
            reference: values.reference,
            lines: (values.lines || []).map(l => ({
              ...l,
              debit: Number(l.debit),
              credit: Number(l.credit),
            })),
          },
        });
        toast.success('Transaksi berhasil diperbarui');
      } else {
        await createMutation.mutateAsync({
          ...values,
          inflow: Number(values.inflow),
          outflow: Number(values.outflow),
          lines: (values.lines || []).map(l => ({
            ...l,
            debit: Number(l.debit),
            credit: Number(l.credit),
          })),
        });
        toast.success('Transaksi berhasil ditambahkan');
      }
      setDialogOpen(false);
    },
    config: kasBankPreviewConfig,
  });

  const openCreate = async () => {
    let periodId = activePeriod?.id;
    if (!periodId) {
      try {
        const p = await createPeriodMutation.mutateAsync({ year, month });
        periodId = p.id;
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Gagal membuat periode');
        return;
      }
    }

    // Generate voucher code - ensure it's always generated first
    setVoucherCode('');
    try {
      const result = await generateNextNumber.mutateAsync({ periodId, type: 'KB' });
      setVoucherCode(result.code);
    } catch (e) {
      console.error('Failed to generate voucher code:', e);
    }

    form.reset({
      periodId,
      date: new Date().toISOString().slice(0, 10),
      coaAccount: '',
      description: '',
      inflow: 0,
      outflow: 0,
      reference: '',
      lines: [],
      voucherCode: voucherCode, // Set the voucher code in form
    });
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (tx: KasBankTransaction) => {
    form.reset({
      periodId: tx.periodId,
      date: tx.date,
      coaAccount: tx.coaAccount,
      description: tx.description,
      inflow: Number(tx.inflow),
      outflow: Number(tx.outflow),
      reference: tx.reference ?? '',
      lines: tx.lines || [],
      voucherCode: tx.voucherCode || '',
    });
    setEditTarget(tx);
    setDialogOpen(true);
  };

  // Handle form submit - use preview instead of direct submit
  const onSubmit = async () => {
    const valid = await previewForm.handlePreview();
    if (!valid) return;
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Transaksi berhasil dihapus');
      setDeleteTarget(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus transaksi');
    }
  };

  const transactions = data?.transactions ?? [];
  const summary = data?.summary;
  const openingBalance = summary
    ? summary.closingBalance - summary.totalInflow + summary.totalOutflow
    : 0;
  const isPeriodClosed = activePeriod && activePeriod.status !== 'OPEN';

  const handleKasBankScanApply = (result: ScanStrukResult) => {
    form.setValue('date', result.date);
    form.setValue('description', result.description);
    form.setValue('outflow', result.amount);
    if (fields.length > 0) {
      form.setValue('lines.0.accountNumber', result.suggestedAccount.number);
      form.setValue('lines.0.accountName', result.suggestedAccount.name);
      form.setValue('lines.0.debit', result.amount);
      form.setValue('lines.0.credit', 0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">Kas Bank</h1>
            <p className="text-[#6B6B75] text-sm font-medium">Buku kas bank per periode</p>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B75]" />
              <Input
                className="w-44 h-10 bg-[#111113] border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl pl-10 pr-4 focus:ring-1 focus:ring-[#F5A623] outline-none transition-all placeholder:text-[#6B6B75]"
                placeholder="Filter COA..."
                value={coaFilter}
                onChange={(e) => setCoaFilter(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (transactions.length === 0) {
                  toast.error('Tidak ada data untuk di-export');
                  return;
                }
                const monthName = MONTHS[month - 1];
                const filename = `Kas-Bank-${monthName}-${year}`;
                const exportData = transactions.map(tx => ({
                  kode: tx.transactionCode,
                  tanggal: tx.date,
                  akunCOA: tx.coaAccount,
                  keterangan: tx.description,
                  masuk: Number(tx.inflow) > 0 ? formatIDR(tx.inflow) : '—',
                  keluar: Number(tx.outflow) > 0 ? formatIDR(tx.outflow) : '—',
                  saldo: formatIDR(tx.runningBalance),
                }));
                const columns: ExcelColumn[] = [
                  { header: 'Kode', key: 'kode', width: 15 },
                  { header: 'Tanggal', key: 'tanggal', width: 15 },
                  { header: 'Akun COA', key: 'akunCOA', width: 18 },
                  { header: 'Keterangan', key: 'keterangan', width: 30 },
                  { header: 'Masuk', key: 'masuk', width: 15 },
                  { header: 'Keluar', key: 'keluar', width: 15 },
                  { header: 'Saldo', key: 'saldo', width: 18 },
                ];
                exportToExcel(exportData, columns, { filename });
                toast.success('Data berhasil di-export ke Excel');
              }}
              disabled={isLoading || transactions.length === 0}
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-6 rounded-xl"
            >
              <FileText className="w-4 h-4 mr-1" />
              Excel
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (transactions.length === 0) {
                  toast.error('Tidak ada data untuk di-export');
                  return;
                }
                const monthName = MONTHS[month - 1];
                const filename = `Kas-Bank-${monthName}-${year}`;
                const exportData = transactions.map(tx => ({
                  kode: tx.transactionCode,
                  tanggal: tx.date,
                  akunCOA: tx.coaAccount,
                  keterangan: tx.description,
                  masuk: Number(tx.inflow) > 0 ? formatIDR(tx.inflow) : '—',
                  keluar: Number(tx.outflow) > 0 ? formatIDR(tx.outflow) : '—',
                  saldo: formatIDR(tx.runningBalance),
                }));
                const columns: PDFColumn[] = [
                  { header: 'Kode', key: 'kode', width: 22 },
                  { header: 'Tanggal', key: 'tanggal', width: 22 },
                  { header: 'Akun COA', key: 'akunCOA', width: 22 },
                  { header: 'Keterangan', key: 'keterangan' },
                  { header: 'Masuk', key: 'masuk', width: 28 },
                  { header: 'Keluar', key: 'keluar', width: 28 },
                  { header: 'Saldo', key: 'saldo', width: 28 },
                ];
                await exportToPDF(exportData, columns, {
                  filename,
                  title: 'BUKU KAS BANK',
                  subtitle: `Periode: ${monthName} ${year}`,
                  landscape: true,
                });
                toast.success('Data berhasil di-export ke PDF');
              }}
              disabled={isLoading || transactions.length === 0}
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-6 rounded-xl"
            >
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button
              onClick={openCreate}
              disabled={!!isPeriodClosed}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </div>

        {isPeriodClosed && (
          <div className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">
            Periode ini sudah {activePeriod?.status === 'LOCKED' ? 'dikunci' : 'ditutup'}. Data hanya
            bisa dilihat.
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinanceStatCard
            title="Saldo Awal"
            value={summary ? formatIDR(openingBalance) : '—'}
            description="Saldo awal periode"
            icon={<Banknote className="h-6 w-6" />}
            color="#3b82f6"
          />
          <FinanceStatCard
            title="Total Masuk"
            value={summary ? formatIDR(summary.totalInflow) : '—'}
            description="Total pemasukan"
            icon={<ArrowDownToLine className="h-6 w-6" />}
            color="#22c55e"
          />
          <FinanceStatCard
            title="Total Keluar"
            value={summary ? formatIDR(summary.totalOutflow) : '—'}
            description="Total pengeluaran"
            icon={<ArrowUpFromLine className="h-6 w-6" />}
            color="#ef4444"
          />
          <FinanceStatCard
            title="Saldo Akhir"
            value={summary ? formatIDR(summary.closingBalance) : '—'}
            description={(summary?.closingBalance ?? 0) >= 0 ? 'Saldo positif' : 'Saldo negatif'}
            icon={<Wallet className="h-6 w-6" />}
            color={(summary?.closingBalance ?? 0) >= 0 ? '#22c55e' : '#ef4444'}
          />
        </div>

        {/* Table */}
        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0A0A0B]">
                <TableRow className="hover:bg-transparent border-[#1E1E22]">
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[120px]">
                    Kode
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[100px]">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[100px]">
                    Akun COA
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Keterangan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[120px]">
                    Masuk
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[120px]">
                    Keluar
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[120px]">
                    Saldo
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[80px]" />
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
                ) : transactions.length === 0 ? (
                  <TableRow className="border-[#1E1E22] hover:bg-transparent">
                    <TableCell
                      colSpan={8}
                      className="text-center text-[#6B6B75] py-10 border-[#1E1E22]"
                    >
                      Tidak ada transaksi pada periode ini
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                    >
                      <TableCell className="font-mono text-xs text-[#F0F0F0]">
                        {tx.transactionCode}
                      </TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">{tx.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs border-[#1E1E22] bg-[#0A0A0B] text-[#F0F0F0]"
                        >
                          {tx.coaAccount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">{tx.description}</TableCell>
                      <TableCell className="text-right text-sm text-green-500">
                        {Number(tx.inflow) > 0 ? formatIDR(tx.inflow) : '—'}
                      </TableCell>
                      <TableCell className="text-right text-sm text-red-500">
                        {Number(tx.outflow) > 0 ? formatIDR(tx.outflow) : '—'}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-[#F0F0F0]">
                        {formatIDR(tx.runningBalance)}
                      </TableCell>
                      <TableCell>
                        {!isPeriodClosed && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-[#1E1E22] rounded-lg"
                              onClick={() => openEdit(tx)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              onClick={() => setDeleteTarget(tx)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-5xl bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">
                {editTarget ? 'Edit Transaksi' : 'Tambah Transaksi Kas Bank'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-end mb-2">
                  <ScanStrukButton onApply={handleKasBankScanApply} />
                </div>
                {/* Voucher Code - Editable field, shown for both create and edit */}
                <FormField
                  control={form.control}
                  name="voucherCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">Kode Voucher</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kode Voucher"
                          className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623] font-mono uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Main transaction details */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Tanggal</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coaAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Akun COA Bank</FormLabel>
                        <FormControl>
                          <AccountSelectorInline
                            value={field.value ? { code: field.value, name: '' } : null}
                            onChange={(account) => field.onChange(account?.code || '')}
                            placeholder="Pilih akun bank..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">Keterangan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Keterangan transaksi"
                          className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="inflow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Masuk (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="0"
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outflow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Keluar (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="0"
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">Referensi (opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="No. voucher / referensi"
                          className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Transaction Lines Section */}
                <div className="border-t border-[#1E1E22] pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#F5A623]" />
                      <h3 className="text-lg font-semibold text-[#F0F0F0]">Rincian Transaksi</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLine}
                      className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22]"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Tambah Baris
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="text-center py-8 text-[#6B6B75] border border-dashed border-[#1E1E22] rounded-lg">
                      Tidak ada baris transaksi tambahan
                    </div>
                  ) : (
                    <div className="rounded-lg border border-[#1E1E22] overflow-hidden">
                      <Table>
                        <TableHeader className="bg-[#0A0A0B]">
                          <TableRow className="hover:bg-transparent border-[#1E1E22]">
                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[220px]">
                              Akun
                            </TableHead>
                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[150px]">
                              Debit (Rp)
                            </TableHead>
                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[150px]">
                              Kredit (Rp)
                            </TableHead>
                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3">
                              Keterangan
                            </TableHead>
                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[60px]" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => {
                            const accountNumber = form.watch(`lines.${index}.accountNumber`);
                            const accountName = form.watch(`lines.${index}.accountName`);
                            const accountValue = accountNumber ? { code: accountNumber, name: accountName || '' } : null;

                            return (
                              <TableRow key={field.id} className="border-[#1E1E22] hover:bg-white/[0.02]">
                                <TableCell className="p-2">
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.accountNumber`}
                                    render={() => (
                                      <FormItem>
                                        <FormControl>
                                          <AccountSelectorInline
                                            value={accountValue}
                                            onChange={(account) => {
                                              if (account) {
                                                form.setValue(`lines.${index}.accountNumber`, account.code);
                                                form.setValue(`lines.${index}.accountName`, account.name);
                                              } else {
                                                form.setValue(`lines.${index}.accountNumber`, '');
                                                form.setValue(`lines.${index}.accountName`, '');
                                              }
                                            }}
                                            placeholder="Pilih akun..."
                                            inputClassName="h-8"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.debit`}
                                    render={({ field: f }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min={0}
                                            step={1000}
                                            placeholder="0"
                                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623] h-8"
                                            {...f}
                                            value={f.value || ''}
                                            onChange={(e) => f.onChange(e.target.value ? Number(e.target.value) : 0)}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.credit`}
                                    render={({ field: f }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min={0}
                                            step={1000}
                                            placeholder="0"
                                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623] h-8"
                                            {...f}
                                            value={f.value || ''}
                                            onChange={(e) => f.onChange(e.target.value ? Number(e.target.value) : 0)}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.description`}
                                    render={({ field: f }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="Keterangan"
                                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623] h-8"
                                            {...f}
                                            value={f.value || ''}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Lines total summary */}
                  {fields.length > 0 && (
                    <div className="mt-4 p-4 bg-[#0A0A0B] rounded-lg border border-[#1E1E22]">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-[#6B6B75]">Total Debit Baris</div>
                          <div className={`text-xl font-bold ${totalLinesDebit === inflowValue ? 'text-green-500' : 'text-amber-500'}`}>
                            {formatIDR(totalLinesDebit)}
                            {totalLinesDebit !== inflowValue && (
                              <span className="text-xs ml-2 text-amber-500">
                                (Target: {formatIDR(inflowValue)})
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-[#6B6B75]">Total Kredit Baris</div>
                          <div className={`text-xl font-bold ${totalLinesCredit === outflowValue ? 'text-green-500' : 'text-amber-500'}`}>
                            {formatIDR(totalLinesCredit)}
                            {totalLinesCredit !== outflowValue && (
                              <span className="text-xs ml-2 text-amber-500">
                                (Target: {formatIDR(outflowValue)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
                    onClick={() => setDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      handleValidatedPreview(previewForm.handlePreview, {
                        periodId:    activePeriod?.id,
                        voucherCode: voucherCodeValue ?? undefined,
                        type:        'KAS_BANK',
                      })
                    }
                    className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22]"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    className="hidden"
                  >
                    Hidden Submit
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#F0F0F0]">
                Hapus Transaksi?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B6B75]">
                Transaksi <strong className="text-[#F0F0F0]">{deleteTarget?.transactionCode}</strong>{' '}
                akan dihapus secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22]">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Preview Dialog */}
        <FinancePreviewDialog
          open={previewForm.previewOpen}
          onOpenChange={(open) => !open && setDialogOpen(false)}
          data={previewForm.previewData}
          title={editTarget ? 'Preview Edit Transaksi Kas Bank' : 'Preview Tambah Transaksi Kas Bank'}
          config={kasBankPreviewConfig}
          onConfirm={previewForm.handleConfirm}
          onEdit={previewForm.handleEdit}
          isSubmitting={previewForm.isSubmitting}
        />
      </div>
    </div>
  );
}
