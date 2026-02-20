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
import { QuotationFormDialog } from "./QuotationFormDialog";
import { QuotationViewDialog } from "./QuotationViewDialog";
import { deleteQuotation } from "@/api/quotations";
import type { Quotation } from "../types";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
};

interface QuotationTableProps {
  quotations: Quotation[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
}

export function QuotationTable({
  quotations,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
}: QuotationTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editQuotation, setEditQuotation] = useState<Quotation | null>(null);
  const [viewQuotation, setViewQuotation] = useState<Quotation | null>(null);
  const [deleteQuotationId, setDeleteQuotationId] = useState<string | null>(null);
  const [deleteQuotationNumber, setDeleteQuotationNumber] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = quotations.filter((q) => {
    const matchSearch =
      (q.quotationNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (q.clientName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteQuotationId) return;
    setIsDeleting(true);
    try {
      await deleteQuotation(deleteQuotationId);
      onRefresh();
      setDeleteQuotationId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setEditQuotation(null);
    onRefresh();
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="h-4 w-4" /> Quotations
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search number, client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-48 text-foreground"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-7 px-3 rounded-lg text-[10px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <Button
              className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
              onClick={onAddClick}
            >
              Add Quotation
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Number</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Date</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Client</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Grand Total</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q) => (
                <TableRow
                  key={q.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">{q.quotationNumber}</span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">{q.quotationDate}</TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">{q.clientName}</TableCell>
                  <TableCell className="py-3 text-xs">
                    {new Intl.NumberFormat("id-ID").format(q.grandTotal)}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${q.status === "accepted"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                          : q.status === "rejected" || q.status === "expired"
                            ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500"
                            : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      {STATUS_LABELS[q.status] ?? q.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/row:opacity-100">
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewQuotation(q)}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditQuotation(q)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteQuotationId(q.id);
                            setDeleteQuotationNumber(q.quotationNumber);
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

      <QuotationFormDialog open={isAddOpen} onOpenChange={onAddOpenChange} onSuccess={handleAddSuccess} />
      <QuotationFormDialog
        open={!!editQuotation}
        onOpenChange={(open) => !open && setEditQuotation(null)}
        quotation={editQuotation ?? undefined}
        onSuccess={handleEditSuccess}
      />
      <QuotationViewDialog
        quotation={viewQuotation}
        onOpenChange={(open) => !open && setViewQuotation(null)}
        onEdit={() => {
          if (viewQuotation) {
            setViewQuotation(null);
            setEditQuotation(viewQuotation);
          }
        }}
      />
      <AlertDialog open={!!deleteQuotationId} onOpenChange={(open) => !open && setDeleteQuotationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteQuotationNumber}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
