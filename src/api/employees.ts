/**
 * Employee API service.
 * Uses real backend API.
 */

import type { Employee, EmployeeCreateInput, EmployeeUpdateInput } from "@/hr/employees/types";
import { api } from "@/lib/api/client";

/** Normalize response: return data array when paginated, otherwise return as-is */
function normalizeListResponse<T>(response: unknown): T[] {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: T[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return Array.isArray(response) ? (response as T[]) : [];
}

export async function getEmployees(): Promise<Employee[]> {
  const response = await api.get<Employee[] | { data: Employee[] }>("/api/hr/employees");
  return normalizeListResponse<Employee>(response);
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    return await api.get<Employee>(`/api/hr/employees/${id}`);
  } catch {
    return null;
  }
}

export async function createEmployee(input: EmployeeCreateInput): Promise<Employee> {
  return api.post<Employee>("/api/hr/employees", input);
}

export async function updateEmployee(
  id: string,
  input: EmployeeUpdateInput
): Promise<Employee | null> {
  try {
    return await api.put<Employee>(`/api/hr/employees/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/hr/employees/${id}`);
    return true;
  } catch {
    return false;
  }
}

export async function softDeleteEmployee(id: string): Promise<Employee | null> {
  const today = new Date().toISOString().slice(0, 10);
  return updateEmployee(id, { tanggalKeluar: today });
}

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: string;
  status?: "active" | "resigned" | "all";
  includeResigned?: boolean;
}

export interface GetEmployeesResult {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getEmployeesPaginated(
  params: GetEmployeesParams = {}
): Promise<GetEmployeesResult> {
  const { page = 1, limit = 10, search = "", position = "", status = "active", includeResigned = false } = params;
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (search) query.set("search", search);
  if (position) query.set("position", position);
  query.set("status", status);
  query.set("includeResigned", String(includeResigned));
  const res = await api.get<GetEmployeesResult>(`/api/hr/employees?${query}`);
  return res;
}
