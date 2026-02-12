/**
 * Employee API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type { Employee, EmployeeCreateInput, EmployeeUpdateInput } from "@/hr/employees/types";
import { mockEmployees } from "@/hr/employees/data";

// In-memory store for mock mode (mirrors backend state)
let employeesStore: Employee[] = [...mockEmployees];

/**
 * Get all employees.
 * API: GET /employees
 */
export async function getEmployees(): Promise<Employee[]> {
  // When backend ready: return api.get<Employee[]>("/employees");
  return Promise.resolve([...employeesStore]);
}

/**
 * Get employee by ID.
 * API: GET /employees/:id
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  // When backend ready: return api.get<Employee>(`/employees/${id}`);
  const emp = employeesStore.find((e) => e.id === id);
  return Promise.resolve(emp ?? null);
}

/**
 * Create employee.
 * API: POST /employees
 */
export async function createEmployee(
  input: EmployeeCreateInput
): Promise<Employee> {
  // When backend ready: return api.post<Employee>("/employees", input);
  const id = `EMP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const employee: Employee = { ...input, id };
  employeesStore.push(employee);
  return Promise.resolve(employee);
}

/**
 * Update employee.
 * API: PUT /employees/:id
 */
export async function updateEmployee(
  id: string,
  input: EmployeeUpdateInput
): Promise<Employee | null> {
  // When backend ready: return api.put<Employee>(`/employees/${id}`, input);
  const index = employeesStore.findIndex((e) => e.id === id);
  if (index === -1) return Promise.resolve(null);
  employeesStore[index] = { ...employeesStore[index], ...input };
  return Promise.resolve(employeesStore[index]);
}

/**
 * Delete employee.
 * API: DELETE /employees/:id
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  // When backend ready: await api.delete(`/employees/${id}`); return true;
  const index = employeesStore.findIndex((e) => e.id === id);
  if (index === -1) return Promise.resolve(false);
  employeesStore.splice(index, 1);
  return Promise.resolve(true);
}
