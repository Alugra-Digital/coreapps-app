import {
  Truck,
  Plus,
  FileDown,
  Landmark,
  Handshake,
  Crown,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  TimerReset,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { VendorTable } from "./components/VendorTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getVendors } from "@/api/vendors";
import type { Vendor } from "./types";
import { mockVendors } from "./data";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadVendors = async () => {
    const data = await getVendors();
    setVendors(data);
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const displayVendors = vendors.length > 0 ? vendors : mockVendors;
  const activeCount = displayVendors.filter((v) => v.isActive).length;
  const withPicCount = displayVendors.filter((v) => v.pic?.name).length;
  const withBankInfoCount = displayVendors.filter(
    (v) => v.bankName && v.bankAccount
  ).length;
  const activeRate = displayVendors.length
    ? Math.round((activeCount / displayVendors.length) * 100)
    : 0;
  const bankCoverage = displayVendors.length
    ? Math.round((withBankInfoCount / displayVendors.length) * 100)
    : 0;
  const picCoverage = displayVendors.length
    ? Math.round((withPicCount / displayVendors.length) * 100)
    : 0;
  const spotlightVendor = displayVendors[0];
  const onboardingQueue = displayVendors.slice(0, 4);
  const approvalQueue = displayVendors.slice(0, 5);
  const paymentTerms = [
    { label: "Net 30", value: 48, color: "bg-blue-500" },
    { label: "Net 14", value: 27, color: "bg-emerald-500" },
    { label: "Net 45", value: 16, color: "bg-violet-500" },
    { label: "Others", value: 9, color: "bg-amber-500" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Vendors
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage vendor/supplier companies for purchase orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Vendors
          </Button>
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Vendor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="xl:col-span-8 shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Vendor Control Center
                </p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-foreground mt-1">
                  Procurement and supplier health overview
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Unified monitoring for onboarding, compliance readiness, and payment profile.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Stable
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Refreshed Daily
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <CompactMetric
                label="Total Vendors"
                value={String(displayVendors.length)}
                helper="Master records"
                color="#3b82f6"
                icon={<Truck className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="Active Rate"
                value={`${activeRate}%`}
                helper="Operational vendors"
                color="#10b981"
                icon={<BadgeCheck className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="Bank Ready"
                value={`${bankCoverage}%`}
                helper="Payment profile complete"
                color="#f59e0b"
                icon={<Landmark className="h-3.5 w-3.5" />}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Onboarding Funnel
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
              Dummy
            </span>
          </div>
          <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
            <FunnelStep label="Submitted" value={24} color="bg-blue-500" />
            <FunnelStep label="Verification" value={14} color="bg-amber-500" />
            <FunnelStep label="Negotiation" value={8} color="bg-violet-500" />
            <FunnelStep label="Activated" value={5} color="bg-emerald-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-9 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiStripCard
              title="PIC Assignment"
              value={`${picCoverage}%`}
              description="Vendor owner mapped"
              progress={picCoverage}
              color="#8b5cf6"
              icon={<Handshake className="h-4 w-4" />}
            />
            <KpiStripCard
              title="Bank Validation"
              value={`${bankCoverage}%`}
              description="Ready for payment"
              progress={bankCoverage}
              color="#f59e0b"
              icon={<Wallet className="h-4 w-4" />}
            />
            <KpiStripCard
              title="Cycle Time"
              value="3.2 d"
              description="Average approval time"
              progress={72}
              color="#10b981"
              icon={<TimerReset className="h-4 w-4" />}
            />
          </div>

          <VendorTable
            vendors={displayVendors}
            onRefresh={loadVendors}
            onAddClick={() => setIsAddOpen(true)}
            isAddOpen={isAddOpen}
            onAddOpenChange={setIsAddOpen}
          />

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Approval Watchlist
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                5 Pending
              </span>
            </div>
            <CardContent className="p-0 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] divide-y divide-slate-100 dark:divide-white/5">
              {approvalQueue.map((vendor, index) => (
                <div key={vendor.id} className="px-3 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-foreground truncate">
                      {vendor.companyName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Next step: {index % 2 === 0 ? "Bank verification" : "Final approval"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-2.5 bg-white dark:bg-white/5"
                  >
                    Review <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-3 flex flex-col gap-4">
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Vendor Spotlight
              </span>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm bg-amber-500/15 text-amber-500">
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-foreground">
                  {spotlightVendor?.companyName ?? "No vendor selected"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Preferred supplier with stable delivery performance
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Preferred
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Contract Active
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Reliable
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <SpotlightStat label="POs" value="16" />
                <SpotlightStat label="On-time" value="96%" />
                <SpotlightStat label="Tier" value="A" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{spotlightVendor?.email ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{spotlightVendor?.phone ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span className="line-clamp-1">{spotlightVendor?.address ?? "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Payment Terms Mix
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Dummy Data
              </span>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              {paymentTerms.map((term) => (
                <DistributionRow
                  key={term.label}
                  label={term.label}
                  value={term.value}
                  color={term.color}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Compliance Health
              </span>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              <HealthRow label="Complete Profile" value={67} color="bg-emerald-500" />
              <HealthRow label="Bank Verified" value={58} color="bg-blue-500" />
              <HealthRow label="Tax Document Ready" value={41} color="bg-amber-500" />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                This Week Intake
              </span>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-2">
              {onboardingQueue.map((vendor, idx) => (
                <div key={vendor.id} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-[70%]">
                    {vendor.companyName}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-foreground">
                    D+{idx + 1}
                  </span>
                </div>
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
    <div className="rounded-sm border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-3">
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
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
      <CardContent className="p-3 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5">
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
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden mt-2.5">
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
