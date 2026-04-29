import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { FinanceStatCard } from '@/finance/components/FinanceStatCard';
import { PeriodSelector } from '@/finance/components/PeriodSelector';
import { useBukuBesar } from '@/hooks/useBukuBesar';
import { useAccountingPeriods } from '@/hooks/useAccountingPeriods';
import { useAccounts } from '@/hooks/useAccounts';
import { exportToExcel, exportToPDF } from '@/lib/export';
import type { PDFColumn, ExcelColumn } from '@/lib/export';

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const formatRp = (val: string | number) =>
    `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

const formatExcelDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function BukuBesarPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [accountId, setAccountId] = useState<number | null>(null);
    const [sourceModule, setSourceModule] = useState<string>('ALL');

    const { data: periods = [] } = useAccountingPeriods();
    const activePeriod = periods.find((p) => p.year === year && p.month === month);

    const { data: accounts = [] } = useAccounts();

    const { data, isLoading, isError } = useBukuBesar(
        activePeriod
            ? {
                periodId: activePeriod.id,
                accountId: accountId || undefined,
                sourceModule: sourceModule === 'ALL' ? undefined : sourceModule
            }
            : {
                startDate: `${year}-${String(month).padStart(2, '0')}-01`,
                endDate: new Date(year, month, 0).toISOString().split('T')[0],
                accountId: accountId || undefined,
                sourceModule: sourceModule === 'ALL' ? undefined : sourceModule
            }
    );

    const entries = data?.entries ?? [];
    const openingBalances = data?.openingBalances ?? {};

    // Calculate specific total debit and total credit for the selected period
    const totalPeriodDebit = entries.reduce((sum, e) => sum + Number(e.debit || 0), 0);
    const totalPeriodCredit = entries.reduce((sum, e) => sum + Number(e.credit || 0), 0);

    const handleExport = async (format: 'excel' | 'pdf') => {
        if (entries.length === 0) {
            toast.error('Tidak ada data untuk di-export');
            return;
        }

        const monthName = MONTHS[month - 1];
        const filename = `Buku-Besar-${monthName}-${year}`;

        // Prepare export data
        const exportData = entries.map(e => ({
            tanggal: formatExcelDate(e.date),
            referensi: e.reference || '-',
            akun: `${e.accountCode} - ${e.accountName}`,
            keterangan: e.lineDescription ? `${e.description} (${e.lineDescription})` : e.description,
            debit: formatRp(e.debit),
            kredit: formatRp(e.credit),
            saldo: formatRp(e.runningBalance),
        }));

        const columns: ExcelColumn[] | PDFColumn[] = [
            { header: 'Tanggal', key: 'tanggal', width: 18 },
            { header: 'Referensi', key: 'referensi', width: 15 },
            { header: 'Akun', key: 'akun', width: 30 },
            { header: 'Keterangan', key: 'keterangan', width: 40 },
            { header: 'Debit', key: 'debit', width: 15 },
            { header: 'Kredit', key: 'kredit', width: 15 },
            { header: 'Saldo', key: 'saldo', width: 15 },
        ];

        if (format === 'excel') {
            exportToExcel(exportData, columns as ExcelColumn[], { filename });
            toast.success('Data berhasil di-export ke Excel');
        } else {
            await exportToPDF(exportData, columns as PDFColumn[], {
                filename,
                title: 'BUKU BESAR (GENERAL LEDGER)',
                subtitle: `Periode: ${monthName} ${year}`,
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
                            Buku Besar (General Ledger)
                        </h1>
                        <p className="text-[#6B6B75] text-sm font-medium mt-1">Laporan mutasi tiap akun per periode</p>
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
                            disabled={isLoading || entries.length === 0}
                            variant="outline"
                            className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent h-12 px-6 rounded-xl transition-all"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Excel
                        </Button>
                        <Button
                            onClick={() => handleExport('pdf')}
                            disabled={isLoading || entries.length === 0}
                            variant="outline"
                            className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] bg-transparent h-12 px-6 rounded-xl transition-all"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#111113] p-4 rounded-2xl border border-[#1E1E22]">
                        <label className="text-xs font-semibold text-[#6B6B75] uppercase tracking-wider mb-2 block">
                            Filter Akun
                        </label>
                        <Select
                            value={accountId ? String(accountId) : 'ALL'}
                            onValueChange={(val) => setAccountId(val === 'ALL' ? null : Number(val))}
                        >
                            <SelectTrigger className="w-full bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] focus:ring-[#F5A623]">
                                <SelectValue placeholder="Pilih Akun" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                                <SelectItem value="ALL">Semua Akun</SelectItem>
                                {accounts.filter(a => !a.isGroup).map((acc) => (
                                    <SelectItem key={acc.id} value={String(acc.id)}>
                                        {acc.code} - {acc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-[#111113] p-4 rounded-2xl border border-[#1E1E22]">
                        <label className="text-xs font-semibold text-[#6B6B75] uppercase tracking-wider mb-2 block">
                            Filter Modul Sumber
                        </label>
                        <Select value={sourceModule} onValueChange={setSourceModule}>
                            <SelectTrigger className="w-full bg-[#0A0A0B] border-[#1E1E22] text-[#F0F0F0] focus:ring-[#F5A623]">
                                <SelectValue placeholder="Semua Modul" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
                                <SelectItem value="ALL">Semua Modul</SelectItem>
                                <SelectItem value="KAS_KECIL">Kas Kecil</SelectItem>
                                <SelectItem value="KAS_BANK">Kas Bank</SelectItem>
                                <SelectItem value="JURNAL_MEMORIAL">Jurnal Memorial</SelectItem>
                                <SelectItem value="VOUCHER">Voucher</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <FinanceStatCard
                        title="Total Transaksi"
                        value={String(entries.length)}
                        description="Baris mutasi pada periode ini"
                        icon={<FileText className="h-6 w-6" />}
                        color="#3b82f6"
                    />
                    <FinanceStatCard
                        title="Total Debit"
                        value={formatRp(totalPeriodDebit)}
                        description="Mutasi Debit"
                        icon={<FileText className="h-6 w-6" />}
                        color="#22c55e"
                    />
                    <FinanceStatCard
                        title="Total Kredit"
                        value={formatRp(totalPeriodCredit)}
                        description="Mutasi Kredit"
                        icon={<FileText className="h-6 w-6" />}
                        color="#ef4444"
                    />
                </div>

                {/* Ledger list */}
                <div className="space-y-3">
                    {isLoading ? (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="py-16 text-center">
                                <div className="h-32 flex flex-col items-center justify-center gap-4">
                                    <div className="h-10 w-10 rounded-lg border border-[#1E1E22] p-2 flex items-center justify-center">
                                        <span className="h-5 w-5 rounded bg-[#F5A623]/30 loader-cube" />
                                    </div>
                                    <p className="text-[#6B6B75] text-sm font-medium">Memuat data Buku Besar...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : isError ? (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="py-10 text-center text-red-500">
                                Gagal memuat data
                            </CardContent>
                        </Card>
                    ) : entries.length === 0 && Object.keys(openingBalances).length === 0 ? (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="py-16 text-center text-[#6B6B75]">
                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                Tidak ada data pada periode dan filter ini
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-[#0A0A0B]">
                                        <TableRow className="hover:bg-transparent border-[#1E1E22]">
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[120px]">
                                                Tanggal
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[160px]">
                                                Referensi
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 w-[200px]">
                                                Akun
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">
                                                Keterangan
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[140px]">
                                                Debit
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[140px]">
                                                Kredit
                                            </TableHead>
                                            <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right w-[150px]">
                                                Saldo Berjalan
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Optionally display opening balance row if exactly one account is selected */}
                                        {accountId && openingBalances && (
                                            <TableRow className="bg-[#1E1E22]/30 hover:bg-[#1E1E22]/50 border-[#1E1E22]">
                                                <TableCell colSpan={6} className="text-right text-[#F0F0F0] text-sm italic font-medium">
                                                    Saldo Awal
                                                </TableCell>
                                                <TableCell className="text-right text-[#F0F0F0] font-bold text-sm">
                                                    {formatRp(Object.values(openingBalances)[0] || 0)}
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {entries.map((entry, idx) => (
                                            <TableRow
                                                key={`${entry.entryId}-${idx}`}
                                                className="hover:bg-white/[0.02] transition-colors border-[#1E1E22]"
                                            >
                                                <TableCell className="text-xs text-[#6B6B75] font-mono">
                                                    {new Date(entry.date).toLocaleDateString('id-ID')}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-[#F0F0F0]">
                                                    {entry.reference || '-'}
                                                </TableCell>
                                                <TableCell className="text-sm text-[#F0F0F0]">
                                                    {entry.accountCode} - {entry.accountName}
                                                </TableCell>
                                                <TableCell className="text-xs text-[#F0F0F0]">
                                                    <div className="font-semibold">{entry.description}</div>
                                                    {entry.lineDescription && (
                                                        <div className="text-[#6B6B75] mt-1">{entry.lineDescription}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-green-500">
                                                    {Number(entry.debit) > 0 ? formatRp(entry.debit) : '—'}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-red-500">
                                                    {Number(entry.credit) > 0 ? formatRp(entry.credit) : '—'}
                                                </TableCell>
                                                <TableCell className="text-right text-sm font-semibold text-[#F0F0F0]">
                                                    {formatRp(entry.runningBalance)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
