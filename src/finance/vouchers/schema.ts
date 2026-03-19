import { z } from 'zod';

export const VOUCHER_TYPES = ['KAS_KECIL', 'KAS_BANK'] as const;
export const VOUCHER_STATUSES = [
  'DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'PAID', 'REJECTED', 'CANCELLED',
] as const;

export const voucherLineSchema = z.object({
  accountNumber: z.string().min(1, 'No. akun wajib diisi'),
  accountName: z.string().min(1, 'Nama akun wajib diisi'),
  description: z.string().optional().nullable(),
  debit: z.coerce.number().min(0).default(0),
  credit: z.coerce.number().min(0).default(0),
});

export const voucherFormSchema = z.object({
  periodId: z.number().int().positive(),
  voucherType: z.enum(VOUCHER_TYPES),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  payee: z.string().min(1, 'Penerima wajib diisi'),
  description: z.string().min(1, 'Keterangan wajib diisi'),
  paymentMethod: z.string().optional().nullable(),
  receivedBy: z.string().optional().nullable(),
  attachmentUrl: z.string().url('URL tidak valid').optional().nullable(),
  lines: z.array(voucherLineSchema).min(1, 'Minimal 1 baris wajib diisi'),
}).refine(
  (d) => {
    const totalDebit = d.lines.reduce((s, l) => s + (l.debit ?? 0), 0);
    const totalCredit = d.lines.reduce((s, l) => s + (l.credit ?? 0), 0);
    return Math.abs(totalDebit - totalCredit) < 0.001;
  },
  { message: 'Total debit harus sama dengan total kredit', path: ['lines'] }
);

export type VoucherFormValues = z.infer<typeof voucherFormSchema>;
export type VoucherLineFormValues = z.infer<typeof voucherLineSchema>;
