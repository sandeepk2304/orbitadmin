import { useState, useCallback } from 'react';
import type { User, UserStatus } from '../types';
import { storageService } from '../services/storageService';

/**
 * Custom Hook: useUsers
 * 
 * Purpose:
 * Moves all user CRUD and status business logic out of pages/components.
 * Saves state directly into storageService (localStorage).
 * 
 * Usage:
 * ```tsx
 * const { users, addUser, updateUser, deleteUser, toggleStatus } = useUsers();
 * ```
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());

  const refresh = useCallback(() => {
    setUsers(storageService.getUsers());
  }, []);

  const addUser = useCallback((userData: Omit<User, 'id' | 'avatar' | 'spent' | 'orders' | 'joinedDate' | 'country'>) => {
    const currentUsers = storageService.getUsers();
    
    // Seed new user details
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      country: { name: 'United States', flag: '🇺🇸' },
      spent: 0,
      orders: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [...currentUsers, newUser];
    storageService.saveUsers(updated);
    setUsers(updated);
    
    // Add activity log
    const activities = storageService.getActivities();
    storageService.saveActivities([
      {
        id: `a-${Date.now()}`,
        icon: '👤',
        color: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-500',
        text: 'New User Account Created',
        sub: `Created profile for ${newUser.name} as ${newUser.role}.`,
        by: 'Admin',
        time: 'Just now',
      },
      ...activities,
    ]);

    return newUser;
  }, []);

  const updateUser = useCallback((id: string, userData: Partial<User>) => {
    const currentUsers = storageService.getUsers();
    const updated = currentUsers.map((u) => {
      if (u.id === id) {
        return { ...u, ...userData };
      }
      return u;
    });

    storageService.saveUsers(updated);
    setUsers(updated);
  }, []);

  const deleteUser = useCallback((id: string) => {
    const currentUsers = storageService.getUsers();
    const userToDelete = currentUsers.find(u => u.id === id);
    const updated = currentUsers.filter((u) => u.id !== id);
    
    storageService.saveUsers(updated);
    setUsers(updated);

    if (userToDelete) {
      // Add activity log
      const activities = storageService.getActivities();
      storageService.saveActivities([
        {
          id: `a-${Date.now()}`,
          icon: '🗑️',
          color: 'bg-red-100 dark:bg-red-500/15 text-red-500',
          text: 'User Account Deleted',
          sub: `Removed account of ${userToDelete.name}.`,
          by: 'Admin',
          time: 'Just now',
        },
        ...activities,
      ]);
    }
  }, []);

  const toggleStatus = useCallback((id: string) => {
    const currentUsers = storageService.getUsers();
    const updated = currentUsers.map((u) => {
      if (u.id === id) {
        const nextStatus: UserStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    });

    storageService.saveUsers(updated);
    setUsers(updated);
  }, []);

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleStatus,
    refresh,
  };
}
