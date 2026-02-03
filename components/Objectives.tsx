
import React, { useState, useMemo } from 'react';
import { Goal } from '../types';
import { 
  Plus, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Calendar, 
  Trophy, 
  Zap, 
  Target, 
  Wallet,
  Sparkles,
  ChevronRight,
  Clock,
  X
} from 'lucide-react';

interface ObjectivesProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id'>) => void;
  onProgress: (id: string, amount: number) => void;
}

const Objectives: React.FC<ObjectivesProps> = ({ goals, onAdd, onProgress }) => {
  const [showForm, setShowForm] = useState(false);
  const [addFundsGoalId, setAddFundsGoalId] = useState<string | null>(null);
  const [fundsAmount, setFundsAmount] = useState<number>(0);
  
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    icon: '🎯'
  });

  const stats = useMemo(() => {
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const completed = goals.filter(g => g.currentAmount >= g.targetAmount).length;
    return {
      totalTarget,
      totalSaved,
      progress: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
      activeCount: goals.length - completed,
      completedCount: completed
    };
  }, [goals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.targetAmount <= 0) return;
    onAdd(newGoal);
    setShowForm(false);
    setNewGoal({ name: '', targetAmount: 0, currentAmount: 0, deadline: '', icon: '🎯' });
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (addFundsGoalId && fundsAmount > 0) {
      onProgress(addFundsGoalId, fundsAmount);
      setAddFundsGoalId(null);
      setFundsAmount(0);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Global Goals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-100 flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Total Progress</p>
            <h4 className="text-3xl font-black">{stats.totalSaved.toLocaleString()}<span className="text-sm font-normal opacity-60 ml-1">Dh</span></h4>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 w-24 bg-emerald-800 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${stats.progress}%` }} />
              </div>
              <span className="text-[10px] font-black">{Math.round(stats.progress)}% Saved</span>
            </div>
          </div>
          <Target className="absolute -right-4 -bottom-4 text-emerald-500/30 rotate-12 group-hover:scale-125 transition-transform" size={120} />
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achievements</p>
            <h4 className="text-2xl font-black text-slate-800">{stats.completedCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Fully Funded Goals</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
            <Zap size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Focus</p>
            <h4 className="text-2xl font-black text-slate-800">{stats.activeCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Ongoing Milestones</p>
          </div>
        </div>
      </div>

      {/* 2. Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Create Trigger */}
        <button 
          onClick={() => setShowForm(true)}
          className="group relative h-[380px] bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all duration-500"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center group-hover:bg-emerald-100 group-hover:rotate-90 transition-all duration-500">
            <Plus size={32} className="text-slate-400 group-hover:text-emerald-600" />
          </div>
          <div className="text-center">
            <h5 className="text-lg font-black text-slate-700 group-hover:text-emerald-700">Map New Goal</h5>
            <p className="text-sm text-slate-400 font-medium mt-1 px-8">Define your next major financial milestone</p>
          </div>
          <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
            Start Planning <ArrowRight size={12} />
          </div>
        </button>

        {goals.map(goal => {
          const isCompleted = goal.currentAmount >= goal.targetAmount;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const progressPercent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const deadlineDate = new Date(goal.deadline);
          const daysLeft = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div 
              key={goal.id} 
              className={`h-[380px] rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 group relative overflow-hidden ${
                isCompleted 
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl shadow-emerald-200' 
                  : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2'
              }`}
            >
              {/* Background Decor */}
              <div className={`absolute -right-4 -top-4 text-[120px] opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform ${isCompleted ? 'text-white' : 'text-slate-900'}`}>
                {goal.icon}
              </div>

              {/* Card Header */}
              <div className="relative z-10 flex justify-between items-start">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${isCompleted ? 'bg-white/20 backdrop-blur-md' : 'bg-slate-50 border border-slate-100'}`}>
                  {goal.icon}
                </div>
                <div className="text-right">
                  {isCompleted ? (
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                      <Sparkles size={12} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Achieved</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Gap to Fill</p>
                      <p className="text-xl font-black text-slate-800 tracking-tight">{remaining.toLocaleString()} Dh</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="relative z-10 space-y-4">
                <div>
                  <h4 className={`text-2xl font-black tracking-tight leading-tight ${isCompleted ? 'text-white' : 'text-slate-800'}`}>
                    {goal.name}
                  </h4>
                  <div className={`flex items-center gap-4 mt-2 ${isCompleted ? 'text-emerald-100' : 'text-slate-400'}`}>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={12} /> {deadlineDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </div>
                    {daysLeft > 0 && !isCompleted && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500">
                        <Clock size={12} /> {daysLeft} Days Left
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-100' : 'text-slate-400'}`}>
                      Funding Progress
                    </p>
                    <p className={`text-lg font-black ${isCompleted ? 'text-white' : 'text-emerald-600'}`}>
                      {progressPercent}%
                    </p>
                  </div>
                  <div className={`h-4 rounded-full p-1 ${isCompleted ? 'bg-emerald-800/40' : 'bg-slate-100 shadow-inner'}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isCompleted ? 'bg-white' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold opacity-60">
                    <span>{goal.currentAmount.toLocaleString()} Dh</span>
                    <span>{goal.targetAmount.toLocaleString()} Dh</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="relative z-10 pt-4 flex gap-3">
                {!isCompleted ? (
                  <>
                    <button 
                      onClick={() => setAddFundsGoalId(goal.id)}
                      className="flex-1 bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 active:scale-95"
                    >
                      <Wallet size={16} /> Fuel Progress
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-300 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                      <CheckCircle2 size={20} />
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-white/20 backdrop-blur-md text-white py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border border-white/30 hover:bg-white/30 transition-all">
                    View Celebration <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Modal: Fuel Objective (Add Funds) */}
      {addFundsGoalId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex justify-center items-start sm:items-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-300 my-4 sm:my-auto">
             <div className="flex justify-end -mt-4 -mr-4 mb-2">
               <button onClick={() => {setAddFundsGoalId(null); setFundsAmount(0);}} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                 <X size={20} />
               </button>
             </div>
             <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                  <TrendingUp size={32} />
               </div>
               <h3 className="text-xl sm:text-2xl font-black text-slate-800">Fuel Your Objective</h3>
               <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Goal: {goals.find(g => g.id === addFundsGoalId)?.name}</p>
             </div>
             
             <form onSubmit={handleAddFunds} className="space-y-6 sm:space-y-8">
                <div className="relative group">
                  <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-xl sm:text-2xl font-black text-slate-300 group-focus-within:text-emerald-500 transition-colors">Dh</span>
                  </div>
                  <input 
                    type="number" 
                    autoFocus
                    value={fundsAmount || ''}
                    onChange={(e) => setFundsAmount(Number(e.target.value))}
                    className="w-full pl-16 sm:pl-20 pr-6 sm:pr-8 py-6 sm:py-8 bg-slate-100 border-2 border-slate-200 rounded-[2rem] text-3xl sm:text-4xl font-black outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {[100, 500, 1000, 2500].map(amt => (
                    <button 
                      key={amt} 
                      type="button" 
                      onClick={() => setFundsAmount(amt)}
                      className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${fundsAmount === amt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50'}`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
                   <button type="button" onClick={() => {setAddFundsGoalId(null); setFundsAmount(0);}} className="order-2 sm:order-1 flex-1 py-4 font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest text-[10px]">Discard</button>
                   <button 
                    type="submit" 
                    disabled={fundsAmount <= 0}
                    className="order-1 sm:order-2 flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    Confirm <Sparkles size={16}/>
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Forge New Goal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-lg z-[100] flex justify-center items-start sm:items-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 my-4 sm:my-auto">
            <div className="flex justify-between items-start mb-6 sm:mb-10">
              <div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-800 leading-tight">Forge New <br className="hidden sm:block"/>Objective</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-2">Strategize your path to financial freedom.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                 <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Visual Identifier</label>
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
                  {['🏠', '🚗', '📱', '✈️', '🎓', '💍', '🎮', '🏝️', '🚲', '💼', '🏡', '⛰️'].map(emoji => (
                    <button 
                      key={emoji}
                      type="button"
                      onClick={() => setNewGoal({...newGoal, icon: emoji})}
                      className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 ${newGoal.icon === emoji ? 'bg-emerald-600 text-white scale-110 shadow-xl ring-4 ring-emerald-50' : 'bg-slate-50 grayscale hover:grayscale-0 hover:bg-white border border-transparent hover:border-slate-100'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                  <input 
                    type="text" 
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    className="w-full p-4 sm:p-5 bg-slate-100 border-2 border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white font-bold transition-all text-slate-800" 
                    placeholder="e.g. Retirement Fund"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Capital (Dh)</label>
                  <input 
                    type="number" 
                    value={newGoal.targetAmount || ''}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                    className="w-full p-4 sm:p-5 bg-slate-100 border-2 border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white font-black text-lg sm:text-xl transition-all text-slate-800" 
                    placeholder="50,000"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Desired Fulfillment Date</label>
                  <input 
                    type="date" 
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full p-4 sm:p-5 bg-slate-100 border-2 border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white font-bold transition-all text-slate-800" 
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="order-2 sm:order-1 flex-1 py-4 font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest text-[10px] sm:text-[11px]"
                >
                  Discard Intent
                </button>
                <button 
                  type="submit"
                  className="order-1 sm:order-2 flex-[2] py-4 sm:py-5 bg-emerald-600 text-white rounded-2xl sm:rounded-3xl font-black hover:bg-emerald-700 shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Initialize Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Objectives;
