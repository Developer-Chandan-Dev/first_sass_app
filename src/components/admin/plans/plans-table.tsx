'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Plan {
  _id: string;
  name: string;
  price: number;
  interval: string;
  features: {
    maxExpenses: number;
    maxBudgets: number;
    analytics: boolean;
    export: boolean;
  };
  isActive: boolean;
  userCount?: number;
}

export function PlansTable() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const response = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlans(plans.filter((p) => p._id !== planId));
        toast.success('Plan deleted successfully');
      } else {
        toast.error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete plan');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {plans.map((plan) => (
        <Card key={plan._id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => deletePlan(plan._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Plan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">
                /{plan.interval}
              </span>
              <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Features
              </h4>
              <ul className="text-sm space-y-1">
                <li>• {plan.features.maxExpenses} expenses</li>
                <li>• {plan.features.maxBudgets} budgets</li>
                <li>• Analytics: {plan.features.analytics ? '✓' : '✗'}</li>
                <li>• Export: {plan.features.export ? '✓' : '✗'}</li>
              </ul>
            </div>

            {/* User Count */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{plan.userCount} users</span>
              </div>
              <Button variant="outline" size="sm">
                View Users
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
