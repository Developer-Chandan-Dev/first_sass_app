'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbNavigation } from './breadcrumb-navigation';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Code, Navigation, Settings, Zap } from 'lucide-react';

export function BreadcrumbShowcase() {
  const { breadcrumbs, currentPage, isHomePage } = useBreadcrumbs({
    showHome: true,
    maxItems: 4
  });

  const features = [
    {
      icon: Navigation,
      title: 'Smart Navigation',
      description: 'Automatically generates breadcrumbs based on current route',
      status: 'Active'
    },
    {
      icon: Settings,
      title: 'Configurable',
      description: 'Customizable labels, icons, and behavior per route',
      status: 'Active'
    },
    {
      icon: Zap,
      title: 'Performance Optimized',
      description: 'Memoized calculations and efficient re-renders',
      status: 'Active'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'TypeScript support with comprehensive configuration',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Breadcrumb Navigation System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Current Breadcrumb Trail:</h4>
            <BreadcrumbNavigation className="bg-muted/50 p-3 rounded-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Current Page:</span>
              <p className="text-muted-foreground">{currentPage}</p>
            </div>
            <div>
              <span className="font-medium">Breadcrumb Count:</span>
              <p className="text-muted-foreground">{breadcrumbs.length}</p>
            </div>
            <div>
              <span className="font-medium">Is Home Page:</span>
              <p className="text-muted-foreground">{isHomePage ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{feature.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Breadcrumb Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-6 text-center text-muted-foreground">
                  {index + 1}.
                </span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {crumb.href || 'current'}
                </code>
                <span className="text-muted-foreground">→</span>
                <span className={crumb.isActive ? 'font-medium' : 'text-muted-foreground'}>
                  {crumb.label}
                </span>
                {crumb.isActive && (
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}