/**
 * Clients Preview Configuration
 * Configuration for previewing Client (Klien) records
 */

import { createConfig, fieldPresets } from '@/finance/components/preview/config-builder';
import type { PreviewConfig } from '@/finance/components/preview';
import type { ClientFormValues } from './schema';

export const clientsPreviewConfig: PreviewConfig<ClientFormValues> = createConfig({
  sections: [
    {
      title: 'Informasi Klien',
      grid: 2,
      fields: [
        fieldPresets.text('name', 'Nama Klien'),
        fieldPresets.text('companyName', 'Nama Perusahaan'),
      ],
    },
    {
      title: 'Alamat & Kontak',
      grid: 2,
      fields: [
        fieldPresets.text('address', 'Alamat').condition((data) => !!data.address),
        fieldPresets.text('phone', 'Telepon').condition((data) => !!data.phone),
      ],
    },
    {
      title: 'Email',
      grid: 1,
      fields: [
        fieldPresets.text('email', 'Email').condition((data) => !!data.email && data.email !== ''),
      ],
    },
    {
      title: 'NPWP',
      grid: 1,
      fields: [
        fieldPresets.text('npwp', 'NPWP').condition((data) => !!data.npwp),
      ],
    },
    {
      title: 'PIC (Person in Charge)',
      grid: 2,
      fields: [
        fieldPresets.text('picName', 'Nama PIC').condition((data) => !!data.picName),
        fieldPresets.text('picPosition', 'Jabatan PIC').condition((data) => !!data.picPosition),
      ],
    },
    {
      title: 'Kontak PIC',
      grid: 1,
      fields: [
        fieldPresets.text('picContact', 'Kontak PIC').condition((data) => !!data.picContact),
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
