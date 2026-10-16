import React, { useState } from 'react';
import { BarChart3, Printer, Download } from 'lucide-react';
import { Invoice, Product } from '../types';

interface ReportsProps {
  invoices: Invoice[];
  products: Product[];
}

export const Reports: React.FC<ReportsProps> = ({ invoices, products }) => {
  const [reportType, setReportType] = useState<'sales' | 'gst' | 'stock'>('sales');

  const totalSales = invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalTax = invoices.reduce((acc, i) => acc + i.totalTax, 0);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Business & GST Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">GSTR-1 summaries, sales registers, and inventory valuation reports.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'sales', label: 'Sales Register' },
            { id: 'gst', label: 'GST Summary (GSTR-1)' },
            { id: 'stock', label: 'Stock Valuation' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setReportType(r.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === r.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {reportType === 'sales' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800">Sales Register Overview</h3>
            <button onClick={() => window.print()} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700">
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3 text-right">Taxable Value</th>
                  <th className="p-3 text-right">GST Tax</th>
                  <th className="p-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="p-3 font-bold text-indigo-600">{inv.invoiceNumber}</td>
                    <td className="p-3 text-slate-500">{inv.date}</td>
                    <td className="p-3 font-bold text-slate-800">{inv.customerName}</td>
                    <td className="p-3 text-right">₹ {inv.subtotal.toFixed(2)}</td>
                    <td className="p-3 text-right text-indigo-600 font-bold">₹ {inv.totalTax.toFixed(2)}</td>
                    <td className="p-3 text-right font-black">₹ {inv.grandTotal.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'gst' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">GSTR-1 Outward Supplies Summary</h3>
            <p className="text-xs text-slate-400">Consolidated tax liability across GST rates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <p className="text-xs text-slate-500">Total Taxable Turnover</p>
              <h4 className="text-xl font-black text-indigo-900 mt-1">₹ {totalSales.toLocaleString('en-IN')}</h4>
            </div>
            <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100">
              <p className="text-xs text-slate-500">Total Output GST Collected</p>
              <h4 className="text-xl font-black text-purple-900 mt-1">₹ {totalTax.toLocaleString('en-IN')}</h4>
            </div>
            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <p className="text-xs text-slate-500">Filing Status</p>
              <h4 className="text-xl font-black text-emerald-700 mt-1">Ready to File</h4>
            </div>
          </div>
        </div>
      )}

      {reportType === 'stock' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800">Stock Valuation & Profitability</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Stock Qty</th>
                  <th className="p-3 text-right">Purchase Price</th>
                  <th className="p-3 text-right">Selling Price</th>
                  <th className="p-3 text-right">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-slate-800">{p.name}</td>
                    <td className="p-3 text-center font-bold text-indigo-600">{p.openingStock} {p.uom}</td>
                    <td className="p-3 text-right">₹ {p.purchasePrice}</td>
                    <td className="p-3 text-right">₹ {p.sellingPrice}</td>
                    <td className="p-3 text-right font-bold">₹ {(p.openingStock * p.purchasePrice).toLocaleString('en-IN')}</td>
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
