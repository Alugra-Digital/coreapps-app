// coreapps-app/src/finance/components/ScanStrukButton.tsx
import { useRef, useState } from 'react';
import { Scan, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getToken } from '@/lib/api/tokenStore';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ScanStrukResult {
  date: string;
  merchant: string;
  amount: number;
  description: string;
  suggestedAccount: { number: string; name: string };
  confidence: 'high' | 'medium' | 'low';
  rawText: string;
}

interface ScanStrukButtonProps {
  onApply: (result: ScanStrukResult) => void;
  className?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);

const confidenceLabel: Record<string, string> = {
  high: 'Tinggi',
  medium: 'Sedang',
  low: 'Rendah',
};

const confidenceColor: Record<string, string> = {
  high: 'text-green-400',
  medium: 'text-yellow-400',
  low: 'text-red-400',
};

// ── Component ──────────────────────────────────────────────────────────────────

export function ScanStrukButton({ onApply, className }: ScanStrukButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanStrukResult | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = getToken();

      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
      const response = await fetch(`${baseUrl}/api/finance/scan-struk`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { message?: string };
        throw new Error(err.message ?? `HTTP ${response.status}`);
      }

      const data = await response.json() as ScanStrukResult;
      setResult(data);
      setOpen(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memindai struk', {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setOpen(false);
      setResult(null);
      toast.success('Data struk berhasil diterapkan ke formulir');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setResult(null);
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className={`border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent gap-2 ${className ?? ''}`}
        onClick={() => fileRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Scan className="w-4 h-4" />
        )}
        {loading ? 'Memindai...' : 'Scan Struk'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F0F0F0]">
              <Scan className="w-5 h-5 text-[#F5A623]" />
              Hasil Scan Struk
            </DialogTitle>
          </DialogHeader>

          {result && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-sm">
                {result.confidence === 'high' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
                <span className="text-[#9B9BA4]">Kepercayaan:</span>
                <span className={confidenceColor[result.confidence] ?? 'text-[#F0F0F0]'}>
                  {confidenceLabel[result.confidence] ?? result.confidence}
                </span>
              </div>

              <div className="rounded-lg border border-[#1E1E22] bg-[#0A0A0B] divide-y divide-[#1E1E22]">
                <Row label="Merchant" value={result.merchant} />
                <Row label="Tanggal" value={result.date} />
                <Row label="Total" value={fmt(result.amount)} highlight />
                <Row label="Keterangan" value={result.description} />
                <Row
                  label="Akun Saran"
                  value={`${result.suggestedAccount.number} — ${result.suggestedAccount.name}`}
                  accent
                />
              </div>

              <p className="text-xs text-[#9B9BA4]">
                Klik <strong className="text-[#F0F0F0]">Gunakan Saran</strong> untuk mengisi formulir
                secara otomatis, atau <strong className="text-[#F0F0F0]">Pilih Manual</strong> untuk
                mengisi sendiri.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent"
              onClick={handleClose}
            >
              Pilih Manual
            </Button>
            <Button
              type="button"
              className="bg-[#F5A623] hover:bg-[#E09415] text-black"
              onClick={handleApply}
            >
              Gunakan Saran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({
  label,
  value,
  highlight,
  accent,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between px-3 py-2 gap-4">
      <span className="text-[#9B9BA4] text-sm shrink-0">{label}</span>
      <span
        className={`text-sm text-right break-all ${
          highlight ? 'text-[#F5A623] font-semibold' : accent ? 'text-blue-400' : 'text-[#F0F0F0]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
