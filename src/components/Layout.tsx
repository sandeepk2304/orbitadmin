import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, CreditCard, Users, BarChart2, PieChart, Bell, Menu, Search, Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
    { name: 'Statistic', path: '/statistics', icon: PieChart },
  ];

  useEffect(() => {
    const p = location.pathname;
    if (p === '/') { document.title = 'Dashboard — MetoAdmin'; return; }
    const match = navItems.find(item =>
      item.path === '/orders' ? p.startsWith('/data') : p === item.path || p.startsWith(item.path + '/')
    );
    document.title = match ? `${match.name} — MetoAdmin` : 'MetoAdmin';
  }, [location.pathname]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0d0d14] text-gray-900 dark:text-gray-100 flex font-sans transition-colors">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a27] text-[#8a8a9e] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col overflow-hidden`}>
        <div className="p-6 flex items-center space-x-3 text-white">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold tracking-wide">MetoAdmin</span>
        </div>

        {/* Sidebar Search */}
        <div className="px-4 mb-4">
          <div className="flex items-center bg-[#242435] rounded-lg px-3 py-2 border border-white/5">
            <Search size={16} className="text-[#8a8a9e] mr-2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none text-sm text-white placeholder-[#8a8a9e] focus:outline-none w-full"
            />
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/orders' && location.pathname.startsWith('/data'));
            return (
              <Link 
                key={item.name} 
                to={item.path === '/orders' ? '/data' : item.path} 
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-[#2a2a3c] text-white' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon className={`mr-3 ${isActive ? 'text-white' : 'text-[#8a8a9e]'}`} size={18} strokeWidth={2} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#f8f9fa] dark:bg-[#0d0d14] transition-colors">
        <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-[#1a1a27] border-b border-gray-100 dark:border-white/5 transition-colors">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 p-2 bg-gray-100 dark:bg-[#242435] rounded-lg shadow-sm">
              <Menu size={20} className="dark:text-white" />
            </button>
            <h2 className="text-2xl font-bold tracking-tight text-[#11191f] dark:text-white capitalize">
              {(() => {
                const p = location.pathname;
                if (p === '/') return 'Dashboard';
                const match = navItems.find(item =>
                  item.path === '/orders'
                    ? p.startsWith('/data')
                    : p === item.path || p.startsWith(item.path + '/')
                );
                return match?.name ?? p.replace('/', '');
              })()}
            </h2>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-400 dark:text-[#8a8a9e] hover:text-gray-600 dark:hover:text-white transition-colors">
                <Bell size={20} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1a27]"></span>
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-[#242435] text-gray-500 dark:text-[#8a8a9e] hover:text-[#11191f] dark:hover:text-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#11191f] dark:text-white">Kristina Evans</p>
                    <p className="text-xs text-gray-500 dark:text-[#8a8a9e] font-medium">Admin</p>
                  </div>
                  <img src="https://i.pravatar.cc/150?u=kristina" alt="User Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 pt-6">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}
