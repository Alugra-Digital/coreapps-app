import { useState } from "react";
import { DollarSign, FileText, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSalaryStructures, useSalarySlips, useCreateSalarySlip, usePostSalarySlip } from "@/hooks/usePayroll";
import { toast } from "sonner";

function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export default function PayrollPage() {
  const { data: structures = [], isLoading: loadingStructures } = useSalaryStructures();
  const { data: slips = [], isLoading: loadingSlips, refetch: refetchSlips } = useSalarySlips();
  const createSlipMutation = useCreateSalarySlip();
  const postSlipMutation = usePostSalarySlip();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: 0, period: "" });

  const totalPayroll = structures.reduce((sum, s) => sum + Number(s.baseSalary || 0), 0);
  const postedSlips = slips.filter((s) => s.status === "POSTED").length;
  const draftSlips = slips.filter((s) => s.status === "DRAFT").length;

  const handleCreateSlip = () => {
    if (!form.employeeId || !form.period) return toast.error("Fill in all fields");
    createSlipMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Salary slip created");
        setCreateOpen(false);
        setForm({ employeeId: 0, period: "" });
        refetchSlips();
      },
      onError: (err: Error) => toast.error(err.message || "Failed to create"),
    });
  };

  const handlePostSlip = (id: number) => {
    postSlipMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Salary slip posted");
        refetchSlips();
      },
      onError: (err: Error) => toast.error(err.message || "Failed to post"),
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-4 sm:p-6 lg:p-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Payroll
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Manage salary structures, slips, and payroll processing.
            </p>
          </div>
          <Button
            className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold min-h-[44px] px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Salary Slip
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Payroll", value: formatCurrency(totalPayroll), color: "#F5A623", icon: <DollarSign className="h-4 w-4" /> },
            { label: "Posted Slips", value: String(postedSlips), color: "#22C55E", icon: <CheckCircle2 className="h-4 w-4" /> },
            { label: "Draft Slips", value: String(draftSlips), color: "#3b82f6", icon: <FileText className="h-4 w-4" /> },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[#111113] border-[#1E1E22] p-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <span className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-3xl font-extrabold mt-4 truncate" style={{ color: stat.color }}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="structures" className="w-full">
          <TabsList className="bg-[#111113] border border-[#1E1E22] p-1.5 h-14 rounded-2xl w-full md:w-auto justify-start gap-2 px-4 shadow-xl">
            <TabsTrigger
              value="structures"
              className="data-[state=active]:bg-[#F5A623]/10 data-[state=active]:text-[#F5A623] data-[state=active]:border-[#F5A623]/30 rounded-xl px-6 h-10 border border-transparent font-bold"
            >
              Salary Structures
            </TabsTrigger>
            <TabsTrigger
              value="slips"
              className="data-[state=active]:bg-[#3b82f6]/10 data-[state=active]:text-[#3b82f6] data-[state=active]:border-[#3b82f6]/30 rounded-xl px-6 h-10 border border-transparent font-bold"
            >
              Salary Slips
            </TabsTrigger>
          </TabsList>

          {/* Salary Structures Tab */}
          <TabsContent value="structures" className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#F5A623]" />
                  Salary Structures
                </h2>
                <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </div>
              </div>

              {loadingStructures ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
              ) : structures.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                  No salary structures found.
                </div>
              ) : (
                <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                  <Table>
                    <TableHeader className="bg-[#0A0A0B]">
                      <TableRow className="hover:bg-transparent border-[#1E1E22]">
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Employee</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Base Salary</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Allowances</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Deductions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {structures.map((s) => (
                        <TableRow key={s.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                          <TableCell className="py-4 text-sm font-medium text-[#F0F0F0]">
                            {s.employeeName || `Employee #${s.employeeId}`}
                          </TableCell>
                          <TableCell className="py-4 text-sm font-bold text-[#F5A623] text-right">
                            {formatCurrency(s.baseSalary)}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-[#22C55E] text-right">
                            {s.allowances ? formatCurrency(s.allowances) : "—"}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-[#EF4444] text-right">
                            {s.deductions ? formatCurrency(s.deductions) : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Salary Slips Tab */}
          <TabsContent value="slips" className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#3b82f6]" />
                  Salary Slips
                </h2>
                <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Live System
                </div>
              </div>

              {loadingSlips ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
              ) : slips.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                  No salary slips found.
                </div>
              ) : (
                <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                  <Table>
                    <TableHeader className="bg-[#0A0A0B]">
                      <TableRow className="hover:bg-transparent border-[#1E1E22]">
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Employee</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Period</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Gross</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Net</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Status</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slips.map((slip) => (
                        <TableRow key={slip.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                          <TableCell className="py-4 text-sm font-medium text-[#F0F0F0]">
                            {slip.employeeName || `Employee #${slip.employeeId}`}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-[#F0F0F0]">{slip.period}</TableCell>
                          <TableCell className="py-4 text-sm text-[#F0F0F0] text-right">
                            {formatCurrency(slip.grossSalary)}
                          </TableCell>
                          <TableCell className="py-4 text-sm font-bold text-[#F5A623] text-right">
                            {formatCurrency(slip.netSalary)}
                          </TableCell>
                          <TableCell className="py-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                              style={
                                slip.status === "POSTED"
                                  ? { backgroundColor: "#22C55E18", color: "#22C55E" }
                                  : { backgroundColor: "#6B6B7518", color: "#6B6B75" }
                              }
                            >
                              {slip.status}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            {slip.status === "DRAFT" && (
                              <Button
                                size="sm"
                                onClick={() => handlePostSlip(slip.id)}
                                disabled={postSlipMutation.isPending}
                                className="h-7 text-xs bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/20 rounded-lg font-bold px-3"
                                variant="ghost"
                              >
                                Post
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Salary Slip Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F0F0F0]">Create Salary Slip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Employee ID</label>
              <input
                type="number"
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={form.employeeId || ""}
                onChange={(e) => setForm((f) => ({ ...f, employeeId: Number(e.target.value) }))}
                placeholder="Employee numeric ID"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Period (YYYY-MM)</label>
              <input
                type="month"
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={form.period}
                onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSlip}
              disabled={createSlipMutation.isPending}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
            >
              {createSlipMutation.isPending ? "Creating..." : "Create Slip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
