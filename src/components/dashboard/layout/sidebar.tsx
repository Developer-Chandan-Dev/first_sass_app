'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  DollarSign
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Receipt, label: 'Expenses', href: '/dashboard/expenses' },
  { icon: DollarSign, label: 'Income', href: '/dashboard/income' },
  { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: PieChart, label: 'Categories', href: '/dashboard/categories' },
  { icon: Target, label: 'Budgets', href: '/dashboard/budgets' },
  { icon: CreditCard, label: 'Cards', href: '/dashboard/cards' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, isMobile, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

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
              <Link href={item.href} onClick={handleLinkClick}>
                <Icon className={cn('h-4 w-4 flex-shrink-0', !isCollapsed && 'mr-3')} />
                {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}