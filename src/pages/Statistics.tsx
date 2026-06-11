import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 300 },
  { name: 'Books', value: 200 },
];

const COLORS = ['#6366f1', '#facc15', '#f5d6b6', '#cde8d2'];

export default function Statistics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#11191f] dark:text-white mb-4">Overall Statistics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-[#1a1a27] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-xl font-bold text-[#11191f] dark:text-white mb-6">Sales by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#11191f', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
           <div className="bg-indigo-500 p-8 rounded-3xl shadow-sm flex flex-col justify-center text-white">
             <h4 className="text-indigo-100 font-semibold mb-2">Total Conversion Rate</h4>
             <p className="text-4xl font-bold">4.8%</p>
             <p className="text-sm mt-4 text-indigo-200">+1.2% from last month</p>
           </div>
           <div className="bg-[#ffed90] p-8 rounded-3xl shadow-sm flex flex-col justify-center text-[#927500]">
             <h4 className="font-semibold mb-2">Average Order Value</h4>
             <p className="text-4xl font-bold">$124.50</p>
             <p className="text-sm mt-4 opacity-80">+5% from last month</p>
           </div>
           <div className="col-span-2 bg-white dark:bg-[#1a1a27] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-center">
              <h4 className="text-gray-500 dark:text-[#8a8a9e] font-semibold mb-2">Traffic Sources</h4>
              <div className="w-full h-4 bg-gray-100 dark:bg-[#242435] rounded-full overflow-hidden flex mt-2">
                <div className="h-full bg-indigo-500" style={{ width: '40%' }}></div>
                <div className="h-full bg-[#facc15]" style={{ width: '30%' }}></div>
                <div className="h-full bg-[#f5d6b6]" style={{ width: '20%' }}></div>
                <div className="h-full bg-[#cde8d2]" style={{ width: '10%' }}></div>
              </div>
              <div className="flex gap-4 mt-4 text-sm font-semibold text-gray-500 dark:text-[#8a8a9e]">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Direct</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#facc15]"></span> Social</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f5d6b6]"></span> Search</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#cde8d2]"></span> Email</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
