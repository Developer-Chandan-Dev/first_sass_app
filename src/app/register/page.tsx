'use client';

import { SignUp, useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                card: 'shadow-none',
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}