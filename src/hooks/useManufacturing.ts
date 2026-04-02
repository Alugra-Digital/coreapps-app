import { useQuery, useMutation } from "@tanstack/react-query";
import * as mfgApi from "@/api/manufacturing";

export function useWorkOrders() {
  return useQuery({
    queryKey: ["work-orders"],
    queryFn: mfgApi.getWorkOrders,
  });
}

export function useCreateWorkOrder() {
  return useMutation({ mutationFn: mfgApi.createWorkOrder });
}

export function useStartWorkOrder() {
  return useMutation({ mutationFn: mfgApi.startWorkOrder });
}

export function useCompleteWorkOrder() {
  return useMutation({ mutationFn: mfgApi.completeWorkOrder });
}

export function useBOMs() {
  return useQuery({
    queryKey: ["boms"],
    queryFn: mfgApi.getBOMs,
  });
}

export function useCreateBOM() {
  return useMutation({ mutationFn: mfgApi.createBOM });
}

export function useQualityInspections() {
  return useQuery({
    queryKey: ["quality-inspections"],
    queryFn: mfgApi.getQualityInspections,
  });
}

export function useCreateQualityInspection() {
  return useMutation({ mutationFn: mfgApi.createQualityInspection });
}

export function useUpdateInspectionStatus() {
  return useMutation({
    mutationFn: ({ id, status, findings }: { id: number; status: string; findings?: string }) =>
      mfgApi.updateInspectionStatus(id, status, findings),
  });
}
