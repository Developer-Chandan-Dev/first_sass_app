'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus, 
  Archive, 
  BarChart3, 
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { BudgetTemplates } from './budget-templates';
import { BudgetStatusManager } from './budget-status-manager';
import { BudgetAnalytics } from './budget-analytics';
import { RunningBudgets } from './running-budgets';
import { type Budget } from '@/lib/redux/expense/budgetSlice';

interface BudgetManagementHubProps {
  budgets: Budget[];
  onCreateBudget: () => void;
  onEditBudget: (budget: Budget) => void;
  onStatusChange: (budgetId: string, status: Budget['status']) => void;
  onSelectTemplate: (template: any) => void;
}

export function BudgetManagementHub({ 
  budgets, 
  onCreateBudget, 
  onEditBudget, 
  onStatusChange,
  onSelectTemplate 
}: BudgetManagementHubProps) {
  const [activeSection, setActiveSection] = useState('templates');

  const sections = [
    {
      id: 'templates',
      title: 'Quick Start',
      icon: Plus,
      description: 'Create budgets from templates',
      component: <BudgetTemplates onSelectTemplate={onSelectTemplate} />
    },
    {
      id: 'management',
      title: 'Budget Management',
      icon: Settings,
      description: 'Manage all budget statuses',
      component: (
        <div className="space-y-6">
          <BudgetStatusManager 
            budgets={budgets}
            onStatusChange={onStatusChange}
            onEditBudget={onEditBudget}
          />
          <RunningBudgets 
            budgets={budgets}
            onToggleBudget={(budgetId, action) => {
              const status = action === 'pause' ? 'paused' : action === 'complete' ? 'completed' : 'running';
              onStatusChange(budgetId, status);
            }}
            onEditBudget={onEditBudget}
            onDeleteBudget={(budgetId) => {
              if (confirm('Delete this budget?')) {
                fetch(`/api/expenses/budget/${budgetId}`, { method: 'DELETE' });
              }
            }}
          />
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      icon: BarChart3,
      description: 'Detailed budget insights',
      component: <BudgetAnalytics />
    },
    {
      id: 'reports',
      title: 'Budget Reports',
      icon: FileText,
      description: 'Generate budget reports',
      component: (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Budget Reports</h3>
            <p className="text-muted-foreground mb-4">
              Generate detailed reports for your budgets
            </p>
            <Button variant="outline">Coming Soon</Button>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'collaboration',
      title: 'Team Budgets',
      icon: Users,
      description: 'Shared budget management',
      component: (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground mb-4">
              Share and collaborate on budgets with your team
            </p>
            <Button variant="outline">Coming Soon</Button>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'automation',
      title: 'Budget Automation',
      icon: Calendar,
      description: 'Automated budget rules',
      component: (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Budget Automation</h3>
            <p className="text-muted-foreground mb-4">
              Set up automated budget creation and management
            </p>
            <Button variant="outline">Coming Soon</Button>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className={`p-2 rounded-lg ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{section.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </p>
                    {isActive && (
                      <Badge variant="default" className="mt-2 text-xs">
                        Active
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
        {sections.find(s => s.id === activeSection)?.component}
      </div>
    </div>
  );
}