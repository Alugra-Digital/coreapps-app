import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as payrollApi from "@/api/hr-payroll";

export function useSalaryStructures() {
  return useQuery({
    queryKey: ["salary-structures"],
    queryFn: () => payrollApi.getSalaryStructures(),
  });
}

export function useSalarySlips() {
  return useQuery({
    queryKey: ["salary-slips"],
    queryFn: () => payrollApi.getSalarySlips(),
  });
}

export function useCreateSalarySlip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { employeeId: number; period: string }) => payrollApi.createSalarySlip(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-slips"] });
    },
  });
}

export function usePostSalarySlip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.postSalarySlip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-slips"] });
    },
  });
}
