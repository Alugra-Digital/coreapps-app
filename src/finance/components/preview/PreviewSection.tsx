/**
 * Preview Section Component
 * Renders a section of fields in the preview dialog
 */

'use client';

import type { PreviewSection as PreviewSectionType } from './types';
import { PreviewFieldRenderer } from './PreviewFieldRenderer';

interface PreviewSectionProps<T> {
  section: PreviewSectionType<T>;
  data: T;
}

export function PreviewSection<T>({ section, data }: PreviewSectionProps<T>) {
  // Filter fields based on conditions
  const visibleFields = section.fields.filter(field => {
    if (field.condition && !field.condition(data)) {
      return false;
    }
    return true;
  });

  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {section.title && (
        <h3 className="text-base font-bold text-[#F0F0F0] pb-2 border-b border-[#1E1E22]">
          {section.title}
        </h3>
      )}
      <div className={`grid ${section.grid ? `grid-cols-${section.grid}` : 'grid-cols-1 gap-2'}`}>
        {visibleFields.map((field) => (
          <PreviewFieldRenderer
            key={String(field.key)}
            field={field}
            data={data}
          />
        ))}
      </div>
    </div>
  );
}
