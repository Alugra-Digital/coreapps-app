import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    AlertCircle,
    Briefcase,
    Info
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
import { positionFormSchema, type PositionFormValues } from "../schema";
import { usePositions, useCreatePosition, useUpdatePosition } from "@/hooks/usePositions";
import { toast } from "sonner";

export default function PositionFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: positions = [] } = usePositions();
    const position = positions.find(p => p.id === id);

    const [formError, setFormError] = useState<string | null>(null);
    const createMutation = useCreatePosition();
    const updateMutation = useUpdatePosition();

    const form = useForm<PositionFormValues>({
        resolver: zodResolver(positionFormSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (isEdit && position) {
            form.reset({
                name: position.name,
                code: position.code ?? "",
                description: position.description ?? "",
                isActive: position.isActive,
            });
        }
    }, [position, isEdit, form]);

    const onSubmit = (values: PositionFormValues) => {
        const payload = {
            name: values.name,
            code: values.code || undefined,
            description: values.description || undefined,
            isActive: values.isActive,
        };

        if (isEdit) {
            updateMutation.mutate(
                { id: id!, input: payload },
                {
                    onSuccess: () => {
                        toast.success("Position updated successfully");
                        navigate("/hr/positions");
                    },
                    onError: (err: unknown) => {
                        const msg = err instanceof Error ? err.message : "Failed to update position";
                        toast.error(msg);
                        setFormError(msg);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Position created successfully");
                    navigate("/hr/positions");
                },
                onError: (err: unknown) => {
                    const msg = err instanceof Error ? err.message : "Failed to create position";
                    toast.error(msg);
                    setFormError(msg);
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link
                            to="/hr/positions"
                            className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to List
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEdit ? "Edit Position" : "New Position"}
                        </h1>
                        <p className="text-[#6B6B75] text-sm font-medium">
                            {isEdit ? `Updating details for ${position?.name}` : "Define a new organizational role/position."}
                        </p>
                    </div>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-8 h-12 shadow-lg shadow-[#F5A623]/10"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? "Update Position" : "Create Position"}
                    </Button>
                </div>

                {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                        <AlertCircle className="h-5 w-5" />
                        {formError}
                    </div>
                )}

                <Form {...form}>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Main Info */}
                            <Card className="md:col-span-2 bg-[#111113] border-[#1E1E22] p-8 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="h-4 w-4 text-[#F5A623]" />
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Position Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Position Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g. Senior Software Engineer" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Position Code</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g. SSE" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12" />
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
                                            <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Role Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Detailed responsibilities and requirements..." className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] min-h-[120px] resize-none" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Card>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <Card className="bg-[#111113] border-[#1E1E22] p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#F0F0F0]">Active Status</h3>
                                            <p className="text-[10px] text-[#6B6B75]">Toggle visibility and availability</p>
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

                                <div className="p-6 bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-2xl">
                                    <div className="flex items-start gap-3">
                                        <Briefcase className="h-5 w-5 text-[#F5A623] shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-[#F5A623]">Organizational Impact</h4>
                                            <p className="text-[11px] text-[#6B6B75] leading-relaxed">
                                                Defining positions accurately helps maintain a clear hierarchy and ensures all responsibilities are accounted for.
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
