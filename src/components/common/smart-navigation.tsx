'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface SmartNavigationProps {
  redirectTo?: 'home' | 'dashboard' | 'auto';
  fallback?: string;
}

export function SmartNavigation({ redirectTo = 'auto', fallback = '/' }: SmartNavigationProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const navigate = () => {
      switch (redirectTo) {
        case 'home':
          router.push('/');
          break;
        case 'dashboard':
          if (isSignedIn) {
            router.push('/dashboard');
          } else {
            router.push('/login');
          }
          break;
        case 'auto':
        default:
          if (isSignedIn) {
            router.push('/dashboard');
          } else {
            router.push(fallback);
          }
          break;
      }
    };

    navigate();
  }, [isSignedIn, isLoaded, redirectTo, fallback, router]);

  return null; // This component doesn't render anything
}

// Hook for smart navigation
export function useSmartNavigation() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const navigateHome = () => {
    router.push('/');
  };

  const navigateDashboard = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const navigateAuto = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return {
    isSignedIn,
    isLoaded,
    navigateHome,
    navigateDashboard,
    navigateAuto,
  };
}