import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Users,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import { EmployeeViewDialog } from "./EmployeeViewDialog";
import { softDeleteEmployee } from "@/api/employees";
import { exportEmployeesToExcel, exportEmployeesToPdf } from "../utils/exportEmployees";
import type { Employee } from "../types";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [10, 25, 50] as const;

interface EmployeeTableProps {
  employees: Employee[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
}

export function EmployeeTable({
  employees,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
}: EmployeeTableProps) {
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"active" | "resigned" | "all">("active");
  const [showResigned, setShowResigned] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [deleteEmployeeName, setDeleteEmployeeName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const uniquePositions = useMemo(
    () => [...new Set(employees.map((e) => e.namaJabatan).filter(Boolean))].sort(),
    [employees]
  );

  const filtered = useMemo(() => {
    let result = employees;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.nik.toLowerCase().includes(q) ||
          e.namaKaryawan.toLowerCase().includes(q) ||
          e.namaJabatan.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q)
      );
    }

    // Position filter
    if (positionFilter && positionFilter !== "all") {
      result = result.filter((e) => e.namaJabatan === positionFilter);
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((e) => !e.tanggalKeluar);
    } else if (statusFilter === "resigned") {
      result = result.filter((e) => !!e.tanggalKeluar);
    }

    // Show resigned toggle (when status is "all", toggle controls visibility of resigned)
    if (!showResigned && statusFilter === "all") {
      result = result.filter((e) => !e.tanggalKeluar);
    }

    return result;
  }, [employees, search, positionFilter, statusFilter, showResigned]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, positionFilter, statusFilter, showResigned, pageSize]);

  // Clamp currentPage when totalPages decreases
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDeleteConfirm = async () => {
    if (!deleteEmployeeId) return;
    setIsDeleting(true);
    try {
      await softDeleteEmployee(deleteEmployeeId);
      onRefresh();
      setDeleteEmployeeId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportExcel = () => {
    exportEmployeesToExcel(filtered);
  };

  const handleExportPdf = () => {
    exportEmployeesToPdf(filtered);
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setEditEmployee(null);
    onRefresh();
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-3 mb-3 px-2">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <Users className="h-4 w-4" /> Employee List
            </span>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                <input
                  placeholder="Search NIK, Name, Jabatan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-48 text-foreground"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <Filter className="h-3.5 w-3.5" /> Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-foreground">Position</Label>
                      <Select value={positionFilter} onValueChange={setPositionFilter}>
                        <SelectTrigger className="h-8 mt-1 text-xs">
                          <SelectValue placeholder="All positions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All positions</SelectItem>
                          {uniquePositions.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-foreground">Status</Label>
                      <Select
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter(v as "active" | "resigned" | "all")}
                      >
                        <SelectTrigger className="h-8 mt-1 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active only</SelectItem>
                          <SelectItem value="resigned">Resigned only</SelectItem>
                          <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {statusFilter === "all" && (
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-resigned" className="text-xs text-foreground">
                          Show resigned
                        </Label>
                        <Switch
                          id="show-resigned"
                          checked={showResigned}
                          onCheckedChange={setShowResigned}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                  >
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportExcel}>
                    <FileSpreadsheet className="h-3.5 w-3.5 mr-2" /> Export to Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPdf}>
                    <FileText className="h-3.5 w-3.5 mr-2" /> Export to PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
                onClick={onAddClick}
              >
                Add Employee
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>
              Showing {paginatedEmployees.length} of {filtered.length} employees
            </span>
            <div className="flex items-center gap-2">
              <span>Per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v) as 10 | 25 | 50)}
              >
                <SelectTrigger className="h-6 w-14 text-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  NIK
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Nama Karyawan
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Nama Jabatan
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  No.HP
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Email
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {emp.nik}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg border border-slate-100 dark:border-white/5">
                        <AvatarFallback className="text-[10px] font-bold bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                          {emp.namaKaryawan
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                        {emp.namaKaryawan}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {emp.namaJabatan}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {emp.noHp ?? "-"}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {emp.email ?? "-"}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0 rounded-full border-none",
                        emp.tanggalKeluar
                          ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500"
                          : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                      )}
                    >
                      {emp.tanggalKeluar ? "Resigned" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setViewEmployee(emp)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditEmployee(emp)}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteEmployeeId(emp.id);
                            setDeleteEmployeeName(emp.namaKaryawan);
                          }}
                          disabled={!!emp.tanggalKeluar}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Mark as Resigned
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add Employee Dialog */}
      <EmployeeFormDialog
        open={isAddOpen}
        onOpenChange={onAddOpenChange}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Employee Dialog */}
      <EmployeeFormDialog
        open={!!editEmployee}
        onOpenChange={(open) => !open && setEditEmployee(null)}
        employee={editEmployee ?? undefined}
        onSuccess={handleEditSuccess}
      />

      {/* View Employee Dialog */}
      <EmployeeViewDialog
        employee={viewEmployee}
        onOpenChange={(open) => !open && setViewEmployee(null)}
        onEdit={() => {
          if (viewEmployee) {
            setViewEmployee(null);
            setEditEmployee(viewEmployee);
          }
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteEmployeeId}
        onOpenChange={(open) => !open && setDeleteEmployeeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Resigned</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark <strong>{deleteEmployeeName}</strong> as resigned? This will set their
              resignation date to today. You can still view and edit their record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                await handleDeleteConfirm();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Updating..." : "Mark as Resigned"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
