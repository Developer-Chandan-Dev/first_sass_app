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

  console.log("User: ", user, 18);
  
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
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
      />
      
      {/* Main Content */}
      <div className={cn('transition-all duration-300', sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')}>
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsed={sidebarCollapsed}
        />
        <main className="p-2 sm:p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}