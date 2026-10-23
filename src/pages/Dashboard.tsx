import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, Users, FolderKanban, TrendingUp, ArrowUpRight, ArrowDownRight,
  UserPlus, FolderPlus, CheckSquare, BellOff, Calendar, Clock
} from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useNotifications } from '../hooks/useNotifications';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/PageHeader';

// 12-month analytics trend data
const MONTHLY_DATA = [
  { name: 'Jan', revenue: 42000, expenses: 24000 },
  { name: 'Feb', revenue: 48000, expenses: 27000 },
  { name: 'Mar', revenue: 55000, expenses: 29000 },
  { name: 'Apr', revenue: 61000, expenses: 31000 },
  { name: 'May', revenue: 70000, expenses: 35000 },
  { name: 'Jun', revenue: 78000, expenses: 39000 },
  { name: 'Jul', revenue: 85000, expenses: 41000 },
  { name: 'Aug', revenue: 82000, expenses: 40000 },
  { name: 'Sep', revenue: 90000, expenses: 45000 },
  { name: 'Oct', revenue: 98000, expenses: 47000 },
  { name: 'Nov', revenue: 110000, expenses: 52000 },
  { name: 'Dec', revenue: 124890, expenses: 58000 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { metrics, activities, recentUsers, refreshDashboard } = useDashboardData();
  const { markAllAsRead } = useNotifications();

  // Local clock state for dashboard visual greeting
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleClearNotifications = () => {
    markAllAsRead();
    refreshDashboard();
  };

  const KPI_CARDS = [
    {
      label: 'TOTAL REVENUE',
      value: `$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: metrics.revenueChange,
      positive: metrics.revenuePositive,
      icon: <DollarSign size={20} />,
      iconBg: 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
      desc: 'Annual gross revenue',
    },
    {
      label: 'TOTAL USERS',
      value: metrics.totalUsers.toString(),
      change: metrics.usersChange,
      positive: metrics.usersPositive,
      icon: <Users size={20} />,
      iconBg: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20',
      desc: 'Registered members in database',
    },
    {
      label: 'ACTIVE PROJECTS',
      value: metrics.activeProjects.toString(),
      change: metrics.projectsChange,
      positive: metrics.projectsPositive,
      icon: <FolderKanban size={20} />,
      iconBg: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20',
      desc: 'Active software initiatives',
    },
    {
      label: 'GROWTH RATE',
      value: `${metrics.growthRate}%`,
      change: metrics.growthChange,
      positive: metrics.growthPositive,
      icon: <TrendingUp size={20} />,
      iconBg: 'bg-purple-500 text-white shadow-lg shadow-purple-500/20',
      desc: 'MoM customer signups',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader 
        title="Operations Dashboard" 
        description="Real-time operations, metrics analytics, activity logs, and quick actions."
        action={
          <div className="flex items-center gap-3 bg-white dark:bg-[#1a1a27] border border-gray-100 dark:border-white/5 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-semibold text-gray-500 dark:text-[#8a8a9e] transition-colors">
            <span className="flex items-center gap-1"><Calendar size={13} /> {dateStr}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white/10" />
            <span className="flex items-center gap-1"><Clock size={13} /> {timeStr}</span>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((card) => (
          <div key={card.label} className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm flex items-start justify-between relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-md">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-[#11191f] dark:text-white tracking-tight">
                {card.value}
              </p>
              <div className="flex items-center gap-1">
                <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${card.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {card.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {card.change}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-[#8a8a9e] font-medium">
                  {card.desc}
                </span>
              </div>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#11191f] dark:text-white">Annual Financial Trend</h3>
              <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">Track total revenue intake against gross expenditures monthly.</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-gray-500 dark:text-[#8a8a9e]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-400 inline-block" /> Expenses</span>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="99%" height="100%">
              {/* `left: -20` pulled the Y axis off the canvas, so every tick
                  rendered with its first digit cut off — "60000" read as
                  "0000". The axis gets its own width instead, and the ticks
                  are abbreviated so that width stays small. */}
              <AreaChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  width={44}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
                  }
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#11191f', color: '#ffffff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={3} dot={false} />
                <Area type="monotone" dataKey="expenses" stroke="#06b6d4" fill="url(#expGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-lg font-bold text-[#11191f] dark:text-white">Quick Actions</h3>
            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">Common administration and database trigger actions.</p>
          </div>

          <div className="space-y-3 my-6">
            <button
              onClick={() => navigate('/dashboard/users')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/70 dark:bg-indigo-500/[0.04] dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <UserPlus size={16} /> Add New User Profile
              </span>
              <ArrowUpRight size={14} className="opacity-60" />
            </button>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 dark:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <FolderPlus size={16} /> Create New Project Plan
              </span>
              <ArrowUpRight size={14} className="opacity-60" />
            </button>
            <button
              onClick={() => navigate('/dashboard/tasks')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/70 dark:bg-amber-500/[0.04] dark:hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-bold transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <CheckSquare size={16} /> Assign Workflow Task
              </span>
              <ArrowUpRight size={14} className="opacity-60" />
            </button>
            <button
              onClick={handleClearNotifications}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100/70 dark:bg-rose-500/[0.04] dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <BellOff size={16} /> Dismiss Notifications
              </span>
              <ArrowUpRight size={14} className="opacity-60" />
            </button>
          </div>

          <div className="text-center text-[10px] text-gray-400 dark:text-[#8a8a9e] font-semibold border-t border-gray-100 dark:border-white/5 pt-3">
            LOGGED IN AS SUPER ADMIN ROLE
          </div>
        </div>
      </div>

      {/* Roster & Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Users List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col justify-between transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white">Recent Team Signups</h3>
            <button
              onClick={() => navigate('/dashboard/users')}
              className="text-xs font-semibold text-indigo-500 hover:underline"
            >
              Manage Users
            </button>
          </div>
          <div className="flex-1 divide-y divide-gray-100 dark:divide-white/5 overflow-y-auto max-h-[360px]">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                  <div>
                    <h4 className="text-xs font-bold text-[#11191f] dark:text-white leading-tight">{user.name}</h4>
                    <p className="text-[10px] text-gray-400 dark:text-[#8a8a9e] mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={user.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-white/5 text-center text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">
            Tracked in browser local storage database
          </div>
        </div>

        {/* Recent Activities List */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col justify-between transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white">Recent System Activities</h3>
          </div>
          <div className="flex-1 divide-y divide-gray-100 dark:divide-white/5 overflow-y-auto max-h-[360px]">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 dark:text-[#8a8a9e]">No actions logged.</div>
            ) : (
              activities.slice(0, 5).map((act) => (
                <div key={act.id} className="p-4 flex items-start gap-3 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm ${act.color}`}>
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#11191f] dark:text-white leading-tight truncate">{act.text}</h4>
                    <p className="text-[10px] text-gray-400 dark:text-[#8a8a9e] mt-0.5 line-clamp-1">{act.sub}</p>
                    <div className="flex items-center justify-between mt-1 text-[9px] font-semibold text-gray-400 dark:text-[#8a8a9e]">
                      <span>By {act.by}</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-white/5 text-center text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">
            System audit trail log
          </div>
        </div>
      </div>

    </div>
  );
}
