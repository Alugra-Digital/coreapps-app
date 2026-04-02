import { api } from "@/lib/api/client";

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "ON_LEAVE";
  checkIn?: string;
  checkOut?: string;
  workingHours?: string;
  createdAt?: string;
}

export interface LogAttendanceInput {
  employeeId: string | number;
  date: string;
  status: string;
  checkIn?: string;
  checkOut?: string;
}

export async function getAttendance(employeeId: string): Promise<AttendanceRecord[]> {
  return api.get<AttendanceRecord[]>(`/api/hr/attendance/${employeeId}`);
}

export async function logAttendance(input: LogAttendanceInput): Promise<AttendanceRecord[]> {
  return api.post<AttendanceRecord[]>("/api/hr/attendance/log", input);
}
