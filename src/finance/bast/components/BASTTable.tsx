import {
  Search,
  Filter,
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
import { BASTFormDialog } from "./BASTFormDialog";
import { BASTViewDialog } from "./BASTViewDialog";
import { BASTPdfViewer } from "./BASTPdfViewer";
import { deleteBast } from "@/api/bast";
import type { BAST } from "../types";

interface BASTTableProps {
  basts: BAST[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
}

function formatBastMonth(month: string): string {
  if (!month) return "-";
  const [year, mo] = month.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const idx = parseInt(mo, 10) - 1;
  return idx >= 0 && idx < 12 ? `${months[idx]} ${year}` : month;
}

export function BASTTable({
  basts,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
}: BASTTableProps) {
  const [search, setSearch] = useState("");
  const [editBast, setEditBast] = useState<BAST | null>(null);
  const [viewBast, setViewBast] = useState<BAST | null>(null);
  const [pdfBast, setPdfBast] = useState<BAST | null>(null);
  const [deleteBastId, setDeleteBastId] = useState<string | null>(null);
  const [deleteBastNumber, setDeleteBastNumber] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = basts.filter(
    (b) =>
      (b.documentInfo.bastNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.coverInfo.companyName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.coverInfo.jobOffer ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.documentInfo.relatedPoOrInvoice ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!deleteBastId) return;
    setIsDeleting(true);
    try {
      await deleteBast(deleteBastId);
      onRefresh();
      setDeleteBastId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setEditBast(null);
    onRefresh();
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="h-4 w-4" /> BAST List
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search BAST #, Company, Job..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              Add BAST
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  BAST Number
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Date
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Job Offer
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Month
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Related PO/Invoice
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow
                  key={b.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {b.documentInfo.bastNumber}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {b.documentInfo.bastDate}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {b.coverInfo.jobOffer}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {formatBastMonth(b.coverInfo.bastMonth)}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {b.documentInfo.relatedPoOrInvoice ?? "-"}
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
                        <DropdownMenuItem onClick={() => setViewBast(b)}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPdfBast(b)}>
                          <FileText className="h-3.5 w-3.5 mr-2" /> View PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditBast(b)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteBastId(b.id);
                            setDeleteBastNumber(b.documentInfo.bastNumber);
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

      <BASTFormDialog
        open={isAddOpen}
        onOpenChange={onAddOpenChange}
        onSuccess={handleAddSuccess}
      />

      <BASTFormDialog
        open={!!editBast}
        onOpenChange={(open) => !open && setEditBast(null)}
        bast={editBast ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <BASTViewDialog
        bast={viewBast}
        onOpenChange={(open) => !open && setViewBast(null)}
        onEdit={() => {
          if (viewBast) {
            setViewBast(null);
            setEditBast(viewBast);
          }
        }}
      />

      <BASTPdfViewer
        bast={pdfBast}
        onOpenChange={(open) => !open && setPdfBast(null)}
      />

      <AlertDialog
        open={!!deleteBastId}
        onOpenChange={(open) => !open && setDeleteBastId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete BAST</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteBastNumber}</strong>? This action cannot be undone.
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
