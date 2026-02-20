import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "../schema";
import {
  STATUS_PAJAK,
  STATUS_PERKAWINAN,
  JENIS_KELAMIN,
} from "../types";
import { createEmployee, updateEmployee } from "@/api/employees";
import { getPositions } from "@/api/positions";
import type { Employee } from "../types";
import { cn } from "@/lib/utils";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  onSuccess: () => void;
}

const defaultValues: EmployeeFormValues = {
  nik: "",
  namaKaryawan: "",
  namaJabatan: "",
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeFormDialogProps) {
  const isEdit = !!employee;
  const [positionOptions, setPositionOptions] = useState<{ value: string; label: string }[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      getPositions().then((positions) => {
        const opts = positions
          .filter((p) => p.isActive)
          .map((p) => ({ value: p.name, label: p.name }));
        if (isEdit && employee?.namaJabatan && !opts.some((o) => o.value === employee.namaJabatan)) {
          opts.push({ value: employee.namaJabatan, label: employee.namaJabatan });
        }
        setPositionOptions(opts);
      });
    }
  }, [open, isEdit, employee?.namaJabatan]);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) setFormError(null);
  }, [open]);

  useEffect(() => {
    if (employee) {
      form.reset({
        nik: employee.nik,
        namaKaryawan: employee.namaKaryawan,
        namaJabatan: employee.namaJabatan,
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
    } else {
      form.reset(defaultValues);
    }
  }, [employee, open, form]);

  const onSubmit = async (values: EmployeeFormValues) => {
    const jumlahAnakRaw = values.jumlahAnak;
    const jumlahAnak =
      jumlahAnakRaw && jumlahAnakRaw !== ""
        ? (() => {
            const n = Number(jumlahAnakRaw);
            return isNaN(n) ? undefined : n;
          })()
        : undefined;
    const payload = {
      nik: values.nik,
      namaKaryawan: values.namaKaryawan,
      namaJabatan: values.namaJabatan,
      tmk: values.tmk || undefined,
      noKtp: values.noKtp || undefined,
      noKk: values.noKk || undefined,
      npwp: values.npwp || undefined,
      noHp: values.noHp || undefined,
      email: values.email || undefined,
      pendidikan: values.pendidikan || undefined,
      statusPajak: values.statusPajak as Employee["statusPajak"] | undefined,
      statusPerkawinan: values.statusPerkawinan as Employee["statusPerkawinan"] | undefined,
      jumlahAnak,
      tempatLahir: values.tempatLahir || undefined,
      tanggalLahir: values.tanggalLahir || undefined,
      jenisKelamin: values.jenisKelamin as Employee["jenisKelamin"] | undefined,
      alamatKtp: values.alamatKtp || undefined,
      kotaKtp: values.kotaKtp || undefined,
      provinsiKtp: values.provinsiKtp || undefined,
      noRek: values.noRek || undefined,
      namaBank: values.namaBank || undefined,
      noJknKis: values.noJknKis || undefined,
      noJms: values.noJms || undefined,
      tanggalKeluar: values.tanggalKeluar || undefined,
      profilePictureUrl: values.profilePictureUrl || undefined,
      ktpDocumentUrl: values.ktpDocumentUrl || undefined,
      kkDocumentUrl: values.kkDocumentUrl || undefined,
      npwpDocumentUrl: values.npwpDocumentUrl || undefined,
    };

    setFormError(null);
    try {
      if (isEdit && employee) {
        const result = await updateEmployee(employee.id, payload);
        if (!result) {
          setFormError("Failed to update employee. Please try again.");
          return;
        }
      } else {
        await createEmployee(payload);
      }
      onSuccess();
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to save employee. Please try again.";
      setFormError(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0" data-testid="employee-form-dialog">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>

        {formError && (
          <div
            className="mx-6 mb-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            data-testid="employee-form-error"
          >
            {formError}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
            data-testid="employee-form"
          >
            <Tabs defaultValue="personal" className="flex-1 flex flex-col gap-4 overflow-hidden">
              <TabsList className="mx-6 px-2 flex gap-1 shrink-0">
                <TabsTrigger value="personal" className="text-xs px-2 py-1.5">Personal</TabsTrigger>
                <TabsTrigger value="identity" className="text-xs px-2 py-1.5">Identity</TabsTrigger>
                <TabsTrigger value="contact" className="text-xs px-2 py-1.5">Contact</TabsTrigger>
                <TabsTrigger value="address" className="text-xs px-2 py-1.5">Address</TabsTrigger>
                <TabsTrigger value="bank" className="text-xs px-2 py-1.5">Bank & Health</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-6 pb-4">
                <TabsContent value="personal" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="profilePictureUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Profile Picture</FormLabel>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-16 w-16 rounded-lg border">
                            {field.value ? (
                              <img src={field.value} alt="Profile" className="h-full w-full object-cover rounded-lg" />
                            ) : (
                              <AvatarFallback className="rounded-lg bg-slate-100 dark:bg-white/5">
                                <Upload className="h-6 w-6 text-slate-400" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="profile-pic-upload"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(await fileToDataUrl(file));
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => document.getElementById("profile-pic-upload")?.click()}
                            >
                              Upload
                            </Button>
                            {field.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-destructive"
                                onClick={() => field.onChange("")}
                              >
                                <X className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            )}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NIK (Nomor Induk Karyawan)</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="namaKaryawan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Karyawan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">Nama Jabatan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Pilih jabatan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {positionOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
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
                    name="tmk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">TMK</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="YYYY-MM-DD" className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">Tempat Lahir</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">Tanggal Lahir</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-9 justify-start text-left font-normal text-sm",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "dd/MM/yyyy") : "Pilih tanggal"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jenisKelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Jenis Kelamin</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {JENIS_KELAMIN.map((j) => (
                              <SelectItem key={j} value={j}>
                                {j}
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
                    name="pendidikan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Pendidikan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="identity" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="noKtp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No. KTP</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ktpDocumentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">KTP Document</FormLabel>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            id="ktp-upload"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) field.onChange(await fileToDataUrl(file));
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => document.getElementById("ktp-upload")?.click()}
                          >
                            <Upload className="h-3 w-3 mr-1" /> Upload KTP
                          </Button>
                          {field.value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-destructive"
                              onClick={() => field.onChange("")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="noKk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No. KK</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kkDocumentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">KK Document</FormLabel>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            id="kk-upload"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) field.onChange(await fileToDataUrl(file));
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => document.getElementById("kk-upload")?.click()}
                          >
                            <Upload className="h-3 w-3 mr-1" /> Upload KK
                          </Button>
                          {field.value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-destructive"
                              onClick={() => field.onChange("")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="npwp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NPWP</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="npwpDocumentUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NPWP Document</FormLabel>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            id="npwp-upload"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) field.onChange(await fileToDataUrl(file));
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => document.getElementById("npwp-upload")?.click()}
                          >
                            <Upload className="h-3 w-3 mr-1" /> Upload NPWP
                          </Button>
                          {field.value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-destructive"
                              onClick={() => field.onChange("")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="statusPajak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Status Pajak</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUS_PAJAK.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
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
                    name="statusPerkawinan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Status Perkawinan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUS_PERKAWINAN.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
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
                    name="jumlahAnak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Jumlah Anak</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="contact" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="noHp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No.HP</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="address" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="alamatKtp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Alamat KTP</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} className="text-sm resize-none" />
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
                        <FormLabel className="text-xs">Kota (KTP)</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">Provinsi (KTP)</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="bank" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="noRek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">No.Rek</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="namaBank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Bank</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Mandiri" className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">No. JKN/KIS</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">No. JMS</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" />
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
                        <FormLabel className="text-xs">Tanggal Keluar</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-9 justify-start text-left font-normal text-sm",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "dd/MM/yyyy") : "Pilih tanggal (kosongkan jika aktif)"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")}
                            />
                          </PopoverContent>
                        </Popover>
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                data-testid="employee-form-submit"
              >
                {form.formState.isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
