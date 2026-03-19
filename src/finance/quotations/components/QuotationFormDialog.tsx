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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntityCombobox } from "@/components/ui/entity-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { quotationFormSchema, type QuotationFormValues } from "../schema";
import { useCreateQuotation, useUpdateQuotation } from "@/hooks/useQuotations";
import { useClients } from "@/hooks/useClients";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "sonner";
import type { Quotation } from "../types";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function getQuotationMonthDefault(): string {
  const d = new Date();
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const defaultLineItem = {
  number: 1,
  description: "",
  quantity: 1,
  unit: "Unit",
  unitPrice: 0,
  subtotal: 0,
};

interface QuotationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation?: Quotation;
  onSuccess: () => void;
}

export function QuotationFormDialog({
  open,
  onOpenChange,
  quotation,
  onSuccess,
}: QuotationFormDialogProps) {
  const isEdit = !!quotation;
  const createMutation = useCreateQuotation();
  const updateMutation = useUpdateQuotation();
  const { data: clientsData = [] } = useClients();
  const { data: projectsData = [] } = useProjects();
  const clients = clientsData.map((c) => ({ id: c.id, name: c.name }));
  const projects = projectsData.map((p) => ({
    id: p.id,
    namaProject: p.identity?.namaProject ?? "",
  }));

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      quotationNumber: "",
      quotationDate: new Date().toISOString().slice(0, 10),
      validUntil: "",
      clientId: "",
      clientName: "",
      projectId: "",
      projectName: "",
      serviceOffered: "",
      quotationMonth: getQuotationMonthDefault(),
      lineItems: [{ ...defaultLineItem }],
      subtotal: 0,
      taxAmount: 0,
      taxTypeId: "",
      grandTotal: 0,
      paymentTerms: "",
      validityPeriod: "",
      termsConditions: "",
      status: "draft",
    },
  });

  const lineItems = form.watch("lineItems");

  const updateLineItemCalc = useCallback(
    (index: number) => {
      const item = lineItems[index];
      if (!item) return;
      const subtotal = (item.quantity ?? 0) * (item.unitPrice ?? 0);
      const newItems = [...lineItems];
      newItems[index] = { ...item, number: index + 1, subtotal };
      form.setValue("lineItems", newItems);
      const totalSubtotal = newItems.reduce((s, i) => s + (i.subtotal ?? 0), 0);
      const taxAmount = totalSubtotal * 0.11;
      form.setValue("subtotal", totalSubtotal);
      form.setValue("taxAmount", taxAmount);
      form.setValue("grandTotal", totalSubtotal + taxAmount);
    },
    [lineItems, form]
  );

  const addLineItem = () => {
    const num = lineItems.length + 1;
    form.setValue("lineItems", [
      ...lineItems,
      { ...defaultLineItem, number: num },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    const newItems = lineItems.filter((_, i) => i !== index);
    newItems.forEach((item, i) => {
      item.number = i + 1;
    });
    form.setValue("lineItems", newItems);
    const totalSubtotal = newItems.reduce((s, i) => s + (i.subtotal ?? 0), 0);
    form.setValue("subtotal", totalSubtotal);
    form.setValue("taxAmount", totalSubtotal * 0.11);
    form.setValue("grandTotal", totalSubtotal * 1.11);
  };

  useEffect(() => {
    if (quotation) {
      form.reset({
        quotationNumber: quotation.quotationNumber,
        quotationDate: quotation.quotationDate,
        validUntil: quotation.validUntil ?? "",
        clientId: quotation.clientId,
        clientName: quotation.clientName,
        projectId: quotation.projectId ?? "",
        projectName: quotation.projectName ?? "",
        serviceOffered: quotation.serviceOffered,
        quotationMonth: quotation.quotationMonth,
        lineItems: quotation.lineItems,
        subtotal: quotation.subtotal,
        taxAmount: quotation.taxAmount,
        taxTypeId: quotation.taxTypeId ?? "",
        grandTotal: quotation.grandTotal,
        paymentTerms: quotation.paymentTerms ?? "",
        validityPeriod: quotation.validityPeriod ?? "",
        termsConditions: quotation.termsConditions ?? "",
        status: quotation.status,
      });
    } else if (open) {
      form.reset({
        quotationNumber: "",
        quotationDate: new Date().toISOString().slice(0, 10),
        validUntil: "",
        clientId: "",
        clientName: "",
        projectId: "",
        projectName: "",
        serviceOffered: "",
        quotationMonth: getQuotationMonthDefault(),
        lineItems: [{ ...defaultLineItem }],
        subtotal: 0,
        taxAmount: 0,
        taxTypeId: "",
        grandTotal: 0,
        paymentTerms: "",
        validityPeriod: "",
        termsConditions: "",
        status: "draft",
      });
    }
  }, [quotation, open, form]);

  const onSubmit = (values: QuotationFormValues) => {
    const payload = {
      quotationNumber: values.quotationNumber,
      quotationDate: values.quotationDate,
      validUntil: values.validUntil || undefined,
      clientId: values.clientId,
      clientName: values.clientName,
      projectId: values.projectId || undefined,
      projectName: values.projectName || undefined,
      serviceOffered: values.serviceOffered,
      quotationMonth: values.quotationMonth,
      lineItems: values.lineItems.map((li, i) => ({ ...li, number: i + 1 })),
      subtotal: values.subtotal,
      taxAmount: values.taxAmount,
      taxTypeId: values.taxTypeId || undefined,
      grandTotal: values.grandTotal,
      paymentTerms: values.paymentTerms || undefined,
      validityPeriod: values.validityPeriod || undefined,
      termsConditions: values.termsConditions || undefined,
      status: values.status,
    };

    const handleSuccess = () => {
      onOpenChange(false);
      onSuccess();
    };

    if (isEdit && quotation) {
      updateMutation.mutate(
        { id: quotation.id, input: payload },
        {
          onSuccess: handleSuccess,
          onError: () => toast.error("Failed to update quotation"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleSuccess,
        onError: () => toast.error("Failed to create quotation"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Quotation" : "Add Quotation"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <Tabs defaultValue="general" className="flex-1 flex flex-col gap-4 overflow-hidden">
              <TabsList className="mx-6 px-2 flex gap-1 shrink-0">
                <TabsTrigger value="general" className="text-xs px-2 py-1.5">General</TabsTrigger>
                <TabsTrigger value="items" className="text-xs px-2 py-1.5">Items</TabsTrigger>
                <TabsTrigger value="terms" className="text-xs px-2 py-1.5">Terms</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-6 pb-4">
                <TabsContent value="general" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quotationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Quotation Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-9 text-sm" placeholder="QT/ALG/0125/001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quotationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Valid Until (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Client</FormLabel>
                        <FormControl>
                          <EntityCombobox
                            items={clients.map((c) => ({ id: c.id, label: c.name }))}
                            value={field.value}
                            onValueChange={(v) => {
                              field.onChange(v);
                              const c = clients.find((x) => x.id === v);
                              if (c) form.setValue("clientName", c.name);
                            }}
                            placeholder="Select client"
                            searchPlaceholder="Search client..."
                            emptyText="No client found."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Project (optional)</FormLabel>
                        <FormControl>
                          <EntityCombobox
                            items={projects.map((p) => ({
                              id: p.id,
                              label: p.namaProject,
                            }))}
                            value={field.value || ""}
                            onValueChange={(v) => {
                              field.onChange(v);
                              const p = projects.find((x) => x.id === v);
                              form.setValue("projectName", p?.namaProject ?? "");
                            }}
                            placeholder="Select project"
                            searchPlaceholder="Search project..."
                            emptyText="No project found."
                            allowEmpty
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceOffered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Service Offered</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quotationMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Quotation Month</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="items" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs">Line Items</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={addLineItem}>
                      <Plus className="h-3 w-3" /> Add Row
                    </Button>
                  </div>
                  {lineItems.map((_, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-2 rounded border bg-slate-50/50 dark:bg-white/5">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="col-span-12">
                            <FormControl>
                              <Input {...field} placeholder="Description" className="h-8 text-sm" />
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
                              <Input {...field} className="h-8 text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.unitPrice`}
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
                      <div className="col-span-2 flex items-center text-xs">
                        {new Intl.NumberFormat("id-ID").format(lineItems[index]?.subtotal ?? 0)}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length <= 1}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-end gap-4 text-sm font-medium">
                    <span>Subtotal: {new Intl.NumberFormat("id-ID").format(form.watch("subtotal"))}</span>
                    <span>Tax: {new Intl.NumberFormat("id-ID").format(form.watch("taxAmount"))}</span>
                    <span>Grand Total: {new Intl.NumberFormat("id-ID").format(form.watch("grandTotal"))}</span>
                  </div>
                </TabsContent>

                <TabsContent value="terms" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Payment Terms</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" placeholder="Net 30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="validityPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Validity Period</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" placeholder="30 hari" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="termsConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Terms & Conditions</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} className="text-sm resize-none" />
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
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  form.formState.isSubmitting
                }
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEdit
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
