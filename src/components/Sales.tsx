import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, Trash2, Printer, CheckCircle2, FileText, X } from 'lucide-react';
import { Product, Invoice, InvoiceItem, Party } from '../types';

interface SalesProps {
  products: Product[];
  invoices: Invoice[];
  parties: Party[];
  onAddInvoice: (inv: Invoice) => void;
  isOpenNewModal?: boolean;
  onCloseNewModal?: () => void;
}

export const Sales: React.FC<SalesProps> = ({ 
  products, 
  invoices, 
  parties, 
  onAddInvoice,
  isOpenNewModal,
  onCloseNewModal 
}) => {
  const [showNewModal, setShowNewModal] = useState(isOpenNewModal || false);
  const [selectedCustomer, setSelectedCustomer] = useState(parties[0]?.name || 'Rahul Sharma');
  const [placeOfSupply, setPlaceOfSupply] = useState('Karnataka');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Credit'>('UPI');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: 'ii-init',
      productId: products[0]?.id || 'prod-1',
      productName: products[0]?.name || "Men's Casual Shirt",
      variantSku: products[0]?.variants[0]?.sku || 'SH-BLU-M',
      hsnCode: products[0]?.hsnCode || '6205',
      quantity: 1,
      unit: 'PCS',
      price: products[0]?.sellingPrice || 1299,
      discountPercent: 0,
      taxableAmount: products[0]?.sellingPrice || 1299,
      gstRate: products[0]?.gstRate || 5,
      cgst: ((products[0]?.sellingPrice || 1299) * 0.025),
      sgst: ((products[0]?.sellingPrice || 1299) * 0.025),
      igst: 0,
      totalAmount: (products[0]?.sellingPrice || 1299) * 1.05
    }
  ]);

  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const addItem = (product: Product) => {
    const price = product.sellingPrice;
    const gstRate = product.gstRate;
    const taxable = price;
    const cgst = (taxable * (gstRate / 2)) / 100;
    const sgst = (taxable * (gstRate / 2)) / 100;

    const newItem: InvoiceItem = {
      id: `ii-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      variantSku: product.variants[0]?.sku || 'STD',
      hsnCode: product.hsnCode,
      quantity: 1,
      unit: product.uom,
      price,
      discountPercent: 0,
      taxableAmount: taxable,
      gstRate,
      cgst,
      sgst,
      igst: 0,
      totalAmount: taxable + cgst + sgst
    };

    setInvoiceItems([...invoiceItems, newItem]);
  };

  const updateItemQty = (index: number, qty: number) => {
    const updated = [...invoiceItems];
    const item = updated[index];
    item.quantity = qty;
    item.taxableAmount = item.price * qty * (1 - item.discountPercent / 100);
    item.cgst = (item.taxableAmount * (item.gstRate / 2)) / 100;
    item.sgst = (item.taxableAmount * (item.gstRate / 2)) / 100;
    item.totalAmount = item.taxableAmount + item.cgst + item.sgst;
    setInvoiceItems(updated);
  };

  const subtotal = invoiceItems.reduce((acc, i) => acc + i.taxableAmount, 0);
  const totalTax = invoiceItems.reduce((acc, i) => acc + i.cgst + i.sgst + i.igst, 0);
  const grandTotal = Math.round(subtotal + totalTax);

  const handlePostInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-00${invoices.length + 125}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      customerId: 'cust-1',
      customerName: selectedCustomer,
      placeOfSupply,
      isInterState: placeOfSupply !== 'Karnataka',
      items: invoiceItems,
      subtotal,
      totalDiscount: 0,
      totalTax,
      roundOff: 0,
      grandTotal,
      paymentMode,
      paymentStatus: paymentMode === 'Credit' ? 'Credit' : 'Paid',
      paidAmount: paymentMode === 'Credit' ? 0 : grandTotal,
      status: 'Issued'
    };

    onAddInvoice(newInv);
    setShowNewModal(false);
    setPreviewInvoice(newInv);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">GST Sales Invoices</h2>
          <p className="text-xs text-slate-500 mt-0.5">Create and manage tax invoices, CGST/SGST/IGST breakdown, and printouts.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New GST Invoice</span>
        </button>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold">
                <th className="py-4 px-4">Invoice #</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Payment Mode</th>
                <th className="py-4 px-4 text-right">Taxable (₹)</th>
                <th className="py-4 px-4 text-right">GST Tax (₹)</th>
                <th className="py-4 px-4 text-right">Grand Total (₹)</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-indigo-600">{inv.invoiceNumber}</td>
                  <td className="py-4 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">{inv.customerName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600">
                      {inv.paymentMode}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">₹ {inv.subtotal.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-right text-indigo-600 font-bold">₹ {inv.totalTax.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-right font-black text-slate-900">₹ {inv.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={() => setPreviewInvoice(inv)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                      title="View / Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">New GST Sales Invoice</h3>
                  <p className="text-xs text-slate-400">Generate tax invoice with automated CGST/SGST/IGST calculation.</p>
                </div>
              </div>
              <button onClick={() => setShowNewModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostInvoice} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
                  <select 
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
                  >
                    {parties.filter(p => p.type === 'Customer').map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.gstin || 'Unregistered'})</option>
                    ))}
                    <option value="Walk-in Customer">Walk-in Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Place of Supply</label>
                  <select 
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
                  >
                    <option value="Karnataka">Karnataka (Intra-State CGST+SGST)</option>
                    <option value="Maharashtra">Maharashtra (Inter-State IGST)</option>
                    <option value="Tamil Nadu">Tamil Nadu (Inter-State IGST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select 
                    value={paymentMode}
                    onChange={(e: any) => setPaymentMode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Credit">Credit (Udhar)</option>
                  </select>
                </div>
              </div>

              {/* Quick Product Selector */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">Click product to add to invoice:</label>
                <div className="flex flex-wrap gap-2">
                  {products.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addItem(p)}
                      className="px-3 py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs"
                    >
                      + {p.name} (₹ {p.sellingPrice})
                    </button>
                  ))}
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3">Item Name</th>
                      <th className="p-3">HSN</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">GST %</th>
                      <th className="p-3 text-right">Total (₹)</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                    {invoiceItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-3 font-bold">{item.productName}</td>
                        <td className="p-3 text-slate-500">{item.hsnCode}</td>
                        <td className="p-3">
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQty(idx, Number(e.target.value))}
                            className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-bold"
                          />
                        </td>
                        <td className="p-3">₹ {item.price}</td>
                        <td className="p-3">{item.gstRate}%</td>
                        <td className="p-3 text-right font-bold">₹ {item.totalAmount.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <button 
                            type="button"
                            onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Totals */}
              <div className="flex justify-end">
                <div className="w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-bold">₹ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total GST Tax:</span>
                    <span className="font-bold">₹ {totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-indigo-600">₹ {grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  Post & Print Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview / Print Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-800">TAX INVOICE</h3>
                <p className="text-xs text-slate-400">Hiffy Retail Store - GSTIN: 29AABCH1234F1Z5</p>
              </div>
              <button onClick={() => setPreviewInvoice(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 uppercase font-bold">Billed To:</p>
                <p className="font-bold text-slate-800 text-sm mt-1">{previewInvoice.customerName}</p>
                <p className="text-slate-500">Place of Supply: {previewInvoice.placeOfSupply}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 uppercase font-bold">Invoice Details:</p>
                <p className="font-bold text-indigo-600 text-sm mt-1">{previewInvoice.invoiceNumber}</p>
                <p className="text-slate-500">Date: {previewInvoice.date}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">HSN</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {previewInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold">{item.productName}</td>
                    <td className="p-3 text-slate-500">{item.hsnCode}</td>
                    <td className="p-3">{item.quantity} {item.unit}</td>
                    <td className="p-3 text-right">₹ {item.price}</td>
                    <td className="p-3 text-right font-bold">₹ {item.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-xs font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹ {previewInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Tax:</span>
                  <span>₹ {previewInvoice.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600">₹ {previewInvoice.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
