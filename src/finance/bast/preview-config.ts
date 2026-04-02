/**
 * BAST Preview Configuration
 * Configuration for previewing Berita Acara Serah Terima (BAST) documents
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { BASTFormValues } from './schema';

export const bastPreviewConfig: PreviewConfig<BASTFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Cover',
      grid: 2,
      fields: [
        fieldPresets.text('coverInfo.jobOffer', 'Penawaran Pekerjaan'),
        fieldPresets.text('coverInfo.companyName', 'Nama Perusahaan'),
      ],
    },
    {
      title: 'Detail Cover',
      grid: 2,
      fields: [
        fieldPresets.text('coverInfo.bastMonth', 'Bulan BAST'),
        fieldPresets.text('coverInfo.address', 'Alamat'),
      ],
    },
    {
      title: 'Informasi Dokumen',
      grid: 2,
      fields: [
        fieldPresets.text('documentInfo.bastNumber', 'Nomor BAST'),
        fieldPresets.date('documentInfo.bastDate', 'Tanggal BAST'),
      ],
    },
    {
      title: 'Referensi',
      grid: 1,
      fields: [
        { ...fieldPresets.text('documentInfo.relatedPoOrInvoice', 'PO/Invoice Terkait'), condition: (data) => !!data.documentInfo.relatedPoOrInvoice },
      ],
    },
    {
      title: 'Pihak Penyerah',
      grid: 1,
      fields: [
        fieldPresets.text('deliveringParty.name', 'Nama'),
        fieldPresets.text('deliveringParty.position', 'Jabatan'),
        fieldPresets.text('deliveringParty.company', 'Perusahaan'),
        { ...fieldPresets.url('deliveringParty.signatureUrl', 'URL Tanda Tangan'), condition: (data) => !!data.deliveringParty.signatureUrl && data.deliveringParty.signatureUrl !== '' },
      ],
    },
    {
      title: 'Pihak Penerima',
      grid: 1,
      fields: [
        fieldPresets.text('receivingParty.name', 'Nama'),
        fieldPresets.text('receivingParty.position', 'Jabatan'),
        fieldPresets.text('receivingParty.company', 'Perusahaan'),
        { ...fieldPresets.url('receivingParty.signatureUrl', 'URL Tanda Tangan'), condition: (data) => !!data.receivingParty.signatureUrl && data.receivingParty.signatureUrl !== '' },
      ],
    },
  ],
});
