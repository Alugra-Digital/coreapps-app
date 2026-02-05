import {
  MoreHorizontal,
  ShieldCheck,
  Wallet,
  Landmark,
  PiggyBank,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const accountsData = [
  {
    id: 1,
    name: "Main Operations",
    number: "Bank Central • 1290",
    balance: "$342,900.00",
    icon: <Landmark className="h-4 w-4 text-emerald-500" />,
  },
  {
    id: 2,
    name: "Payroll Savings",
    number: "Federal Reserve • 8820",
    balance: "$124,500.00",
    icon: <PiggyBank className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 3,
    name: "Petty Cash",
    number: "On-Site Vault",
    balance: "$1,200.00",
    icon: <Wallet className="h-4 w-4 text-amber-500" />,
  },
  {
    id: 4,
    name: "Client Escrow",
    number: "Trust Bank • 3341",
    balance: "$89,000.00",
    icon: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  },
  {
    id: 5,
    name: "Investment Portfolio",
    number: "Merrill Lynch • 0092",
    balance: "$1,240,000.00",
    icon: <Briefcase className="h-4 w-4 text-slate-500" />,
  },
];

export function AccountBalances({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow flex flex-col",
        className,
      )}
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          Account Balances
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
          {accountsData.map((account) => (
            <div
              key={account.id}
              className="flex gap-4 group/item cursor-pointer"
            >
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover/item:bg-white dark:group-hover/item:bg-white/10 group-hover/item:shadow-sm transition-all">
                {account.icon}
              </div>
              <div className="mt-1 flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {account.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {account.number}
                </span>
              </div>
              <div className="mt-1 text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                  {account.balance}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full h-8 text-xs font-medium bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10 transition-all"
        >
          Manage All Accounts
        </Button>
      </CardContent>
    </Card>
  );
}
