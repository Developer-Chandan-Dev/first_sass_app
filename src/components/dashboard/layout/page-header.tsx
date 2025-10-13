'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BreadcrumbNavigation } from './breadcrumb-navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  children,
  className,
  showBreadcrumbs = true,
  badge,
  actions
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showBreadcrumbs && <BreadcrumbNavigation />}
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {badge && (
              <Badge variant={badge.variant || 'secondary'}>
                {badge.text}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
}