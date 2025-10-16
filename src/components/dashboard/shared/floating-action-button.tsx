'use client';

import { useState } from 'react';
import { Plus, Receipt, DollarSign, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useLocale } from '@/contexts/locale-context';
import { useDashboardTranslations } from '@/hooks/i18n';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  className?: string;
}

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  color: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getLocalizedPath } = useLocale();
  const { dashboard, expenses } = useDashboardTranslations();

  const quickActions: QuickAction[] = [
    {
      icon: Plus,
      label: dashboard?.addExpense || 'Add Expense',
      href: '/dashboard/expenses/free',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: DollarSign,
      label: dashboard?.addIncome || 'Add Income',
      href: '/dashboard/income',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: Receipt,
      label: 'View Expenses',
      href: '/dashboard/expenses',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Target,
      label: 'Budget Expense',
      href: '/dashboard/expenses/budget',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  const handleActionClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Actions Menu */}
      {isOpen && (
        <Card
          className={cn(
            'fixed bottom-24 right-4 z-50 w-64 shadow-xl transition-all duration-200',
            'md:bottom-6 md:right-20'
          )}
        >
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.href}
                    asChild
                    variant="ghost"
                    className="w-full justify-start h-12 px-3"
                    onClick={handleActionClick}
                  >
                    <Link href={getLocalizedPath(action.href)}>
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                          action.color
                        )}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">
                        {action.label}
                      </span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAB Button */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all',
          'bottom-20 right-4 md:bottom-6 md:right-6',
          'bg-primary hover:bg-primary/90',
          isOpen && 'rotate-45',
          className
        )}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Quick Actions</span>
      </Button>
    </>
  );
}
