import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#11191f] dark:text-white">Financial Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1a27] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-xl font-bold text-[#11191f] dark:text-white mb-6">Revenue vs Expenses</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ backgroundColor: '#11191f', color: '#ffffff', borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a27] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-xl font-bold text-[#11191f] dark:text-white mb-6">Growth Trajectory</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#11191f', color: '#ffffff', borderRadius: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
