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
  Zap
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Receipt, label: 'Expenses', href: '/dashboard/expenses' },
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
      'bg-card border-r border-border h-screen transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-bold">ExpenseTracker</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn('h-8 w-8 p-0', isCollapsed && 'mx-auto')}
        >
          <ChevronLeft className={cn(
            'h-4 w-4 transition-transform',
            isCollapsed && 'rotate-180'
          )} />
        </Button>
      </div>
      
      <nav className="px-2 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full transition-all',
                isCollapsed ? 'justify-center px-2' : 'justify-start px-3',
                isActive && 'bg-primary/10 text-primary'
              )}
              asChild
            >
              <Link href={item.href} onClick={handleLinkClick}>
                <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}