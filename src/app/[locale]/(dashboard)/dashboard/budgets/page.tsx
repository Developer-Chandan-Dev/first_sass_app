'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BudgetsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/expenses/budget');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-muted-foreground">Redirecting to budget expenses...</p>
    </div>
  );
}
