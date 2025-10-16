import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  // Remove HTML tags and dangerous characters
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(input: number | string): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) ? 0 : Math.abs(num);
}

/**
 * Validate ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sanitize for logging to prevent log injection
 */
export function sanitizeForLog(input: unknown): string {
  if (typeof input === 'string') {
    return input.replace(/[\r\n\t]/g, ' ').substring(0, 100);
  }
  return String(input).substring(0, 100);
}
