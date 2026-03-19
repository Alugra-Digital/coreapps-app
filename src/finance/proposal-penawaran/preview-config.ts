/**
 * Proposal Penawaran Preview Configuration
 * Configuration for previewing Proposal Penawaran documents
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { ProposalPenawaranFormValues } from './schema';

export const proposalPenawaranPreviewConfig: PreviewConfig<ProposalPenawaranFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Cover',
      grid: 2,
      fields: [
        fieldPresets.text('coverInfo.companyName', 'Nama Perusahaan'),
        fieldPresets.text('coverInfo.jobOffer', 'Penawaran Pekerjaan'),
      ],
    },
    {
      title: 'Detail Cover',
      grid: 2,
      fields: [
        fieldPresets.text('coverInfo.proposalMonth', 'Bulan Proposal'),
        fieldPresets.text('coverInfo.address', 'Alamat'),
      ],
    },
    {
      title: 'Kontak Perusahaan',
      grid: 2,
      fields: [
        fieldPresets.text('coverInfo.phone', 'Telepon'),
        fieldPresets.text('coverInfo.email', 'Email').condition((data) => !!data.coverInfo.email && data.coverInfo.email !== ''),
      ],
    },
    {
      title: 'Nomor Dokumen',
      grid: 1,
      fields: [
        fieldPresets.text('proposalNumber', 'Nomor Proposal'),
      ],
    },
    {
      title: 'Informasi Klien',
      grid: 2,
      fields: [
        fieldPresets.text('clientInfo.clientName', 'Nama Klien'),
        fieldPresets.text('clientInfo.contactPerson', 'Kontak Person').condition((data) => !!data.clientInfo.contactPerson),
      ],
    },
    {
      title: 'Detail Klien',
      grid: 2,
      fields: [
        fieldPresets.text('clientInfo.phone', 'Telepon').condition((data) => !!data.clientInfo.phone),
        fieldPresets.text('clientInfo.email', 'Email').condition((data) => !!data.clientInfo.email && data.clientInfo.email !== ''),
      ],
    },
    {
      title: 'Alamat Klien',
      grid: 1,
      fields: [
        fieldPresets.text('clientInfo.address', 'Alamat').condition((data) => !!data.clientInfo.address),
      ],
    },
    {
      title: 'Solusi & Metode Kerja',
      grid: 1,
      fields: [
        fieldPresets.text('clientBackground', 'Latar Belakang Klien').condition((data) => !!data.clientBackground),
        fieldPresets.text('offeredSolution', 'Solusi yang Ditawarkan').condition((data) => !!data.offeredSolution),
        fieldPresets.text('workingMethod', 'Metode Kerja').condition((data) => !!data.workingMethod),
      ],
    },
    {
      title: 'Timeline & Portfolio',
      grid: 1,
      fields: [
        fieldPresets.text('timeline', 'Timeline').condition((data) => !!data.timeline),
        fieldPresets.text('portfolio', 'Portfolio').condition((data) => !!data.portfolio),
      ],
    },
    {
      title: 'Item Penawaran',
      grid: 1,
      fields: [
        {
          key: 'items',
          label: 'Rincian Item',
          type: 'text',
          formatter: (_, data) => {
            if (!data.items || data.items.length === 0) return '—';
            return data.items.map((item, index) => {
              const price = `Rp ${item.unitPrice.toLocaleString('id-ID')}`;
              const total = `Rp ${item.totalPrice.toLocaleString('id-ID')}`;
              return `${index + 1}. ${item.description} | Qty: ${item.quantity} | ${item.volume} | Harga: ${price} | Total: ${total}`;
            }).join('\n');
          },
        },
      ],
    },
    {
      title: 'Total Biaya',
      grid: 2,
      fields: [
        fieldPresets.currency('totalEstimatedCost', 'Total Biaya Estimasi'),
        fieldPresets.text('currency', 'Mata Uang'),
      ],
    },
    {
      title: 'Terbilang',
      grid: 1,
      fields: [
        fieldPresets.text('totalEstimatedCostInWords', 'Total dalam Kata-kata'),
      ],
    },
    {
      title: 'Persetujuan Dokumen',
      grid: 1,
      fields: [
        fieldPresets.text('documentApproval.signerName', 'Nama Penandatangan'),
        fieldPresets.text('documentApproval.signerPosition', 'Jabatan Penandatangan'),
        fieldPresets.date('documentApproval.date', 'Tanggal Penandatangan'),
      ],
    },
  ],
});
