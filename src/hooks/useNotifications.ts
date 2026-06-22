import { useState, useCallback } from 'react';
import type { Notification } from '../types';
import { storageService } from '../services/storageService';

/**
 * Custom Hook: useNotifications
 * 
 * Purpose:
 * Handles system notification logs, read indicators, and clear operations.
 * 
 * Usage:
 * ```tsx
 * const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();
 * ```
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    storageService.getNotifications()
  );

  const markAsRead = useCallback((id: string) => {
    const current = storageService.getNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    
    storageService.saveNotifications(updated);
    setNotifications(updated);
  }, []);

  const markAllAsRead = useCallback(() => {
    const current = storageService.getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));

    storageService.saveNotifications(updated);
    setNotifications(updated);
  }, []);

  const clearNotification = useCallback((id: string) => {
    const current = storageService.getNotifications();
    const updated = current.filter((n) => n.id !== id);

    storageService.saveNotifications(updated);
    setNotifications(updated);
  }, []);

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };
}
