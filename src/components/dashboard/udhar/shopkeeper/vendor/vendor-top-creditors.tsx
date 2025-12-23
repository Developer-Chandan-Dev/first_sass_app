'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Creditor {
  _id: string;
  name: string;
  phone: string;
  owed: number;
}

interface VendorTopCreditorsProps {
  creditors: Creditor[];
}

export function VendorTopCreditors({ creditors }: VendorTopCreditorsProps) {
  const router = useRouter();

  if (creditors.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Top Creditors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No outstanding balances</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          Top Creditors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {creditors.map((creditor, idx) => (
          <div key={creditor._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-sm">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{creditor.name}</p>
              <p className="text-xs text-muted-foreground truncate">{creditor.phone}</p>
            </div>
            <Badge variant="destructive" className="font-bold">
              ₹{creditor.owed.toLocaleString()}
            </Badge>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => window.open(`tel:${creditor.phone}`)}>
                <Phone className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => router.push(`/dashboard/udhar/shopkeeper/vendor/${creditor._id}`)}>
                <MessageCircle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
