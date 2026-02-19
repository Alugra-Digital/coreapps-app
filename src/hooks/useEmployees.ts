/**
 * TanStack Query hooks for Employees API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Employee, EmployeeCreateInput, EmployeeUpdateInput } from '@/hr/employees/types';
import type { GetEmployeesParams } from '@/api/employees';
import * as employeesApi from '@/api/employees';

export const employeeKeys = {
    all: ['employees'] as const,
    lists: () => [...employeeKeys.all, 'list'] as const,
    list: (filters?: GetEmployeesParams) => [...employeeKeys.lists(), filters] as const,
    details: () => [...employeeKeys.all, 'detail'] as const,
    detail: (id: string) => [...employeeKeys.details(), id] as const,
};

export function useEmployees() {
    return useQuery({
        queryKey: employeeKeys.lists(),
        queryFn: () => employeesApi.getEmployees(),
    });
}

export function useEmployeesPaginated(params?: GetEmployeesParams) {
    return useQuery({
        queryKey: employeeKeys.list(params),
        queryFn: () => employeesApi.getEmployeesPaginated(params),
    });
}

export function useEmployeeById(id: string | undefined) {
    return useQuery({
        queryKey: employeeKeys.detail(id!),
        queryFn: () => employeesApi.getEmployeeById(id!),
        enabled: !!id,
    });
}

export function useCreateEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: EmployeeCreateInput) => employeesApi.createEmployee(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
        },
    });
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: EmployeeUpdateInput }) =>
            employeesApi.updateEmployee(id, input),
        onMutate: async ({ id, input }) => {
            await queryClient.cancelQueries({ queryKey: employeeKeys.detail(id) });
            const previousEmployee = queryClient.getQueryData<Employee>(employeeKeys.detail(id));

            if (previousEmployee) {
                queryClient.setQueryData<Employee>(employeeKeys.detail(id), {
                    ...previousEmployee,
                    ...input,
                });
            }

            return { previousEmployee };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousEmployee) {
                queryClient.setQueryData(employeeKeys.detail(id), context.previousEmployee);
            }
        },
        onSettled: (_data, _error, { id }) => {
            queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
        },
    });
}

export function useDeleteEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => employeesApi.deleteEmployee(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: employeeKeys.lists() });
            const previousEmployees = queryClient.getQueryData<Employee[]>(employeeKeys.lists());

            if (previousEmployees) {
                queryClient.setQueryData<Employee[]>(
                    employeeKeys.lists(),
                    previousEmployees.filter((employee) => employee.id !== id)
                );
            }

            return { previousEmployees };
        },
        onError: (_err, _id, context) => {
            if (context?.previousEmployees) {
                queryClient.setQueryData(employeeKeys.lists(), context.previousEmployees);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
        },
    });
}

export function useSoftDeleteEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => employeesApi.softDeleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
        },
    });
}
