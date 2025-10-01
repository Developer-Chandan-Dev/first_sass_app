'use client';

import { UsersTable } from '@/components/admin/users/users-table';
import { UserFilters } from '@/components/admin/users/user-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Users Management</h1>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <UserFilters />
      <UsersTable />
    </div>
  );
}