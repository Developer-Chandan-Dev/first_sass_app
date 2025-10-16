'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar';
import { AdminHeader } from '@/components/admin/layout/admin-header';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check admin permissions
  useEffect(() => {
    if (isLoaded && (!user || !user.publicMetadata?.isAdmin)) {
      redirect('/dashboard');
    }
  }, [user, isLoaded]);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading admin panel...</div>
      </div>
    );
  }

  if (!user?.publicMetadata?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          isMobile
            ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300'
            : 'relative',
          isMobile && !sidebarOpen && '-translate-x-full'
        )}
      >
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
          onMobileClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-2 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
