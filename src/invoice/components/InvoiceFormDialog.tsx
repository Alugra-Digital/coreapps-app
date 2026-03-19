import { useEffect, useCallback, useState } from "react";
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
import { CurrencyInput } from "@/components/ui/currency-input";
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
  invoiceFormSchema,
  type InvoiceFormValues,
} from "../schema";
import { useCreateInvoice, useUpdateInvoice } from "@/hooks/useInvoices";
import type { Invoice } from "../types";
import { toast } from "sonner";

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  onSuccess: () => void;
}

const defaultCompanyInfo = {
  letterhead: "",
  companyName: "",
  logoUrl: "",
  address: "",
  phone: "",
};

const defaultInvoiceInfo = {
  invoiceName: "",
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  taxInvoice: "",
  dueDate: new Date().toISOString().slice(0, 10),
};

const defaultBillingInfo = {
  companyName: "",
  address: "",
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
  dpp: 0,
  taxRate: 11,
  taxAmount: 0,
  priceAfterTax: 0,
};

const defaultPaymentInfo = {
  bank: "",
  accountNumber: "",
  branch: "",
  accountName: "",
  npwp: "",
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
): { subtotal: number; dpp: number; taxAmount: number; priceAfterTax: number } {
  const subtotal = qty * price;
  const dpp = (11 / 12) * subtotal;
  const taxAmount = (dpp * taxRate) / 100;
  const priceAfterTax = subtotal + taxAmount;
  return { subtotal, dpp, taxAmount, priceAfterTax };
}

export function InvoiceFormDialog({
  open,
  onOpenChange,
  invoice,
  onSuccess,
}: InvoiceFormDialogProps) {
  const isEdit = !!invoice;
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const wizardSteps = [
    { value: "company", label: "Company" },
    { value: "invoice", label: "Invoice Info" },
    { value: "billing", label: "Billing" },
    { value: "items", label: "Line Items" },
    { value: "payment", label: "Payment" },
    { value: "approval", label: "Approval" },
    { value: "notes", label: "Notes" },
  ] as const;
  const [activeStep, setActiveStep] = useState<(typeof wizardSteps)[number]["value"]>(
    "company"
  );

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      companyInfo: defaultCompanyInfo,
      invoiceInfo: defaultInvoiceInfo,
      billingInfo: defaultBillingInfo,
      lineItems: [{ ...defaultLineItem }],
      paymentInfo: defaultPaymentInfo,
      approval: defaultApproval,
      notes: "",
    },
  });

  const lineItems = form.watch("lineItems");

  const updateLineItemCalc = useCallback(
    (index: number) => {
      const item = lineItems[index];
      if (!item || item.quantity <= 0 || item.price < 0) return;
      const { subtotal, dpp, taxAmount, priceAfterTax } = computeLineItem(
        item.quantity,
        item.price,
        item.taxRate ?? 11
      );
      const newItems = [...lineItems];
      newItems[index] = {
        ...item,
        number: index + 1,
        subtotal,
        dpp,
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
      dpp: 0,
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
    if (invoice) {
      form.reset({
        companyInfo: {
          ...defaultCompanyInfo,
          ...invoice.companyInfo,
          logoUrl: invoice.companyInfo.logoUrl ?? "",
        },
        invoiceInfo: invoice.invoiceInfo,
        billingInfo: invoice.billingInfo,
        lineItems: invoice.lineItems.map((li) => ({
          ...li,
          dpp: li.dpp ?? (11 / 12) * (li.subtotal ?? 0),
          taxRate: li.taxRate ?? 11,
        })),
        paymentInfo: invoice.paymentInfo,
        approval: {
          ...invoice.approval,
          signatureUrl: invoice.approval.signatureUrl ?? "",
        },
        notes: invoice.notes ?? "",
      });
    } else if (open) {
      form.reset({
        companyInfo: defaultCompanyInfo,
        invoiceInfo: {
          ...defaultInvoiceInfo,
          invoiceDate: new Date().toISOString().slice(0, 10),
          dueDate: new Date().toISOString().slice(0, 10),
        },
        billingInfo: defaultBillingInfo,
        lineItems: [{ ...defaultLineItem }],
        paymentInfo: defaultPaymentInfo,
        approval: defaultApproval,
        notes: "",
      });
    }
  }, [invoice, open, form]);

  useEffect(() => {
    if (open) {
      setActiveStep("company");
    }
  }, [open]);

  const onSubmit = (values: InvoiceFormValues) => {
    const payload = {
      companyInfo: values.companyInfo,
      invoiceInfo: values.invoiceInfo,
      billingInfo: values.billingInfo,
      lineItems: values.lineItems.map((li, i) => ({
        ...li,
        number: i + 1,
        dpp: li.dpp ?? (11 / 12) * (li.subtotal ?? 0),
        taxRate: li.taxRate ?? 11,
        taxAmount: li.taxAmount ?? 0,
        priceAfterTax: li.priceAfterTax ?? li.subtotal,
      })),
      paymentInfo: values.paymentInfo,
      approval: values.approval,
      notes: values.notes || undefined,
    };

    const handleSuccess = () => {
      onOpenChange(false);
      onSuccess();
    };

    if (isEdit && invoice) {
      updateMutation.mutate(
        { id: invoice.id, input: payload },
        {
          onSuccess: handleSuccess,
          onError: () => toast.error("Failed to update invoice"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleSuccess,
        onError: () => toast.error("Failed to create invoice"),
      });
    }
  };

  const currentStepIndex = wizardSteps.findIndex((step) => step.value === activeStep);
  const isFirstStep = currentStepIndex <= 0;
  const isLastStep = currentStepIndex >= wizardSteps.length - 1;

  const goToPreviousStep = () => {
    if (isFirstStep) return;
    setActiveStep(wizardSteps[currentStepIndex - 1].value);
  };

  const goToNextStep = () => {
    if (isLastStep) return;
    setActiveStep(wizardSteps[currentStepIndex + 1].value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 rounded-sm overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle className="text-base">
            {isEdit ? "Edit Invoice" : "Create Invoice"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <Tabs
              value={activeStep}
              onValueChange={(value) =>
                setActiveStep(value as (typeof wizardSteps)[number]["value"])
              }
              className="flex-1 flex flex-col gap-4 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-3">
                <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-7 gap-2 bg-transparent p-0">
                  {wizardSteps.map((step, index) => {
                    const isDone = currentStepIndex > index;
                    const isActive = currentStepIndex === index;
                    return (
                      <TabsTrigger
                        key={step.value}
                        value={step.value}
                        className="rounded-sm border px-3 py-2 h-auto bg-white dark:bg-background data-[state=active]:border-primary data-[state=active]:shadow-none"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center ${isDone
                                ? "bg-emerald-600 text-white"
                                : isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                              }`}
                          >
                            {index + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {step.label}
                          </span>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <ScrollArea className="flex-1 px-6 pt-2 pb-4">
                <TabsContent value="company" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                            <Input
                              {...field}
                              placeholder="https://..."
                              className="h-9 text-sm"
                            />
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
                    <FormField
                      control={form.control}
                      name="companyInfo.address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">Alamat Lengkap</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} className="text-sm resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="invoice" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="invoiceInfo.invoiceName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">Nama Invoice</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoiceInfo.invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">No. Invoice</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoiceInfo.invoiceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Tanggal Inv.</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoiceInfo.taxInvoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Faktur Pajak</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoiceInfo.dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Jatuh Tempo</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="billing" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="billingInfo.companyName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">Nama Lengkap Perusahaan</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingInfo.address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">Alamat Lengkap Perusahaan</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} className="text-sm resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingInfo.phone"
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
                    <FormField
                      control={form.control}
                      name="billingInfo.pic.name"
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
                      name="billingInfo.pic.position"
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
                      name="billingInfo.pic.contact"
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
                  </div>
                </TabsContent>

                <TabsContent value="items" className="mt-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs">Detail Pesanan</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={addLineItem}
                    >
                      <Plus className="h-3 w-3" /> Add Row
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {lineItems.map((_, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 p-2"
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
                                <Input
                                  {...field}
                                  placeholder="Item description"
                                  className="h-8 text-sm"
                                />
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
                                <CurrencyInput
                                  prefix=""
                                  name={field.name}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
                                  value={field.value}
                                  onChange={(v: number) => {
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
                                <CurrencyInput
                                  prefix="Rp"
                                  name={field.name}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
                                  value={field.value}
                                  onChange={(v: number) => {
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
                                <CurrencyInput
                                  prefix=""
                                  name={field.name}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
                                  value={field.value ?? 11}
                                  onChange={(v: number) => {
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
                        <div className="col-span-1 flex flex-col">
                          <span className="text-[10px] text-slate-500">DPP</span>
                          <span className="text-xs font-medium text-foreground">
                            {new Intl.NumberFormat("id-ID").format(
                              lineItems[index]?.dpp ?? 0
                            )}
                          </span>
                        </div>
                        <div className="col-span-2 flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-500">Total</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-foreground">
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
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="paymentInfo.bank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Bank</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentInfo.accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nomor Akun Bank</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentInfo.branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Cabang Bank</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentInfo.accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nama Akun Bank</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentInfo.npwp"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">NPWP</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="approval" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">TTD (Signature URL)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://..."
                              className="h-9 text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Notes / Terms and Conditions</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={6} className="text-sm resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="p-6 pt-4 border-t">
              <Button variant="outline" type="button" className="mr-auto" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="outline" type="button" onClick={goToPreviousStep} disabled={isFirstStep}>
                Back
              </Button>
              {isLastStep ? (
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : isEdit
                      ? "Update"
                      : "Create"}
                </Button>
              ) : (
                <Button type="button" onClick={goToNextStep}>
                  Next
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
