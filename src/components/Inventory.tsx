import React, { useState } from 'react';
import { 
  Boxes, 
  Clock, 
  AlertTriangle, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Package, 
  Layers, 
  UserCheck, 
  FileText,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Product, StockLedgerEntry } from '../types';

interface BatchItem {
  id: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  uom: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
}

interface InventoryProps {
  products: Product[];
  stockLedger: StockLedgerEntry[];
  onUpdateStockLedger?: (entry: StockLedgerEntry) => void;
  onDeleteStockLedger?: (id: string) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ 
  products, 
  stockLedger,
  onUpdateStockLedger,
  onDeleteStockLedger,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'batches' | 'valuation'>('ledger');
  const [searchTerm, setSearchTerm] = useState('');

  // Stock Ledger Action Modals State
  const [viewingEntry, setViewingEntry] = useState<StockLedgerEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<StockLedgerEntry | null>(null);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<StockLedgerEntry | null>(null);

  // Edit Stock Ledger Form State
  const [editDate, setEditDate] = useState('');
  const [editProductName, setEditProductName] = useState('');
  const [editType, setEditType] = useState<'Opening' | 'Purchase' | 'Sale' | 'Return' | 'Adjustment'>('Adjustment');
  const [editQtyIn, setEditQtyIn] = useState<number>(0);
  const [editQtyOut, setEditQtyOut] = useState<number>(0);
  const [editBalanceQty, setEditBalanceQty] = useState<number>(0);
  const [editReference, setEditReference] = useState('');
  const [editUser, setEditUser] = useState('');

  // Batch & Expiry Action Modals State
  const [batches, setBatches] = useState<BatchItem[]>([
    { id: 'b-1', productName: 'Premium Basmati Rice 10kg', batchNumber: 'IG-2024-B1', expiryDate: '2026-10-18', quantity: 50, uom: 'BAG', status: 'Valid' },
    { id: 'b-2', productName: 'Cooking Oil 1L Pouch', batchNumber: 'FORT-2024-X9', expiryDate: '2024-11-05', quantity: 30, uom: 'PCS', status: 'Expiring Soon' },
    { id: 'b-3', productName: 'Wheat Flour 5kg', batchNumber: 'ASH-2024-W2', expiryDate: '2025-06-15', quantity: 80, uom: 'BAG', status: 'Valid' },
    { id: 'b-4', productName: 'Organic Turmeric 250g', batchNumber: 'EV-2024-T1', expiryDate: '2024-09-30', quantity: 15, uom: 'PCS', status: 'Expired' },
  ]);
  const [viewingBatch, setViewingBatch] = useState<BatchItem | null>(null);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);
  const [deleteConfirmBatch, setDeleteConfirmBatch] = useState<BatchItem | null>(null);

  // Edit Batch Form State
  const [editBatchProductName, setEditBatchProductName] = useState('');
  const [editBatchNumber, setEditBatchNumber] = useState('');
  const [editBatchExpiryDate, setEditBatchExpiryDate] = useState('');
  const [editBatchQuantity, setEditBatchQuantity] = useState<number>(0);
  const [editBatchStatus, setEditBatchStatus] = useState<'Valid' | 'Expiring Soon' | 'Expired'>('Valid');

  // Product Valuation Action Modals State
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Edit Product Valuation Form State
  const [editOpeningStock, setEditOpeningStock] = useState<number>(0);
  const [editPurchasePrice, setEditPurchasePrice] = useState<number>(0);

  const filteredLedger = stockLedger.filter(s => 
    s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBatches = batches.filter(b =>
    b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredValuation = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.barcode && p.barcode.includes(searchTerm))
  );

  // Stock Ledger Handlers
  const handleOpenEditEntry = (entry: StockLedgerEntry) => {
    setEditingEntry(entry);
    setEditDate(entry.date);
    setEditProductName(entry.productName);
    setEditType(entry.type);
    setEditQtyIn(entry.qtyIn);
    setEditQtyOut(entry.qtyOut);
    setEditBalanceQty(entry.balanceQty);
    setEditReference(entry.reference);
    setEditUser(entry.user);
  };

  const handleSaveEditEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    const updated: StockLedgerEntry = {
      ...editingEntry,
      date: editDate,
      productName: editProductName,
      type: editType,
      qtyIn: Number(editQtyIn) || 0,
      qtyOut: Number(editQtyOut) || 0,
      balanceQty: Number(editBalanceQty) || 0,
      reference: editReference,
      user: editUser
    };

    if (onUpdateStockLedger) {
      onUpdateStockLedger(updated);
    }
    setEditingEntry(null);
  };

  const handleConfirmDeleteEntry = () => {
    if (!deleteConfirmEntry) return;
    if (onDeleteStockLedger) {
      onDeleteStockLedger(deleteConfirmEntry.id);
    }
    setDeleteConfirmEntry(null);
  };

  // Batch Handlers
  const handleOpenEditBatch = (b: BatchItem) => {
    setEditingBatch(b);
    setEditBatchProductName(b.productName);
    setEditBatchNumber(b.batchNumber);
    setEditBatchExpiryDate(b.expiryDate);
    setEditBatchQuantity(b.quantity);
    setEditBatchStatus(b.status);
  };

  const handleSaveEditBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    setBatches(prev => prev.map(b => b.id === editingBatch.id ? {
      ...b,
      productName: editBatchProductName,
      batchNumber: editBatchNumber,
      expiryDate: editBatchExpiryDate,
      quantity: Number(editBatchQuantity) || 0,
      status: editBatchStatus
    } : b));
    setEditingBatch(null);
  };

  const handleConfirmDeleteBatch = () => {
    if (!deleteConfirmBatch) return;
    setBatches(prev => prev.filter(b => b.id !== deleteConfirmBatch.id));
    setDeleteConfirmBatch(null);
  };

  // Product Valuation Handlers
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditOpeningStock(p.openingStock);
    setEditPurchasePrice(p.purchasePrice);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated: Product = {
      ...editingProduct,
      openingStock: Number(editOpeningStock) || 0,
      purchasePrice: Number(editPurchasePrice) || 0
    };

    if (onUpdateProduct) {
      onUpdateProduct(updated);
    }
    setEditingProduct(null);
  };

  const handleConfirmDeleteProduct = () => {
    if (!deleteConfirmProduct) return;
    if (onDeleteProduct) {
      onDeleteProduct(deleteConfirmProduct.id);
    }
    setDeleteConfirmProduct(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn select-text">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Inventory & Stock Control
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                Real-time stock ledger, batch tracking, and valuation reports.
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          {[
            { id: 'ledger', label: `Inventory & Stock Control (${stockLedger.length})` },
            { id: 'batches', label: `Batch & Expiry (${batches.length})` },
            { id: 'valuation', label: `Inventory Valuation Summary (${products.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: INVENTORY & STOCK CONTROL TABLE */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stock movements by product name, movement type, reference..."
              className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 pb-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                Inventory & Stock Movements Ledger
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                Complete audit trail of all purchases, customer sales, adjustments, and current balance quantity.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                    <th className="py-4 px-4">Date & Time</th>
                    <th className="py-4 px-4">Product Name</th>
                    <th className="py-4 px-4">Movement Type</th>
                    <th className="py-4 px-4 text-center">Qty In</th>
                    <th className="py-4 px-4 text-center">Qty Out</th>
                    <th className="py-4 px-4 text-center">Balance Qty</th>
                    <th className="py-4 px-4">Reference</th>
                    <th className="py-4 px-4">Operator</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 font-bold">
                        No stock ledger movements found matching "{searchTerm}".
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((s) => (
                      <tr key={s.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4 text-slate-500 font-bold">{s.date}</td>
                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white">{s.productName}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            s.type === 'Purchase' || s.type === 'Opening' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                              : s.type === 'Sale' 
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' 
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          }`}>
                            {s.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-black text-emerald-600 dark:text-emerald-400">
                          {s.qtyIn > 0 ? `+${s.qtyIn}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-center font-black text-rose-600 dark:text-rose-400">
                          {s.qtyOut > 0 ? `-${s.qtyOut}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-center font-black text-slate-900 dark:text-white">
                          {s.balanceQty}
                        </td>
                        <td className="py-4 px-4 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                          {s.reference}
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-bold">{s.user}</td>
                        
                        {/* Action Column: only view, edit, del icon */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingEntry(s)}
                              title="View Movement Details"
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditEntry(s)}
                              title="Edit Movement"
                              className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmEntry(s)}
                              title="Delete Movement"
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
        </div>
      )}

      {/* VIEW 2: BATCH & EXPIRY TABLE */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search batches by product name, batch number, status..."
              className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 pb-2">
              <div className="flex items-center space-x-3 mb-1">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Batch & Expiry Management (FEFO)
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    First-Expiry-First-Out (FEFO) tracking of perishable stock, lot numbers, and validity status.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                    <th className="py-4 px-4">Product Name</th>
                    <th className="py-4 px-4">Batch Number</th>
                    <th className="py-4 px-4">Expiry Date</th>
                    <th className="py-4 px-4 text-center">Quantity</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  {filteredBatches.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                        No batch entries found matching "{searchTerm}".
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map((b) => (
                      <tr key={b.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white">{b.productName}</td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">{b.batchNumber}</td>
                        <td className="py-4 px-4 text-slate-500 font-bold">{b.expiryDate}</td>
                        <td className="py-4 px-4 text-center font-black text-indigo-600 dark:text-indigo-400">
                          {b.quantity} {b.uom}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            b.status === 'Valid'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                              : b.status === 'Expiring Soon'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>

                        {/* Action Column: only view, edit, del icon */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingBatch(b)}
                              title="View Batch Details"
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditBatch(b)}
                              title="Edit Batch"
                              className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmBatch(b)}
                              title="Delete Batch"
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
        </div>
      )}

      {/* VIEW 3: INVENTORY VALUATION SUMMARY TABLE */}
      {activeTab === 'valuation' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products in valuation by name, category, barcode..."
              className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 pb-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                Inventory Valuation Summary (FIFO Method)
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                Current asset valuation calculated from product stock and unit purchase costs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                    <th className="py-4 px-4">Product Name</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4 text-center">Total Stock Qty</th>
                    <th className="py-4 px-4 text-right">Avg Purchase Price</th>
                    <th className="py-4 px-4 text-right">Total Valuation (₹)</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  {filteredValuation.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                        No products found matching "{searchTerm}".
                      </td>
                    </tr>
                  ) : (
                    filteredValuation.map((p) => (
                      <tr key={p.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white">{p.name}</td>
                        <td className="py-4 px-4 text-slate-500 font-bold">{p.category}</td>
                        <td className="py-4 px-4 text-center font-black text-indigo-600 dark:text-indigo-400">
                          {p.openingStock} {p.uom}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-slate-800 dark:text-slate-200">
                          ₹ {p.purchasePrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4 text-right font-black text-slate-900 dark:text-white">
                          ₹ {(p.openingStock * p.purchasePrice).toLocaleString('en-IN')}
                        </td>
                        
                        {/* Action Column: only view, edit, del icon */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingProduct(p)}
                              title="View Valuation Details"
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(p)}
                              title="Edit Stock & Pricing"
                              className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmProduct(p)}
                              title="Delete Product"
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
        </div>
      )}

      {/* MODAL 1: VIEW STOCK LEDGER ENTRY */}
      {viewingEntry && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Stock Movement Details
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Ref: {viewingEntry.reference}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingEntry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                    Product Name
                  </span>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {viewingEntry.productName}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                  viewingEntry.type === 'Purchase' || viewingEntry.type === 'Opening' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : viewingEntry.type === 'Sale' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' 
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                }`}>
                  {viewingEntry.type}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-center">
                  <span className="text-[10px] uppercase font-black text-emerald-600 block">Qty In</span>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {viewingEntry.qtyIn > 0 ? `+${viewingEntry.qtyIn}` : '0'}
                  </div>
                </div>
                <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-center">
                  <span className="text-[10px] uppercase font-black text-rose-600 block">Qty Out</span>
                  <div className="text-base font-black text-rose-600 dark:text-rose-400">
                    {viewingEntry.qtyOut > 0 ? `-${viewingEntry.qtyOut}` : '0'}
                  </div>
                </div>
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 text-center">
                  <span className="text-[10px] uppercase font-black text-indigo-600 block">Balance Qty</span>
                  <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    {viewingEntry.balanceQty}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Date & Time</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{viewingEntry.date}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Operator / User</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{viewingEntry.user}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingEntry;
                  setViewingEntry(null);
                  handleOpenEditEntry(toEdit);
                }}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Movement</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingEntry(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STOCK LEDGER ENTRY */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Edit Stock Movement
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">
                  Update quantities, reference ID, and audit operator.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingEntry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEntry} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Movement Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Opening">Opening</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Sale">Sale</option>
                    <option value="Return">Return</option>
                    <option value="Adjustment">Adjustment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Qty In</label>
                  <input
                    type="number"
                    min={0}
                    value={editQtyIn}
                    onChange={(e) => setEditQtyIn(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Qty Out</label>
                  <input
                    type="number"
                    min={0}
                    value={editQtyOut}
                    onChange={(e) => setEditQtyOut(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Balance Qty</label>
                  <input
                    type="number"
                    value={editBalanceQty}
                    onChange={(e) => setEditBalanceQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Reference ID</label>
                  <input
                    type="text"
                    value={editReference}
                    onChange={(e) => setEditReference(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Operator</label>
                  <input
                    type="text"
                    value={editUser}
                    onChange={(e) => setEditUser(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE STOCK LEDGER CONFIRMATION */}
      {deleteConfirmEntry && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Delete Stock Movement
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Confirm permanent removal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmEntry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs font-medium text-slate-700 dark:text-slate-300">
              Are you sure you want to delete this movement entry for <strong className="text-rose-600 dark:text-rose-400 font-black">{deleteConfirmEntry.productName}</strong> (Ref: {deleteConfirmEntry.reference})?
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEntry(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEntry}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Movement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW BATCH DETAILS */}
      {viewingBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {viewingBatch.productName}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Batch: {viewingBatch.batchNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingBatch(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Batch Number</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">{viewingBatch.batchNumber}</div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Expiry Date</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{viewingBatch.expiryDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Batch Stock Quantity</span>
                  <div className="text-base font-black text-indigo-600 dark:text-indigo-400">{viewingBatch.quantity} {viewingBatch.uom}</div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">FEFO Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${
                    viewingBatch.status === 'Valid'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : viewingBatch.status === 'Expiring Soon'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                  }`}>
                    {viewingBatch.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingBatch;
                  setViewingBatch(null);
                  handleOpenEditBatch(toEdit);
                }}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Batch</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingBatch(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT BATCH DETAILS */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Edit Batch Information
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">
                  {editingBatch.productName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBatch(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBatch} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editBatchProductName}
                  onChange={(e) => setEditBatchProductName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Batch Number</label>
                  <input
                    type="text"
                    required
                    value={editBatchNumber}
                    onChange={(e) => setEditBatchNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={editBatchExpiryDate}
                    onChange={(e) => setEditBatchExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editBatchQuantity}
                    onChange={(e) => setEditBatchQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Status</label>
                  <select
                    value={editBatchStatus}
                    onChange={(e) => setEditBatchStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Valid">Valid</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DELETE BATCH CONFIRMATION */}
      {deleteConfirmBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Delete Batch
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Confirm lot removal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmBatch(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs font-medium text-slate-700 dark:text-slate-300">
              Are you sure you want to delete batch <strong className="text-rose-600 dark:text-rose-400 font-black">{deleteConfirmBatch.batchNumber}</strong> for {deleteConfirmBatch.productName}?
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmBatch(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBatch}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Batch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: VIEW PRODUCT VALUATION DETAILS */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {viewingProduct.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Category: {viewingProduct.category}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Current Stock</span>
                  <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    {viewingProduct.openingStock} {viewingProduct.uom}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Unit Purchase Price</span>
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    ₹ {viewingProduct.purchasePrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 block">
                    Total Inventory Asset Valuation
                  </span>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ₹ {(viewingProduct.openingStock * viewingProduct.purchasePrice).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 font-bold">
                  <div>HSN: {viewingProduct.hsnCode || 'N/A'}</div>
                  <div>GST: {viewingProduct.gstRate || 0}%</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Barcode / SKU:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewingProduct.barcode || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingProduct;
                  setViewingProduct(null);
                  handleOpenEditProduct(toEdit);
                }}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Stock & Price</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: EDIT PRODUCT VALUATION */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Edit Stock & Valuation
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">
                  {editingProduct.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Total Stock Quantity ({editingProduct.uom})
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={editOpeningStock}
                  onChange={(e) => setEditOpeningStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Avg Purchase Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={editPurchasePrice}
                  onChange={(e) => setEditPurchasePrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-200">New Valuation:</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                  ₹ {(Number(editOpeningStock) * Number(editPurchasePrice)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: DELETE PRODUCT CONFIRMATION */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Delete Product
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Confirm inventory item removal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs font-medium text-slate-700 dark:text-slate-300">
              Are you sure you want to delete <strong className="text-rose-600 dark:text-rose-400 font-black">{deleteConfirmProduct.name}</strong> from Inventory? This will permanently remove its stock records.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
