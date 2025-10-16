'use client';

import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileTabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface MobileTabsProps {
  items: MobileTabItem[];
  defaultValue: string;
  className?: string;
}

export function MobileTabs({
  items,
  defaultValue,
  className,
}: MobileTabsProps) {
  const { isMobile, mounted } = useMobile();

  if (!mounted) {
    return <div className="animate-pulse h-32 bg-muted rounded" />;
  }

  return (
    <Tabs defaultValue={defaultValue} className={cn('space-y-4', className)}>
      <TabsList
        className={cn(
          'grid w-full h-auto p-1',
          isMobile ? 'grid-cols-3 gap-1' : `grid-cols-${items.length}`
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              'text-xs px-2 py-2',
              isMobile ? 'text-xs' : 'text-sm'
            )}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent key={item.value} value={item.value} className="space-y-4">
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
