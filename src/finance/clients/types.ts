export interface ClientPic {
  name: string;
  position?: string;
  contact?: string;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  address?: string;
  phone?: string;
  email?: string;
  npwp?: string;
  pic?: ClientPic;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ClientCreateInput = Omit<Client, "id" | "createdAt" | "updatedAt">;
export type ClientUpdateInput = Partial<ClientCreateInput>;
