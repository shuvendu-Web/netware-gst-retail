import React, { useState } from 'react';
import { 
  BarChart3, 
  Printer, 
  Download, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  Check 
} from 'lucide-react';
import { Invoice, Product } from '../types';

interface ReportsProps {
  invoices: Invoice[];
  products: Product[];
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
}

export const Reports: React.FC<ReportsProps> = ({ 
  invoices, 
  products,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [reportType, setReportType] = useState<'sales' | 'gst' | 'stock'>('sales');

  // Modals state for Inventory Valuation Summary
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Edit Product Valuation Form State
  const [editOpeningStock, setEditOpeningStock] = useState<number>(0);
  const [editPurchasePrice, setEditPurchasePrice] = useState<number>(0);
  const [editSellingPrice, setEditSellingPrice] = useState<number>(0);

  const totalSales = invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalTax = invoices.reduce((acc, i) => acc + i.totalTax, 0);

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditOpeningStock(p.openingStock);
    setEditPurchasePrice(p.purchasePrice);
    setEditSellingPrice(p.sellingPrice);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated: Product = {
      ...editingProduct,
      openingStock: Number(editOpeningStock) || 0,
      purchasePrice: Number(editPurchasePrice) || 0,
      sellingPrice: Number(editSellingPrice) || 0
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
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Business & GST Reports
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                GSTR-1 summaries, sales registers, and inventory valuation reports.
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          {[
            { id: 'sales', label: 'Sales Register' },
            { id: 'gst', label: 'GST Summary (GSTR-1)' },
            { id: 'stock', label: `Inventory Valuation Summary (${products.length})` }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setReportType(r.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                reportType === r.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: SALES REGISTER */}
      {reportType === 'sales' && (
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Sales Register Overview</h3>
              <p className="text-xs text-slate-500 font-bold">Comprehensive log of billed GST tax invoices and turnover.</p>
            </div>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">Taxable Value</th>
                  <th className="py-3 px-4 text-right">GST Tax</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400 font-mono">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 text-slate-500 font-bold">{inv.date}</td>
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-white">{inv.customerName}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-300">₹ {inv.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-indigo-600 dark:text-indigo-400 font-bold">₹ {inv.totalTax.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">₹ {inv.grandTotal.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: GSTR-1 SUMMARY */}
      {reportType === 'gst' && (
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">GSTR-1 Outward Supplies Summary</h3>
            <p className="text-xs text-slate-400 font-bold">Consolidated tax liability across GST rates ready for filing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/40">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Taxable Turnover</p>
              <h4 className="text-xl font-black text-indigo-900 dark:text-indigo-300 mt-1">₹ {totalSales.toLocaleString('en-IN')}</h4>
            </div>
            <div className="p-5 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/40">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Output GST Collected</p>
              <h4 className="text-xl font-black text-purple-900 dark:text-purple-300 mt-1">₹ {totalTax.toLocaleString('en-IN')}</h4>
            </div>
            <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filing Status</p>
              <h4 className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">Ready to File</h4>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: INVENTORY VALUATION SUMMARY */}
      {reportType === 'stock' && (
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Inventory Valuation Summary & Profitability
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Real-time asset value and projected retail profits based on FIFO costs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                  <th className="py-4 px-4">Product Name</th>
                  <th className="py-4 px-4 text-center">Stock Qty</th>
                  <th className="py-4 px-4 text-right">Purchase Price</th>
                  <th className="py-4 px-4 text-right">Selling Price</th>
                  <th className="py-4 px-4 text-right">Total Valuation (₹)</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      <div>{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{p.category}</div>
                    </td>
                    <td className="py-4 px-4 text-center font-black text-indigo-600 dark:text-indigo-400">
                      {p.openingStock} {p.uom}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-800 dark:text-slate-200">
                      ₹ {p.purchasePrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ₹ {p.sellingPrice.toLocaleString('en-IN')}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW INVENTORY VALUATION DETAILS */}
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

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Selling Price</span>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹ {viewingProduct.sellingPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Projected Margin</span>
                  <div className="text-base font-black text-purple-600 dark:text-purple-400">
                    {viewingProduct.purchasePrice > 0 ? (((viewingProduct.sellingPrice - viewingProduct.purchasePrice) / viewingProduct.purchasePrice) * 100).toFixed(1) : '0'}%
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

      {/* MODAL 2: EDIT PRODUCT VALUATION */}
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

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editSellingPrice}
                    onChange={(e) => setEditSellingPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
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

      {/* MODAL 3: DELETE PRODUCT CONFIRMATION */}
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
              Are you sure you want to delete <strong className="text-rose-600 dark:text-rose-400 font-black">{deleteConfirmProduct.name}</strong> from Inventory? This will permanently remove its stock valuation records.
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
