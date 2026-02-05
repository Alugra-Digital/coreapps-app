import {
  ArrowLeft,
  ChevronRight,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  Banknote,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function PaymentDetailPage() {
  const navigate = useNavigate();

  const transactionData = {
    id: "PAY-9921-X4B2",
    date: "Feb 04, 2024 • 10:45 AM",
    amount: "$12,400.00",
    status: "Completed",
    method: "Bank Mandiri Transfer",
    reference: "REF-001294812",
    fees: "$0.00",
    netAmount: "$12,400.00",
    sourceAccount: "Company Operating (Master)",
    destination: "Consultancy Services PVT",
    client: "Bank Mandiri HQ",
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1000px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors font-sans">
      {/* Header & Standard Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full -ml-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Link
                to="/finance/payment"
                className="hover:text-primary transition-colors"
              >
                Payment
              </Link>
              <ChevronRight className="h-2 w-2" />
              <span className="text-slate-900 dark:text-foreground">
                Receipt
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Transaction Details
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            View comprehensive audit trail and receipt for transaction{" "}
            {transactionData.id}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-[10px] font-bold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
          >
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-[10px] font-bold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button className="h-9 gap-2 text-[10px] font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        {/* Left Col: Receipt & Core Details */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-1.5 rounded-sm overflow-hidden">
            <CardContent className="p-0 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="p-6 flex flex-col items-center text-center border-b border-slate-50 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Transaction Successful
                </h2>
                <div className="text-3xl font-bold text-slate-900 dark:text-foreground mb-1">
                  {transactionData.amount}
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-none font-bold text-[10px] px-2"
                >
                  Completed • Feb 04, 2024
                </Badge>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-y-4 text-xs font-medium">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Transaction ID
                    </span>
                    <span className="text-slate-900 dark:text-foreground">
                      {transactionData.id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Payment Method
                    </span>
                    <span className="text-slate-900 dark:text-foreground flex items-center justify-end gap-1.5">
                      <Banknote className="h-3.5 w-3.5 text-blue-500" />{" "}
                      {transactionData.method}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Sender Account
                    </span>
                    <span className="text-slate-900 dark:text-foreground">
                      {transactionData.sourceAccount}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Client Reference
                    </span>
                    <span className="text-slate-900 dark:text-foreground">
                      {transactionData.reference}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-slate-50 dark:bg-white/5 my-2" />

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Subtotal Amount</span>
                    <span className="text-slate-900 dark:text-foreground font-bold">
                      {transactionData.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Processing Fees</span>
                    <span className="text-slate-900 dark:text-foreground font-bold">
                      {transactionData.fees}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 mt-2 border-t border-slate-50 dark:border-white/5">
                    <span className="text-slate-900 dark:text-foreground font-bold uppercase tracking-widest text-[10px]">
                      Total Payment
                    </span>
                    <span className="text-primary font-black">
                      {transactionData.netAmount}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-emerald-500/5 dark:bg-emerald-500/5 p-4 rounded-sm border border-emerald-500/10 dark:border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-slate-900 dark:text-foreground uppercase tracking-wider">
                  Secured Transaction
                </h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                  This payment is protected by enterprise-grade 256-bit SSL
                  encryption and has been verified by the central treasury.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-emerald-600 dark:text-emerald-500"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Col: Timeline & Audit */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm h-full">
            <div className="px-1 mb-3">
              <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] leading-none">
                Process Timeline
              </span>
            </div>
            <CardContent className="p-6 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] h-full flex flex-col gap-6">
              <TimelineItem
                status="Completed"
                title="Funds Disbursed"
                description="Successfully transferred to destination account"
                time="Feb 04, 2024 • 10:45 AM"
                isLast={false}
                active
              />
              <TimelineItem
                status="Completed"
                title="Bank Clearance"
                description="Mandiri Treasury clearance received"
                time="Feb 04, 2024 • 10:12 AM"
                isLast={false}
                active
              />
              <TimelineItem
                status="Completed"
                title="Internal Approval"
                description="Approved by CFO - Linda Santoso"
                time="Feb 04, 2024 • 09:30 AM"
                isLast={false}
                active
              />
              <TimelineItem
                status="Completed"
                title="Payment Initiated"
                description="Requested from Engineering Dept"
                time="Feb 04, 2024 • 09:00 AM"
                isLast={true}
                active
              />

              <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5">
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Quick Support
                  </span>
                  <Button
                    variant="outline"
                    className="w-full h-9 text-xs font-bold border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                  >
                    Report an issue
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-9 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    Request Refund/Void
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ title, description, time, isLast, active }: any) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div
          className={cn(
            "absolute left-[13px] top-[26px] bottom-[-24px] w-px",
            active ? "bg-emerald-500/30" : "bg-slate-100 dark:bg-white/5",
          )}
        />
      )}
      <div
        className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center shrink-0 z-10",
          active
            ? "bg-emerald-500/10 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            : "bg-slate-50 dark:bg-white/5 text-slate-300",
        )}
      >
        {active ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h4
          className={cn(
            "text-xs font-bold",
            active ? "text-slate-900 dark:text-foreground" : "text-slate-400",
          )}
        >
          {title}
        </h4>
        <p className="text-[10px] text-slate-500 leading-tight">
          {description}
        </p>
        <span className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
          {time}
        </span>
      </div>
    </div>
  );
}
