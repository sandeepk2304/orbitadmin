import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, FolderKanban, CheckSquare, 
  BarChart2, Bell, Settings as SettingsIcon, Menu, LogOut, Search 
} from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useSettings } from '../hooks/useSettings';
import { useNotifications } from '../hooks/useNotifications';
import OrbitLogo from './OrbitLogo';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/dashboard/users', icon: Users },
  { name: 'Roles & Permissions', path: '/dashboard/roles-permissions', icon: Shield },
  { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Reports', path: '/dashboard/reports', icon: BarChart2 },
  { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon },
];

// '/dashboard' is the index, so it only matches itself: every other page starts with it too.
const isActivePath = (path: string, current: string) =>
  current === path || (path !== '/dashboard' && current.startsWith(`${path}/`));

/**
 * Layout Component
 * 
 * Purpose:
 * Admin shell providing sidebar routing links, responsive mobile drawers,
 * light/dark theme toggle, session user status, notification indicators.
 */
export default function Layout() {
  const location = useLocation();
  // The path the mobile sidebar was opened on. Any navigation, including the back button,
  // changes the path and so closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const sidebarOpen = openedOn === location.pathname;
  const { logout } = useAuth();
  const { settings } = useSettings();
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  const current = NAV_ITEMS.find((item) => isActivePath(item.path, location.pathname));

  useEffect(() => {
    document.title = current ? `${current.name} — OrbitAdmin` : 'OrbitAdmin';
  }, [current]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0d0d14] text-gray-900 dark:text-gray-100 flex font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a27] text-[#8a8a9e] transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col overflow-hidden shrink-0`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/[0.04]">
          <OrbitLogo showText textColor="text-white" />
        </div>

        {/* Sidebar Quick Search */}
        <div className="px-4 mt-5 mb-3">
          <div className="flex items-center bg-[#242435] rounded-lg px-3 py-2 border border-white/5">
            <Search size={16} className="text-[#8a8a9e] mr-2" />
            <input
              type="text"
              placeholder="Quick search..."
              className="bg-transparent border-none text-xs text-white placeholder-[#8a8a9e] focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item === current;
            const count = item.path === '/dashboard/notifications' ? unreadCount : 0;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`mr-3 ${isActive ? 'text-white' : 'text-[#8a8a9e]'}`}
                    size={18}
                  />
                  <span>{item.name}</span>
                </div>
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-indigo-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#f8f9fa] dark:bg-[#0d0d14] transition-colors duration-200">
        <header className="flex items-center justify-between px-8 py-5 bg-white dark:bg-[#1a1a27] border-b border-gray-100 dark:border-white/5 transition-colors duration-200 shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setOpenedOn(location.pathname)}
              className="md:hidden mr-4 p-2 bg-gray-100 dark:bg-[#242435] rounded-lg shadow-sm cursor-pointer"
            >
              <Menu size={20} className="dark:text-white" />
            </button>
            <h2 className="text-xl font-bold tracking-tight text-[#11191f] dark:text-white">
              {current?.name ?? 'Admin Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Light / system / dark — owned by ThemeContext, not this component. */}
            <ThemeToggle />

            {/* Notification alert badge */}
            <Link
              to="/dashboard/notifications"
              className="relative p-2 rounded-lg bg-gray-50 dark:bg-[#242435] text-gray-500 dark:text-[#8a8a9e] hover:text-[#11191f] dark:hover:text-white transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1a27]"></span>
              )}
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/5">
              <Link to="/dashboard/settings" className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-[#11191f] dark:text-white group-hover:text-indigo-500 transition-colors">
                    {settings.profile.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#8a8a9e] font-semibold">
                    Administrator
                  </p>
                </div>
                <img
                  src={settings.profile.avatar || 'https://i.pravatar.cc/150?u=kristina'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10 group-hover:border-indigo-500 transition-colors"
                />
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Sub-view Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Keeps the sidebar and header in place while a screen's chunk loads. */}
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpenedOn(null)}
        />
      )}
    </div>
  );
}
