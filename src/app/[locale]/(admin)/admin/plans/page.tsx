'use client';

import { useState } from 'react';
import { PlansTable } from '@/components/admin/plans/plans-table';
import { PlanFormModal } from '@/components/admin/plans/plan-form-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PlansPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePlanCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Pricing Plans</h1>
        <Button 
          size="sm" 
          className="w-full sm:w-auto"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>
      
      <PlansTable key={refreshKey} />
      
      <PlanFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handlePlanCreated}
      />
    </div>
  );
}