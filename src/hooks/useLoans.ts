import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as loansApi from "@/api/hr-loans";
import type { ApplyLoanInput } from "@/api/hr-loans";

export function useEmployeeLoans(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["loans", employeeId],
    queryFn: () => loansApi.getEmployeeLoans(employeeId!),
    enabled: !!employeeId,
  });
}

export function useApplyLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplyLoanInput) => loansApi.applyLoan(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["loans", String(variables.employeeId)] });
    },
  });
}
