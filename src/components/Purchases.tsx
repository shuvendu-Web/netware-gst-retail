import React, { useState } from 'react';
import { ShoppingCart, Plus, CheckCircle2 } from 'lucide-react';
import { PurchaseOrder, Party } from '../types';

interface PurchasesProps {
  purchaseOrders: PurchaseOrder[];
  parties: Party[];
  onAddPO: (po: PurchaseOrder) => void;
  isOpenNewModal?: boolean;
}

export const Purchases: React.FC<PurchasesProps> = ({ purchaseOrders, parties, onAddPO }) => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Purchase Orders & Bills</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage supplier purchase bills, stock receipts, and supplier ledgers.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold">
                <th className="py-4 px-4">PO Number</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Supplier Name</th>
                <th className="py-4 px-4 text-right">Total Amount (₹)</th>
                <th className="py-4 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-indigo-600">{po.poNumber}</td>
                  <td className="py-4 px-4 text-slate-500">{po.date}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">{po.supplierName}</td>
                  <td className="py-4 px-4 text-right font-black text-slate-900">₹ {po.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      po.status === 'Received' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
