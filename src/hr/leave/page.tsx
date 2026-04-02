import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/hooks/useEmployees";
import { useLeaveBalance, useApplyLeave } from "@/hooks/useLeave";
import { toast } from "sonner";


export default function LeavePage() {
  const { data: employees = [] } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [applyOpen, setApplyOpen] = useState(false);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const empId = selectedEmployee?.id || selectedEmployeeId;

  const { data: balances = [], isLoading: balanceLoading, refetch } = useLeaveBalance(empId || undefined);
  const applyMutation = useApplyLeave();

  const [form, setForm] = useState({
    leaveTypeId: 1,
    fromDate: "",
    toDate: "",
    totalDays: 1,
    reason: "",
  });

  const handleApply = async () => {
    if (!empId) return toast.error("Select an employee first");
    if (!form.fromDate || !form.toDate) return toast.error("Select dates");

    applyMutation.mutate(
      { ...form, employeeId: empId },
      {
        onSuccess: () => {
          toast.success("Leave application submitted");
          setApplyOpen(false);
          refetch();
        },
        onError: (err: Error) => toast.error(err.message || "Failed to apply"),
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-4 sm:p-6 lg:p-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Leave Management
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Track and manage employee leave applications and balances.
            </p>
          </div>
          <Button
            className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold min-h-[44px] px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            onClick={() => setApplyOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Apply Leave
          </Button>
        </div>

        {/* Employee Selector */}
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">
            Select Employee
          </label>
          <select
            className="bg-[#111113] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#F5A623] outline-none"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">-- Select an employee --</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.namaKaryawan} ({e.nik})
              </option>
            ))}
          </select>
        </div>

        {/* Balance Cards */}
        {empId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#F5A623]" />
                Leave Balance — {selectedEmployee?.namaKaryawan}
              </h2>
              <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System
              </div>
            </div>

            {balanceLoading ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
            ) : balances.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                No leave allocation found for this employee.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {balances.map((b, i) => (
                    <Card key={i} className="bg-[#111113] border-[#1E1E22] shadow-2xl">
                      <CardContent className="p-6 space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6B75]">
                          {b.typeName}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-3xl font-extrabold text-[#F5A623]">{Number(b.remaining).toFixed(0)}</p>
                            <p className="text-xs text-[#6B6B75] mt-1">days remaining</p>
                          </div>
                          <div className="text-right text-xs text-[#6B6B75]">
                            <p>Total: {Number(b.total).toFixed(0)}</p>
                            <p>Used: {Number(b.used).toFixed(0)}</p>
                          </div>
                        </div>
                        <div className="w-full bg-[#1E1E22] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-[#F5A623]"
                            style={{ width: `${Math.max(0, Math.min(100, (Number(b.remaining) / Number(b.total)) * 100))}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                  <Table>
                    <TableHeader className="bg-[#0A0A0B]">
                      <TableRow className="hover:bg-transparent border-[#1E1E22]">
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Leave Type</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Total</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Used</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Remaining</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balances.map((b, i) => (
                        <TableRow key={i} className="hover:bg-white/[0.02] border-[#1E1E22]">
                          <TableCell className="py-4 text-sm font-medium text-[#F0F0F0]">{b.typeName}</TableCell>
                          <TableCell className="py-4 text-sm text-[#F0F0F0] text-right">{Number(b.total).toFixed(0)} days</TableCell>
                          <TableCell className="py-4 text-sm text-[#F0F0F0] text-right">{Number(b.used).toFixed(0)} days</TableCell>
                          <TableCell className="py-4 text-sm font-bold text-[#F5A623] text-right">{Number(b.remaining).toFixed(0)} days</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </>
            )}
          </div>
        )}

        {!empId && (
          <div className="h-48 flex flex-col items-center justify-center gap-3 bg-[#111113] border border-[#1E1E22] rounded-2xl text-[#6B6B75]">
            <CalendarDays className="h-8 w-8 opacity-40" />
            <p className="text-sm font-medium">Select an employee to view leave balance</p>
          </div>
        )}
      </div>

      {/* Apply Leave Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F0F0F0]">Apply Leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Employee</label>
              <select
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="">-- Select employee --</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.namaKaryawan} ({e.nik})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">From Date</label>
                <input
                  type="date"
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={form.fromDate}
                  onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">To Date</label>
                <input
                  type="date"
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={form.toDate}
                  onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Total Days</label>
              <input
                type="number"
                min={1}
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={form.totalDays}
                onChange={(e) => setForm((f) => ({ ...f, totalDays: Number(e.target.value) }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Reason</label>
              <textarea
                rows={3}
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623] resize-none"
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Reason for leave..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setApplyOpen(false)}
              className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={applyMutation.isPending}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
            >
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
