import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search, ChevronDown, Download, Eye, Pencil, Trash2,
  CheckCircle2, Clock, XCircle, DollarSign, TrendingUp,
  AlertCircle, ArrowUpDown, Plus,
} from 'lucide-react';
import { getTodos, getUsers } from '../api/users';
import { SkeletonTableRows, SkeletonBox, ErrorBanner } from '../components/SkeletonCard';

const METHODS = ['Credit Card', 'PayPal', 'Apple Pay', 'Bank Transfer', 'Stripe', 'Credit Card', 'PayPal', 'Apple Pay', 'Bank Transfer', 'Stripe'];
const PAY_STATUSES = ['Completed', 'Pending', 'Completed', 'Failed', 'Completed', 'Completed', 'Pending', 'Completed', 'Completed', 'Failed'];
const CARD_ENDS = ['4242', '5487', null, '9901', null, '7832', '2341', null, '8823', null];
const DATES = [
  'Jan 8, 2026', 'Jan 8, 2026', 'Jan 7, 2026', 'Jan 7, 2026', 'Jan 6, 2026',
  'Jan 5, 2026', 'Jan 5, 2026', 'Jan 4, 2026', 'Jan 3, 2026', 'Jan 2, 2026',
];

const METHOD_ICON: Record<string, { label: string; bg: string }> = {
  'Credit Card':   { label: 'VISA', bg: 'bg-blue-600' },
  'PayPal':        { label: 'PP',   bg: 'bg-blue-400' },
  'Apple Pay':     { label: 'AP',   bg: 'bg-gray-800' },
  'Bank Transfer': { label: 'BANK', bg: 'bg-emerald-600' },
  'Stripe':        { label: 'STR',  bg: 'bg-indigo-500' },
};

type SortKey = 'id' | 'customer' | 'amount' | 'status' | 'date';

export default function Payments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: todos, isLoading: todosLoading, isError } = useQuery({ queryKey: ['todos'], queryFn: getTodos });
  const { data: users, isLoading: usersLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const isLoading = todosLoading || usersLoading;

  const allPayments = useMemo(() => (todos ?? []).slice(0, 10).map((todo, i) => {
    const user = (users ?? [])[(todo.userId - 1) % (users?.length ?? 1)];
    return {
      id: `TRX-${1092 + i}`,
      customer: user?.name ?? `User ${todo.userId}`,
      email: user?.email ?? '',
      avatar: `https://i.pravatar.cc/40?u=${user?.username ?? i}`,
      amount: parseFloat(((todo.id * 89.3) % 1400 + 85).toFixed(2)),
      method: METHODS[i % METHODS.length],
      status: PAY_STATUSES[i % PAY_STATUSES.length],
      cardEnd: CARD_ENDS[i % CARD_ENDS.length],
      date: DATES[i % DATES.length],
    };
  }), [todos, users]);

  const filtered = useMemo(() => {
    let rows = allPayments;
    if (search) rows = rows.filter(r =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'All') rows = rows.filter(r => r.status === statusFilter);
    return [...rows].sort((a, b) => {
      let av: string | number = sortKey === 'amount' ? a.amount : a[sortKey as 'id' | 'customer' | 'status' | 'date'];
      let bv: string | number = sortKey === 'amount' ? b.amount : b[sortKey as 'id' | 'customer' | 'status' | 'date'];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }, [allPayments, search, statusFilter, sortKey, sortAsc]);

  const totalProcessed = allPayments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const pending = allPayments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const failed = allPayments.filter(p => p.status === 'Failed').length;
  const successRate = allPayments.length ? Math.round((allPayments.filter(p => p.status === 'Completed').length / allPayments.length) * 100) : 0;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a); else { setSortKey(key); setSortAsc(true); }
  };

  const STAT_CARDS = [
    { label: 'Total Processed', value: `$${totalProcessed.toFixed(2)}`, icon: <DollarSign size={20} />, iconBg: 'bg-emerald-500', change: '+8.2%', positive: true },
    { label: 'Pending Funds',   value: `$${pending.toFixed(2)}`,        icon: <Clock size={20} />,       iconBg: 'bg-amber-400',  change: '-2.1%', positive: false },
    { label: 'Failed',          value: String(failed),                   icon: <AlertCircle size={20} />, iconBg: 'bg-red-500',    change: '-0.5%', positive: true },
    { label: 'Success Rate',    value: `${successRate}%`,                icon: <TrendingUp size={20} />,  iconBg: 'bg-indigo-500', change: '+1.4%', positive: true },
  ];

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
      {isError && <ErrorBanner message="Failed to load payment data from API." />}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 p-5 space-y-3">
              <SkeletonBox className="h-3 w-24 rounded-full" />
              <SkeletonBox className="h-7 w-32 rounded-full" />
            </div>
          ))
        ) : (
          STAT_CARDS.map(s => (
            <div key={s.label} className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 p-5 flex items-start justify-between shadow-sm">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-[#11191f] dark:text-white mt-1">{s.value}</p>
                <p className={`text-xs font-bold mt-1 ${s.positive ? 'text-emerald-500' : 'text-red-500'}`}>{s.change}</p>
              </div>
              <div className={`w-10 h-10 rounded-full ${s.iconBg} text-white flex items-center justify-center shrink-0`}>
                {s.icon}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transaction..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
          >
            {['All', 'Completed', 'Pending', 'Failed'].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-sm font-semibold text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Download size={15} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            <Plus size={16} /> New Transaction
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1a1a27] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#242435] border-b border-gray-100 dark:border-white/5">
              <tr>
                <Th label="Transaction ID" sortK="id" />
                <Th label="Customer" sortK="customer" />
                <Th label="Amount" sortK="amount" />
                <Th label="Method" />
                <Th label="Status" sortK="status" />
                <Th label="Date" sortK="date" />
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <SkeletonTableRows rows={8} cols={7} />
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No transactions found.</td></tr>
              ) : (
                filtered.map(payment => {
                  const method = METHOD_ICON[payment.method];
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 font-bold text-[#11191f] dark:text-white">{payment.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={payment.avatar} alt={payment.customer} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <div>
                            <p className="font-semibold text-[#11191f] dark:text-white leading-tight">{payment.customer}</p>
                            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">{payment.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#11191f] dark:text-white">${payment.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${method.bg}`}>
                            {method.label}
                          </span>
                          {payment.cardEnd
                            ? <span className="text-xs text-gray-400 dark:text-[#8a8a9e]">xxxx {payment.cardEnd}</span>
                            : <span className="text-xs text-gray-400 dark:text-[#8a8a9e]">{payment.email.split('@')[0]}</span>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          payment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' :
                          payment.status === 'Pending'   ? 'bg-amber-100  text-amber-700  dark:bg-amber-500/15  dark:text-amber-400' :
                                                           'bg-red-100    text-red-700    dark:bg-red-500/15    dark:text-red-400'
                        }`}>
                          {payment.status === 'Completed' && <CheckCircle2 size={12} />}
                          {payment.status === 'Pending'   && <Clock size={12} />}
                          {payment.status === 'Failed'    && <XCircle size={12} />}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-[#8a8a9e] whitespace-nowrap">{payment.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors" title="View">
                            <Eye size={15} />
                          </button>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(payment.id)}
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
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400 dark:text-[#8a8a9e]">
          <span>{filtered.length} transactions</span>
          <span>Showing {filtered.length} of {allPayments.length}</span>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a27] rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 border border-gray-100 dark:border-white/10">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#11191f] dark:text-white text-center">Delete Transaction?</h3>
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
