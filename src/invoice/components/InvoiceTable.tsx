import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
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
import { InvoiceFormDialog } from "./InvoiceFormDialog";
import { InvoiceViewDialog } from "./InvoiceViewDialog";
import { InvoicePdfViewer } from "./InvoicePdfViewer";
import { deleteInvoice } from "@/api/invoices";
import type { Invoice } from "../types";

interface InvoiceTableProps {
  invoices: Invoice[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
}

const PAGE_SIZE = 5;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function InvoiceTable({
  invoices,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
}: InvoiceTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [pdfInvoice, setPdfInvoice] = useState<Invoice | null>(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);
  const [deleteInvoiceNumber, setDeleteInvoiceNumber] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = invoices.filter(
    (i) =>
      (i.invoiceInfo.invoiceNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (i.billingInfo.companyName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (i.invoiceInfo.invoiceName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const handleDeleteConfirm = async () => {
    if (!deleteInvoiceId) return;
    setIsDeleting(true);
    try {
      await deleteInvoice(deleteInvoiceId);
      onRefresh();
      setDeleteInvoiceId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleEditSuccess = () => {
    setEditInvoice(null);
    onRefresh();
  };

  const getTotalAmount = (inv: Invoice): number => {
    return inv.lineItems.reduce(
      (sum, item) => sum + (item.priceAfterTax ?? item.subtotal),
      0
    );
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow flex flex-col h-full min-h-0">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="h-4 w-4" /> Invoice Repository
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search Invoice #, Client..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-48 text-foreground"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <Button
              className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
              onClick={onAddClick}
            >
              Create Invoice
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Invoice Number
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Date
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Client
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Due Date
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Total
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {inv.invoiceInfo.invoiceNumber}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {inv.invoiceInfo.invoiceDate}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {inv.billingInfo.companyName}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {inv.invoiceInfo.dueDate}
                  </TableCell>
                  <TableCell className="py-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrency(getTotalAmount(inv))}
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
                        <DropdownMenuItem onClick={() => setViewInvoice(inv)}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPdfInvoice(inv)}>
                          <FileText className="h-3.5 w-3.5 mr-2" /> View PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditInvoice(inv)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteInvoiceId(inv.id);
                            setDeleteInvoiceNumber(inv.invoiceInfo.invoiceNumber);
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
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages} ({filtered.length} total)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[10px]"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[10px]"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <InvoiceFormDialog
        open={isAddOpen}
        onOpenChange={onAddOpenChange}
        onSuccess={handleAddSuccess}
      />

      <InvoiceFormDialog
        open={!!editInvoice}
        onOpenChange={(open) => !open && setEditInvoice(null)}
        invoice={editInvoice ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <InvoiceViewDialog
        invoice={viewInvoice}
        onOpenChange={(open) => !open && setViewInvoice(null)}
        onEdit={() => {
          if (viewInvoice) {
            setViewInvoice(null);
            setEditInvoice(viewInvoice);
          }
        }}
      />

      <InvoicePdfViewer
        invoice={pdfInvoice}
        onOpenChange={(open) => !open && setPdfInvoice(null)}
      />

      <AlertDialog
        open={!!deleteInvoiceId}
        onOpenChange={(open) => !open && setDeleteInvoiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteInvoiceNumber}</strong>? This action cannot be undone.
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
