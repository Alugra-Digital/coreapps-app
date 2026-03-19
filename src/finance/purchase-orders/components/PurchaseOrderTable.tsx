import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
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
import { deletePurchaseOrder } from "@/api/purchase-orders";
import type { PurchaseOrder } from "../types";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  onRefresh: () => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function PurchaseOrderTable({
  purchaseOrders,
  onRefresh,
}: PurchaseOrderTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deletePOId, setDeletePOId] = useState<string | null>(null);
  const [deletePONumber, setDeletePONumber] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = purchaseOrders.filter(
    (p) =>
      (p.orderInfo.poNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.vendorInfo.vendorName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.orderInfo.docReference ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!deletePOId) return;
    setIsDeleting(true);
    try {
      await deletePurchaseOrder(deletePOId);
      onRefresh();
      setDeletePOId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTotalAmount = (po: PurchaseOrder): number => {
    return po.lineItems.reduce(
      (sum, item) => sum + (item.priceAfterTax ?? item.subtotal),
      0
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B75]" />
            <input
              placeholder="Filter by PO #, vendor, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111113] border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-[#F5A623] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 border-[#1E1E22] bg-[#111113] text-[#F0F0F0] hover:bg-[#1E1E22] rounded-xl px-4"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-[#0A0A0B]">
              <TableRow className="hover:bg-transparent border-[#1E1E22]">
                <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">PO Number</TableHead>
                <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Date</TableHead>
                <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Vendor</TableHead>
                <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Ref</TableHead>
                <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Total Amount</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-[#6B6B75] text-sm">
                    No purchase orders found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((po) => (
                  <TableRow
                    key={po.id}
                    className="group/row hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                  >
                    <TableCell className="py-4">
                      <span className="text-sm font-bold text-[#F0F0F0] group-hover/row:text-[#F5A623] transition-colors cursor-pointer" onClick={() => navigate(`/finance/purchase-orders/${po.id}`)}>
                        {po.orderInfo.poNumber}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-[#F0F0F0]">
                      {new Date(po.orderInfo.poDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-[#F0F0F0] font-medium">
                      {po.vendorInfo.vendorName}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-[#6B6B75]">
                      {po.orderInfo.docReference ?? "-"}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-bold text-[#F0F0F0] text-right">
                      {formatCurrency(getTotalAmount(po))}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-[#1E1E22] rounded-lg"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                          <DropdownMenuItem onClick={() => navigate(`/finance/purchase-orders/${po.id}`)} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2 text-[#6B6B75]" /> View Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/finance/purchase-orders/${po.id}/edit`)} className="cursor-pointer">
                            <Pencil className="h-4 w-4 mr-2 text-[#6B6B75]" /> Edit Document
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setDeletePOId(po.id);
                              setDeletePONumber(po.orderInfo.poNumber);
                            }}
                            className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete PO
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <AlertDialog
        open={!!deletePOId}
        onOpenChange={(open) => !open && setDeletePOId(null)}
      >
        <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B6B75]">
              Are you sure you want to delete{" "}
              <strong className="text-[#F0F0F0]">{deletePONumber}</strong>? This action cannot be undone and will remove all associated line items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22]">Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

