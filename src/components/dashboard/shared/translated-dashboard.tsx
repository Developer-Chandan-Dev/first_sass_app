'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LanguageSwitcher } from '@/components/common/language-switcher';

export function TranslatedDashboard() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.expenses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.addExpense')}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.income')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t('income.addIncome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}