# API Structure

This document describes the API layer structure for the application.

## Overview

The API layer is designed to abstract data operations. It currently uses **mock in-memory storage** and can be swapped to real HTTP calls when a backend is available.

## Directory Structure

```
src/
├── lib/
│   └── api/
│       └── client.ts          # Base API client (fetch wrapper)
├── api/
│   ├── index.ts               # API exports
│   └── employees.ts           # Employee CRUD service
```

## Base API Client

**File:** `src/lib/api/client.ts`

- Environment variable: `VITE_API_BASE_URL` (default: `/api`)
- Exports: `apiClient`, `api` (get, post, put, patch, delete)
- Error type: `ApiError` with `message`, `status`, `code`

## Employee API

**File:** `src/api/employees.ts`

| Method | Function | Description | Future Endpoint |
|--------|----------|-------------|-----------------|
| List | `getEmployees()` | Get all employees | `GET /api/employees` |
| Get | `getEmployeeById(id)` | Get employee by ID | `GET /api/employees/:id` |
| Create | `createEmployee(input)` | Create employee | `POST /api/employees` |
| Update | `updateEmployee(id, input)` | Update employee | `PUT /api/employees/:id` |
| Delete | `deleteEmployee(id)` | Delete employee | `DELETE /api/employees/:id` |

### Swapping to Real API

Replace the in-memory implementation with fetch calls:

```typescript
// Example: getEmployees
export async function getEmployees(): Promise<Employee[]> {
  return api.get<Employee[]>("/employees");
}

// Example: createEmployee
export async function createEmployee(input: EmployeeCreateInput): Promise<Employee> {
  return api.post<Employee>("/employees", input);
}
```

## Adding New API Modules

1. Create `src/api/<module>.ts` with service functions
2. Export from `src/api/index.ts`
3. Use `api.get/post/put/delete` from `@/lib/api/client` for HTTP calls
