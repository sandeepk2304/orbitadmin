import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search, ChevronDown, Eye, Pencil, Trash2,
  CheckCircle2, Clock, XCircle, ShoppingBag, RefreshCw,
  ArrowUpDown,
} from 'lucide-react';
import { getPosts, getUsers } from '../api/users';
import { SkeletonTableRows, ErrorBanner } from '../components/SkeletonCard';

const PAY_STATUSES = ['Paid', 'Pending', 'Failed', 'Paid', 'Paid', 'Pending', 'Paid', 'Failed', 'Paid', 'Paid'];
const ORDER_STATUSES = ['Delivered', 'Processing', 'Cancelled', 'Shipped', 'Delivered', 'Processing', 'Delivered', 'Cancelled', 'Shipped', 'Delivered'];
const PAY_METHODS = ['Visa', 'Mastercard', 'PayPal', 'Stripe', 'Norns', 'Visa', 'Mastercard', 'PayPal', 'Stripe', 'Visa'];
const CARD_ENDS = ['7832', '5487', null, '9901', '4678', '2341', '6612', null, '8823', '1190'];
const DATES = [
  '9 May, 2025 10:10 AM', '7 May, 2025 11:45 AM', '26 Apr, 2025 1:20 PM',
  '27 Apr, 2025 3:30 PM', '28 Apr, 2025 9:55 AM', '30 Apr, 2025 2:15 PM',
  '1 May, 2025 8:00 AM', '3 May, 2025 5:45 PM', '5 May, 2025 12:30 PM', '6 May, 2025 7:20 AM',
];

const PAY_STATUS_STYLE: Record<string, { dot: string; text: string }> = {
  Paid:    { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  Pending: { dot: 'bg-amber-400',   text: 'text-amber-500 dark:text-amber-400' },
  Failed:  { dot: 'bg-red-500',     text: 'text-red-600 dark:text-red-400' },
};

const ORDER_STATUS_STYLE: Record<string, string> = {
  Delivered:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Shipped:    'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Processing: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Cancelled:  'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

const METHOD_STYLE: Record<string, string> = {
  Visa:       'bg-blue-600',
  Mastercard: 'bg-red-500',
  PayPal:     'bg-blue-400',
  Stripe:     'bg-indigo-500',
  Norns:      'bg-gray-700',
};

const STAT_CARDS = [
  { label: 'COMPLETED ORDERS', value: '93.70k', change: '+3.34%', positive: true,  icon: <CheckCircle2 size={22} />, iconBg: 'bg-emerald-500' },
  { label: 'PENDING ORDERS',   value: '557',    change: '-1.12%', positive: false, icon: <Clock size={22} />,        iconBg: 'bg-amber-400' },
  { label: 'CANCELED ORDERS',  value: '269',    change: '-0.75%', positive: false, icon: <XCircle size={22} />,      iconBg: 'bg-red-500' },
  { label: 'NEW ORDERS',       value: '9.30k',  change: '+4.22%', positive: true,  icon: <ShoppingBag size={22} />,  iconBg: 'bg-cyan-500' },
  { label: 'RETURNED ORDERS',  value: '8,741',  change: '+0.56%', positive: true,  icon: <RefreshCw size={22} />,    iconBg: 'bg-violet-500' },
];

type SortKey = 'orderId' | 'date' | 'customer' | 'total' | 'payStatus' | 'orderStatus';

export default function DataPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [payFilter, setPayFilter] = useState('All');
  const [delivFilter, setDelivFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('orderId');
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: posts, isLoading: postsLoading, isError } = useQuery({ queryKey: ['posts'], queryFn: getPosts });
  const { data: users, isLoading: usersLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const isLoading = postsLoading || usersLoading;

  const allOrders = useMemo(() => (posts ?? []).map((post, i) => {
    const user = (users ?? []).find(u => u.id === post.userId);
    return {
      id: post.id,
      orderId: `#WB201${String(i).padStart(2, '0')}`,
      customer: user?.name ?? `User ${post.userId}`,
      email: user?.email ?? '',
      avatar: `https://i.pravatar.cc/40?u=${post.userId}`,
      total: parseFloat(((post.id * 137.5) % 1300 + 59).toFixed(2)),
      payStatus: PAY_STATUSES[i % PAY_STATUSES.length],
      orderStatus: ORDER_STATUSES[i % ORDER_STATUSES.length],
      method: PAY_METHODS[i % PAY_METHODS.length],
      cardEnd: CARD_ENDS[i % CARD_ENDS.length],
      date: DATES[i % DATES.length],
    };
  }), [posts, users]);

  const filtered = useMemo(() => {
    let rows = allOrders;
    if (search) rows = rows.filter(r =>
      r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
    );
    if (payFilter !== 'All') rows = rows.filter(r => r.payStatus === payFilter);
    if (delivFilter !== 'All') rows = rows.filter(r => r.orderStatus === delivFilter);
    rows = [...rows].sort((a, b) => {
      let av: string | number = a[sortKey as keyof typeof a] as string | number;
      let bv: string | number = b[sortKey as keyof typeof b] as string | number;
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [allOrders, search, payFilter, delivFilter, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };

  const toggleRow = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const Th = ({ label, sortK }: { label: string; sortK?: SortKey }) => (
    <th
      className={`px-4 py-3 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wide whitespace-nowrap ${sortK ? 'cursor-pointer select-none hover:text-gray-800 dark:hover:text-white' : ''}`}
      onClick={() => sortK && toggleSort(sortK)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortK && <ArrowUpDown size={12} className="opacity-50" />}
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      {isError && <ErrorBanner message="Failed to load orders from API." />}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 p-5 flex items-start justify-between shadow-sm">
            <div>
              <p className="text-2xl font-bold text-[#11191f] dark:text-white">{s.value}</p>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest mt-1">{s.label}</p>
              <p className={`text-xs font-bold mt-1 ${s.positive ? 'text-emerald-500' : 'text-red-500'}`}>{s.change}</p>
            </div>
            <div className={`w-10 h-10 rounded-full ${s.iconBg} text-white flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search order..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <span className="text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">Filter By:</span>

        {/* Payment Status filter */}
        <div className="relative">
          <select
            value={payFilter}
            onChange={e => setPayFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
          >
            {['All', 'Paid', 'Pending', 'Failed'].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Delivery Status filter */}
        <div className="relative">
          <select
            value={delivFilter}
            onChange={e => setDelivFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
          >
            {['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#242435] border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                    className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
                </th>
                <Th label="Order ID" sortK="orderId" />
                <Th label="Date" sortK="date" />
                <Th label="Customer" sortK="customer" />
                <Th label="Amount" sortK="total" />
                <Th label="Payment Status" sortK="payStatus" />
                <Th label="Order Status" sortK="orderStatus" />
                <Th label="Payment Method" />
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <SkeletonTableRows rows={8} cols={9} />
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-sm">No orders found.</td></tr>
              ) : (
                filtered.map(order => {
                  const ps = PAY_STATUS_STYLE[order.payStatus];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(order.id)} onChange={() => toggleRow(order.id)}
                          className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3 font-bold text-[#11191f] dark:text-white">{order.orderId}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-[#8a8a9e] whitespace-nowrap">{order.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={order.avatar} alt={order.customer} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <div>
                            <p className="font-semibold text-[#11191f] dark:text-white leading-tight">{order.customer}</p>
                            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#11191f] dark:text-white">${order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 font-semibold text-sm ${ps.text}`}>
                          <span className={`w-2 h-2 rounded-full ${ps.dot}`} />
                          {order.payStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${ORDER_STATUS_STYLE[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${METHOD_STYLE[order.method]}`}>
                            {order.method.toUpperCase()}
                          </span>
                          {order.cardEnd
                            ? <span className="text-xs text-gray-400 dark:text-[#8a8a9e]">xxxx {order.cardEnd}</span>
                            : <span className="text-xs text-gray-400 dark:text-[#8a8a9e]">{order.email.split('@')[0]}</span>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => navigate(`/data/${order.id}`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors" title="View">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => navigate(`/data/${order.id}`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(order.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400 dark:text-[#8a8a9e]">
          <span>{selected.size > 0 ? `${selected.size} selected` : `${filtered.length} orders`}</span>
          <span>Showing {filtered.length} of {allOrders.length}</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a27] rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 border border-gray-100 dark:border-white/10">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#11191f] dark:text-white text-center">Delete Order?</h3>
            <p className="text-sm text-gray-500 dark:text-[#8a8a9e] text-center mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-semibold text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
