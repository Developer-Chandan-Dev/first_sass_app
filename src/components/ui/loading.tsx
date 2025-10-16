'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function Loading({
  size = 'md',
  variant = 'spinner',
  text,
  className,
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      {variant === 'spinner' && (
        <Loader2
          className={cn('animate-spin text-primary', sizeClasses[size])}
        />
      )}

      {variant === 'dots' && (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'animate-bounce rounded-full bg-primary',
                size === 'sm' && 'h-2 w-2',
                size === 'md' && 'h-3 w-3',
                size === 'lg' && 'h-4 w-4',
                size === 'xl' && 'h-6 w-6'
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>
      )}

      {variant === 'pulse' && (
        <div
          className={cn(
            'animate-pulse rounded-full bg-primary/20',
            sizeClasses[size]
          )}
        />
      )}

      {variant === 'skeleton' && (
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {text && (
        <p className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// Inline loading for buttons
export function ButtonLoading({
  size = 'sm',
  className,
}: {
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <Loader2
      className={cn(
        'animate-spin',
        size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
        className
      )}
    />
  );
}

// Loading overlay for containers
export function LoadingOverlay({
  children,
  isLoading,
  text,
  className,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loading text={text} />
        </div>
      )}
    </div>
  );
}

// Skeleton components for different content types
export function SkeletonCard() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              style={{
                animationDelay: `${(rowIndex * cols + colIndex) * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-64 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    </div>
  );
}
