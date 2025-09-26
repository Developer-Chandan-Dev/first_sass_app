'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchIncomes } from '@/lib/redux/income/incomeSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Table, TrendingUp } from 'lucide-react';
import { AdvancedIncomeTable } from '@/components/dashboard/incomes/advanced-income-table';
import { AddIncomeModal } from '@/components/dashboard/incomes/add-income-modal';
import { IncomeStats } from '@/components/dashboard/incomes/income-stats';
import { IncomeCharts } from '@/components/dashboard/incomes/income-charts';
import { IncomeFilters } from '@/components/dashboard/incomes/income-filters';



export default function IncomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, currentPage, pageSize } = useSelector(
    (state: RootState) => state.incomes
  );
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchIncomes({ 
      filters, 
      page: currentPage, 
      pageSize 
    }));
  }, [dispatch, filters, currentPage, pageSize]);

  return (
    <div className="space-y-4 p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Income Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Track and manage your income sources
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="text-xs sm:text-sm">
            <Table className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Table</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="text-xs sm:text-sm">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Charts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <IncomeStats />
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <IncomeFilters />
          <AdvancedIncomeTable />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <IncomeCharts />
        </TabsContent>
      </Tabs>

      <AddIncomeModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onIncomeAdded={() => {
          dispatch(fetchIncomes({ filters, page: currentPage, pageSize }));
        }}
      />
    </div>
  );
}