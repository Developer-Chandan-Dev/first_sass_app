'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PlatformSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            defaultValue="Expense Manager"
            placeholder="Site name"
          />
        </div>

        <div>
          <Label htmlFor="maxUsers">Max Users</Label>
          <Input
            id="maxUsers"
            type="number"
            defaultValue="1000"
            placeholder="Maximum users"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="maintenance">Maintenance Mode</Label>
          <Switch id="maintenance" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="registration">Allow Registration</Label>
          <Switch id="registration" defaultChecked />
        </div>

        <Button>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
