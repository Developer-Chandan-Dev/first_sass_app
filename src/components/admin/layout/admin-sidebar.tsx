'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Receipt, 
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Plans', href: '/admin/plans', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Expenses', href: '/admin/expenses', icon: Receipt },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ isOpen, onClose, isCollapsed = false }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-4 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300',
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      )}>
        <div className="flex flex-col flex-grow bg-card border-r border-border overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 py-4 border-b border-border">
            {!isCollapsed && <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>}
            {isCollapsed && <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>}
          </div>
          <nav className="mt-4 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center text-sm font-medium rounded-md transition-colors',
                    isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}