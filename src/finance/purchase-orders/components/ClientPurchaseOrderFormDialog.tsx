import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { CurrencyInput } from "@/components/ui/currency-input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useClients } from "@/hooks/useClients";
import { useCreateClientPurchaseOrder, useUpdateClientPurchaseOrder } from "@/hooks/useClientPurchaseOrders";
import type { ClientPurchaseOrder } from "../clientPurchaseOrderTypes";
import { toast } from "sonner";
import { Save, Upload, FileText } from "lucide-react";

const cpoFormSchema = z.object({
    cpoNumber: z.string().min(1, "CPO number is required"),
    clientId: z.number({ required_error: "Client is required" }).min(1, "Client is required"),
    projectId: z.number().nullable().optional(),
    amount: z.number().min(0, "Amount must be >= 0"),
    currency: z.string().default("IDR"),
    ppnIncluded: z.boolean().default(true),
    issuedDate: z.string().optional(),
    receivedDate: z.string().optional(),
    validUntil: z.string().optional(),
    description: z.string().optional(),
    paymentTerms: z.string().optional(),
    attachmentUrl: z.string().optional(),
    attachmentName: z.string().optional(),
    notes: z.string().optional(),
});

type CpoFormValues = z.infer<typeof cpoFormSchema>;

interface ClientPurchaseOrderFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseOrder?: ClientPurchaseOrder | null;
    onSuccess: () => void;
}

export function ClientPurchaseOrderFormDialog({
    open,
    onOpenChange,
    purchaseOrder,
    onSuccess,
}: ClientPurchaseOrderFormDialogProps) {
    const isEdit = !!purchaseOrder;
    const { data: clients = [] } = useClients();
    const createMutation = useCreateClientPurchaseOrder();
    const updateMutation = useUpdateClientPurchaseOrder();

    const form = useForm<CpoFormValues>({
        resolver: zodResolver(cpoFormSchema),
        defaultValues: {
            cpoNumber: "",
            clientId: 0,
            projectId: null,
            amount: 0,
            currency: "IDR",
            ppnIncluded: true,
            issuedDate: new Date().toISOString().slice(0, 10),
            receivedDate: new Date().toISOString().slice(0, 10),
            validUntil: "",
            description: "",
            paymentTerms: "",
            attachmentUrl: "",
            attachmentName: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (open && isEdit && purchaseOrder) {
            form.reset({
                cpoNumber: purchaseOrder.cpoNumber,
                clientId: purchaseOrder.clientId,
                projectId: purchaseOrder.projectId,
                amount: purchaseOrder.amount,
                currency: purchaseOrder.currency || "IDR",
                ppnIncluded: purchaseOrder.ppnIncluded ?? true,
                issuedDate: purchaseOrder.issuedDate ?? "",
                receivedDate: purchaseOrder.receivedDate ?? "",
                validUntil: purchaseOrder.validUntil ?? "",
                description: purchaseOrder.description ?? "",
                paymentTerms: purchaseOrder.paymentTerms ?? "",
                attachmentUrl: purchaseOrder.attachmentUrl ?? "",
                attachmentName: purchaseOrder.attachmentName ?? "",
                notes: purchaseOrder.notes ?? "",
            });
        } else if (open && !isEdit) {
            form.reset({
                cpoNumber: "",
                clientId: 0,
                projectId: null,
                amount: 0,
                currency: "IDR",
                ppnIncluded: true,
                issuedDate: new Date().toISOString().slice(0, 10),
                receivedDate: new Date().toISOString().slice(0, 10),
                validUntil: "",
                description: "",
                paymentTerms: "",
                attachmentUrl: "",
                attachmentName: "",
                notes: "",
            });
        }
    }, [open, isEdit, purchaseOrder, form]);

    const onSubmit = (values: CpoFormValues) => {
        const payload = {
            ...values,
            clientId: values.clientId,
            projectId: values.projectId ?? undefined,
        };

        if (isEdit && purchaseOrder) {
            updateMutation.mutate(
                { id: purchaseOrder.id, input: payload },
                {
                    onSuccess: () => {
                        toast.success("PO Masuk updated");
                        onSuccess();
                        onOpenChange(false);
                    },
                    onError: (err: Error) => toast.error(err.message || "Failed to update PO Masuk"),
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("PO Masuk created");
                    onSuccess();
                    onOpenChange(false);
                },
                onError: (err: Error) => toast.error(err.message || "Failed to create PO Masuk"),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-[#111113] border-[#1E1E22] text-[#F0F0F0] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Edit PO Masuk" : "New PO Masuk"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[65vh] px-6">
                    <Form {...form}>
                        <form className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="cpoNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">CPO Number *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g. CPO/2025/001" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-11" />
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
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Client *</FormLabel>
                                            <Select
                                                value={field.value ? String(field.value) : ""}
                                                onValueChange={(v) => field.onChange(parseInt(v, 10))}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-11">
                                                        <SelectValue placeholder="Select Client" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-[#111111] border-[#1E1E22] text-[#F0F0F0]">
                                                    {clients.map((c) => (
                                                        <SelectItem key={c.id} value={String(c.id)}>
                                                            {c.companyName || c.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Amount (IDR)</FormLabel>
                                        <FormControl>
                                            <CurrencyInput
                                                prefix="Rp"
                                                name={field.name}
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                                value={field.value}
                                                onChange={(v: number) => field.onChange(v)}
                                                className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-11 font-mono"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="issuedDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Issued Date</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="bg-[#0A0A0B] border-[#1E1E22] h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="receivedDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Received Date</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="bg-[#0A0A0B] border-[#1E1E22] h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="validUntil"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Valid Until</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="bg-[#0A0A0B] border-[#1E1E22] h-11" />
                                            </FormControl>
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
                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Brief description of the PO..." className="bg-[#0A0A0B] border-[#1E1E22] min-h-[80px] resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentTerms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Payment Terms</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. NET 30" className="bg-[#0A0A0B] border-[#1E1E22] h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PDF Attachment Section */}
                            <div className="bg-[#0A0A0B] border border-[#1E1E22] rounded-2xl p-5 space-y-4">
                                <h3 className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Upload className="h-4 w-4" /> Client PO Attachment (PDF)
                                </h3>

                                <FormField
                                    control={form.control}
                                    name="attachmentUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Attachment URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="https://storage.example.com/client-po.pdf"
                                                    className="bg-[#111113] border-[#1E1E22] h-10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="attachmentName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">File Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g. PO_Client_2025.pdf"
                                                    className="bg-[#111113] border-[#1E1E22] h-10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {form.watch("attachmentUrl") && (
                                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                                        <FileText className="h-4 w-4" />
                                        {form.watch("attachmentName") || "Attached PDF"}
                                    </div>
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Notes</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Internal notes..." className="bg-[#0A0A0B] border-[#1E1E22] min-h-[60px] resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </ScrollArea>

                <DialogFooter className="p-6 pt-0 border-t border-[#1E1E22]">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-[#1E1E22] text-[#F0F0F0] hover:bg-[#2A2A2E]">
                        Cancel
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-6"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? "Update" : "Save PO Masuk"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
