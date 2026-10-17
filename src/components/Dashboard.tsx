import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  ShoppingBag, 
  Boxes, 
  Users, 
  Sparkles, 
  FileText, 
  Plus, 
  BarChart3, 
  AlertTriangle, 
  Clock,
  Search,
  CheckCircle2,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudFog,
  Snowflake,
  Sunrise,
  Sunset,
  Calendar,
  CreditCard,
  Zap
} from 'lucide-react';
import { Product, Invoice, PurchaseOrder, Party, TabType } from '../types';
import { useWeatherAndTime, WeatherIconType } from '../utils/useWeatherAndTime';
import { GridBackground } from '@/components/ui/grid-background';
import { HoloToggle } from './ui/HoloToggle';

interface DashboardProps {
  products: Product[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  parties: Party[];
  setCurrentTab: (tab: TabType) => void;
  onOpenNewSale: () => void;
  onOpenNewPurchase: () => void;
  onOpenAddProduct: () => void;
  isAutoHealingActive?: boolean;
  onToggleAutoHeal?: (active: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  invoices,
  purchaseOrders,
  parties,
  setCurrentTab,
  onOpenNewSale,
  onOpenNewPurchase,
  onOpenAddProduct,
  isAutoHealingActive,
  onToggleAutoHeal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiCandidates, setAiCandidates] = useState<any[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  // Calculate stats
  const totalSales = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.openingStock * p.purchasePrice), 0);
  const totalReceivables = parties.filter(p => p.type === 'Customer').reduce((acc, p) => acc + p.currentOutstanding, 0);
  const totalGSTCollected = invoices.reduce((acc, inv) => acc + inv.totalTax, 0);

  const {
    timeOfDay,
    greeting,
    greetingEmoji,
    greetingSubtitle,
    formattedDate,
    formattedTime,
    cardGradient,
    weather,
  } = useWeatherAndTime();

  const renderWeatherIcon = (iconType: WeatherIconType, isNight: boolean) => {
    switch (iconType) {
      case 'moon':
        return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      case 'cloud-moon':
        return <CloudMoon className="w-3.5 h-3.5 text-indigo-300" />;
      case 'cloud-sun':
        return <CloudSun className="w-3.5 h-3.5 text-amber-500" />;
      case 'cloud':
        return <CloudSun className="w-3.5 h-3.5 text-sky-400" />;
      case 'cloud-rain':
        return <CloudRain className="w-3.5 h-3.5 text-blue-500" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-3.5 h-3.5 text-amber-400" />;
      case 'cloud-fog':
        return <CloudFog className="w-3.5 h-3.5 text-slate-400" />;
      case 'snowflake':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-400" />;
      case 'sun':
      default:
        return isNight ? (
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        );
    }
  };

  const renderGreetingIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sunrise className="w-5 h-5 text-amber-500" />;
      case 'afternoon':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'evening':
        return <Sunset className="w-5 h-5 text-purple-600" />;
      case 'night':
        return <Moon className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchingAI(true);
    try {
      const res = await fetch('/api/ai-product-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, industry: 'Garments' })
      });
      const data = await res.json();
      setAiCandidates(data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingAI(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* 1. Full View Welcome Blob Card */}
      <div className="card welcome-blob-card w-full">
        <div className="blob"></div>
        <div className="bg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
            {/* Left Content */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-full shadow-xs border border-white/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200">
                  {renderWeatherIcon(weather.iconType, weather.isNight)}
                  <span>{weather.temperature}°C • {weather.condition}</span>
                  <span className="text-[10px] text-slate-400">• {weather.city}</span>
                </div>
                <div className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>GST Billing Active</span>
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center flex-wrap gap-2.5 text-slate-900 dark:text-white">
                <span className="fx-karaoke" role="img" aria-label={greeting}>
                  {greeting.split('').map((char, index) => (
                    <b 
                      key={`${greeting}-${index}`} 
                      aria-hidden="true" 
                      style={{ '--i': index } as React.CSSProperties}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </b>
                  ))}
                </span>
                <span className="text-2xl sm:text-3xl select-none">{greetingEmoji}</span>
                <span className="p-1.5 rounded-xl bg-white/70 dark:bg-slate-800/70 shadow-xs border border-white/60 dark:border-slate-700/60 inline-flex items-center justify-center">
                  {renderGreetingIcon()}
                </span>
              </h2>

              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 text-purple-500" /> {formattedTime}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {greetingSubtitle}
                </span>
              </div>
            </div>

            {/* Right: Holographic Auto-Healing Cyber Switch & Action Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="autoheal-trigger-card flex flex-col items-center p-2.5 px-4 bg-slate-100/90 dark:bg-slate-950/90 rounded-2xl border border-slate-300/80 dark:border-indigo-500/30 shadow-md dark:shadow-xl backdrop-blur-md transition-all">
                <div className="text-[10px] font-mono tracking-widest text-slate-700 dark:text-cyan-400 font-black mb-1.5 uppercase flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isAutoHealingActive ? 'bg-emerald-500 animate-ping' : 'bg-indigo-600 dark:bg-cyan-400'}`}></span>
                  {isAutoHealingActive ? '⚡ HEALING IN PROGRESS' : 'AUTO-HEAL TRIGGER'}
                </div>
                <HoloToggle
                  id="dashboard-holo-toggle"
                  checked={!!isAutoHealingActive}
                  onChange={(checked) => onToggleAutoHeal && onToggleAutoHeal(checked)}
                  label={isAutoHealingActive ? "HEALING RUNNING..." : "CLICK TO AUTO-HEAL"}
                />
              </div>

              <div className="flex sm:flex-col gap-2.5 shrink-0">
                <button 
                  type="button"
                  onClick={onOpenNewSale}
                  className="btn btn-green"
                  title="Create New Invoice"
                >
                  <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>New Invoice</span>
                </button>
                <button 
                  type="button"
                  onClick={onOpenAddProduct}
                  className="btn btn-orange"
                  title="Add New Product"
                >
                  <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compact Key Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales - Compact */}
        <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-indigo-100/50 dark:from-indigo-950/30 dark:to-slate-900 rounded-2xl p-4 border border-indigo-200/60 dark:border-indigo-800/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Sales</p>
                <p className="text-[10px] text-slate-400 font-medium">vs yesterday</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">
              ₹ {totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>

        {/* Today's Purchases - Compact */}
        <div className="bg-gradient-to-br from-rose-50/90 via-pink-50/60 to-rose-100/50 dark:from-rose-950/30 dark:to-slate-900 rounded-2xl p-4 border border-rose-200/60 dark:border-rose-800/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Purchases</p>
                <p className="text-[10px] text-slate-400 font-medium">vs yesterday</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/80 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -8%
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">
              ₹ 22,410
            </h3>
          </div>
        </div>

        {/* Stock Value - Compact */}
        <div className="bg-gradient-to-br from-amber-50/90 via-yellow-50/60 to-amber-100/50 dark:from-amber-950/30 dark:to-slate-900 rounded-2xl p-4 border border-amber-200/60 dark:border-amber-800/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stock Value</p>
                <p className="text-[10px] text-slate-400 font-medium">total inventory</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +5%
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">
              ₹ {totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>

        {/* Outstanding Receivable - Compact */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-emerald-100/50 dark:from-emerald-950/30 dark:to-slate-900 rounded-2xl p-4 border border-emerald-200/60 dark:border-emerald-800/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Outstanding (Rec.)</p>
                <p className="text-[10px] text-slate-400 font-medium">from last month</p>
              </div>
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +6%
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">
              ₹ {totalReceivables.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Bottom Horizontal Quick Actions Boxes */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">Quick Actions</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">One-click operational shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Action 1: New Invoice */}
          <button
            onClick={onOpenNewSale}
            className="flex items-center space-x-3 p-2.5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-xl transition-all text-left group shadow-2xs hover:shadow-xs"
          >
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                New Invoice
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Fast POS Billing
              </div>
            </div>
          </button>

          {/* Action 2: Add Product */}
          <button
            onClick={onOpenAddProduct}
            className="flex items-center space-x-3 p-2.5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-purple-50/80 dark:hover:bg-purple-950/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-purple-300 dark:hover:border-purple-600 rounded-xl transition-all text-left group shadow-2xs hover:shadow-xs"
          >
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                Add Product
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                SKU & Pricing
              </div>
            </div>
          </button>

          {/* Action 3: Purchase Order */}
          <button
            onClick={onOpenNewPurchase}
            className="flex items-center space-x-3 p-2.5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-rose-300 dark:hover:border-rose-600 rounded-xl transition-all text-left group shadow-2xs hover:shadow-xs"
          >
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate">
                New Purchase
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Inward Stock PO
              </div>
            </div>
          </button>

          {/* Action 4: Add Party */}
          <button
            onClick={() => setCurrentTab('parties')}
            className="flex items-center space-x-3 p-2.5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-xl transition-all text-left group shadow-2xs hover:shadow-xs"
          >
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                Add Customer
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Party & Ledger
              </div>
            </div>
          </button>

          {/* Action 5: Record Payment */}
          <button
            onClick={() => setCurrentTab('payments')}
            className="flex items-center space-x-3 p-2.5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-amber-300 dark:hover:border-amber-600 rounded-xl transition-all text-left group shadow-2xs hover:shadow-xs"
          >
            <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                Record Payment
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Cash & UPI In/Out
              </div>
            </div>
          </button>

          {/* Action 6: GST Reports */}
          <button
            onClick={() => setCurrentTab('reports')}
            className="flex items-center space-x-3 p-2.5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-cyan-50/80 dark:hover:bg-cyan-950/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-cyan-300 dark:hover:border-cyan-600 rounded-xl transition-all text-left group shadow-2xs hover:shadow-xs"
          >
            <div className="p-2 rounded-xl bg-cyan-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                GST Reports
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Tax & P&L Summary
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Middle Grid: Charts & Sales Analytics */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sales & Purchase Chart Preview */}
        <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-[8px_8px_20px_#d1d5db,-8px_-8px_20px_#ffffff]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Sales & Purchase Overview</h3>
              <p className="text-xs text-slate-400">Monthly financial performance</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl outline-none">
              <option>This Month</option>
              <option>Last Quarter</option>
              <option>Financial Year</option>
            </select>
          </div>

          <div className="h-64 w-full relative flex items-end pt-8">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cf45ee" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#cf45ee" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="purchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d91940" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#d91940" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0,150 Q 75,80 150,110 T 300,70 T 450,90 T 600,40 L 600,200 L 0,200 Z" fill="url(#salesGrad)" />
              <path d="M 0,150 Q 75,80 150,110 T 300,70 T 450,90 T 600,40" fill="none" stroke="#cf45ee" strokeWidth="3" />
              <path d="M 0,180 Q 75,130 150,150 T 300,120 T 450,140 T 600,100" fill="none" stroke="#d91940" strokeWidth="3" strokeDasharray="4 4" />
            </svg>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#cf45ee]"></span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Sales Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#d91940]"></span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Purchases</span>
            </div>
          </div>
        </div>

        {/* GST & Revenue Quick Stats */}
        <div className="col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-[8px_8px_20px_#d1d5db,-8px_-8px_20px_#ffffff] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Tax & Compliance Summary</h3>
              <p className="text-xs text-slate-400">Current active fiscal cycle</p>
            </div>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Row 1: GST Tax Collected - Emerald */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">GST Tax Collected</p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">CGST + SGST (Outputs)</p>
                </div>
              </div>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ₹ {totalGSTCollected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>

            {/* Row 2: Invoices Created - Blue */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide">Invoices Created</p>
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Total B2B & B2C Bills</p>
                </div>
              </div>
              <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                {invoices.length} Bills
              </span>
            </div>

            {/* Row 3: Total Active SKUs - Amber */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 shadow-2xs">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">Total Active SKUs</p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Products in Catalog</p>
                </div>
              </div>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                {products.length} Items
              </span>
            </div>
          </div>

          <button 
            onClick={() => setCurrentTab('reports')}
            className="w-full mt-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Open Detailed Tax Ledger</span>
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Selling Products & AI Search Preview */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Selling Products */}
        <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-[8px_8px_20px_#d1d5db,-8px_-8px_20px_#ffffff]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Top Selling Products</h3>
            <button 
              onClick={() => setCurrentTab('products')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Qty Sold</th>
                  <th className="py-3 px-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {products.slice(0, 5).map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800 transition-colors">
                    <td className="py-3 px-2 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-3 flex items-center space-x-3">
                      <img src={p.image || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=100&q=80'} alt="" className="w-8 h-8 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.brand} • {p.category}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-indigo-600">{(idx + 5) * 12} {p.uom}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800 dark:text-white">₹ {(p.sellingPrice * ((idx + 5) * 2)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Product Search & Preview Panel */}
        <div className="col-span-12 lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white shadow-[8px_8px_20px_#d1d5db,-8px_-8px_20px_#ffffff] relative overflow-hidden flex flex-col justify-between border border-indigo-500/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 rounded-xl bg-indigo-500/30 text-indigo-300">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h3 className="text-base font-bold text-white">AI Product Search & Preview</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Enter any product name to instantly discover catalog attributes, HSN codes, and GST rates using Gemini AI.
            </p>

            <form onSubmit={handleAISearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Motorola Edge 60 or Lays Chips"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button 
                type="submit"
                disabled={isSearchingAI}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-bold text-xs shadow-lg transition-all disabled:opacity-50 flex items-center space-x-1"
              >
                <span>{isSearchingAI ? 'Searching...' : 'Search'}</span>
              </button>
            </form>
          </div>

          {aiCandidates.length > 0 && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
              <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">AI Discovery Results:</p>
              {aiCandidates.map((c, i) => (
                <div key={i} className="p-3 bg-slate-800/80 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.productName}</h4>
                    <p className="text-[10px] text-slate-400">{c.brand} • GST {c.gstRate}% • ₹ {c.sellingPrice}</p>
                  </div>
                  <button 
                    onClick={onOpenAddProduct}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl shadow-sm transition-all"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}

          {aiCandidates.length === 0 && (
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Powered by Gemini 3.8 Flash</span>
              <span className="text-[#64e447] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-100/60 border border-amber-200 rounded-3xl p-5 flex items-center justify-between shadow-[6px_6px_16px_#d1d5db,-6px_-6px_16px_#ffffff]">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Low Stock Alert</h4>
                <p className="text-xs text-slate-600 mt-0.5">12 products below threshold</p>
              </div>
            </div>
            <button onClick={() => setCurrentTab('inventory')} className="text-xs font-bold text-amber-700 hover:underline">
              View →
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-fuchsia-100/60 border border-purple-200 rounded-3xl p-5 flex items-center justify-between shadow-[6px_6px_16px_#d1d5db,-6px_-6px_16px_#ffffff]">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Expiring Stock</h4>
                <p className="text-xs text-slate-600 mt-0.5">8 batches expiring soon</p>
              </div>
            </div>
            <button onClick={() => setCurrentTab('inventory')} className="text-xs font-bold text-purple-700 hover:underline">
              View →
            </button>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-100/60 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between shadow-[6px_6px_16px_#d1d5db,-6px_-6px_16px_#ffffff]">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">GST Summary</h4>
                <p className="text-xs text-slate-600 mt-0.5">₹ {totalGSTCollected.toLocaleString('en-IN')} tax liability</p>
              </div>
            </div>
            <button onClick={() => setCurrentTab('reports')} className="text-xs font-bold text-emerald-700 hover:underline">
              File GSTR-1 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
