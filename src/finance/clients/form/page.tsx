import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    AlertCircle,
    Building2,
    User,
    Info,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { clientFormSchema, type ClientFormValues } from "../schema";
import { useClients, useCreateClient, useUpdateClient } from "@/hooks/useClients";
import { toast } from "sonner";

export default function ClientFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: clients = [] } = useClients();
    const client = clients.find(c => c.id === id);

    const [formError, setFormError] = useState<string | null>(null);
    const createMutation = useCreateClient();
    const updateMutation = useUpdateClient();

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            name: "",
            companyName: "",
            address: "",
            phone: "",
            email: "",
            npwp: "",
            picName: "",
            picPosition: "",
            picContact: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (isEdit && client) {
            form.reset({
                name: client.name,
                companyName: client.companyName,
                address: client.address ?? "",
                phone: client.phone ?? "",
                email: client.email ?? "",
                npwp: client.npwp ?? "",
                picName: client.pic?.name ?? "",
                picPosition: client.pic?.position ?? "",
                picContact: client.pic?.contact ?? "",
                isActive: client.isActive,
            });
        }
    }, [client, isEdit, form]);

    const onSubmit = (values: ClientFormValues) => {
        const payload = {
            name: values.name,
            companyName: values.companyName,
            address: values.address || undefined,
            phone: values.phone || undefined,
            email: values.email || undefined,
            npwp: values.npwp || undefined,
            pic: values.picName || values.picPosition || values.picContact
                ? {
                    name: values.picName ?? "",
                    position: values.picPosition || undefined,
                    contact: values.picContact || undefined,
                }
                : undefined,
            isActive: values.isActive,
        };

        if (isEdit) {
            updateMutation.mutate(
                { id: id!, input: payload },
                {
                    onSuccess: () => {
                        toast.success("Client updated successfully");
                        navigate(`/finance/clients/${id}`);
                    },
                    onError: (err: unknown) => {
                        const msg = err instanceof Error ? err.message : "Failed to update client";
                        toast.error(msg);
                        setFormError(msg);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Client created successfully");
                    navigate("/finance/clients");
                },
                onError: (err: unknown) => {
                    const msg = err instanceof Error ? err.message : "Failed to create client";
                    toast.error(msg);
                    setFormError(msg);
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link
                            to={isEdit ? `/finance/clients/${id}` : "/finance/clients"}
                            className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> {isEdit ? "Back to Detail" : "Back to List"}
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEdit ? "Edit Client" : "New Client"}
                        </h1>
                        <p className="text-[#6B6B75] text-sm font-medium">
                            {isEdit ? `Update profile and PIC details for ${client?.name}` : "Create a new client profile for your records."}
                        </p>
                    </div>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-8 h-12 shadow-lg shadow-[#F5A623]/10"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? "Update Client" : "Create Client"}
                    </Button>
                </div>

                {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                        <AlertCircle className="h-5 w-5" />
                        {formError}
                    </div>
                )}

                <Form {...form}>
                    <form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[#F0F0F0]">
                            <div className="md:col-span-2 space-y-8">
                                {/* Basic Info */}
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="h-4 w-4 text-[#F5A623]" />
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Basic Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Client Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="e.g. PT Solusi Digital" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="companyName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Company Legal Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="e.g. PT Solusi Digital Indonesia" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Business Phone</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B6B] text-[10px] uppercase tracking-widest font-bold">Contact Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="email" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Office Address</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="Full street address, city, and postal code..." className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] min-h-[100px] resize-none" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </Card>

                                {/* PIC Info */}
                                <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-[#F5A623]" />
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Person in Charge (PIC)</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="picName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="picPosition"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Position</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="picContact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Direct Contact</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                <Card className="bg-[#111113] border-[#1E1E22] p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#F0F0F0]">Active Status</h3>
                                            <p className="text-[10px] text-[#6B6B75]">Client accessibility in system</p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="isActive"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="data-[state=checked]:bg-[#F5A623]"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </Card>

                                <Card className="bg-[#111113] border-[#1E1E22] p-6 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-4 w-4 text-[#F5A623]" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Financial Details</h3>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="npwp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">NPWP (Tax ID)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="00.000.000.0-000.000" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 font-mono" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </Card>

                                <div className="p-6 bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-2xl">
                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-5 w-5 text-[#F5A623] shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-[#F5A623]">Partner Growth</h4>
                                            <p className="text-[11px] text-[#6B6B75] leading-relaxed">
                                                Detailed client profiles ensure accurate billing and seamless collaboration throughout the project lifecycle.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
