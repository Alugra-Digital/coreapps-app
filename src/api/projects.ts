/**
 * Project API service.
 * Uses real backend API.
 */

import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/project/types";
import { api } from "@/lib/api/client";

export async function getProjects(): Promise<Project[]> {
  return api.get<Project[]>("/api/finance/projects");
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    return await api.get<Project>(`/api/finance/projects/${id}`);
  } catch {
    return null;
  }
}

export async function createProject(input: ProjectCreateInput): Promise<Project> {
  return api.post<Project>("/api/finance/projects", input);
}

export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<Project | null> {
  try {
    return await api.put<Project>(`/api/finance/projects/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/projects/${id}`);
    return true;
  } catch {
    return false;
  }
}
