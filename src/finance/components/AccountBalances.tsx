import { useMemo, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const accountsData = [
  {
    id: 1,
    name: "Main Operations",
    number: "Bank Central • 1290",
    balance: "Rp 5,31 M",
    icon: <Landmark className="h-4 w-4 text-emerald-500" />,
  },
  {
    id: 2,
    name: "Payroll Savings",
    number: "Federal Reserve • 8820",
    balance: "Rp 1,93 M",
    icon: <PiggyBank className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 3,
    name: "Petty Cash",
    number: "On-Site Vault",
    balance: "Rp 18,6 jt",
    icon: <Wallet className="h-4 w-4 text-amber-500" />,
  },
  {
    id: 4,
    name: "Client Escrow",
    number: "Trust Bank • 3341",
    balance: "Rp 1,38 M",
    icon: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  },
  {
    id: 5,
    name: "Investment Portfolio",
    number: "Merrill Lynch • 0092",
    balance: "Rp 19,2 M",
    icon: <Briefcase className="h-4 w-4 text-slate-500" />,
  },
];

export function AccountBalances({ className }: { className?: string }) {
  const [sortMode, setSortMode] = useState<"default" | "highest" | "lowest">(
    "default",
  );
  const [visibleCount, setVisibleCount] = useState<number>(accountsData.length);

  const parseRupiahText = (value: string) => {
    const normalized = value.toLowerCase().replace("rp", "").trim();
    const amount = Number.parseFloat(normalized.replace(",", "."));
    if (Number.isNaN(amount)) return 0;
    if (normalized.endsWith("m")) return amount * 1_000_000_000;
    if (normalized.endsWith("jt")) return amount * 1_000_000;
    return amount;
  };

  const displayedAccounts = useMemo(() => {
    const accounts = [...accountsData];
    if (sortMode === "highest") {
      accounts.sort(
        (a, b) => parseRupiahText(b.balance) - parseRupiahText(a.balance),
      );
    } else if (sortMode === "lowest") {
      accounts.sort(
        (a, b) => parseRupiahText(a.balance) - parseRupiahText(b.balance),
      );
    }
    return accounts.slice(0, visibleCount);
  }, [sortMode, visibleCount]);

  const handleManageAllAccounts = () => {
    setSortMode("default");
    setVisibleCount(accountsData.length);
    toast.success("All accounts are now visible");
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400"
              aria-label="Account balance actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSortMode("highest");
                toast.success("Sorted by highest balance");
              }}
            >
              Sort by Highest Balance
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSortMode("lowest");
                toast.success("Sorted by lowest balance");
              }}
            >
              Sort by Lowest Balance
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setVisibleCount(3);
                toast.success("Showing top 3 accounts");
              }}
            >
              Show Top 3 Accounts
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setVisibleCount(accountsData.length);
                toast.success("Showing all accounts");
              }}
            >
              Show All Accounts
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSortMode("default");
                setVisibleCount(accountsData.length);
                toast.success("Account view reset");
              }}
            >
              Reset View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
          {displayedAccounts.map((account) => (
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
          onClick={handleManageAllAccounts}
        >
          Manage All Accounts
        </Button>
      </CardContent>
    </Card>
  );
}
