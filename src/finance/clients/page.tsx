import {
  Building2,
  Plus,
  FileDown,
  Handshake,
  Crown,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { ClientTable } from "./components/ClientTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClients } from "@/hooks/useClients";
import { mockClients } from "./data";

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const displayClients = clients.length > 0 ? clients : mockClients;
  const activeCount = displayClients.filter((c) => c.isActive).length;
  const withPicCount = displayClients.filter((c) => c.pic?.name).length;
  const withCompleteContact = displayClients.filter((c) => c.email && c.phone).length;
  const activeRate = displayClients.length
    ? Math.round((activeCount / displayClients.length) * 100)
    : 0;
  const picCoverage = displayClients.length
    ? Math.round((withPicCount / displayClients.length) * 100)
    : 0;
  const contactCoverage = displayClients.length
    ? Math.round((withCompleteContact / displayClients.length) * 100)
    : 0;
  const spotlightClient = displayClients[0];
  const recentClients = mockClients.slice(0, 4);
  const followUpQueue = displayClients.slice(0, 5);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Clients
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage client companies for proposals, projects, and invoices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Clients
          </Button>
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <ClientStatCard
          title="Total Clients"
          value={String(displayClients.length)}
          description="All registered clients"
          icon={<Building2 className="h-4 w-4" />}
          color="#3b82f6"
          variant="trend-bars"
          trendData={[38, 46, 52, 61, 58, 67, 72]}
        />
        <ClientStatCard
          title="Active"
          value={String(activeCount)}
          description="Currently active clients"
          icon={<Building2 className="h-4 w-4" />}
          color="#10b981"
          variant="progress"
          progressValue={activeRate}
          progressLabel="Activation rate"
        />
        <ClientStatCard
          title="PIC Coverage"
          value={String(withPicCount)}
          description="Clients with assigned PIC"
          icon={<Handshake className="h-4 w-4" />}
          color="#8b5cf6"
          variant="segmented"
          progressValue={picCoverage}
          progressLabel="Coverage"
        />
        <ClientStatCard
          title="Contact Completeness"
          value={`${contactCoverage}%`}
          description="Email and phone filled"
          icon={<Crown className="h-4 w-4" />}
          color="#f59e0b"
          variant="target"
          progressValue={contactCoverage}
          progressLabel="Target 85%"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 flex flex-col gap-4">
          <ClientTable
            clients={displayClients}
            isLoading={isLoading}
            onAddClick={() => setIsAddOpen(true)}
            isAddOpen={isAddOpen}
            onAddOpenChange={setIsAddOpen}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Client Portfolio Mix
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Reference
                </span>
              </div>
              <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <MixBar label="Financial Services" value={42} color="bg-blue-500" />
                  <MixBar label="Energy & Utilities" value={26} color="bg-emerald-500" />
                  <MixBar label="Manufacturing" value={19} color="bg-violet-500" />
                  <MixBar label="Others" value={13} color="bg-amber-500" />
                </div>
                <div className="rounded-sm border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 px-3 py-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Most dominant</span>
                    <span className="font-semibold text-slate-900 dark:text-foreground">
                      Financial Services
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Follow-up Queue
                </span>
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  5 Items
                </span>
              </div>
              <CardContent className="h-full p-0 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] divide-y divide-slate-100 dark:divide-white/5">
                {followUpQueue.map((client, index) => (
                  <div key={client.id} className="p-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-foreground truncate">
                        {client.companyName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        PIC: {client.pic?.name ?? "Needs assignment"}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 shrink-0">
                      {index % 2 === 0 ? "Call" : "Email"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-4">
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Client Spotlight
              </span>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm bg-amber-500/15 text-amber-500">
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-foreground">
                  {spotlightClient?.companyName ?? "No client selected"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Strategic client with ongoing monthly billing
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Priority
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Active Contract
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Monthly Billing
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <SpotlightStat label="Projects" value="12" />
                <SpotlightStat label="Invoices" value="28" />
                <SpotlightStat label="Health" value="A+" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{spotlightClient?.email ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{spotlightClient?.phone ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span className="line-clamp-1">{spotlightClient?.address ?? "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                New Client Pipeline
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Dummy Data
              </span>
            </div>
            <CardContent className="p-0 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] divide-y divide-slate-100 dark:divide-white/5">
              {recentClients.map((client) => (
                <div key={client.id} className="p-3">
                  <p className="text-xs font-semibold text-slate-900 dark:text-foreground">
                    {client.companyName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    PIC: {client.pic?.name ?? "Pending assignment"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Relationship Health
              </span>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              <HealthRow label="Excellent" value={48} color="bg-emerald-500" />
              <HealthRow label="Stable" value={34} color="bg-blue-500" />
              <HealthRow label="Needs Follow Up" value={18} color="bg-amber-500" />
            </CardContent>
          </Card>
        </div>
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
      <p className="text-xs font-semibold text-slate-900 dark:text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function HealthRow({
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
        <span className="font-semibold text-slate-900 dark:text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MixBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-900 dark:text-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ClientStatCard({
  title,
  value,
  description,
  icon,
  color,
  variant,
  progressValue = 0,
  progressLabel,
  trendData = [],
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  variant?: "trend-bars" | "progress" | "segmented" | "target";
  progressValue?: number;
  progressLabel?: string;
  trendData?: number[];
}) {
  const safeProgress = Math.max(0, Math.min(progressValue, 100));
  const targetValue = 85;
  const remainingToTarget = Math.max(targetValue - safeProgress, 0);

  return (
    <Card className="h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
      </div>
      <CardContent className="h-full p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="h-full flex flex-col gap-3 justify-between">
          <div className="text-2xl font-bold text-slate-900 dark:text-foreground leading-none">
            {value}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            {description}
          </div>

          {variant === "trend-bars" && (
            <div className="mt-1">
              <div className="flex items-end gap-1 h-10">
                {trendData.map((point, idx) => (
                  <div
                    key={`${title}-${idx}`}
                    className="flex-1 rounded-sm opacity-90"
                    style={{
                      height: `${Math.max(20, Math.min(point, 100))}%`,
                      backgroundColor: `${color}${idx === trendData.length - 1 ? "" : "80"}`,
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Last 7 periods
              </p>
            </div>
          )}

          {variant === "progress" && (
            <div className="mt-1 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">{progressLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {safeProgress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${safeProgress}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )}

          {variant === "segmented" && (
            <div className="mt-1 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">{progressLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {safeProgress}%
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const isFilled = idx < Math.round(safeProgress / 10);
                  return (
                    <div
                      key={`${title}-seg-${idx}`}
                      className="h-2 rounded-[2px]"
                      style={{
                        backgroundColor: isFilled ? color : "rgba(148, 163, 184, 0.25)",
                        opacity: isFilled ? 1 : 0.8,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {variant === "target" && (
            <div className="mt-1 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">{progressLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {safeProgress}/{targetValue}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min((safeProgress / targetValue) * 100, 100)}%`, backgroundColor: color }}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {remainingToTarget === 0
                  ? "Target achieved"
                  : `${remainingToTarget}% to reach target`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
