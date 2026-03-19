/**
 * Indonesian Rupiah (IDR) currency formatting utilities.
 */

export const CURRENCY_LOCALE = "id-ID";
export const CURRENCY_CODE = "IDR";

/**
 * Format a number as Indonesian Rupiah.
 * @param value - Numeric value to format
 * @param compact - If true, use compact notation (e.g. "Rp 1,5 jt" instead of "Rp 1.500.000")
 */
export function formatIdr(value: number, compact?: boolean): string {
  const num = Number(value);
  if (Number.isNaN(num)) return "Rp 0";

  if (compact) {
    if (num >= 1e12) return `Rp ${(num / 1e12).toFixed(1)} T`;
    if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(1)} M`;
    if (num >= 1e6) return `Rp ${(num / 1e6).toFixed(1)} jt`;
    if (num >= 1e3) return `Rp ${(num / 1e3).toFixed(1)} rb`;
  }

  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Converts a number into Indonesian words (Terbilang).
 * @param angka - Numeric value to convert
 */
export function terbilang(angka: number): string {
  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  if (angka === 0) return 'Nol';

  const helper = (n: number): string => {
    if (n < 12) {
      return bilangan[n];
    } else if (n < 20) {
      return helper(n - 10) + ' Belas';
    } else if (n < 100) {
      return helper(Math.floor(n / 10)) + ' Puluh ' + helper(n % 10);
    } else if (n < 200) {
      return 'Seratus ' + helper(n - 100);
    } else if (n < 1000) {
      return helper(Math.floor(n / 100)) + ' Ratus ' + helper(n % 100);
    } else if (n < 2000) {
      return 'Seribu ' + helper(n - 1000);
    } else if (n < 1000000) {
      return helper(Math.floor(n / 1000)) + ' Ribu ' + helper(n % 1000);
    } else if (n < 1000000000) {
      return helper(Math.floor(n / 1000000)) + ' Juta ' + helper(n % 1000000);
    } else if (n < 1000000000000) {
      return helper(Math.floor(n / 1000000000)) + ' Miliar ' + helper(n % 1000000000);
    } else if (n < 1000000000000000) {
      return helper(Math.floor(n / 1000000000000)) + ' Triliun ' + helper(n % 1000000000000);
    }
    return '';
  };

  return helper(angka).trim().replace(/\s+/g, ' ');
}
