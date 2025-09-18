'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SmartNavigationButtonProps {
  signedInText: string;
  signedOutText: string;
  signedInHref: string;
  signedOutHref: string;
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function SmartNavigationButton({
  signedInText,
  signedOutText,
  signedInHref,
  signedOutHref,
  children,
  className,
  size = 'default',
  variant = 'default'
}: SmartNavigationButtonProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Button size={size} variant={variant} className={className} disabled>
        Loading...
      </Button>
    );
  }

  return (
    <Button size={size} variant={variant} className={className} asChild>
      <Link href={isSignedIn ? signedInHref : signedOutHref}>
        {isSignedIn ? signedInText : signedOutText}
        {children}
      </Link>
    </Button>
  );
}