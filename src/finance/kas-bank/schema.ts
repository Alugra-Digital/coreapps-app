import { z } from 'zod';

const kasBankTransactionLineSchema = z.object({
  accountNumber: z.string().min(1, 'Nomor akun wajib diisi'),
  accountName: z.string().optional(),
  debit: z.number().min(0, 'Debit tidak boleh negatif').default(0),
  credit: z.number().min(0, 'Kredit tidak boleh negatif').default(0),
  description: z.string().optional(),
});

export const kasBankFormSchema = z.object({
  periodId: z.number().int().positive(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  coaAccount: z.string().min(1, 'Akun COA wajib diisi'),
  description: z.string().min(1, 'Keterangan wajib diisi'),
  inflow: z.coerce.number().min(0, 'Masuk tidak boleh negatif').default(0),
  outflow: z.coerce.number().min(0, 'Keluar tidak boleh negatif').default(0),
  reference: z.string().optional().nullable(),
  lines: z.array(kasBankTransactionLineSchema).optional().default([]),
  // Voucher code - auto-generated, editable, must be unique
  voucherCode: z.string().min(1, 'Kode voucher wajib diisi'),
}).refine((d) => d.inflow > 0 || d.outflow > 0, {
  message: 'Pemasukan atau pengeluaran harus diisi',
  path: ['inflow'],
}).refine((d) => {
  // Validate multi-line entries
  if (d.lines && d.lines.length > 0) {
    const totalDebit = d.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = d.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    if (d.inflow > 0 && totalDebit !== d.inflow) {
      return false;
    }
    if (d.outflow > 0 && totalCredit !== d.outflow) {
      return false;
    }
  }
  return true;
}, {
  message: 'Total debit/kredit dari baris harus sesuai dengan jumlah masuk/keluar',
  path: ['lines'],
});

export type KasBankFormValues = z.infer<typeof kasBankFormSchema>;
export type KasBankTransactionLineValues = z.infer<typeof kasBankTransactionLineSchema>;
