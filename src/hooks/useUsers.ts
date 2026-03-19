/**
 * TanStack Query hooks for Users API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UserCreateInput,
  UserUpdateInput,
} from "@/access-control/users/types";
import type { GetUsersPaginatedParams } from "@/api/users";
import * as usersApi from "@/api/users";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: GetUsersPaginatedParams) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => usersApi.getUsers(),
  });
}

export function useUsersPaginated(params?: GetUsersPaginatedParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getUsersPaginated(params),
  });
}

export function useUserById(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: () => usersApi.getUserById(id!),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UserCreateInput) => usersApi.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserUpdateInput }) =>
      usersApi.updateUser(id, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
