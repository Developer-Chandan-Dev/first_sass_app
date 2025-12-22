'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileTableItem {
  id: string;
  title: string;
  subtitle?: string;
  amount: string;
  category?: string;
  date: string;
  status?: 'success' | 'warning' | 'destructive';
}

interface MobileTableProps {
  items: MobileTableItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
  emptyMessage?: string;
}

export function MobileTable({
  items,
  onEdit,
  onDelete,
  className,
  emptyMessage = 'No items found',
}: MobileTableProps) {
  const isMobile = useIsMobile();
  const mounted = true;

  if (!mounted) {
    return <div className="animate-pulse h-32 bg-muted rounded-lg" />;
  }

  if (!isMobile) {
    return null; // Use regular table on desktop
  }

  if (items.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{item.title}</h4>
                  {item.category && (
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {item.subtitle}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{item.amount}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              </div>

              {(onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(item.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
