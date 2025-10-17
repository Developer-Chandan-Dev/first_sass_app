'use client';

import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title: string;
  onMenuToggle: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function MobileHeader({
  title,
  onMenuToggle,
  showBackButton = false,
  className,
}: MobileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (
      pathname.includes('/expenses/free') ||
      pathname.includes('/expenses/budget')
    ) {
      router.push('/dashboard/expenses');
    } else {
      router.back();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 bg-background border-b lg:hidden',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>
    </div>
  );
}
