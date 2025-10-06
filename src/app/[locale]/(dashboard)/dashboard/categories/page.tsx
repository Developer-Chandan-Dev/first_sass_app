import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Clock } from 'lucide-react';
import { useAppTranslations } from '@/hooks/useTranslation';

export default function CategoriesPage() {
  const { pages, dashboard } = useAppTranslations();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{pages.categories.title}</h1>
        <p className="text-muted-foreground">
          {pages.categories.description}
        </p>
      </div>

      <Card className="text-center py-12">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{pages.categories.comingSoon}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We&apos;re working on category management features including custom categories, 
            category insights, and spending patterns by category.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{dashboard.expectedRelease}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}