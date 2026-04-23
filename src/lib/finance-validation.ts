// coreapps-app/src/lib/finance-validation.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ValidationLine {
  accountNumber: string;
  accountName?: string;
  debit: number;
  credit: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UseFinanceValidationOptions {
  lines: ValidationLine[];
  periodStatus?: string;
  /** true for Kas Kecil — skips the debit=credit balance check */
  singleEntry?: boolean;
  debounceMs?: number;
}

export interface BeValidatePayload {
  periodId?: number;
  /** The voucher/journal code to check for duplicates */
  voucherCode?: string;
  /** Which table to check: KAS_BANK | KAS_KECIL | VOUCHER */
  type?: 'KAS_BANK' | 'KAS_KECIL' | 'VOUCHER';
  /** Record id to exclude from duplicate check (used on edit) */
  excludeId?: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);

export type AccountType =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'revenue'
  | 'expense'
  | 'unknown';

export function getAccountType(accountNumber: string): AccountType {
  const prefix = String(accountNumber).charAt(0);
  if (prefix === '1') return 'asset';
  if (prefix === '2') return 'liability';
  if (prefix === '3') return 'equity';
  if (prefix === '4') return 'revenue';
  if (prefix === '5' || prefix === '6') return 'expense';
  return 'unknown';
}

// ── Pure validation function (no side-effects, safe to call anywhere) ──────────

export function validateJournalEntry(
  lines: ValidationLine[],
  options: { periodStatus?: string; singleEntry?: boolean } = {},
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { periodStatus, singleEntry = false } = options;

  // 1. Closed period
  if (periodStatus === 'CLOSED' || periodStatus === 'LOCKED') {
    errors.push('Periode sudah ditutup, tidak bisa menambah transaksi');
  }

  // 2. Negative amounts
  const hasNegative = lines.some((l) => l.debit < 0 || l.credit < 0);
  if (hasNegative) {
    errors.push('Nominal tidak boleh negatif');
  }

  // 3. All-zero amounts
  const activeLines = lines.filter((l) => l.debit > 0 || l.credit > 0);
  if (lines.length > 0 && activeLines.length === 0) {
    errors.push('Nominal tidak boleh 0');
  }

  // 4. Balance check (skip for single-entry forms like Kas Kecil)
  if (!singleEntry && activeLines.length >= 2) {
    const totalDebit = activeLines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = activeLines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      errors.push(
        `Jurnal tidak balance: total debit ${fmt(totalDebit)} ≠ total kredit ${fmt(totalCredit)}`,
      );
    }
  }

  // 5. Account-type mismatch warnings
  for (const line of activeLines) {
    if (!line.accountNumber) continue;
    const type = getAccountType(line.accountNumber);

    if (type === 'revenue' && line.debit > 0) {
      warnings.push(
        `Akun pendapatan (${line.accountNumber}) didebet — pastikan ini bukan entri normal`,
      );
    }
    if (type === 'expense' && line.credit > 0) {
      warnings.push(
        `Akun biaya (${line.accountNumber}) dikredit — pastikan ini entri koreksi/reversal`,
      );
    }
    if (type === 'equity' && (line.debit > 0 || line.credit > 0)) {
      warnings.push(
        `Akun ekuitas (${line.accountNumber}) digunakan — pastikan ini transaksi modal`,
      );
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ── Toast IDs (stable IDs let sonner update in-place rather than stack) ────────

const ERROR_TOAST_ID = 'finance-val-error';
const WARN_TOAST_ID = 'finance-val-warning';

function applyToasts(result: ValidationResult) {
  if (result.errors.length > 0) {
    toast.error(result.errors[0], {
      id: ERROR_TOAST_ID,
      description:
        result.errors.length > 1
          ? result.errors.slice(1).join(' • ')
          : undefined,
      duration: Infinity,
    });
  } else {
    toast.dismiss(ERROR_TOAST_ID);
  }

  if (result.warnings.length > 0) {
    toast.warning(result.warnings[0], {
      id: WARN_TOAST_ID,
      description:
        result.warnings.length > 1
          ? result.warnings.slice(1).join(' • ')
          : undefined,
      duration: 5000,
    });
  } else {
    toast.dismiss(WARN_TOAST_ID);
  }
}

// ── React hook ─────────────────────────────────────────────────────────────────

export function useFinanceValidation({
  lines,
  periodStatus,
  singleEntry = false,
  debounceMs = 300,
}: UseFinanceValidationOptions) {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    valid: true,
    errors: [],
    warnings: [],
  });

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  // Stable key so we only re-run when lines actually change
  const linesKey = JSON.stringify(lines);

  // Debounced real-time validation
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const result = validateJournalEntry(lines, { periodStatus, singleEntry });
      setValidationResult(result);
      applyToasts(result);
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey, periodStatus, singleEntry, debounceMs]);

  // Dismiss toasts when the form unmounts (dialog closes)
  useEffect(
    () => () => {
      toast.dismiss(ERROR_TOAST_ID);
      toast.dismiss(WARN_TOAST_ID);
    },
    [],
  );

  // Immediate (synchronous) validation — for on-submit interception
  const triggerValidation = useCallback((): ValidationResult => {
    const result = validateJournalEntry(lines, { periodStatus, singleEntry });
    setValidationResult(result);
    return result;
  }, [lines, periodStatus, singleEntry]);

  /**
   * Call this instead of `previewForm.handlePreview()` on the preview button.
   *
   * Flow:
   *   1. Run FE validation synchronously → block + show toasts if errors.
   *   2. If FE valid AND bePayload supplied → call POST /finance/validate.
   *   3. If BE returns errors → block + show toasts.
   *   4. If BE returns only warnings → show warnings, proceed.
   *   5. Call onValid() (opens the preview dialog).
   */
  const handlePreview = useCallback(
    async (onValid: () => void, bePayload?: BeValidatePayload) => {
      const feResult = triggerValidation();
      applyToasts(feResult);
      if (!feResult.valid) return;

      if (bePayload?.periodId) {
        try {
          const beResult = await api.post<{
            valid: boolean;
            errors: string[];
            warnings: string[];
          }>('/finance/validate', bePayload);

          if (!beResult.valid) {
            beResult.errors.forEach((e: string) =>
              toast.error(e, { id: `be-val-${e}`, duration: Infinity }),
            );
            return;
          }
          beResult.warnings?.forEach((w: string) =>
            toast.warning(w, { id: `be-warn-${w}`, duration: 5000 }),
          );
        } catch {
          // BE unreachable — allow FE-validated submit to proceed
        }
      }

      onValid();
    },
    [triggerValidation],
  );

  return {
    validationResult,
    hasErrors: validationResult.errors.length > 0,
    hasWarnings: validationResult.warnings.length > 0,
    triggerValidation,
    handlePreview,
  };
}
