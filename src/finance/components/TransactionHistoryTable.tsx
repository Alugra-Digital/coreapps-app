import {
  ChevronDown,
  Filter,
  Search,
  MoreVertical,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "TX-9012",
    date: "Feb 04, 2024",
    entity: "PT. Alpha Indonesia",
    category: "Consulting",
    amount: "$12,400.00",
    type: "inbound",
    status: "Completed",
  },
  {
    id: "TX-9013",
    date: "Feb 03, 2024",
    entity: "Global Logistics",
    category: "Operation",
    amount: "$3,250.00",
    type: "outbound",
    status: "Pending",
  },
  {
    id: "TX-9014",
    date: "Feb 02, 2024",
    entity: "Amazon Web Services",
    category: "Infrastructure",
    amount: "$1,890.00",
    type: "outbound",
    status: "Completed",
  },
  {
    id: "TX-9015",
    date: "Feb 01, 2024",
    entity: "Karya Mandiri Corp",
    category: "Tax Service",
    amount: "$7,500.00",
    type: "inbound",
    status: "Processing",
  },
  {
    id: "TX-9016",
    date: "Jan 31, 2024",
    entity: "Apple Inc. (Retail)",
    category: "Office Supplies",
    amount: "$1,200.00",
    type: "outbound",
    status: "Completed",
  },
];

export function TransactionHistoryTable() {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3 px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <CreditCard className="h-4 w-4" /> Recent Transactions
        </span>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              placeholder="Search..."
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-32 text-foreground"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            Export <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-white/5">
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
              <TableHead className="w-12 text-center py-4">
                <Checkbox className="rounded-sm border-slate-300 dark:border-white/20" />
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Transaction ID
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Entity & Category
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Amount
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Status
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, i) => (
              <TableRow
                key={tx.id}
                className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
              >
                <TableCell className="text-center py-3">
                  <Checkbox
                    checked={i === 0}
                    className="rounded-sm border-slate-300 dark:border-white/20 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-primary"
                  />
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {tx.id}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {tx.date}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg border border-slate-100 dark:border-white/5">
                      <AvatarFallback className="text-[10px] font-bold bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                        {tx.entity.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                        {tx.entity}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5">
                    {tx.type === "inbound" ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <ArrowDownLeft className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-bold",
                        tx.type === "inbound"
                          ? "text-emerald-600 dark:text-emerald-500"
                          : "text-slate-900 dark:text-foreground",
                      )}
                    >
                      {tx.amount}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0 rounded-full border-none",
                      tx.status === "Completed" &&
                        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
                      tx.status === "Pending" &&
                        "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
                      tx.status === "Processing" &&
                        "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500",
                    )}
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
