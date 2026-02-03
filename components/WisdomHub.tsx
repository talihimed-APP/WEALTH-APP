
import React, { useState } from 'react';
import { Quote } from '../types';
import { Quote as QuoteIcon, BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface WisdomHubProps {
  quotes: Quote[];
}

const WisdomHub: React.FC<WisdomHubProps> = ({ quotes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const current = quotes[currentIndex];

  return (
    <div className="space-y-12">
      {/* Hero Quote Card */}
      <div className="relative overflow-hidden bg-emerald-900 text-white rounded-[2rem] p-8 md:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <QuoteIcon size={200} />
        </div>
        
        <div className="max-w-3xl relative z-10 mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/50 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-widest border border-emerald-700/50">
            <Sparkles size={14} /> Wisdom of the Day
          </div>
          
          <h3 className="text-3xl md:text-5xl font-serif italic leading-tight">
            "{current.text}"
          </h3>
          
          <div className="space-y-2">
            <p className="text-xl font-bold text-emerald-400">— {current.author}</p>
            {current.book && (
              <p className="text-sm text-emerald-200/60 flex items-center justify-center gap-1 italic">
                <BookOpen size={14} /> from {current.book}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={prevQuote}
              className="p-4 bg-emerald-800 hover:bg-emerald-700 rounded-full transition-colors text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextQuote}
              className="p-4 bg-emerald-800 hover:bg-emerald-700 rounded-full transition-colors text-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Quote Grid (Top 20 Preview) */}
      <div>
        <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <BookOpen className="text-emerald-600" />
          The Library of Prosperity
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((q, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
                idx === currentIndex 
                  ? 'bg-emerald-50 border-emerald-200 scale-105 shadow-md' 
                  : 'bg-white border-slate-100 hover:border-emerald-100 hover:shadow-sm'
              }`}
            >
              <QuoteIcon size={24} className={`mb-4 transition-colors ${idx === currentIndex ? 'text-emerald-500' : 'text-slate-200 group-hover:text-emerald-200'}`} />
              <p className="text-slate-700 font-medium line-clamp-3 mb-4 italic">
                "{q.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">— {q.author}</span>
                {q.book && <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded uppercase">Classic</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Hint */}
      <div className="text-center pb-12">
        <p className="text-slate-400 text-sm">"Financial freedom is a mental, emotional and educational process."</p>
      </div>
    </div>
  );
};

export default WisdomHub;
