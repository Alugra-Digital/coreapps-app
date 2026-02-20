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
import type { Invoice } from "../types";

interface InvoiceViewDialogProps {
  invoice: Invoice | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function InvoiceViewDialog({
  invoice,
  onOpenChange,
  onEdit,
}: InvoiceViewDialogProps) {
  if (!invoice) return null;

  const {
    companyInfo,
    invoiceInfo,
    billingInfo,
    lineItems,
    paymentInfo,
    approval,
    notes,
  } = invoice;

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + (item.priceAfterTax ?? item.subtotal),
    0
  );

  return (
    <Dialog open={!!invoice} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Invoice - {invoiceInfo.invoiceNumber}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            {/* Company Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Informasi Perusahaan
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                {companyInfo.letterhead && (
                  <p className="text-slate-600 dark:text-slate-400">{companyInfo.letterhead}</p>
                )}
                <p className="font-semibold text-slate-900 dark:text-foreground">
                  {companyInfo.companyName}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{companyInfo.address}</p>
                <p className="text-slate-600 dark:text-slate-400">Tel: {companyInfo.phone}</p>
              </div>
            </section>

            {/* Invoice Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Informasi Invoice
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Nama Invoice:</span>{" "}
                  <span className="font-medium">{invoiceInfo.invoiceName}</span>
                </div>
                <div>
                  <span className="text-slate-500">No. Invoice:</span>{" "}
                  <span className="font-medium">{invoiceInfo.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Tanggal Inv.:</span>{" "}
                  <span className="font-medium">{invoiceInfo.invoiceDate}</span>
                </div>
                <div>
                  <span className="text-slate-500">Faktur Pajak:</span>{" "}
                  <span className="font-medium">{invoiceInfo.taxInvoice ?? "-"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Jatuh Tempo:</span>{" "}
                  <span className="font-medium">{invoiceInfo.dueDate}</span>
                </div>
              </div>
            </section>

            {/* Billing Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Informasi Tagihan
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-semibold text-slate-900 dark:text-foreground">
                  {billingInfo.companyName}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{billingInfo.address}</p>
                <p className="text-slate-600 dark:text-slate-400">Tel: {billingInfo.phone}</p>
                <p className="text-slate-600 dark:text-slate-400">
                  PIC: {billingInfo.pic.name} ({billingInfo.pic.position}) - {billingInfo.pic.contact}
                </p>
              </div>
            </section>

            {/* Line Items */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Detail Pesanan
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5">
                    <tr>
                      <th className="text-left p-2 text-[10px] font-bold text-slate-500">No</th>
                      <th className="text-left p-2 text-[10px] font-bold text-slate-500">Item</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Qty</th>
                      <th className="text-left p-2 text-[10px] font-bold text-slate-500">Unit</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Price</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Subtotal</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">DPP</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Tax</th>
                      <th className="text-right p-2 text-[10px] font-bold text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.number} className="border-t border-slate-100 dark:border-white/5">
                        <td className="p-2">{item.number}</td>
                        <td className="p-2">{item.itemDescription}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2">{item.unit}</td>
                        <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                        <td className="p-2 text-right">{formatCurrency(item.subtotal)}</td>
                        <td className="p-2 text-right">
                          {formatCurrency(item.dpp ?? (11 / 12) * (item.subtotal ?? 0))}
                        </td>
                        <td className="p-2 text-right">
                          {item.taxRate ? `${item.taxRate}%` : "-"} /{" "}
                          {formatCurrency(item.taxAmount ?? 0)}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {formatCurrency(item.priceAfterTax ?? item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-foreground">
                  Grand Total: {formatCurrency(totalAmount)}
                </span>
              </div>
            </section>

            {/* Payment Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Informasi Pembayaran
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Bank:</span> {paymentInfo.bank}
                </p>
                <p>
                  <span className="text-slate-500">Nomor Akun:</span> {paymentInfo.accountNumber}
                </p>
                <p>
                  <span className="text-slate-500">Cabang:</span> {paymentInfo.branch}
                </p>
                <p>
                  <span className="text-slate-500">Nama Akun:</span> {paymentInfo.accountName}
                </p>
                {paymentInfo.npwp && (
                  <p>
                    <span className="text-slate-500">NPWP:</span> {paymentInfo.npwp}
                  </p>
                )}
              </div>
            </section>

            {/* Notes */}
            {notes && (
              <section>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Notes / Terms and Conditions
                </h3>
                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 text-sm">
                  {notes}
                </div>
              </section>
            )}

            {/* Approval */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Pengesahan Dokumen
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-1 text-sm">
                <p className="font-semibold text-slate-900 dark:text-foreground">
                  {approval.position}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{approval.name}</p>
                {approval.signatureUrl && (
                  <img
                    src={approval.signatureUrl}
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
