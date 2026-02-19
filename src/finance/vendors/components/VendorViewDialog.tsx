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
import type { Vendor } from "../types";

interface VendorViewDialogProps {
  vendor: Vendor | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function VendorViewDialog({
  vendor,
  onOpenChange,
  onEdit,
}: VendorViewDialogProps) {
  if (!vendor) return null;

  return (
    <Dialog open={!!vendor} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Vendor - {vendor.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Vendor Details
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className="font-medium">{vendor.name}</span>
                </p>
                <p>
                  <span className="text-slate-500">Company:</span>{" "}
                  <span className="font-medium">{vendor.companyName}</span>
                </p>
                {vendor.address && (
                  <p>
                    <span className="text-slate-500">Address:</span> {vendor.address}
                  </p>
                )}
                {vendor.phone && (
                  <p>
                    <span className="text-slate-500">Phone:</span> {vendor.phone}
                  </p>
                )}
                {vendor.email && (
                  <p>
                    <span className="text-slate-500">Email:</span> {vendor.email}
                  </p>
                )}
                {vendor.npwp && (
                  <p>
                    <span className="text-slate-500">NPWP:</span> {vendor.npwp}
                  </p>
                )}
                {vendor.pic && (vendor.pic.name || vendor.pic.position || vendor.pic.contact) && (
                  <div className="pt-2 border-t">
                    <span className="text-slate-500">PIC:</span>{" "}
                    {[vendor.pic.name, vendor.pic.position, vendor.pic.contact]
                      .filter(Boolean)
                      .join(" — ")}
                  </div>
                )}
                {(vendor.bankName || vendor.bankAccount || vendor.bankBranch) && (
                  <div className="pt-2 border-t">
                    <span className="text-slate-500">Bank:</span>{" "}
                    {[vendor.bankName, vendor.bankAccount, vendor.bankBranch]
                      .filter(Boolean)
                      .join(" — ")}
                  </div>
                )}
                <p>
                  <span className="text-slate-500">Status:</span>{" "}
                  <span className="font-medium">
                    {vendor.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
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
