'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Clock } from 'lucide-react';
import { BudgetStatusManager } from './budget-status-manager';
import { RunningBudgets } from './running-budgets';
import { type Budget } from '@/lib/redux/expense/budgetSlice';

interface BudgetManagementTabsProps {
  budgets: Budget[];
  onEditBudget: (budget: Budget) => void;
  onStatusChange: (budgetId: string, status: Budget['status']) => void;
}

export function BudgetManagementTabs({ 
  budgets, 
  onEditBudget, 
  onStatusChange 
}: BudgetManagementTabsProps) {
  const [activeTab, setActiveTab] = useState('status');
  
  const runningBudgetsCount = budgets.filter(b => b.status === 'running').length;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar - Tabs */}
      <div className="lg:w-64 flex-shrink-0">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Button
                variant={activeTab === 'status' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('status')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Budget Status Manager
              </Button>
              <Button
                variant={activeTab === 'running' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('running')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Running Budgets ({runningBudgetsCount})
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Content Area */}
      <div className="flex-1">
        {activeTab === 'status' && (
          <BudgetStatusManager 
            budgets={budgets}
            onStatusChange={onStatusChange}
          />
        )}
        {activeTab === 'running' && (
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
        )}
      </div>
    </div>
  );
}