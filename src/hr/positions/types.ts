export interface Position {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PositionCreateInput = Omit<Position, "id" | "createdAt" | "updatedAt">;
export type PositionUpdateInput = Partial<PositionCreateInput>;
