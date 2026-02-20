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
import {
  proposalPenawaranFormSchema,
  type ProposalPenawaranFormValues,
} from "../schema";
import { createProposal, updateProposal } from "@/api/proposal-penawaran";
import { getClients } from "@/api/clients";
import type { Client } from "@/api/clients";
import type { ProposalPenawaran } from "../types";

interface ProposalPenawaranFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal?: ProposalPenawaran;
  onSuccess: () => void;
}

const defaultCoverInfo = {
  jobOffer: "",
  companyName: "",
  proposalMonth: "",
  address: "",
  phone: "",
  email: "",
  logoUrl: "",
};

const defaultClientInfo = {
  clientId: "",
  clientName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
};

const defaultItem = {
  number: 1,
  description: "",
  quantity: 1,
  volume: "Unit",
  unitPrice: 0,
  totalPrice: 0,
};

const defaultApproval = {
  place: "",
  date: new Date().toISOString().slice(0, 10),
  signerName: "",
  signerPosition: "Direktur",
  signatureUrl: "",
};

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function getProposalMonthDefault(): string {
  const d = new Date();
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function ProposalPenawaranFormDialog({
  open,
  onOpenChange,
  proposal,
  onSuccess,
}: ProposalPenawaranFormDialogProps) {
  const isEdit = !!proposal;
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (open) {
      getClients().then(setClients);
    }
  }, [open]);

  const form = useForm<ProposalPenawaranFormValues>({
    resolver: zodResolver(proposalPenawaranFormSchema),
    defaultValues: {
      coverInfo: { ...defaultCoverInfo, proposalMonth: getProposalMonthDefault() },
      proposalNumber: "",
      clientInfo: defaultClientInfo,
      clientBackground: "",
      offeredSolution: "",
      workingMethod: "",
      timeline: "",
      portfolio: "",
      items: [{ ...defaultItem }],
      totalEstimatedCost: 0,
      totalEstimatedCostInWords: "",
      currency: "IDR",
      scopeOfWork: [],
      termsAndConditions: [],
      notes: "",
      documentApproval: { ...defaultApproval, date: new Date().toISOString().slice(0, 10) },
      status: "draft",
    },
  });

  const items = form.watch("items");

  const updateItemTotal = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      const total = item.quantity * item.unitPrice;
      const newItems = [...items];
      newItems[index] = { ...item, number: index + 1, totalPrice: total };
      form.setValue("items", newItems);
      const sum = newItems.reduce((s, i) => s + i.totalPrice, 0);
      form.setValue("totalEstimatedCost", sum);
    },
    [items, form]
  );

  const addItem = () => {
    const newItem = {
      ...defaultItem,
      number: items.length + 1,
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    form.setValue("items", [...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    newItems.forEach((item, i) => {
      item.number = i + 1;
    });
    form.setValue("items", newItems);
    const sum = newItems.reduce((s, i) => s + i.totalPrice, 0);
    form.setValue("totalEstimatedCost", sum);
  };

  const addScopeItem = () => {
    const current = form.getValues("scopeOfWork") || [];
    form.setValue("scopeOfWork", [...current, ""]);
  };

  const updateScopeItem = (index: number, value: string) => {
    const current = form.getValues("scopeOfWork") || [];
    const next = [...current];
    next[index] = value;
    form.setValue("scopeOfWork", next);
  };

  const removeScopeItem = (index: number) => {
    const current = form.getValues("scopeOfWork") || [];
    form.setValue("scopeOfWork", current.filter((_, i) => i !== index));
  };

  const addTermItem = () => {
    const current = form.getValues("termsAndConditions") || [];
    form.setValue("termsAndConditions", [...current, ""]);
  };

  const updateTermItem = (index: number, value: string) => {
    const current = form.getValues("termsAndConditions") || [];
    const next = [...current];
    next[index] = value;
    form.setValue("termsAndConditions", next);
  };

  const removeTermItem = (index: number) => {
    const current = form.getValues("termsAndConditions") || [];
    form.setValue("termsAndConditions", current.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (proposal) {
      form.reset({
        coverInfo: { ...defaultCoverInfo, ...proposal.coverInfo },
        proposalNumber: proposal.proposalNumber,
        clientInfo: {
          ...defaultClientInfo,
          ...proposal.clientInfo,
          clientId: proposal.clientInfo.clientId ?? "",
        },
        clientBackground: proposal.clientBackground ?? "",
        offeredSolution: proposal.offeredSolution ?? "",
        workingMethod: proposal.workingMethod ?? "",
        timeline: proposal.timeline ?? "",
        portfolio: proposal.portfolio ?? "",
        items: proposal.items.map((i, idx) => ({ ...i, number: idx + 1 })),
        totalEstimatedCost: proposal.totalEstimatedCost,
        totalEstimatedCostInWords: proposal.totalEstimatedCostInWords,
        currency: proposal.currency,
        scopeOfWork: proposal.scopeOfWork.length > 0 ? proposal.scopeOfWork : [],
        termsAndConditions: proposal.termsAndConditions.length > 0 ? proposal.termsAndConditions : [],
        notes: proposal.notes ?? "",
        documentApproval: {
          ...proposal.documentApproval,
          signatureUrl: proposal.documentApproval.signatureUrl ?? "",
        },
        status: proposal.status,
      });
    } else if (open) {
      form.reset({
        coverInfo: { ...defaultCoverInfo, proposalMonth: getProposalMonthDefault() },
        proposalNumber: "",
        clientInfo: defaultClientInfo,
        clientBackground: "",
        offeredSolution: "",
        workingMethod: "",
        timeline: "",
        portfolio: "",
        items: [{ ...defaultItem }],
        totalEstimatedCost: 0,
        totalEstimatedCostInWords: "",
        currency: "IDR",
        scopeOfWork: [],
        termsAndConditions: [],
        notes: "",
        documentApproval: { ...defaultApproval, date: new Date().toISOString().slice(0, 10) },
        status: "draft",
      });
    }
  }, [proposal, open, form]);

  const onSubmit = async (values: ProposalPenawaranFormValues) => {
    const payload = {
      coverInfo: values.coverInfo,
      proposalNumber: values.proposalNumber,
      clientInfo: {
        ...values.clientInfo,
        clientId: values.clientInfo.clientId || undefined,
      },
      clientBackground: values.clientBackground || undefined,
      offeredSolution: values.offeredSolution || undefined,
      workingMethod: values.workingMethod || undefined,
      timeline: values.timeline || undefined,
      portfolio: values.portfolio || undefined,
      items: values.items.map((item, i) => ({
        ...item,
        number: i + 1,
        totalPrice: item.quantity * item.unitPrice,
      })),
      totalEstimatedCost: values.totalEstimatedCost,
      totalEstimatedCostInWords: values.totalEstimatedCostInWords,
      currency: values.currency,
      scopeOfWork: values.scopeOfWork.filter(Boolean),
      termsAndConditions: values.termsAndConditions.filter(Boolean),
      notes: values.notes || undefined,
      documentApproval: values.documentApproval,
      status: values.status,
    };

    if (isEdit && proposal) {
      await updateProposal(proposal.id, payload);
    } else {
      await createProposal(payload);
    }
    onSuccess();
  };

  const scopeItems = form.watch("scopeOfWork") || [];
  const termItems = form.watch("termsAndConditions") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>
            {isEdit ? "Edit Proposal Penawaran" : "Add Proposal Penawaran"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <Tabs defaultValue="cover" className="flex-1 flex flex-col gap-4 overflow-hidden">
              <TabsList className="mx-6 px-2 flex gap-1 shrink-0 flex-wrap">
                <TabsTrigger value="cover" className="text-xs px-2 py-1.5">Cover</TabsTrigger>
                <TabsTrigger value="content" className="text-xs px-2 py-1.5">Content & Client</TabsTrigger>
                <TabsTrigger value="items" className="text-xs px-2 py-1.5">Items</TabsTrigger>
                <TabsTrigger value="scope" className="text-xs px-2 py-1.5">Scope & Terms</TabsTrigger>
                <TabsTrigger value="approval" className="text-xs px-2 py-1.5">Approval</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-6 pb-4">
                <TabsContent value="cover" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="coverInfo.jobOffer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Penawaran Pekerjaan/Jasa</FormLabel>
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
                    name="coverInfo.proposalMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Bulan Proposal</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Januari 2025" className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">Alamat</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="coverInfo.email"
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
                  <FormField
                    control={form.control}
                    name="coverInfo.logoUrl"
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
                </TabsContent>

                <TabsContent value="content" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="proposalNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nomor Proposal</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="PP/MIT/0125/0002" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientInfo.clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Client (Opsional)</FormLabel>
                        <Select
                          value={field.value || "none"}
                          onValueChange={(v) => {
                            field.onChange(v === "none" ? "" : v);
                            const client = clients.find((c) => c.id === v);
                            if (client) {
                              form.setValue("clientInfo.clientName", client.name);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Pilih client..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">-- Manual --</SelectItem>
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
                    name="clientInfo.clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Client</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientInfo.contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Contact Person</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Email Client</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No. Telepon Client</FormLabel>
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
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="items" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs">Detail Penawaran Pekerjaan/Jasa</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={addItem}>
                      <Plus className="h-3 w-3" /> Add Row
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {items.map((_, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 p-2 rounded border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5"
                      >
                        <div className="col-span-12 font-medium text-xs text-slate-600 dark:text-slate-400">
                          Item #{index + 1}
                        </div>
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="col-span-12">
                              <FormControl>
                                <Input {...field} placeholder="Deskripsi" className="h-8 text-sm" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
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
                                    setTimeout(() => updateItemTotal(index), 0);
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
                          name={`items.${index}.volume`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input {...field} placeholder="Volume" className="h-8 text-sm" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
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
                                    setTimeout(() => updateItemTotal(index), 0);
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
                            {new Intl.NumberFormat("id-ID").format(items[index]?.totalPrice ?? 0)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600"
                            onClick={() => removeItem(index)}
                            disabled={items.length <= 1}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormField
                    control={form.control}
                    name="totalEstimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Total Estimasi Biaya</FormLabel>
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
                    name="totalEstimatedCostInWords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Total Dalam Kata</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Satu Milyar Dua Ratus Juta Rupiah" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Kurs</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="scope" className="mt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs">Lingkup Pekerjaan</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={addScopeItem}>
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {scopeItems.length === 0 ? (
                      <p className="text-xs text-slate-500">No scope items. Click Add to add.</p>
                    ) : (
                      scopeItems.map((val, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={val}
                            onChange={(e) => updateScopeItem(i, e.target.value)}
                            placeholder="Lingkup pekerjaan..."
                            className="h-9 text-sm flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-500 shrink-0"
                            onClick={() => removeScopeItem(i)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <FormLabel className="text-xs">Syarat dan Kondisi</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={addTermItem}>
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {termItems.length === 0 ? (
                      <p className="text-xs text-slate-500">No terms. Click Add to add.</p>
                    ) : (
                      termItems.map((val, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={val}
                            onChange={(e) => updateTermItem(i, e.target.value)}
                            placeholder="Syarat dan kondisi..."
                            className="h-9 text-sm flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-500 shrink-0"
                            onClick={() => removeTermItem(i)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Notes</FormLabel>
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
                    name="documentApproval.place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tempat</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Jakarta" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentApproval.date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tanggal</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentApproval.signerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Penandatangan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentApproval.signerPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Jabatan</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Direktur" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentApproval.signatureUrl"
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
