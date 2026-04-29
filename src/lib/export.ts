/**
 * Export Utilities for Finance Module
 * Provides functions to export data to Excel and PDF formats
 * All PDF exports include the Alugra company header with logo.
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==================================================================
// Logo Loader (cached)
// ==================================================================

let _logoDataUrl: string | null = null;

async function getLogoDataUrl(): Promise<string | null> {
  if (_logoDataUrl !== null) return _logoDataUrl;
  try {
    const response = await fetch('/alugra_logo.png');
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        _logoDataUrl = reader.result as string;
        resolve(_logoDataUrl);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ==================================================================
// Company Header Helper
// ==================================================================

const COMPANY_NAME    = 'PT ALUGRA INDONESIA';
const COMPANY_ADDRESS = 'Jl. Mawar No. 10, Jakarta Selatan';
const COMPANY_PHONE   = 'Telp: (021) 123-4567  |  alugra.dev';

/**
 * Draws the branded company header at the top of the page.
 * Returns the Y position after the header so content can start there.
 */
async function addCompanyHeader(doc: jsPDF, margin: number): Promise<number> {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = margin;

  // Logo (left side)
  const logo = await getLogoDataUrl();
  const logoH = 14;
  const logoW = 36;

  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, y, logoW, logoH);
    } catch {
      // fallback: no logo
    }
  }

  // Company text (right of logo)
  const textX = logo ? margin + logoW + 6 : margin;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(COMPANY_NAME, textX, y + 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 90);
  doc.text(COMPANY_ADDRESS, textX, y + 10);
  doc.text(COMPANY_PHONE, textX, y + 14);

  y += logoH + 4;

  // Separator line
  doc.setDrawColor(200, 200, 210);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Reset colour for body text
  doc.setTextColor(15, 23, 42);

  return y;
}

// ==================================================================
// Excel Export
// ==================================================================

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
}

/**
 * Export data array to Excel file
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ExcelColumn[],
  options: ExcelExportOptions = {}
): void {
  const {
    filename  = 'export',
    sheetName = 'Data',
  } = options;

  const worksheetData = [
    columns.map(c => c.header),
    ...data.map(row => columns.map(c => {
      const value = row[c.key];
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && value.startsWith('Rp ')) {
        const numStr = value.replace(/[^0-9,-]/g, '');
        return parseFloat(numStr) || value;
      }
      return value;
    })),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  if (columns.some(c => c.width)) {
    worksheet['!cols'] = columns.map(c => ({ wch: c.width || 20 }));
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// ==================================================================
// PDF Export — Generic Table
// ==================================================================

export interface PDFColumn {
  header: string;
  key: string;
  width?: number;
}

export interface PDFExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  landscape?: boolean;
  margin?: number;
}

/**
 * Export a data table to a branded PDF file (async — loads logo).
 */
export async function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  columns: PDFColumn[],
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename  = 'export',
    title     = '',
    subtitle  = '',
    landscape = false,
    margin    = 12,
  } = options;

  const doc = new jsPDF({
    orientation: landscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // --- Company header with logo ---
  let currentY = await addCompanyHeader(doc, margin);

  // --- Document title ---
  if (title) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, currentY);
    currentY += 7;
  }

  // --- Subtitle / period info ---
  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 100);
    doc.text(subtitle, margin, currentY);
    currentY += 5;
  }

  // --- Print date ---
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(130, 130, 140);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(`Dicetak: ${printDate}`, pageWidth - margin, currentY - (subtitle ? 5 : 7), { align: 'right' });

  currentY += 2;

  // --- Table ---
  const tableData = data.map(row =>
    columns.map(col => {
      const value = row[col.key];
      return value ?? '';
    })
  );

  autoTable(doc, {
    head: [columns.map(c => c.header)],
    body: tableData,
    startY: currentY,
    margin: { top: margin, left: margin, right: margin, bottom: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
    },
    headStyles: {
      fillColor: [15, 23, 42],   // slate-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [245, 246, 250],
    },
    columnStyles: columns.reduce((acc, col, idx) => {
      if (col.width) acc[idx] = { cellWidth: col.width };
      return acc;
    }, {} as Record<number, { cellWidth?: number }>),
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = (doc as jsPDF & { internal: { getNumberOfPages(): number } })
        .internal.getNumberOfPages();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 160);
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount}`,
        pageWidth / 2,
        pageHeight - 6,
        { align: 'center' }
      );
      doc.text(COMPANY_NAME, margin, pageHeight - 6);
    },
  });

  doc.save(`${filename}.pdf`);
}

// ==================================================================
// PDF Export — Voucher (formatted document)
// ==================================================================

/**
 * Export a single voucher to a branded PDF (async — loads logo).
 */
export async function exportVoucherToPDF(
  voucher: Record<string, unknown>,
  lines: Record<string, unknown>[]
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Company header ---
  let y = await addCompanyHeader(doc, margin);

  // --- Voucher document title ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('VOUCHER KAS', margin, y);

  // Voucher number top-right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 90);
  const vNum = String(voucher.voucherNumber || voucher.code || '-');
  doc.text(`No: ${vNum}`, pageWidth - margin, y, { align: 'right' });
  y += 7;

  // --- Meta fields (two-column layout) ---
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  const col1 = margin;
  const col2 = margin + 100;
  const lineH = 6;

  const labelColor: [number, number, number] = [100, 100, 110];
  const valueColor: [number, number, number] = [15, 23, 42];

  const metaRow = (label1: string, val1: string, label2: string, val2: string) => {
    doc.setTextColor(...labelColor);
    doc.text(`${label1}:`, col1, y);
    doc.setTextColor(...valueColor);
    doc.text(val1, col1 + 28, y);
    doc.setTextColor(...labelColor);
    doc.text(`${label2}:`, col2, y);
    doc.setTextColor(...valueColor);
    doc.text(val2, col2 + 28, y);
    y += lineH;
  };

  const rawDate = String(voucher.date || '-');
  const displayDate = rawDate !== '-'
    ? new Date(rawDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    : '-';

  metaRow('Tanggal', displayDate, 'Jenis', voucher.voucherType === 'KAS_KECIL' ? 'Kas Kecil' : 'Kas Bank');
  metaRow('Status', String(voucher.status || '-'), 'Periode', String(voucher.period || '-'));

  if (voucher.payee || voucher.penerima) {
    doc.setTextColor(...labelColor);
    doc.text('Penerima:', col1, y);
    doc.setTextColor(...valueColor);
    doc.text(String(voucher.payee || voucher.penerima), col1 + 28, y);
    y += lineH;
  }
  if (voucher.description || voucher.keterangan) {
    doc.setTextColor(...labelColor);
    doc.text('Keterangan:', col1, y);
    doc.setTextColor(...valueColor);
    doc.text(String(voucher.description || voucher.keterangan), col1 + 28, y);
    y += lineH;
  }

  y += 2;

  // --- Line items table ---
  const tableData = lines.map((line, idx) => [
    String(idx + 1),
    String(line.description || line.keterangan || '-'),
    formatCurrency(line.amount || line.jumlah || 0),
  ]);

  autoTable(doc, {
    head: [['No', 'Keterangan', 'Jumlah (Rp)']],
    body: tableData,
    startY: y,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 246, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { halign: 'right' },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 4;

  // --- Total row ---
  const totalAmount = voucher.totalAmount || voucher.total || 0;
  doc.setDrawColor(200, 200, 210);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL:', pageWidth - margin - 60, y);
  doc.text(formatCurrency(totalAmount), pageWidth - margin, y, { align: 'right' });
  y += 5;

  // --- Terbilang ---
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(60, 60, 70);
  doc.text(`Terbilang: ${numberToWords(totalAmount)} Rupiah`, margin, y);
  y += 12;

  // --- Signature section ---
  const sigY = Math.max(y + 10, 230);
  const sigBoxes = [
    { label: 'Dibuat Oleh',    x: margin },
    { label: 'Diperiksa Oleh', x: margin + 46 },
    { label: 'Disetujui Oleh', x: margin + 92 },
    { label: 'Penerima',       x: margin + 138 },
  ];

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  sigBoxes.forEach(sig => {
    // Box
    doc.setDrawColor(200, 200, 210);
    doc.setLineWidth(0.3);
    doc.rect(sig.x, sigY, 40, 28);
    // Label at top
    doc.setFont('helvetica', 'bold');
    doc.text(sig.label, sig.x + 20, sigY + 5, { align: 'center' });
    // Signature line near bottom
    doc.setFont('helvetica', 'normal');
    doc.line(sig.x + 4, sigY + 22, sig.x + 36, sigY + 22);
    doc.text('( ________________ )', sig.x + 20, sigY + 27, { align: 'center' });
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 160);
  doc.text(COMPANY_NAME, pageWidth / 2, pageHeight - 8, { align: 'center' });

  doc.save(`Voucher-${vNum}.pdf`);
}

// ==================================================================
// Helper Functions
// ==================================================================

/**
 * Format number as Indonesian Rupiah string (e.g. "Rp 1.500.000")
 */
function formatCurrency(value: string | number): string {
  const num = typeof value === 'number'
    ? value
    : parseFloat(value?.toString()?.replace(/[^0-9.-]/g, '') || '0');
  return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format number for display with (Rupiah) suffix
 */
function formatIDR(value: string | number): string {
  const num = typeof value === 'number'
    ? value
    : parseFloat(value?.toString()?.replace(/[^0-9.-]/g, '') || '0');
  return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export { formatCurrency, formatIDR };

/**
 * Convert number to Indonesian words (simplified).
 * For production, replace with a full terbilang library.
 */
function numberToWords(value: string | number): string {
  const num = typeof value === 'number'
    ? value
    : parseFloat(value?.toString()?.replace(/[^0-9.-]/g, '') || '0');
  if (num === 0) return 'Nol';

  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan',
    'Sepuluh', 'Sebelas'];

  function toWords(n: number): string {
    if (n < 12) return satuan[n];
    if (n < 20) return satuan[n - 10] + ' Belas';
    if (n < 100) return satuan[Math.floor(n / 10)] + ' Puluh' + (n % 10 ? ' ' + satuan[n % 10] : '');
    if (n < 200) return 'Seratus' + (n % 100 ? ' ' + toWords(n % 100) : '');
    if (n < 1000) return satuan[Math.floor(n / 100)] + ' Ratus' + (n % 100 ? ' ' + toWords(n % 100) : '');
    if (n < 2000) return 'Seribu' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
    if (n < 1_000_000) return toWords(Math.floor(n / 1000)) + ' Ribu' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
    if (n < 1_000_000_000) return toWords(Math.floor(n / 1_000_000)) + ' Juta' + (n % 1_000_000 ? ' ' + toWords(n % 1_000_000) : '');
    return toWords(Math.floor(n / 1_000_000_000)) + ' Miliar' + (n % 1_000_000_000 ? ' ' + toWords(n % 1_000_000_000) : '');
  }

  return toWords(Math.round(num));
}
