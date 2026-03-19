import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    AlertCircle,
    User,
    CreditCard,
    Phone,
    Building
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
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    employeeFormSchema,
    type EmployeeFormValues
} from "../schema";
import { useEmployees, useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import { usePositions } from "@/hooks/usePositions";
import { toast } from "sonner";
import type { Employee } from "../types";
import { TIPE_KARYAWAN, STATUS_PERKAWINAN, JENIS_KELAMIN, STATUS_PAJAK } from "../types";
import { EntityCombobox } from "@/components/ui/entity-combobox";

const defaultValues: EmployeeFormValues = {
    nik: "",
    namaKaryawan: "",
    namaJabatan: "",
    tipeKaryawan: "",
    tmk: "",
    noKtp: "",
    noKk: "",
    npwp: "",
    noHp: "",
    email: "",
    pendidikan: "",
    statusPajak: "",
    statusPerkawinan: "",
    jumlahAnak: undefined,
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamatKtp: "",
    kotaKtp: "",
    provinsiKtp: "",
    noRek: "",
    namaBank: "Mandiri",
    noJknKis: "",
    noJms: "",
    tanggalKeluar: "",
    profilePictureUrl: "",
    ktpDocumentUrl: "",
    kkDocumentUrl: "",
    npwpDocumentUrl: "",
};



export default function EmployeeFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: employees = [] } = useEmployees();
    const employee = employees.find(e => e.id === id);

    const [formError, setFormError] = useState<string | null>(null);
    const createMutation = useCreateEmployee();
    const updateMutation = useUpdateEmployee();
    const { data: positionsData = [] } = usePositions();

    const positionOptions = React.useMemo(() => {
        return positionsData
            .filter((p) => p.isActive)
            .map((p) => ({ id: p.name, label: p.name }));
    }, [positionsData]);

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (isEdit && employee) {
            form.reset({
                ...employee,
                tipeKaryawan: employee.tipeKaryawan ?? "",
                tmk: employee.tmk ?? "",
                noKtp: employee.noKtp ?? "",
                noKk: employee.noKk ?? "",
                npwp: employee.npwp ?? "",
                noHp: employee.noHp ?? "",
                email: employee.email ?? "",
                pendidikan: employee.pendidikan ?? "",
                statusPajak: employee.statusPajak ?? "",
                statusPerkawinan: employee.statusPerkawinan ?? "",
                jumlahAnak: employee.jumlahAnak !== undefined ? String(employee.jumlahAnak) : "",
                tempatLahir: employee.tempatLahir ?? "",
                tanggalLahir: employee.tanggalLahir ?? "",
                jenisKelamin: employee.jenisKelamin ?? "",
                alamatKtp: employee.alamatKtp ?? "",
                kotaKtp: employee.kotaKtp ?? "",
                provinsiKtp: employee.provinsiKtp ?? "",
                noRek: employee.noRek ?? "",
                namaBank: employee.namaBank ?? "Mandiri",
                noJknKis: employee.noJknKis ?? "",
                noJms: employee.noJms ?? "",
                tanggalKeluar: employee.tanggalKeluar ?? "",
                profilePictureUrl: employee.profilePictureUrl ?? "",
                ktpDocumentUrl: employee.ktpDocumentUrl ?? "",
                kkDocumentUrl: employee.kkDocumentUrl ?? "",
                npwpDocumentUrl: employee.npwpDocumentUrl ?? "",
            });
        }
    }, [employee, isEdit, form]);

    const onSubmit = (values: EmployeeFormValues) => {
        const payload = {
            ...values,
            jumlahAnak: values.jumlahAnak ? Number(values.jumlahAnak) : undefined,
            statusPajak: values.statusPajak as Employee["statusPajak"],
            statusPerkawinan: values.statusPerkawinan as Employee["statusPerkawinan"],
            jenisKelamin: values.jenisKelamin as Employee["jenisKelamin"],
            tipeKaryawan: values.tipeKaryawan as Employee["tipeKaryawan"],
        };

        if (isEdit) {
            updateMutation.mutate(
                { id: id!, input: payload },
                {
                    onSuccess: () => {
                        toast.success("Employee updated successfully");
                        navigate(`/hr/employees/${id}`);
                    },
                    onError: (err: unknown) => {
                        const msg = err instanceof Error ? err.message : "Failed to update employee";
                        toast.error(msg);
                        setFormError(msg);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Employee created successfully");
                    navigate("/hr/employees");
                },
                onError: (err: unknown) => {
                    const msg = err instanceof Error ? err.message : "Failed to create employee";
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
                            to="/hr/employees"
                            className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to List
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEdit ? "Edit Employee" : "New Employee"}
                        </h1>
                        <p className="text-[#6B6B75] text-sm">
                            {isEdit ? `Updating profile for ${employee?.namaKaryawan}` : "Create a new employee record in the system."}
                        </p>
                    </div>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-8 h-12 shadow-lg shadow-[#F5A623]/10"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? "Update Profile" : "Create Employee"}
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
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="bg-[#111113] border border-[#1E1E22] p-1 h-auto gap-1">
                                {[
                                    { value: "personal", label: "Personal", icon: User },
                                    { value: "identity", label: "Identity", icon: CreditCard },
                                    { value: "contact", label: "Contact", icon: Phone },
                                    { value: "bank", label: "Bank & Health", icon: Building },
                                ].map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="data-[state=active]:bg-[#1E1E22] data-[state=active]:text-[#F5A623] px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
                                    >
                                        <tab.icon className="h-3.5 w-3.5 mr-2" />
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <div className="mt-8">
                                <Card className="bg-[#111113] border-[#1E1E22] p-8">
                                    <TabsContent value="personal" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="namaKaryawan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="nik"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">NIK (Employee ID)</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="namaJabatan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Position</FormLabel>
                                                        <FormControl>
                                                            <EntityCombobox
                                                                items={positionOptions}
                                                                value={field.value ?? ""}
                                                                onValueChange={field.onChange}
                                                                placeholder="Select position"
                                                                triggerClassName="bg-[#0A0A0B] border-[#1E1E22] h-12 text-[#F0F0F0]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tmk"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Join Date</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="date" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0] [color-scheme:dark]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tipeKaryawan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Employment Type</FormLabel>
                                                        <FormControl>
                                                            <EntityCombobox
                                                                items={TIPE_KARYAWAN.map(t => ({ id: t, label: t }))}
                                                                value={field.value ?? ""}
                                                                onValueChange={field.onChange}
                                                                placeholder="Select type"
                                                                triggerClassName="bg-[#0A0A0B] border-[#1E1E22] h-12 text-[#F0F0F0]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tanggalKeluar"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Resignation Date</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="date" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0] [color-scheme:dark]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pendidikan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Education</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tempatLahir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Place of Birth</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tanggalLahir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Date of Birth</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="date" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0] [color-scheme:dark]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="jenisKelamin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Gender</FormLabel>
                                                        <FormControl>
                                                            <EntityCombobox
                                                                items={JENIS_KELAMIN.map(g => ({ id: g, label: g === 'L' ? 'Laki-laki' : 'Perempuan' }))}
                                                                value={field.value ?? ""}
                                                                onValueChange={field.onChange}
                                                                placeholder="Select gender"
                                                                triggerClassName="bg-[#0A0A0B] border-[#1E1E22] h-12 text-[#F0F0F0]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="statusPerkawinan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Marital Status</FormLabel>
                                                        <FormControl>
                                                            <EntityCombobox
                                                                items={STATUS_PERKAWINAN.map(s => ({ id: s, label: s }))}
                                                                value={field.value ?? ""}
                                                                onValueChange={field.onChange}
                                                                placeholder="Select status"
                                                                triggerClassName="bg-[#0A0A0B] border-[#1E1E22] h-12 text-[#F0F0F0]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="jumlahAnak"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Number of Children</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="number" min="0" className="bg-[#0A0A0B] border-[#1E1E22] focus:border-[#F5A623] h-12 text-[#F0F0F0]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="identity" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="noKtp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">KTP Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="npwp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">NPWP Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="noKk"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Family Card (KK) Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="statusPajak"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Tax Status (PTKP)</FormLabel>
                                                        <FormControl>
                                                            <EntityCombobox
                                                                items={STATUS_PAJAK.map(s => ({ id: s, label: s }))}
                                                                value={field.value ?? ""}
                                                                onValueChange={field.onChange}
                                                                placeholder="Select tax status"
                                                                triggerClassName="bg-[#0A0A0B] border-[#1E1E22] h-12 text-[#F0F0F0]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="contact" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="email" className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="noHp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="kotaKtp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">City/Regency</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="provinsiKtp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Province</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="alamatKtp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Address</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} className="bg-[#0A0A0B] border-[#1E1E22] min-h-[100px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>

                                    <TabsContent value="bank" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="namaBank"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Bank Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="noRek"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">Account Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="noJknKis"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">JKN / KIS Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="noJms"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#6B6B75] text-[10px] uppercase tracking-widest font-bold">BPJS/Jamsostek Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-[#0A0A0B] border-[#1E1E22] h-12" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </TabsContent>
                                </Card>
                            </div>
                        </Tabs>
                    </form>
                </Form>
            </div>
        </div>
    );
}
