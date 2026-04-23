/**
 * Preview Dialog Types
 * Types for the finance preview dialog system
 */

export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'select' | 'url' | 'enum';

export interface PreviewField<T = unknown> {
  key: string | keyof T;
  label: string;
  type: FieldType;
  format?: 'row' | 'column' | 'section';
  options?: { label: string; value: unknown }[];
  enumLabels?: Record<string, string>;
  formatter?: (value: unknown, data?: T) => string;
  condition?: (data: T) => boolean;
}

export interface PreviewSection<T = unknown> {
  title?: string;
  fields: PreviewField<T>[];
  grid?: number;
}

export interface PreviewConfig<T = unknown> {
  sections: PreviewSection<T>[];
  title?: string;
}

export interface UsePreviewFormOptions<T> {
  form: {
    trigger: () => Promise<boolean>;
    getValues: () => T;
    reset: () => void;
  };
  onSubmit: (data: T) => Promise<void> | void;
}

export interface PreviewDialogProps<T = unknown> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title?: string;
  config: PreviewConfig<T>;
  onConfirm: () => void;
  onEdit: () => void;
  isSubmitting: boolean;
}
