
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, IncomeCategory, ExpenseType } from '../types';
import { Search, Filter, Plus, Calendar, Tag, Info, Edit2, Trash2, X, Check } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: string[];
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onUpdate: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

type TimeFilter = 'All' | 'Day' | 'Week' | 'Month' | 'Year';

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, categories, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: TransactionType.INCOME,
    category: 'Salary',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: '',
    expenseType: ExpenseType.FIXED
  });

  const filteredTransactions = useMemo(() => {
    let list = transactions.filter(t => 
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.note.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const now = new Date();
    if (timeFilter === 'Day') {
      list = list.filter(t => new Date(t.date).toDateString() === now.toDateString());
    } else if (timeFilter === 'Week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(t => new Date(t.date) >= oneWeekAgo);
    } else if (timeFilter === 'Month') {
      list = list.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (timeFilter === 'Year') {
      list = list.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
    }

    return list;
  }, [transactions, timeFilter, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      onAdd(formData);
    }
    setShowAddForm(false);
    resetForm();
  };

  const handleEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setFormData({
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      date: tx.date,
      note: tx.note,
      expenseType: tx.expenseType
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: TransactionType.INCOME,
      category: 'Salary',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      note: '',
      expenseType: ExpenseType.FIXED
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Transaction Control Panel */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search memo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {['All', 'Day', 'Week', 'Month', 'Year'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter as TimeFilter)}
                className={`flex-1 px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  timeFilter === filter ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="w-full md:w-auto">
            <button 
              onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-50 transition-all active:scale-95"
            >
              <Plus size={18} /> Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-emerald-500 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
            <button onClick={() => { setShowAddForm(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: TransactionType.INCOME})}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${formData.type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: TransactionType.EXPENSE})}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${formData.type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Expense
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-100"
                required
              >
                {formData.type === TransactionType.INCOME ? (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="ROI">ROI</option>
                    <option value="Other">Other Income</option>
                  </>
                ) : (
                  categories.map(c => <option key={c} value={c}>{c}</option>)
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (Dh)</label>
              <input 
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                className="w-full p-2.5 border border-slate-200 bg-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2.5 border border-slate-200 bg-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            {formData.type === TransactionType.EXPENSE && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Expense Nature</label>
                <select 
                  value={formData.expenseType}
                  onChange={(e) => setFormData({...formData, expenseType: e.target.value as ExpenseType})}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-100"
                >
                  <option value={ExpenseType.FIXED}>Fixed (Recurring)</option>
                  <option value={ExpenseType.VARIABLE}>Variable</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Notes</label>
              <input 
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="w-full p-2.5 border border-slate-200 bg-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Brief description..."
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row justify-end gap-3 mt-4">
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => onDelete(editingId)}
                  className="order-2 sm:order-1 px-6 py-2.5 text-rose-600 font-bold border border-rose-100 rounded-xl hover:bg-rose-50 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
              <button 
                type="submit"
                className="order-1 sm:order-2 px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-50 flex items-center justify-center gap-2"
              >
                <Check size={18} /> {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Memo & Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Classification</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{tx.category}</p>
                      <p className="text-xs text-slate-400">{tx.note || 'No notes'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.type === TransactionType.INCOME ? (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase flex items-center gap-1">
                          <Tag size={10} /> Income
                        </span>
                      ) : (
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase flex items-center gap-1 ${tx.expenseType === ExpenseType.FIXED ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                          <Info size={10} /> {tx.expenseType}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === TransactionType.INCOME ? '+' : '-'}{tx.amount.toLocaleString()} Dh
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleEdit(tx)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;
