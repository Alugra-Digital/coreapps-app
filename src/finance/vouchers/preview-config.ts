/**
 * Vouchers Preview Configuration
 * Configuration for previewing Voucher entries
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { VoucherFormValues } from './schema';

export const vouchersPreviewConfig: PreviewConfig<VoucherFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Voucher',
      grid: 2,
      fields: [
        fieldPresets.date('date', 'Tanggal'),
        {
          key: 'periodId',
          label: 'Periode',
          type: 'text',
          formatter: (value) => `Periode #${value}`,
        },
      ],
    },
    {
      title: 'Detail Voucher',
      grid: 2,
      fields: [
        fieldPresets.enum('voucherType', 'Tipe Voucher', {
          KAS_KECIL: 'Kas Kecil',
          KAS_BANK: 'Kas Bank',
        }),
        fieldPresets.text('payee', 'Penerima'),
      ],
    },
    {
      title: 'Keterangan & Pembayaran',
      grid: 2,
      fields: [
        fieldPresets.text('description', 'Keterangan'),
        fieldPresets.text('paymentMethod', 'Metode Pembayaran').condition((data) => !!data.paymentMethod),
      ],
    },
    {
      title: 'Lampiran',
      grid: 1,
      fields: [
        fieldPresets.url('attachmentUrl', 'URL Lampiran').condition((data) => !!data.attachmentUrl),
        fieldPresets.text('receivedBy', 'Diterima Oleh').condition((data) => !!data.receivedBy),
      ],
    },
    {
      title: 'Rincian Baris Voucher',
      grid: 1,
      fields: [
        {
          key: 'lines',
          label: 'Baris Jurnal',
          type: 'text',
          formatter: (_, data) => {
            if (!data.lines || data.lines.length === 0) return '—';

            // Calculate totals
            const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit ?? 0), 0);
            const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit ?? 0), 0);

            // Format lines
            const linesText = data.lines.map((line, index) => {
              const debit = line.debit > 0 ? `Rp ${line.debit.toLocaleString('id-ID')}` : '—';
              const credit = line.credit > 0 ? `Rp ${line.credit.toLocaleString('id-ID')}` : '—';
              return `${index + 1}. ${line.accountNumber} - ${line.accountName} | D: ${debit} | K: ${credit} ${line.description ? `| ${line.description}` : ''}`;
            }).join('\n');

            return `${linesText}\n\nTotal Debit: Rp ${totalDebit.toLocaleString('id-ID')}\nTotal Kredit: Rp ${totalCredit.toLocaleString('id-ID')}`;
          },
        },
      ],
    },
  ],
});
