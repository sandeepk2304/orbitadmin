import { useState, useCallback, useMemo } from 'react';
import type { DashboardMetrics, Activity, User } from '../types';
import { storageService } from '../services/storageService';

/**
 * Custom Hook: useDashboardData
 * 
 * Purpose:
 * Compiles dashboard metrics, chart series, recent activity streams, and 
 * helper actions into a single data loader hook.
 * 
 * Usage:
 * ```tsx
 * const { metrics, activities, recentUsers, refreshDashboard } = useDashboardData();
 * ```
 */
export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(() =>
    storageService.getDashboardMetrics()
  );
  
  const [activities, setActivities] = useState<Activity[]>(() =>
    storageService.getActivities()
  );

  const recentUsers = useMemo((): User[] => {
    const users = storageService.getUsers();
    // Return last 5 added users
    return [...users].slice(-5).reverse();
  }, []);

  const refreshDashboard = useCallback(() => {
    setMetrics(storageService.getDashboardMetrics());
    setActivities(storageService.getActivities());
  }, []);

  return {
    metrics,
    activities,
    recentUsers,
    refreshDashboard,
  };
}
