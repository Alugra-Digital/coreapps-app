import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, ExternalLink, FileText, Pencil } from "lucide-react";
import type { ClientPurchaseOrder } from "../clientPurchaseOrderTypes";

interface ClientPurchaseOrderViewDialogProps {
    purchaseOrder: ClientPurchaseOrder | null;
    onOpenChange: (open: boolean) => void;
    onEdit: () => void;
    onVerify: () => void;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    RECEIVED: { label: "Received", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    VERIFIED: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    EXPIRED: { label: "Expired", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    CANCELLED: { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export function ClientPurchaseOrderViewDialog({
    purchaseOrder,
    onOpenChange,
    onEdit,
    onVerify,
}: ClientPurchaseOrderViewDialogProps) {
    if (!purchaseOrder) return null;

    const status = statusConfig[purchaseOrder.status] ?? statusConfig.RECEIVED;

    return (
        <Dialog open={!!purchaseOrder} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-[#111113] border-[#1E1E22] text-[#F0F0F0] p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">PO Masuk — {purchaseOrder.cpoNumber}</DialogTitle>
                        <Badge variant="outline" className={`${status.bg} ${status.color} text-xs border`}>
                            {status.label}
                        </Badge>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] px-6">
                    <div className="space-y-6 pb-6">
                        {/* Key Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="CPO Number" value={purchaseOrder.cpoNumber} />
                            <InfoItem label="Client" value={purchaseOrder.clientName || '-'} />
                            <InfoItem label="Project" value={purchaseOrder.projectName || '-'} />
                            <InfoItem label="Amount" value={formatCurrency(purchaseOrder.amount)} highlight />
                            <InfoItem label="Issued Date" value={purchaseOrder.issuedDate ? new Date(purchaseOrder.issuedDate).toLocaleDateString("id-ID") : '-'} />
                            <InfoItem label="Received Date" value={purchaseOrder.receivedDate ? new Date(purchaseOrder.receivedDate).toLocaleDateString("id-ID") : '-'} />
                            <InfoItem label="Valid Until" value={purchaseOrder.validUntil ? new Date(purchaseOrder.validUntil).toLocaleDateString("id-ID") : '-'} />
                            <InfoItem label="Currency" value={`${purchaseOrder.currency} ${purchaseOrder.ppnIncluded ? '(incl. PPN)' : '(excl. PPN)'}`} />
                        </div>

                        {/* Description */}
                        {purchaseOrder.description && (
                            <div className="bg-[#0A0A0B] border border-[#1E1E22] rounded-xl p-4">
                                <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest mb-2">Description</p>
                                <p className="text-sm text-[#9A9AA5]">{purchaseOrder.description}</p>
                            </div>
                        )}

                        {/* Payment Terms */}
                        {purchaseOrder.paymentTerms && (
                            <div className="bg-[#0A0A0B] border border-[#1E1E22] rounded-xl p-4">
                                <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest mb-2">Payment Terms</p>
                                <p className="text-sm text-[#9A9AA5]">{purchaseOrder.paymentTerms}</p>
                            </div>
                        )}

                        {/* PDF Attachment */}
                        {purchaseOrder.attachmentUrl && (
                            <div className="bg-[#0A0A0B] border border-[#F5A623]/20 rounded-xl p-4 space-y-3">
                                <p className="text-[10px] font-bold text-[#F5A623] uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Client PO Attachment
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#F0F0F0]">{purchaseOrder.attachmentName || 'Attached PDF'}</span>
                                    <a
                                        href={purchaseOrder.attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-[#F5A623] hover:text-[#D98E1C] transition-colors"
                                    >
                                        Open <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                                {/* Embedded PDF viewer */}
                                <iframe
                                    src={purchaseOrder.attachmentUrl}
                                    title={`Client PO ${purchaseOrder.cpoNumber}`}
                                    className="w-full h-[400px] border border-[#1E1E22] rounded-lg bg-white"
                                />
                            </div>
                        )}

                        {/* Notes */}
                        {purchaseOrder.notes && (
                            <div className="bg-[#0A0A0B] border border-[#1E1E22] rounded-xl p-4">
                                <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest mb-2">Internal Notes</p>
                                <p className="text-sm text-[#9A9AA5]">{purchaseOrder.notes}</p>
                            </div>
                        )}

                        {/* Verification Info */}
                        {purchaseOrder.verifiedAt && (
                            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                                <CheckCircle className="h-4 w-4" />
                                Verified at {new Date(purchaseOrder.verifiedAt).toLocaleString("id-ID")}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-0 border-t border-[#1E1E22] flex gap-2">
                    <Button variant="outline" onClick={onEdit} className="bg-[#1E1E22] text-[#F0F0F0] hover:bg-[#2A2A2E]">
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    {purchaseOrder.status === 'RECEIVED' && (
                        <Button onClick={onVerify} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                            <CheckCircle className="h-4 w-4 mr-2" /> Verify PO
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="bg-[#0A0A0B] border border-[#1E1E22] rounded-lg px-4 py-3">
            <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-medium ${highlight ? 'text-[#F5A623] font-bold' : 'text-[#F0F0F0]'}`}>{value}</p>
        </div>
    );
}
