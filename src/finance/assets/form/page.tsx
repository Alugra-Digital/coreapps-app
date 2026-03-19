import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAssetById,
  useCreateAsset,
  useUpdateAsset,
  useAssetTypes,
  useNextAssetCode
} from '@/hooks/useAssets';
import * as assetsApi from '@/api/assets';
import {
  assetFormSchema,
  type AssetFormValues,
  ASSET_CATEGORIES,
  DEPRECIATION_METHODS,
  ASSET_CATEGORY_LABELS,
  DEPRECIATION_METHOD_LABELS,
} from '../schema';

export default function AssetFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const { data: asset } = useAssetById(id ? Number(id) : undefined);
  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema) as import('react-hook-form').Resolver<AssetFormValues>,
    defaultValues: {
      assetCode: '',
      assetTypeCode: '',
      name: '',
      specification: '',
      description: '',
      category: 'ELECTRONICS',
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchaseAmount: 0,
      salvageValue: 0,
      usefulLifeMonths: null,
      location: '',
      department: '',
      vendor: '',
      attachmentUrl: '',
      depreciationMethod: 'SLM',
      coaAssetAccount: '',
      coaDepreciationExpenseAccount: '',
      coaAccumulatedDepreciationAccount: '',
      status: 'ACTIVE',
    },
  });

  const { data: assetTypes } = useAssetTypes();
  const assetTypeCode = form.watch('assetTypeCode');
  const purchaseDate = form.watch('purchaseDate');
  const purchaseAmount = form.watch('purchaseAmount');
  const usefulLifeMonths = form.watch('usefulLifeMonths');
  const salvageValue = form.watch('salvageValue');

  const purchaseMonth = purchaseDate ? new Date(purchaseDate).getMonth() + 1 : 0;
  const purchaseYear = purchaseDate ? new Date(purchaseDate).getFullYear() : 0;

  const { data: nextCodeData } = useNextAssetCode(assetTypeCode ?? '', purchaseMonth, purchaseYear);

  useEffect(() => {
    if (!isEdit && nextCodeData?.code) {
      form.setValue('assetCode', nextCodeData.code);
    }
  }, [nextCodeData, isEdit, form]);

  const handleAssetTypeChange = (val: string) => {
    form.setValue('assetTypeCode', val);
    const typeInfo = assetTypes?.find((t) => t.code === val);
    if (typeInfo) {
      form.setValue('usefulLifeMonths', typeInfo.usefulLifeMonths);
      form.setValue('depreciationMethod', typeInfo.depreciationMethod);
    }
  };

  const monthlyDepreciation =
    purchaseAmount && usefulLifeMonths
      ? (purchaseAmount - (salvageValue || 0)) / usefulLifeMonths
      : 0;

  useEffect(() => {
    if (isEdit && asset) {
      form.reset({
        assetCode: asset.assetCode ?? '',
        assetTypeCode: asset.assetTypeCode ?? '',
        name: asset.name,
        specification: asset.specification ?? '',
        description: asset.description ?? '',
        category: asset.category,
        purchaseDate: asset.purchaseDate?.slice(0, 10) ?? '',
        purchaseAmount: Number(asset.purchaseAmount),
        salvageValue: Number(asset.salvageValue ?? 0),
        usefulLifeMonths: asset.usefulLifeMonths ?? null,
        location: asset.location ?? '',
        department: asset.department ?? '',
        vendor: asset.vendor ?? '',
        attachmentUrl: asset.attachmentUrl ?? '',
        depreciationMethod: asset.depreciationMethod,
        coaAssetAccount: asset.coaAssetAccount ?? '',
        coaDepreciationExpenseAccount: asset.coaDepreciationExpenseAccount ?? '',
        coaAccumulatedDepreciationAccount: asset.coaAccumulatedDepreciationAccount ?? '',
        status: asset.status,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, isEdit]);

  const onSubmit = async (values: AssetFormValues) => {
    try {
      if (!isEdit && values.assetCode) {
        // Check uniqueness
        const { exists } = await assetsApi.checkAssetCode(values.assetCode);
        if (exists) {
          form.setError('assetCode', { type: 'manual', message: 'Kode aset sudah ada, silakan gunakan yang lain.' });
          return;
        }
      }

      const payload = {
        ...values,
        assetCode: values.assetCode ?? undefined,
        specification: values.specification ?? undefined,
        description: values.description ?? undefined,
        usefulLifeMonths: values.usefulLifeMonths ?? undefined,
        location: values.location ?? undefined,
        department: values.department ?? undefined,
        vendor: values.vendor ?? undefined,
        attachmentUrl: values.attachmentUrl ?? undefined,
        coaAssetAccount: values.coaAssetAccount ?? undefined,
        coaDepreciationExpenseAccount: values.coaDepreciationExpenseAccount ?? undefined,
        coaAccumulatedDepreciationAccount: values.coaAccumulatedDepreciationAccount ?? undefined,
      };
      if (isEdit) {
        await updateMutation.mutateAsync({ id: Number(id), input: payload });
        toast.success('Aset berhasil diperbarui');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Aset berhasil ditambahkan');
      }
      navigate('/finance/assets');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Terjadi kesalahan');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6B6B75] hover:text-[#F5A623] hover:bg-[#1E1E22] rounded-xl"
            onClick={() => navigate('/finance/assets')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              {isEdit ? 'Edit Aset' : 'Tambah Aset Baru'}
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              {isEdit ? `Kode: ${asset?.assetCode ?? '—'}` : 'Isi detail aset di bawah ini'}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic info */}
            <Card className="bg-[#111113] border-[#1E1E22]">
              <CardHeader>
                <CardTitle className="text-base text-[#F0F0F0]">Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="assetTypeCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Jenis Aset</FormLabel>
                    <Select value={field.value} onValueChange={handleAssetTypeChange}>
                      <FormControl>
                        <SelectTrigger className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
                          <SelectValue placeholder="Pilih Jenis Aset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111113] border-[#1E1E22]">
                        {assetTypes?.map((t) => (
                          <SelectItem key={t.code} value={t.code} className="text-[#F0F0F0] focus:bg-[#1E1E22]">
                            {t.name} ({t.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="assetCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Kode Aset (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Auto-generated jika kosong"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Nama Aset</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama aset"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Kategori</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111113] border-[#1E1E22]">
                        {ASSET_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c} className="text-[#F0F0F0] focus:bg-[#1E1E22]">
                            {ASSET_CATEGORY_LABELS[c]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="specification" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Spesifikasi (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Spesifikasi aset"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Keterangan (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Keterangan tambahan"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111113] border-[#1E1E22]">
                        <SelectItem value="ACTIVE" className="text-[#F0F0F0] focus:bg-[#1E1E22]">Aktif</SelectItem>
                        <SelectItem value="SOLD" className="text-[#F0F0F0] focus:bg-[#1E1E22]">Dijual</SelectItem>
                        <SelectItem value="SCRAPPED" className="text-[#F0F0F0] focus:bg-[#1E1E22]">Diafkir</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Tanggal Perolehan</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="purchaseAmount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Harga Perolehan (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="vendor" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Vendor (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama vendor"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Lokasi (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lokasi aset"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Departemen (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Departemen pemilik"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="attachmentUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">URL Lampiran (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Depreciation settings */}
            <Card className="bg-[#111113] border-[#1E1E22]">
              <CardHeader>
                <CardTitle className="text-base text-[#F0F0F0]">Penyusutan</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="depreciationMethod" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Metode Penyusutan</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111113] border-[#1E1E22]">
                        {DEPRECIATION_METHODS.map((m) => (
                          <SelectItem key={m} value={m} className="text-[#F0F0F0] focus:bg-[#1E1E22]">
                            {DEPRECIATION_METHOD_LABELS[m]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="usefulLifeMonths" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Masa Manfaat (Bulan)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Mis: 60 = 5 tahun"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="salvageValue" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Nilai Residu (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* COA settings */}
            <Card className="bg-[#111113] border-[#1E1E22]">
              <CardHeader>
                <CardTitle className="text-base text-[#F0F0F0]">Akun COA</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="coaAssetAccount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Akun Aset Tetap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mis: 1-2100"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="coaDepreciationExpenseAccount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Akun Beban Penyusutan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mis: 5-1100"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="coaAccumulatedDepreciationAccount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#F0F0F0]">Akun Akumulasi Penyusutan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mis: 1-2200"
                        className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] placeholder:text-[#6B6B75] focus:ring-1 focus:ring-[#F5A623]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {purchaseAmount > 0 && usefulLifeMonths && usefulLifeMonths > 0 ? (
              <div className="p-4 bg-[#1E1E22] rounded-xl border border-[#F5A623]/20 mb-6">
                <p className="text-[#F0F0F0] text-sm">
                  Penyusutan per bulan: <strong className="text-[#F5A623]">Rp {Math.round(monthlyDepreciation).toLocaleString('id-ID')}</strong> (Rp {(purchaseAmount - (salvageValue || 0)).toLocaleString('id-ID')} / {usefulLifeMonths} bulan)
                </p>
              </div>
            ) : null}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
                onClick={() => navigate('/finance/assets')}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
              >
                {isEdit ? 'Simpan Perubahan' : 'Tambah Aset'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
