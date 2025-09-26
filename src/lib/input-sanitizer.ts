/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize string input by removing/escaping dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: unknown): number {
  const num = parseFloat(String(input));
  return isNaN(num) ? 0 : Math.max(0, num);
}

/**
 * Validate ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sanitize object for safe logging (removes sensitive data)
 */
export function sanitizeForLogging(obj: unknown): Record<string, unknown> {
  if (typeof obj !== 'object' || obj === null) return {};
  
  const sanitized = { ...(obj as Record<string, unknown>) };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}