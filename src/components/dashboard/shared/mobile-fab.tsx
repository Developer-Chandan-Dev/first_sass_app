'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFABProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function MobileFAB({
  onClick,
  label = 'Add',
  className,
}: MobileFABProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        'fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg',
        'hover:scale-105 transition-transform',
        className
      )}
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
