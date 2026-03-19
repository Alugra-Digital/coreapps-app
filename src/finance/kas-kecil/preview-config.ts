/**
 * Kas Kecil Preview Configuration
 * Configuration for previewing Kas Kecil (Petty Cash) transactions
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { KasKecilFormValues } from './schema';

export const kasKecilPreviewConfig: PreviewConfig<KasKecilFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Transaksi',
      grid: 1,
      fields: [
        fieldPresets.enum('mode', 'Mode Input', {
          manual: 'Input Manual',
          saldoAwal: 'Saldo Awal',
        }),
        fieldPresets.text('voucherCode', 'Kode Voucher'),
        fieldPresets.text('transNumber', 'No. Transaksi').condition((data) => {
          // Only show transNumber if it exists (edit mode)
          return (data as KasKecilFormValues).transNumber !== undefined;
        }),
      ],
    },
    {
      title: 'Detail Periode',
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
      title: 'Keterangan & Akun',
      grid: 2,
      fields: [
        fieldPresets.text('description', 'Keterangan'),
        {
          key: 'accountNumber',
          label: 'Akun',
          type: 'text',
          formatter: (__, data) => {
            const accountNumber = data.accountNumber;
            const accountName = data.accountName;
            if (accountNumber && accountName) {
              return `${accountNumber} - ${accountName}`;
            }
            return accountNumber || accountName || '—';
          },
        },
      ],
    },
    {
      title: 'Nilai Transaksi',
      grid: 2,
      fields: [
        fieldPresets.currency('debit', 'Debit').condition((data) => data.debit > 0),
        fieldPresets.currency('credit', 'Kredit').condition((data) => data.credit > 0),
      ],
    },
    {
      title: 'Saldo Awal',
      grid: 1,
      fields: [
        // Saldo dari periode sebelumnya
        {
          key: 'saldoFromPeriodId',
          label: 'Saldo dari Periode Sebelumnya',
          type: 'text',
          formatter: (_, data) => {
            if (!data.saldoFromPeriodId) return '—';
            return `Periode #${data.saldoFromPeriodId}`;
          },
          condition: (data) => data.mode === 'saldoAwal' && !!data.saldoFromPeriodId,
        },
        // Saldo awal manual
        fieldPresets.currency('saldoAwalManual', 'Saldo Awal Manual').condition((data) =>
          !!data.saldoAwalManual
        ),
      ],
    },
    {
      title: 'Lampiran',
      grid: 1,
      fields: [
        fieldPresets.url('attachmentUrl', 'URL Lampiran').condition((data) => !!data.attachmentUrl),
      ],
    },
  ],
});
