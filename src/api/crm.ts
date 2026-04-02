import { api } from "@/lib/api/client";

export interface Lead {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED";
  source?: string;
  notes?: string;
  createdAt?: string;
}

export interface CreateLeadInput {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
  source?: string;
  notes?: string;
}

export interface Opportunity {
  id: number;
  name: string;
  leadId?: number;
  clientId?: number;
  amount: number;
  probability: number;
  stage?: string;
  expectedCloseDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface CreateOpportunityInput {
  name: string;
  leadId?: number;
  clientId?: number;
  amount: number;
  probability: number;
  stage?: string;
  expectedCloseDate?: string;
  notes?: string;
}

async function unwrap<T>(res: { success: boolean; data: T }): Promise<T> {
  return res.data;
}

export async function getLeads(): Promise<Lead[]> {
  const res = await api.get<{ success: boolean; data: Lead[] }>("/api/crm/leads");
  return res.data;
}

export async function getLeadById(id: number): Promise<Lead> {
  const res = await api.get<{ success: boolean; data: Lead }>(`/api/crm/leads/${id}`);
  return res.data;
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const res = await api.post<{ success: boolean; data: Lead }>("/api/crm/leads", input);
  return res.data;
}

export async function updateLead(id: number, input: Partial<CreateLeadInput>): Promise<Lead> {
  const res = await api.patch<{ success: boolean; data: Lead }>(`/api/crm/leads/${id}`, input);
  return res.data;
}

export async function deleteLead(id: number): Promise<void> {
  await api.delete(`/api/crm/leads/${id}`);
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const res = await api.get<{ success: boolean; data: Opportunity[] }>("/api/crm/opportunities");
  return res.data;
}

export async function getOpportunityById(id: number): Promise<Opportunity> {
  const res = await api.get<{ success: boolean; data: Opportunity }>(`/api/crm/opportunities/${id}`);
  return res.data;
}

export async function createOpportunity(input: CreateOpportunityInput): Promise<Opportunity> {
  const res = await api.post<{ success: boolean; data: Opportunity }>("/api/crm/opportunities", input);
  return res.data;
}

export async function updateOpportunity(id: number, input: Partial<CreateOpportunityInput>): Promise<Opportunity> {
  const res = await api.patch<{ success: boolean; data: Opportunity }>(`/api/crm/opportunities/${id}`, input);
  return res.data;
}

export async function deleteOpportunity(id: number): Promise<void> {
  await api.delete(`/api/crm/opportunities/${id}`);
}
