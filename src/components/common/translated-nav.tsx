'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  key: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TranslatedNavProps {
  items: NavItem[];
  className?: string;
}

export function TranslatedNav({ items, className }: TranslatedNavProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className={cn('flex space-x-4', className)}>
      {items.map((item) => {
        const isActive = pathname.includes(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{t(item.key as any)}</span>
          </Link>
        );
      })}
    </nav>
  );
}