import { useState } from "react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Banknote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/hooks/useEmployees";
import { useEmployeeLoans, useApplyLoan } from "@/hooks/useLoans";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "#6B6B75" },
  ACTIVE: { label: "Active", color: "#F5A623" },
  CLOSED: { label: "Closed", color: "#22C55E" },
};

function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export default function LoansPage() {
  const { data: employees = [] } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [applyOpen, setApplyOpen] = useState(false);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const empId = selectedEmployee?.id || selectedEmployeeId;

  const { data: loans = [], isLoading, refetch } = useEmployeeLoans(empId || undefined);
  const applyMutation = useApplyLoan();

  const [form, setForm] = useState({
    loanAmount: 0,
    repaymentPeriods: 12,
  });

  const handleApply = () => {
    if (!empId) return toast.error("Select an employee first");
    if (!form.loanAmount || form.loanAmount <= 0) return toast.error("Enter a valid loan amount");

    applyMutation.mutate(
      { employeeId: empId, ...form },
      {
        onSuccess: () => {
          toast.success("Loan application submitted");
          setApplyOpen(false);
          setForm({ loanAmount: 0, repaymentPeriods: 12 });
          refetch();
        },
        onError: (err: Error) => toast.error(err.message || "Failed to apply"),
      }
    );
  };

  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.loanAmount), 0);
  const totalRemaining = loans.reduce((sum, l) => sum + Number(l.remainingAmount), 0);
  const activeCount = loans.filter((l) => l.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-4 sm:p-6 lg:p-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Employee Loans
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Manage employee loan applications and repayment tracking.
            </p>
          </div>
          <Button
            className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold min-h-[44px] px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
            onClick={() => setApplyOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Apply Loan
          </Button>
        </div>

        {/* Employee Selector */}
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Select Employee</label>
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
            {loans.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Loaned", value: formatCurrency(totalLoaned), color: "#F5A623" },
                  { label: "Outstanding", value: formatCurrency(totalRemaining), color: "#EF4444" },
                  { label: "Active Loans", value: String(activeCount), color: "#3b82f6" },
                ].map((stat) => (
                  <Card key={stat.label} className="bg-[#111113] border-[#1E1E22] p-6 shadow-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6B75]">{stat.label}</p>
                    <p className="text-2xl font-extrabold mt-3 truncate" style={{ color: stat.color }}>{stat.value}</p>
                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-[#F5A623]" />
                  Loan History — {selectedEmployee?.namaKaryawan}
                </h2>
                <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </div>
              </div>

              {isLoading ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
              ) : loans.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                  No active loans found.
                </div>
              ) : (
                <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                  <Table>
                    <TableHeader className="bg-[#0A0A0B]">
                      <TableRow className="hover:bg-transparent border-[#1E1E22]">
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">ID</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Loan Amount</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Monthly</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Remaining</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Periods</TableHead>
                        <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loans.map((loan) => {
                        const cfg = STATUS_CONFIG[loan.status] ?? { label: loan.status, color: "#6B6B75" };
                        return (
                          <TableRow key={loan.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                            <TableCell className="py-4 text-sm text-[#6B6B75]">#{loan.id}</TableCell>
                            <TableCell className="py-4 text-sm font-bold text-[#F0F0F0] text-right">
                              {formatCurrency(loan.loanAmount)}
                            </TableCell>
                            <TableCell className="py-4 text-sm text-[#F0F0F0] text-right">
                              {formatCurrency(loan.repaymentAmount)}
                            </TableCell>
                            <TableCell className="py-4 text-sm font-bold text-[#EF4444] text-right">
                              {formatCurrency(loan.remainingAmount)}
                            </TableCell>
                            <TableCell className="py-4 text-sm text-[#F0F0F0]">
                              {loan.repaymentPeriods} months
                            </TableCell>
                            <TableCell className="py-4">
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                              >
                                {cfg.label}
                              </span>
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
            <Banknote className="h-8 w-8 opacity-40" />
            <p className="text-sm font-medium">Select an employee to view loans</p>
          </div>
        )}
      </div>

      {/* Apply Loan Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F0F0F0]">Apply for Loan</DialogTitle>
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
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">
                Loan Amount (IDR)
              </label>
              <CurrencyInput
                value={form.loanAmount || 0}
                onChange={(val) => setForm((f) => ({ ...f, loanAmount: val }))}
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">
                Repayment Period (months)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={form.repaymentPeriods}
                onChange={(e) => setForm((f) => ({ ...f, repaymentPeriods: Number(e.target.value) }))}
              />
            </div>
            {form.loanAmount > 0 && form.repaymentPeriods > 0 && (
              <div className="bg-[#0A0A0B] border border-[#1E1E22] rounded-xl p-4">
                <p className="text-xs text-[#6B6B75] mb-1">Monthly Repayment</p>
                <p className="text-lg font-bold text-[#F5A623]">
                  {formatCurrency(form.loanAmount / form.repaymentPeriods)}
                </p>
              </div>
            )}
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
