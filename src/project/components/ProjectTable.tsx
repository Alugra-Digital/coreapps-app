import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  FolderKanban,
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
import { deleteProject } from "@/api/projects";
import type { Project } from "../types";

interface ProjectTableProps {
  projects: Project[];
  onRefresh: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PIPELINE: "Pipeline",
  NEGOTIATION: "Negosiasi",
  WON: "Won",
  LOST: "Lost",
  ON_PROGRESS: "On Progress",
  on_progress: "On Progress",
  ON_HOLD: "On Hold",
  READY_TO_CLOSE: "Ready to Close",
  COMPLETED: "Completed",
  completed: "Completed",
  CANCELLED: "Cancelled",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  PIPELINE: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500",
  NEGOTIATION: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
  WON: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  LOST: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500",
  ON_PROGRESS: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  on_progress: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500",
  ON_HOLD: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500",
  READY_TO_CLOSE: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500",
  COMPLETED: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400",
  completed: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  CANCELLED: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500",
  cancelled: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function ProjectTable({
  projects,
  onRefresh,
}: ProjectTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = projects.filter((p) => {
    const matchSearch =
      (p.identity.projectId ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.identity.namaProject ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.identity.clientName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.identity.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteProjectId) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteProjectId);
      onRefresh();
      setDeleteProjectId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <FolderKanban className="h-4 w-4" /> Project List
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search Project ID, Name, Client..."
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
              <option value="PIPELINE">Pipeline</option>
              <option value="NEGOTIATION">Negosiasi</option>
              <option value="WON">Won</option>
              <option value="ON_PROGRESS">On Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="READY_TO_CLOSE">Ready to Close</option>
              <option value="COMPLETED">Completed</option>
              <option value="LOST">Lost</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button
              className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
              onClick={() => navigate("/projects/create")}
            >
              Add Project
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Project ID
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Nama Project
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Client
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  PM
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Price
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-400">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow
                  key={p.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-bold text-slate-900 dark:text-foreground hover:text-primary hover:underline"
                    >
                      {p.identity.projectId ?? p.id}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {p.identity.namaProject}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {p.identity.clientName}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {p.identity.projectManagerName || "-"}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[p.identity.status] ?? "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"}`}
                    >
                      {STATUS_LABELS[p.identity.status] ?? p.identity.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {formatCurrency(p.identity.price ?? p.finance.contractValue ?? 0)}
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
                        <DropdownMenuItem onClick={() => navigate(`/projects/${p.id}`)}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/projects/${p.id}/edit`)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteProjectId(p.id);
                            setDeleteProjectName(p.identity.namaProject);
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

      <AlertDialog
        open={!!deleteProjectId}
        onOpenChange={(open) => !open && setDeleteProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteProjectName}</strong>? This action
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
