import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export function rateLimit(config: RateLimitConfig) {
  return (req: NextRequest): { success: boolean; remaining: number; resetTime: number } => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();
    
    // Clean expired entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k];
      }
    });
    
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      };
      return { success: true, remaining: config.maxRequests - 1, resetTime: store[key].resetTime };
    }
    
    if (store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      };
      return { success: true, remaining: config.maxRequests - 1, resetTime: store[key].resetTime };
    }
    
    store[key].count++;
    
    if (store[key].count > config.maxRequests) {
      return { success: false, remaining: 0, resetTime: store[key].resetTime };
    }
    
    return { success: true, remaining: config.maxRequests - store[key].count, resetTime: store[key].resetTime };
  };
}

// Predefined rate limiters
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5
});

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10
});