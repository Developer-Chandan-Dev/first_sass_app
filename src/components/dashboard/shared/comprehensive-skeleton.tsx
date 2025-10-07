'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Chart and transactions skeleton */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ExpensePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Expense types */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center">
                    <Skeleton className="h-2 w-2 rounded-full mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}