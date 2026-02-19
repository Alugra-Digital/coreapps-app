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
import type { Client } from "../types";

interface ClientViewDialogProps {
  client: Client | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function ClientViewDialog({
  client,
  onOpenChange,
  onEdit,
}: ClientViewDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={!!client} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Client - {client.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-4 max-h-[60vh]">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Client Details
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className="font-medium">{client.name}</span>
                </p>
                <p>
                  <span className="text-slate-500">Company:</span>{" "}
                  <span className="font-medium">{client.companyName}</span>
                </p>
                {client.address && (
                  <p>
                    <span className="text-slate-500">Address:</span> {client.address}
                  </p>
                )}
                {client.phone && (
                  <p>
                    <span className="text-slate-500">Phone:</span> {client.phone}
                  </p>
                )}
                {client.email && (
                  <p>
                    <span className="text-slate-500">Email:</span> {client.email}
                  </p>
                )}
                {client.npwp && (
                  <p>
                    <span className="text-slate-500">NPWP:</span> {client.npwp}
                  </p>
                )}
                {client.pic && (client.pic.name || client.pic.position || client.pic.contact) && (
                  <div className="pt-2 border-t">
                    <span className="text-slate-500">PIC:</span>{" "}
                    {[client.pic.name, client.pic.position, client.pic.contact]
                      .filter(Boolean)
                      .join(" — ")}
                  </div>
                )}
                <p>
                  <span className="text-slate-500">Status:</span>{" "}
                  <span className="font-medium">
                    {client.isActive ? "Active" : "Inactive"}
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
