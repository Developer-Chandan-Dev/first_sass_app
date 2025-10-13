'use client';

import { ReactNode } from 'react';
import { BreadcrumbNavigation } from './breadcrumb-navigation';
import { cn } from '@/lib/utils';

interface BreadcrumbPageWrapperProps {
  children: ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

export function BreadcrumbPageWrapper({ 
  children, 
  className,
  showBreadcrumbs = true 
}: BreadcrumbPageWrapperProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showBreadcrumbs && <BreadcrumbNavigation />}
      {children}
    </div>
  );
}