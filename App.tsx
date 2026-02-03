
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  MessageSquareQuote, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CircleDollarSign,
  PieChart as PieIcon,
  Settings,
  Sparkles,
  CloudCheck
} from 'lucide-react';
import { Transaction, Goal, TransactionType, IncomeCategory, ExpenseType, Budget, CustomCategory } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_GOALS, FINANCIAL_WISDOM } from './constants';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import Objectives from './components/Objectives';
import WisdomHub from './components/WisdomHub';
import BudgetManager from './components/BudgetManager';
import AIInsights from './components/AIInsights';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'objectives' | 'budgets' | 'wisdom' | 'ai'>('dashboard');
  
  // Persistent State Initialization
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ww_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('ww_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('ww_budgets');
    return saved ? JSON.parse(saved) : [
      { category: 'Rent', limit: 1600, rollover: false, icon: '🏠' },
      { category: 'Groceries', limit: 500, rollover: true, icon: '🛒' },
      { category: 'Dining', limit: 300, rollover: false, icon: '🍱' }
    ];
  });

  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem('ww_categories');
    return saved ? JSON.parse(saved) : [
      { name: 'Rent', icon: '🏠' },
      { name: 'Groceries', icon: '🛒' },
      { name: 'Utilities', icon: '⚡' },
      { name: 'Dining', icon: '🍱' },
      { name: 'Entertainment', icon: '🎬' },
      { name: 'Transport', icon: '🚗' }
    ];
  });

  // Persist to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('ww_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ww_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('ww_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('ww_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const fixedExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.expenseType === ExpenseType.FIXED)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const variableExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.expenseType === ExpenseType.VARIABLE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const freelanceIncome = transactions
      .filter(t => t.category === IncomeCategory.FREELANCE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const roiIncome = transactions
      .filter(t => t.category === IncomeCategory.ROI)
      .reduce((acc, curr) => acc + curr.amount, 0);

    return { 
      totalIncome, 
      totalExpenses, 
      balance: totalIncome - totalExpenses,
      fixedExpenses,
      variableExpenses,
      freelanceIncome,
      roiIncome
    };
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction = { ...newTx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goal = { ...newGoal, id: Math.random().toString(36).substr(2, 9) };
    setGoals(prev => [...prev, goal]);
  };

  const handleUpdateGoalProgress = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} transactions={transactions} goals={goals} budgets={budgets} />;
      case 'transactions':
        return (
          <TransactionsList 
            transactions={transactions} 
            categories={customCategories.map(c => c.name)}
            onAdd={handleAddTransaction} 
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        );
      case 'objectives':
        return <Objectives goals={goals} onAdd={handleAddGoal} onProgress={handleUpdateGoalProgress} />;
      case 'budgets':
        return (
          <BudgetManager 
            budgets={budgets} 
            setBudgets={setBudgets} 
            transactions={transactions}
            categories={customCategories}
            setCategories={setCustomCategories}
          />
        );
      case 'wisdom':
        return <WisdomHub quotes={FINANCIAL_WISDOM} />;
      case 'ai':
        return <AIInsights transactions={transactions} goals={goals} budgets={budgets} stats={stats} />;
      default:
        return <Dashboard stats={stats} transactions={transactions} goals={goals} budgets={budgets} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-900">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">WealthWise</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')}
            icon={<Wallet size={20} />} 
            label="Cash Flow" 
          />
          <NavItem 
            active={activeTab === 'budgets'} 
            onClick={() => setActiveTab('budgets')}
            icon={<PieIcon size={20} />} 
            label="Budgets" 
          />
          <NavItem 
            active={activeTab === 'objectives'} 
            onClick={() => setActiveTab('objectives')}
            icon={<Target size={20} />} 
            label="Objectives" 
          />
          <NavItem 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')}
            icon={<Sparkles size={20} className="text-amber-500" />} 
            label="AI Insights" 
          />
          <NavItem 
            active={activeTab === 'wisdom'} 
            onClick={() => setActiveTab('wisdom')}
            icon={<MessageSquareQuote size={20} />} 
            label="Wisdom" 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
             <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
               <span>Sync Engine</span>
               <CloudCheck size={12} className="text-emerald-500" />
             </div>
             <p className="text-[10px] text-slate-500 leading-tight">Your data is secured locally in this browser.</p>
          </div>
          <div className="bg-emerald-600 rounded-2xl p-4 shadow-xl shadow-emerald-100 text-white">
            <p className="text-[10px] font-black uppercase mb-1 opacity-80">Available Liquidity</p>
            <p className="text-xl font-black">{stats.balance.toLocaleString()} Dh</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black capitalize tracking-tight text-slate-800">
                {activeTab === 'ai' ? 'Smart Advisor' : activeTab}
              </h2>
              <p className="text-slate-500 text-sm font-medium">Navigating your prosperity journey</p>
            </div>
            <button 
              onClick={() => setActiveTab('transactions')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline font-bold">New Entry</span>
            </button>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm ring-1 ring-emerald-100' 
        : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
    }`}
  >
    <span className={active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}>
      {icon}
    </span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default App;
