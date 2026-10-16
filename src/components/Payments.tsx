import React from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { PaymentTransaction } from '../types';

interface PaymentsProps {
  payments: PaymentTransaction[];
  onAddPayment: (payment: PaymentTransaction) => void;
}

export const Payments: React.FC<PaymentsProps> = ({ payments }) => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Payments In & Out</h2>
          <p className="text-xs text-slate-500 mt-0.5">Record customer receipts, supplier payouts, UPI transfers, and bank deposits.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold">
                <th className="py-4 px-4">Receipt #</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Party Name</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Mode</th>
                <th className="py-4 px-4">Reference No</th>
                <th className="py-4 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-indigo-600">{pay.receiptNumber}</td>
                  <td className="py-4 px-4 text-slate-500">{pay.date}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{pay.partyName}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      pay.type === 'Payment In' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {pay.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{pay.mode}</td>
                  <td className="py-4 px-4 font-mono text-slate-500">{pay.referenceNo || '-'}</td>
                  <td className="py-4 px-4 text-right font-black text-slate-900">₹ {pay.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
