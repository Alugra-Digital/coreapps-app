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
import type { Project } from "../types";

interface ProjectViewDialogProps {
  project: Project | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function ProjectViewDialog({
  project,
  onOpenChange,
  onEdit,
}: ProjectViewDialogProps) {
  if (!project) return null;

  const { identity, documentRelations, documents } = project;
  const expenses = project.expenses ?? [];
  const preCost = expenses.filter((e) => e.phase === "PRE_COST");
  const onGoing = expenses.filter((e) => e.phase === "ON_GOING" || !e.phase);
  const totalExpense = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <Dialog open={!!project} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Project - {identity.projectId}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            {/* Identity */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Identitas Project
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Project ID:</span>{" "}
                  <span className="font-medium">{identity.projectId}</span>
                </p>
                <p>
                  <span className="text-slate-500">Nama Project:</span>{" "}
                  <span className="font-medium">{identity.namaProject}</span>
                </p>
                <p>
                  <span className="text-slate-500">Klien:</span>{" "}
                  <span className="font-medium">{identity.clientName}</span>
                </p>
                {identity.scopeProject && (
                  <p>
                    <span className="text-slate-500">Scope:</span>{" "}
                    {identity.scopeProject}
                  </p>
                )}
                <p>
                  <span className="text-slate-500">Price / Contract Value:</span>{" "}
                  <span className="font-medium">{formatCurrency(identity.price ?? 0)}</span>
                </p>
                <p>
                  <span className="text-slate-500">Start - End:</span>{" "}
                  {identity.startDate} - {identity.endDate}
                </p>
                <p>
                  <span className="text-slate-500">Project Manager:</span>{" "}
                  <span className="font-medium">{identity.projectManagerName || "-"}</span>
                </p>
                <p>
                  <span className="text-slate-500">Status:</span>{" "}
                  <span className="font-medium">{STATUS_LABELS[identity.status] ?? identity.status}</span>
                </p>
              </div>
            </section>

            {/* Document Relations */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Relasi Dokumen
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {documentRelations.proposalIds.length > 0 && (
                  <div>
                    <span className="text-slate-500">Proposal:</span>{" "}
                    {documentRelations.proposalIds.join(", ")}
                  </div>
                )}
                {documentRelations.quotationIds.length > 0 && (
                  <div>
                    <span className="text-slate-500">Quotation:</span>{" "}
                    {documentRelations.quotationIds.join(", ")}
                  </div>
                )}
                {documentRelations.purchaseOrderIds.length > 0 && (
                  <div>
                    <span className="text-slate-500">PO:</span>{" "}
                    {documentRelations.purchaseOrderIds.join(", ")}
                  </div>
                )}
                {documentRelations.invoiceIds.length > 0 && (
                  <div>
                    <span className="text-slate-500">Invoice:</span>{" "}
                    {documentRelations.invoiceIds.join(", ")}
                  </div>
                )}
                {documentRelations.bastIds.length > 0 && (
                  <div>
                    <span className="text-slate-500">BAST:</span>{" "}
                    {documentRelations.bastIds.join(", ")}
                  </div>
                )}
                {documentRelations.proposalIds.length === 0 &&
                  documentRelations.quotationIds.length === 0 &&
                  documentRelations.purchaseOrderIds.length === 0 &&
                  documentRelations.invoiceIds.length === 0 &&
                  documentRelations.bastIds.length === 0 && (
                    <p className="text-slate-500 col-span-2">No documents linked</p>
                  )}
              </div>
            </section>

            {/* Finance — Expense Summary */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Keuangan Project
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Total Expense:</span>{" "}
                  <span className="font-medium">{formatCurrency(totalExpense)}</span>
                </p>
                {preCost.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Pre-cost</p>
                    {preCost.map((e, i) => (
                      <p key={i} className="flex justify-between text-xs">
                        <span>{e.description} <span className="text-slate-400">({e.date})</span></span>
                        <span>{formatCurrency(e.amount)}</span>
                      </p>
                    ))}
                  </div>
                )}
                {onGoing.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">On-going</p>
                    {onGoing.map((e, i) => (
                      <p key={i} className="flex justify-between text-xs">
                        <span>{e.description} <span className="text-slate-400">({e.date})</span></span>
                        <span>{formatCurrency(e.amount)}</span>
                      </p>
                    ))}
                  </div>
                )}
                {expenses.length === 0 && (
                  <p className="text-slate-500">No expenses recorded.</p>
                )}
              </div>
            </section>

            {/* Documentation */}
            {documents.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Dokumentasi Project
                </h3>
                <div className="space-y-2">
                  {documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5"
                    >
                      <div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {doc.name}
                        </a>
                        <span className="text-xs text-slate-500 ml-2">({doc.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
