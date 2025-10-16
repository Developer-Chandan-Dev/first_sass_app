'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            defaultValue="30"
            placeholder="Session timeout"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="twoFactor">Require 2FA</Label>
          <Switch id="twoFactor" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="passwordPolicy">Strong Password Policy</Label>
          <Switch id="passwordPolicy" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="loginAttempts">Limit Login Attempts</Label>
          <Switch id="loginAttempts" defaultChecked />
        </div>

        <Button>Update Security</Button>
      </CardContent>
    </Card>
  );
}
