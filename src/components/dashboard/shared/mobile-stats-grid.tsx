'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

interface MobileStatsGridProps {
  children: ReactNode;
  className?: string;
}

export function MobileStatsGrid({ children, className }: MobileStatsGridProps) {
  const { isMobile, mounted } = useMobile();

  if (!mounted) {
    return (
      <div className={cn('grid gap-4 grid-cols-2 lg:grid-cols-4', className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-3',
      isMobile 
        ? 'grid-cols-2 gap-3' 
        : 'grid-cols-2 md:grid-cols-4 gap-4',
      className
    )}>
      {children}
    </div>
  );
}