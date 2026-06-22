/**
 * OrbitAdmin Type Definitions
 * 
 * Reusable interfaces and enums for type safety across components and services.
 * Follows SOLID principles and senior-level standards (avoiding 'any').
 */

export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  website?: string;
  role: string;
  status: UserStatus;
  avatar: string;
  country: {
    name: string;
    flag: string;
  };
  spent: number;
  orders: number;
  joinedDate: string;
}

export interface Permission {
  id: string;
  name: string;
  category: 'Users' | 'Roles' | 'Projects' | 'Tasks' | 'Settings' | 'Reports';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number; // 0 to 100
  dueDate: string;
  budget: number;
  members: string[]; // User IDs
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string; // User ID
  projectId: string; // Project ID
  dueDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface GeneralSettings {
  siteName: string;
  supportEmail: string;
  logoUrl: string;
  timezone: string;
}

export interface ProfileSettings {
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  dailySummary: boolean;
}

export interface SystemSettings {
  general: GeneralSettings;
  profile: ProfileSettings;
  security: SecuritySettings;
  notification: NotificationSettings;
}

export interface Activity {
  id: string;
  icon: string;
  color: string;
  text: string;
  sub: string;
  by: string;
  time: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: string;
  revenuePositive: boolean;
  totalUsers: number;
  usersChange: string;
  usersPositive: boolean;
  activeProjects: number;
  projectsChange: string;
  projectsPositive: boolean;
  growthRate: number;
  growthChange: string;
  growthPositive: boolean;
}
