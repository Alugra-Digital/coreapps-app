import { api } from "@/lib/api/client";

export interface SalaryStructure {
  id: number;
  employeeId: number;
  employeeName?: string;
  baseSalary: string;
  allowances?: string;
  deductions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalarySlip {
  id: number;
  employeeId: number;
  employeeName?: string;
  period: string;
  grossSalary: string;
  netSalary: string;
  status: "DRAFT" | "POSTED";
  createdAt?: string;
}

export async function getSalaryStructures(): Promise<SalaryStructure[]> {
  const res = await api.get<SalaryStructure[] | { data: SalaryStructure[] }>("/api/hr/payroll/salary-structures");
  if (Array.isArray(res)) return res;
  if (res && "data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

type RawSalarySlip = {
  id: number;
  employeeId: number;
  employeeName?: string;
  periodYear: number;
  periodMonth: number;
  gross: string;
  netPay: string;
  status: "DRAFT" | "POSTED";
  createdAt?: string;
};

function normalizeSlip(raw: RawSalarySlip): SalarySlip {
  return {
    id: raw.id,
    employeeId: raw.employeeId,
    employeeName: raw.employeeName,
    period: `${raw.periodYear}-${String(raw.periodMonth).padStart(2, "0")}`,
    grossSalary: raw.gross,
    netSalary: raw.netPay,
    status: raw.status,
    createdAt: raw.createdAt,
  };
}

export async function getSalarySlips(): Promise<SalarySlip[]> {
  const res = await api.get<RawSalarySlip[] | { data: RawSalarySlip[] }>("/api/hr/payroll/salary-slips");
  const raw = Array.isArray(res) ? res : (res && "data" in res && Array.isArray(res.data) ? res.data : []);
  return raw.map(normalizeSlip);
}

export async function createSalarySlip(input: { employeeId: number; period: string }): Promise<SalarySlip> {
  const [yearStr, monthStr] = input.period.split("-");
  return api.post<SalarySlip>("/api/hr/payroll/salary-slips", {
    employeeId: input.employeeId,
    periodYear: parseInt(yearStr, 10),
    periodMonth: parseInt(monthStr, 10),
  });
}

export async function postSalarySlip(id: number): Promise<SalarySlip> {
  return api.post<SalarySlip>(`/api/hr/payroll/salary-slips/${id}/post`, {});
}
