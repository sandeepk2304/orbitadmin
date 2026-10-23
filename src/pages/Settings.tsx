import { useState } from 'react';
import { z } from 'zod';
import { useSettings } from '../hooks/useSettings';
import PageHeader from '../components/PageHeader';
import FormBuilder from '../components/FormBuilder';
import type { FormFieldConfig } from '../components/FormBuilder';
import { Layout, User, ShieldAlert, BellRing } from 'lucide-react';

// Zod Schemas for each tab
const generalSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  supportEmail: z.string().email('Provide a valid support email address'),
  timezone: z.string().min(1, 'Select a default timezone'),
});

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Provide a valid personal email'),
  bio: z.string().min(5, 'Bio description must be at least 5 characters'),
});

const securitySchema = z.object({
  twoFactorEnabled: z.boolean(),
});

const notificationSchema = z.object({
  emailAlerts: z.boolean(),
  pushNotifications: z.boolean(),
  dailySummary: z.boolean(),
});

type TabType = 'general' | 'profile' | 'security' | 'notifications';

export default function Settings() {
  const { settings, saveSettingsSection } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Form Field Configurations
  const generalFields: FormFieldConfig[] = [
    { name: 'siteName', label: 'Platform Name', type: 'text', placeholder: 'OrbitAdmin' },
    { name: 'supportEmail', label: 'Support Contact Email', type: 'email', placeholder: 'support@orbitadmin.com' },
    {
      name: 'timezone',
      label: 'System Timezone',
      type: 'select',
      options: [
        { value: 'UTC-5', label: 'UTC-5 (Eastern Time)' },
        { value: 'UTC', label: 'UTC (Greenwich Mean Time)' },
        { value: 'UTC+1', label: 'UTC+1 (Central European Time)' },
        { value: 'UTC+8', label: 'UTC+8 (Singapore/Beijing Time)' },
      ],
    },
  ];

  const profileFields: FormFieldConfig[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Kristina Evans' },
    { name: 'email', label: 'Public Email', type: 'email', placeholder: 'kristina@orbitadmin.com' },
    { name: 'bio', label: 'Profile Bio Description', type: 'textarea', placeholder: 'Operations Director...' },
  ];

  const securityFields: FormFieldConfig[] = [
    {
      name: 'twoFactorEnabled',
      label: 'Two-Factor Authentication (2FA)',
      type: 'checkbox',
      description: 'Require a secure token verification code upon logging into the platform.',
    },
  ];

  const notificationFields: FormFieldConfig[] = [
    {
      name: 'emailAlerts',
      label: 'Enable Email Alerts',
      type: 'checkbox',
      description: 'Receive notifications about logins, payments, and member invites via email.',
    },
    {
      name: 'pushNotifications',
      label: 'Enable Browser Push Notifications',
      type: 'checkbox',
      description: 'Receive live alerts within the browser window in real-time.',
    },
    {
      name: 'dailySummary',
      label: 'Send Daily Activity Summary',
      type: 'checkbox',
      description: 'Get a clean audit summary report sent to your mailbox daily.',
    },
  ];

  // Tab navigation items
  const tabs = [
    { id: 'general' as TabType, name: 'General Settings', icon: Layout },
    { id: 'profile' as TabType, name: 'Profile Information', icon: User },
    { id: 'security' as TabType, name: 'Security & Auth', icon: ShieldAlert },
    { id: 'notifications' as TabType, name: 'Notification Preferences', icon: BellRing },
  ];

  const handleGeneralSubmit = (data: z.infer<typeof generalSchema>) => {
    saveSettingsSection('general', { ...settings.general, ...data });
    alert('General settings updated successfully.');
  };

  const handleProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    saveSettingsSection('profile', { ...settings.profile, ...data });
    alert('Profile updated successfully. Sidebar details refreshed.');
  };

  const handleSecuritySubmit = (data: z.infer<typeof securitySchema>) => {
    saveSettingsSection('security', { ...settings.security, ...data });
    alert('Security settings updated successfully.');
  };

  const handleNotificationSubmit = (data: z.infer<typeof notificationSchema>) => {
    saveSettingsSection('notification', { ...settings.notification, ...data });
    alert('Notification thresholds updated successfully.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure general portal parameters, manage profile details, lock security parameters, and toggle notification channels."
      />

      {/* Tabs Header bar */}
      <div className="flex flex-wrap border-b border-gray-100 dark:border-white/5 gap-2 transition-colors">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-500 font-bold'
                : 'border-transparent text-gray-500 dark:text-[#8a8a9e] hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Form Card body */}
      <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-sm transition-colors max-w-2xl">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white mb-2">
              Platform General Settings
            </h3>
            <FormBuilder
              fields={generalFields}
              validationSchema={generalSchema}
              defaultValues={{
                siteName: settings.general.siteName,
                supportEmail: settings.general.supportEmail,
                timezone: settings.general.timezone,
              }}
              onSubmit={handleGeneralSubmit}
              submitText="Save Parameters"
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white mb-2">
              Super Admin Profile Details
            </h3>
            <FormBuilder
              fields={profileFields}
              validationSchema={profileSchema}
              defaultValues={{
                fullName: settings.profile.fullName,
                email: settings.profile.email,
                bio: settings.profile.bio,
              }}
              onSubmit={handleProfileSubmit}
              submitText="Update Profile"
            />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white mb-2">
              Security Verification Thresholds
            </h3>
            
            <FormBuilder
              fields={securityFields}
              validationSchema={securitySchema}
              defaultValues={{
                twoFactorEnabled: settings.security.twoFactorEnabled,
              }}
              onSubmit={handleSecuritySubmit}
              submitText="Save Security"
            />
            
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-6 text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold space-y-1">
              <p>Password Last Changed: <span className="text-[#11191f] dark:text-white">{settings.security.passwordLastChanged}</span></p>
              <p>Platform Authentication Scheme: <span className="text-[#11191f] dark:text-white">JWT Bearer Cookie</span></p>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white mb-2">
              Alert Subscriptions & Channels
            </h3>
            <FormBuilder
              fields={notificationFields}
              validationSchema={notificationSchema}
              defaultValues={{
                emailAlerts: settings.notification.emailAlerts,
                pushNotifications: settings.notification.pushNotifications,
                dailySummary: settings.notification.dailySummary,
              }}
              onSubmit={handleNotificationSubmit}
              submitText="Save Thresholds"
            />
          </div>
        )}
      </div>

    </div>
  );
}
