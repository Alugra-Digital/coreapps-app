import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet, Banknote, FileText, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import { useKasKecilList, kasKecilKeys } from '@/hooks/useKasKecil';
import { useKasBankList, kasBankKeys } from '@/hooks/useKasBank';
import { useAccountingPeriods } from '@/hooks/useAccountingPeriods';
import { exportToExcel, type ExcelColumn } from '@/lib/export';
import * as kasKecilApi from '@/api/kas-kecil';
import * as kasBankApi from '@/api/kas-bank';
import { useFinanceSetting } from '@/hooks/useFinanceSettings';

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const formatRp = (val: string | number) => `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

// The opening balance is stored in the DB under this key (finance_settings table).
// Base period is always January 2026.
const BASE_PERIOD = { year: 2026, month: 1 };

interface CombinedRow {
  key: string; source: 'KK' | 'KB'; transCode: string; date: string;
  description: string; masuk: number; keluar: number; coaAccount?: string; voucherCode?: string;
}

export default function CatatanPengeluaranPage() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { data: periods = [] } = useAccountingPeriods();
  const activePeriod = periods.find((p) => p.year === year && p.month === month);
  const { data: kasKecilData, isLoading: isLoadingKK, isError: isErrorKK } = useKasKecilList(activePeriod ? { periodId: activePeriod.id } : { month, year });
  const { data: kasBankData, isLoading: isLoadingKB, isError: isErrorKB } = useKasBankList(activePeriod ? { periodId: activePeriod.id } : { month, year });
  const { data: openingBalanceSetting, isLoading: isLoadingSetting } = useFinanceSetting('opening_cash_balance');
  const isLoading = isLoadingKK || isLoadingKB || isLoadingSetting;
  const isError = isErrorKK || isErrorKB;

  // Parse the opening balance from DB; fall back to 0 while loading.
  const openingCashBalance = Number(openingBalanceSetting?.value ?? 0);

  // Build list of months from BASE_PERIOD up to (but not including) the selected month.
  // These are needed to compute the cumulative opening balance.
  const prevMonths = useMemo(() => {
    const months: { year: number; month: number }[] = [];
    let y = BASE_PERIOD.year, m = BASE_PERIOD.month;
    while (y < year || (y === year && m < month)) {
      months.push({ year: y, month: m });
      m++;
      if (m > 12) { m = 1; y++; }
    }
    return months;
  }, [year, month]);

  // Fetch KK + KB data for all previous months in parallel (results are cached by React Query).
  const prevResults = useQueries({
    queries: prevMonths.flatMap(({ year: y, month: m }) => [
      {
        queryKey: kasKecilKeys.list({ month: m, year: y }),
        queryFn: () => kasKecilApi.getKasKecilList({ month: m, year: y }),
      },
      {
        queryKey: kasBankKeys.list({ month: m, year: y }),
        queryFn: () => kasBankApi.getKasBankList({ month: m, year: y }),
      },
    ]),
  });

  // saldo awal = opening balance from DB + cumulative net of all months before the selected month.
  const saldoAwal = useMemo(() => {
    let balance = openingCashBalance;
    for (let i = 0; i < prevMonths.length; i++) {
      const kkResult = prevResults[i * 2];
      const kbResult = prevResults[i * 2 + 1];
      const kkNet = (kkResult?.data?.transactions ?? []).reduce(
        (s, tx) => s + Number(tx.debit) - Number(tx.credit), 0
      );
      const kbNet = (kbResult?.data?.transactions ?? []).reduce(
        (s, tx) => s + Number(tx.inflow) - Number(tx.outflow), 0
      );
      balance += kkNet + kbNet;
    }
    return balance;
  }, [prevResults, prevMonths, openingCashBalance]);

  const rows = useMemo<(CombinedRow & { runningBalance: number })[]>(() => {
    const kkRows: CombinedRow[] = (kasKecilData?.transactions ?? []).map((tx) => ({ key: `KK-${tx.id}`, source: 'KK', transCode: tx.transNumber, date: tx.date, description: tx.description, masuk: Number(tx.debit), keluar: Number(tx.credit), coaAccount: tx.coaAccount, voucherCode: tx.voucherCode }));
    const kbRows: CombinedRow[] = (kasBankData?.transactions ?? []).map((tx) => ({ key: `KB-${tx.id}`, source: 'KB', transCode: tx.transactionCode, date: tx.date, description: tx.description, masuk: Number(tx.inflow), keluar: Number(tx.outflow), coaAccount: tx.coaAccount, voucherCode: tx.voucherCode }));
    const merged = [...kkRows, ...kbRows].sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.transCode.localeCompare(b.transCode));
    let balance = saldoAwal;
    return merged.map((row) => { balance += row.masuk - row.keluar; return { ...row, runningBalance: balance }; });
  }, [kasKecilData, kasBankData, saldoAwal]);

  const totalMasuk = rows.reduce((s, r) => s + r.masuk, 0);
  const totalKeluar = rows.reduce((s, r) => s + r.keluar, 0);
  const saldoAkhir = rows.length > 0 ? rows[rows.length - 1].runningBalance : saldoAwal;
  const kkCount = rows.filter((r) => r.source === 'KK').length;
  const kbCount = rows.filter((r) => r.source === 'KB').length;
  const isPeriodClosed = activePeriod && activePeriod.status !== 'OPEN';

  const handleExport = () => {
    if (rows.length === 0) { toast.error('Tidak ada data untuk di-export'); return; }
    const exportData = rows.map((r, idx) => ({ no: idx + 1, noTransaksi: r.transCode, sumber: r.source === 'KK' ? 'Kas Kecil' : 'Kas Bank', tanggal: r.date, keterangan: r.description, akun: r.coaAccount ?? '—', masuk: r.masuk > 0 ? formatRp(r.masuk) : '—', keluar: r.keluar > 0 ? formatRp(r.keluar) : '—', saldoBerjalan: formatRp(r.runningBalance) }));
    const columns: ExcelColumn[] = [{ header: 'No.', key: 'no', width: 6 }, { header: 'No. Transaksi', key: 'noTransaksi', width: 18 }, { header: 'Sumber', key: 'sumber', width: 12 }, { header: 'Tanggal', key: 'tanggal', width: 14 }, { header: 'Keterangan', key: 'keterangan', width: 35 }, { header: 'Akun COA', key: 'akun', width: 12 }, { header: 'Debit/Masuk', key: 'masuk', width: 18 }, { header: 'Kredit/Keluar', key: 'keluar', width: 18 }, { header: 'Saldo Berjalan', key: 'saldoBerjalan', width: 18 }];
    exportToExcel(exportData, columns, { filename: `Catatan-Pengeluaran-${MONTHS[month-1]}-${year}` });
    toast.success('Data berhasil di-export ke Excel');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-4 sm:p-6 lg:p-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        <div className="flex items-center justify-between flex-col md:flex-row gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F0F0F0]">Catatan Pengeluaran</h1>
            <p className="text-[#6B6B75] text-sm font-medium">Rekap gabungan Kas Kecil &amp; Kas Bank per periode</p>
          </div>
          <div className="flex items-center gap-3 flex-col md:flex-row flex-wrap">
            <PeriodSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
            <Button variant="outline" onClick={handleExport} disabled={isLoading || rows.length === 0} className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] min-h-[44px] px-6 rounded-xl"><FileText className="w-4 h-4 mr-1" />Export Excel</Button>
            <Button variant="outline" onClick={() => navigate('/finance/accounting-periods')} className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] min-h-[44px] px-6 rounded-xl"><CalendarDays className="w-4 h-4 mr-1" />Periode</Button>
          </div>
        </div>
        {isPeriodClosed && <div className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">Periode ini sudah {activePeriod?.status === 'LOCKED' ? 'dikunci' : 'ditutup'}. Data hanya bisa dilihat.</div>}
        {!isLoading && rows.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-[#6B6B75]"><Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">KK</Badge><span>{kkCount} transaksi Kas Kecil</span></div>
            <span className="text-[#1E1E22]">·</span>
            <div className="flex items-center gap-2 text-sm text-[#6B6B75]"><Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">KB</Badge><span>{kbCount} transaksi Kas Bank</span></div>
            <span className="text-[#1E1E22]">·</span>
            <span className="text-sm text-[#6B6B75]">{rows.length} total transaksi</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinanceStatCard title="Saldo Awal" value={formatRp(saldoAwal)} description="Saldo awal periode" icon={<Banknote className="h-6 w-6" />} color="#3b82f6" />
          <FinanceStatCard title="Total Masuk" value={formatRp(totalMasuk)} description="Total debit + inflow" icon={<TrendingUp className="h-6 w-6" />} color="#22c55e" />
          <FinanceStatCard title="Total Keluar" value={formatRp(totalKeluar)} description="Total kredit + outflow" icon={<TrendingDown className="h-6 w-6" />} color="#ef4444" />
          <FinanceStatCard title="Saldo Akhir" value={formatRp(saldoAkhir)} description={saldoAkhir >= 0 ? 'Saldo positif' : 'Saldo negatif'} icon={<Wallet className="h-6 w-6" />} color={saldoAkhir >= 0 ? '#22c55e' : '#ef4444'} />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={() => navigate('/finance/kas-kecil')} className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl text-sm"><Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono mr-2 text-xs">KK</Badge>Kelola Kas Kecil</Button>
          <Button variant="outline" onClick={() => navigate('/finance/kas-bank')} className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-xl text-sm"><Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono mr-2 text-xs">KB</Badge>Kelola Kas Bank</Button>
        </div>
        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#0A0A0B]">
                  <TableRow className="hover:bg-transparent border-[#1E1E22]">
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[50px]">No.</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[70px]">Sumber</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[140px]">No. Transaksi</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[110px]">Tanggal</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Keterangan</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[100px]">Akun COA</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[140px]">Debit / Masuk</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[140px]">Kredit / Keluar</TableHead>
                    <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[150px]">Saldo Berjalan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-[#1E1E22] hover:bg-transparent"><TableCell colSpan={9} className="text-center text-[#6B6B75] py-16"><p className="text-sm font-medium">Memuat data...</p></TableCell></TableRow>
                  ) : isError ? (
                    <TableRow className="border-[#1E1E22] hover:bg-transparent"><TableCell colSpan={9} className="text-center text-red-500 py-10">Gagal memuat data</TableCell></TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow className="border-[#1E1E22] hover:bg-transparent"><TableCell colSpan={9} className="text-center text-[#6B6B75] py-10">Tidak ada transaksi pada periode ini</TableCell></TableRow>
                  ) : rows.map((row, idx) => (
                    <TableRow key={row.key} className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]">
                      <TableCell className="text-xs text-[#6B6B75] tabular-nums">{idx + 1}</TableCell>
                      <TableCell>{row.source === 'KK' ? <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono text-[10px]">KK</Badge> : <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono text-[10px]">KB</Badge>}</TableCell>
                      <TableCell className="font-mono text-xs text-[#F0F0F0]">{row.transCode}</TableCell>
                      <TableCell className="text-sm text-[#F0F0F0] tabular-nums">{row.date}</TableCell>
                      <TableCell className="text-sm text-[#F0F0F0] max-w-[260px]">
                        <div className="truncate" title={row.description}>{row.description}</div>
                        {row.voucherCode && <div className="text-[10px] text-[#6B6B75] font-mono mt-0.5">{row.voucherCode}</div>}
                      </TableCell>
                      <TableCell>{row.coaAccount ? <Badge variant="outline" className="font-mono text-xs border-[#1E1E22] bg-[#0A0A0B] text-[#F0F0F0]">{row.coaAccount}</Badge> : <span className="text-[#6B6B75]">—</span>}</TableCell>
                      <TableCell className="text-right text-sm text-green-500 tabular-nums">{row.masuk > 0 ? formatRp(row.masuk) : '—'}</TableCell>
                      <TableCell className="text-right text-sm text-red-500 tabular-nums">{row.keluar > 0 ? formatRp(row.keluar) : '—'}</TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums"><span className={row.runningBalance >= 0 ? 'text-[#F0F0F0]' : 'text-red-400'}>{formatRp(row.runningBalance)}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {!isLoading && rows.length > 0 && (
              <div className="border-t border-[#1E1E22] bg-[#0A0A0B] px-4 py-3 flex items-center justify-end gap-8 text-sm">
                <div className="flex items-center gap-2"><span className="text-[#6B6B75] text-xs uppercase tracking-widest">Total Masuk</span><span className="text-green-500 font-bold tabular-nums">{formatRp(totalMasuk)}</span></div>
                <div className="flex items-center gap-2"><span className="text-[#6B6B75] text-xs uppercase tracking-widest">Total Keluar</span><span className="text-red-500 font-bold tabular-nums">{formatRp(totalKeluar)}</span></div>
                <div className="flex items-center gap-2"><span className="text-[#6B6B75] text-xs uppercase tracking-widest">Saldo Akhir</span><span className={`font-bold tabular-nums ${saldoAkhir >= 0 ? 'text-[#F5A623]' : 'text-red-400'}`}>{formatRp(saldoAkhir)}</span></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
