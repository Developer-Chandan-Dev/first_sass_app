'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProgressRing } from './progress-ring';

interface StatAction {
  icon: LucideIcon;
  label: string;
  href: string;
  variant: 'default' | 'outline';
}

interface EnhancedStatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  description: string;
  href: string;
  actions: StatAction[];
  status: 'high' | 'medium' | 'low';
  progress?: number;
  extraInfo?: string;
  getLocalizedPath: (path: string) => string;
}

export function EnhancedStatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  href,
  actions,
  status,
  progress,
  extraInfo,
  getLocalizedPath,
}: EnhancedStatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    high: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20',
    medium:
      'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20',
    low: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20',
  };

  const statusBadgeColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 cursor-pointer',
        'hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1',
        statusColors[status]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={getLocalizedPath(href)} className="block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </CardTitle>
            <Badge
              className={cn(
                'text-xs px-1.5 py-0.5 transition-all',
                statusBadgeColors[status]
              )}
            >
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {progress !== undefined && (
              <ProgressRing
                progress={progress}
                size={24}
                strokeWidth={2}
                className={cn(
                  'transition-all duration-300',
                  isHovered && 'scale-110'
                )}
              />
            )}
            <Icon
              className={cn(
                'h-4 w-4 text-muted-foreground flex-shrink-0 transition-all',
                isHovered && 'scale-110'
              )}
            />
            <ArrowRight
              className={cn(
                'h-3 w-3 text-muted-foreground transition-all duration-300',
                isHovered ? 'opacity-100 translate-x-1' : 'opacity-0'
              )}
            />
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div
              className={cn(
                'text-2xl font-bold truncate transition-all',
                isHovered && 'text-primary'
              )}
              title={value}
            >
              {value}
            </div>
            {extraInfo && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Extra</div>
                <div className="text-sm font-medium">{extraInfo}</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <div
                className={cn(
                  'mr-1 h-3 w-3 rounded-full transition-all',
                  trend === 'up' ? 'bg-green-500' : 'bg-red-500',
                  isHovered && 'animate-pulse'
                )}
              />
              <span className={trendColor}>{change}</span>
              <span className="ml-1 truncate">{description}</span>
            </div>

            {progress !== undefined && progress > 80 && (
              <div className="text-xs text-red-500 font-medium animate-pulse">
                ⚠️ Alert
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Enhanced Quick Actions */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-background/95 backdrop-blur-sm border-t transition-all duration-300',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        )}
      >
        <div className="flex gap-1 p-2">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={index}
                asChild
                size="sm"
                variant={action.variant}
                className={cn(
                  'flex-1 h-8 text-xs transition-all duration-200',
                  'hover:scale-105 hover:shadow-sm'
                )}
              >
                <Link
                  href={getLocalizedPath(action.href)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1"
                >
                  <ActionIcon className="h-3 w-3" />
                  {action.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Subtle glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none',
          isHovered && status === 'high' && 'shadow-red-500/20 shadow-lg',
          isHovered && status === 'medium' && 'shadow-yellow-500/20 shadow-lg',
          isHovered && status === 'low' && 'shadow-green-500/20 shadow-lg'
        )}
      />
    </Card>
  );
}
