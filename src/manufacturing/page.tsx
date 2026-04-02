import { useState } from "react";
import { Factory, ClipboardList, CheckSquare, Plus, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useWorkOrders,
  useCreateWorkOrder,
  useStartWorkOrder,
  useCompleteWorkOrder,
  useBOMs,
  useQualityInspections,
  useUpdateInspectionStatus,
} from "@/hooks/useManufacturing";
import type { CreateWorkOrderInput } from "@/api/manufacturing";
import { toast } from "sonner";

const WO_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "#6B6B75" },
  IN_PROGRESS: { label: "In Progress", color: "#F5A623" },
  COMPLETED: { label: "Completed", color: "#22C55E" },
  CANCELLED: { label: "Cancelled", color: "#EF4444" },
};

const QI_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#F5A623" },
  PASSED: { label: "Passed", color: "#22C55E" },
  FAILED: { label: "Failed", color: "#EF4444" },
};

export default function ManufacturingPage() {
  const { data: workOrders = [], isLoading: woLoading, refetch: refetchWO } = useWorkOrders();
  const { data: boms = [], isLoading: bomsLoading } = useBOMs();
  const { data: inspections = [], isLoading: qiLoading, refetch: refetchQI } = useQualityInspections();

  const createWO = useCreateWorkOrder();
  const startWO = useStartWorkOrder();
  const completeWO = useCompleteWorkOrder();
  const updateQI = useUpdateInspectionStatus();

  const [woDialog, setWoDialog] = useState(false);
  const [woForm, setWoForm] = useState<CreateWorkOrderInput>({
    bomId: 0,
    itemId: 0,
    qtyToProduce: 1,
    plannedStartDate: "",
  });

  const handleCreateWO = () => {
    if (!woForm.bomId) return toast.error("BOM ID is required");
    if (!woForm.itemId) return toast.error("Item ID is required");
    if (!woForm.qtyToProduce || woForm.qtyToProduce <= 0) return toast.error("Quantity must be greater than 0");
    createWO.mutate(woForm, {
      onSuccess: () => { toast.success("Work order created"); setWoDialog(false); refetchWO(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleStart = (id: number) => {
    startWO.mutate(id, {
      onSuccess: () => { toast.success("Work order started"); refetchWO(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleComplete = (id: number) => {
    completeWO.mutate(id, {
      onSuccess: () => { toast.success("Work order completed"); refetchWO(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handlePassQI = (id: number) => {
    updateQI.mutate({ id, status: "PASSED", findings: "Inspection passed" }, {
      onSuccess: () => { toast.success("Inspection passed"); refetchQI(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleFailQI = (id: number) => {
    updateQI.mutate({ id, status: "FAILED", findings: "Inspection failed" }, {
      onSuccess: () => { toast.success("Inspection marked as failed"); refetchQI(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const draftCount = workOrders.filter((w) => w.status === "DRAFT").length;
  const inProgressCount = workOrders.filter((w) => w.status === "IN_PROGRESS").length;
  const completedCount = workOrders.filter((w) => w.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-4 sm:p-6 lg:p-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Manufacturing
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Manage work orders, BOMs, and quality inspections.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Draft Orders", value: String(draftCount), color: "#6B6B75" },
            { label: "In Progress", value: String(inProgressCount), color: "#F5A623" },
            { label: "Completed", value: String(completedCount), color: "#22C55E" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[#111113] border-[#1E1E22] p-6 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6B75]">{stat.label}</p>
              <p className="text-2xl font-extrabold mt-3" style={{ color: stat.color }}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="work-orders">
          <TabsList className="bg-[#111113] border border-[#1E1E22] p-1 rounded-xl">
            <TabsTrigger value="work-orders" className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-black font-bold rounded-lg px-4">
              <Factory className="h-4 w-4 mr-2" />Work Orders
            </TabsTrigger>
            <TabsTrigger value="boms" className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-black font-bold rounded-lg px-4">
              <ClipboardList className="h-4 w-4 mr-2" />BOMs
            </TabsTrigger>
            <TabsTrigger value="quality" className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-black font-bold rounded-lg px-4">
              <CheckSquare className="h-4 w-4 mr-2" />Quality
            </TabsTrigger>
          </TabsList>

          {/* Work Orders */}
          <TabsContent value="work-orders" className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Factory className="h-5 w-5 text-[#F5A623]" /> Work Orders
              </h2>
              <Button
                onClick={() => {
                  setWoForm({ bomId: 0, itemId: 0, qtyToProduce: 1, plannedStartDate: "" });
                  setWoDialog(true);
                }}
                className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold min-h-[40px] px-6 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4 mr-2" /> New Work Order
              </Button>
            </div>

            {woLoading ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
            ) : workOrders.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                No work orders found.
              </div>
            ) : (
              <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                  <TableHeader className="bg-[#0A0A0B]">
                    <TableRow className="hover:bg-transparent border-[#1E1E22]">
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">WO Number</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Qty</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Status</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Planned Start</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.map((wo) => {
                      const cfg = WO_STATUS_CONFIG[wo.status] ?? { label: wo.status, color: "#6B6B75" };
                      return (
                        <TableRow key={wo.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                          <TableCell className="py-4 text-sm font-bold text-[#F0F0F0]">{wo.woNumber}</TableCell>
                          <TableCell className="py-4 text-sm text-[#F0F0F0] text-right">{wo.qtyToProduce}</TableCell>
                          <TableCell className="py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-sm text-[#6B6B75]">
                            {wo.plannedStartDate ? new Date(wo.plannedStartDate).toLocaleDateString("id-ID") : "—"}
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {wo.status === "DRAFT" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStart(wo.id)}
                                  disabled={startWO.isPending}
                                  className="h-7 px-3 text-xs bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold rounded-lg"
                                >
                                  <PlayCircle className="h-3 w-3 mr-1" /> Start
                                </Button>
                              )}
                              {wo.status === "IN_PROGRESS" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleComplete(wo.id)}
                                  disabled={completeWO.isPending}
                                  className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" /> Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* BOMs */}
          <TabsContent value="boms" className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-[#F5A623]" /> Bills of Materials
              </h2>
              <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System
              </div>
            </div>

            {bomsLoading ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
            ) : boms.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                No BOMs found.
              </div>
            ) : (
              <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                  <TableHeader className="bg-[#0A0A0B]">
                    <TableRow className="hover:bg-transparent border-[#1E1E22]">
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">ID</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Name</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Item ID</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boms.map((bom) => (
                      <TableRow key={bom.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                        <TableCell className="py-4 text-sm text-[#6B6B75]">#{bom.id}</TableCell>
                        <TableCell className="py-4 text-sm font-bold text-[#F0F0F0]">{bom.name}</TableCell>
                        <TableCell className="py-4 text-sm text-[#F0F0F0]">{bom.itemId}</TableCell>
                        <TableCell className="py-4 text-sm font-bold text-[#F5A623] text-right">
                          {bom.totalCost != null
                            ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(bom.totalCost))
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* Quality Inspections */}
          <TabsContent value="quality" className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-[#F5A623]" /> Quality Inspections
              </h2>
              <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System
              </div>
            </div>

            {qiLoading ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
            ) : inspections.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                No quality inspections found.
              </div>
            ) : (
              <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                  <TableHeader className="bg-[#0A0A0B]">
                    <TableRow className="hover:bg-transparent border-[#1E1E22]">
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">ID</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Work Order ID</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Status</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Findings</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspections.map((qi) => {
                      const cfg = QI_STATUS_CONFIG[qi.status] ?? { label: qi.status, color: "#6B6B75" };
                      return (
                        <TableRow key={qi.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                          <TableCell className="py-4 text-sm text-[#6B6B75]">#{qi.id}</TableCell>
                          <TableCell className="py-4 text-sm text-[#F0F0F0]">{qi.workOrderId ?? "—"}</TableCell>
                          <TableCell className="py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-sm text-[#6B6B75]">{qi.findings ?? "—"}</TableCell>
                          <TableCell className="py-4 text-right">
                            {qi.status === "PENDING" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handlePassQI(qi.id)}
                                  disabled={updateQI.isPending}
                                  className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                                >
                                  Pass
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleFailQI(qi.id)}
                                  disabled={updateQI.isPending}
                                  className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                                >
                                  Fail
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Work Order Dialog */}
      <Dialog open={woDialog} onOpenChange={setWoDialog}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F0F0F0]">New Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">BOM ID *</label>
                <input
                  type="number"
                  min={1}
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={woForm.bomId || ""}
                  onChange={(e) => setWoForm((f) => ({ ...f, bomId: Number(e.target.value) }))}
                  placeholder="e.g. 1"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Item ID *</label>
                <input
                  type="number"
                  min={1}
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={woForm.itemId || ""}
                  onChange={(e) => setWoForm((f) => ({ ...f, itemId: Number(e.target.value) }))}
                  placeholder="e.g. 5"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Qty to Produce *</label>
              <input
                type="number"
                min={1}
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={woForm.qtyToProduce}
                onChange={(e) => setWoForm((f) => ({ ...f, qtyToProduce: Number(e.target.value) }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Planned Start Date</label>
              <input
                type="date"
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={woForm.plannedStartDate ?? ""}
                onChange={(e) => setWoForm((f) => ({ ...f, plannedStartDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setWoDialog(false)} className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]">
              Cancel
            </Button>
            <Button
              onClick={handleCreateWO}
              disabled={createWO.isPending}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
            >
              {createWO.isPending ? "Creating..." : "Create Work Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
