/**
 * Export employees to Excel and PDF.
 */

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Employee } from "../types";

export function exportEmployeesToExcel(employees: Employee[], filename = "employees.xlsx"): void {
  const headers = [
    "NIK",
    "Nama Karyawan",
    "Nama Jabatan",
    "TMK",
    "No. HP",
    "Email",
    "Status",
    "Tanggal Keluar",
  ];
  const rows = employees.map((e) => [
    e.nik,
    e.namaKaryawan,
    e.namaJabatan,
    e.tmk ?? "-",
    e.noHp ?? "-",
    e.email ?? "-",
    e.tanggalKeluar ? "Resigned" : "Active",
    e.tanggalKeluar ?? "-",
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");
  XLSX.writeFile(wb, filename);
}

export function exportEmployeesToPdf(employees: Employee[], filename = "employees.pdf"): void {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("Employee List", 14, 15);

  const tableData = employees.map((e) => [
    e.nik,
    e.namaKaryawan,
    e.namaJabatan,
    e.tmk ?? "-",
    e.noHp ?? "-",
    e.email ?? "-",
    e.tanggalKeluar ? "Resigned" : "Active",
  ]);

  autoTable(doc, {
    head: [["NIK", "Nama Karyawan", "Jabatan", "TMK", "No. HP", "Email", "Status"]],
    body: tableData,
    startY: 22,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(filename);
}
