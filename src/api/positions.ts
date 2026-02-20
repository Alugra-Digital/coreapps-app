/**
 * Positions API service.
 * Uses real backend API.
 */

import type {
  Position,
  PositionCreateInput,
  PositionUpdateInput,
} from "@/hr/positions/types";
import { api } from "@/lib/api/client";

export async function getPositions(): Promise<Position[]> {
  return api.get<Position[]>("/api/hr/positions");
}

export async function getPositionById(id: string): Promise<Position | null> {
  try {
    return await api.get<Position>(`/api/hr/positions/${id}`);
  } catch {
    return null;
  }
}

export async function createPosition(input: PositionCreateInput): Promise<Position> {
  return api.post<Position>("/api/hr/positions", input);
}

export async function updatePosition(
  id: string,
  input: PositionUpdateInput
): Promise<Position | null> {
  try {
    return await api.put<Position>(`/api/hr/positions/${id}`, input);
  } catch {
    return null;
  }
}

export async function deletePosition(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/hr/positions/${id}`);
    return true;
  } catch {
    return false;
  }
}
