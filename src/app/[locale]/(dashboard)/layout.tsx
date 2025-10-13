'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/layout/sidebar';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminNavButton } from '@/components/common/admin-nav-button';
import { LanguageSwitcher } from '@/components/common/language-switcher';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Create user in database on first visit
  useEffect(() => {
    if (isSignedIn && user) {
      fetch('/api/users', { method: 'POST' })
        .catch(console.error);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-background" suppressHydrationWarning>
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        'transition-all duration-300',
        isMobile ? (
          isMobileMenuOpen 
            ? 'fixed inset-y-0 left-0 z-50 translate-x-0' 
            : 'fixed inset-y-0 left-0 z-50 -translate-x-full'
        ) : 'relative'
      )}>
        <Sidebar 
          isCollapsed={isMobile ? false : isCollapsed}
          onToggle={toggleSidebar}
          isMobile={isMobile}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border p-3 sm:p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-1 sm:p-2"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <LanguageSwitcher />
            <AdminNavButton />
            <ThemeToggle />
            {mounted && isLoaded ? (
              <UserButton />
            ) : (
              <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}