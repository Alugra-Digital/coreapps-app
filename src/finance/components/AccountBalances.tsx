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
import type { AccountBalance } from "@/api/finance";

const iconMap: Record<number, React.ReactNode> = {
  1: <Landmark className="h-4 w-4 text-emerald-500" />,
  2: <PiggyBank className="h-4 w-4 text-blue-500" />,
  3: <Wallet className="h-4 w-4 text-amber-500" />,
  4: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  5: <Briefcase className="h-4 w-4 text-slate-500" />,
};

export function AccountBalances({
  className,
  data,
}: {
  className?: string;
  data?: AccountBalance[] | null;
}) {
  const accountsData = useMemo(() => (data && data.length > 0 ? data : []), [data]);
  const hasData = accountsData.length > 0;
  const [sortMode, setSortMode] = useState<"default" | "highest" | "lowest">(
    "default",
  );
  const [visibleCount, setVisibleCount] = useState<number>(accountsData.length || 1);

  const parseBalance = (acc: AccountBalance) => acc.balance;

  const displayedAccounts = useMemo(() => {
    const accounts = [...accountsData];
    if (sortMode === "highest") {
      accounts.sort((a, b) => parseBalance(b) - parseBalance(a));
    } else if (sortMode === "lowest") {
      accounts.sort((a, b) => parseBalance(a) - parseBalance(b));
    }
    return accounts.slice(0, visibleCount);
  }, [sortMode, visibleCount, accountsData]);

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
          {hasData ? displayedAccounts.map((account) => (
            <div
              key={account.id}
              className="flex gap-4 group/item cursor-pointer"
            >
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover/item:bg-white dark:group-hover/item:bg-white/10 group-hover/item:shadow-sm transition-all">
                {iconMap[account.id] ?? <Wallet className="h-4 w-4 text-slate-500" />}
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
                  {account.formattedBalance}
                </span>
              </div>
            </div>
          )) : (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
              No account balances available
            </div>
          )}
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
