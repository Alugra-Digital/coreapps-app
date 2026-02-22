import {
  FileText,
  Plus,
  FileCheck,
  FileQuestion,
  FileDown,
  Landmark,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { useState } from "react";
import { BASTTable } from "./components/BASTTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BAST } from "./types";

const DUMMY_BASTS: BAST[] = [
  {
    id: "bast-001",
    coverInfo: {
      jobOffer: "Jasa Integrasi Sistem ERP Gudang",
      companyName: "PT Cakra Niaga Digital",
      bastMonth: "2026-02",
      address: "Jl. Gatot Subroto No. 17, Jakarta Selatan",
      phone: "+62 21 5550 2001",
    },
    documentInfo: {
      bastNumber: "BAST/FIN/II/2026/001",
      bastDate: "2026-02-05",
      relatedPoOrInvoice: "PO-2026-0142",
    },
    deliveringParty: {
      name: "Dimas Pratama",
      position: "Project Manager",
      company: "PT Delta Karya Solusi",
    },
    receivingParty: {
      name: "Arini Mahendra",
      position: "Head of Finance",
      company: "PT Cakra Niaga Digital",
    },
  },
  {
    id: "bast-002",
    coverInfo: {
      jobOffer: "Pengadaan Perangkat Kasir Cabang Barat",
      companyName: "PT Bintang Ritel Nusantara",
      bastMonth: "2026-02",
      address: "Jl. Diponegoro No. 95, Bandung",
      phone: "+62 22 8891 1003",
    },
    documentInfo: {
      bastNumber: "BAST/FIN/II/2026/002",
      bastDate: "2026-02-11",
      relatedPoOrInvoice: "INV-2026-0901",
    },
    deliveringParty: {
      name: "Raka Adinata",
      position: "Delivery Lead",
      company: "PT Delta Karya Solusi",
    },
    receivingParty: {
      name: "Sinta Larasati",
      position: "Procurement Supervisor",
      company: "PT Bintang Ritel Nusantara",
    },
  },
  {
    id: "bast-003",
    coverInfo: {
      jobOffer: "Implementasi Workflow Approval Pembelian",
      companyName: "PT Samudra Ekspres Logistik",
      bastMonth: "2026-01",
      address: "Jl. Ahmad Yani No. 21, Surabaya",
      phone: "+62 31 7012 4430",
    },
    documentInfo: {
      bastNumber: "BAST/FIN/I/2026/019",
      bastDate: "2026-01-26",
      relatedPoOrInvoice: "PO-2026-0037",
    },
    deliveringParty: {
      name: "Aditiya Wibowo",
      position: "ERP Consultant",
      company: "PT Delta Karya Solusi",
    },
    receivingParty: {
      name: "Nanda Kusuma",
      position: "Finance Controller",
      company: "PT Samudra Ekspres Logistik",
    },
  },
  {
    id: "bast-004",
    coverInfo: {
      jobOffer: "Maintenance Modul Akuntansi Kuartal 1",
      companyName: "PT Astra Prima Textile",
      bastMonth: "2026-01",
      address: "Jl. Raya Cibitung KM 11, Bekasi",
      phone: "+62 21 8392 4418",
    },
    documentInfo: {
      bastNumber: "BAST/FIN/I/2026/021",
      bastDate: "2026-01-31",
      relatedPoOrInvoice: "",
    },
    deliveringParty: {
      name: "Farel Nugroho",
      position: "Technical Support Lead",
      company: "PT Delta Karya Solusi",
    },
    receivingParty: {
      name: "Maya Puspita",
      position: "Accounting Manager",
      company: "PT Astra Prima Textile",
    },
  },
  {
    id: "bast-005",
    coverInfo: {
      jobOffer: "UAT dan Go-Live Modul Perpajakan",
      companyName: "PT Pilar Mandiri Energi",
      bastMonth: "2025-12",
      address: "Jl. KH Wahid Hasyim No. 34, Semarang",
      phone: "+62 24 6670 8212",
    },
    documentInfo: {
      bastNumber: "BAST/FIN/XII/2025/144",
      bastDate: "2025-12-22",
      relatedPoOrInvoice: "INV-2025-2219",
    },
    deliveringParty: {
      name: "Yasmin Maharani",
      position: "Implementation Specialist",
      company: "PT Delta Karya Solusi",
    },
    receivingParty: {
      name: "Gilang Prakoso",
      position: "Finance Operation Lead",
      company: "PT Pilar Mandiri Energi",
    },
  },
  {
    id: "bast-006",
    coverInfo: {
      jobOffer: "Upgrade Server Dokumen Finance",
      companyName: "PT Tirta Data Persada",
      bastMonth: "2025-12",
      address: "Jl. Melawai Raya No. 8, Jakarta Selatan",
      phone: "+62 21 7200 6659",
    },
    documentInfo: {
      bastNumber: "BAST/FIN/XII/2025/151",
      bastDate: "2025-12-28",
      relatedPoOrInvoice: "PO-2025-1983",
    },
    deliveringParty: {
      name: "Dion Ramadhan",
      position: "Infrastructure Engineer",
      company: "PT Delta Karya Solusi",
    },
    receivingParty: {
      name: "Rani Herawati",
      position: "Head of IT Governance",
      company: "PT Tirta Data Persada",
    },
  },
];

export default function BASTPage() {
  const [basts] = useState<BAST[]>(DUMMY_BASTS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadBasts = () => {};

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthCount = basts.filter((b) => {
    const [bastYear, bastMonth] = b.coverInfo.bastMonth.split("-").map(Number);
    return bastMonth === currentMonth + 1 && bastYear === currentYear;
  }).length;

  const companyCount = new Set(basts.map((b) => b.coverInfo.companyName)).size;
  const withRelatedDocCount = basts.filter((b) => !!b.documentInfo.relatedPoOrInvoice).length;
  const withoutRelatedDocCount = basts.length - withRelatedDocCount;
  const completionRate = basts.length
    ? Math.round((withRelatedDocCount / basts.length) * 100)
    : 0;

  const statusDistribution = [
    {
      label: "With PO/Invoice",
      value: basts.length ? Math.round((withRelatedDocCount / basts.length) * 100) : 0,
      color: "bg-emerald-500",
    },
    {
      label: "Missing Reference",
      value: basts.length ? Math.round((withoutRelatedDocCount / basts.length) * 100) : 0,
      color: "bg-amber-500",
    },
  ];

  const layoutReferences = [
    {
      code: "Overview",
      title: "BAST Snapshot",
      description: "Ringkasan handover document aktif, volume bulanan, dan kualitas referensi dokumen.",
      icon: <Landmark className="h-3.5 w-3.5" />,
      color: "#3b82f6",
    },
    {
      code: "Control",
      title: "Verification Signals",
      description: "Indikator validasi data untuk memastikan BAST siap diproses audit internal.",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      color: "#10b981",
    },
    {
      code: "Register",
      title: "BAST Register",
      description: "Daftar utama BAST untuk pemantauan serah terima dan tindak lanjut dokumen finance.",
      icon: <FileText className="h-3.5 w-3.5" />,
      color: "#8b5cf6",
    },
    {
      code: "Insights",
      title: "Reference Board",
      description: "Distribusi kelengkapan PO/Invoice sebagai penopang verifikasi dokumen BAST.",
      icon: <TimerReset className="h-3.5 w-3.5" />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            BAST
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Berita Acara Serah Terima dengan layout referensi yang konsisten untuk tim finance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export BAST
          </Button>
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add BAST
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
                  BAST Command Center
                </p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-foreground mt-1">
                  Ringkasan dokumen serah terima finance
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Memantau volume BAST, jumlah company aktif, serta kelengkapan referensi PO/Invoice.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Layout Reference
                </span>
                <span className="inline-flex items-center whitespace-nowrap text-[10px] leading-none font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Dummy Dataset
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <CompactMetric
                label="Total BAST"
                value={String(basts.length)}
                helper="All handover documents"
                color="#3b82f6"
                icon={<FileText className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="This Month"
                value={String(thisMonthCount)}
                helper="Created in current month"
                color="#10b981"
                icon={<FileCheck className="h-3.5 w-3.5" />}
              />
              <CompactMetric
                label="Companies"
                value={String(companyCount)}
                helper="Unique partner companies"
                color="#f59e0b"
                icon={<FileQuestion className="h-3.5 w-3.5" />}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 h-full shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Reference Distribution
            </span>
          </div>
          <CardContent className="h-full p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
            {statusDistribution.map((item) => (
              <DistributionRow key={item.label} label={item.label} value={item.value} color={item.color} />
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">Completed References</span>
                <span className="font-semibold text-slate-900 dark:text-foreground">{withRelatedDocCount}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">Missing References</span>
                <span className="font-semibold text-slate-900 dark:text-foreground">{withoutRelatedDocCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BASTStatCard
          title="Total BAST"
          value={String(basts.length)}
          description="All handover documents"
          icon={<FileText className="h-4 w-4" />}
          color="#3b82f6"
        />
        <BASTStatCard
          title="This Month"
          value={String(thisMonthCount)}
          description="Created this month"
          icon={<FileCheck className="h-4 w-4" />}
          color="#10b981"
        />
        <BASTStatCard
          title="Companies"
          value={String(companyCount)}
          description="Unique companies"
          icon={<FileQuestion className="h-4 w-4" />}
          color="#f59e0b"
        />
        <BASTStatCard
          title="Reference Coverage"
          value={`${completionRate}%`}
          description="BAST with related PO/Invoice reference"
          icon={<Landmark className="h-4 w-4" />}
          color="#6366f1"
        />
      </div>

      <BASTTable
        basts={basts}
        onRefresh={loadBasts}
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

function BASTStatCard({
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
