import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { inventoryItemFormSchema, type InventoryItemFormValues } from "../schema";
import {
    useInventoryItems,
    useCreateInventoryItem,
    useUpdateInventoryItem,
} from "@/hooks/useInventory";
import { toast } from "sonner";

export default function InventoryFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: items = [] } = useInventoryItems();
    const item = items.find((i) => i.id === id);

    const createMutation = useCreateInventoryItem();
    const updateMutation = useUpdateInventoryItem();

    const form = useForm<InventoryItemFormValues>({
        resolver: zodResolver(inventoryItemFormSchema),
        defaultValues: { code: "", name: "", quantity: 0, price: 0 },
    });

    useEffect(() => {
        if (item) {
            form.reset({
                code: item.code,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            });
        }
    }, [item, form]);

    const onSubmit = (values: InventoryItemFormValues) => {
        const handleSuccess = () => {
            toast.success(isEdit ? "Asset updated successfully" : "Asset created successfully");
            navigate("/inventory");
        };

        if (isEdit && item) {
            updateMutation.mutate(
                { id: item.id, input: values },
                {
                    onSuccess: (data) => {
                        if (data === null) toast.error("Failed to update asset");
                        else handleSuccess();
                    },
                    onError: () => toast.error("Failed to update asset"),
                }
            );
        } else {
            createMutation.mutate(values, {
                onSuccess: handleSuccess,
                onError: () => toast.error("Failed to create asset"),
            });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
            <div className="max-w-2xl mx-auto space-y-10">
                {/* Header */}
                <div className="space-y-4">
                    <Link
                        to="/inventory"
                        className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm w-fit"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Inventory
                    </Link>
                    <div className="flex items-end justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-xl flex items-center justify-center">
                                    <Package className="h-5 w-5 text-[#F5A623]" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight">
                                        {isEdit ? "Edit Asset" : "New Asset"}
                                    </h1>
                                    <p className="text-[#6B6B75] text-sm font-medium">
                                        {isEdit ? `Editing ${item?.name ?? "..."}` : "Register a new IT asset or inventory item"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-[#F5A623]/5 border-b border-[#1E1E22] px-8 py-4">
                        <p className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">
                            Asset Information
                        </p>
                    </div>
                    <div className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-xs font-bold uppercase tracking-wider">
                                                    Asset Code
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="ASSET-1021"
                                                        className="bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] h-12 rounded-xl focus:border-[#F5A623] transition-colors placeholder:text-[#6B6B75]"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-xs font-bold uppercase tracking-wider">
                                                    Asset Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. MacBook Pro 14-inch"
                                                        className="bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] h-12 rounded-xl focus:border-[#F5A623] transition-colors placeholder:text-[#6B6B75]"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-xs font-bold uppercase tracking-wider">
                                                    Quantity
                                                </FormLabel>
                                                <FormControl>
                                                    <CurrencyInput
                                                        prefix=""
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                        ref={field.ref}
                                                        value={field.value}
                                                        onChange={(v: number) => field.onChange(v)}
                                                        placeholder="0"
                                                        className="bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] h-12 rounded-xl focus:border-[#F5A623] transition-colors placeholder:text-[#6B6B75]"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-xs font-bold uppercase tracking-wider">
                                                    Unit Price (IDR)
                                                </FormLabel>
                                                <FormControl>
                                                    <CurrencyInput
                                                        prefix="Rp"
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                        ref={field.ref}
                                                        value={field.value}
                                                        onChange={(v: number) => field.onChange(v)}
                                                        placeholder="0"
                                                        className="bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] h-12 rounded-xl focus:border-[#F5A623] transition-colors placeholder:text-[#6B6B75]"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-[#1E1E22]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/inventory")}
                                        className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22] h-12 px-8 rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-[#F5A623]/10"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isPending ? "Saving..." : isEdit ? "Update Asset" : "Create Asset"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    );
}
