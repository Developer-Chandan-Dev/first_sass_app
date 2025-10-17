'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';
import { CustomTemplateModal } from './custom-template-modal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface BudgetTemplate {
  name: string;
  category: string;
  suggestedAmount: number;
  icon: string;
  description: string;
}

interface BudgetTemplatesProps {
  onSelectTemplate: (template: BudgetTemplate) => void;
}

export function BudgetTemplates({ onSelectTemplate }: BudgetTemplatesProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<BudgetTemplate[]>([]);
  const templates: BudgetTemplate[] = [
    {
      name: 'Groceries',
      category: 'Food',
      suggestedAmount: 8000,
      icon: '🛒',
      description: 'Monthly grocery shopping budget',
    },
    {
      name: 'Transportation',
      category: 'Transport',
      suggestedAmount: 4000,
      icon: '🚗',
      description: 'Fuel, public transport, parking',
    },
    {
      name: 'Rent & Utilities',
      category: 'Housing',
      suggestedAmount: 25000,
      icon: '🏠',
      description: 'Monthly housing expenses',
    },
    {
      name: 'Dining Out',
      category: 'Food',
      suggestedAmount: 3000,
      icon: '🍕',
      description: 'Restaurants and takeout',
    },
    {
      name: 'Entertainment',
      category: 'Leisure',
      suggestedAmount: 2000,
      icon: '🎮',
      description: 'Movies, games, subscriptions',
    },
    {
      name: 'Healthcare',
      category: 'Health',
      suggestedAmount: 5000,
      icon: '❤️',
      description: 'Medical expenses and insurance',
    },
  ];

  const allTemplates: BudgetTemplate[] = [...templates, ...customTemplates];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Budget Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Quick start with common budget categories
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCustomModal(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {allTemplates.map((template) => {
            return (
              <div
                key={template.name}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <span className="text-sm">{template.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h4 className="font-medium text-xs sm:text-sm truncate">{template.name}</h4>
                      <Badge variant="secondary" className="text-xs w-fit">
                        {formatCurrency(template.suggestedAmount)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>

    <CustomTemplateModal
      open={showCustomModal}
      onClose={() => setShowCustomModal(false)}
      onSaveTemplate={(template) => {
        setCustomTemplates(prev => [...prev, template]);
      }}
      existingTemplates={customTemplates}
    />
    </>
  );
}