/**
 * Preview Config Builder
 * Helper functions for creating preview configurations
 */

import type { PreviewConfig, PreviewField, PreviewSection } from './types';

/**
 * Create a preview field configuration
 */
export function createField<T>(field: PreviewField<T>): PreviewField<T> {
  return field;
}

/**
 * Create a preview section configuration
 */
export function createSection<T>(section: PreviewSection<T>): PreviewSection<T> {
  return section;
}

/**
 * Create a preview configuration
 */
export function createConfig<T>(config: PreviewConfig<T>): PreviewConfig<T> {
  return config;
}

/**
 * Common field presets
 * Each preset returns an object with a `.condition()` method for conditional rendering
 */
export const fieldPresets = {
  text: <T>(key: string | keyof T, label: string) => {
    const field: PreviewField<T> = {
      key: key as string,
      label,
      type: 'text',
    };
    return {
      ...field,
      condition: (cond: (data: T) => boolean) => ({
        ...field,
        condition: cond,
      }),
    };
  },

  number: <T>(key: string | keyof T, label: string) => {
    const field: PreviewField<T> = {
      key: key as string,
      label,
      type: 'number',
    };
    return {
      ...field,
      condition: (cond: (data: T) => boolean) => ({
        ...field,
        condition: cond,
      }),
    };
  },

  currency: <T>(key: string | keyof T, label: string) => {
    const field: PreviewField<T> = {
      key: key as string,
      label,
      type: 'currency',
    };
    return {
      ...field,
      condition: (cond: (data: T) => boolean) => ({
        ...field,
        condition: cond,
      }),
    };
  },

  date: <T>(key: string | keyof T, label: string) => {
    const field: PreviewField<T> = {
      key: key as string,
      label,
      type: 'date',
    };
    return {
      ...field,
      condition: (cond: (data: T) => boolean) => ({
        ...field,
        condition: cond,
      }),
    };
  },

  boolean: <T>(key: string | keyof T, label: string) => {
    const field: PreviewField<T> = {
      key: key as string,
      label,
      type: 'boolean',
    };
    return {
      ...field,
      condition: (cond: (data: T) => boolean) => ({
        ...field,
        condition: cond,
      }),
    };
  },

  url: <T>(key: string | keyof T, label: string) => {
    const field: PreviewField<T> = {
      key: key as string,
      label,
      type: 'url',
    };
    return {
      ...field,
      condition: (cond: (data: T) => boolean) => ({
        ...field,
        condition: cond,
      }),
    };
  },

  enum: <T>(key: string | keyof T, label: string, enumLabels: Record<string, string>) => {
    const field: PreviewField<T> = {
      key: key as string,
      label,
      type: 'enum',
      enumLabels,
    };
    return {
      ...field,
      condition: (cond: (data: T) => boolean) => ({
        ...field,
        condition: cond,
      }),
    };
  },
};
