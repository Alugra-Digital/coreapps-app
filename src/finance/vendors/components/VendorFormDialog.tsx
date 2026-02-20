import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vendorFormSchema, type VendorFormValues } from "../schema";
import { createVendor, updateVendor } from "@/api/vendors";
import type { Vendor } from "../types";

interface VendorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor;
  onSuccess: () => void;
}

export function VendorFormDialog({
  open,
  onOpenChange,
  vendor,
  onSuccess,
}: VendorFormDialogProps) {
  const isEdit = !!vendor;

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      companyName: "",
      address: "",
      phone: "",
      email: "",
      npwp: "",
      picName: "",
      picPosition: "",
      picContact: "",
      bankName: "",
      bankAccount: "",
      bankBranch: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor.name,
        companyName: vendor.companyName,
        address: vendor.address ?? "",
        phone: vendor.phone ?? "",
        email: vendor.email ?? "",
        npwp: vendor.npwp ?? "",
        picName: vendor.pic?.name ?? "",
        picPosition: vendor.pic?.position ?? "",
        picContact: vendor.pic?.contact ?? "",
        bankName: vendor.bankName ?? "",
        bankAccount: vendor.bankAccount ?? "",
        bankBranch: vendor.bankBranch ?? "",
        isActive: vendor.isActive,
      });
    } else if (open) {
      form.reset({
        name: "",
        companyName: "",
        address: "",
        phone: "",
        email: "",
        npwp: "",
        picName: "",
        picPosition: "",
        picContact: "",
        bankName: "",
        bankAccount: "",
        bankBranch: "",
        isActive: true,
      });
    }
  }, [vendor, open, form]);

  const onSubmit = async (values: VendorFormValues) => {
    const payload = {
      name: values.name,
      companyName: values.companyName,
      address: values.address || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      npwp: values.npwp || undefined,
      pic:
        values.picName || values.picPosition || values.picContact
          ? {
              name: values.picName ?? "",
              position: values.picPosition || undefined,
              contact: values.picContact || undefined,
            }
          : undefined,
      bankName: values.bankName || undefined,
      bankAccount: values.bankAccount || undefined,
      bankBranch: values.bankBranch || undefined,
      isActive: values.isActive,
    };

    if (isEdit && vendor) {
      await updateVendor(vendor.id, payload);
    } else {
      await createVendor(payload);
    }
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="flex-1 px-6 pb-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Nama Vendor</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="PT Example" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Nama Perusahaan</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="PT Example Corp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Alamat</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} className="text-sm resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Telepon</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="npwp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">NPWP</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="border-t pt-4 space-y-2">
                  <FormLabel className="text-xs">PIC (Person in Charge)</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="picName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nama</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="picPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Jabatan</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="picContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Kontak</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <FormLabel className="text-xs">Bank Info</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nama Bank</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">No. Rekening</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankBranch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Cabang</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <FormLabel className="text-xs">Active</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="p-6 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
