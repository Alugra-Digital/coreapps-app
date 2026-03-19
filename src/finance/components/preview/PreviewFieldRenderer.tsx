/**
 * Preview Field Renderer Component
 * Renders individual fields in the preview dialog
 */

'use client';

import { formatters } from './formatters';
import type { PreviewField } from './types';

interface PreviewFieldRendererProps<T> {
  field: PreviewField<T>;
  data: T;
}

export function PreviewFieldRenderer<T>({ field, data }: PreviewFieldRendererProps<T>) {
  // Check condition if exists
  if (field.condition && !field.condition(data)) {
    return null;
  }

  const value = data[field.key];

  let displayValue: string;

  switch (field.type) {
    case 'currency':
      displayValue = formatters.currency(value as number | string);
      break;
    case 'date':
      displayValue = formatters.date(value as string | Date);
      break;
    case 'number':
      displayValue = formatters.number(value as number | string);
      break;
    case 'boolean':
      displayValue = formatters.boolean(value as boolean);
      break;
    case 'url':
      displayValue = formatters.url(value as string);
      break;
    case 'enum':
      displayValue = formatters.enum(value as string, field.enumLabels);
      break;
    case 'select': {
      const option = field.options?.find(opt => opt.value === value);
      displayValue = option?.label ?? formatters.text(value);
      break;
    }
    default:
      displayValue = field.formatter ? field.formatter(value) : formatters.text(value);
  }

  // Conditional rendering based on format
  if (field.format === 'column') {
    return (
      <div className="space-y-1">
        <div className="text-xs text-[#6B6B75] font-medium uppercase tracking-wider">
          {field.label}
        </div>
        <div className="text-sm text-[#F0F0F0]">
          {displayValue}
        </div>
      </div>
    );
  }

  // Default row format
  return (
    <div className="flex justify-between items-start py-2 border-b border-[#1E1E22] last:border-0">
      <span className="text-sm text-[#6B6B75] font-medium">
        {field.label}
      </span>
      <span className={`text-sm text-right ${field.type === 'currency' ? 'text-[#F0F0F0] font-mono' : 'text-[#F0F0F0]'}`}>
        {displayValue}
      </span>
    </div>
  );
}
