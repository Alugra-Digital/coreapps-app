import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SalesPipelineTableProps {
  recentDeals: any[];
}

export function SalesPipelineTable({ recentDeals }: SalesPipelineTableProps) {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <Package className="h-4 w-4" /> Active Sales Pipeline
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
        >
          View All Deals
        </Button>
      </div>
      <CardContent className="p-0 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-white/5">
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase py-4 px-6">
                Client & Deal ID
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-6">
                Deal Owner
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-6">
                Deal Value
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-6">
                Probability
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-6">
                Stage
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-6 text-right">
                Close Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentDeals.map((deal) => (
              <TableRow
                key={deal.id}
                className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5 group/row"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-900 dark:text-foreground border border-slate-200 dark:border-white/10">
                      {deal.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-foreground group-hover/row:text-primary transition-colors cursor-pointer">
                        {deal.client}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        {deal.id}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border dark:border-white/10">
                      <AvatarFallback className="bg-primary/5 text-primary text-[8px] font-bold">
                        AR
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {deal.owner}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-900 dark:text-foreground tracking-tight">
                    {deal.value}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 w-[140px]">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400">
                      <span>PROBABILITY</span>
                      <span>{deal.probability}%</span>
                    </div>
                    <Progress
                      value={deal.probability}
                      className="h-1 bg-slate-100 dark:bg-white/5"
                    />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0 border-none",
                      deal.status === "Closed Won"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                        : deal.status === "Negotiation"
                          ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500"
                          : deal.status === "Contracting"
                            ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500"
                            : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400",
                    )}
                  >
                    {deal.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    {deal.date}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
