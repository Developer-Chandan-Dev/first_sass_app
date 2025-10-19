'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface CustomTemplate {
  name: string;
  category: string;
  suggestedAmount: number;
  description: string;
  icon: string;
}

interface CustomTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onSaveTemplate: (template: CustomTemplate) => void;
  existingTemplates: CustomTemplate[];
}

export function CustomTemplateModal({
  open,
  onClose,
  onSaveTemplate,
  existingTemplates,
}: CustomTemplateModalProps) {
  const [templates, setTemplates] =
    useState<CustomTemplate[]>(existingTemplates);
  const [newTemplate, setNewTemplate] = useState<CustomTemplate>({
    name: '',
    category: '',
    suggestedAmount: 0,
    description: '',
    icon: '💰',
  });

  const iconOptions = [
    '💰',
    '🏠',
    '🚗',
    '🍕',
    '🎮',
    '💊',
    '👕',
    '📚',
    '✈️',
    '🎬',
  ];

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.suggestedAmount > 0) {
      const updatedTemplates = [...templates, newTemplate];
      setTemplates(updatedTemplates);
      setNewTemplate({
        name: '',
        category: '',
        suggestedAmount: 0,
        description: '',
        icon: '💰',
      });
    }
  };

  const handleRemoveTemplate = (index: number) => {
    const updatedTemplates = templates.filter((_, i) => i !== index);
    setTemplates(updatedTemplates);
  };

  const handleSave = () => {
    templates.forEach((template) => onSaveTemplate(template));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Budget Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Template */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Add New Template</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                    placeholder="e.g., Monthly Groceries"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newTemplate.category}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        category: e.target.value,
                      })
                    }
                    placeholder="e.g., Food"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Suggested Amount (₹)</Label>
                  <Input
                    type="number"
                    value={newTemplate.suggestedAmount || ''}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        suggestedAmount: Number(e.target.value),
                      })
                    }
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Select
                    value={newTemplate.icon}
                    onValueChange={(value) =>
                      setNewTemplate({ ...newTemplate, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon} {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of this budget category"
                  rows={2}
                />
              </div>

              <Button onClick={handleAddTemplate} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </CardContent>
          </Card>

          {/* Existing Templates */}
          <div className="space-y-3">
            <h3 className="font-medium">Your Custom Templates</h3>
            {templates.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No custom templates yet
              </p>
            ) : (
              templates.map((template, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{template.icon}</span>
                        <div>
                          <h4 className="font-medium text-sm">
                            {template.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {template.category}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatCurrency(template.suggestedAmount)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveTemplate(index)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Templates
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
