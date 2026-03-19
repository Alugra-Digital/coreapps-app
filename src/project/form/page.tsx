import React, { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, FolderKanban, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EntityCombobox } from "@/components/ui/entity-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectFormSchema, type ProjectFormValues } from "../schema";
import { useCreateProject, useUpdateProject, useProjects } from "@/hooks/useProjects";
import { useClients } from "@/hooks/useClients";
import { useEmployees } from "@/hooks/useEmployees";
import { getProposalById } from "@/api/proposal-penawaran";
import { toast } from "sonner";

const defaultIdentity = {
    projectId: "", namaProject: "", clientId: "", clientName: "", scopeProject: "",
    price: 0, startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10),
    projectManagerId: "", projectManagerName: "",
    picId: "", picName: "",
    status: "ON_PROGRESS" as const,
};
const defaultDocumentRelations = {
    proposalIds: [] as string[], quotationIds: [] as string[], purchaseOrderIds: [] as string[],
    invoiceIds: [] as string[], bastIds: [] as string[],
};
const DOC_TYPE_OPTIONS = [
    { value: "contract", label: "Contract" }, { value: "photo", label: "Photo" },
    { value: "file", label: "File" }, { value: "report", label: "Report" },
];

function formatCurrencyDisplay(value: number): string {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const FIELD_STYLE = "bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] rounded-xl focus:border-[#F5A623] transition-colors placeholder:text-[#6B6B75]";
const LABEL_STYLE = "text-[#6B6B75] text-xs font-bold uppercase tracking-wider";

// ─── Expense Row ─────────────────────────────────────────────────────
function ExpenseRow({
    form, index, onRemove,
}: {
    form: ReturnType<typeof useForm<ProjectFormValues>>;
    index: number;
    onRemove: (i: number) => void;
}) {
    return (
        <div className="grid grid-cols-12 gap-3 p-4 bg-[#0A0A0B] border border-[#1E1E22] rounded-xl">
            <FormField control={form.control} name={`expenses.${index}.description`} render={({ field }) => (
                <FormItem className="col-span-5">
                    <FormControl><Input {...field} placeholder="Deskripsi" className={`h-10 ${FIELD_STYLE}`} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                </FormItem>
            )} />
            <FormField control={form.control} name={`expenses.${index}.date`} render={({ field }) => (
                <FormItem className="col-span-3">
                    <FormControl><Input {...field} type="date" className={`h-10 ${FIELD_STYLE}`} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                </FormItem>
            )} />
            <FormField control={form.control} name={`expenses.${index}.amount`} render={({ field }) => (
                <FormItem className="col-span-3">
                    <FormControl>
                        <CurrencyInput prefix="Rp" name={field.name} onBlur={field.onBlur} ref={field.ref} value={field.value} onChange={(v: number) => field.onChange(v)} className={`h-10 ${FIELD_STYLE}`} />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                </FormItem>
            )} />
            <div className="col-span-1 flex items-center justify-center">
                <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)}
                    className="h-10 w-10 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

// ─── Doc ID List Field ───────────────────────────────────────────────
function DocIdListField({
    form, field, label, addDocId, removeDocId,
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
        <div className="space-y-3">
            <p className={LABEL_STYLE}>{label}</p>
            <div className="flex gap-3">
                <Input
                    className={`h-11 flex-1 ${FIELD_STYLE}`}
                    placeholder="Add ID..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDocId(field, inputVal); setInputVal(""); } }}
                />
                <Button type="button" variant="outline" size="sm" className="h-11 px-4 border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 rounded-xl"
                    onClick={() => { addDocId(field, inputVal); setInputVal(""); }}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {ids.map((id, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-medium">
                        {id}
                        <button type="button" onClick={() => removeDocId(field, i)} className="hover:text-red-400 transition-colors">
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function ProjectFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: projects = [] } = useProjects();
    const project = projects.find((p) => p.id === id);

    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject();
    const { data: clientsData = [] } = useClients();
    const { data: employeesData = [] } = useEmployees();

    const employees = React.useMemo(() => {
        const list = employeesData
            .filter((e) => e.namaJabatan === "Project Manager")
            .map((e) => ({ id: e.id, namaKaryawan: e.namaKaryawan }));

        if (project?.identity.projectManagerId && project.identity.projectManagerName) {
            const exists = list.some((e) => e.id === project.identity.projectManagerId);
            if (!exists) list.unshift({ id: project.identity.projectManagerId, namaKaryawan: project.identity.projectManagerName });
        }
        return list;
    }, [employeesData, project?.identity.projectManagerId, project?.identity.projectManagerName]);

    const picEmployees = React.useMemo(() => {
        const list = employeesData.map((e) => ({ id: e.id, namaKaryawan: e.namaKaryawan }));
        if (project?.identity.picId && project.identity.picName) {
            const exists = list.some((e) => e.id === project.identity.picId);
            if (!exists) list.unshift({ id: project.identity.picId, namaKaryawan: project.identity.picName });
        }
        return list;
    }, [employeesData, project?.identity.picId, project?.identity.picName]);

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: { identity: defaultIdentity, documentRelations: defaultDocumentRelations, expenses: [], documents: [] },
    });

    const fetchAndApplyProposal = useCallback(async (proposalId: string) => {
        try {
            const proposal = await getProposalById(proposalId);
            if (!proposal) return;
            if (proposal.coverInfo?.jobOffer) form.setValue("identity.namaProject", proposal.coverInfo.jobOffer);
            if (proposal.clientInfo?.clientId) form.setValue("identity.clientId", String(proposal.clientInfo.clientId));
            if (proposal.clientInfo?.clientName) form.setValue("identity.clientName", proposal.clientInfo.clientName);
            if (Array.isArray(proposal.scopeOfWork) && proposal.scopeOfWork.length > 0) {
                form.setValue("identity.scopeProject", proposal.scopeOfWork.join("; "));
            }
            if (proposal.totalEstimatedCost != null) form.setValue("identity.price", Number(proposal.totalEstimatedCost) || 0);
            toast.success(`Fields populated from Proposal ${proposal.proposalNumber ?? proposalId}`);
        } catch { /* silently fail */ }
    }, [form]);

    const addDocId = useCallback((field: keyof typeof defaultDocumentRelations, value: string) => {
        if (!value.trim()) return;
        const current = form.getValues(`documentRelations.${field}`) || [];
        form.setValue(`documentRelations.${field}`, [...current, value.trim()]);
        if (field === "proposalIds") fetchAndApplyProposal(value.trim());
    }, [form, fetchAndApplyProposal]);

    const removeDocId = (field: keyof typeof defaultDocumentRelations, index: number) => {
        const current = form.getValues(`documentRelations.${field}`) || [];
        form.setValue(`documentRelations.${field}`, current.filter((_, i) => i !== index));
    };

    const addDocument = () => {
        const current = form.getValues("documents") || [];
        form.setValue("documents", [...current, { url: "", name: "", type: "file", uploadedAt: new Date().toISOString() }]);
    };
    const removeDocument = (index: number) => {
        const current = form.getValues("documents") || [];
        form.setValue("documents", current.filter((_, i) => i !== index));
    };

    const addExpense = (phase: "PRE_COST" | "ON_GOING") => {
        const current = form.getValues("expenses") || [];
        form.setValue("expenses", [...current, { description: "", date: new Date().toISOString().slice(0, 10), amount: 0, phase }]);
    };
    const removeExpense = (index: number) => {
        const current = form.getValues("expenses") || [];
        form.setValue("expenses", current.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (project) {
            const expenses = (project.expenses ?? []).map((e) => ({
                description: e.description ?? "", date: e.date ?? new Date().toISOString().slice(0, 10),
                amount: e.amount ?? 0, phase: (e.phase ?? "ON_GOING") as "PRE_COST" | "ON_GOING",
            }));
            form.reset({
                identity: { ...defaultIdentity, ...project.identity, price: project.identity.price ?? 0 },
                documentRelations: project.documentRelations,
                expenses, documents: project.documents,
            });
        }
    }, [project, form]);

    const watchedExpenses = form.watch("expenses") || [];
    const preCostItems = watchedExpenses.filter((e) => e.phase === "PRE_COST");
    const onGoingItems = watchedExpenses.filter((e) => e.phase === "ON_GOING");
    const preCostTotal = preCostItems.reduce((s, e) => s + (e.amount || 0), 0);
    const onGoingTotal = onGoingItems.reduce((s, e) => s + (e.amount || 0), 0);
    const totalExpense = preCostTotal + onGoingTotal;

    const onSubmit = (values: ProjectFormValues) => {
        // Validation: Ensure Project ID is unique
        const isDuplicateId = projects.some(
            (p) =>
                p.identity.projectId.toLowerCase() === values.identity.projectId.toLowerCase() &&
                (!isEdit || p.id !== project?.id)
        );

        if (isDuplicateId) {
            form.setError("identity.projectId", {
                type: "manual",
                message: "Project ID already exists. Please choose a unique ID."
            });
            return;
        }

        const payload = {
            identity: { ...values.identity, scopeProject: values.identity.scopeProject ?? "", projectManagerName: values.identity.projectManagerName ?? "" },
            documentRelations: values.documentRelations,
            finance: { expense: totalExpense, totalExpense },
            expenses: values.expenses,
            documents: values.documents
                .filter((d): d is { url: string; name: string; type?: string; uploadedAt?: string } => !!(d.name && d.url))
                .map((d) => ({ url: d.url, name: d.name, type: d.type ?? "file", uploadedAt: d.uploadedAt ?? new Date().toISOString() })),
        };

        const handleSuccess = () => {
            toast.success(isEdit ? "Project updated successfully." : "Project created successfully.");
            navigate("/projects");
        };
        const handleError = (err: unknown) => {
            const message = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to save project.";
            toast.error(message);
        };

        if (isEdit && project) {
            updateMutation.mutate({ id: project.id, input: payload }, { onSuccess: handleSuccess, onError: handleError });
        } else {
            createMutation.mutate(payload, { onSuccess: handleSuccess, onError: handleError });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link to="/projects" className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm w-fit">
                        <ArrowLeft className="h-4 w-4" /> Back to Projects
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-xl flex items-center justify-center">
                            <FolderKanban className="h-6 w-6 text-[#F5A623]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">
                                {isEdit ? "Edit Project" : "New Project"}
                            </h1>
                            <p className="text-[#6B6B75] text-sm font-medium">
                                {isEdit ? `Editing ${project?.identity.namaProject ?? "..."}` : "Create a new project record"}
                            </p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Tabs defaultValue="identity">
                            <TabsList className="bg-[#111113] border border-[#1E1E22] p-1 rounded-xl h-auto flex flex-wrap gap-1">
                                {[
                                    { value: "identity", label: "Project Identity" },
                                    { value: "documents", label: "Doc Relations" },
                                    { value: "finance", label: "Expenses" },
                                    { value: "supporting", label: "Documentation" },
                                ].map(({ value, label }) => (
                                    <TabsTrigger key={value} value={value} className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-black text-[#6B6B75] font-semibold text-xs rounded-lg px-4 py-2 transition-all">
                                        {label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* IDENTITY TAB */}
                            <TabsContent value="identity" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6 rounded-2xl">
                                    <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Project Identity</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="identity.projectId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Project ID</FormLabel>
                                                <FormControl><Input {...field} placeholder="PROJ-2025-001" className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.namaProject" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Nama Project</FormLabel>
                                                <FormControl><Input {...field} placeholder="Sistem Informasi..." className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.clientId" render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className={LABEL_STYLE}>Klien</FormLabel>
                                                <FormControl>
                                                    <EntityCombobox
                                                        items={clientsData.map((c) => ({ id: c.id, label: c.companyName || c.name }))}
                                                        value={field.value}
                                                        onValueChange={(v) => {
                                                            field.onChange(v);
                                                            const c = clientsData.find((x) => x.id === v);
                                                            if (c) form.setValue("identity.clientName", c.companyName || c.name);
                                                        }}
                                                        placeholder="Select client" searchPlaceholder="Search client..." emptyText="No client found."
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.scopeProject" render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className={LABEL_STYLE}>Scope Project</FormLabel>
                                                <FormControl><Textarea {...field} rows={3} className={`resize-none ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.price" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Contract Value (IDR)</FormLabel>
                                                <FormControl>
                                                    <CurrencyInput prefix="Rp" name={field.name} onBlur={field.onBlur} ref={field.ref} value={field.value ?? 0} onChange={(v: number) => field.onChange(v)} className={`h-12 ${FIELD_STYLE}`} />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.status" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`h-12 ${FIELD_STYLE}`}><SelectValue /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                                                        {[
                                                            { value: "PIPELINE", label: "Pipeline" }, { value: "NEGOTIATION", label: "Negosiasi" },
                                                            { value: "WON", label: "Won" }, { value: "LOST", label: "Lost" },
                                                            { value: "ON_PROGRESS", label: "On Progress" }, { value: "ON_HOLD", label: "On Hold" },
                                                            { value: "READY_TO_CLOSE", label: "Ready to Close" }, { value: "COMPLETED", label: "Completed" },
                                                            { value: "CANCELLED", label: "Cancelled" },
                                                        ].map(({ value, label }) => (
                                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.startDate" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Start Date</FormLabel>
                                                <FormControl><Input {...field} type="date" className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.endDate" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>End Date</FormLabel>
                                                <FormControl><Input {...field} type="date" className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.projectManagerId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Project Manager</FormLabel>
                                                <FormControl>
                                                    <EntityCombobox
                                                        items={employees.map((e) => ({ id: e.id, label: e.namaKaryawan }))}
                                                        value={field.value || ""}
                                                        onValueChange={(v) => {
                                                            field.onChange(v);
                                                            const emp = employees.find((e) => e.id === v);
                                                            form.setValue("identity.projectManagerName", emp?.namaKaryawan ?? v);
                                                        }}
                                                        placeholder="Select PM" searchPlaceholder="Search PM..." emptyText="No PM found."
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="identity.picId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>PIC</FormLabel>
                                                <FormControl>
                                                    <EntityCombobox
                                                        items={picEmployees.map((e) => ({ id: e.id, label: e.namaKaryawan }))}
                                                        value={field.value || ""}
                                                        onValueChange={(v) => {
                                                            field.onChange(v);
                                                            const emp = picEmployees.find((e) => e.id === v);
                                                            form.setValue("identity.picName", emp?.namaKaryawan ?? v);
                                                        }}
                                                        placeholder="Select PIC" searchPlaceholder="Search PIC..." emptyText="No PIC found."
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* DOC RELATIONS TAB */}
                            <TabsContent value="documents" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 rounded-2xl">
                                    <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Document Relations</p>
                                    {(["proposalIds", "quotationIds", "purchaseOrderIds", "invoiceIds", "bastIds"] as const).map((field) => (
                                        <div key={field} className="border-b border-[#1E1E22] pb-6 last:border-0 last:pb-0">
                                            <DocIdListField form={form} field={field} label={field.replace("Ids", " IDs").replace(/([A-Z])/g, " $1")}
                                                addDocId={addDocId} removeDocId={removeDocId} />
                                        </div>
                                    ))}
                                </Card>
                            </TabsContent>

                            {/* EXPENSES TAB */}
                            <TabsContent value="finance" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 rounded-2xl">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Pre-cost (Before Project Start)</p>
                                            <Button type="button" variant="outline" size="sm" onClick={() => addExpense("PRE_COST")}
                                                className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 rounded-xl h-9">
                                                <Plus className="h-3.5 w-3.5 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {watchedExpenses.map((exp, index) => exp.phase === "PRE_COST" ? (
                                                <ExpenseRow key={index} form={form} index={index} onRemove={removeExpense} />
                                            ) : null)}
                                            {preCostItems.length === 0 && <p className="text-xs text-[#6B6B75]">No pre-cost expenses.</p>}
                                        </div>
                                        <div className="text-sm font-bold text-right text-[#F5A623]">
                                            Subtotal: {formatCurrencyDisplay(preCostTotal)}
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t border-[#1E1E22] pt-8">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">On-going (During Project)</p>
                                            <Button type="button" variant="outline" size="sm" onClick={() => addExpense("ON_GOING")}
                                                className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 rounded-xl h-9">
                                                <Plus className="h-3.5 w-3.5 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {watchedExpenses.map((exp, index) => exp.phase === "ON_GOING" ? (
                                                <ExpenseRow key={index} form={form} index={index} onRemove={removeExpense} />
                                            ) : null)}
                                            {onGoingItems.length === 0 && <p className="text-xs text-[#6B6B75]">No on-going expenses.</p>}
                                        </div>
                                        <div className="text-sm font-bold text-right text-[#F5A623]">
                                            Subtotal: {formatCurrencyDisplay(onGoingTotal)}
                                        </div>
                                    </div>

                                    <div className="border-t border-[#1E1E22] pt-6 text-lg font-extrabold text-right text-[#F0F0F0]">
                                        Total: {formatCurrencyDisplay(totalExpense)}
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* DOCUMENTATION TAB */}
                            <TabsContent value="supporting" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6 rounded-2xl">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Supporting Documents</p>
                                        <Button type="button" variant="outline" size="sm" onClick={addDocument}
                                            className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 rounded-xl h-9">
                                            <Plus className="h-3.5 w-3.5 mr-1" /> Add
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {(form.watch("documents") || []).map((_, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-[#0A0A0B] border border-[#1E1E22] rounded-xl">
                                                <FormField control={form.control} name={`documents.${index}.url`} render={({ field }) => (
                                                    <FormItem className="col-span-5">
                                                        <FormControl><Input {...field} placeholder="URL" className={`h-10 ${FIELD_STYLE}`} /></FormControl>
                                                        <FormMessage className="text-red-400 text-xs" />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name={`documents.${index}.name`} render={({ field }) => (
                                                    <FormItem className="col-span-3">
                                                        <FormControl><Input {...field} placeholder="Name" className={`h-10 ${FIELD_STYLE}`} /></FormControl>
                                                        <FormMessage className="text-red-400 text-xs" />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name={`documents.${index}.type`} render={({ field }) => (
                                                    <FormItem className="col-span-3">
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`h-10 ${FIELD_STYLE}`}><SelectValue /></SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                                                                {DOC_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-red-400 text-xs" />
                                                    </FormItem>
                                                )} />
                                                <div className="col-span-1 flex items-center justify-center">
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDocument(index)}
                                                        className="h-10 w-10 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {(form.watch("documents") || []).length === 0 && (
                                            <p className="text-xs text-[#6B6B75]">No supporting documents added.</p>
                                        )}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Form Actions */}
                        <div className="flex items-center gap-4 border-t border-[#1E1E22] pt-8">
                            <Button type="button" variant="outline" onClick={() => navigate("/projects")}
                                className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-8 rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}
                                className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-[#F5A623]/10">
                                <Save className="h-4 w-4" />
                                {isPending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
