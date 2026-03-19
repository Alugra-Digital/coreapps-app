import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  FileDown,
  Send,
  CheckCircle,
  CalendarClock,
  Crown,
  CircleDollarSign,
  TimerReset,
  Building2,
  UserCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProposals } from "@/hooks/useProposal";
import { ProposalPenawaranTable } from "./components/ProposalPenawaranTable";
import type { ProposalPenawaran } from "./types";
import { PageLoader } from "@/components/ui/PageLoader";

type ProposalStatus = "draft" | "sent" | "accepted" | "rejected" | "cancelled";

type ProposalRecord = {
  id: string;
  proposalNo: string;
  title: string;
  clientName: string;
  industry: string;
  owner: string;
  submittedAt: string;
  responseDueAt: string;
  amount: number;
  probability: number;
  status: ProposalStatus;
  nextAction: string;
};

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function mapProposalToRecord(p: ProposalPenawaran): ProposalRecord {
  return {
    id: String(p.id),
    proposalNo: p.proposalNumber ?? String(p.id),
    title: p.coverInfo?.jobOffer ?? "",
    clientName: p.clientInfo?.clientName ?? "",
    industry: "",
    owner: "",
    submittedAt: p.documentApproval?.date ?? p.createdAt ?? "",
    responseDueAt: "",
    amount: p.totalEstimatedCost ?? 0,
    probability: 0,
    status: p.status ?? "draft",
    nextAction: "",
  };
}

export default function ProposalPenawaranPage() {
  const navigate = useNavigate();
  const { data: proposalsRaw = [], refetch, isLoading, isError, error } = useProposals();

  const proposalsList: ProposalPenawaran[] = Array.isArray(proposalsRaw) ? proposalsRaw : [];
  const proposals: ProposalRecord[] = proposalsList.map(mapProposalToRecord);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
        <div className="flex flex-col gap-4 items-center justify-center min-h-[400px]">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
            Failed to load proposals
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
            {error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "Unable to fetch data. Ensure the API gateway and finance service are running."}
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalProposal = proposals.length;
  const draftCount = proposals.filter((p) => p.status === "draft").length;
  const sentCount = proposals.filter((p) => p.status === "sent").length;
  const acceptedCount = proposals.filter((p) => p.status === "accepted").length;
  const rejectedCount = proposals.filter((p) => p.status === "rejected").length;
  const winRate = totalProposal ? Math.round((acceptedCount / totalProposal) * 100) : 0;
  const avgValue = totalProposal ? Math.round(proposals.reduce((sum, p) => sum + p.amount, 0) / totalProposal) : 0;
  const avgProbability = totalProposal ? Math.round(proposals.reduce((sum, p) => sum + p.probability, 0) / totalProposal) : 0;
  const spotlight = proposals[0];
  const actionQueue = proposals
    .filter((p) => p.status !== "accepted")
    .slice(0, 4);
  const statusBars = [
    { label: "Draft", value: totalProposal ? Math.round((draftCount / totalProposal) * 100) : 0, color: "bg-slate-500" },
    { label: "Sent", value: totalProposal ? Math.round((sentCount / totalProposal) * 100) : 0, color: "bg-blue-500" },
    { label: "Accepted", value: totalProposal ? Math.round((acceptedCount / totalProposal) * 100) : 0, color: "bg-emerald-500" },
    { label: "Rejected", value: totalProposal ? Math.round((rejectedCount / totalProposal) * 100) : 0, color: "bg-rose-500" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            Proposal Penawaran
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor progress proposal komersial dari draft sampai keputusan akhir client.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Proposal
          </Button>
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
            onClick={() => navigate("/finance/proposal-penawaran/create")}
          >
            <Plus className="h-4 w-4" /> Add Proposal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <TemplateCard
          code="Overview"
          title="Sales Snapshot"
          description="Volume proposal aktif, status delivery, dan nilai rata-rata proposal."
          color="#3b82f6"
          icon={<FileText className="h-3.5 w-3.5" />}
        />
        <TemplateCard
          code="Pipeline"
          title="Funnel Health"
          description="Keseimbangan proposal antar stage untuk menghindari bottleneck."
          color="#8b5cf6"
          icon={<Send className="h-3.5 w-3.5" />}
        />
        <TemplateCard
          code="Register"
          title="Proposal Register"
          description="Daftar utama seluruh proposal dengan detail owner dan next step."
          color="#10b981"
          icon={<CheckCircle className="h-3.5 w-3.5" />}
        />
        <TemplateCard
          code="Insights"
          title="Action Board"
          description="Prioritas follow-up untuk mempercepat closing dan handover project."
          color="#f59e0b"
          icon={<TimerReset className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="xl:col-span-8 h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Proposal Command Center
                </p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-foreground mt-1">
                  Ringkasan performa proposal bulan berjalan
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Menampilkan outcome proposal, kualitas peluang, dan rata-rata nilai commercial.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Updated Daily
                </span>
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Q1 2026
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <MetricCard
                label="Total Proposal"
                value={String(totalProposal)}
                helper="Seluruh proposal pada pipeline aktif"
                color="#3b82f6"
                icon={<FileText className="h-3.5 w-3.5" />}
              />
              <MetricCard
                label="Win Rate"
                value={`${winRate}%`}
                helper="Accepted dibandingkan total proposal"
                color="#10b981"
                icon={<CheckCircle className="h-3.5 w-3.5" />}
              />
              <MetricCard
                label="Average Value"
                value={`IDR ${(avgValue / 1000000).toFixed(1)}M`}
                helper="Nilai rata-rata per dokumen proposal"
                color="#f59e0b"
                icon={<CircleDollarSign className="h-3.5 w-3.5" />}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Status Distribution
            </span>
          </div>
          <CardContent className="h-full p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
            {statusBars.map((item) => (
              <StatusRow key={item.label} label={item.label} value={item.value} color={item.color} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-9 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              title="Draft Queue"
              value={String(draftCount)}
              description="Proposal menunggu final review"
              progress={totalProposal ? Math.round((draftCount / totalProposal) * 100) : 0}
              color="#8b5cf6"
              icon={<TimerReset className="h-4 w-4" />}
            />
            <KpiCard
              title="Sent to Client"
              value={String(sentCount)}
              description="Dokumen sudah dikirim dan menunggu feedback"
              progress={totalProposal ? Math.round((sentCount / totalProposal) * 100) : 0}
              color="#3b82f6"
              icon={<Send className="h-4 w-4" />}
            />
            <KpiCard
              title="Avg. Win Probability"
              value={`${avgProbability}%`}
              description="Estimasi peluang berdasarkan nilai pipeline"
              progress={avgProbability}
              color="#10b981"
              icon={<CalendarClock className="h-4 w-4" />}
            />
          </div>

          <ProposalPenawaranTable
            proposals={proposalsList}
            onRefresh={() => refetch()}
          />
        </div>

        <div className="xl:col-span-3 flex flex-col gap-4">
          {spotlight && (
            <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Opportunity Spotlight
                </span>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm bg-amber-500/15 text-amber-500">
                  <Crown className="h-4 w-4" />
                </div>
              </div>
              <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-foreground">{spotlight.proposalNo}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {spotlight.title}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <MiniStat label="Value" value={`IDR ${(spotlight.amount / 1000000).toFixed(1)}M`} />
                  <MiniStat label="Chance" value={`${spotlight.probability}%`} />
                  <MiniStat label="Status" value={spotlight.status} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{spotlight.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <UserCircle2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{spotlight.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Response due {formatDate(spotlight.responseDueAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Action Queue
              </span>
              <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                {actionQueue.length} Tasks
              </span>
            </div>
            <CardContent className="p-0 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] divide-y divide-slate-100 dark:divide-white/5">
              {actionQueue.map((proposal) => (
                <div key={proposal.id} className="p-3">
                  <p className="text-xs font-semibold text-slate-900 dark:text-foreground">
                    {proposal.proposalNo}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {proposal.nextAction}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon,
  color,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="h-full rounded-sm border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <div
          className="h-7 w-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-lg font-bold text-slate-900 dark:text-foreground mt-2">{value}</p>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{helper}</p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-900 dark:text-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  description,
  progress,
  color,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  progress: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
      <CardContent className="h-full p-3 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {title}
          </span>
          <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-foreground mt-2">{value}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden mt-auto pt-0">
          <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(progress, 100))}%`, backgroundColor: color }} />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-sm border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 px-2 py-1.5">
      <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xs font-semibold text-slate-900 dark:text-foreground mt-0.5 line-clamp-1">{value}</p>
    </div>
  );
}

function TemplateCard({
  code,
  title,
  description,
  icon,
  color,
}: {
  code: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
      <CardContent className="h-full p-3 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {code}
          </span>
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-foreground mt-2">{title}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
