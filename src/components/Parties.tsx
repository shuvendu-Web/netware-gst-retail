import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Search, 
  Building2, 
  UserCheck, 
  Truck, 
  Package, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  Check, 
  FileText,
  Eye,
  Trash2,
  Tag,
  Pencil,
  AlertTriangle
} from 'lucide-react';
import { Party, SuppliedProductDetail } from '../types';

interface PartiesProps {
  parties: Party[];
  onAddParty: (party: Party) => void;
  onUpdateParty?: (party: Party) => void;
  onDeleteParty?: (partyId: string) => void;
}

export const Parties: React.FC<PartiesProps> = ({ parties, onAddParty, onUpdateParty, onDeleteParty }) => {
  // Tabs: 'All' shows both Customers & Suppliers simultaneously
  const [activeTab, setActiveTab] = useState<'All' | 'Customer' | 'Supplier'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplierForProducts, setSelectedSupplierForProducts] = useState<Party | null>(null);

  // Action Modals State
  const [viewingParty, setViewingParty] = useState<Party | null>(null);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [deleteConfirmParty, setDeleteConfirmParty] = useState<Party | null>(null);

  // Edit Party Form State
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'Customer' | 'Supplier'>('Customer');
  const [editContactPerson, setEditContactPerson] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGstin, setEditGstin] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editState, setEditState] = useState('Karnataka');
  const [editCreditLimit, setEditCreditLimit] = useState<number>(0);
  const [editCurrentOutstanding, setEditCurrentOutstanding] = useState<number>(0);
  const [editSuppliedProducts, setEditSuppliedProducts] = useState<SuppliedProductDetail[]>([]);

  // New Party Form State
  const [partyType, setPartyType] = useState<'Customer' | 'Supplier'>('Customer');
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Karnataka');
  const [creditLimit, setCreditLimit] = useState<number>(50000);
  const [openingBalance, setOpeningBalance] = useState<number>(0);

  // Supplier Products Form State (when adding a Supplier)
  const [suppliedProducts, setSuppliedProducts] = useState<SuppliedProductDetail[]>([
    { productName: '', category: 'General', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }
  ]);

  // Summary Metrics
  const totalParties = parties.length;
  const totalCustomers = parties.filter(p => p.type === 'Customer').length;
  const totalSuppliers = parties.filter(p => p.type === 'Supplier').length;
  const totalReceivables = parties
    .filter(p => p.type === 'Customer')
    .reduce((sum, p) => sum + (p.currentOutstanding || 0), 0);
  const totalPayables = parties
    .filter(p => p.type === 'Supplier')
    .reduce((sum, p) => sum + (p.currentOutstanding || 0), 0);

  // Filter parties based on Tab and Search Query
  const filteredParties = parties.filter(p => {
    const matchesTab = activeTab === 'All' ? true : p.type === activeTab;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTab;
    const matchesQuery = 
      p.name.toLowerCase().includes(q) ||
      (p.contactPerson && p.contactPerson.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q)) ||
      (p.gstin && p.gstin.toLowerCase().includes(q)) ||
      (p.state && p.state.toLowerCase().includes(q));
    return matchesTab && matchesQuery;
  });

  const handleAddSuppliedProductRow = () => {
    setSuppliedProducts([
      ...suppliedProducts,
      { productName: '', category: 'General', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }
    ]);
  };

  const handleRemoveSuppliedProductRow = (idx: number) => {
    setSuppliedProducts(suppliedProducts.filter((_, i) => i !== idx));
  };

  const handleUpdateSuppliedProduct = (idx: number, field: keyof SuppliedProductDetail, value: any) => {
    const updated = [...suppliedProducts];
    updated[idx] = { ...updated[idx], [field]: value };
    setSuppliedProducts(updated);
  };

  const handleSaveParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Filter valid supplied products if Supplier
    const validProducts = partyType === 'Supplier' 
      ? suppliedProducts.filter(sp => sp.productName.trim().length > 0)
      : undefined;

    const newParty: Party = {
      id: `${partyType === 'Customer' ? 'cust' : 'supp'}-${Date.now()}`,
      type: partyType,
      name: name.trim(),
      contactPerson: contactPerson.trim() || name.trim(),
      phone: phone.trim() || '+91 98000 00000',
      email: email.trim() || 'contact@party.com',
      gstin: gstin.trim().toUpperCase() || '',
      address: address.trim() || 'Main Market Road',
      state: state.trim() || 'Karnataka',
      creditLimit: Number(creditLimit) || 0,
      openingBalance: Number(openingBalance) || 0,
      currentOutstanding: Number(openingBalance) || 0,
      suppliedProducts: validProducts && validProducts.length > 0 ? validProducts : undefined
    };

    onAddParty(newParty);
    setIsAddModalOpen(false);

    // Reset Form
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setGstin('');
    setAddress('');
    setState('Karnataka');
    setCreditLimit(50000);
    setOpeningBalance(0);
    setSuppliedProducts([{ productName: '', category: 'General', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }]);
  };

  const handleOpenEdit = (p: Party) => {
    setEditingParty(p);
    setEditName(p.name);
    setEditType(p.type);
    setEditContactPerson(p.contactPerson || '');
    setEditPhone(p.phone || '');
    setEditEmail(p.email || '');
    setEditGstin(p.gstin || '');
    setEditAddress(p.address || '');
    setEditState(p.state || 'Karnataka');
    setEditCreditLimit(p.creditLimit || 0);
    setEditCurrentOutstanding(p.currentOutstanding || 0);
    setEditSuppliedProducts(
      p.suppliedProducts && p.suppliedProducts.length > 0
        ? p.suppliedProducts.map(sp => ({ ...sp }))
        : [{ productName: '', category: 'General', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }]
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParty || !editName.trim()) return;

    const validProducts = editType === 'Supplier'
      ? editSuppliedProducts.filter(sp => sp.productName.trim().length > 0)
      : undefined;

    const updatedParty: Party = {
      ...editingParty,
      type: editType,
      name: editName.trim(),
      contactPerson: editContactPerson.trim() || editName.trim(),
      phone: editPhone.trim() || '+91 98000 00000',
      email: editEmail.trim() || 'contact@party.com',
      gstin: editGstin.trim().toUpperCase() || '',
      address: editAddress.trim() || 'Main Market Road',
      state: editState.trim() || 'Karnataka',
      creditLimit: Number(editCreditLimit) || 0,
      currentOutstanding: Number(editCurrentOutstanding) || 0,
      suppliedProducts: validProducts && validProducts.length > 0 ? validProducts : undefined
    };

    if (onUpdateParty) {
      onUpdateParty(updatedParty);
    }
    setEditingParty(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmParty) return;
    if (onDeleteParty) {
      onDeleteParty(deleteConfirmParty.id);
    }
    setDeleteConfirmParty(null);
  };

  const handleAddEditSuppliedProductRow = () => {
    setEditSuppliedProducts([
      ...editSuppliedProducts,
      { productName: '', category: 'General', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }
    ]);
  };

  const handleRemoveEditSuppliedProductRow = (idx: number) => {
    setEditSuppliedProducts(editSuppliedProducts.filter((_, i) => i !== idx));
  };

  const handleUpdateEditSuppliedProduct = (idx: number, field: keyof SuppliedProductDetail, value: any) => {
    const updated = [...editSuppliedProducts];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditSuppliedProducts(updated);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn select-text">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Party Management (Customers & Suppliers)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Complete directory of all Customer and Supplier business accounts, GSTINs, credit terms, and catalog details.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button & Add Party */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setPartyType('Customer');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Party</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Directory</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalParties}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">All active parties</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">All Customers</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {totalCustomers}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Buyers & Retail Clients</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">All Suppliers</span>
            <Truck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {totalSuppliers}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Vendors & Manufacturers</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Receivables</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹ {totalReceivables.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Due from Customers</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Payables</span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
            ₹ {totalPayables.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Due to Suppliers</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {/* Tabs: All Parties, Customers, Suppliers */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Parties ({totalParties})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Customer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'Customer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Customers ({totalCustomers})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Supplier')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'Supplier'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Suppliers ({totalSuppliers})
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[260px] sm:min-w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Customer or Supplier name, phone, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Parties Table Showing All Customer Names & Supplier Names */}
      <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                <th className="py-4 px-4">Party Name & Contact</th>
                <th className="py-4 px-4 text-center">Type</th>
                <th className="py-4 px-4">Phone / Email</th>
                <th className="py-4 px-4">GSTIN</th>
                <th className="py-4 px-4">Address / State</th>
                <th className="py-4 px-4 text-center">Catalog / Products</th>
                <th className="py-4 px-4 text-right">Credit Limit</th>
                <th className="py-4 px-4 text-right">Outstanding</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredParties.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-bold">
                    No parties found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredParties.map((p, idx) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Party Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          p.type === 'Customer'
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        }`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white text-xs">
                            {p.name}
                          </div>
                          {p.contactPerson && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                              Contact: {p.contactPerson}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type Badge: Customer vs Supplier */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        p.type === 'Customer'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      }`}>
                        {p.type === 'Customer' ? (
                          <UserCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Truck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        )}
                        <span>{p.type}</span>
                      </span>
                    </td>

                    {/* Contact Phone & Email */}
                    <td className="py-4 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{p.phone}</span>
                      </div>
                      {p.email && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-2.5 h-2.5 text-slate-400" />
                          <span className="truncate max-w-[140px]">{p.email}</span>
                        </div>
                      )}
                    </td>

                    {/* GSTIN */}
                    <td className="py-4 px-4">
                      <span className={`font-mono font-bold text-xs ${
                        p.gstin 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-slate-400 italic'
                      }`}>
                        {p.gstin || 'Unregistered (URP)'}
                      </span>
                    </td>

                    {/* Address & State */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-[200px]">
                      <div className="truncate font-medium">{p.address}</div>
                      <div className="text-[10px] text-slate-500 font-bold flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        <span>{p.state}</span>
                      </div>
                    </td>

                    {/* Supplied Products / Catalog for Suppliers */}
                    <td className="py-4 px-4 text-center">
                      {p.type === 'Supplier' && p.suppliedProducts && p.suppliedProducts.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSelectedSupplierForProducts(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 text-[10px] font-black hover:bg-purple-100 transition-all cursor-pointer"
                          title="View supplier products & rates"
                        >
                          <Package className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span>{p.suppliedProducts.length} Products</span>
                          <Eye className="w-3 h-3 text-purple-400 ml-0.5" />
                        </button>
                      ) : p.type === 'Supplier' ? (
                        <span className="text-[10px] text-slate-400 font-bold italic">No catalog added</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">-</span>
                      )}
                    </td>

                    {/* Credit Limit */}
                    <td className="py-4 px-4 text-right font-bold text-slate-700 dark:text-slate-300">
                      ₹ {p.creditLimit.toLocaleString('en-IN')}
                    </td>

                    {/* Outstanding Balance */}
                    <td className="py-4 px-4 text-right">
                      <div className={`font-black text-xs ${
                        p.type === 'Customer'
                          ? p.currentOutstanding > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          : p.currentOutstanding > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        ₹ {p.currentOutstanding.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {p.type === 'Customer' ? 'Receivable' : 'Payable'}
                      </span>
                    </td>

                    {/* Action Column: only view, edit, del icon */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingParty(p)}
                          title="View Party Details"
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Party"
                          className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmParty(p)}
                          title="Delete Party"
                          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: View Supplier's Products Details */}
      {selectedSupplierForProducts && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-xl">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {selectedSupplierForProducts.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Supplied Products Catalog & Purchase Rates (GSTIN: {selectedSupplierForProducts.gstin || 'N/A'})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplierForProducts(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-black text-[10px]">
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">HSN Code</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost (₹)</th>
                    <th className="py-2.5 px-3 text-right">GST %</th>
                    <th className="py-2.5 px-3 text-right">MOQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {selectedSupplierForProducts.suppliedProducts?.map((sp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{sp.productName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{sp.category || 'General'}</td>
                      <td className="py-2.5 px-3 font-mono text-indigo-600">{sp.hsnCode || '-'}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white">₹ {sp.unitCost}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-600">{sp.gstRate || 0}%</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-600">{sp.minOrderQty || 1} {sp.uom || 'PCS'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSupplierForProducts(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Party (Customer or Supplier with Supplied Products) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-4 animate-scaleUp my-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Add New Party (Customer or Supplier)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Register party details, GSTIN, credit limits, and supplier product catalogs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveParty} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                  Party Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPartyType('Customer')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      partyType === 'Customer'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Customer (Retail / B2B Buyer)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartyType('Supplier')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      partyType === 'Supplier'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Supplier (Vendor / Manufacturer)</span>
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    {partyType === 'Customer' ? 'Customer / Business Name *' : 'Supplier / Company Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={partyType === 'Customer' ? 'e.g. Acme Retailers' : 'e.g. India Gate Foods'}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@business.com"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    GSTIN (15 Characters)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="29AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    State of Supply
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Karnataka">Karnataka (29)</option>
                    <option value="Maharashtra">Maharashtra (27)</option>
                    <option value="Delhi">Delhi (07)</option>
                    <option value="Tamil Nadu">Tamil Nadu (33)</option>
                    <option value="Gujarat">Gujarat (24)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (09)</option>
                    <option value="West Bengal">West Bengal (19)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Complete Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="#123, Main Commercial Complex, Market Road"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Opening Balance (₹)
                  </label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* If Supplier: Add Supplied Products Details Section */}
              {partyType === 'Supplier' && (
                <div className="p-4 bg-purple-50/70 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-black text-purple-950 dark:text-purple-300">
                        Supplier Catalog & Products Details
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSuppliedProductRow}
                      className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[10px] font-black flex items-center gap-1 hover:bg-purple-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Product Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {suppliedProducts.map((sp, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/40 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Product Name (e.g. Basmati Rice 10kg)"
                            value={sp.productName}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'productName', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="HSN"
                            value={sp.hsnCode}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'hsnCode', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            placeholder="Unit Cost ₹"
                            value={sp.unitCost || ''}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'unitCost', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          {suppliedProducts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSuppliedProductRow(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Save Party Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW PARTY DETAILS */}
      {viewingParty && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-4 animate-scaleUp my-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                  viewingParty.type === 'Customer'
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                }`}>
                  {viewingParty.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {viewingParty.name}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      viewingParty.type === 'Customer'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    }`}>
                      {viewingParty.type === 'Customer' ? (
                        <UserCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Truck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      )}
                      <span>{viewingParty.type}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                    Contact: {viewingParty.contactPerson || viewingParty.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingParty(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  Contact Information
                </span>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewingParty.phone}</span>
                </div>
                {viewingParty.email && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{viewingParty.email}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  Tax & Location
                </span>
                <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {viewingParty.gstin || 'Unregistered (URP)'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-medium truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{viewingParty.state}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                Full Address
              </span>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {viewingParty.address || 'No address specified'}
              </p>
            </div>

            {/* Financial Ledger Balance */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  Credit Limit
                </span>
                <div className="text-sm font-black text-slate-800 dark:text-slate-200">
                  ₹ {(viewingParty.creditLimit || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  Current {viewingParty.type === 'Customer' ? 'Receivable' : 'Payable'}
                </span>
                <div className={`text-sm font-black ${
                  viewingParty.currentOutstanding > 0
                    ? viewingParty.type === 'Customer' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  ₹ {(viewingParty.currentOutstanding || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* If Supplier and has products */}
            {viewingParty.type === 'Supplier' && viewingParty.suppliedProducts && viewingParty.suppliedProducts.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-purple-600" />
                  <span>Supplied Products Catalog ({viewingParty.suppliedProducts.length})</span>
                </h4>
                <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-black text-[10px]">
                        <th className="py-2 px-3">Product Name</th>
                        <th className="py-2 px-3 text-right">Unit Cost</th>
                        <th className="py-2 px-3 text-right">GST %</th>
                        <th className="py-2 px-3 text-right">MOQ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {viewingParty.suppliedProducts.map((sp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{sp.productName}</td>
                          <td className="py-2 px-3 text-right font-black text-slate-800 dark:text-slate-200">₹ {sp.unitCost}</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-600">{sp.gstRate || 0}%</td>
                          <td className="py-2 px-3 text-right font-bold text-purple-600">{sp.minOrderQty || 1} {sp.uom || 'PCS'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingParty;
                  setViewingParty(null);
                  handleOpenEdit(toEdit);
                }}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Party</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingParty(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PARTY DETAILS */}
      {editingParty && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-4 animate-scaleUp my-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Edit Party Details
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Update customer or vendor information, credit rules, and catalogs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingParty(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                  Party Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditType('Customer')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      editType === 'Customer'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Customer (Retail / B2B)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType('Supplier')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      editType === 'Supplier'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Supplier (Vendor)</span>
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Party Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={editContactPerson}
                    onChange={(e) => setEditContactPerson(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    GSTIN (15 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={editGstin}
                    onChange={(e) => setEditGstin(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    State / Jurisdiction
                  </label>
                  <select
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Karnataka">Karnataka (29)</option>
                    <option value="Maharashtra">Maharashtra (27)</option>
                    <option value="Delhi">Delhi (07)</option>
                    <option value="Tamil Nadu">Tamil Nadu (33)</option>
                    <option value="Gujarat">Gujarat (24)</option>
                    <option value="Telangana">Telangana (36)</option>
                    <option value="Kerala">Kerala (32)</option>
                    <option value="West Bengal">West Bengal (19)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editCreditLimit}
                    onChange={(e) => setEditCreditLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Current Outstanding (₹)
                  </label>
                  <input
                    type="number"
                    value={editCurrentOutstanding}
                    onChange={(e) => setEditCurrentOutstanding(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Full Street Address & Pincode
                </label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* If Supplier: Catalog editor */}
              {editType === 'Supplier' && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase text-purple-600 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      <span>Supplied Products Catalog</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddEditSuppliedProductRow}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-black hover:bg-purple-100 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {editSuppliedProducts.map((sp, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Product Name"
                            value={sp.productName}
                            onChange={(e) => handleUpdateEditSuppliedProduct(idx, 'productName', e.target.value)}
                            className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="HSN"
                            value={sp.hsnCode || ''}
                            onChange={(e) => handleUpdateEditSuppliedProduct(idx, 'hsnCode', e.target.value)}
                            className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            placeholder="Unit Cost ₹"
                            value={sp.unitCost || ''}
                            onChange={(e) => handleUpdateEditSuppliedProduct(idx, 'unitCost', Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          {editSuppliedProducts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveEditSuppliedProductRow(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingParty(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Update Party Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION MODAL */}
      {deleteConfirmParty && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Delete Party
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Confirm permanent removal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmParty(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs font-medium text-slate-700 dark:text-slate-300">
              Are you sure you want to delete <strong className="text-rose-600 dark:text-rose-400 font-black">{deleteConfirmParty.name}</strong> ({deleteConfirmParty.type})? This action cannot be undone and will remove their profile and contact records.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmParty(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Party</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
