/**
 * Clients API service.
 * Uses mock implementation; swap with api.get when backend is ready.
 * Minimal API for client dropdown in Project form.
 */

export interface Client {
  id: string;
  name: string;
}

const mockClients: Client[] = [
  { id: "C001", name: "PT Bank Mandiri" },
  { id: "C002", name: "PT Pertamina" },
  { id: "C003", name: "PT Telkomsel" },
  { id: "C004", name: "Toyota Astra" },
  { id: "C005", name: "Unilever Indonesia" },
];

/**
 * Get all clients.
 * API: GET /clients
 */
export async function getClients(): Promise<Client[]> {
  return Promise.resolve([...mockClients]);
}
