'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';
import { CustomTemplateModal } from './custom-template-modal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';

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
  const { expenses } = useDashboardTranslations();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<BudgetTemplate[]>([]);
  const templates: BudgetTemplate[] = [
    {
      name: expenses.budgetTemplates.templates.groceries.name,
      category: expenses.categories.food,
      suggestedAmount: 8000,
      icon: '🛒',
      description: expenses.budgetTemplates.templates.groceries.description,
    },
    {
      name: expenses.budgetTemplates.templates.transportation.name,
      category: expenses.categories.transport,
      suggestedAmount: 4000,
      icon: '🚗',
      description:
        expenses.budgetTemplates.templates.transportation.description,
    },
    {
      name: expenses.budgetTemplates.templates.rentUtilities.name,
      category: 'Housing',
      suggestedAmount: 25000,
      icon: '🏠',
      description: expenses.budgetTemplates.templates.rentUtilities.description,
    },
    {
      name: expenses.budgetTemplates.templates.diningOut.name,
      category: expenses.categories.food,
      suggestedAmount: 3000,
      icon: '🍕',
      description: expenses.budgetTemplates.templates.diningOut.description,
    },
    {
      name: expenses.budgetTemplates.templates.entertainment.name,
      category: expenses.categories.entertainment,
      suggestedAmount: 2000,
      icon: '🎮',
      description: expenses.budgetTemplates.templates.entertainment.description,
    },
    {
      name: expenses.budgetTemplates.templates.healthcare.name,
      category: expenses.categories.healthcare,
      suggestedAmount: 5000,
      icon: '❤️',
      description: expenses.budgetTemplates.templates.healthcare.description,
    },
  ];

  const allTemplates: BudgetTemplate[] = [...templates, ...customTemplates];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{expenses.budgetTemplates.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {expenses.budgetTemplates.description}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomModal(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {expenses.budgetTemplates.customize}
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
                        <h4 className="font-medium text-xs sm:text-sm truncate">
                          {template.name}
                        </h4>
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
          setCustomTemplates((prev) => [...prev, template]);
        }}
        existingTemplates={customTemplates}
      />
    </>
  );
}
