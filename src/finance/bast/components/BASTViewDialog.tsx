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
import type { BAST } from "../types";

interface BASTViewDialogProps {
  bast: BAST | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

function formatBastMonth(month: string): string {
  if (!month) return "-";
  const [year, mo] = month.split("-");
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const idx = parseInt(mo, 10) - 1;
  return idx >= 0 && idx < 12 ? `${months[idx]} ${year}` : month;
}

export function BASTViewDialog({
  bast,
  onOpenChange,
  onEdit,
}: BASTViewDialogProps) {
  if (!bast) return null;

  const { coverInfo, documentInfo, deliveringParty, receivingParty } = bast;

  return (
    <Dialog open={!!bast} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>BAST - {documentInfo.bastNumber}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            {/* Cover Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Cover
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Penawaran pekerjaan/jasa:</span>{" "}
                  <span className="font-medium">{coverInfo.jobOffer}</span>
                </p>
                <p>
                  <span className="text-slate-500">Nama Perusahaan:</span>{" "}
                  <span className="font-medium">{coverInfo.companyName}</span>
                </p>
                <p>
                  <span className="text-slate-500">Bulan BAST:</span>{" "}
                  <span className="font-medium">{formatBastMonth(coverInfo.bastMonth)}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-400">{coverInfo.address}</p>
                <p className="text-slate-600 dark:text-slate-400">Tel: {coverInfo.phone}</p>
              </div>
            </section>

            {/* Document Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Informasi Dokumen
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Nomor BAST:</span>{" "}
                  <span className="font-medium">{documentInfo.bastNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Tanggal BAST:</span>{" "}
                  <span className="font-medium">{documentInfo.bastDate}</span>
                </div>
                <div>
                  <span className="text-slate-500">Nomor PO/Invoice Terkait:</span>{" "}
                  <span className="font-medium">{documentInfo.relatedPoOrInvoice ?? "-"}</span>
                </div>
              </div>
            </section>

            {/* Delivering Party */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Pihak Penyerah
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-semibold text-slate-900 dark:text-foreground">
                  {deliveringParty.name}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {deliveringParty.position} - {deliveringParty.company}
                </p>
                {deliveringParty.signatureUrl && (
                  <img
                    src={deliveringParty.signatureUrl}
                    alt="Signature"
                    className="h-12 w-auto mt-2"
                  />
                )}
              </div>
            </section>

            {/* Receiving Party */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Pihak Penerima
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-semibold text-slate-900 dark:text-foreground">
                  {receivingParty.name}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {receivingParty.position} - {receivingParty.company}
                </p>
                {receivingParty.signatureUrl && (
                  <img
                    src={receivingParty.signatureUrl}
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
