import { useState, useEffect, useCallback } from 'react';

interface ChartData {
  period: string;
  income: number;
  expenses: number;
  net: number;
}

interface ChartSummary {
  totalIncome: number;
  totalExpenses: number;
  netTotal: number;
}

interface DashboardChartData {
  data: ChartData[];
  period: string;
  year: number;
  summary: ChartSummary;
}

export function useDashboardChart(period: string = 'monthly', year?: number) {
  const [data, setData] = useState<ChartData[]>([]);
  const [summary, setSummary] = useState<ChartSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netTotal: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ period });
      if (year) params.append('year', year.toString());

      const response = await fetch(`/api/dashboard/chart?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      const result: DashboardChartData = await response.json();
      setData(result.data);
      setSummary(result.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [period, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    summary,
    loading,
    error,
    refetch: fetchData
  };
}