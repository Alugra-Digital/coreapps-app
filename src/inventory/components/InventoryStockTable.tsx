import {
  Package,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { InventoryItemFormDialog } from "./InventoryItemFormDialog";
import { deleteInventoryItem } from "@/api/inventory";
import type { InventoryItem } from "../types";

interface InventoryStockTableProps {
  items: InventoryItem[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function InventoryStockTable({
  items,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
}: InventoryStockTableProps) {
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = items.filter(
    (i) =>
      i.code.toLowerCase().includes(search.toLowerCase()) ||
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await deleteInventoryItem(deleteItemId);
      onRefresh();
      setDeleteItemId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setEditItem(null);
    onRefresh();
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <Package className="h-4 w-4" /> IT Asset Inventory
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search code, name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-48 text-foreground"
              />
            </div>
            <Button
              className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
              onClick={onAddClick}
            >
              Add Asset
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Code
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Name
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Quantity
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Price
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {item.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {item.name}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditItem(item)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteItemId(item.id);
                            setDeleteItemName(item.name);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InventoryItemFormDialog
        open={isAddOpen}
        onOpenChange={onAddOpenChange}
        onSuccess={handleAddSuccess}
      />

      <InventoryItemFormDialog
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
        item={editItem ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteItemName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
