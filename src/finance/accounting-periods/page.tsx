import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAccountingPeriods, useLastOpenPeriod, useValidateClosePeriod, useClosePeriod, useCreateNextPeriod, useReopenPeriod } from '@/hooks/useAccountingPeriods';
import { formatPeriodName, getPeriodStatusBadge } from '@/hooks/useFinancePeriod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AccountingPeriodsPage() {
  const navigate = useNavigate();
  const { data: periods = [], isLoading } = useAccountingPeriods();
  const { data: lastOpenPeriod } = useLastOpenPeriod();

  const validateCloseMutation = useValidateClosePeriod();
  const closePeriodMutation = useClosePeriod();
  const createNextPeriodMutation = useCreateNextPeriod();

  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    canClose: boolean;
    warnings: string[];
    errors: string[];
    periodId: number;
  } | null>(null);

  const reopenPeriodMutation = useReopenPeriod();
  const [reopenTarget, setReopenTarget] = useState<number | null>(null);
  const [reopenReason, setReopenReason] = useState("");
  const [isReopening, setIsReopening] = useState(false);

  const handleValidateClose = async (periodId: number) => {
    setValidating(true);
    try {
      const result = await validateCloseMutation.mutateAsync(periodId);
      setValidationResult({ ...result, periodId });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to validate period');
    } finally {
      setValidating(false);
    }
  };

  const handleClosePeriod = async (periodId: number) => {
    try {
      await closePeriodMutation.mutateAsync(periodId);
      toast.success('Period closed successfully');
      setValidationResult(null);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to close period');
    }
  };

  const handleCreateNextPeriod = async (currentPeriodId: number) => {
    try {
      const newPeriod = await createNextPeriodMutation.mutateAsync(currentPeriodId);
      toast.success('Next period created successfully');
      // Navigate to the new period
      navigate(`/finance/accounting-periods?id=${newPeriod.id}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to create next period');
    }
  };

  // Check if the current period is the last open period
  const isLastOpenPeriod = lastOpenPeriod && periods.some(
    p => p.status === 'OPEN' && p.id <= lastOpenPeriod.id
  );

  const handleReopenPeriod = async () => {
    if (!reopenTarget || !reopenReason.trim()) {
      toast.error('Alasan harus diisi');
      return;
    }
    setIsReopening(true);
    try {
      await reopenPeriodMutation.mutateAsync({ id: reopenTarget, reason: reopenReason });
      toast.success('Periode berhasil dibuka kembali');
      setReopenTarget(null);
      setReopenReason('');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Gagal membuka kembali periode');
    } finally {
      setIsReopening(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold">Periode Akuntansi</h1>
          <p className="text-sm text-muted-foreground">
            Kelola periode pembukuan (OPEN/CLOSED/LOCKED) dan buat periode bulan berikutnya dengan carry-forward saldo
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-muted-foreground">Memuat periode...</div>
        </div>
      )}

      {/* Periods List */}
      {!isLoading && periods.length === 0 && (
        <div className="text-center py-12">
          <div className="text-lg text-muted-foreground">Belum ada periode yang dibuat</div>
          <Button
            onClick={() => navigate('/finance/accounting-periods/create')}
            className="mt-4"
          >
            Buat Periode Pertama
          </Button>
        </div>
      )}

      {/* Periods Grid */}
      {!isLoading && periods.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {periods.map((period) => {
            const { icon, color, bgColor } = getPeriodStatusBadge(period.status || 'OPEN');
            const isLastOpen = isLastOpenPeriod && period.id === lastOpenPeriod?.id && period.status === 'OPEN';

            return (
              <Card key={period.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {formatPeriodName(period)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        ID: {period.id}
                      </CardDescription>
                    </div>
                    <Badge className={`${bgColor} ${color} border-0`}>
                      <span className="mr-1">{icon}</span>
                      {period.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Saldo Awal Kas Kecil:</span>
                      <span className="ml-2 font-semibold">
                        Rp {(period.periodOpeningBalances?.kasKecil || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Saldo Awal Kas Bank:</span>
                      <span className="ml-2 font-semibold">
                        Rp {(period.periodOpeningBalances?.kasBank || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    {period.closedAt && (
                      <div className="text-xs text-muted-foreground">
                        Ditutup pada: {new Date(period.closedAt).toLocaleDateString('id-ID')}
                      </div>
                    )}
                    {period.reopenedAt && (
                      <div className="text-xs text-muted-foreground">
                        Dibuka kembali pada: {new Date(period.reopenedAt).toLocaleDateString('id-ID')}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-4">
                    {period.status === 'OPEN' && isLastOpen && (
                      <Button
                        onClick={() => handleCreateNextPeriod(period.id)}
                        className="w-full"
                      >
                        + Buat Periode Berikutnya
                      </Button>
                    )}

                    {period.status === 'OPEN' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleValidateClose(period.id)}
                          disabled={validating}
                          className="flex-1"
                        >
                          {validating ? 'Memvalidasi...' : 'Validasi & Tutup'}
                        </Button>
                      </div>
                    )}

                    {period.status === 'CLOSED' && (
                      <Button
                        variant="outline"
                        onClick={() => setReopenTarget(period.id)}
                        className="w-full"
                      >
                        Buka Kembali
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Validation Result Alert */}
      {validationResult && (
        <Alert variant={validationResult.canClose ? "default" : "destructive"} className="mt-6">
          <AlertTitle>
            {validationResult.canClose ? 'Validasi Selesai' : 'Validasi Gagal'}
          </AlertTitle>
          <AlertDescription>
            {validationResult.canClose ? (
              <div className="space-y-2">
                <div>✅ Periode siap untuk ditutup.</div>
                {validationResult.warnings.length > 0 && (
                  <div className="mt-4">
                    <div className="font-semibold text-yellow-600 dark:text-yellow-500 mb-2">
                      ⚠️ Peringatan:
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleClosePeriod(validationResult.periodId)}
                  >
                    Tutup Periode
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setValidationResult(null)}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-semibold">❌ Periode tidak dapat ditutup:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Reopen Period Dialog */}
      <Dialog open={reopenTarget !== null} onOpenChange={(open) => !open && setReopenTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buka Kembali Periode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Alasan Pembukaan Kembali</Label>
              <Input
                id="reason"
                placeholder="Masukkan alasan (misal: ada transaksi yang tertinggal)"
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReopenTarget(null)} disabled={isReopening}>
              Batal
            </Button>
            <Button onClick={handleReopenPeriod} disabled={isReopening || !reopenReason.trim()}>
              {isReopening ? 'Memproses...' : 'Buka Periode'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
