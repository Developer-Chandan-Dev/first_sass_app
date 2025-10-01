'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type TranslationKey = 'dashboard.title' | 'dashboard.expenses' | 'dashboard.income' | 'dashboard.analytics' | 'dashboard.categories' | 'dashboard.budgets' | 'common.cards' | 'dashboard.notifications' | 'dashboard.settings';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Settings, 
  CreditCard,
  PieChart,
  Target,
  Bell,
  ChevronLeft,
  Zap,
  DollarSign,
  type LucideIcon
} from 'lucide-react';

const sidebarItems: Array<{ icon: LucideIcon; labelKey: TranslationKey; href: string }> = [
  { icon: LayoutDashboard, labelKey: 'dashboard.title', href: '/dashboard' },
  { icon: Receipt, labelKey: 'dashboard.expenses', href: '/dashboard/expenses' },
  { icon: DollarSign, labelKey: 'dashboard.income', href: '/dashboard/income' },
  { icon: TrendingUp, labelKey: 'dashboard.analytics', href: '/dashboard/analytics' },
  { icon: PieChart, labelKey: 'dashboard.categories', href: '/dashboard/categories' },
  { icon: Target, labelKey: 'dashboard.budgets', href: '/dashboard/budgets' },
  { icon: CreditCard, labelKey: 'common.cards', href: '/dashboard/cards' },
  { icon: Bell, labelKey: 'dashboard.notifications', href: '/dashboard/notifications' },
  { icon: Settings, labelKey: 'dashboard.settings', href: '/dashboard/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, isMobile, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;

  const handleLinkClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div className={cn(
      'bg-card border-r border-border h-screen transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-16' : 'w-64',
      isMobile && 'w-64' // Always full width on mobile
    )}>
      <div className="p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 min-w-0">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold truncate">TrackWise</h2>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn('h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0', isCollapsed && 'mx-auto')}
          >
            <ChevronLeft className={cn(
              'h-3 w-3 sm:h-4 sm:w-4 transition-transform',
              isCollapsed && 'rotate-180'
            )} />
          </Button>
        )}
      </div>
      
      <nav className="px-2 space-y-1 flex-1 overflow-y-auto">
        {sidebarItems.map((item) => {
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
              <Link href={`/${locale}${item.href}`} onClick={handleLinkClick}>
                <Icon className={cn('h-4 w-4 flex-shrink-0', !isCollapsed && 'mr-3')} />
                {!isCollapsed && <span className="text-sm truncate">{t(item.labelKey)}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}