'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UserButton, useUser } from '@clerk/nextjs';
import { Menu, X, Zap } from 'lucide-react';
import { AdminNavButton } from '../common/admin-nav-button';
import { useLocale } from '@/contexts/locale-context';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { getLocalizedPath } = useLocale();
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TrackWise
            </span>
          </Link>

          {/* Desktop Center Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={getLocalizedPath('/services')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              {t('services')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href={getLocalizedPath('/pricing')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              {t('pricing')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href={getLocalizedPath('/about')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              {t('about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href={getLocalizedPath('/contact')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              {t('contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {!mounted || !isLoaded ? (
              // Show loading state to prevent hydration mismatch
              <div className="flex items-center space-x-3">
                <div className="w-16 h-8 bg-muted animate-pulse rounded"></div>
                <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
              </div>
            ) : isSignedIn ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={getLocalizedPath('/dashboard')}>{tCommon('dashboard')}</Link>
                </Button>
                <AdminNavButton />
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={getLocalizedPath('/login')}>{tCommon('login')}</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Link href={getLocalizedPath('/register')}>{tCommon('register')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="text-foreground p-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <div className="py-4 space-y-3">
              <Link 
                href={getLocalizedPath('/services')} 
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                onClick={() => setIsOpen(false)}
              >
                {t('services')}
              </Link>
              <Link 
                href={getLocalizedPath('/pricing')} 
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                onClick={() => setIsOpen(false)}
              >
                {t('pricing')}
              </Link>
              <Link 
                href={getLocalizedPath('/about')} 
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                href={getLocalizedPath('/contact')} 
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                onClick={() => setIsOpen(false)}
              >
                {t('contact')}
              </Link>
              
              <div className="border-t border-border/50 pt-4 px-4 space-y-3">
                {!mounted || !isLoaded ? (
                  // Show loading state for mobile menu
                  <div className="space-y-2">
                    <div className="w-full h-10 bg-muted animate-pulse rounded"></div>
                    <div className="w-full h-10 bg-muted animate-pulse rounded"></div>
                  </div>
                ) : isSignedIn ? (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50">
                      <Link href={getLocalizedPath('/dashboard')} onClick={() => setIsOpen(false)}>{tCommon('dashboard')}</Link>
                    </Button>
                    <AdminNavButton />
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">Account</span>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button variant="ghost" asChild className="w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50">
                      <Link href={getLocalizedPath('/login')} onClick={() => setIsOpen(false)}>{tCommon('login')}</Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200">
                      <Link href={getLocalizedPath('/register')} onClick={() => setIsOpen(false)}>{tCommon('getStarted')}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}