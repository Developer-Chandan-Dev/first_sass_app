'use client';

import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { DashboardNavButton } from '@/components/common/dashboard-nav-button';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

export function AdminHeader({ onMenuClick, onToggleCollapse, isCollapsed }: AdminHeaderProps) {
  return (
    <header className="bg-card border-b border-border h-16">
      <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 h-full">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-1 sm:p-2"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1 sm:p-2"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <PanelLeftClose className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          )}
          <h1 className="text-sm sm:text-lg lg:text-xl font-semibold text-foreground truncate">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
          <DashboardNavButton />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}