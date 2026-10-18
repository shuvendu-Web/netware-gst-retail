import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  FileText, 
  X, 
  ChevronDown, 
  ChevronUp,
  Edit3,
  Phone,
  ShieldCheck,
  User,
  KeyRound,
  Check,
  Barcode,
  Scan,
  Camera,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Product, Invoice, InvoiceItem, Party } from '../types';

interface SalesProps {
  products: Product[];
  invoices: Invoice[];
  parties: Party[];
  onAddInvoice: (inv: Invoice) => void;
  isOpenNewModal?: boolean;
  onCloseNewModal?: () => void;
  onAddProduct?: (product: Product) => void;
}

export const Sales: React.FC<SalesProps> = ({ 
  products, 
  invoices, 
  parties, 
  onAddInvoice,
  isOpenNewModal,
  onCloseNewModal,
  onAddProduct
}) => {
  const [showNewModal, setShowNewModal] = useState(isOpenNewModal || false);

  useEffect(() => {
    if (isOpenNewModal !== undefined) {
      setShowNewModal(isOpenNewModal);
    }
  }, [isOpenNewModal]);
  
  // Customer details state in New Invoice modal
  const defaultCustomer = parties.find(p => p.type === 'Customer') || parties[0];
  const [customerNameInput, setCustomerNameInput] = useState(defaultCustomer?.name || 'Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState(defaultCustomer?.phone || '9876543210');
  const [customerOtp, setCustomerOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Main page customer/invoice search state
  const [customerSearch, setCustomerSearch] = useState('');

  const [placeOfSupply, setPlaceOfSupply] = useState('Karnataka');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Credit'>('UPI');
  
  // Invoice items state
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

  // Edit item popup modal state
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editItemForm, setEditItemForm] = useState<{
    productName: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    price: number;
    discountPercent: number;
    gstRate: number;
  }>({
    productName: '',
    hsnCode: '',
    quantity: 1,
    unit: 'PCS',
    price: 0,
    discountPercent: 0,
    gstRate: 18
  });

  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [quickProductSearch, setQuickProductSearch] = useState('');
  const [isProductSelectorExpanded, setIsProductSelectorExpanded] = useState(false);

  // Barcode Scanner & Quick Add State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [showAddNewProductModal, setShowAddNewProductModal] = useState(false);

  // New Product from Barcode Form State
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(100);
  const [newProdGstRate, setNewProdGstRate] = useState<number>(18);
  const [newProdHsn, setNewProdHsn] = useState('8517');
  const [newProdUom, setNewProdUom] = useState('PCS');
  const [newProdCategory, setNewProdCategory] = useState('General');
  const [saveToCatalogMaster, setSaveToCatalogMaster] = useState(true);

  // Sample barcodes for quick simulator
  const sampleBarcodes = [
    { name: "Men's Casual Shirt", barcode: '8901234567891', price: 1299 },
    { name: 'Premium Basmati Rice 1kg', barcode: '8909876543211', price: 140 },
    { name: 'Basmati Rice 10kg', barcode: '8909876543213', price: 1250 },
    { name: 'Cotton Round Neck T-Shirt', barcode: '8903334445551', price: 599 },
    { name: 'Sunflower Cooking Oil 1L', barcode: '8905556667771', price: 145 },
    { name: 'Slim Fit Denim Jeans 30', barcode: '8907778889991', price: 2199 },
  ];

  // Filter customers matching current customer input
  const matchingParties = parties.filter(p => {
    if (!customerNameInput.trim()) return true;
    const term = customerNameInput.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.phone && p.phone.includes(term)) ||
      (p.gstin && p.gstin.toLowerCase().includes(term))
    );
  });

  // Filter invoices on main page by customer name or invoice number
  const filteredInvoices = invoices.filter(inv => {
    if (!customerSearch.trim()) return true;
    const term = customerSearch.toLowerCase();
    return (
      inv.customerName.toLowerCase().includes(term) ||
      inv.invoiceNumber.toLowerCase().includes(term) ||
      (inv.customerPhone && inv.customerPhone.includes(term)) ||
      inv.paymentMode.toLowerCase().includes(term)
    );
  });

  // Filter products for quick addition
  const filteredQuickProducts = products.filter(p => {
    if (!quickProductSearch.trim()) return true;
    const term = quickProductSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      (p.hsnCode && p.hsnCode.includes(term)) ||
      (p.barcode && p.barcode.includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term))
    );
  });

  const displayedQuickProducts = isProductSelectorExpanded 
    ? filteredQuickProducts 
    : filteredQuickProducts.slice(0, 4);

  const addItem = (product: Product) => {
    // If product is already in invoiceItems, increment quantity
    const existingIdx = invoiceItems.findIndex(i => i.productId === product.id);
    if (existingIdx >= 0) {
      updateItemQty(existingIdx, invoiceItems[existingIdx].quantity + 1);
      return;
    }

    const price = product.sellingPrice;
    const gstRate = product.gstRate;
    const taxable = price;
    const isInterState = placeOfSupply !== 'Karnataka';
    const cgst = isInterState ? 0 : (taxable * (gstRate / 2)) / 100;
    const sgst = isInterState ? 0 : (taxable * (gstRate / 2)) / 100;
    const igst = isInterState ? (taxable * gstRate) / 100 : 0;

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
      igst,
      totalAmount: taxable + cgst + sgst + igst
    };

    setInvoiceItems(prev => [...prev, newItem]);
  };

  const handleScanBarcode = (barcodeToScan?: string) => {
    const rawCode = barcodeToScan !== undefined ? barcodeToScan : barcodeInput;
    const code = rawCode.trim();
    if (!code) {
      setScanMessage({ text: 'Please enter or scan a barcode.', type: 'error' });
      return;
    }

    // Look for matching product
    const matched = products.find(p => 
      p.barcode === code || 
      p.variants?.some(v => v.barcode === code || v.sku.toLowerCase() === code.toLowerCase())
    );

    if (matched) {
      const existingIdx = invoiceItems.findIndex(i => i.productId === matched.id);
      if (existingIdx >= 0) {
        updateItemQty(existingIdx, invoiceItems[existingIdx].quantity + 1);
        setScanMessage({ 
          text: `✓ Incremented quantity for "${matched.name}" to ${invoiceItems[existingIdx].quantity + 1}`, 
          type: 'success' 
        });
      } else {
        addItem(matched);
        setScanMessage({ 
          text: `✓ Scanned & Added "${matched.name}" (₹${matched.sellingPrice}) to invoice table!`, 
          type: 'success' 
        });
      }
      setBarcodeInput('');
      setTimeout(() => setScanMessage(null), 4000);
    } else {
      // Barcode not in catalog -> open Add New Product modal
      setNewProdBarcode(code);
      setNewProdName('');
      setNewProdPrice(100);
      setNewProdGstRate(18);
      setNewProdHsn('8517');
      setNewProdUom('PCS');
      setNewProdCategory('General');
      setShowAddNewProductModal(true);
      setScanMessage({
        text: `Barcode "${code}" not found in catalog. Enter details to add to table.`,
        type: 'info'
      });
      setBarcodeInput('');
    }
  };

  const handleAddNewProductFromBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const prodId = `prod-scan-${Date.now()}`;
    const price = Number(newProdPrice) || 0;
    const gstRate = Number(newProdGstRate) || 18;
    const taxable = price;
    const isInterState = placeOfSupply !== 'Karnataka';
    const cgst = isInterState ? 0 : (taxable * (gstRate / 2)) / 100;
    const sgst = isInterState ? 0 : (taxable * (gstRate / 2)) / 100;
    const igst = isInterState ? (taxable * gstRate) / 100 : 0;

    const newItem: InvoiceItem = {
      id: `ii-${Date.now()}`,
      productId: prodId,
      productName: newProdName.trim(),
      variantSku: 'STD',
      hsnCode: newProdHsn.trim() || '8517',
      quantity: 1,
      unit: newProdUom || 'PCS',
      price,
      discountPercent: 0,
      taxableAmount: taxable,
      gstRate,
      cgst,
      sgst,
      igst,
      totalAmount: taxable + cgst + sgst + igst
    };

    setInvoiceItems(prev => [...prev, newItem]);

    if (saveToCatalogMaster && onAddProduct) {
      const newProductObj: Product = {
        id: prodId,
        name: newProdName.trim(),
        code: `SKU-${prodId.slice(-6).toUpperCase()}`,
        brand: 'Generic',
        category: newProdCategory || 'General',
        subcategory: 'General',
        industry: 'General',
        description: '',
        uom: 'PCS',
        hsnCode: newProdHsn.trim() || '8517',
        gstRate,
        purchasePrice: Math.round(price * 0.75),
        sellingPrice: price,
        mrp: Math.round(price * 1.15),
        openingStock: 50,
        minStockLevel: 5,
        barcode: newProdBarcode.trim(),
        trackBatch: false,
        trackExpiry: false,
        variants: [
          { id: `v-${Date.now()}`, sku: `${newProdName.substring(0, 3).toUpperCase()}-STD`, stock: 50, price, mrp: Math.round(price * 1.15), barcode: newProdBarcode.trim() }
        ],
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      onAddProduct(newProductObj);
    }

    setShowAddNewProductModal(false);
    setScanMessage({
      text: `✓ New product "${newProdName.trim()}" added to invoice table!`,
      type: 'success'
    });
    setTimeout(() => setScanMessage(null), 4000);
  };

  const updateItemQty = (index: number, qty: number) => {
    const updated = [...invoiceItems];
    const item = updated[index];
    const validQty = Math.max(1, qty);
    item.quantity = validQty;
    item.taxableAmount = item.price * validQty * (1 - item.discountPercent / 100);
    const isInterState = placeOfSupply !== 'Karnataka';
    item.cgst = isInterState ? 0 : (item.taxableAmount * (item.gstRate / 2)) / 100;
    item.sgst = isInterState ? 0 : (item.taxableAmount * (item.gstRate / 2)) / 100;
    item.igst = isInterState ? (item.taxableAmount * item.gstRate) / 100 : 0;
    item.totalAmount = item.taxableAmount + item.cgst + item.sgst + item.igst;
    setInvoiceItems(updated);
  };

  // Open Edit Item modal with selected item details
  const handleOpenEditItem = (index: number) => {
    const item = invoiceItems[index];
    setEditingItemIndex(index);
    setEditItemForm({
      productName: item.productName,
      hsnCode: item.hsnCode,
      quantity: item.quantity,
      unit: item.unit || 'PCS',
      price: item.price,
      discountPercent: item.discountPercent || 0,
      gstRate: item.gstRate
    });
  };

  // Save changes from Edit Item modal
  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItemIndex === null) return;

    const updated = [...invoiceItems];
    const item = updated[editingItemIndex];
    
    const qty = Number(editItemForm.quantity) || 1;
    const price = Number(editItemForm.price) || 0;
    const discount = Number(editItemForm.discountPercent) || 0;
    const gst = Number(editItemForm.gstRate) || 0;

    const taxable = price * qty * (1 - discount / 100);
    const isInterState = placeOfSupply !== 'Karnataka';
    const cgst = isInterState ? 0 : (taxable * (gst / 2)) / 100;
    const sgst = isInterState ? 0 : (taxable * (gst / 2)) / 100;
    const igst = isInterState ? (taxable * gst) / 100 : 0;
    const total = taxable + cgst + sgst + igst;

    updated[editingItemIndex] = {
      ...item,
      productName: editItemForm.productName,
      hsnCode: editItemForm.hsnCode,
      quantity: qty,
      unit: editItemForm.unit,
      price,
      discountPercent: discount,
      taxableAmount: taxable,
      gstRate: gst,
      cgst,
      sgst,
      igst,
      totalAmount: total
    };

    setInvoiceItems(updated);
    setEditingItemIndex(null);
  };

  // OTP Handlers
  const handleSendOtp = () => {
    if (!customerPhone.trim()) {
      alert("Please enter a valid customer phone number first.");
      return;
    }
    setIsOtpSent(true);
    setIsOtpVerified(false);
    // Provide a sample 4-digit OTP for testing
    setCustomerOtp('4829');
  };

  const handleVerifyOtp = () => {
    if (customerOtp.trim().length >= 4) {
      setIsOtpVerified(true);
    } else {
      alert("Please enter at least a 4-digit OTP.");
    }
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
      customerName: customerNameInput || 'Walk-in Customer',
      customerPhone,
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

  // Live calculation for edit item modal
  const editTaxable = (Number(editItemForm.price) || 0) * (Number(editItemForm.quantity) || 1) * (1 - (Number(editItemForm.discountPercent) || 0) / 100);
  const editTax = (editTaxable * (Number(editItemForm.gstRate) || 0)) / 100;
  const editTotal = editTaxable + editTax;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header with Customer Name Search on Main Page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">GST Sales Invoices</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Create and manage tax invoices, CGST/SGST/IGST breakdown, customer OTP verification, and printouts.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Main Page Search Field for Customer Name */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Search customer name or invoice #..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-8 pr-7 py-2 text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
            {customerSearch && (
              <button 
                onClick={() => setCustomerSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New GST Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                <th className="py-4 px-4">Invoice #</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Customer Name</th>
                <th className="py-4 px-4">Payment Mode</th>
                <th className="py-4 px-4 text-right">Taxable (₹)</th>
                <th className="py-4 px-4 text-right">GST Tax (₹)</th>
                <th className="py-4 px-4 text-right">Grand Total (₹)</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                    No sales invoices found matching "{customerSearch}".
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-indigo-600 dark:text-indigo-400">{inv.invoiceNumber}</td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{inv.date}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 dark:text-white">{inv.customerName}</div>
                      {inv.customerPhone && (
                        <div className="text-[10px] text-slate-400 font-mono">{inv.customerPhone}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {inv.paymentMode}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">₹ {inv.subtotal.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-right text-indigo-600 dark:text-indigo-400 font-bold">₹ {inv.totalTax.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-right font-black text-slate-900 dark:text-white">₹ {inv.grandTotal.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.paymentStatus === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                        'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => setPreviewInvoice(inv)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="View / Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New GST Sales Invoice Popup Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-4 sm:p-5 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white">New GST Sales Invoice</h3>
                  <p className="text-[11px] text-slate-400">Customer details, OTP authentication, automated CGST/SGST/IGST calculation, and editable items.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowNewModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostInvoice} className="space-y-6">
              {/* Customer Details Row: Search Customer Name, Phone Number, OTP Field */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                    Customer Information & Verification
                  </span>
                  <span className="text-[10px] text-slate-400">Search registered party or type new</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Customer Name Input & Search Field */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Customer Name
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerNameInput('Walk-in Customer');
                          setCustomerPhone('9999999999');
                          setShowCustomerDropdown(false);
                        }}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                      >
                        Walk-in
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={customerNameInput}
                        onChange={(e) => {
                          setCustomerNameInput(e.target.value);
                          setShowCustomerDropdown(true);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        placeholder="Search or enter customer name..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-7 py-2.5 text-xs text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                        required
                      />
                      {customerNameInput && (
                        <button
                          type="button"
                          onClick={() => setCustomerNameInput('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Customer Live Suggestions Dropdown */}
                    {showCustomerDropdown && matchingParties.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {matchingParties.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setCustomerNameInput(p.name);
                              setCustomerPhone(p.phone || '');
                              if (p.state) setPlaceOfSupply(p.state);
                              setShowCustomerDropdown(false);
                            }}
                            className="p-2.5 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/60 cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <div>
                              <span className="text-xs font-bold text-slate-800 dark:text-white block">{p.name}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {p.phone ? `Ph: ${p.phone}` : ''} {p.gstin ? `• GST: ${p.gstin}` : '• Unregistered'}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {p.state || 'Karnataka'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Customer Phone Number Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-xs text-slate-800 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 3. Customer OTP Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        OTP Verification
                      </label>
                      {isOtpVerified && (
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          maxLength={6}
                          value={customerOtp}
                          onChange={(e) => setCustomerOtp(e.target.value)}
                          placeholder="OTP code"
                          className={`w-full bg-white dark:bg-slate-900 border rounded-xl pl-8 pr-2 py-2.5 text-xs font-mono font-bold tracking-wider text-slate-800 dark:text-white focus:outline-none focus:ring-2 shadow-2xs ${
                            isOtpVerified 
                              ? 'border-emerald-400 bg-emerald-50/20 text-emerald-700 dark:text-emerald-300' 
                              : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                          }`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors whitespace-nowrap shrink-0 border border-slate-300 dark:border-slate-600 cursor-pointer shadow-2xs"
                        title="Send verification OTP to customer phone"
                      >
                        {isOtpSent ? 'Resend' : 'Send OTP'}
                      </button>

                      {isOtpSent && !isOtpVerified && (
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 shadow-md cursor-pointer"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax & Payment Settings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Place of Supply (GST Jurisdiction)</label>
                  <select 
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white font-bold cursor-pointer"
                  >
                    <option value="Karnataka">Karnataka (Intra-State: CGST + SGST)</option>
                    <option value="Maharashtra">Maharashtra (Inter-State: IGST)</option>
                    <option value="Tamil Nadu">Tamil Nadu (Inter-State: IGST)</option>
                    <option value="Delhi">Delhi (Inter-State: IGST)</option>
                    <option value="Gujarat">Gujarat (Inter-State: IGST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                  <select 
                    value={paymentMode}
                    onChange={(e: any) => setPaymentMode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white font-bold cursor-pointer"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Credit">Credit (Udhar / Khata)</option>
                  </select>
                </div>
              </div>

              {/* Quick Product Selector & Barcode Scanner */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 transition-all space-y-3.5">
                {/* Barcode Scanner & New Product Scan Bar */}
                <div className="bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                      <Barcode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span>Barcode / SKU Scan</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">Auto-Detect</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Scan physical barcode or type & press Enter</div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleScanBarcode();
                          }
                        }}
                        placeholder="Scan barcode (e.g. 8901234567891) or enter SKU..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                      />
                      {barcodeInput && (
                        <button
                          type="button"
                          onClick={() => setBarcodeInput('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleScanBarcode()}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Scan & Add</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsScannerModalOpen(true)}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                      title="Open Live Camera/Laser Barcode Scanner"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="hidden sm:inline">Camera Scanner</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNewProdBarcode('');
                        setNewProdName('');
                        setNewProdPrice(100);
                        setNewProdGstRate(18);
                        setNewProdHsn('8517');
                        setNewProdUom('PCS');
                        setNewProdCategory('General');
                        setShowAddNewProductModal(true);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                      title="Add a brand new product not in inventory to this table"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">New Product</span>
                    </button>
                  </div>
                </div>

                {/* Scan Notification Banner */}
                {scanMessage && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all animate-in fade-in ${
                    scanMessage.type === 'success' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' 
                      : scanMessage.type === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{scanMessage.text}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setScanMessage(null)}
                      className="p-0.5 rounded-full hover:opacity-75 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Click product to add to invoice header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Click product to add to invoice:
                    </label>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700/80 px-2 py-0.5 rounded-full">
                      {filteredQuickProducts.length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:w-56">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={quickProductSearch}
                        onChange={(e) => setQuickProductSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-7 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                      />
                      {quickProductSearch && (
                        <button
                          type="button"
                          onClick={() => setQuickProductSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Collapse / Expand Toggle Button with icon */}
                    <button
                      type="button"
                      onClick={() => setIsProductSelectorExpanded(!isProductSelectorExpanded)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
                        isProductSelectorExpanded 
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' 
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isProductSelectorExpanded ? "Collapse to max 4 items" : `Show all (${filteredQuickProducts.length}) items`}
                    >
                      <span className="text-[11px]">
                        {isProductSelectorExpanded ? 'Collapse' : (filteredQuickProducts.length > 4 ? `+${filteredQuickProducts.length - 4}` : 'All')}
                      </span>
                      {isProductSelectorExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product items (max 4 by default) */}
                <div className="flex flex-wrap items-center gap-2">
                  {displayedQuickProducts.length === 0 ? (
                    <div className="py-2 text-xs text-slate-400 italic">
                      No products found matching "{quickProductSearch}"
                    </div>
                  ) : (
                    displayedQuickProducts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addItem(p)}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        title={`Click to add ${p.name} - ₹${p.sellingPrice}`}
                      >
                        <Plus className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span className="truncate max-w-[150px]">{p.name}</span>
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-1.5 py-0.2 rounded font-black">
                          ₹{p.sellingPrice}
                        </span>
                      </button>
                    ))
                  )}

                  {!isProductSelectorExpanded && filteredQuickProducts.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setIsProductSelectorExpanded(true)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-black transition-all border border-indigo-200/80 dark:border-indigo-800/60 shadow-2xs cursor-pointer"
                    >
                      <span>+{filteredQuickProducts.length - 4} more</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isProductSelectorExpanded && filteredQuickProducts.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setIsProductSelectorExpanded(false)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black transition-all border border-slate-300 dark:border-slate-600 shadow-2xs cursor-pointer"
                    >
                      <span>Collapse to 4</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Invoice Items Table with Edit Action Option */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
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
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium text-slate-800 dark:text-slate-200">
                    {invoiceItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                          No items added yet. Click on any product above to add to this invoice.
                        </td>
                      </tr>
                    ) : (
                      invoiceItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-bold">
                            <div>{item.productName}</div>
                            {item.discountPercent > 0 && (
                              <span className="text-[10px] text-emerald-600 font-bold">{item.discountPercent}% Off applied</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500 dark:text-slate-400 font-mono">{item.hsnCode}</td>
                          <td className="p-3">
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItemQty(idx, Number(e.target.value))}
                              className="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-center font-bold"
                            />
                            <span className="ml-1 text-[10px] text-slate-400">{item.unit || 'PCS'}</span>
                          </td>
                          <td className="p-3 font-mono">₹ {item.price}</td>
                          <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{item.gstRate}%</td>
                          <td className="p-3 text-right font-black font-mono">₹ {item.totalAmount.toFixed(2)}</td>
                          <td className="p-3 text-center whitespace-nowrap">
                            {/* ITEM TABLE ACTION: EDIT OPTION CLICK TO EDIT POPUP */}
                            <button 
                              type="button"
                              onClick={() => handleOpenEditItem(idx)}
                              className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors mr-1.5 cursor-pointer"
                              title="Edit item price, quantity, discount & GST"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            
                            <button 
                              type="button"
                              onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Totals */}
              <div className="flex justify-end">
                <div className="w-72 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxable Subtotal:</span>
                    <span className="font-bold font-mono">₹ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Total GST Tax:</span>
                    <span className="font-bold font-mono">₹ {totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Grand Total:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">₹ {grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={invoiceItems.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Post & Print Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT INVOICE ITEM DETAILS POPUP MODAL */}
      {editingItemIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-60 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                  <Edit3 className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Edit Invoice Item</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                    Modify quantity, unit price, discount %, GST rate, or HSN code.
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingItemIndex(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Item / Product Name</label>
                <input
                  type="text"
                  value={editItemForm.productName}
                  onChange={(e) => setEditItemForm({ ...editItemForm, productName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* HSN Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={editItemForm.hsnCode}
                    onChange={(e) => setEditItemForm({ ...editItemForm, hsnCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-white"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Unit of Measurement</label>
                  <select
                    value={editItemForm.unit}
                    onChange={(e) => setEditItemForm({ ...editItemForm, unit: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="PACK">PACK (Packs)</option>
                    <option value="BOX">BOX (Boxes)</option>
                    <option value="LTR">LTR (Litres)</option>
                    <option value="MTR">MTR (Metres)</option>
                    <option value="BAG">BAG (Bags)</option>
                    <option value="DOZ">DOZ (Dozens)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Quantity */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={editItemForm.quantity}
                    onChange={(e) => setEditItemForm({ ...editItemForm, quantity: Math.max(1, Number(e.target.value)) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                    required
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editItemForm.price}
                    onChange={(e) => setEditItemForm({ ...editItemForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white font-mono"
                    required
                  />
                </div>

                {/* Discount % */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editItemForm.discountPercent}
                    onChange={(e) => setEditItemForm({ ...editItemForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* GST Rate */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">GST Tax Rate (%)</label>
                <select
                  value={editItemForm.gstRate}
                  onChange={(e) => setEditItemForm({ ...editItemForm, gstRate: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value={0}>0% (Exempted)</option>
                  <option value={5}>5% (Essential Commodities)</option>
                  <option value={12}>12% (Standard Concessional)</option>
                  <option value={18}>18% (Standard GST Rate)</option>
                  <option value={28}>28% (Luxury / Sin Rate)</option>
                </select>
              </div>

              {/* Live Preview Calculation Strip */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Taxable Subtotal</span>
                  <span className="font-mono text-slate-900 dark:text-white">₹{editTaxable.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">GST ({editItemForm.gstRate}%)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">₹{editTax.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Item Total</span>
                  <span className="font-mono text-emerald-600 dark:text-[#64e447]">₹{editTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItemIndex(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview / Print Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white">TAX INVOICE</h3>
                <p className="text-xs text-slate-400">Hiffy Retail Store - GSTIN: 29AABCH1234F1Z5</p>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewInvoice(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 uppercase font-bold text-[10px]">Billed To:</p>
                <p className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">{previewInvoice.customerName}</p>
                {previewInvoice.customerPhone && (
                  <p className="text-slate-600 dark:text-slate-300 font-mono text-xs">Phone: {previewInvoice.customerPhone}</p>
                )}
                <p className="text-slate-500 dark:text-slate-400">Place of Supply: {previewInvoice.placeOfSupply}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Invoice Details:</p>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">{previewInvoice.invoiceNumber}</p>
                <p className="text-slate-500 dark:text-slate-400">Date: {previewInvoice.date}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Item</th>
                  <th className="p-2.5">HSN</th>
                  <th className="p-2.5">Qty</th>
                  <th className="p-2.5 text-right">Price</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {previewInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold">{item.productName}</td>
                    <td className="p-2.5 text-slate-500 dark:text-slate-400">{item.hsnCode}</td>
                    <td className="p-2.5">{item.quantity} {item.unit}</td>
                    <td className="p-2.5 text-right">₹ {item.price}</td>
                    <td className="p-2.5 text-right font-bold">₹ {item.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-xs font-medium">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span>₹ {previewInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST Tax:</span>
                  <span>₹ {previewInvoice.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">₹ {previewInvoice.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Live Barcode Scanner Simulation Modal */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-60 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">Live POS Barcode Scanner</h3>
                  <p className="text-[10px] text-slate-400">Align barcode with viewfinder or click sample barcodes below</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsScannerModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Scanner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder Window with Animated Laser Beam */}
            <div className="relative h-48 bg-slate-950 rounded-2xl border-2 border-dashed border-indigo-500/40 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br"></div>

              {/* Animated Laser Scanning Line */}
              <div className="absolute inset-x-4 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-bounce duration-1000"></div>

              <Barcode className="w-16 h-16 text-slate-700/60 mb-2" />
              <p className="text-xs font-mono font-bold text-indigo-300">Target Barcode in Camera Frame</p>
              <p className="text-[10px] text-slate-500">Supports EAN-13, UPC-A, Code-128 & QR</p>
            </div>

            {/* Manual Code Entry inside scanner */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Manual Barcode / SKU Trigger:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleScanBarcode();
                      setIsScannerModalOpen(false);
                    }
                  }}
                  placeholder="Enter barcode or SKU number..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    handleScanBarcode();
                    setIsScannerModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer whitespace-nowrap"
                >
                  Scan Now
                </button>
              </div>
            </div>

            {/* Quick-Click Sample Barcodes */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">Click to Simulate Scan:</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Known & New items</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sampleBarcodes.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleScanBarcode(item.barcode);
                      setIsScannerModalOpen(false);
                    }}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-left transition-all hover:scale-[1.02] cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="font-mono text-slate-400">{item.barcode}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{item.price}</span>
                    </div>
                  </button>
                ))}

                {/* Simulated Unknown Barcode button to trigger "Add New Product" */}
                <button
                  type="button"
                  onClick={() => {
                    handleScanBarcode('8909999999999');
                    setIsScannerModalOpen(false);
                  }}
                  className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/80 text-left transition-all hover:scale-[1.02] cursor-pointer col-span-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-800 dark:text-amber-300">
                      ⚡ Test Unknown Barcode (8909999999999)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                      Triggers New Product
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
                    Simulates scanning an unlisted item to test "Scan & Add New Product to Table"
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Scan to Barcode: Add New Product to Table Modal */}
      {showAddNewProductModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-60 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-4 sm:p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Barcode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">Scan to Barcode: Add New Product</h3>
                  <p className="text-[10px] text-slate-400">Enter product details to add directly to invoice items table</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddNewProductModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scanned Barcode Badge */}
            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Scanned Barcode:</span>
                <span className="font-mono text-xs font-black bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-white">
                  {newProdBarcode || 'N/A (Manual Entry)'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                New Item
              </span>
            </div>

            <form onSubmit={handleAddNewProductFromBarcode} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product / Item Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Wireless Bluetooth Earbuds Pro"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-white"
                  />
                </div>

                {/* GST Rate % */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GST Tax Slab Rate
                  </label>
                  <select
                    value={newProdGstRate}
                    onChange={(e) => setNewProdGstRate(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  >
                    <option value={0}>0% (Exempted)</option>
                    <option value={5}>5% (Essential Goods)</option>
                    <option value={12}>12% (Standard Lower)</option>
                    <option value={18}>18% (Standard Rate)</option>
                    <option value={28}>28% (Luxury / Electronics)</option>
                  </select>
                </div>

                {/* HSN Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    HSN / SAC Code
                  </label>
                  <input
                    type="text"
                    value={newProdHsn}
                    onChange={(e) => setNewProdHsn(e.target.value)}
                    placeholder="e.g. 8517"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-white"
                  />
                </div>

                {/* Unit of Measure */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit of Measurement (UOM)
                  </label>
                  <select
                    value={newProdUom}
                    onChange={(e) => setNewProdUom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="BOX">BOX (Box)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="MTR">MTR (Meters)</option>
                    <option value="NOS">NOS (Numbers)</option>
                    <option value="PACK">PACK (Packet)</option>
                    <option value="LTR">LTR (Liters)</option>
                  </select>
                </div>

                {/* Category */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product Category
                  </label>
                  <input
                    type="text"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    placeholder="e.g. Electronics, Grocery, Apparel, Hardware"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Master Inventory Catalog Checkbox */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="saveToCatalogCheckbox"
                  checked={saveToCatalogMaster}
                  onChange={(e) => setSaveToCatalogMaster(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="saveToCatalogCheckbox" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                  Save to Master Product Catalog & Inventory
                </label>
              </div>

              {/* Live Tax & Price Calculation Preview Card */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Taxable Price: </span>
                  <span className="font-bold text-slate-800 dark:text-white font-mono">₹{newProdPrice.toFixed(2)}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {placeOfSupply !== 'Karnataka' ? `IGST (${newProdGstRate}%): ` : `CGST+SGST (${newProdGstRate}%): `}
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    ₹{((newProdPrice * newProdGstRate) / 100).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Item Total: </span>
                  <span className="font-black text-slate-900 dark:text-white font-mono text-sm">
                    ₹{(newProdPrice * (1 + newProdGstRate / 100)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddNewProductModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Invoice Table</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
