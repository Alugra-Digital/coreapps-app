import { useEffect, useState, useCallback } from "react";
import { useForm, type Resolver, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Building2,
    Calendar,
    User,
    CreditCard,
    CheckCircle2,
    Info,
    AlertCircle,
    FileText
} from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    purchaseOrderFormSchema,
    PO_STATUSES,
    type PurchaseOrderFormValues
} from "../schema";
import {
    usePurchaseOrders,
    usePurchaseOrderById,
    useCreatePurchaseOrder,
    useUpdatePurchaseOrder
} from "@/hooks/usePurchaseOrders";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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

export default function PurchaseOrderFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: purchaseOrders = [] } = usePurchaseOrders();
    const { data: purchaseOrderById } = usePurchaseOrderById(isEdit ? id : undefined);
    // Prefer direct fetch by ID; fall back to list lookup for backward compat
    const purchaseOrder = purchaseOrderById ?? purchaseOrders.find(po => po.id === id || po.id === String(id));
    const { data: clients = [] } = useClients();

    const [formError, setFormError] = useState<string | null>(null);
    const createMutation = useCreatePurchaseOrder();
    const updateMutation = useUpdatePurchaseOrder();

    const form = useForm<PurchaseOrderFormValues>({
        resolver: zodResolver(purchaseOrderFormSchema) as Resolver<PurchaseOrderFormValues>,
        defaultValues: {
            status: 'DRAFT',
            clientId: null,
            companyInfo: defaultCompanyInfo,
            orderInfo: defaultOrderInfo,
            vendorInfo: defaultVendorInfo,
            lineItems: [{ ...defaultLineItem }],
            paymentProcedure: "",
            otherTerms: "",
            approval: defaultApproval,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lineItems",
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

            form.setValue(`lineItems.${index}.subtotal`, subtotal);
            form.setValue(`lineItems.${index}.taxAmount`, taxAmount);
            form.setValue(`lineItems.${index}.priceAfterTax`, priceAfterTax);
        },
        [lineItems, form]
    );

    useEffect(() => {
        if (isEdit && purchaseOrder) {
            form.reset({
                status: purchaseOrder.status ?? 'DRAFT',
                clientId: purchaseOrder.clientId ?? null,
                companyInfo: {
                    ...defaultCompanyInfo,
                    ...(purchaseOrder.companyInfo ?? {}),
                    logoUrl: purchaseOrder.companyInfo?.logoUrl ?? "",
                },
                orderInfo: {
                    ...defaultOrderInfo,
                    ...(purchaseOrder.orderInfo ?? {}),
                },
                vendorInfo: {
                    ...defaultVendorInfo,
                    vendorName: purchaseOrder.vendorInfo?.vendorName ?? "",
                    phone: purchaseOrder.vendorInfo?.phone ?? "",
                    pic: {
                        name: purchaseOrder.vendorInfo?.pic?.name ?? "",
                        position: purchaseOrder.vendorInfo?.pic?.position ?? "",
                        contact: purchaseOrder.vendorInfo?.pic?.contact ?? "",
                    },
                },
                lineItems: (purchaseOrder.lineItems ?? []).map((li) => ({
                    ...li,
                    taxRate: li.taxRate ?? 11,
                })),
                paymentProcedure: purchaseOrder.paymentProcedure ?? "",
                otherTerms: purchaseOrder.otherTerms ?? "",
                approval: {
                    ...defaultApproval,
                    ...(purchaseOrder.approval ?? {}),
                    signatureUrl: purchaseOrder.approval?.signatureUrl ?? "",
                },
            });
        }
    }, [purchaseOrder, isEdit, form]);

    const onSubmit = (values: PurchaseOrderFormValues) => {
        const payload = {
            ...(isEdit && values.status ? { status: values.status } : {}),
            clientId: values.clientId ?? undefined,
            companyInfo: values.companyInfo,
            orderInfo: values.orderInfo,
            vendorInfo: {
                vendorName: values.vendorInfo?.vendorName ?? "",
                phone: values.vendorInfo?.phone ?? "",
                pic: values.vendorInfo?.pic ?? { name: "", position: "", contact: "" },
            },
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

        if (isEdit) {
            updateMutation.mutate(
                { id: id!, input: payload },
                {
                    onSuccess: () => {
                        toast.success("Purchase order updated successfully");
                        navigate(`/finance/purchase-orders/${id}`);
                    },
                    onError: (err: Error) => {
                        const msg = err.message || "Failed to update purchase order";
                        setFormError(msg);
                        toast.error(msg);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Purchase order created successfully");
                    navigate("/finance/purchase-orders");
                },
                onError: (err: Error) => {
                    const msg = err.message || "Failed to create purchase order";
                    setFormError(msg);
                    toast.error(msg);
                },
            });
        }
    };

    const handleClickUpdate = () => {
        form.handleSubmit(onSubmit, (errors) => {
            // Surface the first validation error as a toast so user knows why nothing happened
            const firstError = Object.values(errors).flatMap(e =>
                typeof e === 'object' && e !== null && 'message' in e
                    ? [(e as { message: string }).message]
                    : Object.values(e as object).map((v: unknown) => (v as { message?: string })?.message).filter(Boolean)
            )[0];
            if (firstError) {
                toast.error(`Validation: ${firstError}`);
                setFormError(String(firstError));
            }
        })();
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link
                            to={isEdit ? `/finance/purchase-orders/${id}` : "/finance/purchase-orders"}
                            className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> {isEdit ? "Back to Detail" : "Back to List"}
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEdit ? "Edit Purchase Order" : "New Purchase Order"}
                        </h1>
                        <p className="text-[#6B6B75] text-sm font-medium">
                            {isEdit ? `Update details for PO ${purchaseOrder?.orderInfo.poNumber}` : "Create a new purchasing document for your vendors."}
                        </p>
                    </div>
                    <Button
                        onClick={handleClickUpdate}
                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-8 h-12 shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? "Update Document" : "Issue Purchase Order"}
                    </Button>
                </div>

                {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5" />
                        {formError}
                    </div>
                )}

                <Form {...form}>
                    <form className="space-y-8">
                        <Tabs defaultValue="order" className="w-full">
                            <TabsList className="bg-[#111113] border border-[#1E1E22] p-1 h-14 rounded-2xl w-full justify-start gap-2 px-4 shadow-xl">
                                <TabsTrigger value="order" className="data-[state=active]:bg-[#0A0A0B] data-[state=active]:text-[#F5A623] rounded-xl px-6 h-10 transition-all">
                                    <Calendar className="h-4 w-4 mr-2" /> Order Info
                                </TabsTrigger>
                                <TabsTrigger value="company" className="data-[state=active]:bg-[#0A0A0B] data-[state=active]:text-[#F5A623] rounded-xl px-6 h-10 transition-all">
                                    <Building2 className="h-4 w-4 mr-2" /> Company
                                </TabsTrigger>
                                <TabsTrigger value="vendor" className="data-[state=active]:bg-[#0A0A0B] data-[state=active]:text-[#F5A623] rounded-xl px-6 h-10 transition-all">
                                    <User className="h-4 w-4 mr-2" /> Vendor
                                </TabsTrigger>
                                <TabsTrigger value="items" className="data-[state=active]:bg-[#0A0A0B] data-[state=active]:text-[#F5A623] rounded-xl px-6 h-10 transition-all">
                                    <FileText className="h-4 w-4 mr-2" /> Line Items
                                </TabsTrigger>
                                <TabsTrigger value="terms" className="data-[state=active]:bg-[#0A0A0B] data-[state=active]:text-[#F5A623] rounded-xl px-6 h-10 transition-all">
                                    <CreditCard className="h-4 w-4 mr-2" /> Terms & Approval
                                </TabsTrigger>
                            </TabsList>

                            {/* Order Info Tab */}
                            <TabsContent value="order" className="mt-8">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 shadow-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="h-4 w-4 text-[#F5A623]" />
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Order Identification</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField
                                            control={form.control}
                                            name="orderInfo.poNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">PO Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="e.g. PO/2023/001" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="orderInfo.poDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Issue Date</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="date" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
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
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Document Reference</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="e.g. Proposal #882" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* Company Tab */}
                            <TabsContent value="company" className="mt-8">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 shadow-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className="h-4 w-4 text-[#F5A623]" />
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Sender Entity Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField
                                            control={form.control}
                                            name="companyInfo.companyName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Company Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
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
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Office Phone</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="companyInfo.letterhead"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Letterhead Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="e.g. PT Artha Solusi Mandiri" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
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
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Full Address</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] min-h-[100px] resize-none" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* Vendor Tab */}
                            <TabsContent value="vendor" className="mt-8">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 shadow-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-[#F5A623]" />
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Vendor Selection & Details</h2>
                                    </div>

                                    <div className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="clientId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Select Existing Client (Optional)</FormLabel>
                                                    <Select
                                                        value={field.value != null ? String(field.value) : "__manual__"}
                                                        onValueChange={(v) => {
                                                            const idVal = v && v !== "__manual__" ? parseInt(v, 10) : null;
                                                            field.onChange(idVal);
                                                            if (idVal) {
                                                                const c = clients.find((x) => String(x.id).includes(String(idVal)));
                                                                if (c) {
                                                                    form.setValue("vendorInfo.vendorName", c.companyName ?? c.name ?? "");
                                                                    form.setValue("vendorInfo.phone", c.phone ?? "");
                                                                    form.setValue("vendorInfo.pic.name", c.pic?.name ?? "");
                                                                    form.setValue("vendorInfo.pic.position", c.pic?.position ?? "");
                                                                    form.setValue("vendorInfo.pic.contact", c.pic?.contact ?? "");
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12">
                                                                <SelectValue placeholder="Autofill from Client List" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-[#111111] border-[#1E1E22] text-[#F0F0F0]">
                                                            <SelectItem value="__manual__">Manual Input Only</SelectItem>
                                                            {clients.map((c) => (
                                                                <SelectItem key={String(c.id)} value={String(c.id).replace(/\D/g, '') || String(c.id)}>
                                                                    {c.companyName || c.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator className="bg-[#1E1E22]" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="vendorInfo.vendorName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Vendor Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
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
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Vendor Phone</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="bg-[#0A0A0B] border border-[#1E1E22] rounded-2xl p-6 space-y-6">
                                            <h3 className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em] mb-4">Vendor PIC Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="vendorInfo.pic.name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Contact Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="bg-[#111113] border-[#1E1E22] focus:border-[#F5A623] h-10 text-sm" />
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
                                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Position</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="bg-[#111113] border-[#1E1E22] focus:border-[#F5A623] h-10 text-sm" />
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
                                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Mobile/Email</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="bg-[#111113] border-[#1E1E22] focus:border-[#F5A623] h-10 text-sm" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* Line Items Tab */}
                            <TabsContent value="items" className="mt-8">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 shadow-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-[#F5A623]" />
                                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Line Item Breakdown</h2>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ ...defaultLineItem, number: fields.length + 1 })}
                                            className="border-[#F5A623]/20 text-[#F5A623] hover:bg-[#F5A623]/10"
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Add New Row
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="relative group bg-[#0A0A0B] border border-[#1E1E22] rounded-2xl p-6 transition-all hover:border-[#F5A623]/30">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Item #{index + 1}</span>
                                                    {fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => remove(index)}
                                                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-12 gap-6">
                                                    <div className="col-span-12 md:col-span-6">
                                                        <FormField
                                                            control={form.control}
                                                            name={`lineItems.${index}.itemDescription`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase font-bold">Description</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} className="bg-[#111113] border-[#1E1E22] h-10 text-sm" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-4 md:col-span-2">
                                                        <FormField
                                                            control={form.control}
                                                            name={`lineItems.${index}.quantity`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase font-bold">Qty</FormLabel>
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
                                                                            className="bg-[#111113] border-[#1E1E22] h-10 text-sm"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-4 md:col-span-2">
                                                        <FormField
                                                            control={form.control}
                                                            name={`lineItems.${index}.unit`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase font-bold">Unit</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} className="bg-[#111113] border-[#1E1E22] h-10 text-sm" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-4 md:col-span-2">
                                                        <FormField
                                                            control={form.control}
                                                            name={`lineItems.${index}.taxRate`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase font-bold">Tax %</FormLabel>
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
                                                                            className="bg-[#111113] border-[#1E1E22] h-10 text-sm"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-12">
                                                        <FormField
                                                            control={form.control}
                                                            name={`lineItems.${index}.price`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase font-bold text-right w-full block">Unit Price (IDR)</FormLabel>
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
                                                                            className="bg-[#111113] border-[#1E1E22] h-10 text-sm text-right font-mono"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-[#1E1E22] flex flex-col items-end gap-2">
                                        <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Calculated Total</p>
                                        <p className="text-4xl font-extrabold text-[#F5A623]">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                                                lineItems.reduce((sum, item) => sum + (item.priceAfterTax || 0), 0)
                                            )}
                                        </p>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* Terms & Approval Tab */}
                            <TabsContent value="terms" className="mt-8">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 shadow-xl">
                                    {isEdit && (
                                        <div className="pb-2 border-b border-[#1E1E22]">
                                            <div className="flex items-center gap-2 mb-4">
                                                <CheckCircle2 className="h-4 w-4 text-[#F5A623]" />
                                                <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Document Status</h2>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem className="max-w-xs">
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">PO Status</FormLabel>
                                                        <Select
                                                            value={field.value ?? 'DRAFT'}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-[#111111] border-[#1E1E22] text-[#F0F0F0]">
                                                                {PO_STATUSES.map((s) => (
                                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CreditCard className="h-4 w-4 text-[#F5A623]" />
                                                <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Payment Procedures</h2>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="paymentProcedure"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Enter payment terms, schedules, or conditions..." className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] min-h-[120px] resize-none" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-4 w-4 text-[#F5A623]" />
                                                <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Additional Terms</h2>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="otherTerms"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Legal notes, delivery terms, etc..." className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] min-h-[120px] resize-none" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-8 bg-[#0A0A0B] border border-[#1E1E22] rounded-2xl p-8">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#F5A623]" />
                                                <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Authorized Approval</h2>
                                            </div>
                                            <div className="space-y-6">
                                                <FormField
                                                    control={form.control}
                                                    name="approval.name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Official Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="bg-[#111113] border-[#1E1E22] h-12" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="approval.position"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Position / Title</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="bg-[#111113] border-[#1E1E22] h-12" />
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
                                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Signature URL (PNG)</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="https://cloud.storage/signature.png" className="bg-[#111113] border-[#1E1E22] h-12" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </div>
        </div>
    );
}
