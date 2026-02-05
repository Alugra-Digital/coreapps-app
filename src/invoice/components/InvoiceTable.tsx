import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Calendar,
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

const invoices = [
  {
    id: "INV-2024-001",
    client: "Bank Mandiri HQ",
    type: "Cloud Migration",
    amount: "$12,400.00",
    dueDate: "Feb 15, 2024",
    status: "Paid",
  },
  {
    id: "INV-2024-002",
    client: "Pertamina Corp",
    type: "Cyber Audit",
    amount: "$8,500.00",
    dueDate: "Feb 20, 2024",
    status: "Pending",
  },
  {
    id: "INV-2024-003",
    client: "Telkomsel Office",
    type: "Infrastructure",
    amount: "$4,200.00",
    dueDate: "Jan 30, 2024",
    status: "Overdue",
  },
  {
    id: "INV-2024-004",
    client: "Toyota Astra",
    type: "Software Dev",
    amount: "$15,000.00",
    dueDate: "Mar 01, 2024",
    status: "Paid",
  },
  {
    id: "INV-2024-005",
    client: "Unilever ID",
    type: "Consulting",
    amount: "$3,250.00",
    dueDate: "Feb 28, 2024",
    status: "Pending",
  },
];

export function InvoiceTable() {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3 px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <FileText className="h-4 w-4" /> Invoice Repository
        </span>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              placeholder="Search ID, Client..."
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-48 text-foreground"
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
            Actions <ChevronDown className="h-3.5 w-3.5" />
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
                Invoice ID
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Client & Project
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
            {invoices.map((inv, i) => (
              <TableRow
                key={inv.id}
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
                      {inv.id}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" /> {inv.dueDate}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg border border-slate-100 dark:border-white/5">
                      <AvatarFallback className="text-[10px] font-bold bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                        {inv.client.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                        {inv.client}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {inv.type}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 font-bold text-xs text-slate-900 dark:text-foreground">
                  {inv.amount}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0 rounded-full border-none",
                      inv.status === "Paid" &&
                        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
                      inv.status === "Pending" &&
                        "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
                      inv.status === "Overdue" &&
                        "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500",
                    )}
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-right">
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
