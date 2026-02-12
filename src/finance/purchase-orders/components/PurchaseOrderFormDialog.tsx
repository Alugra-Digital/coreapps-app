import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
import {
  purchaseOrderFormSchema,
  type PurchaseOrderFormValues,
} from "../schema";
import { createPurchaseOrder, updatePurchaseOrder } from "@/api/purchase-orders";
import type { PurchaseOrder } from "../types";

interface PurchaseOrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder?: PurchaseOrder;
  onSuccess: () => void;
}

const defaultCompanyInfo = {
  letterhead: "",
  companyName: "",
  logoUrl: "",
  address: "",
  phone: "",
};

const defaultOrderInfo = {
  poDate: new Date().toISOString().slice(0, 10),
  poNumber: "",
  docReference: "",
};

const defaultVendorInfo = {
  vendorName: "",
  phone: "",
  pic: { name: "", position: "", contact: "" },
};

const defaultLineItem = {
  number: 1,
  itemDescription: "",
  quantity: 1,
  unit: "Unit",
  price: 0,
  subtotal: 0,
  taxRate: 11,
  taxAmount: 0,
  priceAfterTax: 0,
};

const defaultApproval = {
  position: "",
  name: "",
  signatureUrl: "",
};

function computeLineItem(
  qty: number,
  price: number,
  taxRate: number = 11
): { subtotal: number; taxAmount: number; priceAfterTax: number } {
  const subtotal = qty * price;
  const taxAmount = (subtotal * taxRate) / 100;
  const priceAfterTax = subtotal + taxAmount;
  return { subtotal, taxAmount, priceAfterTax };
}

export function PurchaseOrderFormDialog({
  open,
  onOpenChange,
  purchaseOrder,
  onSuccess,
}: PurchaseOrderFormDialogProps) {
  const isEdit = !!purchaseOrder;

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      companyInfo: defaultCompanyInfo,
      orderInfo: defaultOrderInfo,
      vendorInfo: defaultVendorInfo,
      lineItems: [{ ...defaultLineItem }],
      paymentProcedure: "",
      otherTerms: "",
      approval: defaultApproval,
    },
  });

  const lineItems = form.watch("lineItems");

  const updateLineItemCalc = useCallback(
    (index: number) => {
      const item = lineItems[index];
      if (!item || item.quantity <= 0 || item.price < 0) return;
      const { subtotal, taxAmount, priceAfterTax } = computeLineItem(
        item.quantity,
        item.price,
        item.taxRate ?? 11
      );
      const newItems = [...lineItems];
      newItems[index] = {
        ...item,
        number: index + 1,
        subtotal,
        taxAmount,
        priceAfterTax,
      };
      form.setValue("lineItems", newItems);
    },
    [lineItems, form]
  );

  const addLineItem = () => {
    const num = lineItems.length + 1;
    const newItem = {
      ...defaultLineItem,
      number: num,
      quantity: 0,
      price: 0,
      subtotal: 0,
      taxAmount: 0,
      priceAfterTax: 0,
    };
    form.setValue("lineItems", [...lineItems, newItem]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    const newItems = lineItems.filter((_, i) => i !== index);
    newItems.forEach((item, i) => {
      item.number = i + 1;
    });
    form.setValue("lineItems", newItems);
  };

  useEffect(() => {
    if (purchaseOrder) {
      form.reset({
        companyInfo: {
          ...defaultCompanyInfo,
          ...purchaseOrder.companyInfo,
          logoUrl: purchaseOrder.companyInfo.logoUrl ?? "",
        },
        orderInfo: purchaseOrder.orderInfo,
        vendorInfo: purchaseOrder.vendorInfo,
        lineItems: purchaseOrder.lineItems.map((li) => ({
          ...li,
          taxRate: li.taxRate ?? 11,
        })),
        paymentProcedure: purchaseOrder.paymentProcedure ?? "",
        otherTerms: purchaseOrder.otherTerms ?? "",
        approval: {
          ...purchaseOrder.approval,
          signatureUrl: purchaseOrder.approval.signatureUrl ?? "",
        },
      });
    } else if (open) {
      form.reset({
        companyInfo: defaultCompanyInfo,
        orderInfo: { ...defaultOrderInfo, poDate: new Date().toISOString().slice(0, 10) },
        vendorInfo: defaultVendorInfo,
        lineItems: [{ ...defaultLineItem }],
        paymentProcedure: "",
        otherTerms: "",
        approval: defaultApproval,
      });
    }
  }, [purchaseOrder, open, form]);

  const onSubmit = async (values: PurchaseOrderFormValues) => {
    const payload = {
      companyInfo: values.companyInfo,
      orderInfo: values.orderInfo,
      vendorInfo: values.vendorInfo,
      lineItems: values.lineItems.map((li, i) => ({
        ...li,
        number: i + 1,
        taxRate: li.taxRate ?? 11,
        taxAmount: li.taxAmount ?? 0,
        priceAfterTax: li.priceAfterTax ?? li.subtotal,
      })),
      paymentProcedure: values.paymentProcedure || undefined,
      otherTerms: values.otherTerms || undefined,
      approval: values.approval,
    };

    if (isEdit && purchaseOrder) {
      await updatePurchaseOrder(purchaseOrder.id, payload);
    } else {
      await createPurchaseOrder(payload);
    }
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>
            {isEdit ? "Edit Purchase Order" : "Add Purchase Order"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <Tabs defaultValue="company" className="flex-1 flex flex-col gap-4 overflow-hidden">
              <TabsList className="mx-6 px-2 flex gap-1 shrink-0 flex-wrap">
                <TabsTrigger value="company" className="text-xs px-2 py-1.5">
                  Company
                </TabsTrigger>
                <TabsTrigger value="order" className="text-xs px-2 py-1.5">
                  Order
                </TabsTrigger>
                <TabsTrigger value="vendor" className="text-xs px-2 py-1.5">
                  Vendor
                </TabsTrigger>
                <TabsTrigger value="items" className="text-xs px-2 py-1.5">
                  Line Items
                </TabsTrigger>
                <TabsTrigger value="terms" className="text-xs px-2 py-1.5">
                  Terms
                </TabsTrigger>
                <TabsTrigger value="approval" className="text-xs px-2 py-1.5">
                  Approval
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-6 pb-4">
                <TabsContent value="company" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="companyInfo.letterhead"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Kop Surat</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyInfo.companyName"
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
                    name="companyInfo.logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Logo URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyInfo.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Alamat Lengkap</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={2} className="text-sm resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyInfo.phone"
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

                <TabsContent value="order" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="orderInfo.poDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tanggal PO</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="orderInfo.poNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No. PO</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="orderInfo.docReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Doc. Reference</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="vendor" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="vendorInfo.vendorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Vendor</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vendorInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No. Telepon Vendor</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vendorInfo.pic.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">PIC - Nama</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vendorInfo.pic.position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">PIC - Jabatan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vendorInfo.pic.contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">PIC - Kontak</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="items" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs">Detail Pesanan</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={addLineItem}>
                      <Plus className="h-3 w-3" /> Add Row
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {lineItems.map((_, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 p-2 rounded border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5"
                      >
                        <div className="col-span-12 font-medium text-xs text-slate-600 dark:text-slate-400">
                          Item #{index + 1}
                        </div>
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.itemDescription`}
                          render={({ field }) => (
                            <FormItem className="col-span-12">
                              <FormControl>
                                <Input {...field} placeholder="Item description" className="h-8 text-sm" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  {...field}
                                  onChange={(e) => {
                                    const v = parseFloat(e.target.value) || 0;
                                    field.onChange(v);
                                    setTimeout(() => updateLineItemCalc(index), 0);
                                  }}
                                  className="h-8 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.unit`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input {...field} placeholder="Unit" className="h-8 text-sm" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.price`}
                          render={({ field }) => (
                            <FormItem className="col-span-3">
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={1}
                                  {...field}
                                  onChange={(e) => {
                                    const v = parseFloat(e.target.value) || 0;
                                    field.onChange(v);
                                    setTimeout(() => updateLineItemCalc(index), 0);
                                  }}
                                  className="h-8 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.taxRate`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  {...field}
                                  value={field.value ?? 11}
                                  onChange={(e) => {
                                    const v = parseFloat(e.target.value) || 0;
                                    field.onChange(v);
                                    setTimeout(() => updateLineItemCalc(index), 0);
                                  }}
                                  className="h-8 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="col-span-2 flex items-center gap-1">
                          <span className="text-xs text-slate-500">
                            {new Intl.NumberFormat("id-ID").format(
                              lineItems[index]?.priceAfterTax ?? 0
                            )}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600"
                            onClick={() => removeLineItem(index)}
                            disabled={lineItems.length <= 1}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="terms" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentProcedure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Prosedur Pembayaran (Termin, DP, Pelunasan)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} className="text-sm resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otherTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Ketentuan Lain</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} className="text-sm resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="approval" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="approval.position"
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
                    name="approval.name"
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
                    name="approval.signatureUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">TTD (Signature URL)</FormLabel>
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
