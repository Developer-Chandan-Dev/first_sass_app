'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Debtor {
  _id: string;
  name: string;
  phone: string;
  outstanding: number;
}

interface TopDebtorsProps {
  debtors: Debtor[];
}

export function TopDebtors({ debtors }: TopDebtorsProps) {
  const router = useRouter();
  const { udhar } = useDashboardTranslations();

  if (debtors.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            {udhar.shopkeeper.topDebtors}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">{udhar.shopkeeper.noOutstanding}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          {udhar.shopkeeper.topDebtors}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {debtors.map((debtor, idx) => (
          <div key={debtor._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold text-sm">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{debtor.name}</p>
              <p className="text-xs text-muted-foreground truncate">{debtor.phone}</p>
            </div>
            <Badge variant="destructive" className="font-bold">
              ₹{debtor.outstanding.toLocaleString()}
            </Badge>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => window.open(`tel:${debtor.phone}`)}>
                <Phone className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => router.push(`/dashboard/udhar/shopkeeper/${debtor._id}`)}>
                <MessageCircle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
