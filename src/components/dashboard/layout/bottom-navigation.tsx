'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboardTranslations } from '@/hooks/i18n';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/locale-context';
import {
  LayoutDashboard,
  Receipt,
  DollarSign,
  TrendingUp,
  Settings,
  type LucideIcon,
} from 'lucide-react';

interface BottomNavItem {
  icon: LucideIcon;
  labelKey: keyof ReturnType<typeof useDashboardTranslations>['sidebar'];
  href: string;
}

const bottomNavItems: BottomNavItem[] = [
  { icon: LayoutDashboard, labelKey: 'overview', href: '/dashboard' },
  { icon: Receipt, labelKey: 'expenses', href: '/dashboard/expenses' },
  { icon: DollarSign, labelKey: 'income', href: '/dashboard/income' },
  { icon: TrendingUp, labelKey: 'analytics', href: '/dashboard/analytics' },
  { icon: Settings, labelKey: 'settings', href: '/dashboard/settings' },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { sidebar } = useDashboardTranslations();
  const { getLocalizedPath } = useLocale();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
      <div className="grid grid-cols-5 h-16">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={getLocalizedPath(item.href)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">
                {sidebar[item.labelKey]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
