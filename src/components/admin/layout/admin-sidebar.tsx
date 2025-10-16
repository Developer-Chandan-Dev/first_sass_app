'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardTranslations } from '@/hooks/i18n';
import { useLocale } from '@/contexts/locale-context';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

interface NavigationItem {
  labelKey: keyof ReturnType<typeof useDashboardTranslations>['admin'];
  href: string;
  icon: LucideIcon;
}

const navigation: NavigationItem[] = [
  { labelKey: 'dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { labelKey: 'users', href: '/admin/users', icon: Users },
  { labelKey: 'plans', href: '/admin/plans', icon: CreditCard },
  { labelKey: 'analytics', href: '/admin/analytics', icon: BarChart3 },
  { labelKey: 'settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({
  isCollapsed,
  onToggle,
  isMobile,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { admin } = useDashboardTranslations();
  const { getLocalizedPath } = useLocale();

  const handleLinkClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div
      className={cn(
        'bg-card border-r border-border h-screen transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64',
        isMobile && 'w-64'
      )}
    >
      <div className="p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 min-w-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold truncate">
              {admin.dashboard}
            </h2>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              'h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0',
              isCollapsed && 'mx-auto'
            )}
          >
            <ChevronLeft
              className={cn(
                'h-3 w-3 sm:h-4 sm:w-4 transition-transform',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        )}
      </div>

      <nav className="px-2 space-y-1 flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full transition-all h-9 sm:h-10',
                isCollapsed ? 'justify-center px-2' : 'justify-start px-3',
                isActive && 'bg-primary/10 text-primary'
              )}
              asChild
            >
              <Link
                href={getLocalizedPath(item.href)}
                onClick={handleLinkClick}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 flex-shrink-0',
                    !isCollapsed && 'mr-3'
                  )}
                />
                {!isCollapsed && (
                  <span className="text-sm truncate">
                    {admin[item.labelKey]}
                  </span>
                )}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
