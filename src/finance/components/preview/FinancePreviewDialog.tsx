/**
 * Finance Preview Dialog Component
 * Main dialog component for previewing finance form data before submission
 */

'use client';

import { Eye, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PreviewSection } from './PreviewSection';
import type { PreviewDialogProps } from './types';

export function FinancePreviewDialog<T>({
  open,
  onOpenChange,
  data,
  title,
  config,
  onConfirm,
  onEdit,
  isSubmitting,
}: PreviewDialogProps<T>) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-[#F0F0F0]">
            <Eye className="w-5 h-5 text-[#F5A623]" />
            {title || 'Preview'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {config.sections.map((section, index) => (
            <PreviewSection
              key={index}
              section={section}
              data={data}
            />
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-[#1E1E22]">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            disabled={isSubmitting}
            className="border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22]"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Konfirmasi
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
