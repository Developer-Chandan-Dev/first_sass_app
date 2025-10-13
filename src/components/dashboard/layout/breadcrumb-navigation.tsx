'use client';

import { ChevronRight, Home, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useDashboardTranslations } from '@/hooks/i18n';
import { useLocale as useLocaleContext } from '@/contexts/locale-context';
import { getBreadcrumbConfig, isDynamicSegment, getDynamicSegmentLabel } from '@/lib/breadcrumb-config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

interface BreadcrumbNavigationProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
}

export function BreadcrumbNavigation({ 
  className, 
  showHome = true, 
  maxItems = 4 
}: BreadcrumbNavigationProps) {
  const pathname = usePathname();
  const { dashboard, expenses } = useDashboardTranslations();
  const { getLocalizedPath } = useLocaleContext();

  const breadcrumbs = useMemo(() => {
    // Remove locale prefix and split path
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    
    const items: BreadcrumbItem[] = [];

    // Add home if requested
    if (showHome) {
      items.push({
        label: dashboard.overview || 'Home',
        href: '/',
        isActive: segments.length === 0
      });
    }

    // Build breadcrumb items from path segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Get localized label for segment
      const label = getSegmentLabel(segment, segments, index);
      
      items.push({
        label,
        href: currentPath,
        isActive: isLast
      });
    });

    // Limit items if maxItems is specified
    if (maxItems && items.length > maxItems) {
      const firstItem = items[0];
      const lastItems = items.slice(-maxItems + 1);
      return [firstItem, { label: '...', href: '', isActive: false }, ...lastItems];
    }

    return items;
  }, [pathname, dashboard, showHome, maxItems]);

  function getSegmentLabel(segment: string, segments: string[], index: number): string {
    // Handle dynamic segments first
    if (isDynamicSegment(segment)) {
      return getDynamicSegmentLabel(segment, segments.slice(0, index));
    }

    // Get configuration for the segment
    const config = getBreadcrumbConfig(segment);
    
    // Override with translations where available
    const translationMap: Record<string, string> = {
      'dashboard': dashboard.overview || config.label,
      'expenses': expenses.title || config.label,
      'free': expenses.freeExpenses || config.label,
      'budget': expenses.budgetExpenses || config.label
    };

    return translationMap[segment] || config.label;
  }

  if (breadcrumbs.length <= 1) {
    return null;
  }

  const currentItem = breadcrumbs[breadcrumbs.length - 1];
  const parentItems = breadcrumbs.slice(0, -1);

  return (
    <nav 
      className={cn(
        'flex items-center text-sm text-muted-foreground mb-4',
        className
      )}
      aria-label="Breadcrumb"
    >
      {/* Desktop view */}
      <ol className="hidden sm:flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
            )}
            
            {item.href === '' ? (
              <span className="px-2 py-1 text-muted-foreground/60">
                {item.label}
              </span>
            ) : item.isActive ? (
              <span 
                className="px-2 py-1 font-medium text-foreground bg-muted/50 rounded-md"
                aria-current="page"
              >
                {index === 0 && showHome ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link
                href={getLocalizedPath(item.href)}
                className={cn(
                  'px-2 py-1 rounded-md transition-colors hover:text-foreground hover:bg-muted/50',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
              >
                {index === 0 && showHome ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Mobile view */}
      <div className="flex sm:hidden items-center space-x-2 w-full">
        {parentItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {parentItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    href={getLocalizedPath(item.href)}
                    className="flex items-center w-full"
                  >
                    {index === 0 && showHome ? (
                      <Home className="h-4 w-4 mr-2" />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {parentItems.length > 0 && (
          <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
        )}
        
        <span 
          className="font-medium text-foreground bg-muted/50 rounded-md px-2 py-1 truncate flex-1"
          aria-current="page"
        >
          {currentItem?.label}
        </span>
      </div>
    </nav>
  );
}