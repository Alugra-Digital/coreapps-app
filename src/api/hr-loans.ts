import { api } from "@/lib/api/client";

export interface EmployeeLoan {
  id: number;
  employeeId: number;
  loanAmount: string;
  repaymentPeriods: number;
  repaymentAmount: string;
  remainingAmount: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED";
  createdAt?: string;
}

export interface ApplyLoanInput {
  employeeId: string | number;
  loanAmount: number;
  repaymentPeriods: number;
}

export async function getEmployeeLoans(employeeId: string): Promise<EmployeeLoan[]> {
  return api.get<EmployeeLoan[]>(`/api/hr/loans/${employeeId}`);
}

export async function applyLoan(input: ApplyLoanInput): Promise<EmployeeLoan[]> {
  return api.post<EmployeeLoan[]>("/api/hr/loans/apply", input);
}
