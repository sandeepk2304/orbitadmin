import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend 
} from 'recharts';
import { 
  TrendingUp, Download, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { ColumnDef } from '../components/DataTable';
import { downloadCsv, toCsv } from '../utils/csv';

const monthlyReportData = [
  { month: 'Jan', revenue: 42000, expenses: 24000, transactions: 1420 },
  { month: 'Feb', revenue: 48000, expenses: 27000, transactions: 1560 },
  { month: 'Mar', revenue: 55000, expenses: 29000, transactions: 1890 },
  { month: 'Apr', revenue: 61000, expenses: 31000, transactions: 2010 },
  { month: 'May', revenue: 70000, expenses: 35000, transactions: 2450 },
  { month: 'Jun', revenue: 78000, expenses: 39000, transactions: 2890 },
  { month: 'Jul', revenue: 85000, expenses: 41000, transactions: 3100 },
  { month: 'Aug', revenue: 82000, expenses: 40000, transactions: 2980 },
  { month: 'Sep', revenue: 90000, expenses: 45000, transactions: 3340 },
  { month: 'Oct', revenue: 98000, expenses: 47000, transactions: 3670 },
  { month: 'Nov', revenue: 110000, expenses: 52000, transactions: 4120 },
  { month: 'Dec', revenue: 124890, expenses: 58000, transactions: 4890 },
];

export default function Reports() {
  // Compute overall financial summaries
  const totals = useMemo(() => {
    const revenue = monthlyReportData.reduce((sum, item) => sum + item.revenue, 0);
    const expenses = monthlyReportData.reduce((sum, item) => sum + item.expenses, 0);
    const profit = revenue - expenses;
    const margin = ((profit / revenue) * 100).toFixed(1);
    
    return {
      revenue,
      expenses,
      profit,
      margin,
    };
  }, []);

  // The same columns as the table, with plain numbers a spreadsheet can add up.
  const exportCsv = () =>
    downloadCsv(
      'orbitadmin-report.csv',
      toCsv(
        ['Month', 'Revenue', 'Expenses', 'Net profit', 'Transactions'],
        monthlyReportData.map((m) => [m.month, m.revenue, m.expenses, m.revenue - m.expenses, m.transactions]),
      ),
    );

  const columns: ColumnDef<typeof monthlyReportData[0]>[] = [
    { key: 'month', header: 'Fiscal Month', sortable: true },
    { 
      key: 'revenue', 
      header: 'Gross Revenue', 
      sortable: true, 
      align: 'right',
      render: (val) => <span className="font-bold text-[#11191f] dark:text-white">${val.toLocaleString()}</span>
    },
    { 
      key: 'expenses', 
      header: 'Operating Expenses', 
      sortable: true, 
      align: 'right',
      render: (val) => <span className="font-medium text-gray-500 dark:text-[#8a8a9e]">${val.toLocaleString()}</span>
    },
    { 
      key: 'revenue', 
      header: 'Net Profit', 
      align: 'right',
      render: (_, item) => {
        const profit = item.revenue - item.expenses;
        return <span className="font-bold text-emerald-500">${profit.toLocaleString()}</span>;
      }
    },
    { 
      key: 'transactions', 
      header: 'Transactions Count', 
      sortable: true, 
      align: 'right',
      render: (val) => <span className="font-semibold text-gray-600 dark:text-gray-300">{val.toLocaleString()}</span>
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader 
        title="Financial Ledger & Reports" 
        description="Analyze annual business operations metrics, gross revenue, expenditures, and net yield metrics."
        action={
          <div className="flex gap-2.5">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              onClick={exportCsv}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">GROSS INTAKE</p>
          <p className="text-2xl font-bold text-[#11191f] dark:text-white mt-1">${totals.revenue.toLocaleString()}</p>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-500 mt-1.5">
            <ArrowUpRight size={13} /> +12.4% <span className="text-[10px] text-gray-400 dark:text-[#8a8a9e] font-normal ml-1">YoY growth</span>
          </span>
        </div>
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">TOTAL EXPENDITURES</p>
          <p className="text-2xl font-bold text-[#11191f] dark:text-white mt-1">${totals.expenses.toLocaleString()}</p>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-500 mt-1.5">
            <ArrowDownRight size={13} /> +4.2% <span className="text-[10px] text-gray-400 dark:text-[#8a8a9e] font-normal ml-1">YoY inflation</span>
          </span>
        </div>
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">NET PROFIT YIELD</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">${totals.profit.toLocaleString()}</p>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-500 mt-1.5">
            <ArrowUpRight size={13} /> +18.6% <span className="text-[10px] text-gray-400 dark:text-[#8a8a9e] font-normal ml-1">Net margins</span>
          </span>
        </div>
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-[#8a8a9e] uppercase tracking-widest">OPERATING YIELD</p>
          <p className="text-2xl font-bold text-[#11191f] dark:text-white mt-1">{totals.margin}%</p>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-500 mt-1.5">
            <TrendingUp size={13} /> Stable <span className="text-[10px] text-gray-400 dark:text-[#8a8a9e] font-normal ml-1">Margin efficiency</span>
          </span>
        </div>
      </div>

      {/* Visual Chart Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue vs Expenses Bar Chart */}
        <div className="bg-white dark:bg-[#1a1a27] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white">Revenue vs Expenses</h3>
            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">Comparative breakdown of intake vs operating outflow.</p>
          </div>
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={monthlyReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: '#11191f', color: '#ffffff', borderRadius: '12px', border: 'none' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar name="Gross Revenue" dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar name="Expenses" dataKey="expenses" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trajectory Area Chart */}
        <div className="bg-white dark:bg-[#1a1a27] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#11191f] dark:text-white">Growth & Transaction Volumes</h3>
            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">Overview of monthly transaction volume expansion.</p>
          </div>
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={monthlyReportData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#11191f', color: '#ffffff', borderRadius: '12px', border: 'none' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area name="Transactions" type="monotone" dataKey="transactions" stroke="#ec4899" fill="url(#growthGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Reports Data Table */}
      <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm transition-colors">
        <h3 className="text-base font-bold text-[#11191f] dark:text-white mb-4">Monthly Financial Breakdown</h3>
        <DataTable
          columns={columns}
          data={monthlyReportData}
          itemsPerPage={6}
        />
      </div>

    </div>
  );
}
