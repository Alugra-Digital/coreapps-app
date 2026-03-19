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
import { Badge } from "@/components/ui/badge";
import { terbilang } from "@/lib/currency";
import type { ProposalPenawaran } from "../types";

interface ProposalPenawaranViewDialogProps {
  proposal: ProposalPenawaran | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number, currency = "IDR"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const MONTHS_ID = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, y, m, d] = match;
    return `${parseInt(d, 10)} ${MONTHS_ID[parseInt(m, 10) - 1]} ${y}`;
  }
  return dateStr;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-2 py-1 text-sm">
      <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
      <span className="font-medium text-slate-900 dark:text-foreground break-words">{value ?? "—"}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600" },
    sent: { label: "Sent", className: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700" },
    accepted: { label: "Accepted", className: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700" },
    rejected: { label: "Rejected", className: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700" },
  };
  const c = config[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={`text-xs font-semibold px-2 py-0.5 ${c.className}`}>
      {c.label}
    </Badge>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProposalPenawaranViewDialog({
  proposal,
  onOpenChange,
  onEdit,
}: ProposalPenawaranViewDialogProps) {
  if (!proposal) return null;

  const { coverInfo, clientInfo, items, documentApproval } = proposal;
  const total = proposal.totalEstimatedCost ?? 0;
  const currency = proposal.currency ?? "IDR";
  const terbilangText = total > 0 ? terbilang(total) + " Rupiah" : proposal.totalEstimatedCostInWords;

  return (
    <Dialog open={!!proposal} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-white/10 shrink-0">
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-foreground">
            Proposal — {proposal.proposalNumber}
          </DialogTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {coverInfo.jobOffer}
          </p>
        </DialogHeader>

        {/* Body */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-5">

            {/* ── COVER ── */}
            <section className="space-y-1">
              <SectionDivider label="Cover" />
              <div className="pt-1">
                <Row label="Penawaran" value={coverInfo.jobOffer} />
                <Row label="Nama Perusahaan" value={coverInfo.companyName} />
                <Row label="Bulan Proposal" value={coverInfo.proposalMonth} />
                <Row label="Alamat" value={coverInfo.address} />
                <Row label="Telepon" value={coverInfo.phone} />
                {coverInfo.email && <Row label="Email" value={coverInfo.email} />}
              </div>
            </section>

            {/* ── ISI & KLIEN ── */}
            <section className="space-y-1">
              <SectionDivider label="Isi & Klien" />
              <div className="pt-1">
                <Row label="Nomor Proposal" value={proposal.proposalNumber} />
                <Row label="Client" value={clientInfo.clientName} />
                {clientInfo.contactPerson && <Row label="Contact Person" value={clientInfo.contactPerson} />}
                {clientInfo.email && <Row label="Email Client" value={clientInfo.email} />}
                {clientInfo.phone && <Row label="Phone Client" value={clientInfo.phone} />}
                <div className="grid grid-cols-[180px_1fr] gap-2 py-1 text-sm items-center">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <StatusBadge status={proposal.status} />
                </div>
              </div>
            </section>

            {/* ── DETAIL PENAWARAN ── */}
            <section className="space-y-0">
              <SectionDivider label="Detail Penawaran Pekerjaan/Jasa" />
              <div className="w-full overflow-x-auto rounded-md border border-slate-200 dark:border-white/10 mt-2">
                <table className="w-full text-xs min-w-[550px]">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border text-[10px] uppercase text-muted-foreground">
                      <th className="px-2 py-2 font-semibold text-center w-[5%]">No</th>
                      <th className="px-2 py-2 font-semibold text-left w-[45%]">Deskripsi</th>
                      <th className="px-2 py-2 font-semibold text-center w-[8%]">Qty</th>
                      <th className="px-2 py-2 font-semibold text-center w-[8%]">Vol</th>
                      <th className="px-2 py-2 font-semibold text-right w-[15%]">Price</th>
                      <th className="px-2 py-2 font-semibold text-right w-[19%]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={item.number ?? idx}
                        className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 !== 0 ? "bg-muted/20" : ""
                          }`}
                      >
                        <td className="px-2 py-2.5 text-center text-slate-500 dark:text-slate-400">{item.number}</td>
                        <td className="px-2 py-2.5 font-medium text-slate-900 dark:text-foreground">{item.description}</td>
                        <td className="px-2 py-2.5 text-center text-slate-600 dark:text-slate-300">{item.quantity}</td>
                        <td className="px-2 py-2.5 text-center text-slate-500 dark:text-slate-400">{item.volume}</td>
                        <td className="px-2 py-2.5 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap tabular-nums">
                          {formatCurrency(item.unitPrice, currency)}
                        </td>
                        <td className="px-2 py-2.5 text-right font-semibold text-slate-900 dark:text-foreground whitespace-nowrap tabular-nums">
                          {formatCurrency(item.totalPrice, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td colSpan={5} className="px-2 py-2 text-right text-xs font-bold text-slate-900 dark:text-foreground">
                        Total
                      </td>
                      <td className="px-2 py-2 text-right text-xs font-bold text-slate-900 dark:text-foreground whitespace-nowrap tabular-nums">
                        {formatCurrency(total, currency)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="px-2 pb-2 text-right">
                        <span className="text-[11px] italic text-muted-foreground leading-tight block mt-0.5">{terbilangText}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

            </section>

            {/* ── LINGKUP & SYARAT ── */}
            {(proposal.scopeOfWork.length > 0 || proposal.termsAndConditions.length > 0) && (
              <section className="space-y-2">
                <SectionDivider label="Lingkup Pekerjaan & Syarat & Kondisi" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {proposal.scopeOfWork.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Lingkup Pekerjaan
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {proposal.scopeOfWork.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {proposal.termsAndConditions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Syarat & Kondisi
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {proposal.termsAndConditions.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
                {proposal.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Catatan: </span>
                    {proposal.notes}
                  </p>
                )}
              </section>
            )}

            {/* ── PENGESAHAN DOKUMEN ── */}
            <section className="space-y-1">
              <SectionDivider label="Pengesahan Dokumen" />
              <div className="pt-1">
                <Row label="Tempat, Tanggal" value={`${documentApproval.place}, ${formatDate(documentApproval.date)}`} />
                <Row label="Penandatangan" value={documentApproval.signerName} />
                <Row label="Jabatan" value={documentApproval.signerPosition} />
                {documentApproval.signatureUrl && (
                  <div className="grid grid-cols-[180px_1fr] gap-2 py-1">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Tanda Tangan</span>
                    <img
                      src={documentApproval.signatureUrl}
                      alt="Signature"
                      className="h-14 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </section>

          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-slate-100 dark:border-white/10 shrink-0">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  );
}
