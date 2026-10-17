import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  CheckCircle2, 
  Truck, 
  Package, 
  Search, 
  FileText, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  Trash2, 
  Calendar, 
  Clock, 
  AlertCircle,
  Eye,
  Check,
  Pencil,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { PurchaseOrder, Party, Product, SuppliedProductDetail } from '../types';

interface PurchasesProps {
  purchaseOrders: PurchaseOrder[];
  parties: Party[];
  products?: Product[];
  onAddPO: (po: PurchaseOrder) => void;
  onUpdatePO?: (po: PurchaseOrder) => void;
  onDeletePO?: (poId: string) => void;
  onAddSupplier?: (supplier: Party) => void;
  onAddProduct?: (product: Product) => void;
}

export const Purchases: React.FC<PurchasesProps> = ({ 
  purchaseOrders, 
  parties, 
  products = [], 
  onAddPO, 
  onUpdatePO,
  onDeletePO,
  onAddSupplier,
  onAddProduct
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [viewSupplierCatalog, setViewSupplierCatalog] = useState<Party | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Supplier Form State
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Karnataka');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [creditLimit, setCreditLimit] = useState<number>(500000);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [syncToProductMaster, setSyncToProductMaster] = useState(true);

  // Dynamic Supplied Products List
  const [suppliedProducts, setSuppliedProducts] = useState<SuppliedProductDetail[]>([
    { productName: '', category: 'Groceries', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }
  ]);

  // New PO Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [poItems, setPoItems] = useState<Array<{
    productName: string;
    quantity: number;
    unitCost: number;
    taxRate: number;
  }>>([
    { productName: '', quantity: 10, unitCost: 100, taxRate: 18 }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const suppliers = parties.filter(p => p.type === 'Supplier');

  // Edit PO Form State
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [editSupplierId, setEditSupplierId] = useState('');
  const [editPoNumber, setEditPoNumber] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState<'Ordered' | 'Partial' | 'Received' | 'Cancelled'>('Ordered');
  const [editItems, setEditItems] = useState<Array<{
    id?: string;
    productId?: string;
    productName: string;
    quantity: number;
    unitCost: number;
    taxRate: number;
    total: number;
  }>>([]);

  // Delete Confirmation State
  const [deleteConfirmPO, setDeleteConfirmPO] = useState<PurchaseOrder | null>(null);

  // View PO Details State
  const [viewingPO, setViewingPO] = useState<PurchaseOrder | null>(null);

  // Edit PO Helpers
  const handleOpenEdit = (po: PurchaseOrder) => {
    setEditingPO(po);
    setEditPoNumber(po.poNumber);
    setEditSupplierId(po.supplierId || suppliers.find(s => s.name === po.supplierName)?.id || suppliers[0]?.id || '');
    setEditDate(po.date || new Date().toISOString().split('T')[0]);
    setEditStatus(po.status || 'Ordered');
    if (po.items && po.items.length > 0) {
      setEditItems(po.items.map(item => {
        const qty = Number(item.quantity) || 1;
        const cost = Number(item.unitCost) || 0;
        const tax = Number(item.taxRate) || 0;
        const tot = Number(item.total) || Math.round(qty * cost * (1 + tax / 100));
        return {
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: qty,
          unitCost: cost,
          taxRate: tax,
          total: tot
        };
      }));
    } else {
      setEditItems([{
        id: `pi-${Date.now()}`,
        productId: 'prod-1',
        productName: 'General Goods',
        quantity: 1,
        unitCost: po.totalAmount,
        taxRate: 0,
        total: po.totalAmount
      }]);
    }
  };

  const handleUpdateEditItem = (idx: number, field: string, val: any) => {
    const updated = [...editItems];
    updated[idx] = { ...updated[idx], [field]: val };
    const qty = Number(updated[idx].quantity) || 0;
    const cost = Number(updated[idx].unitCost) || 0;
    const tax = Number(updated[idx].taxRate) || 0;
    updated[idx].total = Math.round(qty * cost * (1 + tax / 100));
    setEditItems(updated);
  };

  const handleAddEditItem = () => {
    setEditItems([
      ...editItems, 
      { productName: '', quantity: 1, unitCost: 100, taxRate: 18, total: 118 }
    ]);
  };

  const handleRemoveEditItem = (idx: number) => {
    if (editItems.length > 1) {
      setEditItems(editItems.filter((_, i) => i !== idx));
    }
  };

  const editTotalAmount = editItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const handleSaveEditPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPO) return;

    const valid = editItems.filter(i => i.productName.trim().length > 0);
    if (valid.length === 0) {
      alert("Please enter at least one product name.");
      return;
    }

    const sup = suppliers.find(s => s.id === editSupplierId) || { id: editSupplierId, name: editingPO.supplierName };

    const updatedPO: PurchaseOrder = {
      ...editingPO,
      poNumber: editPoNumber.trim() || editingPO.poNumber,
      supplierId: sup.id,
      supplierName: sup.name,
      date: editDate,
      status: editStatus,
      items: valid.map((item, idx) => ({
        id: item.id || `pi-${Date.now()}-${idx}`,
        productId: item.productId || `prod-${idx}`,
        productName: item.productName,
        quantity: Number(item.quantity) || 1,
        unitCost: Number(item.unitCost) || 0,
        taxRate: Number(item.taxRate) || 0,
        total: Number(item.total) || Math.round((Number(item.quantity) || 1) * (Number(item.unitCost) || 0) * (1 + (Number(item.taxRate) || 0) / 100))
      })),
      totalAmount: Math.round(editTotalAmount)
    };

    if (onUpdatePO) {
      onUpdatePO(updatedPO);
    }
    showToast(`✓ Purchase Order ${updatedPO.poNumber} updated successfully!`);
    setEditingPO(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmPO) return;
    const poNum = deleteConfirmPO.poNumber;
    if (onDeletePO) {
      onDeletePO(deleteConfirmPO.id);
    }
    showToast(`✓ Purchase Order ${poNum} deleted successfully.`);
    setDeleteConfirmPO(null);
  };

  // Metrics
  const totalOrders = purchaseOrders.length;
  const totalPurchaseValue = purchaseOrders.reduce((sum, po) => sum + (po.totalAmount || 0), 0);
  const receivedOrders = purchaseOrders.filter(po => po.status === 'Received').length;
  const totalSuppliersCount = suppliers.length;

  // Filtered Orders
  const filteredOrders = purchaseOrders.filter(po => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      po.poNumber.toLowerCase().includes(q) ||
      po.supplierName.toLowerCase().includes(q) ||
      (po.status && po.status.toLowerCase().includes(q))
    );
  });

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.gstin && s.gstin.toLowerCase().includes(q))
    );
  });

  // Supplier Product Row Operations
  const handleAddSuppliedProductRow = () => {
    setSuppliedProducts([
      ...suppliedProducts,
      { productName: '', category: 'Groceries', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }
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

  // Submit Add Supplier
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim()) return;

    const validProducts = suppliedProducts.filter(p => p.productName.trim().length > 0);

    const newSupplier: Party = {
      id: `supp-${Date.now()}`,
      type: 'Supplier',
      name: supplierName.trim(),
      contactPerson: contactPerson.trim() || supplierName.trim(),
      phone: phone.trim() || '+91 98000 00000',
      email: email.trim() || 'supply@vendor.com',
      gstin: gstin.trim().toUpperCase() || '',
      address: address.trim() || 'Industrial Estate, Phase 1',
      state: state.trim() || 'Karnataka',
      creditLimit: Number(creditLimit) || 0,
      openingBalance: Number(openingBalance) || 0,
      currentOutstanding: Number(openingBalance) || 0,
      suppliedProducts: validProducts
    };

    if (onAddSupplier) {
      onAddSupplier(newSupplier);
    }

    // Auto-sync supplied products into ERP Master if checked
    if (syncToProductMaster && onAddProduct && validProducts.length > 0) {
      validProducts.forEach((vp, idx) => {
        const prod: Product = {
          id: `prod-sync-${Date.now()}-${idx}`,
          name: vp.productName,
          code: `SKU-${vp.productName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          brand: supplierName,
          category: vp.category || 'Groceries',
          subcategory: 'General',
          industry: (vp.category === 'Garments' || vp.category === 'Grocery' || vp.category === 'Electronics') ? (vp.category as any) : 'General',
          description: `Supplied by ${supplierName}`,
          uom: vp.uom || 'PCS',
          hsnCode: vp.hsnCode || '1006',
          gstRate: vp.gstRate || 18,
          purchasePrice: vp.unitCost || 100,
          sellingPrice: Math.round((vp.unitCost || 100) * 1.3),
          mrp: Math.round((vp.unitCost || 100) * 1.5),
          openingStock: (vp.minOrderQty || 10) * 2,
          minStockLevel: vp.minOrderQty || 10,
          barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          trackBatch: false,
          trackExpiry: false,
          variants: [],
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0]
        };
        onAddProduct(prod);
      });
    }

    showToast(`✓ Supplier "${newSupplier.name}" & ${validProducts.length} product(s) added successfully!`);
    setIsAddSupplierModalOpen(false);

    // Reset Form
    setSupplierName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setGstin('');
    setAddress('');
    setCreditLimit(500000);
    setOpeningBalance(0);
    setSuppliedProducts([{ productName: '', category: 'Groceries', hsnCode: '', unitCost: 0, uom: 'PCS', gstRate: 18, minOrderQty: 10 }]);
  };

  // Submit Add PO
  const handleSavePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
    if (!sup) {
      alert("Please select or add a supplier first.");
      return;
    }

    const validItems = poItems.filter(i => i.productName.trim().length > 0);
    if (validItems.length === 0) {
      alert("Please add at least one item to purchase.");
      return;
    }

    const calculatedItems = validItems.map((item, idx) => {
      const taxable = item.quantity * item.unitCost;
      const tax = (taxable * item.taxRate) / 100;
      return {
        id: `pi-${Date.now()}-${idx}`,
        productId: `p-${idx}`,
        productName: item.productName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        taxRate: item.taxRate,
        total: taxable + tax
      };
    });

    const totalAmount = calculatedItems.reduce((sum, i) => sum + i.total, 0);

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${String(purchaseOrders.length + 46).padStart(5, '0')}`,
      supplierId: sup.id,
      supplierName: sup.name,
      date: poDate,
      items: calculatedItems,
      totalAmount: Math.round(totalAmount),
      status: 'Ordered'
    };

    onAddPO(newPO);
    showToast(`✓ Purchase Order ${newPO.poNumber} created for ${sup.name}!`);
    setIsNewPOModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn select-text">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Purchase Orders & Bills
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Manage supplier purchase bills, stock replenishment, vendor ledgers, and supplier product catalogs.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons: Add Supplier Button + New PO */}
        <div className="flex flex-wrap items-center gap-3">
          {/* USER REQUESTED: ADD SUPPLIER BUTTON */}
          <button
            type="button"
            onClick={() => setIsAddSupplierModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Add a new Supplier and register supplied products"
          >
            <Truck className="w-4 h-4 text-white" />
            <span>+ Add Supplier</span>
          </button>

          {/* New Purchase Order Button */}
          <button
            type="button"
            onClick={() => setIsNewPOModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Orders</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalOrders}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Purchase bills generated</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Purchase Value</span>
            <ShoppingCart className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            ₹ {totalPurchaseValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Invoiced stock volume</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Stock Received</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {receivedOrders}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Fully delivered orders</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Active Suppliers</span>
            <Truck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {totalSuppliersCount}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Vendors with catalogs</span>
        </div>
      </div>

      {/* Sub Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Purchase Orders & Bills ({purchaseOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suppliers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'suppliers'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Suppliers & Catalogs ({suppliers.length})
          </button>
        </div>

        <div className="relative min-w-[260px] sm:min-w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'orders' ? "Search PO number, supplier name, status..." : "Search supplier name, phone, GSTIN..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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

      {/* VIEW 1: PURCHASE ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                  <th className="py-4 px-4">PO Number</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Supplier Name</th>
                  <th className="py-4 px-4">Items / Products</th>
                  <th className="py-4 px-4 text-right">Total Amount (₹)</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                      No purchase orders found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((po, idx) => (
                    <tr 
                      key={po.id} 
                      className="hover:bg-purple-50/40 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-black text-purple-600 dark:text-purple-400 font-mono">
                        {po.poNumber}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-bold">
                        {po.date}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-black text-slate-900 dark:text-white">
                          {po.supplierName}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        <span className="font-bold">{po.items?.length || 1} Item(s)</span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                          {po.items?.map(i => i.productName).join(', ') || 'General supplies'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-slate-900 dark:text-white text-xs">
                        ₹ {po.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          po.status === 'Received' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}>
                          {po.status === 'Received' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-500" />
                          )}
                          <span>{po.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingPO(po)}
                            title="View Purchase Order Details"
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(po)}
                            title="Edit Purchase Order"
                            className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xs"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmPO(po)}
                            title="Delete Purchase Order"
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
      )}

      {/* VIEW 2: SUPPLIERS DIRECTORY TAB */}
      {activeTab === 'suppliers' && (
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 uppercase font-black text-[11px] tracking-wider">
                  <th className="py-4 px-4">Supplier Name & Contact</th>
                  <th className="py-4 px-4">Phone / Email</th>
                  <th className="py-4 px-4">GSTIN</th>
                  <th className="py-4 px-4">State & Location</th>
                  <th className="py-4 px-4 text-center">Supplied Products</th>
                  <th className="py-4 px-4 text-right">Outstanding (Payable)</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                      No suppliers found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((s, idx) => (
                    <tr 
                      key={s.id} 
                      className="hover:bg-purple-50/40 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-xs shrink-0">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 dark:text-white text-xs">
                              {s.name}
                            </div>
                            {s.contactPerson && (
                              <div className="text-[10px] text-slate-500 font-bold">
                                Contact: {s.contactPerson}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{s.phone}</span>
                        </div>
                        {s.email && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-2.5 h-2.5 text-slate-400" />
                            <span className="truncate max-w-[140px]">{s.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`font-mono font-bold text-xs ${
                          s.gstin ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 italic'
                        }`}>
                          {s.gstin || 'Unregistered'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-[180px]">
                        <div className="truncate font-medium">{s.address}</div>
                        <div className="text-[10px] text-slate-500 font-bold flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          <span>{s.state}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {s.suppliedProducts && s.suppliedProducts.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setViewSupplierCatalog(s)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 text-[10px] font-black hover:bg-purple-100 transition-all cursor-pointer"
                          >
                            <Package className="w-3 h-3 text-purple-600" />
                            <span>{s.suppliedProducts.length} Products</span>
                            <Eye className="w-3 h-3 ml-0.5 text-purple-400" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold italic">No catalog added</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="font-black text-rose-600 dark:text-rose-400 text-xs">
                          ₹ {s.currentOutstanding.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSupplierId(s.id);
                            setIsNewPOModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black transition-all cursor-pointer"
                        >
                          + Create PO
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: View Supplier's Products Catalog */}
      {viewSupplierCatalog && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-xl">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {viewSupplierCatalog.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Supplied Products Catalog & Purchase Rates (GSTIN: {viewSupplierCatalog.gstin || 'N/A'})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewSupplierCatalog(null)}
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
                  {viewSupplierCatalog.suppliedProducts?.map((sp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{sp.productName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{sp.category || 'Groceries'}</td>
                      <td className="py-2.5 px-3 font-mono text-purple-600">{sp.hsnCode || '-'}</td>
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
                onClick={() => setViewSupplierCatalog(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER REQUESTED MODAL: ADD SUPPLIER BUTTON MODAL TO ADD NEW SUPPLIER & PRODUCT DETAILS */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-4 animate-scaleUp my-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-xl shadow-md">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Add New Supplier & Products Details
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Register vendor profile, GSTIN, payment terms, and supplied product line items with HSN & purchase rates.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSupplierModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4">
              {/* Supplier Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Supplier / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="e.g. India Gate Foods Ltd"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
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
                    placeholder="e.g. Manoj Kumar"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
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
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
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
                    placeholder="orders@vendor.com"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
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
                    placeholder="27AAACI1234P1ZV"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                    <option value="Advance">100% Advance</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Supplier Address & State
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="#45 APMC Market, Vashi"
                      className="col-span-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                    />
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                    >
                      <option value="Karnataka">Karnataka (29)</option>
                      <option value="Maharashtra">Maharashtra (27)</option>
                      <option value="Delhi">Delhi (07)</option>
                      <option value="Tamil Nadu">Tamil Nadu (33)</option>
                      <option value="Gujarat">Gujarat (24)</option>
                      <option value="Uttar Pradesh">Uttar Pradesh (09)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SUPPLIER PRODUCTS DETAILS SECTION */}
              <div className="p-4 bg-purple-50/70 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="text-xs font-black text-purple-950 dark:text-purple-300">
                        Supplied Products Details & Purchase Catalog
                      </span>
                      <p className="text-[10px] text-purple-700/80 dark:text-purple-400 font-bold">
                        Add items supplied by this vendor with purchase rates, HSN codes, and GST rates.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSuppliedProductRow}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3 h-3" /> + Add Product
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {suppliedProducts.map((sp, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40 space-y-2"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Amul Butter 500g"
                            value={sp.productName}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'productName', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="col-span-3">
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">
                            Category
                          </label>
                          <select
                            value={sp.category}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'category', e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value="Groceries">Groceries</option>
                            <option value="Men's Wear">Men's Wear</option>
                            <option value="Electronics">Electronics</option>
                            <option value="General">General</option>
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">
                            HSN Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 0405"
                            value={sp.hsnCode}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'hsnCode', e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-purple-600 dark:text-purple-400"
                          />
                        </div>

                        <div className="col-span-2 flex items-center justify-end pt-3">
                          {suppliedProducts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSuppliedProductRow(idx)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 items-center text-[10px]">
                        <div>
                          <span className="text-slate-400 font-bold block">Purchase Rate (₹):</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={sp.unitCost || ''}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'unitCost', Number(e.target.value))}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-black text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <span className="text-slate-400 font-bold block">GST Rate:</span>
                          <select
                            value={sp.gstRate}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'gstRate', Number(e.target.value))}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value={0}>0%</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-slate-400 font-bold block">Min Order Qty (MOQ):</span>
                          <input
                            type="number"
                            placeholder="10"
                            value={sp.minOrderQty || ''}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'minOrderQty', Number(e.target.value))}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <span className="text-slate-400 font-bold block">Unit (UOM):</span>
                          <select
                            value={sp.uom}
                            onChange={(e) => handleUpdateSuppliedProduct(idx, 'uom', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value="PCS">PCS</option>
                            <option value="KGS">KGS</option>
                            <option value="LTR">LTR</option>
                            <option value="PACK">PACK</option>
                            <option value="BOX">BOX</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sync to Master Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="syncMaster"
                    checked={syncToProductMaster}
                    onChange={(e) => setSyncToProductMaster(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer accent-purple-600"
                  />
                  <label htmlFor="syncMaster" className="text-xs font-bold text-purple-900 dark:text-purple-300 cursor-pointer">
                    Also automatically add these supplied products directly into ERP Product Master catalog
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Save Supplier & Products</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW PURCHASE ORDER */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 animate-scaleUp my-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-xl">
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Create New Purchase Order
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Issue order to supplier and replenish inventory stock.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPOModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePO} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Select Supplier *
                  </label>
                  <select
                    value={selectedSupplierId || suppliers[0]?.id || ''}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.gstin || 'No GSTIN'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    PO Date *
                  </label>
                  <input
                    type="date"
                    value={poDate}
                    onChange={(e) => setPoDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Items in PO */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase text-slate-500">
                  Purchase Order Line Items
                </label>
                {poItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Product name"
                        value={item.productName}
                        onChange={(e) => {
                          const updated = [...poItems];
                          updated[idx].productName = e.target.value;
                          setPoItems(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...poItems];
                          updated[idx].quantity = Number(e.target.value);
                          setPoItems(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Cost ₹"
                        value={item.unitCost}
                        onChange={(e) => {
                          const updated = [...poItems];
                          updated[idx].unitCost = Number(e.target.value);
                          setPoItems(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {poItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPoItems(poItems.filter((_, i) => i !== idx))}
                          className="text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setPoItems([...poItems, { productName: '', quantity: 10, unitCost: 100, taxRate: 18 }])}
                  className="text-xs font-black text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Item
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPOModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PURCHASE ORDER */}
      {editingPO && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 animate-scaleUp my-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl">
                  <Pencil className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Edit Purchase Order ({editPoNumber})
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Update supplier details, line items, order status, and rates.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPO(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPO} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    PO Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPoNumber}
                    onChange={(e) => setEditPoNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Supplier *
                  </label>
                  <select
                    value={editSupplierId}
                    onChange={(e) => setEditSupplierId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    PO Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Order Status
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Ordered', 'Partial', 'Received', 'Cancelled'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                        editStatus === st
                          ? st === 'Received'
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                            : st === 'Ordered'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : st === 'Partial'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase text-slate-500">
                    Purchase Order Items ({editItems.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddEditItem}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Item
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {editItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 items-center text-xs">
                      <div className="col-span-5">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">Product</label>
                        <input
                          type="text"
                          required
                          placeholder="Product Name"
                          value={item.productName}
                          onChange={(e) => handleUpdateEditItem(idx, 'productName', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">Qty</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleUpdateEditItem(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">Rate (₹)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitCost}
                          onChange={(e) => handleUpdateEditItem(idx, 'unitCost', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-0.5">Total (₹)</label>
                        <div className="font-black text-slate-900 dark:text-white pt-1">
                          ₹ {item.total?.toLocaleString('en-IN') || 0}
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end pt-3">
                        {editItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEditItem(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/40 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-300">
                  Total Purchase Order Value:
                </span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                  ₹ {editTotalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPO(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Update Purchase Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE PO CONFIRMATION */}
      {deleteConfirmPO && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-3.5 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Delete Purchase Order?
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    This record will be permanently removed.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmPO(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">PO Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{deleteConfirmPO.poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Supplier:</span>
                <span className="font-bold text-slate-900 dark:text-white">{deleteConfirmPO.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Order Value:</span>
                <span className="font-black text-rose-600 dark:text-rose-400">₹ {deleteConfirmPO.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{deleteConfirmPO.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmPO(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>Yes, Delete Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PURCHASE ORDER DETAILS */}
      {viewingPO && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 space-y-4 animate-scaleUp my-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-xl">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Purchase Order {viewingPO.poNumber}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      viewingPO.status === 'Received' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' 
                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {viewingPO.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Date: {viewingPO.date} • Supplier: {viewingPO.supplierName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingPO(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-black uppercase text-slate-400">Order Items Details</span>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {viewingPO.items && viewingPO.items.length > 0 ? (
                  viewingPO.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.productName}</div>
                        <div className="text-[10px] text-slate-400">Qty: {item.quantity} × ₹ {item.unitCost?.toLocaleString('en-IN')} (Tax: {item.taxRate || 0}%)</div>
                      </div>
                      <div className="font-black text-slate-900 dark:text-white text-xs">
                        ₹ {item.total?.toLocaleString('en-IN') || (item.quantity * item.unitCost).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-2 text-xs text-slate-400">General supplies / invoiced items</div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-black">
                <span className="text-slate-700 dark:text-slate-300">Grand Total Payable:</span>
                <span className="text-base text-purple-600 dark:text-purple-400 font-black">
                  ₹ {viewingPO.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PO</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingPO;
                    setViewingPO(null);
                    handleOpenEdit(target);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPO(null)}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
