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

export async function getSalarySlips(): Promise<SalarySlip[]> {
  const res = await api.get<SalarySlip[] | { data: SalarySlip[] }>("/api/hr/payroll/salary-slips");
  if (Array.isArray(res)) return res;
  if (res && "data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function createSalarySlip(input: { employeeId: number; period: string }): Promise<SalarySlip> {
  return api.post<SalarySlip>("/api/hr/payroll/salary-slips", input);
}

export async function postSalarySlip(id: number): Promise<SalarySlip> {
  return api.post<SalarySlip>(`/api/hr/payroll/salary-slips/${id}/post`, {});
}
