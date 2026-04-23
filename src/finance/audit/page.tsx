import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck, AlertTriangle, XCircle, Info,
  RefreshCw, FileDown, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import { exportToPDF } from '@/lib/export';
import type { PDFColumn } from '@/lib/export';
import { useAccountingPeriods } from '@/hooks/useAccountingPeriods';

interface AuditFinding {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  category: string;
  message: string;
  reference?: string;
}

interface AuditResult {
  periodId: number;
  periodLabel: string;
  score: number;
  totalChecks: number;
  findings: AuditFinding[];
  summary: { errors: number; warnings: number; info: number };
}

const SEV = {
  ERROR:   { icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20',    badge: 'bg-red-400/20 text-red-300',      label: 'Error' },
  WARNING: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', badge: 'bg-yellow-400/20 text-yellow-300', label: 'Peringatan' },
  INFO:    { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20',   badge: 'bg-blue-400/20 text-blue-300',    label: 'Info' },
} as const;

function scoreColor(s: number) {
  if (s >= 90) return 'text-green-400';
  if (s >= 70) return 'text-yellow-400';
  return 'text-red-400';
}

export default function AuditPage() {
  const now = new Date();
  const [year, setYear]             = useState(now.getFullYear());
  const [month, setMonth]           = useState(now.getMonth() + 1);
  const [runTrigger, setRunTrigger] = useState(0);

  // Resolve period ID using the same pattern as neraca-saldo/page.tsx and buku-besar/page.tsx
  const { data: periods = [] } = useAccountingPeriods();
  const activePeriod = periods.find((p) => p.year === year && p.month === month);

  const { data, isLoading, isFetching, error } = useQuery<AuditResult>({
    queryKey: ['audit', year, month, runTrigger],
    queryFn: async () => {
      if (!activePeriod) {
        throw new Error(`Periode ${month}/${year} tidak ditemukan`);
      }
      // Dynamic import to avoid circular dependency at module level
      const { api } = await import('@/lib/api/client');
      return api.get<AuditResult>(`/finance/audit?periodId=${activePeriod.id}`);
    },
    enabled: runTrigger > 0 && !!activePeriod,
    retry: false,
  });

  const loading = isLoading || isFetching;

  const handleExport = () => {
    if (!data) return;
    try {
      const columns: PDFColumn[] = [
        { header: 'Severity',  key: 'severity',  width: 25 },
        { header: 'Kategori',  key: 'category',  width: 30 },
        { header: 'Pesan',     key: 'message',   width: 100 },
        { header: 'Referensi', key: 'reference', width: 35 },
      ];

      exportToPDF(
        data.findings.map(f => ({
          severity:  f.severity,
          category:  f.category,
          message:   f.message,
          reference: f.reference ?? '-',
        })),
        columns,
        {
          title:     `Audit Laporan — Periode ${month}/${year}`,
          filename:  `audit-${year}-${String(month).padStart(2, '0')}`,
          landscape: true,
        }
      );
    } catch {
      toast.error('Gagal mengexport PDF');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F0F0F0] flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-[#F5A623]" />
              Audit Laporan
            </h1>
            <p className="text-[#9B9BA4] text-sm mt-1">
              Pemeriksaan otomatis integritas data keuangan
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <PeriodSelector
              year={year}
              month={month}
              onChange={(y, m) => { setYear(y); setMonth(m); }}
            />
            <Button
              onClick={() => setRunTrigger(t => t + 1)}
              disabled={loading}
              className="bg-[#F5A623] hover:bg-[#E09415] text-black gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Memeriksa...' : 'Jalankan Audit'}
            </Button>
            {data && (
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export PDF
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-red-300 text-sm">
            {(error as Error).message}
          </div>
        )}

        {/* Initial empty state */}
        {!data && !loading && !error && runTrigger === 0 && (
          <div className="rounded-xl border border-[#1E1E22] bg-[#111113] p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-[#3A3A40] mx-auto mb-4" />
            <p className="text-[#9B9BA4]">
              Pilih periode dan klik{' '}
              <strong className="text-[#F0F0F0]">Jalankan Audit</strong> untuk memulai.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-[#1E1E22] bg-[#111113] p-8 text-center">
            <RefreshCw className="w-8 h-8 text-[#F5A623] animate-spin mx-auto mb-3" />
            <p className="text-[#9B9BA4]">Menjalankan 12 pemeriksaan...</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="space-y-4">
            {/* Score cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-[#1E1E22] bg-[#111113] p-4 col-span-2 sm:col-span-1">
                <p className="text-[#9B9BA4] text-xs mb-1">Skor Audit</p>
                <p className={`text-4xl font-bold ${scoreColor(data.score)}`}>{data.score}%</p>
                <p className="text-[#9B9BA4] text-xs mt-1">{data.totalChecks} pemeriksaan</p>
              </div>
              <SCard label="Error"      count={data.summary.errors}   color="text-red-400"    Icon={XCircle} />
              <SCard label="Peringatan" count={data.summary.warnings} color="text-yellow-400" Icon={AlertTriangle} />
              <SCard label="Info"       count={data.summary.info}     color="text-blue-400"   Icon={Info} />
            </div>

            {/* All clear */}
            {data.findings.length === 0 && (
              <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-green-300 font-medium">Semua pemeriksaan lulus!</p>
              </div>
            )}

            {/* Findings */}
            {data.findings.length > 0 && (
              <div className="rounded-xl border border-[#1E1E22] bg-[#111113] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#1E1E22]">
                  <h2 className="font-semibold text-[#F0F0F0]">Temuan ({data.findings.length})</h2>
                </div>
                <div className="divide-y divide-[#1E1E22]">
                  {data.findings.map((f, i) => <FindingRow key={i} f={f} />)}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function SCard({ label, count, color, Icon }: {
  label: string;
  count: number;
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-[#1E1E22] bg-[#111113] p-4">
      <p className="text-[#9B9BA4] text-xs mb-1 flex items-center gap-1">
        <Icon className={`w-3 h-3 ${color}`} />{label}
      </p>
      <p className={`text-3xl font-bold ${color}`}>{count}</p>
    </div>
  );
}

function FindingRow({ f }: { f: AuditFinding }) {
  const cfg = SEV[f.severity];
  const Icon = cfg.icon;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 ${cfg.bg}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <Badge className={`text-xs px-1.5 py-0 ${cfg.badge} border-0`}>{f.severity}</Badge>
          <span className="text-[#9B9BA4] text-xs">{f.category}</span>
          {f.reference && <span className="text-[#F5A623] text-xs font-mono">{f.reference}</span>}
        </div>
        <p className="text-[#F0F0F0] text-sm leading-snug">{f.message}</p>
      </div>
    </div>
  );
}
