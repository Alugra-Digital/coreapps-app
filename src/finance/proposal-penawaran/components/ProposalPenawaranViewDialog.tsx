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
import type { ProposalPenawaran } from "../types";

interface ProposalPenawaranViewDialogProps {
  proposal: ProposalPenawaran | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
};

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatDate(dateStr: string): string {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, y, m, d] = match;
    const month = MONTHS_ID[parseInt(m, 10) - 1];
    return `${parseInt(d, 10)} ${month} ${y}`;
  }
  return dateStr;
}

function formatCurrency(value: number, currency: string = "IDR"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export function ProposalPenawaranViewDialog({
  proposal,
  onOpenChange,
  onEdit,
}: ProposalPenawaranViewDialogProps) {
  if (!proposal) return null;

  const { coverInfo, clientInfo, items, documentApproval } = proposal;

  return (
    <Dialog open={!!proposal} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Proposal - {proposal.proposalNumber}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            {/* Cover */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Cover
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Penawaran:</span>{" "}
                  <span className="font-medium">{coverInfo.jobOffer}</span>
                </p>
                <p>
                  <span className="text-slate-500">Nama Perusahaan:</span>{" "}
                  <span className="font-medium">{coverInfo.companyName}</span>
                </p>
                <p>
                  <span className="text-slate-500">Bulan Proposal:</span>{" "}
                  <span className="font-medium">{coverInfo.proposalMonth}</span>
                </p>
                <p>
                  <span className="text-slate-500">Alamat:</span> {coverInfo.address}
                </p>
                <p>
                  <span className="text-slate-500">Tel:</span> {coverInfo.phone}
                </p>
                {coverInfo.email && (
                  <p>
                    <span className="text-slate-500">Email:</span> {coverInfo.email}
                  </p>
                )}
              </div>
            </section>

            {/* Content & Client */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Isi & Klien
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Nomor Proposal:</span>{" "}
                  <span className="font-medium">{proposal.proposalNumber}</span>
                </p>
                <p>
                  <span className="text-slate-500">Client:</span>{" "}
                  <span className="font-medium">{clientInfo.clientName}</span>
                </p>
                {clientInfo.contactPerson && (
                  <p>
                    <span className="text-slate-500">Contact Person:</span>{" "}
                    {clientInfo.contactPerson}
                  </p>
                )}
                {clientInfo.email && (
                  <p>
                    <span className="text-slate-500">Email:</span> {clientInfo.email}
                  </p>
                )}
                {clientInfo.phone && (
                  <p>
                    <span className="text-slate-500">Phone:</span> {clientInfo.phone}
                  </p>
                )}
                <p>
                  <span className="text-slate-500">Status:</span>{" "}
                  <span className="font-medium">{STATUS_LABELS[proposal.status] ?? proposal.status}</span>
                </p>
              </div>
            </section>

            {/* Items */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Detail Penawaran Pekerjaan/Jasa
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5">
                    <tr>
                      <th className="text-left p-2 text-[10px] font-bold text-slate-500">No</th>
                      <th className="text-left p-2 text-[10px] font-bold text-slate-500">Deskripsi</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Qty</th>
                      <th className="text-left p-2 text-[10px] font-bold text-slate-500">Volume</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Price</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.number} className="border-t border-slate-100 dark:border-white/5">
                        <td className="p-2">{item.number}</td>
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2">{item.volume}</td>
                        <td className="p-2 text-right">{formatCurrency(item.unitPrice, proposal.currency)}</td>
                        <td className="p-2 text-right font-medium">
                          {formatCurrency(item.totalPrice, proposal.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-foreground">
                  Total: {formatCurrency(proposal.totalEstimatedCost, proposal.currency)} (
                  {proposal.totalEstimatedCostInWords})
                </span>
              </div>
            </section>

            {/* Scope & Terms */}
            {(proposal.scopeOfWork.length > 0 || proposal.termsAndConditions.length > 0) && (
              <section>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Lingkup Pekerjaan & Syarat & Kondisi
                </h3>
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-3 text-sm">
                  {proposal.scopeOfWork.length > 0 && (
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">Lingkup Pekerjaan:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {proposal.scopeOfWork.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {proposal.termsAndConditions.length > 0 && (
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">Syarat dan Kondisi:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {proposal.termsAndConditions.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {proposal.notes && (
                    <p>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Notes:</span>{" "}
                      {proposal.notes}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Approval */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Pengesahan Dokumen
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-1 text-sm">
                <p className="text-slate-600 dark:text-slate-400">
                  {documentApproval.place}, {formatDate(documentApproval.date)}
                </p>
                <p className="font-semibold text-slate-900 dark:text-foreground">
                  {documentApproval.signerName}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{documentApproval.signerPosition}</p>
                {documentApproval.signatureUrl && (
                  <img
                    src={documentApproval.signatureUrl}
                    alt="Signature"
                    className="h-12 w-auto mt-2"
                  />
                )}
              </div>
            </section>
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
