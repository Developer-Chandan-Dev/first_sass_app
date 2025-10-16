'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, LayoutDashboard, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-6">
          {/* 404 Animation */}
          <div className="relative">
            <div className="text-8xl font-bold text-primary/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground animate-pulse" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-3 pt-4">
            {isSignedIn ? (
              <>
                {/* User is logged in - show dashboard option */}
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </>
            ) : (
              <>
                {/* User is not logged in - show home option */}
                <Button asChild className="w-full" size="lg">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/login">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Login to Dashboard
                  </Link>
                </Button>
              </>
            )}

            {/* Go Back Button */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3">
              Need help? Try these popular pages:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {isSignedIn ? (
                <>
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="h-auto p-1 text-xs"
                  >
                    <Link href="/dashboard/expenses">Expenses</Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="h-auto p-1 text-xs"
                  >
                    <Link href="/dashboard/expenses/budget">Budgets</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="h-auto p-1 text-xs"
                  >
                    <Link href="/about">About</Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="h-auto p-1 text-xs"
                  >
                    <Link href="/contact">Contact</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
