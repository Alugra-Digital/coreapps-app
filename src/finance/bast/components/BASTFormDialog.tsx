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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bastFormSchema, type BASTFormValues } from "../schema";
import { createBast, updateBast } from "@/api/bast";
import type { BAST } from "../types";

interface BASTFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bast?: BAST;
  onSuccess: () => void;
}

const defaultCoverInfo = {
  jobOffer: "",
  companyName: "",
  bastMonth: new Date().toISOString().slice(0, 7),
  address: "",
  phone: "",
};

const defaultDocumentInfo = {
  bastNumber: "",
  bastDate: new Date().toISOString().slice(0, 10),
  relatedPoOrInvoice: "",
};

const defaultPartySignature = {
  name: "",
  position: "",
  company: "",
  signatureUrl: "",
};

export function BASTFormDialog({
  open,
  onOpenChange,
  bast,
  onSuccess,
}: BASTFormDialogProps) {
  const isEdit = !!bast;

  const form = useForm<BASTFormValues>({
    resolver: zodResolver(bastFormSchema),
    defaultValues: {
      coverInfo: defaultCoverInfo,
      documentInfo: defaultDocumentInfo,
      deliveringParty: defaultPartySignature,
      receivingParty: defaultPartySignature,
    },
  });

  useEffect(() => {
    if (bast) {
      form.reset({
        coverInfo: {
          ...defaultCoverInfo,
          ...bast.coverInfo,
        },
        documentInfo: bast.documentInfo,
        deliveringParty: {
          ...bast.deliveringParty,
          signatureUrl: bast.deliveringParty.signatureUrl ?? "",
        },
        receivingParty: {
          ...bast.receivingParty,
          signatureUrl: bast.receivingParty.signatureUrl ?? "",
        },
      });
    } else if (open) {
      form.reset({
        coverInfo: {
          ...defaultCoverInfo,
          bastMonth: new Date().toISOString().slice(0, 7),
        },
        documentInfo: {
          ...defaultDocumentInfo,
          bastDate: new Date().toISOString().slice(0, 10),
        },
        deliveringParty: defaultPartySignature,
        receivingParty: defaultPartySignature,
      });
    }
  }, [bast, open, form]);

  const onSubmit = async (values: BASTFormValues) => {
    const payload = {
      coverInfo: values.coverInfo,
      documentInfo: values.documentInfo,
      deliveringParty: {
        ...values.deliveringParty,
        signatureUrl: values.deliveringParty.signatureUrl || undefined,
      },
      receivingParty: {
        ...values.receivingParty,
        signatureUrl: values.receivingParty.signatureUrl || undefined,
      },
    };

    if (isEdit && bast) {
      await updateBast(bast.id, payload);
    } else {
      await createBast(payload);
    }
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit BAST" : "Add BAST"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <Tabs
              defaultValue="cover"
              className="flex-1 flex flex-col gap-4 overflow-hidden"
            >
              <TabsList className="mx-6 px-2 flex gap-1 shrink-0 flex-wrap">
                <TabsTrigger value="cover" className="text-xs px-2 py-1.5">
                  Cover
                </TabsTrigger>
                <TabsTrigger value="document" className="text-xs px-2 py-1.5">
                  Document Info
                </TabsTrigger>
                <TabsTrigger value="delivering" className="text-xs px-2 py-1.5">
                  Pihak Penyerah
                </TabsTrigger>
                <TabsTrigger value="receiving" className="text-xs px-2 py-1.5">
                  Pihak Penerima
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-6 pb-4">
                <TabsContent value="cover" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="coverInfo.jobOffer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Penawaran pekerjaan/jasa</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverInfo.companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Perusahaan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverInfo.bastMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Bulan BAST</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="month"
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverInfo.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Alamat (Informasi Perusahaan)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={2} className="text-sm resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No. Telepon</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="document" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="documentInfo.bastNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nomor BAST</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentInfo.bastDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tanggal BAST</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentInfo.relatedPoOrInvoice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nomor PO/Invoice Terkait</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="delivering" className="mt-0 space-y-4">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Pihak Penyerah
                  </h4>
                  <FormField
                    control={form.control}
                    name="deliveringParty.name"
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
                    name="deliveringParty.position"
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
                    name="deliveringParty.company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Perusahaan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveringParty.signatureUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tanda Tangan (URL)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="receiving" className="mt-0 space-y-4">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Pihak Penerima
                  </h4>
                  <FormField
                    control={form.control}
                    name="receivingParty.name"
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
                    name="receivingParty.position"
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
                    name="receivingParty.company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Perusahaan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receivingParty.signatureUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tanda Tangan (URL)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>

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
