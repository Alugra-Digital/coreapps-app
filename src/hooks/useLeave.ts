import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as leaveApi from "@/api/hr-leave";
import type { ApplyLeaveInput } from "@/api/hr-leave";

export function useLeaveBalance(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["leave-balance", employeeId],
    queryFn: () => leaveApi.getLeaveBalance(employeeId!),
    enabled: !!employeeId,
  });
}

export function useApplyLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplyLeaveInput) => leaveApi.applyLeave(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-balance"] });
    },
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leaveApi.approveLeave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-balance"] });
    },
  });
}
