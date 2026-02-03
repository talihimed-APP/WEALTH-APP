
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal, Budget } from '../types';
import { 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Loader2,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Download,
  Upload,
  Database,
  RefreshCw
} from 'lucide-react';

interface AIInsightsProps {
  transactions: Transaction[];
  goals: Goal[];
  budgets: Budget[];
  stats: any;
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions, goals, budgets, stats }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Act as a elite financial advisor. Analyze the following data and provide 3 brief, high-impact sections: 
        1. Financial Health Score (out of 100)
        2. Immediate Leaks/Warnings
        3. A "Prosperity Move" (personalized advice).
        Keep it professional, encouraging, and punchy.

        DATA:
        - Income: ${stats.totalIncome} Dh
        - Expenses: ${stats.totalExpenses} Dh (Fixed: ${stats.fixedExpenses}, Variable: ${stats.variableExpenses})
        - Current Balance: ${stats.balance} Dh
        - Active Goals: ${goals.length} (Total progress: ${goals.reduce((a, g) => a + (g.currentAmount/g.targetAmount), 0) / goals.length * 100}%)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setInsight("Unable to connect to the advisor. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('ww_transactions') || '[]'),
      goals: JSON.parse(localStorage.getItem('ww_goals') || '[]'),
      budgets: JSON.parse(localStorage.getItem('ww_budgets') || '[]'),
      categories: JSON.parse(localStorage.getItem('ww_categories') || '[]'),
      version: '1.0',
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wealthwise_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (confirm("This will overwrite your current local data. Continue?")) {
          localStorage.setItem('ww_transactions', JSON.stringify(json.transactions));
          localStorage.setItem('ww_goals', JSON.stringify(json.goals));
          localStorage.setItem('ww_budgets', JSON.stringify(json.budgets));
          localStorage.setItem('ww_categories', JSON.stringify(json.categories));
          window.location.reload();
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <BrainCircuit size={300} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 mb-6">
            <Sparkles size={12} /> Powered by Gemini Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">Your Smart <br/>Financial Co-Pilot</h2>
          <p className="text-indigo-100 text-lg font-medium opacity-80 mb-8">Deep analysis of your spending patterns to unlock your maximum prosperity.</p>
          
          <button 
            onClick={generateInsights}
            disabled={loading}
            className="group flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
            {loading ? 'Consulting Advisor...' : 'Initiate Full Analysis'}
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Insight & Backup Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {insight ? (
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-xl animate-in slide-in-from-bottom-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Executive Report</h3>
              </div>
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed font-medium">
                {insight}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 text-center">
               <div className="p-8 bg-slate-50 rounded-full mb-6 text-slate-200">
                 <BrainCircuit size={48} />
               </div>
               <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Advisor Ready</h3>
               <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mt-2 italic">Run an analysis to see your financial health report.</p>
            </div>
          )}
        </div>

        {/* Persistence Hub (Free Persistence Solution) */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4">
              <Database size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2">Data Vault</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
              Vercel hosting is static. To keep your data across devices for free, download a backup and import it elsewhere.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={exportData}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3 rounded-xl text-xs font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <Download size={16} /> Export JSON Backup
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-600 py-3 rounded-xl text-xs font-black hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95"
              >
                <Upload size={16} /> Import Data File
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={importData} 
                className="hidden" 
                accept=".json"
              />
            </div>
          </div>

          <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl w-fit mb-4">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-lg font-black text-amber-800 mb-2">Vercel Setup Tip</h4>
            <p className="text-xs text-amber-700/80 leading-relaxed font-medium">
              Don't forget to add your <strong>API_KEY</strong> in the Vercel dashboard environment variables to keep AI working after deploy!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
