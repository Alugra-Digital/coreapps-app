/**
 * Export Utilities for Finance Module
 * Provides functions to export data to Excel and PDF formats
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    filename = 'export',
    sheetName = 'Data'
  } = options;

  // Transform data to worksheet format
  const worksheetData = [
    columns.map(c => c.header),
    ...data.map(row => columns.map(c => {
      const value = row[c.key];
      // Format numbers as numbers
      if (typeof value === 'number') {
        return value;
      }
      // Format currency strings
      if (typeof value === 'string' && value.startsWith('Rp ')) {
        const numStr = value.replace(/[^0-9,-]/g, '');
        return parseFloat(numStr) || value;
      }
      return value;
    }))
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths if provided
  if (columns.some(c => c.width)) {
    worksheet['!cols'] = columns.map(c => ({
      wch: c.width || 20
    }));
  }

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate file and download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// ==================================================================
// PDF Export
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
 * Export data table to PDF file
 */
export function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  columns: PDFColumn[],
  options: PDFExportOptions = {}
): void {
  const {
    filename = 'export',
    title = '',
    subtitle = '',
    landscape = false,
    margin = 10
  } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation: landscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add title if provided
  let currentY = margin;
  if (title) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, currentY);
    currentY += 8;
  }

  // Add subtitle if provided
  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, margin, currentY);
    currentY += 8;
  }

  // Prepare table data
  const tableData = data.map(row =>
    columns.map(col => {
      const value = row[col.key];
      // Format currency
      if (typeof value === 'string' && value.startsWith('Rp ')) {
        return value;
      }
      return value ?? '';
    })
  );

  // Generate auto table
  autoTable(doc, {
    head: [columns.map(c => c.header)],
    body: tableData,
    startY: currentY,
    margin: { top: margin, left: margin, right: margin, bottom: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [15, 23, 42], // #0F172A (slate-900)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240], // Light gray for alternate rows
    },
    columnStyles: columns.reduce((acc, col, idx) => {
      if (col.width) {
        acc[idx] = { cellWidth: col.width };
      }
      return acc;
    }, {} as Record<number, { cellWidth?: number }>),
  });

  // Save PDF
  doc.save(`${filename}.pdf`);
}

/**
 * Export voucher to PDF (formatted)
 */
export function exportVoucherToPDF(voucher: Record<string, unknown>, lines: Record<string, unknown>[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 15;
  let y = margin;

  // Company Header (placeholder - should come from settings)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PT ALUGRA INDONESIA', 105, y, { align: 'center' });
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Jalan Contoh No. 123, Jakarta', 105, y, { align: 'center' });
  y += 12;

  // Voucher Title
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, y, 195, y);
  y += 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VOUCHER KAS', margin, y);
  y += 8;

  // Voucher Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`No. Voucher: ${voucher.voucherNumber || voucher.code || '-'}`, margin, y);
  doc.text(`Tanggal: ${voucher.date || '-'}`, margin + 80, y);
  y += 6;
  doc.text(`Jenis: ${voucher.voucherType === 'KAS_KECIL' ? 'Kas Kecil' : 'Kas Bank'}`, margin, y);
  doc.text(`Status: ${voucher.status || '-'}`, margin + 80, y);
  y += 6;

  // Penerima (Payee)
  if (voucher.payee || voucher.penerima) {
    doc.text(`Penerima: ${voucher.payee || voucher.penerima}`, margin, y);
    y += 6;
  }

  if (voucher.description || voucher.keterangan) {
    doc.text(`Keterangan: ${voucher.description || voucher.keterangan}`, margin, y);
    y += 8;
  }

  // Table Header Line
  doc.setLineWidth(0.3);
  doc.line(margin, y, 195, y);
  y += 5;

  // Table Headers
  doc.setFont('helvetica', 'bold');
  doc.text('No.', margin, y);
  doc.text('Keterangan', margin + 15, y);
  doc.text('Jumlah (Rp)', 150, y, { align: 'right' });
  y += 5;

  // Table Header Line
  doc.line(margin, y, 195, y);
  y += 3;

  // Table Body
  doc.setFont('helvetica', 'normal');
  lines.forEach((line, idx) => {
    doc.text(`${idx + 1}`, margin, y);
    doc.text(line.description || line.keterangan || '-', margin + 15, y);

    const amount = line.amount || line.jumlah || '0';
    doc.text(formatCurrency(amount), 150, y, { align: 'right' });
    y += 5;
  });

  // Table Footer Line
  doc.line(margin, y, 195, y);
  y += 5;

  // Total
  doc.setFont('helvetica', 'bold');
  const totalAmount = voucher.totalAmount || voucher.total || '0';
  doc.text(`TOTAL: ${formatCurrency(totalAmount)}`, 150, y, { align: 'right' });
  y += 10;

  // Signature Section
  const signatureY = Math.max(y + 10, 180);
  const signaturePositions = [
    { x: margin, label: 'Dibuat' },
    { x: 65, label: 'Diperiksa' },
    { x: 130, label: 'Disetujui' },
    { x: 150, label: 'Penerima' },
  ];

  signaturePositions.forEach(pos => {
    doc.text(pos.label, pos.x, signatureY, { align: 'center' });
    doc.line(pos.x, signatureY + 15, pos.x + 25, signatureY + 15);
    doc.text('_________________', pos.x, signatureY + 5, { align: 'center' });
  });

  // Terbilang
  y = signatureY + 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Terbilang: ${numberToWords(totalAmount)} Rupiah`, margin, y);

  doc.save(`Voucher-${voucher.voucherNumber || voucher.code || 'export'}.pdf`);
}

// ==================================================================
// Helper Functions
// ==================================================================

/**
 * Format currency value
 * - Internal calculations use IDR currency only (for consistency)
 * - Display format uses "Rp X (Rupiah)" for user-facing display
 */
function formatCurrency(value: string | number): string {
  const num = typeof value === 'number' ? value : parseFloat(value?.toString()?.replace(/[^0-9.-]/g, '') || '0');
  return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (Rupiah)`;
}

/**
 * Format currency value for display (with Rp prefix and Rupiah suffix)
 * Note: This is for display purposes only. Use formatCurrency() for calculations.
 */
function formatIDR(value: string | number): string {
  const num = typeof value === 'number' ? value : parseFloat(value?.toString()?.replace(/[^0-9.-]/g, '') || '0');
  return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (Rupiah)`;
}

export { formatCurrency, formatIDR };

/**
 * Convert number to words (Indonesian)
 * Simplified version - for production, use a library like terbilang-js
 */
function numberToWords(value: string | number): string {
  const num = typeof value === 'number' ? value : parseFloat(value?.toString()?.replace(/[^0-9.-]/g, '') || '0');

  if (num === 0) return 'Nol';

  // For simplicity, return the number formatted
  // In production, implement full Indonesian number to words conversion
  return num.toLocaleString('id-ID');
}
