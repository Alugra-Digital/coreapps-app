import {
  ArrowUpRight,
  Search,
  CheckCircle2,
  Clock,
  MoreVertical,
  CircleDashed,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import type { Project } from "@/project/types";

interface ActiveProjectsTableProps {
  projects: Project[];
}

function getStatusBadge(status: string) {
  const config: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    on_progress: {
      label: "On Track",
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500",
    },
    completed: {
      label: "Completed",
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500",
    },
    cancelled: {
      label: "Cancelled",
      icon: <Clock className="h-3 w-3" />,
      className: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500",
    },
  };
  const c = config[status] ?? {
    label: status,
    icon: <CircleDashed className="h-3 w-3" />,
    className: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400",
  };
  return (
    <Badge variant="outline" className={cn("rounded-lg px-2 py-0.5 text-[10px] font-bold border-none gap-1.5", c.className)}>
      {c.icon}
      {c.label}
    </Badge>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ActiveProjectsTable({ projects }: ActiveProjectsTableProps) {
  const activeProjects = projects.filter((p) => p.identity.status === "on_progress");

  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3 px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          Active Projects
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
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-x-auto no-scrollbar border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-slate-50/50 dark:bg-white/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Proj ID <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Project Name <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Client <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Status <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Start Date <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                End Date <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                PM <ArrowUpRight className="inline h-3 w-3 ml-0.5 opacity-50" />
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                  No active projects
                </TableCell>
              </TableRow>
            ) : (
              activeProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="group border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <TableCell className="text-xs font-bold text-slate-900 dark:text-foreground">
                    <Link
                      to="/projects"
                      className="hover:underline text-primary"
                    >
                      {project.identity.projectId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[180px] truncate">
                    {project.identity.namaProject}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                    {project.identity.clientName}
                  </TableCell>
                  <TableCell>{getStatusBadge(project.identity.status)}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {project.identity.startDate}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {project.identity.endDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border dark:border-white/10">
                        <AvatarFallback className="bg-muted dark:bg-white/5 text-[8px] font-bold text-foreground">
                          {getInitials(project.identity.projectManagerName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {project.identity.projectManagerName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      asChild
                    >
                      <Link to="/projects">
                        <MoreVertical className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
