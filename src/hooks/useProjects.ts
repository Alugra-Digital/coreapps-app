/**
 * TanStack Query hooks for Projects API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project, ProjectCreateInput, ProjectUpdateInput } from '@/project/types';
import * as projectsApi from '@/api/projects';

export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: (filters?: unknown) => [...projectKeys.lists(), filters] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: string) => [...projectKeys.details(), id] as const,
};

export function useProjects() {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: () => projectsApi.getProjects(),
    });
}

export function useProjectById(id: string | undefined) {
    return useQuery({
        queryKey: projectKeys.detail(id!),
        queryFn: () => projectsApi.getProjectById(id!),
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ProjectCreateInput) => projectsApi.createProject(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: ProjectUpdateInput }) =>
            projectsApi.updateProject(id, input),
        onMutate: async ({ id, input }) => {
            await queryClient.cancelQueries({ queryKey: projectKeys.detail(id) });
            const previousProject = queryClient.getQueryData<Project>(projectKeys.detail(id));

            if (previousProject) {
                queryClient.setQueryData<Project>(projectKeys.detail(id), {
                    ...previousProject,
                    ...input,
                });
            }

            return { previousProject };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousProject) {
                queryClient.setQueryData(projectKeys.detail(id), context.previousProject);
            }
        },
        onSettled: (_data, _error, { id }) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => projectsApi.deleteProject(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: projectKeys.lists() });
            const previousProjects = queryClient.getQueryData<Project[]>(projectKeys.lists());

            if (previousProjects) {
                queryClient.setQueryData<Project[]>(
                    projectKeys.lists(),
                    previousProjects.filter((project) => project.id !== id)
                );
            }

            return { previousProjects };
        },
        onError: (_err, _id, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(projectKeys.lists(), context.previousProjects);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}
