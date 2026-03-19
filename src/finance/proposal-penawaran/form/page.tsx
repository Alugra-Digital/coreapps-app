import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, FileText, Save, AlertCircle, X } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { proposalPenawaranFormSchema, type ProposalPenawaranFormValues } from "../schema";
import { useCreateProposal, useUpdateProposal } from "@/hooks/useProposal";
import { useProposals } from "@/hooks/useProposal";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";
import { terbilang } from "@/lib/currency";

const defaultCoverInfo = { jobOffer: "", companyName: "", proposalMonth: "", address: "", phone: "", email: "", logoUrl: "" };
const defaultClientInfo = { clientId: "", clientName: "", contactPerson: "", email: "", phone: "", address: "" };
const defaultItem = { number: 1, description: "", quantity: 1, volume: "Unit", unitPrice: 0, totalPrice: 0 };
const defaultApproval = { place: "", date: new Date().toISOString().slice(0, 10), signerName: "", signerPosition: "Direktur", signatureUrl: "" };
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function getProposalMonthDefault(): string {
    const d = new Date();
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const FIELD_STYLE = "bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] rounded-xl focus:border-[#F5A623] transition-colors placeholder:text-[#6B6B75]";
const LABEL_STYLE = "text-[#6B6B75] text-xs font-bold uppercase tracking-wider";

export default function ProposalPenawaranFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: proposals = [] } = useProposals();
    const proposal = proposals.find((p) => p.id === id);

    const createMutation = useCreateProposal();
    const updateMutation = useUpdateProposal();
    const { data: clients = [] } = useClients();
    const [validationError, setValidationError] = useState<string | null>(null);

    const form = useForm<ProposalPenawaranFormValues>({
        resolver: zodResolver(proposalPenawaranFormSchema),
        defaultValues: {
            coverInfo: { ...defaultCoverInfo, proposalMonth: getProposalMonthDefault() },
            proposalNumber: "",
            clientInfo: defaultClientInfo,
            clientBackground: "", offeredSolution: "", workingMethod: "", timeline: "", portfolio: "",
            items: [{ ...defaultItem }],
            totalEstimatedCost: 0, totalEstimatedCostInWords: "", currency: "IDR",
            scopeOfWork: [], termsAndConditions: [], notes: "",
            documentApproval: { ...defaultApproval },
            status: "draft",
        },
    });

    const items = form.watch("items");
    const totalCost = form.watch("totalEstimatedCost");
    const setValue = form.setValue;

    useEffect(() => {
        if (totalCost > 0) {
            setValue("totalEstimatedCostInWords", terbilang(totalCost) + " Rupiah", { shouldValidate: true });
        } else {
            setValue("totalEstimatedCostInWords", "");
        }
    }, [totalCost, setValue]);

    const updateItemTotal = useCallback((index: number) => {
        const item = items[index];
        if (!item) return;
        const total = item.quantity * item.unitPrice;
        const newItems = [...items];
        newItems[index] = { ...item, number: index + 1, totalPrice: total };
        form.setValue("items", newItems);
        const sum = newItems.reduce((s, i) => s + i.totalPrice, 0);
        form.setValue("totalEstimatedCost", sum);
    }, [items, form]);

    const addItem = () => form.setValue("items", [...items, { ...defaultItem, number: items.length + 1, quantity: 1, unitPrice: 0, totalPrice: 0 }]);
    const removeItem = (index: number) => {
        if (items.length <= 1) return;
        const newItems = items.filter((_, i) => i !== index).map((it, i) => ({ ...it, number: i + 1 }));
        form.setValue("items", newItems);
        form.setValue("totalEstimatedCost", newItems.reduce((s, i) => s + i.totalPrice, 0));
    };

    const scopeItems = form.watch("scopeOfWork") || [];
    const termItems = form.watch("termsAndConditions") || [];

    const addScopeItem = () => form.setValue("scopeOfWork", [...scopeItems, ""]);
    const updateScopeItem = (i: number, v: string) => { const next = [...scopeItems]; next[i] = v; form.setValue("scopeOfWork", next); };
    const removeScopeItem = (i: number) => form.setValue("scopeOfWork", scopeItems.filter((_, idx) => idx !== i));
    const addTermItem = () => form.setValue("termsAndConditions", [...termItems, ""]);
    const updateTermItem = (i: number, v: string) => { const next = [...termItems]; next[i] = v; form.setValue("termsAndConditions", next); };
    const removeTermItem = (i: number) => form.setValue("termsAndConditions", termItems.filter((_, idx) => idx !== i));

    useEffect(() => {
        if (proposal) {
            form.reset({
                coverInfo: { ...defaultCoverInfo, ...proposal.coverInfo },
                proposalNumber: proposal.proposalNumber,
                clientInfo: { ...defaultClientInfo, ...proposal.clientInfo, clientId: proposal.clientInfo.clientId ?? "" },
                clientBackground: proposal.clientBackground ?? "",
                offeredSolution: proposal.offeredSolution ?? "",
                workingMethod: proposal.workingMethod ?? "",
                timeline: proposal.timeline ?? "",
                portfolio: proposal.portfolio ?? "",
                items: proposal.items.map((i, idx) => ({ ...i, number: idx + 1 })),
                totalEstimatedCost: proposal.totalEstimatedCost,
                totalEstimatedCostInWords: proposal.totalEstimatedCostInWords,
                currency: proposal.currency,
                scopeOfWork: proposal.scopeOfWork,
                termsAndConditions: proposal.termsAndConditions,
                notes: proposal.notes ?? "",
                documentApproval: { ...proposal.documentApproval, signatureUrl: proposal.documentApproval.signatureUrl ?? "" },
                status: proposal.status,
            });
        }
    }, [proposal, form]);

    const onSubmit = (values: ProposalPenawaranFormValues) => {
        setValidationError(null);
        const payload = {
            coverInfo: values.coverInfo,
            proposalNumber: values.proposalNumber,
            clientInfo: { ...values.clientInfo, clientId: values.clientInfo.clientId || undefined },
            clientBackground: values.clientBackground || undefined,
            offeredSolution: values.offeredSolution || undefined,
            workingMethod: values.workingMethod || undefined,
            timeline: values.timeline || undefined,
            portfolio: values.portfolio || undefined,
            items: values.items.map((item, i) => ({ ...item, number: i + 1, totalPrice: item.quantity * item.unitPrice })),
            totalEstimatedCost: values.totalEstimatedCost,
            totalEstimatedCostInWords: values.totalEstimatedCostInWords,
            currency: values.currency,
            scopeOfWork: values.scopeOfWork.filter(Boolean),
            termsAndConditions: values.termsAndConditions.filter(Boolean),
            notes: values.notes || undefined,
            documentApproval: values.documentApproval,
            status: values.status,
        };

        const handleSuccess = () => {
            toast.success(isEdit ? "Proposal updated successfully" : "Proposal created successfully");
            navigate("/finance/proposal-penawaran");
        };

        if (isEdit && proposal) {
            updateMutation.mutate({ id: proposal.id, input: payload }, {
                onSuccess: (data) => { if (data === null) toast.error("Failed to update proposal"); else handleSuccess(); },
                onError: () => toast.error("Failed to update proposal"),
            });
        } else {
            createMutation.mutate(payload, { onSuccess: handleSuccess, onError: () => toast.error("Failed to create proposal") });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link to="/finance/proposal-penawaran" className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm w-fit">
                        <ArrowLeft className="h-4 w-4" /> Back to Proposals
                    </Link>
                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-xl flex items-center justify-center">
                                <FileText className="h-6 w-6 text-[#F5A623]" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">
                                    {isEdit ? "Edit Proposal" : "New Proposal Penawaran"}
                                </h1>
                                <p className="text-[#6B6B75] text-sm font-medium">
                                    {isEdit ? `Editing ${proposal?.proposalNumber ?? "..."}` : "Create a new business proposal document"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {validationError && (
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-400 relative">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-xs font-semibold">Field wajib belum diisi</AlertTitle>
                        <AlertDescription className="text-xs">{validationError}</AlertDescription>
                        <button type="button" className="absolute right-3 top-3 text-red-400 hover:opacity-70" onClick={() => setValidationError(null)}>
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        const tabMap: Record<string, string> = {
                            coverInfo: "Cover", proposalNumber: "Content & Client", clientInfo: "Content & Client", status: "Content & Client",
                            items: "Items", totalEstimatedCost: "Items", totalEstimatedCostInWords: "Items", currency: "Items",
                            scopeOfWork: "Scope & Terms", termsAndConditions: "Scope & Terms", notes: "Scope & Terms", documentApproval: "Approval",
                        };
                        const errorTabs = [...new Set(Object.keys(errors).map((f) => tabMap[f] ?? f))];
                        setValidationError(`Mohon lengkapi field wajib di tab: ${errorTabs.join(", ")}`);
                    })} className="space-y-8">
                        <Tabs defaultValue="cover">
                            <TabsList className="bg-[#111113] border border-[#1E1E22] p-1 rounded-xl h-auto flex flex-wrap gap-1">
                                {["cover", "content", "items", "scope", "approval"].map((tab) => (
                                    <TabsTrigger key={tab} value={tab} className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-black text-[#6B6B75] font-semibold text-xs capitalize rounded-lg px-4 py-2 transition-all">
                                        {tab === "cover" ? "Cover" : tab === "content" ? "Content & Client" : tab === "items" ? "Penawaran Items" : tab === "scope" ? "Scope & Terms" : "Approval"}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* COVER TAB */}
                            <TabsContent value="cover" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6 rounded-2xl">
                                    <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Cover Information</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { name: "coverInfo.jobOffer" as const, label: "Penawaran Pekerjaan/Jasa", placeholder: "Sistem Informasi Manajemen" },
                                            { name: "coverInfo.companyName" as const, label: "Nama Perusahaan", placeholder: "PT Solusi Digital" },
                                            { name: "coverInfo.proposalMonth" as const, label: "Bulan Proposal", placeholder: "Januari 2025" },
                                            { name: "coverInfo.phone" as const, label: "No. Telepon", placeholder: "+62 21 1234 5678" },
                                            { name: "coverInfo.email" as const, label: "Email", placeholder: "info@company.com" },
                                            { name: "coverInfo.logoUrl" as const, label: "Logo URL", placeholder: "https://..." },
                                        ].map(({ name, label, placeholder }) => (
                                            <FormField key={name} control={form.control} name={name} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={LABEL_STYLE}>{label}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder={placeholder} className={`h-12 ${FIELD_STYLE}`} />
                                                    </FormControl>
                                                    <FormMessage className="text-red-400 text-xs" />
                                                </FormItem>
                                            )} />
                                        ))}
                                        <FormField control={form.control} name="coverInfo.address" render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className={LABEL_STYLE}>Alamat</FormLabel>
                                                <FormControl><Textarea {...field} rows={3} className={`resize-none ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* CONTENT & CLIENT TAB */}
                            <TabsContent value="content" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6 rounded-2xl">
                                    <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Proposal & Client</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="proposalNumber" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Nomor Proposal</FormLabel>
                                                <FormControl><Input {...field} placeholder="PP/MIT/0125/0002" className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="status" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Status</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className={`h-12 ${FIELD_STYLE}`}><SelectValue /></SelectTrigger>
                                                    <SelectContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                                                        {["draft", "sent", "accepted", "rejected"].map(s => (
                                                            <SelectItem key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="clientInfo.clientId" render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className={LABEL_STYLE}>Client (Opsional)</FormLabel>
                                                <FormControl>
                                                    <EntityCombobox
                                                        items={clients.map((c) => ({ id: c.id, label: c.companyName || c.name }))}
                                                        value={field.value || ""}
                                                        onValueChange={(v) => {
                                                            field.onChange(v);
                                                            const client = clients.find((c) => c.id === v);
                                                            if (client) form.setValue("clientInfo.clientName", client.companyName || client.name);
                                                        }}
                                                        placeholder="Pilih client..." searchPlaceholder="Cari client..." emptyText="Tidak ada client." allowEmpty
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        {[
                                            { name: "clientInfo.clientName" as const, label: "Nama Client", placeholder: "PT Client Utama" },
                                            { name: "clientInfo.contactPerson" as const, label: "Contact Person", placeholder: "Budi Santoso" },
                                            { name: "clientInfo.email" as const, label: "Email Client", placeholder: "client@email.com" },
                                            { name: "clientInfo.phone" as const, label: "No. Telepon Client", placeholder: "+62 812 3456 7890" },
                                        ].map(({ name, label, placeholder }) => (
                                            <FormField key={name} control={form.control} name={name} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={LABEL_STYLE}>{label}</FormLabel>
                                                    <FormControl><Input {...field} placeholder={placeholder} className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                    <FormMessage className="text-red-400 text-xs" />
                                                </FormItem>
                                            )} />
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ITEMS TAB */}
                            <TabsContent value="items" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6 rounded-2xl">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Detail Penawaran</p>
                                        <Button type="button" variant="outline" size="sm" onClick={addItem}
                                            className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 rounded-xl h-9">
                                            <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        {items.map((_, index) => (
                                            <div key={index} className="p-5 bg-[#0A0A0B] border border-[#1E1E22] rounded-xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-[#6B6B75] uppercase tracking-wider">Item #{index + 1}</span>
                                                    <Button type="button" variant="ghost" size="icon" disabled={items.length <= 1}
                                                        onClick={() => removeItem(index)} className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                                <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={LABEL_STYLE}>Deskripsi</FormLabel>
                                                        <FormControl><Input {...field} placeholder="Deskripsi layanan..." className={`h-11 ${FIELD_STYLE}`} /></FormControl>
                                                        <FormMessage className="text-red-400 text-xs" />
                                                    </FormItem>
                                                )} />
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={LABEL_STYLE}>Qty</FormLabel>
                                                            <FormControl>
                                                                <CurrencyInput prefix="" {...field} value={field.value} onChange={(v: number) => { field.onChange(v); setTimeout(() => updateItemTotal(index), 0); }} className={`h-11 ${FIELD_STYLE}`} />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400 text-xs" />
                                                        </FormItem>
                                                    )} />
                                                    <FormField control={form.control} name={`items.${index}.volume`} render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={LABEL_STYLE}>Volume/Unit</FormLabel>
                                                            <FormControl><Input {...field} placeholder="Unit" className={`h-11 ${FIELD_STYLE}`} /></FormControl>
                                                            <FormMessage className="text-red-400 text-xs" />
                                                        </FormItem>
                                                    )} />
                                                    <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={LABEL_STYLE}>Harga Satuan</FormLabel>
                                                            <FormControl>
                                                                <CurrencyInput prefix="Rp" placeholder="0" value={field.value} onChange={(v: number) => { field.onChange(v); setTimeout(() => updateItemTotal(index), 0); }} className={`h-11 ${FIELD_STYLE}`} />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400 text-xs" />
                                                        </FormItem>
                                                    )} />
                                                    <div>
                                                        <p className={`${LABEL_STYLE} mb-2`}>Total</p>
                                                        <div className="h-11 flex items-center px-3 bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-xl">
                                                            <span className="text-[#F5A623] font-bold text-sm">
                                                                {new Intl.NumberFormat("id-ID").format(items[index]?.totalPrice ?? 0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1E1E22]">
                                        <FormField control={form.control} name="currency" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Kurs</FormLabel>
                                                <FormControl><Input {...field} className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="totalEstimatedCost" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={LABEL_STYLE}>Total Estimasi Biaya</FormLabel>
                                                <FormControl>
                                                    <CurrencyInput prefix="Rp" value={field.value} onChange={field.onChange} className={`h-12 ${FIELD_STYLE}`} />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="totalEstimatedCostInWords" render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className={LABEL_STYLE}>Terbilang</FormLabel>
                                                <FormControl><Input {...field} readOnly className={`h-12 ${FIELD_STYLE} opacity-60 cursor-not-allowed`} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* SCOPE & TERMS TAB */}
                            <TabsContent value="scope" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 rounded-2xl">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Lingkup Pekerjaan</p>
                                            <Button type="button" variant="outline" size="sm" onClick={addScopeItem} className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 rounded-xl h-9">
                                                <Plus className="h-3.5 w-3.5 mr-1" /> Add
                                            </Button>
                                        </div>
                                        {scopeItems.length === 0 ? (
                                            <p className="text-xs text-[#6B6B75]">Belum ada lingkup pekerjaan.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {scopeItems.map((val, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <Input value={val} onChange={(e) => updateScopeItem(i, e.target.value)} placeholder="Lingkup pekerjaan..." className={`h-11 flex-1 ${FIELD_STYLE}`} />
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeScopeItem(i)} className="h-11 w-11 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl shrink-0">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-[#1E1E22]">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Syarat dan Kondisi</p>
                                            <Button type="button" variant="outline" size="sm" onClick={addTermItem} className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 rounded-xl h-9">
                                                <Plus className="h-3.5 w-3.5 mr-1" /> Add
                                            </Button>
                                        </div>
                                        {termItems.length === 0 ? (
                                            <p className="text-xs text-[#6B6B75]">Belum ada syarat dan kondisi.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {termItems.map((val, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <Input value={val} onChange={(e) => updateTermItem(i, e.target.value)} placeholder="Syarat dan kondisi..." className={`h-11 flex-1 ${FIELD_STYLE}`} />
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTermItem(i)} className="h-11 w-11 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl shrink-0">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <FormField control={form.control} name="notes" render={({ field }) => (
                                        <FormItem className="pt-4 border-t border-[#1E1E22]">
                                            <FormLabel className={LABEL_STYLE}>Notes</FormLabel>
                                            <FormControl><Textarea {...field} rows={4} className={`resize-none ${FIELD_STYLE}`} /></FormControl>
                                            <FormMessage className="text-red-400 text-xs" />
                                        </FormItem>
                                    )} />
                                </Card>
                            </TabsContent>

                            {/* APPROVAL TAB */}
                            <TabsContent value="approval" className="mt-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6 rounded-2xl">
                                    <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Document Approval</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { name: "documentApproval.place" as const, label: "Tempat", placeholder: "Jakarta", type: "text" },
                                            { name: "documentApproval.date" as const, label: "Tanggal", placeholder: "", type: "date" },
                                            { name: "documentApproval.signerName" as const, label: "Nama Penandatangan", placeholder: "Budi Santoso", type: "text" },
                                            { name: "documentApproval.signerPosition" as const, label: "Jabatan", placeholder: "Direktur", type: "text" },
                                            { name: "documentApproval.signatureUrl" as const, label: "TTD (Signature URL)", placeholder: "https://...", type: "text" },
                                        ].map(({ name, label, placeholder, type }) => (
                                            <FormField key={name} control={form.control} name={name} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={LABEL_STYLE}>{label}</FormLabel>
                                                    <FormControl><Input type={type} {...field} placeholder={placeholder} className={`h-12 ${FIELD_STYLE}`} /></FormControl>
                                                    <FormMessage className="text-red-400 text-xs" />
                                                </FormItem>
                                            )} />
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Form Actions */}
                        <div className="flex items-center gap-4 border-t border-[#1E1E22] pt-8">
                            <Button type="button" variant="outline" onClick={() => navigate("/finance/proposal-penawaran")}
                                className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-8 rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}
                                className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-[#F5A623]/10">
                                <Save className="h-4 w-4" />
                                {isPending ? "Saving..." : isEdit ? "Update Proposal" : "Create Proposal"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
