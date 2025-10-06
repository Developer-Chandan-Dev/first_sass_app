import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock } from 'lucide-react';
import { useAppTranslations } from '@/hooks/useTranslation';

export default function NotificationsPage() {
  const { pages, dashboard } = useAppTranslations();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{pages.notifications.title}</h1>
        <p className="text-muted-foreground">
          {pages.notifications.description}
        </p>
      </div>

      <Card className="text-center py-12">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{pages.notifications.comingSoon}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We&apos;re working on advanced notifications features including expense trends, 
            category insights, and detailed reports.
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