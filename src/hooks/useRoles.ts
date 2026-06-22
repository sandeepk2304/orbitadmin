import { useState, useCallback } from 'react';
import type { Role } from '../types';
import { storageService } from '../services/storageService';

/**
 * Custom Hook: useRoles
 * 
 * Purpose:
 * Manages roles CRUD operations and coordinates state changes.
 * 
 * Usage:
 * ```tsx
 * const { roles, addRole, updateRole, deleteRole } = useRoles();
 * ```
 */
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>(() => storageService.getRoles());

  const addRole = useCallback((roleData: Omit<Role, 'id' | 'permissions'>) => {
    const currentRoles = storageService.getRoles();
    const newRole: Role = {
      ...roleData,
      id: `r-${Date.now()}`,
      permissions: ['p-dashboard-view'], // Default base permission
    };

    const updated = [...currentRoles, newRole];
    storageService.saveRoles(updated);
    setRoles(updated);

    // Add activity log
    const activities = storageService.getActivities();
    storageService.saveActivities([
      {
        id: `a-${Date.now()}`,
        icon: '🔑',
        color: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-500',
        text: 'New Role Configured',
        sub: `Created role type "${newRole.name}".`,
        by: 'Admin',
        time: 'Just now',
      },
      ...activities,
    ]);

    return newRole;
  }, []);

  const updateRole = useCallback((id: string, roleData: Partial<Role>) => {
    const currentRoles = storageService.getRoles();
    const updated = currentRoles.map((r) => {
      if (r.id === id) {
        return { ...r, ...roleData };
      }
      return r;
    });

    storageService.saveRoles(updated);
    setRoles(updated);
  }, []);

  const deleteRole = useCallback((id: string) => {
    const currentRoles = storageService.getRoles();
    const roleToDelete = currentRoles.find(r => r.id === id);
    const updated = currentRoles.filter((r) => r.id !== id);

    storageService.saveRoles(updated);
    setRoles(updated);

    if (roleToDelete) {
      // Add activity log
      const activities = storageService.getActivities();
      storageService.saveActivities([
        {
          id: `a-${Date.now()}`,
          icon: '🗑️',
          color: 'bg-red-100 dark:bg-red-500/15 text-red-500',
          text: 'Role Type Removed',
          sub: `Deleted role "${roleToDelete.name}".`,
          by: 'Admin',
          time: 'Just now',
        },
        ...activities,
      ]);
    }
  }, []);

  return {
    roles,
    addRole,
    updateRole,
    deleteRole,
  };
}
