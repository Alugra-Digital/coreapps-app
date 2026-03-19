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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { taxTypeFormSchema, type TaxTypeFormValues } from "../schema";
import { useCreateTaxType, useUpdateTaxType } from "@/hooks/useTaxTypes";
import type { TaxType, ApplicableDocument } from "../types";
import { toast } from "sonner";

interface TaxTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxType?: TaxType;
  onSuccess: () => void;
}

const APPLICABLE_DOC_OPTIONS: { value: ApplicableDocument; label: string }[] = [
  { value: "invoice", label: "Invoice" },
  { value: "po", label: "PO" },
  { value: "bast", label: "BAST" },
];

export function TaxTypeFormDialog({
  open,
  onOpenChange,
  taxType,
  onSuccess,
}: TaxTypeFormDialogProps) {
  const isEdit = !!taxType;
  const createMutation = useCreateTaxType();
  const updateMutation = useUpdateTaxType();

  const form = useForm<TaxTypeFormValues>({
    resolver: zodResolver(taxTypeFormSchema),
    defaultValues: {
      code: "",
      name: "",
      rate: 0,
      category: "output_tax",
      description: "",
      regulation: "",
      applicableDocuments: [],
      documentUrl: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (taxType) {
      form.reset({
        code: taxType.code,
        name: taxType.name,
        rate: taxType.rate,
        category: taxType.category,
        description: taxType.description,
        regulation: taxType.regulation ?? "",
        applicableDocuments: taxType.applicableDocuments,
        documentUrl: taxType.documentUrl ?? "",
        isActive: taxType.isActive,
      });
    } else if (open) {
      form.reset({
        code: "",
        name: "",
        rate: 0,
        category: "output_tax",
        description: "",
        regulation: "",
        applicableDocuments: [],
        documentUrl: "",
        isActive: true,
      });
    }
  }, [taxType, open, form]);

  const onSubmit = (values: TaxTypeFormValues) => {
    const payload = {
      code: values.code,
      name: values.name,
      rate: values.rate,
      category: values.category,
      description: values.description,
      regulation: values.regulation || undefined,
      applicableDocuments: values.applicableDocuments,
      documentUrl: values.documentUrl || undefined,
      isActive: values.isActive,
    };

    const handleSuccess = () => {
      onOpenChange(false);
      onSuccess();
    };

    if (isEdit && taxType) {
      updateMutation.mutate(
        { id: taxType.id, input: payload },
        {
          onSuccess: handleSuccess,
          onError: () => toast.error("Failed to update tax type"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleSuccess,
        onError: () => toast.error("Failed to create tax type"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Tax Type" : "Add Tax Type"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="flex-1 px-6 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Code</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" placeholder="PPN_11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" placeholder="PPN 11%" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="output_tax">Output Tax</SelectItem>
                            <SelectItem value="withholding_tax">Withholding Tax</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} className="text-sm resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regulation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Regulation (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="PPh Pasal 4 Ayat 2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableDocuments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Applicable Documents</FormLabel>
                      <div className="flex gap-4 pt-2">
                        {APPLICABLE_DOC_OPTIONS.map((opt) => (
                          <div
                            key={opt.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`doc-${opt.value}`}
                              checked={field.value?.includes(opt.value)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                const newVal = checked
                                  ? [...current, opt.value]
                                  : current.filter((d) => d !== opt.value);
                                field.onChange(newVal);
                              }}
                            />
                            <label
                              htmlFor={`doc-${opt.value}`}
                              className="text-sm font-medium leading-none cursor-pointer text-foreground"
                            >
                              {opt.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Document URL (PDF)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." className="h-9 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <FormLabel className="text-xs">Active</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
