/**
 * Safely access nested object properties
 */
export function safeGet<T>(obj: unknown, path: string, defaultValue: T): T {
  try {
    if (obj == null) return defaultValue;
    
    const keys = path.split('.');
    let result: unknown = obj;
    
    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue;
      }
      result = (result as Record<string, unknown>)[key];
    }
    
    return result !== undefined ? (result as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely parse numbers
 */
export function safeNumber(value: unknown, defaultValue = 0): number {
  if (value == null) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parse strings
 */
export function safeString(value: unknown, defaultValue = ''): string {
  return value != null ? String(value) : defaultValue;
}

/**
 * Safely parse arrays
 */
export function safeArray<T>(value: unknown, defaultValue: T[] = []): T[] {
  return Array.isArray(value) ? value as T[] : defaultValue;
}

/**
 * Sanitize text for display
 */
export function sanitizeText(text: string): string {
  return text.replace(/[<>\"'&]/g, (match) => {
    const map: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return map[match] || match;
  });
}