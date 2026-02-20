import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Employee } from "../types";

interface EmployeeViewDialogProps {
  employee: Employee | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

function FieldRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        {label}
      </span>
      <span className="text-sm text-slate-900 dark:text-foreground">
        {value ?? "-"}
      </span>
    </div>
  );
}

export function EmployeeViewDialog({
  employee,
  onOpenChange,
  onEdit,
}: EmployeeViewDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={!!employee} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh] pr-4">
          <div className="grid grid-cols-2 gap-6">
            <FieldRow label="NIK" value={employee.nik} />
            <FieldRow label="Nama Karyawan" value={employee.namaKaryawan} />
            <FieldRow label="Nama Jabatan" value={employee.namaJabatan} />
            <FieldRow label="TMK" value={employee.tmk} />
            <FieldRow label="No. KTP" value={employee.noKtp} />
            <FieldRow label="No. KK" value={employee.noKk} />
            <FieldRow label="NPWP" value={employee.npwp} />
            <FieldRow label="No.HP" value={employee.noHp} />
            <FieldRow label="Email" value={employee.email} />
            <FieldRow label="Pendidikan" value={employee.pendidikan} />
            <FieldRow label="Status Pajak" value={employee.statusPajak} />
            <FieldRow label="Status Perkawinan" value={employee.statusPerkawinan} />
            <FieldRow label="Jumlah Anak" value={employee.jumlahAnak} />
            <FieldRow label="Tempat Lahir" value={employee.tempatLahir} />
            <FieldRow label="Tanggal Lahir" value={employee.tanggalLahir} />
            <FieldRow label="Jenis Kelamin" value={employee.jenisKelamin} />
            <div className="col-span-2">
              <FieldRow label="Alamat KTP" value={employee.alamatKtp} />
            </div>
            <FieldRow label="Kota (KTP)" value={employee.kotaKtp} />
            <FieldRow label="Provinsi (KTP)" value={employee.provinsiKtp} />
            <FieldRow label="No.Rek" value={employee.noRek} />
            <FieldRow label="Nama Bank" value={employee.namaBank} />
            <FieldRow label="No. JKN/KIS" value={employee.noJknKis} />
            <FieldRow label="No. JMS" value={employee.noJms} />
            <FieldRow label="Tanggal Keluar" value={employee.tanggalKeluar} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
