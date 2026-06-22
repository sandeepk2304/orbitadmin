import { useState, useCallback } from 'react';
import type { Permission } from '../types';
import { storageService } from '../services/storageService';

/**
 * Custom Hook: usePermissions
 * 
 * Purpose:
 * Manages access to permission descriptions and updating the Role-Permission Matrix.
 * 
 * Usage:
 * ```tsx
 * const { permissions, togglePermissionForRole } = usePermissions();
 * ```
 */
export function usePermissions() {
  const [permissions] = useState<Permission[]>(() => storageService.getPermissions());

  const togglePermissionForRole = useCallback((roleId: string, permissionId: string) => {
    const roles = storageService.getRoles();
    const updated = roles.map((role) => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        const nextPermissions = hasPermission
          ? role.permissions.filter((pid) => pid !== permissionId)
          : [...role.permissions, permissionId];
        return { ...role, permissions: nextPermissions };
      }
      return role;
    });

    storageService.saveRoles(updated);

    // Add activity log
    const activities = storageService.getActivities();
    const targetRole = roles.find(r => r.id === roleId);
    if (targetRole) {
      storageService.saveActivities([
        {
          id: `a-${Date.now()}`,
          icon: '🛡️',
          color: 'bg-amber-100 dark:bg-amber-500/15 text-amber-500',
          text: 'Permission Matrix Updated',
          sub: `Modified permissions matrix for role "${targetRole.name}".`,
          by: 'Admin',
          time: 'Just now',
        },
        ...activities,
      ]);
    }
  }, []);

  return {
    permissions,
    togglePermissionForRole,
  };
}
