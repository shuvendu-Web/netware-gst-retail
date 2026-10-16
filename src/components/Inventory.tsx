import React, { useState } from 'react';
import { Boxes, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { Product, StockLedgerEntry } from '../types';

interface InventoryProps {
  products: Product[];
  stockLedger: StockLedgerEntry[];
}

export const Inventory: React.FC<InventoryProps> = ({ products, stockLedger }) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'batches' | 'valuation'>('ledger');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLedger = stockLedger.filter(s => s.productName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Inventory & Stock Control</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time stock ledger, batch tracking, and valuation reports.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'ledger', label: 'Stock Ledger' },
            { id: 'batches', label: 'Batch & Expiry' },
            { id: 'valuation', label: 'Valuation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stock movements by product name..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold">
                    <th className="py-4 px-4">Date & Time</th>
                    <th className="py-4 px-4">Product Name</th>
                    <th className="py-4 px-4">Movement Type</th>
                    <th className="py-4 px-4 text-center">Qty In</th>
                    <th className="py-4 px-4 text-center">Qty Out</th>
                    <th className="py-4 px-4 text-center">Balance Qty</th>
                    <th className="py-4 px-4">Reference</th>
                    <th className="py-4 px-4">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredLedger.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 text-slate-500">{s.date}</td>
                      <td className="py-4 px-4 font-bold text-slate-800">{s.productName}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          s.type === 'Purchase' || s.type === 'Opening' ? 'bg-emerald-50 text-emerald-600' :
                          s.type === 'Sale' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {s.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-emerald-600">{s.qtyIn > 0 ? `+${s.qtyIn}` : '-'}</td>
                      <td className="py-4 px-4 text-center font-bold text-rose-600">{s.qtyOut > 0 ? `-${s.qtyOut}` : '-'}</td>
                      <td className="py-4 px-4 text-center font-bold text-slate-800">{s.balanceQty}</td>
                      <td className="py-4 px-4 text-indigo-600 font-bold">{s.reference}</td>
                      <td className="py-4 px-4 text-slate-500">{s.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'batches' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Batch & Expiry Management (FEFO)</h3>
              <p className="text-xs text-slate-400">Tracking expiry dates and lot numbers for grocery and perishable stock.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 text-sm">Premium Basmati Rice 10kg</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">Valid</span>
              </div>
              <p className="text-xs text-slate-500">Batch Number: <strong className="text-slate-700">IG-2024-B1</strong></p>
              <p className="text-xs text-slate-500 mt-1">Expiry Date: <strong className="text-slate-700">2026-10-18</strong> (50 units)</p>
            </div>

            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 text-sm">Cooking Oil 1L Pouch</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Expiring Soon</span>
              </div>
              <p className="text-xs text-slate-500">Batch Number: <strong className="text-slate-700">FORT-2024-X9</strong></p>
              <p className="text-xs text-slate-500 mt-1">Expiry Date: <strong className="text-rose-600">2024-11-05</strong> (30 units)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'valuation' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 mb-2">Inventory Valuation Summary (FIFO Method)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Total Stock Qty</th>
                  <th className="py-3 px-4 text-right">Avg Purchase Price</th>
                  <th className="py-3 px-4 text-right">Total Valuation (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-4 px-4 font-bold text-slate-800">{p.name}</td>
                    <td className="py-4 px-4 text-slate-500">{p.category}</td>
                    <td className="py-4 px-4 text-center font-bold text-indigo-600">{p.openingStock} {p.uom}</td>
                    <td className="py-4 px-4 text-right">₹ {p.purchasePrice}</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-800">₹ {(p.openingStock * p.purchasePrice).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
