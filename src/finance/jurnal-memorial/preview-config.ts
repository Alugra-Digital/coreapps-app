/**
 * Jurnal Memorial Preview Configuration
 * Configuration for previewing Jurnal Memorial entries
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { JurnalMemorialFormValues } from './schema';

export const jurnalMemorialPreviewConfig: PreviewConfig<JurnalMemorialFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Jurnal',
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
      title: 'Keterangan',
      grid: 1,
      fields: [
        fieldPresets.text('description', 'Keterangan Jurnal'),
      ],
    },
    {
      title: 'Rincian Baris Jurnal',
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
              return `${index + 1}. ${line.accountNumber} - ${line.accountName} | D: ${debit} | K: ${credit} ${line.lineDescription ? `| ${line.lineDescription}` : ''}`;
            }).join('\n');

            return `${linesText}\n\nTotal Debit: Rp ${totalDebit.toLocaleString('id-ID')}\nTotal Kredit: Rp ${totalCredit.toLocaleString('id-ID')}`;
          },
        },
      ],
    },
  ],
});
