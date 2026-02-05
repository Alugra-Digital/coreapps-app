import {
  ArrowUpRight,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  MoreVertical,
  CircleDashed,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

const implementationData = [
  {
    id: "#ERP-771",
    client: "PT. Alpha Indonesia",
    phase: "Build & Config",
    lead: "Sarah Lee",
    status: "On Track",
    startDate: "2024-01-15",
    goLive: "Mar 20",
    avatar: "SL",
  },
  {
    id: "#ERP-772",
    client: "Global Logistics Ltd",
    phase: "GAP Analysis",
    lead: "John Doe",
    status: "In Review",
    startDate: "2024-01-18",
    goLive: "Apr 05",
    avatar: "JD",
  },
  {
    id: "#ERP-773",
    client: "TechFlow Systems",
    phase: "UAT Testing",
    lead: "Michael Wong",
    status: "Delayed",
    startDate: "2024-01-20",
    goLive: "Feb 28",
    avatar: "MW",
  },
  {
    id: "#ERP-774",
    client: "EcoBuild Solutions",
    phase: "Discovery",
    lead: "Jane Smith",
    status: "Planning",
    startDate: "2024-01-22",
    goLive: "May 15",
    avatar: "JS",
  },
];

export function SLAMonitoringTable() {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3 px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" /> Active Implementations
        </span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              placeholder="Project ID"
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-32 text-foreground"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
          >
            <Filter className="h-3 w-3" /> Filter
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-x-auto no-scrollbar border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <Table className="min-w-[1000px]">
          <TableHeader className="bg-slate-50/50 dark:bg-white/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-12">
                <Checkbox className="rounded-xs border-slate-300 dark:border-white/20" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Proj ID{" "}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Client Name{" "}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Implementation Phase{" "}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Consultant Lead{" "}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Health Status{" "}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Start Date{" "}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Target Go-Live{" "}
                <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {implementationData.map((row, i) => (
              <TableRow
                key={row.id}
                className="group border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={i === 0}
                    className="rounded-xs border-slate-300 dark:border-white/20 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-primary"
                  />
                </TableCell>
                <TableCell className="text-xs font-bold text-slate-900 dark:text-foreground">
                  {row.id}
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {row.client}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-none font-medium h-5"
                    >
                      {row.phase}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border dark:border-white/10">
                      <AvatarFallback className="bg-muted dark:bg-white/5 text-[8px] font-bold text-foreground">
                        {row.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {row.lead}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-lg px-2 py-0.5 text-[10px] font-bold border-none gap-1.5",
                      row.status === "On Track"
                        ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500"
                        : row.status === "Delayed"
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500"
                          : row.status === "In Review"
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500"
                            : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
                    )}
                  >
                    {row.status === "On Track" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : row.status === "Delayed" ? (
                      <Clock className="h-3 w-3" />
                    ) : row.status === "In Review" ? (
                      <CircleDashed className="h-3 w-3" />
                    ) : (
                      <PlayCircle className="h-3 w-3" />
                    )}
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500 dark:text-slate-500">
                  {row.startDate}
                </TableCell>
                <TableCell className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {row.goLive}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <MoreVertical className="h-4 w-4" />
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
