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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { projectFormSchema, type ProjectFormValues } from "../schema";
import { createProject, updateProject } from "@/api/projects";
import { getClients } from "@/api/clients";
import { getEmployees } from "@/api/employees";
import type { Project } from "../types";
import type { Client } from "@/api/clients";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSuccess: () => void;
}

const defaultIdentity = {
  projectId: "",
  namaProject: "",
  clientId: "",
  clientName: "",
  scopeProject: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  projectManagerId: "",
  projectManagerName: "",
  status: "on_progress" as const,
};

const defaultDocumentRelations = {
  proposalIds: [] as string[],
  quotationIds: [] as string[],
  purchaseOrderIds: [] as string[],
  invoiceIds: [] as string[],
  bastIds: [] as string[],
};

const defaultFinance = {
  income: 0,
  expense: 0,
  profitLoss: 0,
};

const DOC_TYPE_OPTIONS = [
  { value: "contract", label: "Contract" },
  { value: "photo", label: "Photo" },
  { value: "file", label: "File" },
  { value: "report", label: "Report" },
];

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectFormDialogProps) {
  const isEdit = !!project;
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<{ id: string; namaKaryawan: string }[]>([]);

  useEffect(() => {
    if (open) {
      getClients().then(setClients);
      getEmployees().then((emps) => {
        const list = emps.map((e) => ({ id: e.id, namaKaryawan: e.namaKaryawan }));
        if (project?.identity.projectManagerId && project.identity.projectManagerName) {
          const exists = list.some((e) => e.id === project.identity.projectManagerId);
          if (!exists) {
            list.unshift({
              id: project.identity.projectManagerId,
              namaKaryawan: project.identity.projectManagerName,
            });
          }
        }
        setEmployees(list);
      });
    }
  }, [open, project]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      identity: defaultIdentity,
      documentRelations: defaultDocumentRelations,
      finance: defaultFinance,
      documents: [],
    },
  });

  const income = form.watch("finance.income");
  const expense = form.watch("finance.expense");

  const updateProfitLoss = useCallback(() => {
    const pl = (income ?? 0) - (expense ?? 0);
    form.setValue("finance.profitLoss", pl);
  }, [income, expense, form]);

  useEffect(() => {
    updateProfitLoss();
  }, [income, expense, updateProfitLoss]);

  const addDocId = (field: keyof typeof defaultDocumentRelations, value: string) => {
    if (!value.trim()) return;
    const current = form.getValues(`documentRelations.${field}`) || [];
    form.setValue(`documentRelations.${field}`, [...current, value.trim()]);
  };

  const removeDocId = (field: keyof typeof defaultDocumentRelations, index: number) => {
    const current = form.getValues(`documentRelations.${field}`) || [];
    form.setValue(
      `documentRelations.${field}`,
      current.filter((_, i) => i !== index)
    );
  };

  const addDocument = () => {
    const current = form.getValues("documents") || [];
    form.setValue("documents", [
      ...current,
      { url: "", name: "", type: "file", uploadedAt: new Date().toISOString() },
    ]);
  };

  const removeDocument = (index: number) => {
    const current = form.getValues("documents") || [];
    form.setValue(
      "documents",
      current.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    if (project) {
      form.reset({
        identity: project.identity,
        documentRelations: project.documentRelations,
        finance: project.finance,
        documents: project.documents,
      });
    } else if (open) {
      form.reset({
        identity: { ...defaultIdentity, startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10) },
        documentRelations: defaultDocumentRelations,
        finance: defaultFinance,
        documents: [],
      });
    }
  }, [project, open, form]);

  const onSubmit = async (values: ProjectFormValues) => {
    const profitLoss = (values.finance.income ?? 0) - (values.finance.expense ?? 0);
    const payload = {
      identity: {
        ...values.identity,
        scopeProject: values.identity.scopeProject ?? "",
        projectManagerName: values.identity.projectManagerName ?? "",
      },
      documentRelations: values.documentRelations,
      finance: {
        income: values.finance.income,
        expense: values.finance.expense,
        profitLoss,
      },
      documents: values.documents
        .filter((d): d is { url: string; name: string; type?: string; uploadedAt?: string } => !!(d.name && d.url))
        .map((d) => ({
          url: d.url,
          name: d.name,
          type: d.type ?? "file",
          uploadedAt: d.uploadedAt ?? new Date().toISOString(),
        })),
    };

    if (isEdit && project) {
      await updateProject(project.id, payload);
    } else {
      await createProject(payload);
    }
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <Tabs defaultValue="identity" className="flex-1 flex flex-col gap-4 overflow-hidden">
              <TabsList className="mx-6 px-2 flex gap-1 shrink-0 flex-wrap">
                <TabsTrigger value="identity" className="text-xs px-2 py-1.5">
                  Identity
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs px-2 py-1.5">
                  Document Relations
                </TabsTrigger>
                <TabsTrigger value="finance" className="text-xs px-2 py-1.5">
                  Finance
                </TabsTrigger>
                <TabsTrigger value="supporting" className="text-xs px-2 py-1.5">
                  Documentation
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-6 pb-4">
                <TabsContent value="identity" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="identity.projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Project ID</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="identity.namaProject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Project</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="identity.clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Klien</FormLabel>
                        <Select
                          onValueChange={(v) => {
                            field.onChange(v);
                            const c = clients.find((x) => x.id === v);
                            if (c) form.setValue("identity.clientName", c.name);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="identity.scopeProject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Scope Project</FormLabel>
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
                      name="identity.startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Start Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="identity.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">End Date</FormLabel>
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
                    name="identity.projectManagerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Project Manager / PIC Internal</FormLabel>
                        <Select
                          onValueChange={(v) => {
                            field.onChange(v);
                            const emp = employees.find((e) => e.id === v);
                            form.setValue("identity.projectManagerName", emp?.namaKaryawan ?? v);
                          }}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select PM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((e) => (
                              <SelectItem key={e.id} value={e.id}>
                                {e.namaKaryawan}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="identity.status"
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
                            <SelectItem value="on_progress">On Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="documents" className="mt-0 space-y-4">
                  <DocIdListField
                    form={form}
                    field="proposalIds"
                    label="Proposal IDs"
                    addDocId={addDocId}
                    removeDocId={removeDocId}
                  />
                  <DocIdListField
                    form={form}
                    field="quotationIds"
                    label="Quotation IDs"
                    addDocId={addDocId}
                    removeDocId={removeDocId}
                  />
                  <DocIdListField
                    form={form}
                    field="purchaseOrderIds"
                    label="PO IDs"
                    addDocId={addDocId}
                    removeDocId={removeDocId}
                  />
                  <DocIdListField
                    form={form}
                    field="invoiceIds"
                    label="Invoice IDs"
                    addDocId={addDocId}
                    removeDocId={removeDocId}
                  />
                  <DocIdListField
                    form={form}
                    field="bastIds"
                    label="BAST IDs"
                    addDocId={addDocId}
                    removeDocId={removeDocId}
                  />
                </TabsContent>

                <TabsContent value="finance" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="finance.income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Income</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
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
                    name="finance.expense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Expense</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel className="text-xs">Profit/Loss</FormLabel>
                    <p className="text-sm font-medium mt-1">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(form.watch("finance.profitLoss") ?? 0)}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="supporting" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs">Supporting Documents</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={addDocument}>
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>
                  {(form.watch("documents") || []).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 p-2 rounded border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5"
                    >
                      <FormField
                        control={form.control}
                        name={`documents.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="col-span-5">
                            <FormControl>
                              <Input {...field} placeholder="URL" className="h-8 text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`documents.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl>
                              <Input {...field} placeholder="Name" className="h-8 text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`documents.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DOC_TYPE_OPTIONS.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-1 flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => removeDocument(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
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

function DocIdListField({
  form,
  field,
  label,
  addDocId,
  removeDocId,
}: {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  field: keyof typeof defaultDocumentRelations;
  label: string;
  addDocId: (f: keyof typeof defaultDocumentRelations, v: string) => void;
  removeDocId: (f: keyof typeof defaultDocumentRelations, i: number) => void;
}) {
  const [inputVal, setInputVal] = useState("");
  const ids = form.watch(`documentRelations.${field}`) || [];

  return (
    <div className="space-y-2">
      <FormLabel className="text-xs">{label}</FormLabel>
      <div className="flex gap-2">
        <Input
          className="h-9 text-sm flex-1"
          placeholder="Add ID..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDocId(field, inputVal);
              setInputVal("");
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => {
            addDocId(field, inputVal);
            setInputVal("");
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {ids.map((id, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs"
          >
            {id}
            <button
              type="button"
              onClick={() => removeDocId(field, i)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
