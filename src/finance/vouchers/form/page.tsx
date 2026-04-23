import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowLeft, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useAccountingPeriods, useCreatePeriod } from '@/hooks/useAccountingPeriods';
import { useCreateVoucher, useUpdateVoucher, useVoucherById } from '@/hooks/useVouchers';
import { voucherFormSchema, type VoucherFormValues } from '../schema';
import AccountSelectorInline from '@/finance/components/AccountSelectorInline';
import { FinancePreviewDialog, usePreviewForm } from '@/finance/components/preview';
import { vouchersPreviewConfig } from '../preview-config';
import { useFinanceValidation, type ValidationLine } from '@/lib/finance-validation';

const now = new Date();

const defaultLine = { accountNumber: '', accountName: '', description: '', debit: 0, credit: 0 };

const formatRp = (val: number) =>
  `Rp ${val.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

export default function VoucherFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const isEdit = !!id;

  const { data: voucher } = useVoucherById(id ? Number(id) : undefined);
  const { data: periods = [] } = useAccountingPeriods();
  const createPeriodMutation = useCreatePeriod();
  const createMutation = useCreateVoucher();
  const updateMutation = useUpdateVoucher();

  // Use month/year from navigation state (set by vouchers list) or fall back to current date
  const stateMonth = (location.state as { month?: number; year?: number } | null)?.month;
  const stateYear = (location.state as { month?: number; year?: number } | null)?.year;
  const currentYear = stateYear ?? now.getFullYear();
  const currentMonth = stateMonth ?? (now.getMonth() + 1);
  const activePeriod = periods.find((p) => p.year === currentYear && p.month === currentMonth);

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      periodId: activePeriod?.id ?? 0,
      voucherType: 'KAS_KECIL',
      date: now.toISOString().slice(0, 10),
      payee: '',
      description: '',
      paymentMethod: '',
      receivedBy: '',
      attachmentUrl: '',
      lines: [defaultLine, defaultLine],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines' });

  const watchedLines = form.watch('lines');

  // voucherNumber is not part of the form schema — it is assigned by the backend.
  // For edit flows it comes from the loaded voucher object; for new vouchers it is undefined.
  const voucherNumValue = voucher?.voucherNumber;

  const voucherValidationLines: ValidationLine[] = (watchedLines ?? []).map((l) => ({
    accountNumber: l.accountNumber ?? '',
    accountName:   l.accountName   ?? '',
    debit:         Number(l.debit)   || 0,
    credit:        Number(l.credit)  || 0,
  }));

  const { handlePreview: handleValidatedPreview } = useFinanceValidation({
    lines:        voucherValidationLines,
    periodStatus: activePeriod?.status,
  });

  const totalDebit = watchedLines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = watchedLines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;

  // Preview form hook - manages preview dialog flow
  const previewForm = usePreviewForm({
    form,
    onSubmit: async (values) => {
      // This is called after confirming in preview dialog
      const parseLines = (lines: typeof values.lines) =>
        (lines || []).map(l => ({ ...l, debit: Number(l.debit), credit: Number(l.credit) }));
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: Number(id),
          input: {
            date: values.date,
            payee: values.payee,
            description: values.description,
            paymentMethod: values.paymentMethod || null,
            receivedBy: values.receivedBy || null,
            attachmentUrl: values.attachmentUrl || null,
            lines: parseLines(values.lines),
          },
        });
        toast.success('Voucher berhasil diperbarui');
      } else {
        let periodId = activePeriod?.id;
        if (!periodId) {
          const p = await createPeriodMutation.mutateAsync({ year: currentYear, month: currentMonth });
          periodId = p.id;
        }
        await createMutation.mutateAsync({ ...values, periodId, lines: parseLines(values.lines), attachmentUrl: values.attachmentUrl || null });
        toast.success('Voucher berhasil dibuat');
      }
      navigate('/finance/vouchers');
    },
    config: vouchersPreviewConfig,
  });

  useEffect(() => {
    if (isEdit && voucher) {
      form.reset({
        periodId: voucher.periodId,
        voucherType: voucher.voucherType,
        date: voucher.date,
        payee: voucher.payee,
        description: voucher.description,
        paymentMethod: voucher.paymentMethod ?? '',
        receivedBy: voucher.receivedBy ?? '',
        attachmentUrl: voucher.attachmentUrl ?? '',
        lines: voucher.lines.map((l) => ({
          accountNumber: l.accountNumber,
          accountName: l.accountName,
          description: l.description ?? '',
          debit: Number(l.debit),
          credit: Number(l.credit),
        })),
      });
    }
  }, [voucher, isEdit, form]);

  // Handle form submit - use preview instead of direct submit
  const onSubmit = async () => {
    const valid = await previewForm.handlePreview();
    if (!valid) return;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              {isEdit ? 'Edit Voucher' : 'Buat Voucher Baru'}
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              {isEdit ? `Voucher ${voucher?.voucherNumber ?? ''}` : 'Isi detail voucher di bawah ini'}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Main info */}
            <Card className="bg-[#111113] border-[#1E1E22]">
              <CardHeader>
                <CardTitle className="text-base text-[#F0F0F0]">Informasi Voucher</CardTitle>
              </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="voucherType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Tipe Voucher</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={isEdit}>
                      <FormControl>
                        <SelectTrigger className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111113] border-[#1E1E22]">
                        <SelectItem value="KAS_KECIL" className="text-[#F0F0F0] focus:bg-[#1E1E22]">Kas Kecil</SelectItem>
                        <SelectItem value="KAS_BANK" className="text-[#F0F0F0] focus:bg-[#1E1E22]">Kas Bank</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="payee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Penerima (Payee)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama penerima pembayaran"
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Metode Pembayaran</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tunai / Transfer / dll"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
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
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-[#F0F0F0]">Keterangan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Keterangan tujuan pembayaran"
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
                name="receivedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Diterima Oleh (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama penerima"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="attachmentUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">URL Lampiran (Opsional)</FormLabel>
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
            </CardContent>
          </Card>

          {/* Accounting lines */}
          <Card className="bg-[#111113] border-[#1E1E22]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[#F0F0F0]">Baris Akuntansi</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
                  onClick={() => append(defaultLine)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Baris
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#0A0A0B]">
                  <TableRow className="hover:bg-transparent border-[#1E1E22]">
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[200px]">Akun</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[140px]">Keterangan</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[120px]">Debit (Rp)</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-3 w-[120px]">Kredit (Rp)</TableHead>
                    <TableHead className="w-[40px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, idx) => {
                    const accountNumber = form.watch(`lines.${idx}.accountNumber`);
                    const accountName = form.watch(`lines.${idx}.accountName`);
                    const accountValue = accountNumber ? { code: accountNumber, name: accountName || '' } : null;

                    return (
                      <TableRow key={field.id} className="border-[#1E1E22] hover:bg-white/[0.02]">
                        <TableCell className="py-1.5 px-2">
                          <FormField
                            control={form.control}
                            name={`lines.${idx}.accountNumber`}
                            render={() => (
                              <FormItem>
                                <FormControl>
                                  <AccountSelectorInline
                                    value={accountValue}
                                    onChange={(account) => {
                                      if (account) {
                                        form.setValue(`lines.${idx}.accountNumber`, account.code);
                                        form.setValue(`lines.${idx}.accountName`, account.name);
                                      } else {
                                        form.setValue(`lines.${idx}.accountNumber`, '');
                                        form.setValue(`lines.${idx}.accountName`, '');
                                      }
                                    }}
                                    placeholder="Pilih akun..."
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="py-1.5 px-2">
                          <FormField
                            control={form.control}
                            name={`lines.${idx}.description`}
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
                        <TableCell className="py-1.5 px-2">
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
                                    step={1000}
                                    placeholder="0"
                                    {...f}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="py-1.5 px-2">
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
                                    step={1000}
                                    placeholder="0"
                                    {...f}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="py-1.5 px-2">
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:bg-red-500/10 rounded-lg"
                              onClick={() => remove(idx)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Balance indicator */}
              <div
                className={`flex justify-end gap-6 text-sm px-4 py-2 border-t border-[#1E1E22] ${
                  isBalanced ? 'text-green-500' : 'text-red-500'
                }`}
              >
                <span>
                  Total Debit: <strong>{formatRp(totalDebit)}</strong>
                </span>
                <span>
                  Total Kredit: <strong>{formatRp(totalCredit)}</strong>
                </span>
                {!isBalanced && <span className="text-xs font-medium">(Belum seimbang)</span>}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
              onClick={() => navigate('/finance/vouchers')}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                handleValidatedPreview(previewForm.handlePreview, {
                  periodId:    activePeriod?.id,
                  voucherCode: voucherNumValue ?? undefined,
                  type:        'VOUCHER',
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
          </div>
        </form>
      </Form>

      {/* Preview Dialog */}
      <FinancePreviewDialog
        open={previewForm.previewOpen}
        onOpenChange={(open) => !open && navigate('/finance/vouchers')}
        data={previewForm.previewData}
        title={isEdit ? 'Preview Edit Voucher' : 'Preview Buat Voucher Baru'}
        config={vouchersPreviewConfig}
        onConfirm={previewForm.handleConfirm}
        onEdit={previewForm.handleEdit}
        isSubmitting={previewForm.isSubmitting}
      />
      </div>
    </div>
  );
}
