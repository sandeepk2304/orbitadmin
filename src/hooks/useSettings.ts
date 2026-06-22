import { useState, useCallback } from 'react';
import type { SystemSettings } from '../types';
import { storageService } from '../services/storageService';

/**
 * Custom Hook: useSettings
 * 
 * Purpose:
 * Coordinates reading and updating settings tabs for general site state,
 * profile data, security values, and notification preferences.
 * 
 * Usage:
 * ```tsx
 * const { settings, saveSettingsSection } = useSettings();
 * ```
 */
export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>(() => storageService.getSettings());

  const saveSettingsSection = useCallback(
    <K extends keyof SystemSettings>(section: K, data: SystemSettings[K]) => {
      const currentSettings = storageService.getSettings();
      const updated = {
        ...currentSettings,
        [section]: data,
      };

      storageService.saveSettings(updated);
      setSettings(updated);

      // Add activity log
      const activities = storageService.getActivities();
      storageService.saveActivities([
        {
          id: `a-${Date.now()}`,
          icon: '⚙️',
          color: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-500',
          text: `Settings Updated`,
          sub: `Modified configuration parameters in ${section} settings.`,
          by: 'Admin',
          time: 'Just now',
        },
        ...activities,
      ]);
    },
    []
  );

  return {
    settings,
    saveSettingsSection,
  };
}
