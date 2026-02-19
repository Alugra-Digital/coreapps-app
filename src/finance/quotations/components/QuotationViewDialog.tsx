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
import type { Quotation } from "../types";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
};

interface QuotationViewDialogProps {
  quotation: Quotation | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function QuotationViewDialog({
  quotation,
  onOpenChange,
  onEdit,
}: QuotationViewDialogProps) {
  if (!quotation) return null;

  return (
    <Dialog open={!!quotation} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Quotation - {quotation.quotationNumber}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                General Info
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p><span className="text-slate-500">Number:</span> <span className="font-medium">{quotation.quotationNumber}</span></p>
                <p><span className="text-slate-500">Date:</span> {quotation.quotationDate}</p>
                {quotation.validUntil && <p><span className="text-slate-500">Valid Until:</span> {quotation.validUntil}</p>}
                <p><span className="text-slate-500">Client:</span> {quotation.clientName}</p>
                {quotation.projectName && <p><span className="text-slate-500">Project:</span> {quotation.projectName}</p>}
                <p><span className="text-slate-500">Service:</span> {quotation.serviceOffered}</p>
                <p><span className="text-slate-500">Month:</span> {quotation.quotationMonth}</p>
                <p><span className="text-slate-500">Status:</span> <span className="font-medium">{STATUS_LABELS[quotation.status] ?? quotation.status}</span></p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Line Items
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5">
                    <tr>
                      <th className="text-left p-2 text-[10px] font-bold">No</th>
                      <th className="text-left p-2 text-[10px] font-bold">Description</th>
                      <th className="text-right p-2 text-[10px] font-bold">Qty</th>
                      <th className="text-left p-2 text-[10px] font-bold">Unit</th>
                      <th className="text-right p-2 text-[10px] font-bold">Price</th>
                      <th className="text-right p-2 text-[10px] font-bold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.lineItems.map((item) => (
                      <tr key={item.number} className="border-t">
                        <td className="p-2">{item.number}</td>
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2">{item.unit}</td>
                        <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-2 text-right">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-right space-y-1 text-sm">
                <p>Subtotal: {formatCurrency(quotation.subtotal)}</p>
                <p>Tax: {formatCurrency(quotation.taxAmount)}</p>
                <p className="font-bold">Grand Total: {formatCurrency(quotation.grandTotal)}</p>
              </div>
            </section>

            {(quotation.paymentTerms || quotation.validityPeriod || quotation.termsConditions) && (
              <section>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Terms
                </h3>
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                  {quotation.paymentTerms && <p><span className="text-slate-500">Payment:</span> {quotation.paymentTerms}</p>}
                  {quotation.validityPeriod && <p><span className="text-slate-500">Validity:</span> {quotation.validityPeriod}</p>}
                  {quotation.termsConditions && <p><span className="text-slate-500">Terms:</span> {quotation.termsConditions}</p>}
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
