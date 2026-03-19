import {
  FileText,
  Plus,
  FileDown,
  Send,
  Handshake,
  Crown,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  TimerReset,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuotations } from "@/hooks/useQuotations";
import type { Quotation } from "@/finance/quotations/types";

type QuotationRecord = {
  id: string;
  quotationNo: string;
  clientName: string;
  projectName: string;
  picName: string;
  email: string;
  phone: string;
  city: string;
  validUntil: string;
  amount: number;
  probability: number;
  status: Quotation["status"];
};

function mapQuotationToRecord(q: Quotation): QuotationRecord {
  return {
    id: String(q.id),
    quotationNo: q.quotationNumber ?? String(q.id),
    clientName: q.clientName ?? "",
    projectName: q.projectName ?? "",
    picName: "",
    email: "",
    phone: "",
    city: "",
    validUntil: q.validUntil ?? "",
    amount: q.grandTotal ?? 0,
    probability: 0,
    status: q.status ?? "draft",
  };
}

export default function QuotationsPage() {
  const { data: quotationsRaw = [] } = useQuotations();
  const quotations: QuotationRecord[] = Array.isArray(quotationsRaw)
    ? quotationsRaw.map(mapQuotationToRecord)
    : [];

  const totalQuotations = quotations.length;
  const draftCount = quotations.filter((q) => q.status === "draft").length;
  const sentCount = quotations.filter((q) => q.status === "sent").length;
  const acceptedCount = quotations.filter((q) => q.status === "accepted").length;
  const winRate = totalQuotations ? Math.round((acceptedCount / totalQuotations) * 100) : 0;
  const averageValue = totalQuotations ? Math.round(quotations.reduce((sum, q) => sum + q.amount, 0) / totalQuotations) : 0;
  const averageProbability = totalQuotations ? Math.round(quotations.reduce((sum, q) => sum + q.probability, 0) / totalQuotations) : 0;
  const spotlightQuotation = quotations[0];
  const statusMix = totalQuotations
    ? [
        { label: "Draft", value: Math.round((draftCount / totalQuotations) * 100), color: "bg-slate-500" },
        { label: "Sent", value: Math.round((sentCount / totalQuotations) * 100), color: "bg-blue-500" },
        { label: "Negotiation", value: Math.round((quotations.filter((q) => q.status === "negotiation").length / totalQuotations) * 100), color: "bg-violet-500" },
        { label: "Accepted", value: Math.round((acceptedCount / totalQuotations) * 100), color: "bg-emerald-500" },
      ]
    : [
        { label: "Draft", value: 0, color: "bg-slate-500" },
        { label: "Sent", value: 0, color: "bg-blue-500" },
        { label: "Negotiation", value: 0, color: "bg-violet-500" },
        { label: "Accepted", value: 0, color: "bg-emerald-500" },
      ];
  const layoutSlots = [
    {
      code: "Overview",
      title: "Executive Summary",
      description: "Snapshot of quotation volume, activity, and conversion performance.",
      icon: <FileText className="h-3.5 w-3.5" />,
      color: "#3b82f6",
    },
    {
      code: "Pipeline",
      title: "Funnel Progress",
      description: "Current quotation movement from draft to accepted stage.",
      icon: <Send className="h-3.5 w-3.5" />,
      color: "#8b5cf6",
    },
    {
      code: "Operations",
      title: "Quotation Register",
      description: "Main working table for all active and historical quotations.",
      icon: <BadgeCheck className="h-3.5 w-3.5" />,
      color: "#10b981",
    },
    {
      code: "Insights",
      title: "Commercial Insights",
      description: "Supporting cards for spotlight opportunities and status distribution.",
      icon: <TimerReset className="h-3.5 w-3.5" />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Quotations Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor quotation activity, conversion pipeline, and value trends in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Quotations
          </Button>
          <Button className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
            <Plus className="h-4 w-4" /> Add Quotation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {layoutSlots.map((slot) => (
          <TemplateSlotCard
            key={slot.code}
            code={slot.code}
            title={slot.title}
            description={slot.description}
            icon={slot.icon}
            color={slot.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="xl:col-span-8 h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Quotation Overview
                </p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-foreground mt-1">
                  Quotation pipeline and proposal performance overview
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Consolidated view of proposal activity and current conversion outcomes.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Updated Daily
                </span>
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Live Data
                </span>
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  Q1 2026
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <CompactMetric
                label="Total Quotations"
                value={String(totalQuotations)}
                helper="All proposal records"
                color="#3b82f6"
                icon={<FileText className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="Sent Quotations"
                value={String(sentCount)}
                helper="Already delivered to clients"
                color="#10b981"
                icon={<Send className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="Win Rate"
                value={`${winRate}%`}
                helper="Accepted over total quotations"
                color="#f59e0b"
                icon={<BadgeCheck className="h-3.5 w-3.5" />}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Quotation Stage Funnel
            </span>
          </div>
          <CardContent className="h-full p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
            <FunnelStep label="Draft" value={18} color="bg-slate-500" />
            <FunnelStep label="Sent" value={12} color="bg-blue-500" />
            <FunnelStep label="Negotiation" value={9} color="bg-violet-500" />
            <FunnelStep label="Accepted" value={5} color="bg-emerald-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-9 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiStripCard
              title="Draft Backlog"
              value={String(draftCount)}
              description="Need review before send"
              progress={83}
              color="#8b5cf6"
              icon={<Handshake className="h-4 w-4" />}
            />
            <KpiStripCard
              title="Average Quote Value"
              value={`IDR ${(averageValue / 1000000).toFixed(1)}M`}
              description="Mean quotation amount"
              progress={Math.min(Math.round((averageValue / 300000000) * 100), 100)}
              color="#f59e0b"
              icon={<CircleDollarSign className="h-4 w-4" />}
            />
            <KpiStripCard
              title="Average Win Probability"
              value={`${averageProbability}%`}
              description="Estimated conversion chance"
              progress={averageProbability}
              color="#10b981"
              icon={<TimerReset className="h-4 w-4" />}
            />
          </div>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Quotation Register
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {totalQuotations} Records
              </span>
            </div>
            <CardContent className="p-0 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Quotation</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Client</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">PIC</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Valid Until</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {quotations.map((quotation) => (
                      <tr key={quotation.id} className="hover:bg-slate-50/70 dark:hover:bg-white/3 transition-colors">
                        <td className="px-3 py-2.5 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-foreground truncate">
                            {quotation.quotationNo}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{quotation.projectName}</p>
                        </td>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{quotation.clientName}</td>
                        <td className="px-3 py-2.5">
                          <p className="text-slate-700 dark:text-slate-300">{quotation.picName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{quotation.email}</p>
                        </td>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{quotation.validUntil}</td>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          IDR {quotation.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              quotation.status === "accepted"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : quotation.status === "sent"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : quotation.status === "negotiation"
                                    ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                    : "bg-slate-500/10 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {quotation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-3 flex flex-col gap-4">
          {spotlightQuotation && (
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Priority Opportunity
              </span>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm bg-amber-500/15 text-amber-500">
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-foreground">
                  {spotlightQuotation.quotationNo}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  High-value proposal currently in active pipeline.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <SpotlightStat label="Amount" value={`IDR ${(spotlightQuotation.amount / 1000000).toFixed(1)}M`} />
                <SpotlightStat label="Chance" value={`${spotlightQuotation.probability}%`} />
                <SpotlightStat label="Status" value={spotlightQuotation.status} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{spotlightQuotation.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{spotlightQuotation.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{spotlightQuotation.city}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Status Distribution
              </span>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              {statusMix.map((term) => (
                <DistributionRow
                  key={term.label}
                  label={term.label}
                  value={term.value}
                  color={term.color}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CompactMetric({
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

function FunnelStep({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-900 dark:text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value * 4, 100)}%` }} />
      </div>
    </div>
  );
}

function KpiStripCard({
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

function DistributionRow({
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

function SpotlightStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-sm border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 px-2 py-1.5">
      <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xs font-semibold text-slate-900 dark:text-foreground mt-0.5">
        {value}
      </p>
    </div>
  );
}

function TemplateSlotCard({
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
