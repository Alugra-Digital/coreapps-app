/**
 * Project API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/project/types";
import { mockProjects } from "@/project/data";

let projectsStore: Project[] = [...mockProjects];

function computeProfitLoss(income: number, expense: number): number {
  return income - expense;
}

/**
 * Get all projects.
 * API: GET /projects
 */
export async function getProjects(): Promise<Project[]> {
  return Promise.resolve([...projectsStore]);
}

/**
 * Get project by ID.
 * API: GET /projects/:id
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const project = projectsStore.find((p) => p.id === id);
  return Promise.resolve(project ?? null);
}

/**
 * Create project.
 * API: POST /projects
 */
export async function createProject(input: ProjectCreateInput): Promise<Project> {
  const id = `PRJ-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const profitLoss = computeProfitLoss(input.finance.income, input.finance.expense);
  const project: Project = {
    ...input,
    id,
    finance: {
      ...input.finance,
      profitLoss,
    },
    createdAt: now,
    updatedAt: now,
  };
  projectsStore.push(project);
  return Promise.resolve(project);
}

/**
 * Update project.
 * API: PUT /projects/:id
 */
export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<Project | null> {
  const index = projectsStore.findIndex((p) => p.id === id);
  if (index === -1) return Promise.resolve(null);

  const existing = projectsStore[index];
  const merged = { ...existing, ...input };

  if (input.finance) {
    merged.finance = {
      ...existing.finance,
      ...input.finance,
      profitLoss: computeProfitLoss(
        input.finance.income ?? existing.finance.income,
        input.finance.expense ?? existing.finance.expense
      ),
    };
  }

  projectsStore[index] = {
    ...merged,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(projectsStore[index]);
}

/**
 * Delete project.
 * API: DELETE /projects/:id
 */
export async function deleteProject(id: string): Promise<boolean> {
  const index = projectsStore.findIndex((p) => p.id === id);
  if (index === -1) return Promise.resolve(false);
  projectsStore.splice(index, 1);
  return Promise.resolve(true);
}
