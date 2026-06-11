import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Eye, Pencil, Trash2, Download, ArrowUpDown } from 'lucide-react';
import { getUsers } from '../api/users';
import { SkeletonTableRows, ErrorBanner } from '../components/SkeletonCard';

const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸' }, { name: 'France', flag: '🇫🇷' },
  { name: 'Japan', flag: '🇯🇵' },         { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Germany', flag: '🇩🇪' },       { name: 'Italy', flag: '🇮🇹' },
  { name: 'Argentina', flag: '🇦🇷' },     { name: 'India', flag: '🇮🇳' },
  { name: 'Brazil', flag: '🇧🇷' },        { name: 'Canada', flag: '🇨🇦' },
];

const JOINED_DATES = [
  '2 Feb, 2024 08:34 AM', '15 Mar, 2024 10:22 AM', '28 Jan, 2024 03:15 PM',
  '10 Apr, 2024 09:47 AM', '20 Feb, 2024 02:10 PM', '5 Mar, 2024 11:25 AM',
  '18 Apr, 2024 04:50 PM', '10 Jan, 2024 06:30 AM', '22 Mar, 2024 01:00 PM',
  '8 Feb, 2024 07:45 AM',
];

const PHONES = [
  '+1 (415) 992-3412', '+33 6 12 34 56 78', '+81 90-1234-5678',
  '+44 7700 900123',   '+49 151 23456789',  '+39 333 4567890',
  '+54 9 11 2345 6789','+91 98765 43210',   '+55 11 91234-5678',
  '+1 (604) 555-0199',
];

type SortKey = 'name' | 'joined' | 'orders' | 'spent';

export default function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: users, isLoading, isError } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const enriched = useMemo(() => (users ?? []).map((u, i) => ({
    ...u,
    country: COUNTRIES[i % COUNTRIES.length],
    joined: JOINED_DATES[i % JOINED_DATES.length],
    phone: PHONES[i % PHONES.length],
    orders: (u.id * 7) % 82 + 1,
    spent: parseFloat(((u.id * 312.7) % 320 + 120).toFixed(2)),
    avatar: `https://i.pravatar.cc/40?u=${u.username}`,
  })), [users]);

  const filtered = useMemo(() => {
    let rows = enriched;
    if (search) rows = rows.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    );
    return [...rows].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string')
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [enriched, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a); else { setSortKey(key); setSortAsc(true); }
  };
  const toggleAll = () => {
    selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(r => r.id)));
  };
  const toggleRow = (id: number) => {
    const next = new Set(selected); next.has(id) ? next.delete(id) : next.add(id); setSelected(next);
  };

  const Th = ({ label, sortK, right }: { label: string; sortK?: SortKey; right?: boolean }) => (
    <th
      className={`px-4 py-3 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wide whitespace-nowrap ${sortK ? 'cursor-pointer select-none hover:text-gray-800 dark:hover:text-white' : ''} ${right ? 'text-right' : ''}`}
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
      {isError && <ErrorBanner message="Failed to load customers from API." />}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-sm font-semibold text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Download size={15} /> Export
          </button>
          <button
            onClick={() => navigate('/data/new')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Customer
          </button>
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
                <Th label="Client Name" sortK="name" />
                <Th label="Email" />
                <Th label="Phone" />
                <Th label="Country" />
                <Th label="Joined" sortK="joined" />
                <Th label="Orders" sortK="orders" />
                <Th label="Total Spends" sortK="spent" />
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <SkeletonTableRows rows={8} cols={9} />
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-sm">No customers found.</td></tr>
              ) : (
                filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(customer.id)} onChange={() => toggleRow(customer.id)}
                        className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={customer.avatar} alt={customer.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <span className="font-semibold text-[#11191f] dark:text-white">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-[#8a8a9e]">{customer.email}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-[#8a8a9e] whitespace-nowrap">{customer.phone}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                        <span className="text-lg leading-none">{customer.country.flag}</span>
                        {customer.country.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-[#8a8a9e] whitespace-nowrap">{customer.joined}</td>
                    <td className="px-4 py-3 font-semibold text-[#11191f] dark:text-white">{customer.orders}</td>
                    <td className="px-4 py-3 font-bold text-[#11191f] dark:text-white">${customer.spent.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/customers/${customer.id}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => navigate(`/customers/${customer.id}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(customer.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400 dark:text-[#8a8a9e]">
          <span>{selected.size > 0 ? `${selected.size} selected` : `${filtered.length} customers`}</span>
          <span>Showing {filtered.length} of {enriched.length}</span>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a27] rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 border border-gray-100 dark:border-white/10">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#11191f] dark:text-white text-center">Delete Customer?</h3>
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
