'use client';

import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

interface DashboardNavButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function DashboardNavButton({ variant = 'outline', size = 'sm', className }: DashboardNavButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href="/dashboard">
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Dashboard
      </Link>
    </Button>
  );
}