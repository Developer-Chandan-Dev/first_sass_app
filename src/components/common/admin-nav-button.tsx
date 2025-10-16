'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';

interface AdminNavButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function AdminNavButton({
  variant = 'outline',
  size = 'sm',
  className,
}: AdminNavButtonProps) {
  const { user } = useUser();

  if (!user?.publicMetadata?.isAdmin) {
    return null;
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href="/admin/dashboard">
        <Shield className="h-4 w-4 lg:mr-2" />
        <span className="max-lg:hidden">Admin Panel</span>
      </Link>
    </Button>
  );
}
