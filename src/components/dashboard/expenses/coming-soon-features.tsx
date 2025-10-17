'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText,
  Users,
  Calendar
} from 'lucide-react';

export function ComingSoonFeatures() {
  const features = [
    {
      id: 'reports',
      title: 'Budget Reports',
      icon: FileText,
      description: 'Generate detailed reports',
    },
    {
      id: 'collaboration',
      title: 'Team Budgets',
      icon: Users,
      description: 'Shared budget management',
    },
    {
      id: 'automation',
      title: 'Budget Automation',
      icon: Calendar,
      description: 'Automated budget rules',
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      icon: BarChart3,
      description: 'AI-powered insights',
    }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-4 text-sm">Coming Soon</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs truncate">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {feature.description}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Soon
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}