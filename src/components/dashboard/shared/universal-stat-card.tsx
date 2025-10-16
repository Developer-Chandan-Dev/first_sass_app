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

interface UniversalStatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  description?: string;
  href?: string;
  actions?: StatAction[];
  status?: 'high' | 'medium' | 'low';
  progress?: number;
  extraInfo?: string;
  getLocalizedPath?: (path: string) => string;
  className?: string;
}

export function UniversalStatCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  description,
  href,
  actions = [],
  status = 'medium',
  progress,
  extraInfo,
  getLocalizedPath = (path) => path,
  className,
}: UniversalStatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors: Record<string, string> = {
    high: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20',
    medium:
      'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20',
    low: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20',
  };

  const statusBadgeColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-blue-500',
  };

  const cardContent = (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {title}
          </CardTitle>
          {actions.length > 0 && (
            <Badge
              className={cn(
                'text-xs px-1.5 py-0.5 transition-all',
                statusBadgeColors[status]
              )}
            >
              {status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {progress !== undefined && (
            <ProgressRing
              progress={progress}
              size={20}
              strokeWidth={2}
              className={cn(
                'transition-all duration-300',
                isHovered && 'scale-110'
              )}
            />
          )}
          <Icon
            className={cn(
              'h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 transition-all',
              isHovered && 'scale-110'
            )}
          />
          {href && (
            <ArrowRight
              className={cn(
                'h-3 w-3 text-muted-foreground transition-all duration-300',
                isHovered ? 'opacity-100 translate-x-1' : 'opacity-0'
              )}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div
            className={cn(
              'text-lg sm:text-2xl font-bold truncate transition-all',
              isHovered && href && 'text-primary'
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

        {(change || description) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              {change && (
                <>
                  <div
                    className={cn(
                      'mr-1 h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all',
                      `bg-${trend === 'up' ? 'green' : trend === 'down' ? 'red' : 'blue'}-500`,
                      isHovered && 'animate-pulse'
                    )}
                  />
                  <span className={cn('text-xs', trendColors[trend])}>
                    {change}
                  </span>
                </>
              )}
              {description && (
                <span className={cn('truncate text-xs', change && 'ml-1')}>
                  {description}
                </span>
              )}
            </div>

            {progress !== undefined && progress > 80 && (
              <div className="text-xs text-red-500 font-medium animate-pulse">
                ⚠️ Alert
              </div>
            )}
          </div>
        )}
      </CardContent>
    </>
  );

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        href &&
          'cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1',
        statusColors[status],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {href ? (
        <Link href={getLocalizedPath(href)} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}

      {/* Enhanced Quick Actions */}
      {actions.length > 0 && (
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 bg-background/95 backdrop-blur-sm border-t transition-all duration-300',
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-full'
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
      )}

      {/* Subtle glow effect */}
      {href && (
        <div
          className={cn(
            'absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none',
            isHovered && status === 'high' && 'shadow-red-500/20 shadow-lg',
            isHovered &&
              status === 'medium' &&
              'shadow-yellow-500/20 shadow-lg',
            isHovered && status === 'low' && 'shadow-green-500/20 shadow-lg'
          )}
        />
      )}
    </Card>
  );
}
