import { api } from "@/lib/api/client";

export interface LeaveBalance {
  typeName: string;
  total: string;
  used: string;
  remaining: string;
}

export interface LeaveApplication {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  totalDays: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
}

export interface ApplyLeaveInput {
  employeeId: string | number;
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
}

export async function getLeaveBalance(employeeId: string): Promise<LeaveBalance[]> {
  return api.get<LeaveBalance[]>(`/api/hr/leave/balance/${employeeId}`);
}

export async function applyLeave(input: ApplyLeaveInput): Promise<LeaveApplication> {
  return api.post<LeaveApplication>("/api/hr/leave/apply", input);
}

export async function approveLeave(applicationId: number): Promise<LeaveApplication[]> {
  return api.post<LeaveApplication[]>(`/api/hr/leave/applications/${applicationId}/approve`, {});
}
