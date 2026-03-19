import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useReconcileKasKecil } from '@/hooks/useKasKecil';

interface PhysicalCashReconciliationProps {
  kasKecilTransactionId: number;
  systemBalance: number;
  periodId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PAPER_DENOMINATIONS = [
  { name: 'paper100000Qty', label: 'Rp 100.000', value: 100000 },
  { name: 'paper50000Qty', label: 'Rp 50.000', value: 50000 },
  { name: 'paper20000Qty', label: 'Rp 20.000', value: 20000 },
  { name: 'paper10000Qty', label: 'Rp 10.000', value: 10000 },
  { name: 'paper5000Qty', label: 'Rp 5.000', value: 5000 },
  { name: 'paper2000Qty', label: 'Rp 2.000', value: 2000 },
  { name: 'paper1000Qty', label: 'Rp 1.000', value: 1000 },
] as const;

const COIN_DENOMINATIONS = [
  { name: 'coin1000Qty', label: 'Rp 1.000', value: 1000 },
  { name: 'coin500Qty', label: 'Rp 500', value: 500 },
  { name: 'coin200Qty', label: 'Rp 200', value: 200 },
  { name: 'coin100Qty', label: 'Rp 100', value: 100 },
] as const;

export function PhysicalCashReconciliation({
  kasKecilTransactionId,
  systemBalance,
  periodId,
  onSuccess,
  onCancel,
}: PhysicalCashReconciliationProps) {
  const reconcileMutation = useReconcileKasKecil();

  const [paper, setPaper] = useState<Record<string, number>>(() => {
    return Object.fromEntries(PAPER_DENOMINATIONS.map(d => [d.name, 0]));
  });

  const [coins, setCoins] = useState<Record<string, number>>(() => {
    return Object.fromEntries(COIN_DENOMINATIONS.map(d => [d.name, 0]));
  });

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const totalPaper = PAPER_DENOMINATIONS.reduce((sum, denom) => sum + ((paper[denom.name] || 0) * denom.value), 0);
  const totalCoins = COIN_DENOMINATIONS.reduce((sum, denom) => sum + ((coins[denom.name] || 0) * denom.value), 0);
  const totalPhysical = totalPaper + totalCoins;
  const difference = totalPhysical - systemBalance;

  // Format currency
  const formatRp = (value: number) => `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

  const handleInputChange = (category: 'paper' | 'coins', name: string, value: number) => {
    const setter = category === 'paper' ? setPaper : setCoins;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await reconcileMutation.mutateAsync({
        transactionId: kasKecilTransactionId,
        data: {
          periodId,
          kasKecilTransactionId,
          paper100000Qty: paper.paper100000Qty || 0,
          paper50000Qty: paper.paper50000Qty || 0,
          paper20000Qty: paper.paper20000Qty || 0,
          paper10000Qty: paper.paper10000Qty || 0,
          paper5000Qty: paper.paper5000Qty || 0,
          paper2000Qty: paper.paper2000Qty || 0,
          paper1000Qty: paper.paper1000Qty || 0,
          coin1000Qty: coins.coin1000Qty || 0,
          coin500Qty: coins.coin500Qty || 0,
          coin200Qty: coins.coin200Qty || 0,
          coin100Qty: coins.coin100Qty || 0,
          totalPhysical,
          systemBalance,
          difference,
          notes: notes || undefined,
        },
      });
      toast.success('Rekonsiliasi kas fisik berhasil disimpan');
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      toast.error('Gagal menyimpan rekonsiliasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReconciled = Math.abs(difference) < 1;
  const differenceColor = difference === 0 ? 'text-slate-600' : difference > 0 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rekonsiliasi Kas Kecil Fisik</CardTitle>
          <CardDescription>
            Hitung dan catat jumlah uang kas fisik yang tersedia untuk membandingkan dengan saldo sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Balance Info */}
          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">Saldo Sistem</Label>
                <div className="text-2xl font-bold">{formatRp(systemBalance)}</div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Status</Label>
                <div className={`text-sm ${isReconciled ? 'text-green-600' : 'text-amber-600'}`}>
                  {isReconciled ? '✅ Terkonsiliasi' : '⚠️ Belum Terkonsiliasi'}
                </div>
              </div>
            </div>
          </div>

          {/* Uang Kertas Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Uang Kertas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {PAPER_DENOMINATIONS.map(denom => (
                <div key={denom.name}>
                  <Label className="text-sm font-semibold mb-2">{denom.label}</Label>
                  <Input
                    type="number"
                    min={0}
                    className="bg-white dark:bg-slate-900"
                    value={paper[denom.name]}
                    onChange={(e) => handleInputChange('paper', denom.name, parseInt(e.target.value) || 0)}
                  />
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    {formatRp((paper[denom.name] || 0) * denom.value)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-semibold">Total Uang Kertas:</span>
              <span className="text-lg font-bold">{formatRp(totalPaper)}</span>
            </div>
          </div>

          <Separator />

          {/* Uang Logam Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Uang Logam</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {COIN_DENOMINATIONS.map(denom => (
                <div key={denom.name}>
                  <Label className="text-sm font-semibold mb-2">{denom.label}</Label>
                  <Input
                    type="number"
                    min={0}
                    className="bg-white dark:bg-slate-900"
                    value={coins[denom.name]}
                    onChange={(e) => handleInputChange('coins', denom.name, parseInt(e.target.value) || 0)}
                  />
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    {formatRp((coins[denom.name] || 0) * denom.value)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-semibold">Total Uang Logam:</span>
              <span className="text-lg font-bold">{formatRp(totalCoins)}</span>
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div>
            <Label className="text-sm font-semibold mb-2">Catatan (Opsional)</Label>
            <textarea
              className="w-full min-h-[100px] p-3 border rounded-md bg-white dark:bg-slate-900"
              placeholder="Tambahkan catatan untuk rekonsiliasi ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Summary Section */}
          <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Fisik</div>
                <div className="text-2xl font-bold">{formatRp(totalPhysical)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Selisih</div>
                <div className={`text-2xl font-bold ${differenceColor}`}>
                  {formatRp(Math.abs(difference))}
                  {difference !== 0 && (
                    <span className="text-xs ml-2">
                      ({difference > 0 ? 'Kurang' : 'Lebih'})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {difference === 0 ? (
                  <span className="text-green-600 font-semibold">✅ Pas</span>
                ) : (
                  <span className="text-amber-600 font-semibold">⚠️ Ada Selisih: {formatRp(Math.abs(difference))}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Batal
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Rekonsiliasi'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PhysicalCashReconciliation;
