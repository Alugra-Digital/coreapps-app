import { useState } from "react";
import { MoreVertical, Eye, Pencil, Trash2, CheckCircle, Paperclip, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ClientPurchaseOrder } from "../clientPurchaseOrderTypes";
import { deleteClientPurchaseOrder } from "@/api/client-purchase-orders";
import { toast } from "sonner";

interface ClientPurchaseOrderTableProps {
    purchaseOrders: ClientPurchaseOrder[];
    onRefresh: () => void;
    onView: (cpo: ClientPurchaseOrder) => void;
    onEdit: (cpo: ClientPurchaseOrder) => void;
    onVerify: (cpo: ClientPurchaseOrder) => void;
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

export function ClientPurchaseOrderTable({
    purchaseOrders,
    onRefresh,
    onView,
    onEdit,
    onVerify,
}: ClientPurchaseOrderTableProps) {
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<ClientPurchaseOrder | null>(null);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        const ok = await deleteClientPurchaseOrder(deleteTarget.id);
        if (ok) {
            toast.success("PO Masuk deleted");
            onRefresh();
        } else {
            toast.error("Failed to delete");
        }
        setDeleteTarget(null);
    };

    const filtered = purchaseOrders.filter((cpo) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            cpo.cpoNumber?.toLowerCase().includes(s) ||
            cpo.clientName?.toLowerCase().includes(s) ||
            cpo.internalReference?.toLowerCase().includes(s)
        );
    });

    return (
        <>
            <Card className="bg-[#111113] border-[#1E1E22] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#1E1E22] flex items-center justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B75]" />
                        <Input
                            placeholder="Search PO Masuk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-[#0A0A0B] border-[#1E1E22] pl-9 h-10 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1E1E22]">
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">CPO No.</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Client</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Project</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Attachment</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Issued</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-[#6B6B75]">
                                        No PO Masuk found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((cpo) => {
                                    const status = statusConfig[cpo.status] ?? statusConfig.RECEIVED;
                                    return (
                                        <tr
                                            key={cpo.id}
                                            className="border-b border-[#1E1E22] hover:bg-[#0A0A0B]/50 transition-colors group/row"
                                        >
                                            <td className="px-6 py-4">
                                                <span
                                                    className="text-sm font-bold text-[#F0F0F0] group-hover/row:text-[#F5A623] transition-colors cursor-pointer"
                                                    onClick={() => onView(cpo)}
                                                >
                                                    {cpo.cpoNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[#9A9AA5]">{cpo.clientName || '-'}</td>
                                            <td className="px-6 py-4 text-[#9A9AA5]">{cpo.projectName || '-'}</td>
                                            <td className="px-6 py-4 text-right font-mono text-[#F0F0F0]">
                                                {formatCurrency(cpo.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="outline" className={`${status.bg} ${status.color} text-xs border`}>
                                                    {status.label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {cpo.attachmentUrl ? (
                                                    <Paperclip className="h-4 w-4 text-[#F5A623] mx-auto" />
                                                ) : (
                                                    <span className="text-[#6B6B75]">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-[#9A9AA5]">
                                                {cpo.issuedDate ? new Date(cpo.issuedDate).toLocaleDateString("id-ID") : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B6B75] hover:text-[#F0F0F0]">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                                                        <DropdownMenuItem onClick={() => onView(cpo)} className="cursor-pointer">
                                                            <Eye className="h-4 w-4 mr-2" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onEdit(cpo)} className="cursor-pointer">
                                                            <Pencil className="h-4 w-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        {cpo.status === 'RECEIVED' && (
                                                            <DropdownMenuItem onClick={() => onVerify(cpo)} className="cursor-pointer text-emerald-400">
                                                                <CheckCircle className="h-4 w-4 mr-2" /> Verify
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => setDeleteTarget(cpo)} className="cursor-pointer text-red-400">
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete PO Masuk?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#6B6B75]">
                            Delete <strong>{deleteTarget?.cpoNumber}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#1E1E22] text-[#F0F0F0] hover:bg-[#2A2A2E]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 text-white hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
