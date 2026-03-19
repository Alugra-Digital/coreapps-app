/**
 * TanStack Query hooks for Roles API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  RoleCreateInput,
  RoleUpdateInput,
} from "@/access-control/roles/types";
import type { GetRolesPaginatedParams } from "@/api/roles";
import * as rolesApi from "@/api/roles";

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (filters?: GetRolesPaginatedParams) =>
    [...roleKeys.lists(), filters] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: () => rolesApi.getRoles(),
  });
}

export function useRolesPaginated(params?: GetRolesPaginatedParams) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => rolesApi.getRolesPaginated(params),
  });
}

export function useRoleById(id: string | undefined) {
  return useQuery({
    queryKey: roleKeys.detail(id!),
    queryFn: () => rolesApi.getRoleById(id!),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RoleCreateInput) => rolesApi.createRole(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RoleUpdateInput }) =>
      rolesApi.updateRole(id, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}
