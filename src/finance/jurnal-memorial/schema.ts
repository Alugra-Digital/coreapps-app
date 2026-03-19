import { z } from 'zod';

export const jurnalLineSchema = z.object({
  accountNumber: z.string().min(1, 'No. akun wajib diisi'),
  accountName: z.string().min(1, 'Nama akun wajib diisi'),
  debit: z.coerce.number().min(0),
  credit: z.coerce.number().min(0),
  lineDescription: z.string().optional().nullable(),
});

export const jurnalMemorialFormSchema = z.object({
  periodId: z.number().int().positive(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().min(1, 'Keterangan wajib diisi'),
  lines: z.array(jurnalLineSchema).min(2, 'Minimal 2 baris jurnal diperlukan'),
}).refine(
  (d) => {
    const totalDebit = d.lines.reduce((s, l) => s + (l.debit ?? 0), 0);
    const totalCredit = d.lines.reduce((s, l) => s + (l.credit ?? 0), 0);
    return Math.abs(totalDebit - totalCredit) < 0.001;
  },
  { message: 'Total debit harus sama dengan total kredit', path: ['lines'] }
);

export type JurnalMemorialFormValues = z.infer<typeof jurnalMemorialFormSchema>;
export type JurnalLineFormValues = z.infer<typeof jurnalLineSchema>;
