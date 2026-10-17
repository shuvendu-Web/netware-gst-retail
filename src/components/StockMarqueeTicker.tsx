import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Newspaper, 
  Flame, 
  Pause, 
  Play, 
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface MarketIndex {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

interface NewsItem {
  id: string;
  tag: string;
  tagColor: string;
  headline: string;
  source: string;
  time: string;
}

const MARKET_INDICES: MarketIndex[] = [
  { symbol: 'NIFTY 50', name: 'Nifty 50', price: '24,852.15', change: '+118.40', changePercent: '+0.48%', isPositive: true },
  { symbol: 'SENSEX', name: 'BSE Sensex', price: '81,420.30', change: '+285.60', changePercent: '+0.35%', isPositive: true },
  { symbol: 'BANK NIFTY', name: 'Bank Nifty', price: '52,140.80', change: '+320.15', changePercent: '+0.62%', isPositive: true },
  { symbol: 'NIFTY IT', name: 'Nifty IT', price: '38,910.50', change: '+410.20', changePercent: '+1.06%', isPositive: true },
  { symbol: 'BSE MIDCAP', name: 'BSE MidCap', price: '46,120.45', change: '-82.10', changePercent: '-0.18%', isPositive: false },
  { symbol: 'GOLD (10g)', name: 'Gold MCX', price: '₹76,450', change: '+190.00', changePercent: '+0.25%', isPositive: true },
  { symbol: 'SILVER (1kg)', name: 'Silver MCX', price: '₹91,200', change: '+450.00', changePercent: '+0.50%', isPositive: true },
  { symbol: 'CRUDE OIL', name: 'Crude Oil', price: '₹6,180', change: '-52.00', changePercent: '-0.84%', isPositive: false },
  { symbol: 'USD/INR', name: 'USD to INR', price: '₹84.06', change: '-0.02', changePercent: '-0.02%', isPositive: true },
];

const MARKET_NEWS: NewsItem[] = [
  {
    id: 'n1',
    tag: 'GST POLICY',
    tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    headline: 'GST Council: GoM recommends tax slab rationalization for FMCG & essential retail supplies',
    source: 'Financial Express',
    time: '12m ago'
  },
  {
    id: 'n2',
    tag: 'FII FLOWS',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    headline: 'FIIs turn net buyers with ₹2,450 Cr inflow; Sensex & Nifty touch weekly highs',
    source: 'LiveMint',
    time: '25m ago'
  },
  {
    id: 'n3',
    tag: 'RETAIL BOOM',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    headline: 'Retail billing & apparel sales surge 16.8% YoY across Tier-1 & Tier-2 hubs',
    source: 'Economic Times',
    time: '40m ago'
  },
  {
    id: 'n4',
    tag: 'RBI UPDATE',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    headline: 'RBI holds repo rate at 6.50%; economic growth projection stands resilient at 7.2%',
    source: 'Bloomberg India',
    time: '1h ago'
  },
  {
    id: 'n5',
    tag: 'PAYMENTS',
    tagColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    headline: 'Merchant UPI volume sets record 15.2 Billion monthly transactions nationwide',
    source: 'TechCrunch',
    time: '1h ago'
  }
];

export const StockMarqueeTicker: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'indices' | 'news'>('all');

  if (isCollapsed) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-300">Live Markets & Stock News Hidden</span>
        </div>
        <button 
          onClick={() => setIsCollapsed(false)}
          className="flex items-center space-x-1 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          <span>Show Ticker</span>
        </button>
      </div>
    );
  }

  // Combine items according to filterMode
  const renderItemSet = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center space-x-6 shrink-0 pr-6">
      {(filterMode === 'all' || filterMode === 'indices') && (
        MARKET_INDICES.map((item, idx) => (
          <div 
            key={`${keyPrefix}-idx-${idx}`}
            className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 px-3 py-1 rounded-xl border border-slate-700/60 shadow-xs transition-colors cursor-pointer group"
          >
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
              {item.symbol}
            </span>
            <span className="text-xs font-black text-slate-100 font-mono">
              {item.price}
            </span>
            <span className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
              item.isPositive 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {item.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {item.changePercent}
            </span>
          </div>
        ))
      )}

      {(filterMode === 'all' || filterMode === 'news') && (
        MARKET_NEWS.map((news, idx) => (
          <div 
            key={`${keyPrefix}-news-${idx}`}
            className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-800 px-3 py-1 rounded-xl border border-slate-700/50 transition-colors cursor-pointer group"
          >
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${news.tagColor}`}>
              {news.tag}
            </span>
            <span className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 transition-colors max-w-sm truncate">
              {news.headline}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              • {news.time}
            </span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 text-slate-100 shadow-sm z-20 flex items-center h-11 select-none overflow-hidden">
      {/* Fixed Left Header / Badge */}
      <div className="flex items-center space-x-2.5 px-4 h-full bg-slate-950/95 border-r border-slate-800/80 z-20 shrink-0 shadow-md">
        <div className="flex items-center space-x-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          </span>
          <span className="text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
            LIVE MARKET
          </span>
        </div>

        {/* Sentiment Badge */}
        <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
          <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-400" />
          BULLISH +0.48%
        </span>

        {/* Filter Pills */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
          <button 
            onClick={() => setFilterMode('all')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              filterMode === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterMode('indices')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              filterMode === 'indices' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Indices
          </button>
          <button 
            onClick={() => setFilterMode('news')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              filterMode === 'news' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            News
          </button>
        </div>
      </div>

      {/* Marquee Scrolling Area */}
      <div 
        className="flex-1 overflow-hidden h-full flex items-center relative mask-fade-edges"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="animate-marquee-track flex items-center"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {/* Render two identical sets for seamless continuous marquee loop */}
          {renderItemSet('set1')}
          {renderItemSet('set2')}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 px-3 h-full bg-slate-950/95 border-l border-slate-800/80 z-20 shrink-0">
        <button
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? "Resume Marquee" : "Pause Marquee"}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setIsCollapsed(true)}
          title="Minimize Ticker"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
