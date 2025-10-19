'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Plus,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { BudgetTemplates } from './budget-templates';
import { BudgetAnalytics } from './budget-analytics';
import { BudgetManager } from './budget-manager';
import { ComingSoonFeatures } from './coming-soon-features';
import { type Budget } from '@/lib/redux/expense/budgetSlice';
import { useDashboardTranslations } from '@/hooks/i18n';

interface BudgetTemplate {
  name: string;
  category: string;
  suggestedAmount: number;
  description: string;
  icon?: string;
}

interface BudgetManagementHubProps {
  budgets: Budget[];
  onCreateBudget: () => void;
  onEditBudget: (budget: Budget) => void;
  onStatusChange: (budgetId: string, status: Budget['status']) => void;
  onSelectTemplate: (template: BudgetTemplate) => void;
}

export function BudgetManagementHub({
  budgets,
  onCreateBudget,
  onEditBudget,
  onStatusChange,
  onSelectTemplate,
}: BudgetManagementHubProps) {
  const { expenses } = useDashboardTranslations();
  const [activeSection, setActiveSection] = useState('templates');

  const sections = [
    {
      id: 'templates',
      title: expenses.quickStart || 'Quick Start',
      icon: Plus,
      description:
        expenses.createBudgetsFromTemplates || 'Create budgets from templates',
      component: <BudgetTemplates onSelectTemplate={onSelectTemplate} />,
    },
    {
      id: 'management',
      title: expenses.budgetManagement || 'Budget Management',
      icon: Settings,
      description:
        expenses.manageAllBudgetStatuses || 'Manage all budget statuses',
      component: (
        <BudgetManager
          budgets={budgets}
          onEditBudget={onEditBudget}
          onStatusChange={onStatusChange}
          onCreateBudget={onCreateBudget}
        />
      ),
    },
    {
      id: 'analytics',
      title: expenses.advancedAnalytics || 'Advanced Analytics',
      icon: BarChart3,
      description:
        expenses.detailedBudgetInsights || 'Detailed budget insights',
      component: <BudgetAnalytics />,
    },
    {
      id: 'features',
      title: expenses.comingSoon || 'Coming Soon',
      icon: Calendar,
      description: expenses.upcomingFeatures || 'Upcoming features',
      component: <ComingSoonFeatures />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <Card
              key={section.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActive ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{section.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </p>
                    {isActive && (
                      <Badge variant="default" className="mt-2 text-xs">
                        {expenses.active || 'Active'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="min-h-[400px]">
        {sections.find((s) => s.id === activeSection)?.component}
      </div>
    </div>
  );
}
