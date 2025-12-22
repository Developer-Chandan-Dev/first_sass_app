'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileChartWrapperProps {
  title: string;
  children: ReactNode;
  className?: string;
  mobileHeight?: string;
  desktopHeight?: string;
}

export function MobileChartWrapper({
  title,
  children,
  className,
  mobileHeight = 'h-64',
  desktopHeight = 'h-80',
}: MobileChartWrapperProps) {
  const isMobile = useIsMobile();
  const mounted = true;

  if (!mounted) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle
          className={cn('text-base', isMobile ? 'text-sm' : 'text-base')}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className={cn('w-full', isMobile ? mobileHeight : desktopHeight)}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
