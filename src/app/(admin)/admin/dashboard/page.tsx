'use client';

import { OverviewStats } from '@/components/admin/dashboard/overview-stats';
import { RevenueChart } from '@/components/admin/dashboard/revenue-chart';
import { UserGrowthChart } from '@/components/admin/dashboard/user-growth-chart';
import { RecentActivity } from '@/components/admin/dashboard/recent-activity';

export default function AdminDashboard() {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0">
          Welcome to the admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <OverviewStats />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <RevenueChart />
        <UserGrowthChart />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}