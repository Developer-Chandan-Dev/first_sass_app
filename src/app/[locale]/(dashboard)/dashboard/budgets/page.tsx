'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock } from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';

export default function BudgetsPage() {
  const { pages, dashboard } = useDashboardTranslations();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{pages.budgets.title}</h1>
        <p className="text-muted-foreground">
          {pages.budgets.description}
        </p>
      </div>

      <Card className="text-center py-12">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{pages.budgets.comingSoon}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {pages.budgets.workingOnFeatures}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{dashboard.expectedRelease}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}