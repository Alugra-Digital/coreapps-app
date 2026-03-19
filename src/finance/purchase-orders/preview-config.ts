/**
 * Purchase Orders Preview Configuration
 * Configuration for previewing Purchase Order (PO) documents
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { PurchaseOrderFormValues } from './schema';

export const purchaseOrdersPreviewConfig: PreviewConfig<PurchaseOrderFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Perusahaan',
      grid: 2,
      fields: [
        fieldPresets.text('companyInfo.companyName', 'Nama Perusahaan'),
        fieldPresets.text('companyInfo.phone', 'Telepon'),
      ],
    },
    {
      title: 'Informasi Order',
      grid: 2,
      fields: [
        fieldPresets.date('orderInfo.poDate', 'Tanggal PO'),
        fieldPresets.text('orderInfo.poNumber', 'Nomor PO'),
      ],
    },
    {
      title: 'Referensi',
      grid: 1,
      fields: [
        fieldPresets.text('orderInfo.docReference', 'Referensi Dokumen').condition((data) => !!data.orderInfo.docReference),
      ],
    },
    {
      title: 'Informasi Vendor',
      grid: 2,
      fields: [
        fieldPresets.text('vendorInfo.vendorName', 'Nama Vendor'),
        fieldPresets.text('vendorInfo.phone', 'Telepon').condition((data) => !!data.vendorInfo?.phone),
      ],
    },
    {
      title: 'PIC Vendor',
      grid: 1,
      fields: [
        fieldPresets.text('vendorInfo.pic.name', 'Nama').condition((data) => !!data.vendorInfo?.pic?.name),
        fieldPresets.text('vendorInfo.pic.position', 'Jabatan').condition((data) => !!data.vendorInfo?.pic?.position),
        fieldPresets.text('vendorInfo.pic.contact', 'Kontak').condition((data) => !!data.vendorInfo?.pic?.contact),
      ],
    },
    {
      title: 'Syarat Pembayaran',
      grid: 1,
      fields: [
        fieldPresets.text('paymentProcedure', 'Prosedur Pembayaran').condition((data) => !!data.paymentProcedure),
        fieldPresets.text('otherTerms', 'Syarat Lain').condition((data) => !!data.otherTerms),
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
              const price = `Rp ${item.price.toLocaleString('id-ID')}`;
              const subtotal = `Rp ${item.subtotal.toLocaleString('id-ID')}`;
              return `${index + 1}. ${item.itemDescription} | Qty: ${item.quantity} ${item.unit} | Harga: ${price} | Subtotal: ${subtotal}`;
            }).join('\n');
          },
        },
      ],
    },
    {
      title: 'Persetujuan',
      grid: 1,
      fields: [
        fieldPresets.text('approval.name', 'Nama Penyetuju'),
        fieldPresets.text('approval.position', 'Jabatan Penyetuju'),
        fieldPresets.url('approval.signatureUrl', 'URL Tanda Tangan').condition((data) => !!data.approval.signatureUrl && data.approval.signatureUrl !== ''),
      ],
    },
  ],
});
