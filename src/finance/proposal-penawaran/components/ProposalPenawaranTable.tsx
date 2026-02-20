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
import { ProposalPenawaranFormDialog } from "./ProposalPenawaranFormDialog";
import { ProposalPenawaranViewDialog } from "./ProposalPenawaranViewDialog";
import { ProposalPenawaranPdfViewer } from "./ProposalPenawaranPdfViewer";
import { deleteProposal } from "@/api/proposal-penawaran";
import type { ProposalPenawaran } from "../types";

interface ProposalPenawaranTableProps {
  proposals: ProposalPenawaran[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value);
}

export function ProposalPenawaranTable({
  proposals,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
}: ProposalPenawaranTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editProposal, setEditProposal] = useState<ProposalPenawaran | null>(null);
  const [viewProposal, setViewProposal] = useState<ProposalPenawaran | null>(null);
  const [pdfProposal, setPdfProposal] = useState<ProposalPenawaran | null>(null);
  const [deleteProposalId, setDeleteProposalId] = useState<string | null>(null);
  const [deleteProposalName, setDeleteProposalName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = proposals.filter((p) => {
    const matchSearch =
      p.coverInfo.jobOffer.toLowerCase().includes(search.toLowerCase()) ||
      p.proposalNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.clientInfo.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteProposalId) return;
    setIsDeleting(true);
    try {
      await deleteProposal(deleteProposalId);
      onRefresh();
      setDeleteProposalId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setEditProposal(null);
    onRefresh();
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="h-4 w-4" /> Proposal Penawaran
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search proposal, client..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button
              className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
              onClick={onAddClick}
            >
              Add Proposal
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  No. Proposal
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Penawaran
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Client
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Total
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow
                  key={p.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {p.proposalNumber}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                    {p.coverInfo.jobOffer}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {p.clientInfo.clientName}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {formatCurrency(p.totalEstimatedCost)}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        p.status === "accepted"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                          : p.status === "rejected"
                            ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500"
                            : p.status === "sent"
                              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500"
                              : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {STATUS_LABELS[p.status] ?? p.status}
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
                        <DropdownMenuItem onClick={() => setViewProposal(p)}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPdfProposal(p)}>
                          <FileText className="h-3.5 w-3.5 mr-2" /> View PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditProposal(p)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteProposalId(p.id);
                            setDeleteProposalName(p.proposalNumber);
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

      <ProposalPenawaranFormDialog
        open={isAddOpen}
        onOpenChange={onAddOpenChange}
        onSuccess={handleAddSuccess}
      />

      <ProposalPenawaranFormDialog
        open={!!editProposal}
        onOpenChange={(open) => !open && setEditProposal(null)}
        proposal={editProposal ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <ProposalPenawaranViewDialog
        proposal={viewProposal}
        onOpenChange={(open) => !open && setViewProposal(null)}
        onEdit={() => {
          if (viewProposal) {
            setViewProposal(null);
            setEditProposal(viewProposal);
          }
        }}
      />

      <ProposalPenawaranPdfViewer
        proposal={pdfProposal}
        onOpenChange={(open) => !open && setPdfProposal(null)}
      />

      <AlertDialog
        open={!!deleteProposalId}
        onOpenChange={(open) => !open && setDeleteProposalId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete proposal <strong>{deleteProposalName}</strong>?
              This action cannot be undone.
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
