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
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-background">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl sm:text-2xl">Create Account</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 w-full',
                  card: 'shadow-none border-0 p-0 w-full',
                  rootBox: 'w-full',
                  formContainer: 'w-full',
                  form: 'w-full space-y-4',
                  formField: 'w-full',
                  formFieldInput: 'w-full px-3 py-2 text-sm',
                  identityPreview: 'w-full',
                  formResendCodeLink: 'text-sm',
                  footerAction: 'w-full text-center',
                  footerActionLink: 'text-primary hover:text-primary/80',
                }
              }}
              routing="path"
              path="/register"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}