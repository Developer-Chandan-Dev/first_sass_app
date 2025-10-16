'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="adminEmail">Add Admin User</Label>
          <div className="flex gap-2">
            <Input
              id="adminEmail"
              placeholder="admin@example.com"
              className="flex-1"
            />
            <Button size="sm">Add</Button>
          </div>
        </div>

        <div>
          <Label>Current Admins</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">admin@example.com</span>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
