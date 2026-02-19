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
import type { Position } from "../types";

interface PositionViewDialogProps {
  position: Position | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function PositionViewDialog({
  position,
  onOpenChange,
  onEdit,
}: PositionViewDialogProps) {
  if (!position) return null;

  return (
    <Dialog open={!!position} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Position - {position.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Position Details
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className="font-medium">{position.name}</span>
                </p>
                {position.code && (
                  <p>
                    <span className="text-slate-500">Code:</span>{" "}
                    <span className="font-medium">{position.code}</span>
                  </p>
                )}
                {position.description && (
                  <p>
                    <span className="text-slate-500">Description:</span>{" "}
                    {position.description}
                  </p>
                )}
                <p>
                  <span className="text-slate-500">Status:</span>{" "}
                  <span className="font-medium">
                    {position.isActive ? "Active" : "Inactive"}
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
