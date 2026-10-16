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
  Calendar
} from 'lucide-react';
import { Product, Invoice, PurchaseOrder, Party, TabType } from '../types';

interface DashboardProps {
  products: Product[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  parties: Party[];
  setCurrentTab: (tab: TabType) => void;
  onOpenNewSale: () => void;
  onOpenNewPurchase: () => void;
  onOpenAddProduct: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  invoices,
  purchaseOrders,
  parties,
  setCurrentTab,
  onOpenNewSale,
  onOpenNewPurchase,
  onOpenAddProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiCandidates, setAiCandidates] = useState<any[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  // Calculate stats
  const totalSales = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.openingStock * p.purchasePrice), 0);
  const totalReceivables = parties.filter(p => p.type === 'Customer').reduce((acc, p) => acc + p.currentOutstanding, 0);
  const totalGSTCollected = invoices.reduce((acc, inv) => acc + inv.totalTax, 0);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

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
      {/* Welcome Banner & Summary Cards Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Welcome Card with Temperature & Time Date */}
        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-6 border border-indigo-200/60 shadow-[8px_8px_20px_#d1d5db,-8px_-8px_20px_#ffffff] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-tr from-purple-200/50 to-pink-200/30 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-indigo-700 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                <span>AI ERP Engine Active</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white/80 px-3 py-1 rounded-full shadow-xs">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>28°C • Bengaluru</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Good Morning! ☀️
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {currentDate}
            </p>
            <p className="text-sm text-slate-700 mt-2 font-bold">💜 Let's grow your business together.</p>
          </div>
          <div className="mt-6 flex items-center space-x-3">
            <button 
              onClick={onOpenNewSale}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </button>
            <button 
              onClick={() => setCurrentTab('reports')}
              className="py-3 px-4 bg-white/90 hover:bg-white text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-xs transition-all"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Key Metrics Cards with Multiple Vibrant Colors */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Sales - Lavender/Indigo tint */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100/50 rounded-3xl p-5 border border-indigo-200/50 shadow-[6px_6px_16px_#d1d5db,-6px_-6px_16px_#ffffff] flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Sales</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">₹ {totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-2">vs yesterday</p>
          </div>

          {/* Today's Purchases - Soft Rose/Pink tint */}
          <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100/50 rounded-3xl p-5 border border-rose-200/50 shadow-[6px_6px_16px_#d1d5db,-6px_-6px_16px_#ffffff] flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-md">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                <TrendingDown className="w-3.5 h-3.5 mr-1" /> -8%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Purchases</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">₹ 22,410</h3>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-2">vs yesterday</p>
          </div>

          {/* Stock Value - Soft Amber/Yellow tint */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/50 rounded-3xl p-5 border border-amber-200/50 shadow-[6px_6px_16px_#d1d5db,-6px_-6px_16px_#ffffff] flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-amber-600 text-white shadow-md">
                <Boxes className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +5%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Value</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">₹ {totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-2">total inventory</p>
          </div>

          {/* Outstanding Receivable - Soft Mint/Teal tint */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 rounded-3xl p-5 border border-emerald-200/50 shadow-[6px_6px_16px_#d1d5db,-6px_-6px_16px_#ffffff] flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +6%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding (Rec.)</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">₹ {totalReceivables.toLocaleString('en-IN')}</h3>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-2">from last month</p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Charts & Quick Actions */}
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

        {/* Quick Actions Panel */}
        <div className="col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-[8px_8px_20px_#d1d5db,-8px_-8px_20px_#ffffff] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Quick Actions</h3>
            <button className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500">
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onOpenNewSale}
              className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-indigo-200/60 text-left transition-all group shadow-sm hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">New Sale</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Create GST Invoice</p>
            </button>

            <button 
              onClick={onOpenNewPurchase}
              className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200/60 text-left transition-all group shadow-sm hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md mb-3">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">New Purchase</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Create PO / Bill</p>
            </button>

            <button 
              onClick={onOpenAddProduct}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/60 text-left transition-all group shadow-sm hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-3">
                <Boxes className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Add Product</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">With AI Search</p>
            </button>

            <button 
              onClick={() => setCurrentTab('reports')}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200/60 text-left transition-all group shadow-sm hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">View Reports</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Sales, Stock, GST</p>
            </button>
          </div>
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
