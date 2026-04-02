import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as attendanceApi from "@/api/hr-attendance";
import type { LogAttendanceInput } from "@/api/hr-attendance";

export function useAttendance(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: () => attendanceApi.getAttendance(employeeId!),
    enabled: !!employeeId,
  });
}

export function useLogAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LogAttendanceInput) => attendanceApi.logAttendance(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", String(variables.employeeId)] });
    },
  });
}
