import { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, FileText, FileCheck, FileEdit, Eye, Download } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import { FinancePreviewDialog, usePreviewForm } from '@/finance/components/preview';
import {
  useJurnalMemorialList,
  useCreateJurnalMemorial,
  useUpdateJurnalMemorial,
  usePostJurnalMemorial,
  useDeleteJurnalMemorial,
} from '@/hooks/useJurnalMemorial';
import { useAccountingPeriods, useCreatePeriod } from '@/hooks/useAccountingPeriods';
import { jurnalMemorialFormSchema, type JurnalMemorialFormValues } from './schema';
import type { JurnalMemorial } from './types';
import { jurnalMemorialPreviewConfig } from './preview-config';
import { useFinanceValidation, type ValidationLine } from '@/lib/finance-validation';
import { exportToExcel, exportToPDF, type ExcelColumn, type PDFColumn } from '@/lib/export';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const formatRp = (val: string | number) =>
  `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-zinc-700/80 text-zinc-200 border-[#1E1E22]' },
  POSTED: { label: 'Posted', className: 'bg-green-700/80 text-green-100 border-green-600/50' },
};

export default function JurnalMemorialPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const defaultLine = { accountNumber: '', accountName: '', debit: 0, credit: 0, lineDescription: '' };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JurnalMemorial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JurnalMemorial | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const { data: periods = [] } = useAccountingPeriods();
  const createPeriodMutation = useCreatePeriod();
  const activePeriod = periods.find((p) => p.year === year && p.month === month);

  const { data, isLoading, isError } = useJurnalMemorialList(
    activePeriod ? { periodId: activePeriod.id } : { month, year }
  );

  const createMutation = useCreateJurnalMemorial();
  const updateMutation = useUpdateJurnalMemorial();
  const postMutation = usePostJurnalMemorial();
  const deleteMutation = useDeleteJurnalMemorial();

  const form = useForm<JurnalMemorialFormValues>({
    resolver: zodResolver(jurnalMemorialFormSchema),
    defaultValues: {
      periodId: activePeriod?.id ?? 0,
      date: new Date().toISOString().slice(0, 10),
      description: '',
      lines: [
        { accountNumber: '', accountName: '', debit: 0, credit: 0, lineDescription: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines' });

  const totalDebit = fields.reduce((s, _, i) => s + (Number(form.watch(`lines.${i}.debit`)) || 0), 0);
  const totalCredit = fields.reduce((s, _, i) => s + (Number(form.watch(`lines.${i}.credit`)) || 0), 0);

  const validationLines: ValidationLine[] = fields.map((_, i) => ({
    accountNumber: form.watch(`lines.${i}.accountNumber`) ?? '',
    accountName:   form.watch(`lines.${i}.accountName`)   ?? '',
    debit:         Number(form.watch(`lines.${i}.debit`))   || 0,
    credit:        Number(form.watch(`lines.${i}.credit`))  || 0,
  }));

  const { handlePreview: handleValidatedPreview } = useFinanceValidation({
    lines:        validationLines,
    periodStatus: activePeriod?.status,
  });

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;

  // Preview form hook - manages preview dialog flow
  const previewForm = usePreviewForm({
    form,
    onSubmit: async (values) => {
      // This is called after confirming in preview dialog
      const parseLines = (lines: typeof values.lines) =>
        (lines || []).map(l => ({ ...l, debit: Number(l.debit), credit: Number(l.credit) }));
      if (editTarget) {
        await updateMutation.mutateAsync({
          id: editTarget.id,
          input: {
            date: values.date,
            description: values.description,
            lines: parseLines(values.lines),
          },
        });
        toast.success('Jurnal berhasil diperbarui');
      } else {
        await createMutation.mutateAsync({ ...values, lines: parseLines(values.lines) });
        toast.success('Jurnal berhasil dibuat');
      }
      setDialogOpen(false);
    },
    config: jurnalMemorialPreviewConfig,
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
    form.reset({
      periodId,
      date: new Date().toISOString().slice(0, 10),
      description: '',
      lines: [defaultLine, defaultLine],
    });
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (journal: JurnalMemorial) => {
    form.reset({
      periodId: journal.periodId,
      date: journal.date,
      description: journal.description,
      lines: journal.lines.map((l) => ({
        accountNumber: l.accountNumber,
        accountName: l.accountName,
        debit: Number(l.debit),
        credit: Number(l.credit),
        lineDescription: l.lineDescription ?? '',
      })),
    });
    setEditTarget(journal);
    setDialogOpen(true);
  };

  // Handle form submit - use preview instead of direct submit
  const onSubmit = async () => {
    const valid = await previewForm.handlePreview();
    if (!valid) return;
  };

  const onPost = async (id: number) => {
    try {
      await postMutation.mutateAsync(id);
      toast.success('Jurnal berhasil di-posting');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal posting jurnal');
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Jurnal berhasil dihapus');
      setDeleteTarget(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus jurnal');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const journals = data?.journals ?? [];
  const draftCount = journals.filter((j) => j.status === 'DRAFT').length;
  const postedCount = journals.filter((j) => j.status === 'POSTED').length;
  const isPeriodClosed = activePeriod && activePeriod.status !== 'OPEN';

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Jurnal Memorial
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">Jurnal penyesuaian per periode</p>
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
            {/* Excel Export */}
            <Button
              variant="outline"
              disabled={journals.length === 0}
              onClick={() => {
                const monthName = MONTHS[month - 1];
                const filename = `Jurnal-Memorial-${monthName}-${year}`;
                // Flatten journal lines for export
                const exportData = journals.flatMap(j =>
                  j.lines.map(l => ({
                    nomorJurnal: j.journalCode,
                    tanggal: j.date,
                    keterangan: j.description,
                    status: j.status,
                    akun: `${l.accountNumber} - ${l.accountName}`,
                    debit: Number(l.debit) > 0 ? formatRp(l.debit) : '—',
                    kredit: Number(l.credit) > 0 ? formatRp(l.credit) : '—',
                  }))
                );
                const columns: ExcelColumn[] = [
                  { header: 'No. Jurnal', key: 'nomorJurnal', width: 16 },
                  { header: 'Tanggal', key: 'tanggal', width: 14 },
                  { header: 'Keterangan', key: 'keterangan', width: 35 },
                  { header: 'Status', key: 'status', width: 10 },
                  { header: 'Akun', key: 'akun', width: 30 },
                  { header: 'Debit', key: 'debit', width: 18 },
                  { header: 'Kredit', key: 'kredit', width: 18 },
                ];
                exportToExcel(exportData, columns, { filename });
                toast.success('Data berhasil di-export ke Excel');
              }}
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-6 rounded-xl"
            >
              <FileText className="w-4 h-4 mr-1" />
              Excel
            </Button>
            {/* PDF Export */}
            <Button
              variant="outline"
              disabled={journals.length === 0}
              onClick={async () => {
                const monthName = MONTHS[month - 1];
                const filename = `Jurnal-Memorial-${monthName}-${year}`;
                const exportData = journals.flatMap(j =>
                  j.lines.map(l => ({
                    nomorJurnal: j.journalCode,
                    tanggal: j.date,
                    keterangan: j.description,
                    status: j.status,
                    akun: `${l.accountNumber} - ${l.accountName}`,
                    debit: Number(l.debit) > 0 ? formatRp(l.debit) : '—',
                    kredit: Number(l.credit) > 0 ? formatRp(l.credit) : '—',
                  }))
                );
                const columns: PDFColumn[] = [
                  { header: 'No. Jurnal', key: 'nomorJurnal', width: 24 },
                  { header: 'Tanggal', key: 'tanggal', width: 20 },
                  { header: 'Keterangan', key: 'keterangan' },
                  { header: 'Status', key: 'status', width: 14 },
                  { header: 'Akun', key: 'akun', width: 42 },
                  { header: 'Debit', key: 'debit', width: 26 },
                  { header: 'Kredit', key: 'kredit', width: 26 },
                ];
                await exportToPDF(exportData, columns, {
                  filename,
                  title: 'JURNAL MEMORIAL',
                  subtitle: `Periode: ${monthName} ${year}`,
                  landscape: true,
                });
                toast.success('Data berhasil di-export ke PDF');
              }}
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-6 rounded-xl"
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button
              onClick={openCreate}
              disabled={!!isPeriodClosed}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1" />
              Buat Jurnal
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FinanceStatCard
            title="Total Jurnal"
            value={String(journals.length)}
            description="Jurnal pada periode ini"
            icon={<FileText className="h-6 w-6" />}
            color="#3b82f6"
          />
          <FinanceStatCard
            title="Draft"
            value={String(draftCount)}
            description="Belum di-posting"
            icon={<FileEdit className="h-6 w-6" />}
            color="#6B6B75"
          />
          <FinanceStatCard
            title="Posted"
            value={String(postedCount)}
            description="Sudah di-posting"
            icon={<FileCheck className="h-6 w-6" />}
            color="#22c55e"
          />
        </div>

        {/* Journal list */}
        <div className="space-y-3">
          {isLoading ? (
            <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
              <CardContent className="py-16 text-center">
                <div className="h-32 flex flex-col items-center justify-center gap-4">
                  <div className="h-10 w-10 rounded-lg border border-[#1E1E22] p-2 flex items-center justify-center">
                    <span className="h-5 w-5 rounded bg-[#F5A623]/30 loader-cube" />
                  </div>
                  <p className="text-[#6B6B75] text-sm font-medium">Memuat data...</p>
                </div>
              </CardContent>
            </Card>
          ) : isError ? (
            <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
              <CardContent className="py-10 text-center text-red-500">
                Gagal memuat data
              </CardContent>
            </Card>
          ) : journals.length === 0 ? (
            <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
              <CardContent className="py-16 text-center text-[#6B6B75]">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                Tidak ada jurnal pada periode ini
              </CardContent>
            </Card>
          ) : (
            journals.map((journal) => {
              const statusInfo = STATUS_BADGE[journal.status] ?? STATUS_BADGE.DRAFT;
              const isOpen = expandedIds.has(journal.id);
              const jTotalDebit = journal.lines.reduce((s, l) => s + Number(l.debit), 0);
              const jTotalCredit = journal.lines.reduce((s, l) => s + Number(l.credit), 0);

              return (
                <Collapsible
                  key={journal.id}
                  open={isOpen}
                  onOpenChange={() => toggleExpand(journal.id)}
                >
                  <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl hover:border-[#F5A623]/30 transition-all">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CollapsibleTrigger asChild>
                          <button className="flex items-center gap-3 text-left flex-1">
                            <span className="font-mono text-sm font-semibold text-[#F0F0F0]">
                              {journal.journalCode}
                            </span>
                            <span className="text-[#6B6B75] text-xs">{journal.date}</span>
                            <span className="text-sm truncate max-w-[300px] text-[#F0F0F0]">
                              {journal.description}
                            </span>
                            <Badge className={`text-xs ${statusInfo.className}`}>
                              {statusInfo.label}
                            </Badge>
                          </button>
                        </CollapsibleTrigger>
                        <div className="flex items-center gap-2 ml-4">
                          {journal.status === 'DRAFT' && !isPeriodClosed && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-green-500 text-green-500 hover:bg-green-500/10 bg-transparent"
                                onClick={() => onPost(journal.id)}
                                disabled={postMutation.isPending}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Post
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-[#1E1E22] rounded-lg"
                                onClick={() => openEdit(journal)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                onClick={() => setDeleteTarget(journal)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4 px-4">
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
                            {journal.lines.map((line, idx) => (
                              <TableRow
                                key={idx}
                                className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                              >
                                <TableCell className="font-mono text-xs text-[#F0F0F0]">
                                  {line.accountNumber}
                                </TableCell>
                                <TableCell className="text-sm text-[#F0F0F0]">
                                  {line.accountName}
                                </TableCell>
                                <TableCell className="text-xs text-[#6B6B75]">
                                  {line.lineDescription ?? '—'}
                                </TableCell>
                                <TableCell className="text-right text-sm text-green-500">
                                  {Number(line.debit) > 0 ? formatRp(line.debit) : '—'}
                                </TableCell>
                                <TableCell className="text-right text-sm text-red-500">
                                  {Number(line.credit) > 0 ? formatRp(line.credit) : '—'}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="border-t-2 border-[#1E1E22] bg-[#0A0A0B]/50">
                              <TableCell colSpan={3} className="text-right font-semibold text-sm text-[#F0F0F0]">
                                Total
                              </TableCell>
                              <TableCell className="text-right font-bold text-green-500">
                                {formatRp(jTotalDebit)}
                              </TableCell>
                              <TableCell className="text-right font-bold text-red-500">
                                {formatRp(jTotalCredit)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })
          )}
        </div>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">
                {editTarget ? 'Edit Jurnal Memorial' : 'Buat Jurnal Memorial'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Keterangan Jurnal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Deskripsi jurnal"
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Lines */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-semibold text-[#F0F0F0]">
                      Baris Jurnal
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
                      onClick={() => append(defaultLine)}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Tambah Baris
                    </Button>
                  </div>
                  <div className="border border-[#1E1E22] rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-[#0A0A0B]">
                        <TableRow className="hover:bg-transparent border-[#1E1E22]">
                          <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[110px]">
                            No. Akun
                          </TableHead>
                          <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3">
                            Nama Akun
                          </TableHead>
                          <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[110px]">
                            Keterangan
                          </TableHead>
                          <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[110px]">
                            Debit
                          </TableHead>
                          <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[110px]">
                            Kredit
                          </TableHead>
                          <TableHead className="w-[40px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, idx) => (
                          <TableRow
                            key={field.id}
                            className="border-[#1E1E22] hover:bg-white/[0.02]"
                          >
                            <TableCell className="py-1 px-2">
                              <FormField
                                control={form.control}
                                name={`lines.${idx}.accountNumber`}
                                render={({ field: f }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        className="h-7 text-xs bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                                        placeholder="1-1100"
                                        {...f}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-1 px-2">
                              <FormField
                                control={form.control}
                                name={`lines.${idx}.accountName`}
                                render={({ field: f }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        className="h-7 text-xs bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                                        placeholder="Nama akun"
                                        {...f}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-1 px-2">
                              <FormField
                                control={form.control}
                                name={`lines.${idx}.lineDescription`}
                                render={({ field: f }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        className="h-7 text-xs bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                                        placeholder="Opsional"
                                        {...f}
                                        value={f.value ?? ''}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-1 px-2">
                              <FormField
                                control={form.control}
                                name={`lines.${idx}.debit`}
                                render={({ field: f }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        className="h-7 text-xs bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        {...f}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-1 px-2">
                              <FormField
                                control={form.control}
                                name={`lines.${idx}.credit`}
                                render={({ field: f }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        className="h-7 text-xs bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        {...f}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-1 px-2">
                              {fields.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                  onClick={() => remove(idx)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Balance indicator */}
                  <div
                    className={`flex justify-end gap-6 text-sm px-2 py-1 rounded-md ${
                      isBalanced ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    <span>
                      Total Debit: <strong>{formatRp(totalDebit)}</strong>
                    </span>
                    <span>
                      Total Kredit: <strong>{formatRp(totalCredit)}</strong>
                    </span>
                    {!isBalanced && <span className="text-xs">(Belum seimbang)</span>}
                  </div>
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
                        periodId: activePeriod?.id,
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
                Hapus Jurnal?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B6B75]">
                Jurnal <strong className="text-[#F0F0F0]">{deleteTarget?.journalCode}</strong> akan
                dihapus. Tindakan ini tidak dapat dibatalkan.
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
          title={editTarget ? 'Preview Edit Jurnal Memorial' : 'Preview Buat Jurnal Memorial'}
          config={jurnalMemorialPreviewConfig}
          onConfirm={previewForm.handleConfirm}
          onEdit={previewForm.handleEdit}
          isSubmitting={previewForm.isSubmitting}
        />
      </div>
    </div>
  );
}
