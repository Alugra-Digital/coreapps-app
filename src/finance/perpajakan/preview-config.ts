/**
 * Perpajakan Preview Configuration
 * Configuration for previewing Tax Types (Jenis Pajak)
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { TaxTypeFormValues } from './schema';

export const perpajakanPreviewConfig: PreviewConfig<TaxTypeFormValues> = createConfig({
  sections: [
    {
      title: 'Identitas Pajak',
      grid: 2,
      fields: [
        fieldPresets.text('code', 'Kode Pajak'),
        fieldPresets.text('name', 'Nama Pajak'),
      ],
    },
    {
      title: 'Kategori Pajak',
      grid: 2,
      fields: [
        fieldPresets.enum('category', 'Kategori', {
          output_tax: 'Pajak Keluaran',
          withholding_tax: 'Pajak Potong',
        }),
        fieldPresets.number('rate', 'Tarif (%)'),
      ],
    },
    {
      title: 'Deskripsi',
      grid: 1,
      fields: [
        fieldPresets.text('description', 'Deskripsi Pajak'),
      ],
    },
    {
      title: 'Regulasi',
      grid: 1,
      fields: [
        fieldPresets.text('regulation', 'Regulasi').condition((data) => !!data.regulation),
      ],
    },
    {
      title: 'Dokumen yang Berlaku',
      grid: 1,
      fields: [
        {
          key: 'applicableDocuments',
          label: 'Dokumen',
          type: 'text',
          formatter: (value) => {
            if (!value || value.length === 0) return '—';
            return value.map(doc => {
              const labels = {
                invoice: 'Invoice',
                po: 'Purchase Order (PO)',
                bast: 'BAST',
              };
              return labels[doc as keyof typeof labels] || doc;
            }).join(', ');
          },
        },
      ],
    },
    {
      title: 'Lampiran',
      grid: 1,
      fields: [
        fieldPresets.url('documentUrl', 'URL Dokumen').condition((data) => !!data.documentUrl && data.documentUrl !== ''),
      ],
    },
    {
      title: 'Status',
      grid: 1,
      fields: [
        fieldPresets.boolean('isActive', 'Aktif'),
      ],
    },
  ],
});
