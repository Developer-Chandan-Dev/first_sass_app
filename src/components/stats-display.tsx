'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setStats, setLoading } from '@/lib/redux/statsSlice';

export function StatsDisplay() {
  const dispatch = useAppDispatch();
  const { totalUsers, totalRevenue, totalOrders, loading } = useAppSelector(
    (state) => state.stats
  );

  useEffect(() => {
    const fetchStats = async () => {
      dispatch(setLoading(true));
      // Simulate API call
      setTimeout(() => {
        dispatch(
          setStats({
            totalUsers: 1250,
            totalRevenue: 45600,
            totalOrders: 890,
            loading: false,
          })
        );
      }, 1000);
    };

    fetchStats();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading stats...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}