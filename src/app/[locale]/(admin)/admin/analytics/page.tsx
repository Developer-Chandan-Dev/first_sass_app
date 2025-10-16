'use client';

import { AnalyticsOverview } from '@/components/admin/analytics/analytics-overview';
import { RevenueAnalytics } from '@/components/admin/analytics/revenue-analytics';
import { UserAnalytics } from '@/components/admin/analytics/user-analytics';

export default function AnalyticsPage() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Analytics</h1>
      </div>

      <AnalyticsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <RevenueAnalytics />
        <UserAnalytics />
      </div>
    </div>
  );
}
