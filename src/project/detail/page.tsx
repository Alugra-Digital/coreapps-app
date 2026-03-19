import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  LayoutDashboard,
  Wallet,
  DollarSign,
  Layers,
  Clock,
  FileText,
  Plus,
  Upload,
  TrendingUp,
  Receipt,
  FileQuestion
} from "lucide-react";
import { useProjectById } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  PIPELINE: "Pipeline",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
  ON_PROGRESS: "On Progress",
  on_progress: "On Progress",
  ON_HOLD: "On Hold",
  READY_TO_CLOSE: "Ready to Close",
  COMPLETED: "Completed",
  completed: "Completed",
  CANCELLED: "Cancelled",
  cancelled: "Cancelled",
};

// --- Helper Components ---

function MetricRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between py-3 border-b border-[#1E1E22] last:border-0", className)}>
      <span className="text-[#6B6B75] text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className="text-[#F0F0F0] text-sm font-bold">{value}</span>
    </div>
  );
}

function CurrencyValue({ value }: { value: number }) {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value);

  return (
    <span className="font-mono text-[#F0F0F0]">
      Rp {formatted}
    </span>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-[#1E1E22] rounded-xl bg-[#111113]/50">
      <div className="h-14 w-14 rounded-full bg-[#F5A623]/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-[#F5A623]" />
      </div>
      <h3 className="text-[#F0F0F0] font-bold text-lg">{title}</h3>
      <p className="text-[#6B6B75] text-sm mt-1 max-w-xs">{description}</p>
      {actionLabel && (
        <Button
          onClick={onAction}
          className="mt-6 bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-6 h-10 transition-all rounded-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// --- Main Page Component ---

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProjectById(id);
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0A0A0B] text-[#F0F0F0]">
        <div className="animate-pulse h-12 w-64 bg-[#111113] rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-pulse h-[400px] bg-[#111113] rounded-xl" />
          <div className="animate-pulse h-[400px] bg-[#111113] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col gap-6 p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0A0A0B] items-center justify-center text-center">
        <EmptyState
          icon={FileQuestion}
          title="Project Not Found"
          description="The project you are looking for does not exist or has been removed."
          actionLabel="Go to Projects"
          onAction={() => navigate("/projects")}
        />
      </div>
    );
  }

  const status = project.identity?.status ?? "ON_PROGRESS";
  const finance = project.finance ?? {};
  const contractValue = project.identity?.price ?? finance.contractValue ?? 0;
  const expenses = project.expenses ?? [];
  const preCostExpenses = expenses.filter((e) => e.phase === "PRE_COST");
  const onGoingExpenses = expenses.filter((e) => e.phase === "ON_GOING" || !e.phase);
  const preCostTotal = preCostExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const onGoingTotal = onGoingExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalExpense = preCostTotal + onGoingTotal;

  // Calculate Timeline
  const startDate = project.identity?.startDate ? new Date(project.identity.startDate) : null;
  const endDate = project.identity?.endDate ? new Date(project.identity.endDate) : null;
  const now = new Date();

  let progress = 0;
  let daysRemaining = 0;

  if (startDate && endDate) {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  };

  return (
    <div className="flex flex-col p-0 bg-[#0A0A0B] min-h-screen text-[#F0F0F0] selection:bg-[#F5A623]/20">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-6 border-b border-[#1E1E22] bg-[#0A0A0B]">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 bg-[#111113] border border-[#1E1E22] hover:bg-[#1E1E22] text-[#6B6B75] hover:text-[#F0F0F0] rounded-lg"
          >
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#F0F0F0]">
                {project.identity?.namaProject ?? "Project"}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5A623] text-black">
                {STATUS_LABELS[status]?.toUpperCase() ?? status.toUpperCase()}
              </span>
            </div>
            <p className="text-[#6B6B75] text-sm mt-1.5 font-medium flex items-center gap-2">
              <span className="text-[#F5A623] font-bold">{project.identity?.clientName}</span>
              <span className="text-[#1E1E22]">|</span>
              <span>{project.identity?.projectId ?? project.id}</span>
            </p>
          </div>
        </div>

        {/* Sticky Tab Bar */}
        <div className="sticky top-0 z-10 bg-[#0A0A0B]/80 backdrop-blur-md pt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent h-12 p-0 flex space-x-8 border-b border-[#1E1E22] w-full justify-start rounded-none">
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard },
                { id: "finance", label: "Finance", icon: Wallet },
                { id: "termin", label: "Termin", icon: Receipt },
                { id: "expenses", label: "Expenses", icon: DollarSign },
                { id: "documents", label: "Documents", icon: FileText },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "bg-transparent h-full px-1 py-0 rounded-none border-b-2 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest",
                    activeTab === tab.id
                      ? "border-[#F5A623] text-[#F0F0F0]"
                      : "border-transparent text-[#6B6B75] hover:text-[#A1A1AA]"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-[#F5A623]" : "text-current")} />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 max-w-[1600px] w-full mx-auto">
        <Tabs value={activeTab} className="w-full">
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Project Info Card */}
              <Card className="lg:col-span-7 bg-[#111113] border border-[#1E1E22] p-6 hover:border-[#F5A623]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
                    <FolderKanban className="h-4 w-4 text-[#F5A623]" />
                  </div>
                  <h3 className="text-[#F0F0F0] font-bold uppercase tracking-widest text-sm">Project Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                  <div className="space-y-1">
                    <MetricRow label="Scope" value={project.identity?.scopeProject ?? "-"} />
                    <MetricRow label="Contract Value" value={<CurrencyValue value={contractValue} />} />
                    <MetricRow label="Start Date" value={formatDisplayDate(project.identity?.startDate)} />
                  </div>
                  <div className="space-y-1">
                    <MetricRow label="End Date" value={formatDisplayDate(project.identity?.endDate)} />
                    <MetricRow label="Project Manager" value={project.identity?.projectManagerName ?? "-"} />
                    <MetricRow label="PIC Name" value={project.identity?.picName ?? "-"} />
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="mt-10 p-6 bg-[#0A0A0B] border border-[#1E1E22] rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#F5A623]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Project Timeline</span>
                    </div>
                    {daysRemaining > 0 ? (
                      <div className="bg-[#F5A623]/10 border border-[#F5A623]/20 px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#F5A623] uppercase">{daysRemaining} DAYS REMAINING</span>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-500 uppercase">
                        COMPLETED
                      </div>
                    )}
                  </div>

                  <Progress value={progress} className="h-2 bg-[#1E1E22]" indicatorClassName="bg-[#F5A623]" />

                  <div className="flex justify-between mt-3">
                    <span className="text-[10px] font-medium text-[#6B6B75] uppercase">{formatDisplayDate(project.identity?.startDate)}</span>
                    <span className="text-[10px] font-bold text-[#F5A623]">{Math.round(progress)}% ELAPSED</span>
                    <span className="text-[10px] font-medium text-[#6B6B75] uppercase">{formatDisplayDate(project.identity?.endDate)}</span>
                  </div>
                </div>
              </Card>

              {/* Financial Summary Card */}
              <Card className="lg:col-span-5 bg-[#111113] border border-[#1E1E22] p-6 hover:border-[#F5A623]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-[#F5A623]" />
                  </div>
                  <h3 className="text-[#F0F0F0] font-bold uppercase tracking-widest text-sm">Financial Summary</h3>
                </div>

                <div className="space-y-1">
                  <div className="bg-[#0A0A0B] p-4 rounded-xl border border-[#1E1E22] mb-6">
                    <p className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Contract Value</p>
                    <p className="text-2xl font-bold text-[#F0F0F0] font-mono leading-none">
                      Rp {new Intl.NumberFormat("id-ID").format(contractValue)}
                    </p>
                  </div>

                  <MetricRow label="Total Expense" value={<CurrencyValue value={totalExpense} />} />
                  <MetricRow label="Pre-cost Phase" value={<CurrencyValue value={preCostTotal} />} className="pl-4 border-l border-[#1E1E22]" />
                  <MetricRow label="On-going Phase" value={<CurrencyValue value={onGoingTotal} />} className="pl-4 border-l border-[#1E1E22]" />
                  <MetricRow label="Total Invoiced" value={<CurrencyValue value={finance.totalInvoiced ?? 0} />} />
                  <MetricRow label="Total Paid" value={<CurrencyValue value={finance.totalPaid ?? 0} />} className="text-emerald-500" />

                  {/* Utilization Indicator */}
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-wider">Budget Utilization</span>
                      <span className="text-[10px] font-mono font-bold text-[#A1A1AA]">
                        {contractValue > 0 ? ((totalExpense / contractValue) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={contractValue > 0 ? (totalExpense / contractValue) * 100 : 0}
                      className="h-1.5 bg-[#1E1E22]"
                      indicatorClassName={totalExpense > contractValue ? "bg-red-500" : "bg-emerald-500"}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* FINANCE TAB */}
          <TabsContent value="finance" className="mt-0 animate-in fade-in duration-500">
            <Card className="bg-[#111113] border border-[#1E1E22] p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-10 w-10 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-[#F5A623]" />
                </div>
                <div>
                  <h3 className="text-[#F0F0F0] font-bold uppercase tracking-[0.2em] text-sm leading-tight">Project P&L Details</h3>
                  <p className="text-[#6B6B75] text-[10px] mt-1 uppercase font-bold tracking-widest">Real-time financial performance tracking</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-[#0A0A0B] p-6 rounded-2xl border border-[#1E1E22] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wallet className="h-12 w-12" />
                  </div>
                  <p className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest mb-2">Contract Revenue</p>
                  <p className="text-xl font-bold font-mono"><CurrencyValue value={contractValue} /></p>
                </div>
                <div className="bg-[#0A0A0B] p-6 rounded-2xl border border-[#1E1E22] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Receipt className="h-12 w-12" />
                  </div>
                  <p className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest mb-2">Accrued Expenses</p>
                  <p className="text-xl font-bold font-mono"><CurrencyValue value={totalExpense} /></p>
                </div>
                <div className="bg-[#0A0A0B] p-6 rounded-2xl border border-[#1E1E22] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="h-12 w-12" />
                  </div>
                  <p className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Margin</p>
                  <p className={cn("text-xl font-bold font-mono", (contractValue - totalExpense) >= 0 ? "text-emerald-500" : "text-red-500")}>
                    <CurrencyValue value={contractValue - totalExpense} />
                  </p>
                </div>
              </div>

              {/* Progress Comparison */}
              <div className="space-y-8 max-w-2xl">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <p className="text-xs font-bold text-[#F0F0F0] uppercase tracking-widest">Expense vs Revenue Ratio</p>
                    <p className="text-lg font-mono font-bold text-[#F5A623]">{contractValue > 0 ? ((totalExpense / contractValue) * 100).toFixed(1) : 0}%</p>
                  </div>
                  <div className="h-4 bg-[#0A0A0B] rounded-full border border-[#1E1E22] p-1">
                    <Progress
                      value={contractValue > 0 ? (totalExpense / contractValue) * 100 : 0}
                      className="h-full bg-transparent"
                      indicatorClassName="bg-gradient-to-r from-[#F5A623] to-[#D98E1C] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TERMIN TAB */}
          <TabsContent value="termin" className="mt-0 animate-in fade-in duration-500">
            {project.termin && project.termin.length > 0 ? (
              <Card className="bg-[#111113] border border-[#1E1E22] overflow-hidden">
                <div className="p-6 border-b border-[#1E1E22] flex justify-between items-center bg-[#111113]">
                  <h3 className="text-[#F0F0F0] font-bold uppercase tracking-widest text-sm">Payment Schedule</h3>
                  <Button size="sm" className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-4 rounded-md">
                    <Plus className="h-4 w-4 mr-2" /> Add Termin
                  </Button>
                </div>
                <div className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0A0A0B] border-b border-[#1E1E22]">
                        <th className="px-6 py-4 text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest text-center">No</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest">Description</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest text-right">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest text-center">%</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-[#6B6B75] uppercase tracking-widest text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E22]">
                      {project.termin.map((t) => (
                        <tr key={t.terminId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-[#6B6B75] text-center">{t.terminNumber}</td>
                          <td className="px-6 py-4 text-xs font-bold text-[#F0F0F0]">{t.description}</td>
                          <td className="px-6 py-4 text-xs font-mono font-bold text-right"><CurrencyValue value={t.amount} /></td>
                          <td className="px-6 py-4 text-xs font-mono text-center text-[#6B6B75]">{t.percentage}%</td>
                          <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                              t.status === "PAID" ? "bg-emerald-500/10 text-emerald-500" : "bg-[#F5A623]/10 text-[#F5A623]"
                            )}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={Receipt}
                title="No Payment Schedule"
                description="This project doesn't have any payment milestones or terms defined yet."
                actionLabel="Add Termin"
                onAction={() => { }}
              />
            )}
          </TabsContent>

          {/* EXPENSES TAB */}
          <TabsContent value="expenses" className="mt-0 animate-in fade-in duration-500 space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Pre-cost */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-[#F0F0F0] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm bg-[#8B5CF6]" /> Pre-cost Expenses
                  </h3>
                  <span className="text-[10px] font-mono text-[#6B6B75] font-bold"><CurrencyValue value={preCostTotal} /></span>
                </div>

                {preCostExpenses.length > 0 ? (
                  <Card className="bg-[#111113] border border-[#1E1E22] divide-y divide-[#1E1E22]">
                    {preCostExpenses.map((e) => (
                      <div key={e.expenseId} className="p-4 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
                        <div>
                          <p className="text-xs font-bold text-[#F0F0F0]">{e.description || e.category}</p>
                          <p className="text-[10px] text-[#6B6B75] uppercase font-medium mt-0.5 tracking-wider">{formatDisplayDate(e.date)}</p>
                        </div>
                        <p className="text-xs font-mono font-bold"><CurrencyValue value={e.amount} /></p>
                      </div>
                    ))}
                  </Card>
                ) : (
                  <EmptyState
                    icon={DollarSign}
                    title="No Pre-cost Expenses"
                    description="No expenses recorded for the pre-costing phase of this project."
                    actionLabel="Add Expense"
                  />
                )}
              </div>

              {/* On-going */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-[#F0F0F0] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm bg-[#3B82F6]" /> On-going Expenses
                  </h3>
                  <span className="text-[10px] font-mono text-[#6B6B75] font-bold"><CurrencyValue value={onGoingTotal} /></span>
                </div>

                {onGoingExpenses.length > 0 ? (
                  <Card className="bg-[#111113] border border-[#1E1E22] divide-y divide-[#1E1E22]">
                    {onGoingExpenses.map((e) => (
                      <div key={e.expenseId} className="p-4 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
                        <div>
                          <p className="text-xs font-bold text-[#F0F0F0]">{e.description || e.category}</p>
                          <p className="text-[10px] text-[#6B6B75] uppercase font-medium mt-0.5 tracking-wider">{formatDisplayDate(e.date)}</p>
                        </div>
                        <p className="text-xs font-mono font-bold"><CurrencyValue value={e.amount} /></p>
                      </div>
                    ))}
                  </Card>
                ) : (
                  <EmptyState
                    icon={TrendingUp}
                    title="No On-going Expenses"
                    description="Operational and ongoing project costs will appear here once recorded."
                    actionLabel="Add Expense"
                  />
                )}
              </div>
            </div>

            <div className="p-6 bg-[#111113] border border-[#1E1E22] rounded-xl flex justify-between items-center">
              <span className="text-xs font-bold text-[#6B6B75] uppercase tracking-[0.2em]">Total Project Expenditure</span>
              <span className="text-xl font-mono font-bold text-[#F5A623]"><CurrencyValue value={totalExpense} /></span>
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="mt-0 animate-in fade-in duration-500">
            {project.documents && project.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.documents.map((d, i) => (
                  <Card key={i} className="bg-[#111113] border border-[#1E1E22] p-5 hover:border-[#F5A623]/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 transition-colors group-hover:bg-[#F5A623]/10 group-hover:border-[#F5A623]/20">
                        <FileText className="h-5 w-5 text-[#6B6B75] group-hover:text-[#F5A623]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#F0F0F0] truncate" title={d.name}>{d.name}</p>
                        <p className="text-[10px] text-[#6B6B75] mt-0.5 font-medium uppercase tracking-widest">Added Recently</p>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-7 text-[10px] font-bold bg-[#1C1C1E] border-white/5 hover:bg-white/5 text-[#F0F0F0] px-3 transition-colors"
                          >
                            <a href={d.url} target="_blank" rel="noreferrer">DOWNLOAD</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <button className="border-2 border-dashed border-[#1E1E22] rounded-xl flex flex-col items-center justify-center p-8 hover:bg-white/[0.01] hover:border-[#F5A623]/30 transition-all group">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#F5A623]/10">
                    <Upload className="h-5 w-5 text-[#6B6B75] group-hover:text-[#F5A623]" />
                  </div>
                  <p className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Upload Document</p>
                </button>
              </div>
            ) : (
              <EmptyState
                icon={Upload}
                title="No Documents Attached"
                description="Keep all project files, contracts, and proposals in one secure place."
                actionLabel="Upload Document"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
