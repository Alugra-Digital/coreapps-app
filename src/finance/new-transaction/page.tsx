import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/api/transactions";

const accountOptions = [
  "Main Operations",
  "Payroll Savings",
  "Petty Cash",
  "Client Escrow",
  "Investment Portfolio",
];

const categoryOptions = [
  "Consulting",
  "Operation",
  "Infrastructure",
  "Tax Service",
  "Office Supplies",
  "Operational",
  "Marketing",
  "Payroll",
  "Other",
];

const statusOptions = ["Completed", "Pending", "Processing"];

export default function NewTransactionPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<"inbound" | "outbound">("inbound");
  const [category, setCategory] = useState("consulting");
  const [status, setStatus] = useState("pending");
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const dateEl = form.querySelector<HTMLInputElement>("#transaction-date");
    const entityEl = form.querySelector<HTMLInputElement>("#entity");

    const date = dateEl?.value ?? new Date().toISOString().slice(0, 10);
    const entity = entityEl?.value?.trim() ?? "";

    if (!entity || amount <= 0) {
      toast.error("Please fill in entity and amount.");
      return;
    }

    const categoryLabel = category.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1) as "Completed" | "Pending" | "Processing";

    setSubmitting(true);
    try {
      await createTransaction({
        date,
        entity,
        category: categoryLabel,
        amount,
        type,
        status: statusLabel,
      });
      toast.success("Transaction created successfully.");
      navigate("/finance/invoice");
    } catch (e) {
      toast.error(e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Failed to create transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[900px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="h-9 px-3">
            <Link to="/finance/invoice">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
              Add New Transaction
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create a new transaction using the same accounts and categories as
              Financial Overview.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-slate-200 dark:border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold text-slate-900 dark:text-foreground">
              Rp 6,64 M
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              Operational Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold text-slate-900 dark:text-foreground">
              Rp 1,93 M
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold text-slate-900 dark:text-foreground">
              Rp 4,72 M
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-base">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-date">Transaction Date</Label>
                <Input id="transaction-date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity">Entity</Label>
                <Input
                  id="entity"
                  placeholder="PT. Alpha Indonesia"
                  autoComplete="organization"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as "inbound" | "outbound")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account</Label>
                <Select defaultValue="main-operations">
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountOptions.map((account) => (
                      <SelectItem
                        key={account}
                        value={account.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (IDR)</Label>
                <CurrencyInput
                  id="amount"
                  prefix="Rp"
                  value={amount}
                  onChange={setAmount}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s.toLowerCase()}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference ID</Label>
              <Input id="reference" placeholder="TX-9017" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Additional notes for this transaction..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link to="/finance/invoice">Cancel</Link>
              </Button>
              <Button type="submit" className="gap-2" disabled={submitting}>
                <Save className="h-4 w-4" />
                {submitting ? "Saving..." : "Save Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
