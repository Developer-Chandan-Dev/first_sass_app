'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface LoadingWrapperProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  className?: string;
  loadingText?: string;
}

export function LoadingWrapper({
  loading,
  error,
  children,
  skeleton,
  className = '',
  loadingText = 'Loading...'
}: LoadingWrapperProps) {
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    if (skeleton) {
      return <div className={className}>{skeleton}</div>;
    }

    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{loadingText}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <div className={className}>{children}</div>;
}

// Skeleton components for different layouts
export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-40" />
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-48 md:h-64 flex flex-col justify-end space-y-2 p-4">
      <div className="flex items-end justify-between h-full space-x-2">
        {[45, 65, 35, 80, 55, 40, 70].map((height, i) => (
          <div key={i} className="flex flex-col items-center space-y-2 flex-1">
            <Skeleton 
              className="w-full rounded-t"
              style={{ height: `${height}%` }}
            />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}