import { useQuery, useMutation } from "@tanstack/react-query";
import * as crmApi from "@/api/crm";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: crmApi.getLeads,
  });
}

export function useCreateLead() {
  return useMutation({ mutationFn: crmApi.createLead });
}

export function useUpdateLead() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<crmApi.CreateLeadInput> }) =>
      crmApi.updateLead(id, data),
  });
}

export function useDeleteLead() {
  return useMutation({ mutationFn: crmApi.deleteLead });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: crmApi.getOpportunities,
  });
}

export function useCreateOpportunity() {
  return useMutation({ mutationFn: crmApi.createOpportunity });
}

export function useUpdateOpportunity() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<crmApi.CreateOpportunityInput> }) =>
      crmApi.updateOpportunity(id, data),
  });
}

export function useDeleteOpportunity() {
  return useMutation({ mutationFn: crmApi.deleteOpportunity });
}
