import {
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaxTypeFormDialog } from "./TaxTypeFormDialog";
import { TaxTypeViewDialog } from "./TaxTypeViewDialog";
import { TaxTypePdfViewer } from "./TaxTypePdfViewer";
import { deleteTaxType } from "@/api/tax-types";
import type { TaxType } from "../types";

interface TaxTypeTableProps {
  taxTypes: TaxType[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  output_tax: "Output Tax",
  withholding_tax: "Withholding Tax",
};

export function TaxTypeTable({
  taxTypes,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
}: TaxTypeTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editTaxType, setEditTaxType] = useState<TaxType | null>(null);
  const [viewTaxType, setViewTaxType] = useState<TaxType | null>(null);
  const [pdfTaxType, setPdfTaxType] = useState<TaxType | null>(null);
  const [deleteTaxTypeId, setDeleteTaxTypeId] = useState<string | null>(null);
  const [deleteTaxTypeName, setDeleteTaxTypeName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = taxTypes.filter((t) => {
    const matchSearch =
      (t.code ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTaxTypeId) return;
    setIsDeleting(true);
    try {
      await deleteTaxType(deleteTaxTypeId);
      onRefresh();
      setDeleteTaxTypeId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setEditTaxType(null);
    onRefresh();
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="h-4 w-4" /> Perpajakan / Tax Types
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search code, name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-48 text-foreground"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-7 px-3 rounded-lg text-[10px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10"
            >
              <option value="all">All Categories</option>
              <option value="output_tax">Output Tax</option>
              <option value="withholding_tax">Withholding Tax</option>
            </select>
            <Button
              className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
              onClick={onAddClick}
            >
              Add Tax Type
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Code
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Name
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Rate
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Category
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Applicable To
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow
                  key={t.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {t.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {t.name}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {t.rate}%
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {CATEGORY_LABELS[t.category] ?? t.category}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {t.applicableDocuments.join(", ").toUpperCase()}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.isActive
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                          : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
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
                        <DropdownMenuItem onClick={() => setViewTaxType(t)}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPdfTaxType(t)}>
                          <FileText className="h-3.5 w-3.5 mr-2" /> View PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditTaxType(t)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteTaxTypeId(t.id);
                            setDeleteTaxTypeName(t.name);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TaxTypeFormDialog
        open={isAddOpen}
        onOpenChange={onAddOpenChange}
        onSuccess={handleAddSuccess}
      />

      <TaxTypeFormDialog
        open={!!editTaxType}
        onOpenChange={(open) => !open && setEditTaxType(null)}
        taxType={editTaxType ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <TaxTypeViewDialog
        taxType={viewTaxType}
        onOpenChange={(open) => !open && setViewTaxType(null)}
        onEdit={() => {
          if (viewTaxType) {
            setViewTaxType(null);
            setEditTaxType(viewTaxType);
          }
        }}
      />

      <TaxTypePdfViewer
        taxType={pdfTaxType}
        onOpenChange={(open) => !open && setPdfTaxType(null)}
      />

      <AlertDialog
        open={!!deleteTaxTypeId}
        onOpenChange={(open) => !open && setDeleteTaxTypeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tax Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTaxTypeName}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
