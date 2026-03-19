import { useState } from "react";
import {
  FileText,
  Plus,
  Receipt,
  Percent,
  FileDown,
  Landmark,
  ShieldCheck,
  Scale,
  TimerReset,
} from "lucide-react";
import { TaxTypeTable } from "./components/TaxTypeTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTaxTypes } from "@/hooks/useTaxTypes";

export default function PerpajakanPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: taxTypes = [], refetch } = useTaxTypes();

  const outputTaxCount = taxTypes.filter((t) => t.category === "output_tax").length;
  const withholdingTaxCount = taxTypes.filter((t) => t.category === "withholding_tax").length;
  const taxableRateAverage = taxTypes.length
    ? Math.round(taxTypes.reduce((sum, type) => sum + type.rate, 0) / taxTypes.length)
    : 0;
  const statusDistribution = [
    {
      label: "Output Tax",
      value: taxTypes.length ? Math.round((outputTaxCount / taxTypes.length) * 100) : 0,
      color: "bg-emerald-500",
    },
    {
      label: "Withholding Tax",
      value: taxTypes.length ? Math.round((withholdingTaxCount / taxTypes.length) * 100) : 0,
      color: "bg-amber-500",
    },
  ];
  const layoutReferences = [
    {
      code: "Overview",
      title: "Tax Snapshot",
      description: "Ringkasan konfigurasi pajak aktif, komposisi kategori, dan cakupan tarif.",
      icon: <Landmark className="h-3.5 w-3.5" />,
      color: "#3b82f6",
    },
    {
      code: "Control",
      title: "Compliance Signals",
      description: "Indikator pengawasan untuk memastikan struktur tax type tetap terkendali.",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      color: "#10b981",
    },
    {
      code: "Register",
      title: "Tax Type Register",
      description: "Tabel utama tax types untuk maintenance, update tarif, dan pengelompokan pajak.",
      icon: <FileText className="h-3.5 w-3.5" />,
      color: "#8b5cf6",
    },
    {
      code: "Insights",
      title: "Distribution Board",
      description: "Visualisasi distribusi output tax vs withholding tax untuk evaluasi struktur.",
      icon: <TimerReset className="h-3.5 w-3.5" />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            Perpajakan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor dan kelola tax type perusahaan dengan layout referensi yang konsisten.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Tax Types
          </Button>
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Tax Type
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {layoutReferences.map((layout) => (
          <TemplateCard
            key={layout.code}
            code={layout.code}
            title={layout.title}
            description={layout.description}
            icon={layout.icon}
            color={layout.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="xl:col-span-8 h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Tax Command Center
                </p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-foreground mt-1">
                  Ringkasan konfigurasi Perpajakan perusahaan
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Memantau jumlah tax types, kategori dominan, serta rata-rata tarif pajak aktif.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Updated Daily
                </span>
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Tax Reference
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <CompactMetric
                label="Total Tax Types"
                value={String(taxTypes.length)}
                helper="All tax configurations"
                color="#3b82f6"
                icon={<FileText className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="Output Tax"
                value={String(outputTaxCount)}
                helper="Charged to customer transactions"
                color="#10b981"
                icon={<Receipt className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="Avg. Tax Rate"
                value={`${taxableRateAverage}%`}
                helper="Average from configured tax rates"
                color="#f59e0b"
                icon={<Scale className="h-3.5 w-3.5" />}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Category Distribution
            </span>
          </div>
          <CardContent className="h-full p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
            {statusDistribution.map((item) => (
              <DistributionRow key={item.label} label={item.label} value={item.value} color={item.color} />
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">Withholding Types</span>
                <span className="font-semibold text-slate-900 dark:text-foreground">{withholdingTaxCount}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">Output Types</span>
                <span className="font-semibold text-slate-900 dark:text-foreground">{outputTaxCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaxTypeStatCard
          title="Output Tax"
          value={String(outputTaxCount)}
          description="Jenis pajak keluaran yang dikenakan ke klien"
          icon={<Receipt className="h-4 w-4" />}
          color="#10b981"
        />
        <TaxTypeStatCard
          title="Withholding Tax"
          value={String(withholdingTaxCount)}
          description="Jenis pajak potong yang ditahan pihak lawan transaksi"
          icon={<Percent className="h-4 w-4" />}
          color="#f59e0b"
        />
        <TaxTypeStatCard
          title="Compliance Coverage"
          value={`${taxTypes.length > 0 ? 100 : 0}%`}
          description="Kesiapan reference tax type untuk transaksi finance"
          icon={<Landmark className="h-4 w-4" />}
          color="#3b82f6"
        />
      </div>

      <TaxTypeTable
        taxTypes={taxTypes}
        onRefresh={() => refetch()}
        onAddClick={() => setIsAddOpen(true)}
        isAddOpen={isAddOpen}
        onAddOpenChange={setIsAddOpen}
      />
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
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-lg font-bold text-slate-900 dark:text-foreground mt-2">{value}</p>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{helper}</p>
    </div>
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

function TaxTypeStatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
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
      <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-slate-900 dark:text-foreground leading-none">
            {value}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
