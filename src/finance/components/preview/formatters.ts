/**
 * Preview Dialog Formatters
 * Formatting utilities for displaying data in preview dialogs
 */

export const formatters = {
  /**
   * Format currency value to Indonesian Rupiah format
   * @param value - The currency value to format
   * @returns Formatted currency string (e.g., "Rp 1.500.000")
   */
  currency: (value: number | string): string => {
    if (!value || value === '0') return '—';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num === 0) return '—';
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  },

  /**
   * Format date to Indonesian locale format
   * @param value - The date string or date object to format
   * @returns Formatted date string (e.g., "13 Maret 2026")
   */
  date: (value: string | Date): string => {
    if (!value) return '—';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return value as string;
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Format number with Indonesian locale
   * @param value - The number to format
   * @returns Formatted number string (e.g., "1.500.000")
   */
  number: (value: number | string): string => {
    if (!value || value === '0' || value === '') return '—';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num === 0) return '—';
    return num.toLocaleString('id-ID');
  },

  /**
   * Format boolean to Yes/No
   * @param value - The boolean value to format
   * @returns "Ya" for true, "Tidak" for false
   */
  boolean: (value: boolean): string => {
    return value ? 'Ya' : 'Tidak';
  },

  /**
   * Format URL to a clickable link label
   * @param value - The URL string
   * @returns Truncated URL or "—"
   */
  url: (value: string): string => {
    if (!value) return '—';
    try {
      const url = new URL(value);
      return url.hostname + url.pathname;
    } catch {
      return value;
    }
  },

  /**
   * Format value as text with fallback
   * @param value - The value to format
   * @returns The value or "—"
   */
  text: (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '—';
    return String(value);
  },

  /**
   * Format enum value using label mapping
   * @param value - The enum value
   * @param labels - The label mapping
   * @returns The label or the value
   */
  enum: (value: string, labels?: Record<string, string>): string => {
    if (!value) return '—';
    return labels?.[value] ?? value;
  },
};
