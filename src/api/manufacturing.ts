import { api } from "@/lib/api/client";

export interface WorkOrder {
  id: number;
  woNumber: string;
  bomId: number;
  itemId: number;
  qtyToProduce: string;
  warehouseId?: number;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  plannedStartDate?: string;
  actualStartDate?: string;
  actualFinishDate?: string;
  createdAt?: string;
}

export interface CreateWorkOrderInput {
  bomId: number;
  itemId: number;
  qtyToProduce: number;
  warehouseId?: number;
  plannedStartDate?: string;
}

export interface BOM {
  id: number;
  itemId: number;
  name: string;
  totalCost?: number;
  createdAt?: string;
}

export interface CreateBOMInput {
  itemId: number;
  name: string;
  components: { itemId: number; quantity: number }[];
}

export interface QualityInspection {
  id: number;
  workOrderId?: number;
  status: "PENDING" | "PASSED" | "FAILED";
  findings?: string;
  createdAt?: string;
}

export interface CreateInspectionInput {
  workOrderId?: number;
  status?: string;
}

export async function getWorkOrders(): Promise<WorkOrder[]> {
  const res = await api.get<{ data: WorkOrder[] }>("/api/manufacturing/work-orders");
  return res.data;
}

export async function getWorkOrderById(id: number): Promise<WorkOrder> {
  const res = await api.get<{ data: WorkOrder }>(`/api/manufacturing/work-orders/${id}`);
  return res.data;
}

export async function createWorkOrder(input: CreateWorkOrderInput): Promise<WorkOrder> {
  const res = await api.post<{ data: WorkOrder }>("/api/manufacturing/work-orders", input);
  return res.data;
}

export async function startWorkOrder(id: number): Promise<WorkOrder> {
  const res = await api.post<{ data: WorkOrder }>(`/api/manufacturing/work-orders/${id}/start`, {});
  return res.data;
}

export async function completeWorkOrder(id: number): Promise<WorkOrder> {
  const res = await api.post<{ data: WorkOrder }>(`/api/manufacturing/work-orders/${id}/complete`, {});
  return res.data;
}

export async function getBOMs(): Promise<BOM[]> {
  return api.get<BOM[]>("/api/manufacturing/boms");
}

export async function createBOM(input: CreateBOMInput): Promise<BOM> {
  return api.post<BOM>("/api/manufacturing/boms", input);
}

export async function getBOMTree(id: number): Promise<BOM & { items: unknown[] }> {
  return api.get(`/api/manufacturing/boms/${id}/tree`);
}

export async function getQualityInspections(): Promise<QualityInspection[]> {
  return api.get<QualityInspection[]>("/api/manufacturing/quality-inspections");
}

export async function createQualityInspection(input: CreateInspectionInput): Promise<QualityInspection> {
  return api.post<QualityInspection>("/api/manufacturing/quality-inspections", input);
}

export async function updateInspectionStatus(
  id: number,
  status: string,
  findings?: string
): Promise<QualityInspection> {
  return api.patch<QualityInspection>(`/api/manufacturing/quality-inspections/${id}`, { status, findings });
}
