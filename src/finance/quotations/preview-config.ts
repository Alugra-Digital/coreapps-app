/**
 * Quotations Preview Configuration
 * Configuration for previewing Quotation documents
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { QuotationFormValues } from './schema';

export const quotationsPreviewConfig: PreviewConfig<QuotationFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Quotation',
      grid: 2,
      fields: [
        fieldPresets.text('quotationNumber', 'Nomor Quotation'),
        fieldPresets.date('quotationDate', 'Tanggal Quotation'),
      ],
    },
    {
      title: 'Klien & Proyek',
      grid: 2,
      fields: [
        fieldPresets.text('clientName', 'Nama Klien'),
        fieldPresets.text('projectName', 'Nama Proyek').condition((data) => !!data.projectName),
      ],
    },
    {
      title: 'Layanan & Periode',
      grid: 2,
      fields: [
        fieldPresets.text('serviceOffered', 'Layanan yang Ditawarkan'),
        fieldPresets.text('quotationMonth', 'Bulan Quotation'),
      ],
    },
    {
      title: 'Masa Berlaku',
      grid: 1,
      fields: [
        fieldPresets.text('validUntil', 'Berlaku Sampai').condition((data) => !!data.validUntil),
      ],
    },
    {
      title: 'Item Line',
      grid: 1,
      fields: [
        {
          key: 'lineItems',
          label: 'Rincian Item',
          type: 'text',
          formatter: (_, data) => {
            if (!data.lineItems || data.lineItems.length === 0) return '—';
            return data.lineItems.map((item, index) => {
              const price = `Rp ${item.unitPrice.toLocaleString('id-ID')}`;
              const subtotal = `Rp ${item.subtotal.toLocaleString('id-ID')}`;
              return `${index + 1}. ${item.description} | Qty: ${item.quantity} ${item.unit} | Harga: ${price} | Subtotal: ${subtotal}`;
            }).join('\n');
          },
        },
      ],
    },
    {
      title: 'Ringkasan Nilai',
      grid: 2,
      fields: [
        fieldPresets.currency('subtotal', 'Subtotal'),
        fieldPresets.currency('taxAmount', 'Pajak').condition((data) => data.taxAmount > 0),
      ],
    },
    {
      title: 'Total',
      grid: 2,
      fields: [
        fieldPresets.currency('grandTotal', 'Grand Total'),
        {
          key: 'taxTypeId',
          label: 'Jenis Pajak',
          type: 'text',
          formatter: (value) => value ? `Tax Type #${value}` : '—',
          condition: (data) => !!data.taxTypeId,
        },
      ],
    },
    {
      title: 'Syarat & Ketentuan',
      grid: 1,
      fields: [
        fieldPresets.text('paymentTerms', 'Syarat Pembayaran').condition((data) => !!data.paymentTerms),
        fieldPresets.text('validityPeriod', 'Masa Berlaku').condition((data) => !!data.validityPeriod),
        fieldPresets.text('termsConditions', 'Syarat & Ketentuan').condition((data) => !!data.termsConditions),
      ],
    },
    {
      title: 'Status',
      grid: 1,
      fields: [
        fieldPresets.enum('status', 'Status', {
          draft: 'Draft',
          sent: 'Terkirim',
          accepted: 'Diterima',
          rejected: 'Ditolak',
          expired: 'Kedaluwarsa',
          negotation: 'Negosiasi',
        }),
      ],
    },
  ],
});
