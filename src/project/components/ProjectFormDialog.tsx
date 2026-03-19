import React, { useEffect, useCallback, useState } from "react";
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
import { EntityCombobox } from "@/components/ui/entity-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { projectFormSchema, type ProjectFormValues } from "../schema";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useClients } from "@/hooks/useClients";
import { useEmployees } from "@/hooks/useEmployees";
import { getProposalById } from "@/api/proposal-penawaran";
import { toast } from "sonner";
import type { Project } from "../types";

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
  price: 0,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  projectManagerId: "",
  projectManagerName: "",
  status: "ON_PROGRESS" as const,
};

const defaultDocumentRelations = {
  proposalIds: [] as string[],
  quotationIds: [] as string[],
  purchaseOrderIds: [] as string[],
  invoiceIds: [] as string[],
  bastIds: [] as string[],
};

const DOC_TYPE_OPTIONS = [
  { value: "contract", label: "Contract" },
  { value: "photo", label: "Photo" },
  { value: "file", label: "File" },
  { value: "report", label: "Report" },
];

function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectFormDialogProps) {
  const isEdit = !!project;
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const { data: clientsData = [] } = useClients();
  const { data: employeesData = [] } = useEmployees();

  const clients = clientsData;
  const employees = React.useMemo(() => {
    const list = employeesData.map((e) => ({
      id: e.id,
      namaKaryawan: e.namaKaryawan,
    }));
    if (open && project?.identity.projectManagerId && project.identity.projectManagerName) {
      const exists = list.some((e) => e.id === project.identity.projectManagerId);
      if (!exists) {
        list.unshift({
          id: project.identity.projectManagerId,
          namaKaryawan: project.identity.projectManagerName,
        });
      }
    }
    return list;
  }, [employeesData, open, project?.identity.projectManagerId, project?.identity.projectManagerName]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      identity: defaultIdentity,
      documentRelations: defaultDocumentRelations,
      expenses: [],
      documents: [],
    },
  });

  // ─── Proposal auto-fetch helper ─────────────────────────────────
  const fetchAndApplyProposal = useCallback(
    async (proposalId: string) => {
      try {
        const proposal = await getProposalById(proposalId);
        if (!proposal) return;

        // Map proposal fields → project form
        if (proposal.coverInfo?.jobOffer) {
          form.setValue("identity.namaProject", proposal.coverInfo.jobOffer);
        }
        if (proposal.clientInfo?.clientId) {
          form.setValue("identity.clientId", String(proposal.clientInfo.clientId));
        }
        if (proposal.clientInfo?.clientName) {
          form.setValue("identity.clientName", proposal.clientInfo.clientName);
        }
        if (Array.isArray(proposal.scopeOfWork) && proposal.scopeOfWork.length > 0) {
          form.setValue("identity.scopeProject", proposal.scopeOfWork.join("; "));
        }
        if (proposal.totalEstimatedCost != null) {
          form.setValue("identity.price", Number(proposal.totalEstimatedCost) || 0);
        }

        toast.success(`Project fields populated from Proposal ${proposal.proposalNumber ?? proposalId}`);
      } catch {
        // Silently fail — user can still fill manually
      }
    },
    [form]
  );

  // ─── Document relation helpers ──────────────────────────────────
  const addDocId = useCallback(
    (field: keyof typeof defaultDocumentRelations, value: string) => {
      if (!value.trim()) return;
      const current = form.getValues(`documentRelations.${field}`) || [];
      form.setValue(`documentRelations.${field}`, [...current, value.trim()]);

      // Auto-fetch proposal when a Proposal ID is added
      if (field === "proposalIds") {
        fetchAndApplyProposal(value.trim());
      }
    },
    [form, fetchAndApplyProposal]
  );

  const removeDocId = (field: keyof typeof defaultDocumentRelations, index: number) => {
    const current = form.getValues(`documentRelations.${field}`) || [];
    form.setValue(
      `documentRelations.${field}`,
      current.filter((_, i) => i !== index)
    );
  };

  // ─── Supporting document helpers ────────────────────────────────
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

  // ─── Expense helpers ────────────────────────────────────────────
  const addExpense = (phase: "PRE_COST" | "ON_GOING") => {
    const current = form.getValues("expenses") || [];
    form.setValue("expenses", [
      ...current,
      {
        description: "",
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        phase,
      },
    ]);
  };

  const removeExpense = (index: number) => {
    const current = form.getValues("expenses") || [];
    form.setValue(
      "expenses",
      current.filter((_, i) => i !== index)
    );
  };

  // ─── Reset form on open/edit ────────────────────────────────────
  useEffect(() => {
    if (project) {
      // Map existing project expenses to form format
      const expenses = (project.expenses ?? []).map((e) => ({
        description: e.description ?? "",
        date: e.date ?? new Date().toISOString().slice(0, 10),
        amount: e.amount ?? 0,
        phase: (e.phase ?? "ON_GOING") as "PRE_COST" | "ON_GOING",
      }));
      form.reset({
        identity: { ...defaultIdentity, ...project.identity, price: project.identity.price ?? 0 },
        documentRelations: project.documentRelations,
        expenses,
        documents: project.documents,
      });
    } else if (open) {
      form.reset({
        identity: { ...defaultIdentity, startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10) },
        documentRelations: defaultDocumentRelations,
        expenses: [],
        documents: [],
      });
    }
  }, [project, open, form]);

  // ─── Computed expense totals ────────────────────────────────────
  const watchedExpenses = form.watch("expenses") || [];
  const preCostItems = watchedExpenses.filter((e) => e.phase === "PRE_COST");
  const onGoingItems = watchedExpenses.filter((e) => e.phase === "ON_GOING");
  const preCostTotal = preCostItems.reduce((s, e) => s + (e.amount || 0), 0);
  const onGoingTotal = onGoingItems.reduce((s, e) => s + (e.amount || 0), 0);
  const totalExpense = preCostTotal + onGoingTotal;

  // ─── Submit ─────────────────────────────────────────────────────
  const onSubmit = (values: ProjectFormValues) => {
    const payload = {
      identity: {
        ...values.identity,
        scopeProject: values.identity.scopeProject ?? "",
        projectManagerName: values.identity.projectManagerName ?? "",
      },
      documentRelations: values.documentRelations,
      finance: {
        expense: totalExpense,
        totalExpense,
      },
      expenses: values.expenses,
      documents: values.documents
        .filter((d): d is { url: string; name: string; type?: string; uploadedAt?: string } => !!(d.name && d.url))
        .map((d) => ({
          url: d.url,
          name: d.name,
          type: d.type ?? "file",
          uploadedAt: d.uploadedAt ?? new Date().toISOString(),
        })),
    };

    const handleSuccess = () => {
      onOpenChange(false);
      onSuccess();
    };

    if (isEdit && project) {
      updateMutation.mutate(
        { id: project.id, input: payload },
        {
          onSuccess: () => {
            toast.success("Project updated successfully.");
            handleSuccess();
          },
          onError: (err) => {
            const message =
              err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Failed to save project.";
            toast.error(message);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Project created successfully.");
          handleSuccess();
        },
        onError: (err) => {
          const message =
            err && typeof err === "object" && "message" in err
              ? String((err as { message: string }).message)
              : "Failed to save project.";
          toast.error(message);
        },
      });
    }
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
                {/* ═══ IDENTITY TAB ═══ */}
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
                        <FormControl>
                          <EntityCombobox
                            items={clients.map((c) => ({
                              id: c.id,
                              label: c.companyName || c.name,
                            }))}
                            value={field.value}
                            onValueChange={(v) => {
                              field.onChange(v);
                              const c = clients.find((x) => x.id === v);
                              if (c)
                                form.setValue(
                                  "identity.clientName",
                                  c.companyName || c.name
                                );
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
                  <FormField
                    control={form.control}
                    name="identity.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Price / Contract Value (IDR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-9 text-sm"
                          />
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
                        <FormControl>
                          <EntityCombobox
                            items={employees.map((e) => ({
                              id: e.id,
                              label: e.namaKaryawan,
                            }))}
                            value={field.value || ""}
                            onValueChange={(v) => {
                              field.onChange(v);
                              const emp = employees.find((e) => e.id === v);
                              form.setValue(
                                "identity.projectManagerName",
                                emp?.namaKaryawan ?? v
                              );
                            }}
                            placeholder="Select PM"
                            searchPlaceholder="Search PM..."
                            emptyText="No PM found."
                          />
                        </FormControl>
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
                            <SelectItem value="PIPELINE">Pipeline</SelectItem>
                            <SelectItem value="NEGOTIATION">Negosiasi</SelectItem>
                            <SelectItem value="WON">Won</SelectItem>
                            <SelectItem value="LOST">Lost</SelectItem>
                            <SelectItem value="ON_PROGRESS">On Progress</SelectItem>
                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            <SelectItem value="READY_TO_CLOSE">Ready to Close</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* ═══ DOCUMENT RELATIONS TAB ═══ */}
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

                {/* ═══ FINANCE TAB — EXPENSE LIST ═══ */}
                <TabsContent value="finance" className="mt-0 space-y-6">
                  {/* Pre-cost section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Pre-cost (Before Project Start)
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => addExpense("PRE_COST")}
                      >
                        <Plus className="h-3 w-3" /> Add
                      </Button>
                    </div>
                    {watchedExpenses.map((exp, index) =>
                      exp.phase === "PRE_COST" ? (
                        <ExpenseRow key={index} form={form} index={index} onRemove={removeExpense} />
                      ) : null
                    )}
                    {preCostItems.length === 0 && (
                      <p className="text-xs text-slate-400">No pre-cost expenses.</p>
                    )}
                    <div className="text-xs font-medium text-right text-slate-600 dark:text-slate-400">
                      Subtotal: {formatCurrencyDisplay(preCostTotal)}
                    </div>
                  </div>

                  <hr className="border-slate-200 dark:border-white/10" />

                  {/* On-going section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        On-going (During Project)
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => addExpense("ON_GOING")}
                      >
                        <Plus className="h-3 w-3" /> Add
                      </Button>
                    </div>
                    {watchedExpenses.map((exp, index) =>
                      exp.phase === "ON_GOING" ? (
                        <ExpenseRow key={index} form={form} index={index} onRemove={removeExpense} />
                      ) : null
                    )}
                    {onGoingItems.length === 0 && (
                      <p className="text-xs text-slate-400">No on-going expenses.</p>
                    )}
                    <div className="text-xs font-medium text-right text-slate-600 dark:text-slate-400">
                      Subtotal: {formatCurrencyDisplay(onGoingTotal)}
                    </div>
                  </div>

                  <hr className="border-slate-200 dark:border-white/10" />

                  <div className="text-sm font-bold text-right">
                    Total Expense: {formatCurrencyDisplay(totalExpense)}
                  </div>
                </TabsContent>

                {/* ═══ DOCUMENTATION TAB ═══ */}
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

// ─── Expense Row Component ────────────────────────────────────────
function ExpenseRow({
  form,
  index,
  onRemove,
}: {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  index: number;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 p-2 rounded border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
      <FormField
        control={form.control}
        name={`expenses.${index}.description`}
        render={({ field }) => (
          <FormItem className="col-span-5">
            <FormControl>
              <Input {...field} placeholder="Description" className="h-8 text-sm" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`expenses.${index}.date`}
        render={({ field }) => (
          <FormItem className="col-span-3">
            <FormControl>
              <Input {...field} type="date" className="h-8 text-sm" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`expenses.${index}.amount`}
        render={({ field }) => (
          <FormItem className="col-span-3">
            <FormControl>
              <Input
                type="number"
                min={0}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                placeholder="Amount"
                className="h-8 text-sm"
              />
            </FormControl>
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
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Document ID List Field ────────────────────────────────────────
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
