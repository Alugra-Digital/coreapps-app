import { useState } from 'react';
import { Download, Calculator, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import { useNeracaSaldo } from '@/hooks/useNeracaSaldo';
import { useAccountingPeriods } from '@/hooks/useAccountingPeriods';
import { exportToExcel, exportToPDF } from '@/lib/export';
import type { PDFColumn, ExcelColumn } from '@/lib/export';

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const formatRp = (val: string | number) =>
    `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

export default function NeracaSaldoPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);

    const { data: periods = [] } = useAccountingPeriods();
    const activePeriod = periods.find((p) => p.year === year && p.month === month);

    const { data, isLoading, isError } = useNeracaSaldo(
        activePeriod
            ? { periodId: activePeriod.id }
            : {
                startDate: `${year}-${String(month).padStart(2, '0')}-01`,
                endDate: new Date(year, month, 0).toISOString().split('T')[0],
            }
    );

    const accounts = data?.accounts ?? [];
    const totals = data?.totals ?? { debit: 0, credit: 0, openingBalance: 0, closingBalance: 0, balanced: true };

    const handleExport = async (format: 'excel' | 'pdf') => {
        if (accounts.length === 0) {
            toast.error('Tidak ada data untuk di-export');
            return;
        }

        const monthName = MONTHS[month - 1];
        const filename = `Neraca-Saldo-${monthName}-${year}`;

        // Prepare export data
        const exportData = accounts.map(acc => ({
            kodeAkun: acc.code,
            namaAkun: acc.name,
            saldoAwal: formatRp(acc.openingBalance),
            debit: Number(acc.debit) > 0 ? formatRp(acc.debit) : '—',
            kredit: Number(acc.credit) > 0 ? formatRp(acc.credit) : '—',
            saldoAkhir: formatRp(acc.closingBalance),
        }));

        const columns: ExcelColumn[] | PDFColumn[] = [
            { header: 'Kode Akun', key: 'kodeAkun', width: 15 },
            { header: 'Nama Akun', key: 'namaAkun', width: 30 },
            { header: 'Saldo Awal', key: 'saldoAwal', width: 18 },
            { header: 'Debit', key: 'debit', width: 15 },
            { header: 'Kredit', key: 'kredit', width: 15 },
            { header: 'Saldo Akhir', key: 'saldoAkhir', width: 18 },
        ];

        if (format === 'excel') {
            exportToExcel(exportData, columns as ExcelColumn[], { filename });
            toast.success('Data berhasil di-export ke Excel');
        } else {
            await exportToPDF(exportData, columns as PDFColumn[], {
                filename,
                title: 'NERACA SALDO (TRIAL BALANCE)',
                subtitle: `Periode: ${monthName} ${year} ${totals.balanced ? '✓ Seimbang' : '✗ Tidak Seimbang'}`,
                landscape: true,
            });
            toast.success('Data berhasil di-export ke PDF');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
            <div className="max-w-[1600px] mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
                            Neraca Saldo (Trial Balance)
                        </h1>
                        <p className="text-[#6B6B75] text-sm font-medium mt-1">Laporan rekapitulasi saldo akun per periode</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <PeriodSelector
                            year={year}
                            month={month}
                            onChange={(y, m) => {
                                setYear(y);
                                setMonth(m);
                            }}
                        />
                        <Button
                            onClick={() => handleExport('excel')}
                            disabled={isLoading || accounts.length === 0}
                            variant="outline"
                            className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent h-12 px-6 rounded-xl transition-all"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Excel
                        </Button>
                        <Button
                            onClick={() => handleExport('pdf')}
                            disabled={isLoading || accounts.length === 0}
                            variant="outline"
                            className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent h-12 px-6 rounded-xl transition-all"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                        </Button>
                    </div>
                </div>

                {/* Validation Error Alert */}
                {!isLoading && !isError && !totals.balanced && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Calculator className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-500">Neraca Saldo Tidak Seimbang!</h3>
                                <div className="mt-2 text-sm text-red-400">
                                    <p>Terdapat selisih antara total debit dan kredit pada periode ini sebesar {formatRp(Math.abs(totals.debit - totals.credit))}.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <FinanceStatCard
                        title="Total Debit"
                        value={formatRp(totals.debit)}
                        description="Mutasi Debit"
                        icon={<FileText className="h-6 w-6" />}
                        color="#22c55e"
                    />
                    <FinanceStatCard
                        title="Total Kredit"
                        value={formatRp(totals.credit)}
                        description="Mutasi Kredit"
                        icon={<FileText className="h-6 w-6" />}
                        color="#ef4444"
                    />
                    <FinanceStatCard
                        title="Saldo Awal"
                        value={formatRp(totals.openingBalance)}
                        description="Total saldo awal"
                        icon={<FileText className="h-6 w-6" />}
                        color="#3b82f6"
                    />
                    <FinanceStatCard
                        title="Status"
                        value={totals.balanced ? "Seimbang" : "Tidak Seimbang"}
                        description="Validasi Double-Entry"
                        icon={<Calculator className="h-6 w-6" />}
                        color={totals.balanced ? "#22c55e" : "#ef4444"}
                    />
                </div>

                {/* Trial Balance Table */}
                <div className="space-y-3">
                    {isLoading ? (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="py-16 text-center">
                                <div className="h-32 flex flex-col items-center justify-center gap-4">
                                    <div className="h-10 w-10 rounded-lg border border-[#1E1E22] p-2 flex items-center justify-center">
                                        <span className="h-5 w-5 rounded bg-[#F5A623]/30 loader-cube" />
                                    </div>
                                    <p className="text-[#6B6B75] text-sm font-medium">Memuat Neraca Saldo...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : isError ? (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="py-10 text-center text-red-500">
                                Gagal memuat data
                            </CardContent>
                        </Card>
                    ) : accounts.length === 0 ? (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="py-16 text-center text-[#6B6B75]">
                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                Tidak ada data neraca saldo pada periode ini
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-[#0A0A0B]">
                                        <TableRow className="hover:bg-transparent border-[#1E1E22]">
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[120px]">
                                                Kode Akun
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                                                Nama Akun
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[150px]">
                                                Saldo Awal
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[150px]">
                                                Debit
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[150px]">
                                                Kredit
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[150px]">
                                                Saldo Akhir
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accounts.map((acc, idx) => (
                                            <TableRow
                                                key={`acc-${acc.id}-${idx}`}
                                                className={`transition-colors border-[#1E1E22] ${acc.isGroup ? 'bg-[#1E1E22]/30 hover:bg-[#1E1E22]/50' : 'hover:bg-white/[0.02]'}`}
                                            >
                                                <TableCell className={`text-xs ${acc.isGroup ? 'font-bold text-[#F0F0F0]' : 'text-[#6B6B75]'} font-mono`}>
                                                    {acc.code}
                                                </TableCell>
                                                <TableCell className={`text-sm ${acc.isGroup ? 'font-bold text-[#F0F0F0]' : 'text-[#F0F0F0] pl-6'}`}>
                                                    {acc.name}
                                                </TableCell>
                                                <TableCell className={`text-right text-sm ${acc.isGroup ? 'font-bold text-[#F0F0F0]' : 'text-[#F0F0F0]'}`}>
                                                    {formatRp(acc.openingBalance)}
                                                </TableCell>
                                                <TableCell className={`text-right text-sm ${acc.isGroup ? 'font-bold' : ''} text-green-500`}>
                                                    {Number(acc.debit) > 0 ? formatRp(acc.debit) : '—'}
                                                </TableCell>
                                                <TableCell className={`text-right text-sm ${acc.isGroup ? 'font-bold' : ''} text-red-500`}>
                                                    {Number(acc.credit) > 0 ? formatRp(acc.credit) : '—'}
                                                </TableCell>
                                                <TableCell className={`text-right text-sm ${acc.isGroup ? 'font-bold text-[#F0F0F0]' : 'font-semibold text-[#F0F0F0]'}`}>
                                                    {formatRp(acc.closingBalance)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="border-t-2 border-[#1E1E22] bg-[#0A0A0B]/50">
                                            <TableCell colSpan={2} className="text-right font-semibold text-sm text-[#F0F0F0]">
                                                Total
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-[#3b82f6]">
                                                {formatRp(totals.openingBalance)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-green-500">
                                                {formatRp(totals.debit)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-red-500">
                                                {formatRp(totals.credit)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-[#F0F0F0]">
                                                {formatRp(totals.closingBalance)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
