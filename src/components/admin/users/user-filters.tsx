'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function UserFilters() {
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('all');

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Plan Filter */}
      <Select value={plan} onValueChange={setPlan}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Filter by plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Plans</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </SelectContent>
      </Select>

      {/* Filter Button */}
      <Button variant="outline" size="default" className="w-full sm:w-auto">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
}