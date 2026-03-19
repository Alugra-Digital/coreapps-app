import { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, TrendingDown, TrendingUp, Wallet, Banknote, Calculator, FileText, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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

import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import AccountSelectorInline from '@/finance/components/AccountSelectorInline';
import { FinancePreviewDialog, usePreviewForm } from '@/finance/components/preview';
import PhysicalCashReconciliation from '@/finance/kas-kecil/components/PhysicalCashReconciliation';
import {
  useKasKecilList,
  useCreateKasKecil,
  useUpdateKasKecil,
  useDeleteKasKecil,
} from '@/hooks/useKasKecil';
import { useKasKecilSaldo } from '@/hooks/useKasKecilSaldo';
import { useAccountingPeriods, useCreatePeriod, useGenerateNextNumber } from '@/hooks/useAccountingPeriods';
import { kasKecilFormSchema, type KasKecilFormValues } from './schema';
import type { KasKecilTransaction, CreateKasKecilInput } from './types';
import { exportToExcel, type ExcelColumn } from '@/lib/export';
import { kasKecilPreviewConfig } from './preview-config';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const formatRp = (val: string | number) =>
  `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

export default function KasKecilPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<KasKecilTransaction | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<{ code: string; name: string } | null>(null);
  const [voucherCode, setVoucherCode] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<KasKecilTransaction | null>(null);
  const [reconciliationOpen, setReconciliationOpen] = useState(false);
  const [reconciliationTarget, setReconciliationTarget] = useState<KasKecilTransaction | null>(null);

  const { data: periods = [] } = useAccountingPeriods();
  const createPeriodMutation = useCreatePeriod();
  const generateNextNumber = useGenerateNextNumber();

  const activePeriod = periods.find((p) => p.year === year && p.month === month);
  const { availablePeriods } = useKasKecilSaldo(activePeriod?.id);

  const { data, isLoading, isError } = useKasKecilList(
    activePeriod ? { periodId: activePeriod.id } : { month, year }
  );

  const createMutation = useCreateKasKecil();
  const updateMutation = useUpdateKasKecil();
  const deleteMutation = useDeleteKasKecil();

  const form = useForm<KasKecilFormValues>({
    resolver: zodResolver(kasKecilFormSchema),
    defaultValues: {
      mode: 'manual',
      periodId: activePeriod?.id ?? 0,
      date: new Date().toISOString().slice(0, 10),
      description: '',
      debit: 0,
      credit: 0,
      accountNumber: '',
      accountName: '',
      attachmentUrl: null,
      saldoAwalManual: undefined,
    },
  });

  // Handle account selection
  const handleAccountChange = useCallback((account: { code: string; name: string } | null) => {
    setSelectedAccount(account);
    if (account) {
      form.setValue('accountNumber', account.code);
      form.setValue('accountName', account.name);
    } else {
      form.setValue('accountNumber', '');
      form.setValue('accountName', '');
    }
  }, [form]);

  // Watch mode for conditional fields
  const mode = form.watch('mode');
  const selectedPeriodId = form.watch('saldoFromPeriodId');

  // Handle saldo period selection
  const handleSaldoPeriodChange = useCallback((periodId: string) => {
    const parsedId = parseInt(periodId, 10);
    const selected = availablePeriods.find(p => p.period.id === parsedId);
    if (selected) {
      form.setValue('saldoFromPeriodId', parsedId);
      form.setValue('debit', selected.saldo);
      form.setValue('description', 'Saldo Awal');
      // Set a default account for saldo awal (could be the Kas Kecil account)
      form.setValue('accountNumber', '1101'); // Typical kas kecil account code
      form.setValue('accountName', 'Kas Kecil');
      setSelectedAccount({ code: '1101', name: 'Kas Kecil' });
    }
  }, [availablePeriods, form]);

  // Handle mode change
  const handleModeChange = useCallback((value: 'manual' | 'saldoAwal') => {
    form.setValue('mode', value);
    if (value === 'manual') {
      form.setValue('debit', 0);
      form.setValue('credit', 0);
      form.setValue('description', '');
      setSelectedAccount(null);
      form.setValue('accountNumber', '');
      form.setValue('accountName', '');
    }
  }, [form]);

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
      const result = await generateNextNumber.mutateAsync({ periodId, type: 'KK' });
      setVoucherCode(result.code);
    } catch (e) {
      console.error('Failed to generate voucher code:', e);
    }

    form.reset({
      mode: 'manual',
      periodId,
      date: new Date().toISOString().slice(0, 10),
      description: '',
      debit: 0,
      credit: 0,
      accountNumber: '',
      accountName: '',
      attachmentUrl: null,
      saldoAwalManual: undefined,
      voucherCode: voucherCode, // Set the voucher code in form
    });
    setSelectedAccount(null);
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (tx: KasKecilTransaction) => {
    form.reset({
      mode: 'manual',
      periodId: tx.periodId,
      date: tx.date,
      description: tx.description,
      debit: Number(tx.debit),
      credit: Number(tx.credit),
      attachmentUrl: tx.attachmentUrl ?? undefined,
      accountNumber: tx.accountNumber ?? '',
      accountName: tx.accountName ?? '',
      voucherCode: tx.voucherCode || '', // Include voucher code if exists
    });
    if (tx.accountNumber && tx.accountName) {
      setSelectedAccount({ code: tx.accountNumber, name: tx.accountName });
    }
    setEditTarget(tx);
    setDialogOpen(true);
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

  // Preview form hook - manages preview dialog flow
  const previewForm = usePreviewForm({
    form,
    onSubmit: async (values) => {
      // This is called after confirming in preview dialog
      if (editTarget) {
        // Edit mode
        await updateMutation.mutateAsync({
          id: editTarget.id,
          input: {
            date: values.date,
            description: values.description,
            debit: values.debit,
            credit: values.credit,
            attachmentUrl: values.attachmentUrl,
            accountNumber: values.accountNumber,
            accountName: values.accountName,
          },
        });
        toast.success('Transaksi berhasil diperbarui');
      } else {
        // Create mode
        const createInput: CreateKasKecilInput = {
          periodId: values.periodId,
          date: values.date,
          description: values.description,
          debit: values.debit,
          credit: values.credit,
          attachmentUrl: values.attachmentUrl,
          accountNumber: values.accountNumber,
          accountName: values.accountName,
          saldoFromPeriodId: values.mode === 'saldoAwal' ? values.saldoFromPeriodId : null,
          voucherCode: values.voucherCode,
        };
        await createMutation.mutateAsync(createInput);
        const modeText = values.mode === 'saldoAwal' ? 'Saldo Awal' : 'Transaksi';
        toast.success(`${modeText} berhasil ditambahkan`);
      }
      setDialogOpen(false);
    },
    config: kasKecilPreviewConfig,
  });

  // Handle form submit - use preview instead of direct submit
  const onSubmit = async () => {
    const valid = await previewForm.handlePreview();
    if (!valid) return;
  };

  const transactions = data?.transactions ?? [];
  const summary = data?.summary;
  const openingBalance = summary
    ? summary.closingBalance - summary.totalDebit + summary.totalCredit
    : 0;
  const isPeriodClosed = activePeriod && activePeriod.status !== 'OPEN';

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">Kas Kecil</h1>
            <p className="text-[#6B6B75] text-sm font-medium">Buku kas kecil per periode</p>
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
              variant="outline"
              onClick={() => {
                const lastTx = transactions[transactions.length - 1];
                if (lastTx) {
                  setReconciliationTarget(lastTx);
                  setReconciliationOpen(true);
                } else {
                  toast.error('Tidak ada transaksi untuk direkonsiliasi');
                }
              }}
              disabled={!!isPeriodClosed || transactions.length === 0}
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-6 rounded-xl"
            >
              <Calculator className="w-4 h-4 mr-1" />
              Rekonsiliasi
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (transactions.length === 0) {
                  toast.error('Tidak ada data untuk di-export');
                  return;
                }
                const monthName = MONTHS[month - 1];
                const filename = `Kas-Kecil-${monthName}-${year}`;
                const exportData = transactions.map(tx => ({
                  noTransaksi: tx.transNumber,
                  tanggal: tx.date,
                  keterangan: tx.description,
                  akun: tx.accountName ? `${tx.accountNumber || ''} - ${tx.accountName}` : '—',
                  debit: Number(tx.debit) > 0 ? formatRp(tx.debit) : '—',
                  kredit: Number(tx.credit) > 0 ? formatRp(tx.credit) : '—',
                  saldoBerjalan: formatRp(tx.runningBalance),
                }));
                const columns: ExcelColumn[] = [
                  { header: 'No. Transaksi', key: 'noTransaksi', width: 15 },
                  { header: 'Tanggal', key: 'tanggal', width: 15 },
                  { header: 'Keterangan', key: 'keterangan', width: 30 },
                  { header: 'Akun', key: 'akun', width: 25 },
                  { header: 'Debit', key: 'debit', width: 15 },
                  { header: 'Kredit', key: 'kredit', width: 15 },
                  { header: 'Saldo Berjalan', key: 'saldoBerjalan', width: 18 },
                ];
                exportToExcel(exportData, columns, { filename });
                toast.success('Data berhasil di-export ke Excel');
              }}
              disabled={isLoading || transactions.length === 0}
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-6 rounded-xl"
            >
              <FileText className="w-4 h-4 mr-1" />
              Export Excel
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
            value={summary ? formatRp(openingBalance) : '—'}
            description="Saldo awal periode"
            icon={<Banknote className="h-6 w-6" />}
            color="#3b82f6"
          />
          <FinanceStatCard
            title="Total Debit"
            value={summary ? formatRp(summary.totalDebit) : '—'}
            description="Total pemasukan"
            icon={<TrendingUp className="h-6 w-6" />}
            color="#22c55e"
          />
          <FinanceStatCard
            title="Total Kredit"
            value={summary ? formatRp(summary.totalCredit) : '—'}
            description="Total pengeluaran"
            icon={<TrendingDown className="h-6 w-6" />}
            color="#ef4444"
          />
          <FinanceStatCard
            title="Saldo Akhir"
            value={summary ? formatRp(summary.closingBalance) : '—'}
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
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[130px]">
                    No. Transaksi
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Keterangan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Akun
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Debit
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Kredit
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[140px]">
                    Saldo Berjalan
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
                        {tx.transNumber}
                      </TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">{tx.date}</TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">{tx.description}</TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">
                        {tx.accountName ? (
                          <div>
                            <div className="text-xs text-[#6B6B75] font-mono">{tx.accountNumber || '—'}</div>
                            <div className="text-sm">{tx.accountName}</div>
                          </div>
                        ) : (
                          <span className="text-[#6B6B75]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm text-green-500">
                        {Number(tx.debit) > 0 ? formatRp(tx.debit) : '—'}
                      </TableCell>
                      <TableCell className="text-right text-sm text-red-500">
                        {Number(tx.credit) > 0 ? formatRp(tx.credit) : '—'}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-[#F0F0F0]">
                        {formatRp(tx.runningBalance)}
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
          <DialogContent className="sm:max-w-md bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">
                {editTarget ? 'Edit Transaksi' : 'Tambah Transaksi Kas Kecil'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {/* Mode Toggle - Only show for create, not edit */}
                {!editTarget && (
                  <div className="space-y-2">
                    <Label className="text-[#F0F0F0]">Mode Input</Label>
                    <FormField
                      control={form.control}
                      name="mode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={(value: 'manual' | 'saldoAwal') => {
                                field.onChange(value);
                                handleModeChange(value);
                              }}
                              className="flex flex-row gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="manual" id="manual" />
                                <Label htmlFor="manual" className="text-sm cursor-pointer">Input Manual</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="saldoAwal" id="saldoAwal" />
                                <Label htmlFor="saldoAwal" className="text-sm cursor-pointer">Saldo Awal</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Saldo Awal Mode - Previous Period Selection */}
                {mode === 'saldoAwal' && !editTarget && (
                  <div className="space-y-3 bg-[#1E1E22] p-4 rounded-lg">
                    <Label className="text-[#F0F0F0] font-medium">Pilih Periode Sebelumnya</Label>
                    <Select
                      value={selectedPeriodId?.toString() || ''}
                      onValueChange={handleSaldoPeriodChange}
                    >
                      <SelectTrigger className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                        <SelectValue placeholder="Pilih periode..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111113] border-[#1E1E22]">
                        {availablePeriods.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-[#6B6B75]">
                            Tidak ada periode sebelumnya
                          </div>
                        ) : (
                          availablePeriods.map((item) => (
                            <SelectItem
                              key={item.period.id}
                              value={item.period.id.toString()}
                              className="text-[#F0F0F0] focus:bg-[#1E1E22]"
                            >
                              {MONTHS[item.period.month - 1]} {item.period.year} - Saldo: {formatRp(item.saldo)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.saldoFromPeriodId && (
                      <p className="text-xs text-red-500 mt-1">{form.formState.errors.saldoFromPeriodId.message}</p>
                    )}
                  </div>
                )}

                {/* Manual Saldo Awal Input - Always visible for create */}
                {!editTarget && (
                  <FormField
                    control={form.control}
                    name="saldoAwalManual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Saldo Awal (Manual)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="0"
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              field.onChange(val);
                              // Auto-fill debit when saldo awal is entered
                              if (val > 0) {
                                form.setValue('debit', val);
                                form.setValue('credit', 0);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">Keterangan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Keterangan transaksi"
                          className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                          {...field}
                          readOnly={mode === 'saldoAwal' && !editTarget}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel className="text-[#F0F0F0]">Akun</FormLabel>
                  <FormControl>
                    <AccountSelectorInline
                      value={selectedAccount ? { code: selectedAccount.code, name: selectedAccount.name } : undefined}
                      onChange={handleAccountChange}
                      placeholder="Pilih akun..."
                    />
                  </FormControl>
                  {form.formState.errors.accountNumber && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.accountNumber.message}</p>
                  )}
                  {form.formState.errors.accountName && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.accountName.message}</p>
                  )}
                </FormItem>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="debit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Debit (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="0"
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                            {...field}
                            readOnly={mode === 'saldoAwal' && !editTarget}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="credit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Kredit (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="0"
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                            {...field}
                            readOnly={mode === 'saldoAwal' && !editTarget}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="attachmentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">URL Lampiran (opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    onClick={previewForm.handlePreview}
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
                Transaksi <strong className="text-[#F0F0F0]">{deleteTarget?.transNumber}</strong>{' '}
                akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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

        {/* Physical Cash Reconciliation Dialog */}
        <Dialog open={reconciliationOpen} onOpenChange={setReconciliationOpen}>
          <DialogContent className="sm:max-w-4xl bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">
                Rekonsiliasi Kas Fisik
              </DialogTitle>
            </DialogHeader>
            {reconciliationTarget && activePeriod && (
              <PhysicalCashReconciliation
                kasKecilTransactionId={reconciliationTarget.id}
                systemBalance={summary?.closingBalance ?? 0}
                periodId={activePeriod.id}
                onSuccess={() => {
                  setReconciliationOpen(false);
                  setReconciliationTarget(null);
                }}
                onCancel={() => {
                  setReconciliationOpen(false);
                  setReconciliationTarget(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <FinancePreviewDialog
          open={previewForm.previewOpen}
          onOpenChange={(open) => !open && setDialogOpen(false)}
          data={previewForm.previewData}
          title={editTarget ? 'Preview Edit Transaksi Kas Kecil' : 'Preview Tambah Transaksi Kas Kecil'}
          config={kasKecilPreviewConfig}
          onConfirm={previewForm.handleConfirm}
          onEdit={previewForm.handleEdit}
          isSubmitting={previewForm.isSubmitting}
        />
      </div>
    </div>
  );
}
