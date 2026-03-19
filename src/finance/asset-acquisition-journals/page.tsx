import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { PeriodSelector } from '@/finance/components/PeriodSelector';
import AccountSelectorInline from '@/finance/components/AccountSelectorInline';
import { useAccountingPeriods, useCreatePeriod } from '@/hooks/useAccountingPeriods';
import { useAssets } from '@/hooks/useAssets';
import {
  useAcquisitionJournals,
  useCreateAcquisitionJournal,
  usePostAcquisitionJournal,
  useDeleteAcquisitionJournal,
} from '@/hooks/useAssetJournals';
import type { AssetAcquisitionJournal } from './types';

const formatRp = (val: string | number) =>
  `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

const formSchema = z.object({
  assetId: z.coerce.number().int().positive('Pilih aset'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().min(1, 'Keterangan wajib diisi'),
  debitAccount: z.string().min(1, 'Akun debit wajib diisi'),
  debitAccountName: z.string().min(1, 'Nama akun debit wajib diisi'),
  creditAccount: z.string().min(1, 'Akun kredit wajib diisi'),
  creditAccountName: z.string().min(1, 'Nama akun kredit wajib diisi'),
  amount: z.coerce.number().positive('Jumlah harus > 0'),
  notes: z.string().optional().nullable(),
});
type FormValues = {
  assetId: number;
  date: string;
  description: string;
  debitAccount: string;
  debitAccountName: string;
  creditAccount: string;
  creditAccountName: string;
  amount: number;
  notes?: string | null;
};

export default function AssetAcquisitionJournalsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AssetAcquisitionJournal | null>(null);

  const { data: periods = [] } = useAccountingPeriods();
  const createPeriodMutation = useCreatePeriod();
  const activePeriod = periods.find((p) => p.year === year && p.month === month);

  const { data: journals = [], isLoading } = useAcquisitionJournals(activePeriod?.id);
  const { data: assets = [] } = useAssets();
  const createMutation = useCreateAcquisitionJournal();
  const postMutation = usePostAcquisitionJournal();
  const deleteMutation = useDeleteAcquisitionJournal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as import('react-hook-form').Resolver<FormValues>,
    defaultValues: {
      assetId: 0,
      date: now.toISOString().slice(0, 10),
      description: '',
      debitAccount: '',
      debitAccountName: '',
      creditAccount: '',
      creditAccountName: '',
      amount: 0,
      notes: '',
    },
  });

  const handleAssetChange = (assetId: string) => {
    const a = assets.find((x) => x.id === Number(assetId));
    form.setValue('assetId', Number(assetId));
    if (a) {
      if (a.coaAssetAccount) {
        form.setValue('debitAccount', a.coaAssetAccount);
        form.setValue('debitAccountName', a.name);
      }
      form.setValue('amount', Number(a.purchaseAmount));
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let periodId = activePeriod?.id;
      if (!periodId) {
        const p = await createPeriodMutation.mutateAsync({ year, month });
        periodId = p.id;
      }
      await createMutation.mutateAsync({ ...values, periodId });
      toast.success('Jurnal berhasil dibuat');
      setDialogOpen(false);
      form.reset();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal membuat jurnal');
    }
  };

  const handlePost = async (j: AssetAcquisitionJournal) => {
    try {
      await postMutation.mutateAsync(j.id);
      toast.success('Jurnal berhasil diposting');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal posting jurnal');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Jurnal dihapus');
      setDeleteTarget(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus jurnal');
    }
  };

  const isPeriodClosed = activePeriod && activePeriod.status !== 'OPEN';

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Jurnal Memori Aset
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Pencatatan perolehan aset ke jurnal akuntansi
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
              onClick={() => setDialogOpen(true)}
              disabled={!!isPeriodClosed}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1" /> Buat Jurnal
            </Button>
          </div>
        </div>

        {isPeriodClosed && (
          <div className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">
            Periode ini sudah ditutup. Data hanya bisa dilihat.
          </div>
        )}

        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0A0A0B]">
                <TableRow className="hover:bg-transparent border-[#1E1E22]">
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[140px]">
                    Kode Jurnal
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Aset
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                    Keterangan
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[130px]">
                    Jumlah
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[90px]">
                    Status
                  </TableHead>
                  <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[90px]" />
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
                      Belum ada jurnal pada periode ini
                    </TableCell>
                  </TableRow>
                ) : (
                  journals.map((j) => (
                    <TableRow
                      key={j.id}
                      className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                    >
                      <TableCell className="font-mono text-xs text-[#F0F0F0]">
                        {j.journalCode}
                      </TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">
                        {j.assetName ?? j.assetId}
                      </TableCell>
                      <TableCell className="text-sm text-[#F0F0F0]">{j.date}</TableCell>
                      <TableCell className="text-sm text-[#6B6B75]">{j.description}</TableCell>
                      <TableCell className="text-right text-sm font-semibold text-[#F0F0F0]">
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
                        <div className="flex items-center gap-1 justify-end">
                          {j.status === 'DRAFT' && !isPeriodClosed && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-500 hover:bg-green-500/10 rounded-lg"
                                title="Post"
                                onClick={() => handlePost(j)}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                onClick={() => setDeleteTarget(j)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create dialog */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(o) => {
            if (!o) {
              setDialogOpen(false);
              form.reset();
            }
          }}
        >
          <DialogContent className="sm:max-w-lg bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <DialogHeader>
              <DialogTitle className="text-[#F0F0F0]">Buat Jurnal Memori Aset</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="assetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">Aset</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={handleAssetChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
                            <SelectValue placeholder="Pilih aset..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#111113] border-[#1E1E22]">
                          {assets.map((a) => (
                            <SelectItem
                              key={a.id}
                              value={String(a.id)}
                              className="text-[#F0F0F0] focus:bg-[#1E1E22]"
                            >
                              {a.assetCode ? `[${a.assetCode}] ` : ''}{a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
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
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F0F0F0]">Jumlah (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">Keterangan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Keterangan jurnal"
                          className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="debitAccount"
                    render={({ field }) => {
                      const debitAccountName = form.watch('debitAccountName');
                      const debitValue = field.value ? { code: field.value, name: debitAccountName || '' } : null;

                      return (
                        <FormItem>
                          <FormLabel className="text-[#F0F0F0]">Akun Debit</FormLabel>
                          <FormControl>
                            <AccountSelectorInline
                              value={debitValue}
                              onChange={(account) => {
                                if (account) {
                                  form.setValue('debitAccount', account.code);
                                  form.setValue('debitAccountName', account.name);
                                } else {
                                  form.setValue('debitAccount', '');
                                  form.setValue('debitAccountName', '');
                                }
                              }}
                              placeholder="Pilih akun debit..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="creditAccount"
                    render={({ field }) => {
                      const creditAccountName = form.watch('creditAccountName');
                      const creditValue = field.value ? { code: field.value, name: creditAccountName || '' } : null;

                      return (
                        <FormItem>
                          <FormLabel className="text-[#F0F0F0]">Akun Kredit</FormLabel>
                          <FormControl>
                            <AccountSelectorInline
                              value={creditValue}
                              onChange={(account) => {
                                if (account) {
                                  form.setValue('creditAccount', account.code);
                                  form.setValue('creditAccountName', account.name);
                                } else {
                                  form.setValue('creditAccount', '');
                                  form.setValue('creditAccountName', '');
                                }
                              }}
                              placeholder="Pilih akun kredit..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F0F0F0]">Catatan (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Catatan tambahan"
                          className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
                    onClick={() => {
                      setDialogOpen(false);
                      form.reset();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
                  >
                    Buat Jurnal
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#F0F0F0]">
                Hapus Jurnal?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B6B75]">
                Jurnal <strong className="text-[#F0F0F0]">{deleteTarget?.journalCode}</strong> akan
                dihapus.
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
