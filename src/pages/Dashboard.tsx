import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  ShoppingCart, DollarSign, TrendingUp, Package,
  RefreshCw, ArrowDownRight, ArrowUpRight,
  ChevronRight, AlertTriangle,
} from 'lucide-react';
import { getUsers, getTodos, getPosts } from '../api/users';
import { SkeletonBox, SkeletonStatCard, ErrorBanner } from '../components/SkeletonCard';

// ─── Static data ─────────────────────────────────────────────────────────────

const DAILY_DATA = Array.from({ length: 25 }, (_, i) => ({
  day: String(i + 1),
  revenue: Math.floor(Math.sin(i * 0.4) * 30 + 60 + (i * 7 % 20)),
  orders:  Math.floor(Math.cos(i * 0.3) * 15 + 40 + (i * 3 % 10)),
}));

const MONTHLY_DATA = [
  { day: 'Jan', revenue: 62, orders: 38 }, { day: 'Feb', revenue: 78, orders: 45 },
  { day: 'Mar', revenue: 55, orders: 30 }, { day: 'Apr', revenue: 90, orders: 60 },
  { day: 'May', revenue: 70, orders: 42 }, { day: 'Jun', revenue: 85, orders: 55 },
  { day: 'Jul', revenue: 95, orders: 65 }, { day: 'Aug', revenue: 80, orders: 50 },
  { day: 'Sep', revenue: 72, orders: 44 }, { day: 'Oct', revenue: 88, orders: 58 },
  { day: 'Nov', revenue: 76, orders: 47 }, { day: 'Dec', revenue: 99, orders: 70 },
];

const ANNUAL_DATA = [
  { day: '2020', revenue: 42, orders: 25 }, { day: '2021', revenue: 58, orders: 34 },
  { day: '2022', revenue: 71, orders: 43 }, { day: '2023', revenue: 85, orders: 55 },
  { day: '2024', revenue: 96, orders: 68 }, { day: '2025', revenue: 78, orders: 52 },
];

const PRODUCTS = [
  { name: 'Modern Fabric Sofa Set',      brand: 'Homedure',   price: 499, qty: 34, amount: 16966, stock: 'Low Stock' },
  { name: 'L-Shaped Sectional Sofa',     brand: 'ComfortHub', price: 899, qty: 21, amount: 18879, stock: 'In Stock' },
  { name: 'Velvet Recliner Chair',       brand: 'SoftEase',   price: 379, qty: 47, amount: 17813, stock: 'In Stock' },
  { name: 'Classic Wooden Coffee Table', brand: 'OakCraft',   price: 259, qty: 58, amount: 15022, stock: 'Out of Stock' },
  { name: 'Minimalist TV Stand',         brand: 'FurnPro',    price: 315, qty: 64, amount: 20160, stock: 'In Stock' },
  { name: 'Leather Lounge Chair',        brand: 'UrbanStyle', price: 425, qty: 39, amount: 16575, stock: 'Low Stock' },
];

const ACTIVITY = [
  { icon: '🛒', color: 'bg-blue-100 dark:bg-blue-500/15',   text: 'New Orders Synced from Storefront',       sub: '1,250 new customer orders were successfully imported.', by: 'Olivia Green',  time: '2m ago' },
  { icon: '💳', color: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'Payment Gateway Integration Updated', sub: 'Stripe API upgraded to support faster settlements.',    by: 'James Parker', time: '18m ago' },
  { icon: '📦', color: 'bg-amber-100 dark:bg-amber-500/15', text: 'Inventory Levels Auto-Synced',            sub: 'All product quantities were updated from warehouse.',   by: 'Sophia Lee',   time: '1h ago' },
  { icon: '✅', color: 'bg-violet-100 dark:bg-violet-500/15', text: 'New Vendor Accounts Approved',          sub: '4 new vendor accounts reviewed and activated.',         by: 'Admin',        time: '3h ago' },
];

const PAY_METHODS = ['Credit Card', 'UPI', 'PayPal', 'Debit Card', 'Credit Card'];
const ORDER_AMOUNTS = [249, 179, 329, 125, 560];
const ORDER_CUSTOMERS = ['John Carter', 'Emma Wilson', 'Michael Harris', 'Sophia Turner', 'Chris Evans'];
const ORDER_EMAILS = ['john@example.com', 'emma@example.com', 'michael@example.com', 'sophia@example.com', 'chris@example.com'];

const STOCK_STYLE: Record<string, string> = {
  'In Stock':     'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  'Low Stock':    'bg-amber-100   text-amber-700   dark:bg-amber-500/15   dark:text-amber-400',
  'Out of Stock': 'bg-red-100     text-red-700     dark:bg-red-500/15     dark:text-red-400',
};

const DONUT_COLORS = ['#6366f1', '#facc15', '#f87171'];

type Tab = 'Today' | 'Monthly' | 'Annual';

// ─── Component ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Monthly');

  const { data: users, isLoading: ul, isError: ue } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: todos, isLoading: tl, isError: te } = useQuery({ queryKey: ['todos'], queryFn: getTodos });
  const { data: posts, isLoading: pl } = useQuery({ queryKey: ['posts'],  queryFn: getPosts });

  const isLoading = ul || tl || pl;
  const isError   = ue || te;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const chartData = tab === 'Today' ? DAILY_DATA : tab === 'Monthly' ? MONTHLY_DATA : ANNUAL_DATA;
  const dayKey    = tab === 'Today' ? 'day' : 'day';

  const totalRevenue  = 78224.68;
  const totalOrders   = posts?.length ?? 8541;
  const growthRate    = 25.30;
  const todayEarning  = 8975.30;

  const donutData = [
    { name: 'Good Sales',    value: 85 },
    { name: 'Average Sales', value: 10 },
    { name: 'Poor Sales',    value: 5  },
  ];

  const KPI_CARDS = [
    {
      label: 'ORDERS', value: (todos?.length ?? 9754).toLocaleString(),
      change: '-1.89%', positive: false,
      icon: <ShoppingCart size={20} />, iconBg: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-500',
    },
    {
      label: 'REVENUE', value: '$75.21k',
      change: '-5.23%', positive: false,
      icon: <DollarSign size={20} />, iconBg: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-500',
    },
    {
      label: 'GROWTH', value: '+25.08%',
      change: '+4.87%', positive: true,
      icon: <TrendingUp size={20} />, iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-500',
    },
    {
      label: 'CUSTOMERS', value: (users?.length ?? 1240).toLocaleString(),
      change: '+3.12%', positive: true,
      icon: <Package size={20} />, iconBg: 'bg-violet-100 dark:bg-violet-500/15 text-violet-500',
    },
  ];

  return (
    <div className="space-y-5">
      {isError && <ErrorBanner message="Failed to load some dashboard data." />}

      {/* ── Row 1: Welcome + KPI cards + Donut + Weekly ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Welcome card */}
        <div className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">Good Day,</p>
            <p className="text-xl font-bold text-[#11191f] dark:text-white mt-0.5">Admin! 👋</p>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-[#8a8a9e] font-semibold">
            <span>📅 {dateStr}</span>
            <span>🕐 {timeStr}</span>
          </div>
        </div>

        {/* KPI cards */}
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)
          : KPI_CARDS.slice(0, 3).map(card => (
              <div key={card.label} className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">{card.label}</p>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>{card.icon}</div>
                </div>
                <p className="text-2xl font-bold text-[#11191f] dark:text-white">{card.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${card.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {card.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {card.change} <span className="text-gray-400 dark:text-[#8a8a9e] font-normal ml-1">Since last month</span>
                </div>
              </div>
            ))
        }
      </div>

      {/* ── Row 2: Sales Report + Top Products ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Sales Report */}
        <div className="xl:col-span-3 bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">Sales Report</p>
                <p className="text-sm text-gray-400 dark:text-[#8a8a9e]">({totalOrders.toLocaleString()} Orders)</p>
              </div>
              <div className="flex gap-1 bg-gray-100 dark:bg-[#242435] rounded-lg p-1">
                {(['Today', 'Monthly', 'Annual'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${tab === t ? 'bg-white dark:bg-[#1a1a27] text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-[#8a8a9e] hover:text-gray-800 dark:hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary row */}
            <div className="flex flex-wrap gap-6 mt-4">
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Revenue
                </p>
                <p className="text-lg font-bold text-[#11191f] dark:text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Orders
                </p>
                <p className="text-lg font-bold text-[#11191f] dark:text-white">{totalOrders.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Growth Rate
                </p>
                <p className="text-lg font-bold text-[#11191f] dark:text-white">{growthRate}%</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-500 dark:text-[#8a8a9e] mt-3">
              Today's Earning: <span className="text-[#11191f] dark:text-white font-bold">${todayEarning.toLocaleString()}</span>
            </p>
          </div>

          <div className="p-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.3} />
                <XAxis dataKey={dayKey} stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a27', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                <Area type="monotone" dataKey="orders"  stroke="#34d399" strokeWidth={2}   fill="url(#ordGrad)" dot={false} strokeDasharray="5 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-4 flex gap-4 text-xs font-semibold text-gray-500 dark:text-[#8a8a9e]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" /> Total Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" /> Orders</span>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <p className="font-bold text-[#11191f] dark:text-white">Top Selling Products</p>
            <button className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex-1 overflow-auto divide-y divide-gray-100 dark:divide-white/5">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#242435] flex items-center justify-center shrink-0 text-lg">
                  🪑
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#11191f] dark:text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">By: {p.brand}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">${p.price.toFixed(2)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STOCK_STYLE[p.stock]}`}>{p.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Orders + Donut + Recent Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#11191f] dark:text-white">Recent Orders</p>
              <p className="text-xs text-gray-400 dark:text-[#8a8a9e] mt-0.5">186.25k Transactions</p>
            </div>
            <button onClick={() => navigate('/data')}
              className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase">ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase">Customer</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase">Amount</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 4 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <SkeletonBox className="h-3 rounded-full w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : ORDER_CUSTOMERS.map((name, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => navigate('/data')}>
                        <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400 text-xs whitespace-nowrap">#ORD-{1023 - i}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#11191f] dark:text-white text-xs leading-tight">{name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-[#8a8a9e]">{ORDER_EMAILS[i]}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-[#11191f] dark:text-white text-xs whitespace-nowrap">${ORDER_AMOUNTS[i]}.00</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-[#8a8a9e] text-xs whitespace-nowrap">{PAY_METHODS[i]}</td>                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400 dark:text-[#8a8a9e]">
            Showing 1 to 5 of 10 orders
          </div>
        </div>

        {/* Store Performance Donut */}
        <div className="xl:col-span-1 bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-[#11191f] dark:text-white text-sm">Store Performance</p>
            <button className="text-xs font-semibold text-gray-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={52} outerRadius={72}
                  paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a27', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '11px' }}
                  formatter={(v) => [`${v}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Centre label using absolute positioning trick via wrapper */}
          <div className="space-y-2 mt-2">
            {donutData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-gray-500 dark:text-[#8a8a9e]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                  {d.name}
                </span>
                <span className="font-bold text-[#11191f] dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
            <AlertTriangle size={13} className="text-red-400 shrink-0" />
            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">Poor sales section detected</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <p className="font-bold text-[#11191f] dark:text-white">Recent Activity</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <SkeletonBox className="w-9 h-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBox className="h-3 w-3/4 rounded-full" />
                      <SkeletonBox className="h-2 w-full rounded-full" />
                      <SkeletonBox className="h-2 w-1/2 rounded-full" />
                    </div>
                  </div>
                ))
              : ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${a.color}`}>
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#11191f] dark:text-white leading-tight">{a.text}</p>
                      <p className="text-xs text-gray-400 dark:text-[#8a8a9e] mt-0.5 line-clamp-2">{a.sub}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs font-semibold text-indigo-500">By {a.by}</p>
                        <span className="text-[10px] text-gray-400 dark:text-[#8a8a9e]">{a.time}</span>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      {/* ── Row 4: Revenue KPI + Customers KPI (extra row) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          KPI_CARDS.slice(1).map(card => (
            <div key={card.label} className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">{card.label}</p>
                <p className="text-2xl font-bold text-[#11191f] dark:text-white mt-1">{card.value}</p>
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-bold ${card.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {card.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {card.change} <span className="text-gray-400 dark:text-[#8a8a9e] font-normal ml-1">Since last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
