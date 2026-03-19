import { z } from 'zod';

export const kasKecilFormSchema = z.object({
  mode: z.enum(['manual', 'saldoAwal']),
  periodId: z.number().int().positive(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().min(1, 'Keterangan wajib diisi'),
  debit: z.number().min(0, 'Debit tidak boleh negatif'),
  credit: z.number().min(0, 'Kredit tidak boleh negatif'),
  attachmentUrl: z.string().url('URL tidak valid').optional().nullable(),
  accountNumber: z.string().min(1, 'Kode akun wajib diisi'),
  accountName: z.string().min(1, 'Nama akun wajib diisi'),
  saldoFromPeriodId: z.number().int().positive('Pilih periode sebelumnya').optional(),
  // Manual saldo awal input - allows user to input opening balance directly
  saldoAwalManual: z.coerce.number().min(0, 'Saldo awal tidak boleh negatif').optional(),
  // Voucher code - auto-generated, editable, must be unique
  voucherCode: z.string().min(1, 'Kode voucher wajib diisi'),
}).refine((d) => {
  // For saldoAwal mode with previous period, saldoFromPeriodId is required
  if (d.mode === 'saldoAwal' && !d.saldoFromPeriodId && !d.saldoAwalManual) {
    return false;
  }
  // Debit or credit must be filled
  return d.debit > 0 || d.credit > 0;
}, { message: 'Debit atau kredit harus diisi', path: ['debit'] });

export type KasKecilFormValues = z.infer<typeof kasKecilFormSchema>;
