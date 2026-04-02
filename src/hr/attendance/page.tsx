import { useState } from "react";
import { Clock, Plus, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance, useLogAttendance } from "@/hooks/useAttendance";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PRESENT: { label: "Present", color: "#22C55E" },
  ABSENT: { label: "Absent", color: "#EF4444" },
  LATE: { label: "Late", color: "#F5A623" },
  HALF_DAY: { label: "Half Day", color: "#3b82f6" },
  ON_LEAVE: { label: "On Leave", color: "#8b5cf6" },
};

export default function AttendancePage() {
  const { data: employees = [] } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [logOpen, setLogOpen] = useState(false);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const empId = selectedEmployee?.id || selectedEmployeeId;

  const { data: records = [], isLoading, refetch } = useAttendance(empId || undefined);
  const logMutation = useLogAttendance();

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: "PRESENT",
    checkIn: "",
    checkOut: "",
  });

  const handleLog = () => {
    if (!empId) return toast.error("Select an employee first");
    logMutation.mutate(
      { employeeId: empId, ...form },
      {
        onSuccess: () => {
          toast.success("Attendance logged");
          setLogOpen(false);
          refetch();
        },
        onError: (err: Error) => toast.error(err.message || "Failed to log attendance"),
      }
    );
  };

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-4 sm:p-6 lg:p-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Attendance
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Track employee check-in, check-out, and attendance status.
            </p>
          </div>
          <Button
            className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold min-h-[44px] px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            onClick={() => setLogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Log Attendance
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

        {empId ? (
          <div className="space-y-6">
            {/* Stats */}
            {records.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Present", value: presentCount, color: "#22C55E", icon: <CheckCircle2 className="h-4 w-4" /> },
                  { label: "Absent", value: absentCount, color: "#EF4444", icon: <XCircle className="h-4 w-4" /> },
                  { label: "Late", value: lateCount, color: "#F5A623", icon: <AlertCircle className="h-4 w-4" /> },
                ].map((stat) => (
                  <Card key={stat.label} className="bg-[#111113] border-[#1E1E22] p-6 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <div style={{ color: stat.color }}>{stat.icon}</div>
                      <span className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <p className="text-3xl font-extrabold mt-4" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs text-[#6B6B75] mt-1">of {records.length} records</p>
                  </Card>
                ))}
              </div>
            )}

            {/* Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#F5A623]" />
                  Attendance History — {selectedEmployee?.namaKaryawan}
                </h2>
                <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </div>
              </div>

              {isLoading ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
              ) : records.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                  No attendance records found.
                </div>
              ) : (
                <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                  <Table>
                    <TableHeader className="bg-[#0A0A0B]">
                      <TableRow className="hover:bg-transparent border-[#1E1E22]">
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Date</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Status</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Check In</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Check Out</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((r) => {
                        const cfg = STATUS_CONFIG[r.status] ?? { label: r.status, color: "#6B6B75" };
                        return (
                          <TableRow key={r.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                            <TableCell className="py-4 text-sm text-[#F0F0F0]">
                              {new Date(r.date).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell className="py-4">
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                              >
                                {cfg.label}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 text-sm text-[#F0F0F0]">{r.checkIn ?? "—"}</TableCell>
                            <TableCell className="py-4 text-sm text-[#F0F0F0]">{r.checkOut ?? "—"}</TableCell>
                            <TableCell className="py-4 text-sm text-[#F0F0F0] text-right">
                              {r.workingHours ? `${r.workingHours}h` : "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-3 bg-[#111113] border border-[#1E1E22] rounded-2xl text-[#6B6B75]">
            <Clock className="h-8 w-8 opacity-40" />
            <p className="text-sm font-medium">Select an employee to view attendance</p>
          </div>
        )}
      </div>

      {/* Log Attendance Dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F0F0F0]">Log Attendance</DialogTitle>
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
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Date</label>
                <input
                  type="date"
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Status</label>
                <select
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Check In (HH:MM)</label>
                <input
                  type="time"
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={form.checkIn}
                  onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Check Out (HH:MM)</label>
                <input
                  type="time"
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={form.checkOut}
                  onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setLogOpen(false)}
              className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLog}
              disabled={logMutation.isPending}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
            >
              {logMutation.isPending ? "Saving..." : "Log Attendance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
