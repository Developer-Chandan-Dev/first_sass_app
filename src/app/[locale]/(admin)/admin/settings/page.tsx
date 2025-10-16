'use client';

import { AdminSettings } from '@/components/admin/settings/admin-settings';
import { PlatformSettings } from '@/components/admin/settings/platform-settings';
import { SecuritySettings } from '@/components/admin/settings/security-settings';

export default function SettingsPage() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <AdminSettings />
        <PlatformSettings />
      </div>

      <SecuritySettings />
    </div>
  );
}
