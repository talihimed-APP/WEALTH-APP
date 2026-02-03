
import React, { useState, useMemo } from 'react';
import { Budget, Transaction, TransactionType, CustomCategory } from '../types';
import { 
  Plus, 
  Target, 
  Trash2, 
  PieChart as PieIcon, 
  PlusCircle, 
  LayoutGrid, 
  AlertCircle, 
  AlertTriangle, 
  RefreshCcw, 
  ChevronLeft, 
  ChevronRight,
  History,
  Check
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BudgetManagerProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
  categories: CustomCategory[];
  setCategories: React.Dispatch<React.SetStateAction<CustomCategory[]>>;
}

const EMOJIS = ['🛒', '🏠', '🚗', '⚡', '🍱', '🎬', '🏥', '👔', '🎓', '✈️', '💍', '🛡️', '🎁', '📱', '🍎', '☕', '🎮', '🏋️', '📚', '🐈'];

const BudgetManager: React.FC<BudgetManagerProps> = ({ budgets, setBudgets, transactions, categories, setCategories }) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState(EMOJIS[0]);
  const [budgetForm, setBudgetForm] = useState<Omit<Budget, 'icon'>>({ category: '', limit: 0, rollover: false });
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName && !categories.find(c => c.name === newCatName)) {
      setCategories([...categories, { name: newCatName, icon: newCatIcon }]);
      setNewCatName('');
    }
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetForm.category && budgetForm.limit > 0) {
      const catIcon = categories.find(c => c.name === budgetForm.category)?.icon;
      setBudgets(prev => {
        const filtered = prev.filter(b => b.category !== budgetForm.category);
        return [...filtered, { ...budgetForm, icon: catIcon }];
      });
      setBudgetForm({ category: '', limit: 0, rollover: false });
    }
  };

  const removeBudget = (cat: string) => {
    setBudgets(budgets.filter(b => b.category !== cat));
  };

  // Fix: Corrected typo where _catName was used instead of catName (line 63)
  const removeCategory = (catName: string) => {
    setCategories(categories.filter(c => c.name !== catName));
    setBudgets(budgets.filter(b => b.category !== catName));
  };

  const changeMonth = (offset: number) => {
    const d = new Date(viewYear, viewMonth + offset, 1);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
  };

  // Calculate stats for the selected period
  const periodStats = useMemo(() => {
    return budgets.map(b => {
      // Spending in selected month
      const spentThisMonth = transactions
        .filter(t => {
          const d = new Date(t.date);
          return t.type === TransactionType.EXPENSE && 
                 t.category === b.category && 
                 d.getMonth() === viewMonth && 
                 d.getFullYear() === viewYear;
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

      // Rollover from previous month if enabled
      let rolloverAmount = 0;
      if (b.rollover) {
        const prevMonthDate = new Date(viewYear, viewMonth - 1, 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();
        
        const spentPrevMonth = transactions
          .filter(t => {
            const d = new Date(t.date);
            return t.type === TransactionType.EXPENSE && 
                   t.category === b.category && 
                   d.getMonth() === prevMonth && 
                   d.getFullYear() === prevYear;
          })
          .reduce((acc, curr) => acc + curr.amount, 0);
        
        rolloverAmount = Math.max(0, b.limit - spentPrevMonth);
      }

      const totalLimit = b.limit + rolloverAmount;
      const percentage = totalLimit > 0 ? Math.round((spentThisMonth / totalLimit) * 100) : 0;
      
      return { 
        ...b, 
        spent: spentThisMonth, 
        rolloverAmount, 
        totalLimit, 
        percentage 
      };
    });
  }, [budgets, transactions, viewMonth, viewYear]);

  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });

  // Pie chart data
  const chartData = periodStats.map(s => ({ name: s.category, value: s.spent }));
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Historical Month Selector */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Historical Tracking</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Review past budget performance</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-emerald-600 shadow-sm"><ChevronLeft size={18} /></button>
          <span className="text-sm font-black text-slate-700 min-w-[140px] text-center tracking-tight">{monthName} {viewYear}</span>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-emerald-600 shadow-sm"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* VISUAL SUMMARY SECTION */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <PieIcon size={20} />
              </div>
              Spending Distribution ({monthName})
            </h3>
            
            {periodStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.length ? chartData : [{ name: 'Empty', value: 1 }]}
                        cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value"
                        animationBegin={0} animationDuration={1000}
                      >
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                        {!chartData.length && <Cell fill="#f1f5f9" stroke="none" />}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-black text-slate-800">{periodStats.reduce((a, b) => a + b.spent, 0).toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Dh Spent</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {periodStats.map((s, idx) => (
                    <div key={s.category} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-sm font-bold text-slate-700">{s.icon} {s.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800">{s.spent.toLocaleString()} Dh</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {Math.round((s.spent / (periodStats.reduce((a, b) => a + b.spent, 0) || 1)) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                <PieIcon size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-slate-400">No spending data for this period.</p>
              </div>
            )}
          </div>
        </div>

        {/* SETTINGS / ADD SECTION */}
        <div className="space-y-8">
          {/* Category Management */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-indigo-600">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <LayoutGrid size={20} />
              </div>
              Categories
            </h3>
            
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add New Classification</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Name..."
                    className="flex-1 p-3 bg-slate-100 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold w-full"
                  />
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={(e) => {
                        const menu = (e.currentTarget.nextSibling as HTMLElement);
                        menu.classList.toggle('hidden');
                      }}
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-2xl text-xl hover:bg-white transition-all shadow-sm"
                    >
                      {newCatIcon}
                    </button>
                    <div className="hidden absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 grid grid-cols-4 p-2 gap-1 overflow-y-auto max-h-40">
                      {EMOJIS.map(e => (
                        <button 
                          key={e} 
                          type="button" 
                          onClick={(evt) => {
                            setNewCatIcon(e);
                            (evt.currentTarget.parentElement as HTMLElement).classList.add('hidden');
                          }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-50 transition-all ${newCatIcon === e ? 'bg-indigo-100' : ''}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex-shrink-0"><Plus size={24} /></button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <div key={cat.name} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-2xl group transition-all hover:bg-white hover:border-indigo-200 hover:shadow-sm">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-[10px] font-black text-slate-700 uppercase">{cat.name}</span>
                    <button onClick={() => removeCategory(cat.name)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Budget Setup Form */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-emerald-600">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Target size={20} />
              </div>
              Define Budget
            </h3>
            <form onSubmit={handleAddBudget} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Category</label>
                <select 
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                >
                  <option value="">Choose Category...</option>
                  {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Limit (Dh)</label>
                <div className="relative">
                   <input 
                    type="number" 
                    value={budgetForm.limit || ''}
                    onChange={(e) => setBudgetForm({...budgetForm, limit: Number(e.target.value)})}
                    placeholder="0.00"
                    className="w-full p-4 bg-slate-100 border-2 border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-black text-xl transition-all"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">Dh</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <RefreshCcw size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs font-black text-slate-700 block">Surplus Rollover</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setBudgetForm({...budgetForm, rollover: !budgetForm.rollover})}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${budgetForm.rollover ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${budgetForm.rollover ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 shadow-xl active:scale-[0.98] transition-all text-sm uppercase tracking-widest">Secure Budget</button>
            </form>
          </div>
        </div>
      </div>

      {/* DETAILED CARDS VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {periodStats.map(s => {
          const isExceeded = s.spent >= s.totalLimit;
          const isWarning = s.spent >= s.totalLimit * 0.8 && !isExceeded;

          return (
            <div key={s.category} className={`p-6 sm:p-8 rounded-[2rem] border-2 group relative transition-all hover:shadow-2xl overflow-hidden ${isExceeded ? 'bg-rose-50 border-rose-100' : isWarning ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100'}`}>
              <div className="absolute -right-4 -bottom-4 text-7xl sm:text-8xl opacity-5 grayscale group-hover:grayscale-0 transition-all rotate-12 group-hover:scale-125">
                {s.icon}
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-slate-800">{s.category}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {s.rollover && (
                        <span className="text-[8px] sm:text-[9px] font-black text-indigo-500 flex items-center gap-1 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          <RefreshCcw size={10} /> Rollover
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeBudget(s.category)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors bg-white rounded-xl shadow-sm"><Trash2 size={16} /></button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Expended</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{s.spent.toLocaleString()} <span className="text-xs font-bold text-slate-400">Dh</span></p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Threshold</p>
                    <div className="flex flex-col items-end">
                      <p className={`text-base sm:text-lg font-black ${isExceeded ? 'text-rose-600' : 'text-slate-600'}`}>
                        {s.totalLimit.toLocaleString()} Dh
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-slate-100/50 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isExceeded ? 'bg-gradient-to-r from-rose-400 to-rose-600' : isWarning ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
                      style={{ width: `${Math.min(100, s.percentage)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ${isExceeded ? 'bg-rose-100 text-rose-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {s.percentage}% Used
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {periodStats.length === 0 && (
          <div className="lg:col-span-3 py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 flex flex-col items-center justify-center text-slate-300 space-y-6">
             <div className="p-8 bg-slate-50 rounded-full shadow-inner"><PieIcon size={48} className="opacity-40" /></div>
             <p className="text-lg font-black text-slate-400">No Budgets Defined</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
