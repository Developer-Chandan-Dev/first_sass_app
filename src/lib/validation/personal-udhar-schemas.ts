import { z } from 'zod';

export const personalContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  type: z.enum(['lent', 'borrowed']),
  amount: z.number().positive('Amount must be positive').max(10000000, 'Amount too large'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const personalTransactionSchema = z.object({
  type: z.enum(['lent', 'borrowed', 'payment']),
  amount: z.number().positive('Amount must be positive').max(10000000, 'Amount too large'),
  description: z.string().max(500, 'Description too long').optional(),
  date: z.date().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().max(500, 'Description too long').optional(),
});

export type PersonalContactInput = z.infer<typeof personalContactSchema>;
export type PersonalTransactionInput = z.infer<typeof personalTransactionSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
