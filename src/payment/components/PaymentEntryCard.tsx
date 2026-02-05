import {
  CreditCard,
  Banknote,
  MoreVertical,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentEntryCardProps {
  id: string;
  source: string;
  amount: string;
  date: string;
  method: "Wire Transfer" | "Credit Card" | "Direct Debit";
  status: "Completed" | "Processing" | "Failed";
}

export function PaymentEntryCard({
  id,
  source,
  amount,
  date,
  method,
  status,
}: PaymentEntryCardProps) {
  const isCompleted = status === "Completed";
  const isProcessing = status === "Processing";

  const navigate = useNavigate();

  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4 px-1">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
              method === "Wire Transfer" && "bg-blue-500/10 text-blue-500",
              method === "Credit Card" && "bg-purple-500/10 text-purple-500",
              method === "Direct Debit" && "bg-emerald-500/10 text-emerald-500",
            )}
          >
            {method === "Wire Transfer" ? (
              <Banknote className="h-5 w-5" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-foreground truncate">
              {source}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {id}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Amount
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-foreground">
                {amount}
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-bold px-2 py-0 border-none",
                isCompleted &&
                  "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
                isProcessing &&
                  "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
                status === "Failed" &&
                  "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500",
              )}
            >
              {status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {date}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {method}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="mt-3 px-1 flex justify-end">
        <Button
          variant="link"
          className="h-auto p-0 text-[10px] font-bold text-slate-400 hover:text-primary gap-1 no-underline"
          onClick={() => navigate("/finance/payment/detail")}
        >
          View Receipt <ArrowUpRight className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}
