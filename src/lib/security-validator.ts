import { z } from 'zod';
import {
  sanitizeString,
  sanitizeNumber,
  isValidObjectId,
} from './input-sanitizer';

// Enhanced validation schemas
export const secureStringSchema = z
  .string()
  .min(1, 'Field is required')
  .transform(sanitizeString)
  .refine((val) => val.length > 0, 'Field cannot be empty after sanitization')
  .refine((val) => val.length <= 1000, 'Field too long');

export const secureNumberSchema = z
  .number()
  .positive('Must be positive')
  .max(999999999, 'Number too large')
  .transform(sanitizeNumber);

export const secureObjectIdSchema = z
  .string()
  .refine(isValidObjectId, 'Invalid ID format');

export const secureEmailSchema = z
  .string()
  .email('Invalid email format')
  .transform(sanitizeString)
  .refine((val) => val.length <= 254, 'Email too long');

export const secureAmountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(999999.99, 'Amount too large')
  .multipleOf(0.01, 'Invalid decimal precision');

// Server-side validation for expense data
export const expenseValidationSchema = z.object({
  amount: secureAmountSchema,
  category: secureStringSchema.refine(
    (val) => val.length <= 100,
    'Category too long'
  ),
  reason: secureStringSchema.refine(
    (val) => val.length <= 500,
    'Description too long'
  ),
  date: z
    .string()
    .refine((val) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateRegex.test(val) || !isNaN(Date.parse(val));
    }, 'Invalid date format')
    .optional(),
  type: z.enum(['free', 'budget']),
  budgetId: secureObjectIdSchema.optional(),
  incomeId: secureObjectIdSchema.optional(),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  affectsBalance: z.boolean().default(false),
});

// Server-side validation for income data
export const incomeValidationSchema = z.object({
  amount: secureAmountSchema,
  source: secureStringSchema.refine(
    (val) => val.length <= 200,
    'Source too long'
  ),
  category: secureStringSchema.refine(
    (val) => val.length <= 100,
    'Category too long'
  ),
  description: secureStringSchema.refine(
    (val) => val.length <= 1000,
    'Description too long'
  ),
  date: z
    .string()
    .refine((val) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateRegex.test(val) || !isNaN(Date.parse(val));
    }, 'Invalid date format')
    .optional(),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  isConnected: z.boolean().default(false),
});

// Validate and sanitize request body
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation failed: ${error.issues.map((e: z.ZodIssue) => e.message).join(', ')}`
      );
    }
    throw new Error('Invalid request data');
  }
}

// Security headers validation
export function validateSecurityHeaders(request: Request): boolean {
  const contentType = request.headers.get('content-type');
  const userAgent = request.headers.get('user-agent');

  // Block requests without proper content type for POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (!contentType || !contentType.includes('application/json')) {
      return false;
    }
  }

  // Block suspicious user agents
  if (!userAgent || userAgent.length < 10 || userAgent.length > 500) {
    return false;
  }

  // Block common attack patterns in user agent
  const suspiciousPatterns = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'zap',
    'burp',
    'python-requests',
    'curl/7.',
    'wget/',
    'libwww',
  ];

  const lowerUserAgent = userAgent.toLowerCase();
  if (suspiciousPatterns.some((pattern) => lowerUserAgent.includes(pattern))) {
    return false;
  }

  return true;
}
