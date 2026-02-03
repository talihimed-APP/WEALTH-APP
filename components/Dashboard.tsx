
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Briefcase, 
  PieChart as PieIcon, 
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Target
} from 'lucide-react';
import { Transaction, Goal, Budget, TransactionType } from '../types';
import { FINANCIAL_WISDOM } from '../constants';

interface DashboardProps {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    fixedExpenses: number;
    variableExpenses: number;
    freelanceIncome: number;
    roiIncome: number;
  };
  transactions: Transaction[];
  goals: Goal[];
  budgets: Budget[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
        <p className="font-bold mb-1">{label || payload[0].name}</p>
        <p className="text-emerald-400 font-medium">
          {payload[0].value.toLocaleString()} Dh
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions, goals, budgets }) => {
  const chartData = useMemo(() => [
    { name: 'Salary', value: Math.max(0, stats.totalIncome - stats.freelanceIncome - stats.roiIncome) },
    { name: 'Freelance', value: stats.freelanceIncome },
    { name: 'ROI', value: stats.roiIncome },
  ], [stats]);

  const expenseData = useMemo(() => [
    { name: 'Fixed', value: stats.fixedExpenses },
    { name: 'Variable', value: stats.variableExpenses },
  ], [stats]);

  const randomQuote = useMemo(() => {
    return FINANCIAL_WISDOM[Math.floor(Math.random() * FINANCIAL_WISDOM.length)];
  }, []);

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];
  const EXPENSE_COLORS = ['#f43f5e', '#fb7185'];

  // Budget calculations for the CURRENT month only
  const budgetStats = useMemo(() => {
    const now = new Date();
    return budgets.map(b => {
      const spent = transactions
        .filter(t => {
          const d = new Date(t.date);
          return t.type === TransactionType.EXPENSE && 
                 t.category === b.category && 
                 d.getMonth() === now.getMonth() && 
                 d.getFullYear() === now.getFullYear();
        })
        .reduce((acc, curr) => acc + curr.amount, 0);
      return { ...b, spent };
    });
  }, [budgets, transactions]);

  return (
    <div className="space-y-6">
      {/* Subtle Quote Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4 group">
        <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
            "{randomQuote.text}"
          </p>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-1">
            — {randomQuote.author}
          </p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Income" 
          value={stats.totalIncome} 
          icon={<ArrowUpRight className="text-emerald-500" />} 
          trend="+12%" 
        />
        <StatCard 
          title="Total Expenses" 
          value={stats.totalExpenses} 
          icon={<ArrowDownRight className="text-rose-500" />} 
          trend="-3%" 
        />
        <StatCard 
          title="Freelance" 
          value={stats.freelanceIncome} 
          icon={<Briefcase className="text-blue-500" />} 
          trend="+5%" 
        />
        <StatCard 
          title="Investments ROI" 
          value={stats.roiIncome} 
          icon={<TrendingUp className="text-indigo-500" />} 
          trend="+1.2%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <PieIcon size={20} className="text-emerald-500" />
            Income Sources
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none transition-opacity hover:opacity-80" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {chartData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <span className="text-xs text-slate-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Structure */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-600">
            <Wallet size={20} />
            Fixed vs Variable Expenses
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500}>
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index]} className="transition-all hover:brightness-110" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">Fixed Expenses</p>
              <p className="text-lg font-bold text-slate-800">{stats.fixedExpenses.toLocaleString()} Dh</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">Variable Expenses</p>
              <p className="text-lg font-bold text-slate-800">{stats.variableExpenses.toLocaleString()} Dh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Tracking Quick View */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Budget Thresholds
          </span>
          <span className="text-xs font-normal text-slate-400">Current Month Status</span>
        </h3>
        <div className="space-y-6">
          {budgetStats.length > 0 ? budgetStats.sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit)).slice(0, 3).map(b => {
            const percentage = Math.round((b.spent / b.limit) * 100);
            const isExceeded = b.spent >= b.limit;
            const isWarning = b.spent >= b.limit * 0.8 && !isExceeded;

            return (
              <div key={b.category} className="space-y-2 group">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{b.icon}</span>
                    <span className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">{b.category}</span>
                    {isExceeded && <AlertCircle size={14} className="text-rose-500 animate-pulse" />}
                    {isWarning && <AlertTriangle size={14} className="text-amber-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={isExceeded ? 'text-rose-600 font-bold' : isWarning ? 'text-amber-600 font-bold' : 'text-slate-500'}>
                      {b.spent.toLocaleString()} / {b.limit.toLocaleString()} Dh
                    </span>
                    <span className="text-[10px] font-black text-slate-300 ml-1">{percentage}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isExceeded ? 'bg-gradient-to-r from-rose-400 to-rose-600' : isWarning ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
               <p className="italic text-sm">No active budgets found. Start tracking by setting up budgets.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Goals Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Target size={20} className="text-indigo-500" />
          Financial Objectives Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map(goal => (
            <div key={goal.id} className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <span className="text-xl filter drop-shadow-sm">{goal.icon}</span> {goal.name}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                <span>{goal.currentAmount.toLocaleString()} Dh</span>
                <span>{goal.targetAmount.toLocaleString()} Dh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; trend: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-xl shadow-inner">
        {icon}
      </div>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-800 tabular-nums">{value.toLocaleString()}<span className="text-xs font-normal text-slate-400 ml-1">Dh</span></h4>
    </div>
  </div>
);

export default Dashboard;
