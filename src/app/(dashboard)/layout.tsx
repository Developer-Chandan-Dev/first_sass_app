'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/layout/sidebar';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 bg-card border-r border-border" />
        <div className="flex-1 flex flex-col">
          <header className="bg-card border-b border-border p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-background">
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
        <header className="bg-card border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}