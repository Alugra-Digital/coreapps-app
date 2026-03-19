/**
 * Kas Bank Preview Configuration
 * Configuration for previewing Kas Bank (Bank Cash) transactions
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { KasBankFormValues } from './schema';

export const kasBankPreviewConfig: PreviewConfig<KasBankFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Transaksi',
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
      title: 'Detail Transaksi',
      grid: 2,
      fields: [
        fieldPresets.text('coaAccount', 'Akun COA'),
        fieldPresets.text('description', 'Keterangan'),
      ],
    },
    {
      title: 'Nilai Transaksi',
      grid: 2,
      fields: [
        fieldPresets.currency('inflow', 'Pemasukan').condition((data) => data.inflow > 0),
        fieldPresets.currency('outflow', 'Pengeluaran').condition((data) => data.outflow > 0),
      ],
    },
    {
      title: 'Referensi',
      grid: 1,
      fields: [
        fieldPresets.text('reference', 'Referensi').condition((data) => !!data.reference),
      ],
    },
    {
      title: 'Baris Transaksi (Multi-line)',
      grid: 1,
      fields: [
        {
          key: 'lines',
          label: 'Rincian Transaksi',
          type: 'text',
          formatter: (_, data) => {
            if (!data.lines || data.lines.length === 0) return '—';
            return data.lines.map((line, index) => {
              const debit = line.debit > 0 ? `Rp ${line.debit.toLocaleString('id-ID')}` : '—';
              const credit = line.credit > 0 ? `Rp ${line.credit.toLocaleString('id-ID')}` : '—';
              return `${index + 1}. ${line.accountNumber} - ${line.accountName || 'N/A'} | D: ${debit} | K: ${credit} ${line.description ? `| ${line.description}` : ''}`;
            }).join('\n');
          },
          condition: (data) => data.lines && data.lines.length > 0,
        },
      ],
    },
  ],
});
