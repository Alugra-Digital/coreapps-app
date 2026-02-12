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
import type { TaxType } from "../types";

interface TaxTypeViewDialogProps {
  taxType: TaxType | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  output_tax: "Output Tax",
  withholding_tax: "Withholding Tax",
};

const DOC_LABELS: Record<string, string> = {
  invoice: "Invoice",
  po: "PO",
  bast: "BAST",
};

export function TaxTypeViewDialog({
  taxType,
  onOpenChange,
  onEdit,
}: TaxTypeViewDialogProps) {
  if (!taxType) return null;

  return (
    <Dialog open={!!taxType} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Tax Type - {taxType.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Tax Type Details
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Code:</span>{" "}
                  <span className="font-medium">{taxType.code}</span>
                </p>
                <p>
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className="font-medium">{taxType.name}</span>
                </p>
                <p>
                  <span className="text-slate-500">Rate:</span>{" "}
                  <span className="font-medium">{taxType.rate}%</span>
                </p>
                <p>
                  <span className="text-slate-500">Category:</span>{" "}
                  <span className="font-medium">{CATEGORY_LABELS[taxType.category] ?? taxType.category}</span>
                </p>
                <p>
                  <span className="text-slate-500">Description:</span>{" "}
                  {taxType.description}
                </p>
                {taxType.regulation && (
                  <p>
                    <span className="text-slate-500">Regulation:</span>{" "}
                    {taxType.regulation}
                  </p>
                )}
                <p>
                  <span className="text-slate-500">Applicable to:</span>{" "}
                  {taxType.applicableDocuments.map((d) => DOC_LABELS[d] ?? d).join(", ")}
                </p>
                <p>
                  <span className="text-slate-500">Status:</span>{" "}
                  <span className="font-medium">{taxType.isActive ? "Active" : "Inactive"}</span>
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
