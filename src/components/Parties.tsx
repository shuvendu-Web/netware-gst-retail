import React, { useState } from 'react';
import { Users, Phone, Mail, MapPin, Plus } from 'lucide-react';
import { Party } from '../types';

interface PartiesProps {
  parties: Party[];
  onAddParty: (party: Party) => void;
}

export const Parties: React.FC<PartiesProps> = ({ parties, onAddParty }) => {
  const [activeTab, setActiveTab] = useState<'Customer' | 'Supplier'>('Customer');

  const filteredParties = parties.filter(p => p.type === activeTab);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Party Management (Customers & Suppliers)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage GSTIN, credit limits, outstanding balances, and ledgers.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['Customer', 'Supplier'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === type ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold">
                <th className="py-4 px-4">Party Name</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">GSTIN</th>
                <th className="py-4 px-4">State / Address</th>
                <th className="py-4 px-4 text-right">Credit Limit</th>
                <th className="py-4 px-4 text-right">Outstanding Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {filteredParties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-4 px-4 text-slate-600">{p.phone}</td>
                  <td className="py-4 px-4 font-mono font-bold text-indigo-600">{p.gstin || 'Unregistered'}</td>
                  <td className="py-4 px-4 text-slate-500">{p.address}, {p.state}</td>
                  <td className="py-4 px-4 text-right">₹ {p.creditLimit.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-right font-black text-rose-600">₹ {p.currentOutstanding.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
