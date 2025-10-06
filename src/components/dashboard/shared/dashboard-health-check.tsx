'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Server
} from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastChecked: Date;
}

export function DashboardHealthCheck() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const runHealthChecks = async () => {
    setLoading(true);
    const checks: HealthCheck[] = [];

    // API Health Check
    try {
      const response = await fetch('/api/expenses/dashboard?type=free', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      checks.push({
        name: 'API Connection',
        status: response.ok ? 'healthy' : 'error',
        message: response.ok ? 'API is responding' : `API returned ${response.status}`,
        lastChecked: new Date()
      });
    } catch {
      checks.push({
        name: 'API Connection',
        status: 'error',
        message: 'Failed to connect to API',
        lastChecked: new Date()
      });
    }

    // Database Health Check (indirect)
    try {
      const response = await fetch('/api/expenses?limit=1', {
        cache: 'no-cache'
      });
      if (response.ok) {
        await response.json(); // Consume response
      }
      checks.push({
        name: 'Database',
        status: response.ok ? 'healthy' : 'error',
        message: response.ok ? 'Database is accessible' : 'Database connection failed',
        lastChecked: new Date()
      });
    } catch {
      checks.push({
        name: 'Database',
        status: 'error',
        message: 'Database health check failed',
        lastChecked: new Date()
      });
    }

    // Local Storage Check
    try {
      const testKey = 'health-check-test';
      localStorage.setItem(testKey, 'test');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      checks.push({
        name: 'Local Storage',
        status: retrieved === 'test' ? 'healthy' : 'warning',
        message: retrieved === 'test' ? 'Local storage is working' : 'Local storage may have issues',
        lastChecked: new Date()
      });
    } catch {
      checks.push({
        name: 'Local Storage',
        status: 'error',
        message: 'Local storage is not available',
        lastChecked: new Date()
      });
    }

    // Network Connectivity
    checks.push({
      name: 'Network',
      status: navigator.onLine ? 'healthy' : 'error',
      message: navigator.onLine ? 'Network connection is active' : 'No network connection',
      lastChecked: new Date()
    });

    setHealthChecks(checks);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    runHealthChecks();
    
    // Set up periodic health checks
    const interval = setInterval(runHealthChecks, 5 * 60 * 1000); // Every 5 minutes
    
    // Listen for network changes
    const handleOnline = () => runHealthChecks();
    const handleOffline = () => runHealthChecks();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusVariant = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return 'default' as const;
      case 'warning':
        return 'secondary' as const;
      case 'error':
        return 'destructive' as const;
    }
  };

  const overallStatus = healthChecks.length === 0 ? 'loading' : 
    healthChecks.some(check => check.status === 'error') ? 'error' :
    healthChecks.some(check => check.status === 'warning') ? 'warning' : 'healthy';

  if (overallStatus === 'healthy') {
    return null; // Don't show when everything is working
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Server className="h-5 w-5" />
            System Status
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={runHealthChecks}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {overallStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Some system components are experiencing issues. This may affect functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {healthChecks.map((check) => (
            <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium text-sm">{check.name}</p>
                  <p className="text-xs text-muted-foreground">{check.message}</p>
                </div>
              </div>
              <Badge variant={getStatusVariant(check.status)} className="text-xs">
                {check.status}
              </Badge>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}