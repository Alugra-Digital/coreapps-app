/**
 * Preview Form Hook
 * Manages the preview dialog flow for forms
 */

import { useState, useCallback } from 'react';
import type { UsePreviewFormOptions } from './types';

export function usePreviewForm<T>({
  form,
  onSubmit,
}: Omit<UsePreviewFormOptions<T>, 'config'>) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle opening the preview dialog
   * Validates the form before showing preview
   */
  const handlePreview = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      return false;
    }
    const values = form.getValues();
    setPreviewData(values);
    setPreviewOpen(true);
    return true;
  }, [form]);

  /**
   * Handle confirming and submitting the form
   */
  const handleConfirm = useCallback(async () => {
    if (!previewData) return;

    setIsSubmitting(true);
    try {
      await onSubmit(previewData);
      setPreviewOpen(false);
      form.reset();
      return true;
    } catch (error) {
      // Error should be handled by the caller
      console.error('Error submitting form:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [previewData, onSubmit, form]);

  /**
   * Handle going back to edit the form
   */
  const handleEdit = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  /**
   * Handle closing the preview dialog
   */
  const handleClose = useCallback(() => {
    setPreviewOpen(false);
    setPreviewData(null);
  }, []);

  return {
    previewOpen,
    previewData,
    isSubmitting,
    handlePreview,
    handleConfirm,
    handleEdit,
    handleClose,
  };
}
