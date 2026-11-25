import type { 
  User, Role, Permission, Project, Task, 
  Notification, SystemSettings, Activity, DashboardMetrics 
} from '../types';
import { withProgress } from '../utils/progress';

// Constants for storage keys
const KEYS = {
  USERS: 'orbit_users',
  ROLES: 'orbit_roles',
  PERMISSIONS: 'orbit_permissions',
  PROJECTS: 'orbit_projects',
  TASKS: 'orbit_tasks',
  SETTINGS: 'orbit_settings',
  NOTIFICATIONS: 'orbit_notifications',
  ACTIVITIES: 'orbit_activities',
};

// Seed Permissions
const DEFAULT_PERMISSIONS: Permission[] = [
  { id: 'p-dashboard-view', name: 'View Dashboard', category: 'Reports', description: 'Allows viewing dashboard metrics and reports' },
  { id: 'p-users-manage', name: 'Manage Users', category: 'Users', description: 'Allows adding, editing, and deleting users' },
  { id: 'p-roles-manage', name: 'Manage Roles', category: 'Roles', description: 'Allows managing roles and changing permission matrix' },
  { id: 'p-projects-manage', name: 'Manage Projects', category: 'Projects', description: 'Allows creating, editing, and deleting projects' },
  { id: 'p-tasks-manage', name: 'Manage Tasks', category: 'Tasks', description: 'Allows creating, editing, assigning, and deleting tasks' },
  { id: 'p-settings-manage', name: 'Manage Settings', category: 'Settings', description: 'Allows changing general, profile, security, and notification settings' },
];

// Seed Roles
const DEFAULT_ROLES: Role[] = [
  { 
    id: 'r-admin', 
    name: 'Administrator', 
    description: 'Full access to all system modules, settings, and user management.', 
    permissions: ['p-dashboard-view', 'p-users-manage', 'p-roles-manage', 'p-projects-manage', 'p-tasks-manage', 'p-settings-manage'] 
  },
  { 
    id: 'r-editor', 
    name: 'Editor', 
    description: 'Can view dashboard, manage projects and tasks, but cannot alter users or settings.', 
    permissions: ['p-dashboard-view', 'p-projects-manage', 'p-tasks-manage'] 
  },
  { 
    id: 'r-viewer', 
    name: 'Viewer', 
    description: 'ReadOnly access to dashboard, reports, projects, and tasks.', 
    permissions: ['p-dashboard-view'] 
  },
];

// Seed Users
const DEFAULT_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Kristina Evans',
    username: 'kristina',
    email: 'kristina@orbitadmin.com',
    phone: '+1 (415) 992-3412',
    website: 'https://orbitadmin.com',
    role: 'Administrator',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    country: { name: 'United States', flag: '🇺🇸' },
    spent: 12500.00,
    orders: 45,
    joinedDate: '2024-01-15',
  },
  {
    id: 'u-2',
    name: 'James Parker',
    username: 'james',
    email: 'james@orbitadmin.com',
    phone: '+44 7700 900123',
    website: 'https://parkerdev.io',
    role: 'Editor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: { name: 'United Kingdom', flag: '🇬🇧' },
    spent: 4800.00,
    orders: 12,
    joinedDate: '2024-02-18',
  },
  {
    id: 'u-3',
    name: 'Sophia Lee',
    username: 'sophia',
    email: 'sophia@orbitadmin.com',
    phone: '+1 (604) 555-0199',
    website: '',
    role: 'Viewer',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    country: { name: 'Canada', flag: '🇨🇦' },
    spent: 0,
    orders: 0,
    joinedDate: '2024-03-01',
  },
  {
    id: 'u-4',
    name: 'Olivia Green',
    username: 'olivia',
    email: 'olivia@orbitadmin.com',
    phone: '+33 6 12 34 56 78',
    website: 'https://oliviagreen.fr',
    role: 'Editor',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: { name: 'France', flag: '🇫🇷' },
    spent: 9200.00,
    orders: 28,
    joinedDate: '2024-04-10',
  },
  {
    id: 'u-5',
    name: 'Marcus Chen',
    username: 'marcus',
    email: 'marcus@orbitadmin.com',
    phone: '+81 90-1234-5678',
    website: '',
    role: 'Viewer',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: { name: 'Japan', flag: '🇯🇵' },
    spent: 1500.00,
    orders: 3,
    joinedDate: '2024-05-02',
  },
];

// Seed Projects. Progress is calculated from the seed tasks on first load.
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'SaaS Platform Redesign',
    description: 'Complete overhaul of the customer-facing SaaS portal with responsive, modern styling and fluid layouts.',
    status: 'Active',
    progress: 0,
    dueDate: '2026-07-15',
    budget: 45000,
    members: ['u-1', 'u-2'],
  },
  {
    id: 'proj-2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android apps connected to our core API service, featuring offline sync and push notifications.',
    status: 'Active',
    progress: 0,
    dueDate: '2026-09-30',
    budget: 85000,
    members: ['u-1', 'u-4'],
  },
  {
    id: 'proj-3',
    name: 'Stripe Billing Integration',
    description: 'Migrate legacy checkout system to Stripe Billing, supporting multi-tier subscriptions and customer portal management.',
    status: 'Completed',
    progress: 0,
    dueDate: '2026-05-30',
    budget: 15000,
    members: ['u-2'],
  },
  {
    id: 'proj-4',
    name: 'Security Audit & Compliance',
    description: 'Prepare codebase for SOC2 compliance, perform comprehensive penetration testing, and fix vulnerability logs.',
    status: 'On Hold',
    progress: 0,
    dueDate: '2026-11-15',
    budget: 30000,
    members: ['u-1', 'u-5'],
  },
];

// Seed Tasks
const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Design Glassmorphism Hero Section',
    description: 'Draft landing page layouts, typography styles, and orbit ring concept animations.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'u-2',
    projectId: 'proj-1',
    dueDate: '2026-06-25',
  },
  {
    id: 't-2',
    title: 'Configure React Hook Form',
    description: 'Implement schema validation for general, security, profile and notification settings using Zod.',
    status: 'In Progress',
    priority: 'Medium',
    assigneeId: 'u-1',
    projectId: 'proj-1',
    dueDate: '2026-06-28',
  },
  {
    id: 't-3',
    title: 'Setup Stripe Webhooks',
    description: 'Develop backend-ready routes to parse and verify incoming checkout events.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'u-2',
    projectId: 'proj-3',
    dueDate: '2026-05-20',
  },
  {
    id: 't-4',
    title: 'Write API Schema Documentation',
    description: 'Prepare schemas for REST API endpoints and integrate OpenAPI / Swagger templates.',
    status: 'Todo',
    priority: 'Low',
    assigneeId: 'u-4',
    projectId: 'proj-2',
    dueDate: '2026-07-10',
  },
  {
    id: 't-5',
    title: 'Audit Session Authentication',
    description: 'Verify security states, cookies, and local session tokens to ensure SOC2 readiness.',
    status: 'Todo',
    priority: 'High',
    assigneeId: 'u-5',
    projectId: 'proj-4',
    dueDate: '2026-07-05',
  },
  {
    id: 't-6',
    title: 'Rebuild Navigation Menu',
    description: 'Move the portal to the new menu and remove the old routes.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'u-1',
    projectId: 'proj-1',
    dueDate: '2026-06-20',
  },
  {
    id: 't-7',
    title: 'Offline Sync Prototype',
    description: 'Queue writes on the device and replay them when the connection returns.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'u-1',
    projectId: 'proj-2',
    dueDate: '2026-08-12',
  },
  {
    id: 't-8',
    title: 'App Icon and Splash Screens',
    description: 'Export icons and launch screens for both stores.',
    status: 'Done',
    priority: 'Low',
    assigneeId: 'u-4',
    projectId: 'proj-2',
    dueDate: '2026-06-30',
  },
  {
    id: 't-9',
    title: 'Customer Portal Handover',
    description: 'Check plan changes and invoices in the Stripe customer portal.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'u-2',
    projectId: 'proj-3',
    dueDate: '2026-05-28',
  },
  {
    id: 't-10',
    title: 'Dependency Review',
    description: 'List outdated packages and plan the upgrades.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'u-1',
    projectId: 'proj-4',
    dueDate: '2026-06-18',
  },
  {
    id: 't-11',
    title: 'Penetration Test Scope',
    description: 'Agree the scope and dates with the testing team.',
    status: 'Todo',
    priority: 'High',
    assigneeId: 'u-5',
    projectId: 'proj-4',
    dueDate: '2026-09-01',
  },
];

// Seed Notifications
const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    title: 'New User Registered',
    message: 'Sophia Lee joined OrbitAdmin. Configure her role and permissions matrix in Settings.',
    type: 'info',
    read: false,
    createdAt: '10m ago',
  },
  {
    id: 'n-2',
    title: 'Project Completed',
    message: 'Stripe Billing Integration is now marked as Completed. Financial ledgers updated.',
    type: 'success',
    read: false,
    createdAt: '2h ago',
  },
  {
    id: 'n-3',
    title: 'Staging Rate Warning',
    message: 'Rate limits are reaching 92% capacity on the staging environment. Action required.',
    type: 'warning',
    read: true,
    createdAt: '1d ago',
  },
  {
    id: 'n-4',
    title: 'Billing Alert',
    message: 'Annual subscription renewed successfully. Thank you for using OrbitAdmin.',
    type: 'success',
    read: true,
    createdAt: '3d ago',
  },
];

// Seed Activities
const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'a-1',
    icon: '🚀',
    color: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-500',
    text: 'Production Deployment Successful',
    sub: 'Version 2.4.0 deployed successfully to Vercel/AWS staging.',
    by: 'James Parker',
    time: '10m ago',
  },
  {
    id: 'a-2',
    icon: '👤',
    color: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-500',
    text: 'New Role Permissions Applied',
    sub: 'Modified Editor role to allow Project management access.',
    by: 'Kristina Evans',
    time: '1h ago',
  },
  {
    id: 'a-3',
    icon: '📈',
    color: 'bg-amber-100 dark:bg-amber-500/15 text-amber-500',
    text: 'Financial Report Generated',
    sub: 'Q2 revenue metrics aggregated and exported to CSV ledger.',
    by: 'Sophia Lee',
    time: '3h ago',
  },
  {
    id: 'a-4',
    icon: '🛡️',
    color: 'bg-red-100 dark:bg-red-500/15 text-red-500',
    text: 'Security Scan Completed',
    sub: '0 critical vulnerabilities detected in package dependencies.',
    by: 'System Audit',
    time: '1d ago',
  },
];

// Seed Settings
const DEFAULT_SETTINGS: SystemSettings = {
  general: {
    siteName: 'OrbitAdmin',
    supportEmail: 'support@orbitadmin.com',
    logoUrl: '',
    timezone: 'UTC-5',
  },
  profile: {
    fullName: 'Kristina Evans',
    email: 'kristina@orbitadmin.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Operations Director & Administrator at OrbitAdmin SaaS portal.',
  },
  security: {
    twoFactorEnabled: true,
    passwordLastChanged: '2026-05-12',
  },
  notification: {
    emailAlerts: true,
    pushNotifications: true,
    dailySummary: false,
  },
};

/**
 * StorageService Helper
 * 
 * Safely parses and manages localStorage state.
 * Automatically initializes and seeds default data on first load.
 */
class StorageService {
  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;
    
    // Seed Permissions
    if (!localStorage.getItem(KEYS.PERMISSIONS)) {
      this.save(KEYS.PERMISSIONS, DEFAULT_PERMISSIONS);
    }
    
    // Seed Roles
    if (!localStorage.getItem(KEYS.ROLES)) {
      this.save(KEYS.ROLES, DEFAULT_ROLES);
    }

    // Seed Users
    if (!localStorage.getItem(KEYS.USERS)) {
      this.save(KEYS.USERS, DEFAULT_USERS);
    }

    // Seed Projects
    if (!localStorage.getItem(KEYS.PROJECTS)) {
      this.save(KEYS.PROJECTS, withProgress(DEFAULT_PROJECTS, DEFAULT_TASKS));
    }

    // Seed Tasks
    if (!localStorage.getItem(KEYS.TASKS)) {
      this.save(KEYS.TASKS, DEFAULT_TASKS);
    }

    // Seed Notifications
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      this.save(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    }

    // Seed Activities
    if (!localStorage.getItem(KEYS.ACTIVITIES)) {
      this.save(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    }

    // Seed Settings
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      this.save(KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
  }

  private get<T>(key: string): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : ([] as unknown as T);
  }

  private save<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Users CRUD ---
  getUsers(): User[] {
    return this.get<User[]>(KEYS.USERS);
  }

  saveUsers(users: User[]): void {
    this.save(KEYS.USERS, users);
  }

  // --- Roles CRUD ---
  getRoles(): Role[] {
    return this.get<Role[]>(KEYS.ROLES);
  }

  saveRoles(roles: Role[]): void {
    this.save(KEYS.ROLES, roles);
  }

  // --- Permissions CRUD ---
  getPermissions(): Permission[] {
    return this.get<Permission[]>(KEYS.PERMISSIONS);
  }

  savePermissions(permissions: Permission[]): void {
    this.save(KEYS.PERMISSIONS, permissions);
  }

  // --- Projects CRUD ---
  getProjects(): Project[] {
    return this.get<Project[]>(KEYS.PROJECTS);
  }

  saveProjects(projects: Project[]): void {
    this.save(KEYS.PROJECTS, projects);
  }

  // --- Tasks CRUD ---
  getTasks(): Task[] {
    return this.get<Task[]>(KEYS.TASKS);
  }

  saveTasks(tasks: Task[]): void {
    this.save(KEYS.TASKS, tasks);
  }

  // --- Notifications ---
  getNotifications(): Notification[] {
    return this.get<Notification[]>(KEYS.NOTIFICATIONS);
  }

  saveNotifications(notifications: Notification[]): void {
    this.save(KEYS.NOTIFICATIONS, notifications);
  }

  // --- Activities ---
  getActivities(): Activity[] {
    return this.get<Activity[]>(KEYS.ACTIVITIES);
  }

  saveActivities(activities: Activity[]): void {
    this.save(KEYS.ACTIVITIES, activities);
  }

  // --- Settings ---
  getSettings(): SystemSettings {
    const item = localStorage.getItem(KEYS.SETTINGS);
    return item ? JSON.parse(item) : DEFAULT_SETTINGS;
  }

  saveSettings(settings: SystemSettings): void {
    this.save(KEYS.SETTINGS, settings);
  }

  // --- Dashboard Metrics Calculation ---
  getDashboardMetrics(): DashboardMetrics {
    const users = this.getUsers();
    const projects = this.getProjects();
    const activeCount = projects.filter(p => p.status === 'Active').length;

    return {
      totalRevenue: 124890.00,
      revenueChange: '+14.2%',
      revenuePositive: true,
      totalUsers: users.length,
      usersChange: `+${users.filter(u => u.status === 'Active').length} Active`,
      usersPositive: true,
      activeProjects: activeCount,
      projectsChange: `Out of ${projects.length}`,
      projectsPositive: true,
      growthRate: 28.45,
      growthChange: '+4.3%',
      growthPositive: true,
    };
  }
}

export const storageService = new StorageService();
