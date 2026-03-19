import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    FileText,
    Calendar,
    Building2,
    User,
    CreditCard,
    CheckCircle2,
    Download,
    Phone,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePurchaseOrderById } from "@/hooks/usePurchaseOrders";
import { PurchaseOrderPdfViewer } from "../components/PurchaseOrderPdfViewer";
import { PageLoader } from "@/components/ui/PageLoader";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PurchaseOrderStatus } from "../types";

const STATUS_STYLES: Record<PurchaseOrderStatus, string> = {
    DRAFT: "bg-[#6B6B75]/10 text-[#6B6B75] border-[#6B6B75]/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    SENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    RECEIVED: "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20",
};

export default function PurchaseOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: purchaseOrder, isLoading } = usePurchaseOrderById(id);
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!purchaseOrder) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6">
                <Card className="bg-[#111113] border-[#1E1E22] p-8 max-w-md w-full text-center space-y-6">
                    <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-[#F0F0F0]">Purchase Order Not Found</h2>
                        <p className="text-[#6B6B75] text-sm">The purchase order you are looking for does not exist or has been removed.</p>
                    </div>
                    <Button
                        onClick={() => navigate("/finance/purchase-orders")}
                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold w-full"
                    >
                        Return to List
                    </Button>
                </Card>
            </div>
        );
    }

    const { companyInfo, orderInfo, vendorInfo, lineItems, paymentProcedure, otherTerms, approval } = purchaseOrder;

    const totalAmount = lineItems.reduce(
        (sum, item) => sum + (item.priceAfterTax ?? item.subtotal),
        0
    );

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link
                            to="/finance/purchase-orders"
                            className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Purchase Orders
                        </Link>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-extrabold tracking-tight">
                                    {orderInfo.poNumber}
                                </h1>
                                <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${STATUS_STYLES[(purchaseOrder.status ?? 'DRAFT') as PurchaseOrderStatus] ?? STATUS_STYLES.DRAFT}`}>
                                    {purchaseOrder.status ?? 'DRAFT'}
                                </Badge>
                            </div>
                            <p className="text-[#6B6B75] font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Issued on {new Date(orderInfo.poDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsPdfOpen(true)}
                            className="border-[#1E1E22] bg-[#111113] text-[#F0F0F0] hover:bg-[#1E1E22] hover:text-[#F5A623] px-6"
                        >
                            <Download className="h-4 w-4 mr-2" /> PDF Preview
                        </Button>
                        <Button
                            onClick={() => navigate(`/finance/purchase-orders/${id}/edit`)}
                            className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-6 shadow-lg shadow-[#F5A623]/10"
                        >
                            <Pencil className="h-4 w-4 mr-2" /> Edit Document
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Card */}
                        <Card className="bg-[#111113] border-[#1E1E22] overflow-hidden">
                            <div className="bg-[#F5A623]/5 px-8 py-6 border-b border-[#1E1E22] flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">Total Value</p>
                                    <p className="text-3xl font-extrabold text-[#F5A623]">{formatCurrency(totalAmount)}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">Items Count</p>
                                    <p className="text-2xl font-bold text-[#F0F0F0]">{lineItems.length}</p>
                                </div>
                            </div>

                            <div className="p-0">
                                <Table>
                                    <TableHeader className="bg-[#0A0A0B]">
                                        <TableRow className="border-[#1E1E22] hover:bg-transparent">
                                            <TableHead className="text-[#6B6B75] font-bold text-[10px] uppercase tracking-wider py-4 w-[5%]">No</TableHead>
                                            <TableHead className="text-[#6B6B75] font-bold text-[10px] uppercase tracking-wider py-4 w-[45%]">Item Description</TableHead>
                                            <TableHead className="text-[#6B6B75] font-bold text-[10px] uppercase tracking-wider py-4 text-center">Qty/Unit</TableHead>
                                            <TableHead className="text-[#6B6B75] font-bold text-[10px] uppercase tracking-wider py-4 text-right">Tax (%)</TableHead>
                                            <TableHead className="text-[#6B6B75] font-bold text-[10px] uppercase tracking-wider py-4 text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lineItems.map((item, index) => (
                                            <TableRow key={item.number} className="border-[#1E1E22] hover:bg-white/[0.02] transition-colors">
                                                <TableCell className="text-[#6B6B75] font-medium py-4">{index + 1}</TableCell>
                                                <TableCell className="py-4">
                                                    <div className="font-semibold text-[#F0F0F0]">{item.itemDescription}</div>
                                                    <div className="text-[10px] text-[#6B6B75] mt-0.5">{formatCurrency(item.price)} per {item.unit}</div>
                                                </TableCell>
                                                <TableCell className="text-center py-4 font-medium">
                                                    <span className="text-[#F0F0F0]">{item.quantity}</span>
                                                    <span className="text-[#6B6B75] text-xs ml-1">{item.unit}</span>
                                                </TableCell>
                                                <TableCell className="text-right py-4 text-[#F0F0F0] font-medium">
                                                    {item.taxRate ?? 0}%
                                                </TableCell>
                                                <TableCell className="text-right py-4 font-bold text-[#F0F0F0]">
                                                    {formatCurrency(item.priceAfterTax ?? item.subtotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                        {/* Terms & Conditions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-[#F5A623]" />
                                    <h3 className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Payment Procedure</h3>
                                </div>
                                <p className="text-sm text-[#F0F0F0] leading-relaxed">
                                    {paymentProcedure || "Standard 30-day payment term upon invoice receipt."}
                                </p>
                            </Card>

                            <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-[#F5A623]" />
                                    <h3 className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Other Terms</h3>
                                </div>
                                <p className="text-sm text-[#F0F0F0] leading-relaxed">
                                    {otherTerms || "Please include PO number on all related correspondence and shipping documents."}
                                </p>
                            </Card>
                        </div>

                        {/* Approval Section */}
                        <Card className="bg-[#111113] border-[#1E1E22] p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Document Validation</h3>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-[#F0F0F0]">{approval.name}</p>
                                        <p className="text-xs text-[#6B6B75] uppercase tracking-wider">{approval.position}</p>
                                    </div>
                                </div>
                                <div className="h-24 w-48 border border-[#1E1E22] bg-[#0A0A0B] rounded-xl flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                                    {approval.signatureUrl ? (
                                        <img src={approval.signatureUrl} alt="Signature" className="h-full object-contain p-4 invert opacity-80" />
                                    ) : (
                                        <p className="text-[10px] text-[#6B6B75] uppercase tracking-widest font-bold">Awaiting Signature</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Company Card */}
                        <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-[#F5A623]" />
                                <h3 className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Sender Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-[#F0F0F0]">{companyInfo.companyName}</p>
                                    <p className="text-xs text-[#6B6B75] leading-relaxed">{companyInfo.address}</p>
                                </div>
                                <div className="space-y-2 pt-2 border-t border-[#1E1E22]">
                                    <div className="flex items-center gap-3 text-xs text-[#6B6B75]">
                                        <Phone className="h-3.5 w-3.5 text-[#F5A623]/60" />
                                        {companyInfo.phone}
                                    </div>
                                    {companyInfo.letterhead && (
                                        <div className="flex items-center gap-3 text-xs text-[#6B6B75]">
                                            <FileText className="h-3.5 w-3.5 text-[#F5A623]/60" />
                                            {companyInfo.letterhead}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Vendor Card */}
                        <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-6">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-[#F5A623]" />
                                <h3 className="text-xs font-bold text-[#F5A623] uppercase tracking-[0.2em]">Recipient Vendor</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1 text-center bg-[#0A0A0B] border border-[#1E1E22] rounded-xl p-4">
                                        <p className="text-sm font-bold text-[#F0F0F0]">{vendorInfo.vendorName}</p>
                                        <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">{vendorInfo.phone}</p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Contact Person</span>
                                        </div>
                                        <div className="p-4 bg-[#0A0A0B] border border-[#1E1E22] rounded-xl space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center text-[#F5A623] text-xs font-bold">
                                                    {vendorInfo.pic?.name?.charAt(0) ?? "?"}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-[#F0F0F0]">{vendorInfo.pic?.name ?? "N/A"}</p>
                                                    <p className="text-[10px] text-[#6B6B75] uppercase font-bold tracking-wider">{vendorInfo.pic?.position}</p>
                                                </div>
                                            </div>
                                            <Separator className="bg-[#1E1E22]" />
                                            <div className="flex items-center gap-2 text-xs text-[#F5A623]">
                                                <Phone className="h-3.5 w-3.5" />
                                                <span className="font-medium">{vendorInfo.pic?.contact}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions/Metadata */}
                        <div className="p-6 bg-[#F5A623]/5 border border-[#F5A623]/10 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-[#F5A623]" />
                                <h4 className="text-[10px] font-bold text-[#F5A623] uppercase tracking-[0.2em]">Audit Note</h4>
                            </div>
                            <p className="text-[11px] text-[#6B6B75] leading-relaxed">
                                This PO document is legally binding. Any discrepancies in item quantities or pricing must be reported within 48 hours of receipt.
                            </p>
                            <Separator className="bg-[#F5A623]/20" />
                            <div className="flex justify-between items-center text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">
                                <span>Reference</span>
                                <span className="text-[#F0F0F0]">{orderInfo.docReference || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Preview Dialog */}
            <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 bg-[#0A0A0B] border-[#1E1E22]">
                    <DialogHeader className="p-6 border-b border-[#1E1E22]">
                        <DialogTitle className="text-[#F0F0F0] flex items-center justify-between">
                            Draft Document Preview
                            <Button size="sm" variant="outline" className="h-8 border-[#1E1E22] bg-[#111113]">
                                <Download className="h-3 w-3 mr-2" /> Download Document
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 h-[70vh] overflow-y-auto">
                        <PurchaseOrderPdfViewer
                            purchaseOrder={purchaseOrder}
                            onOpenChange={setIsPdfOpen}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
