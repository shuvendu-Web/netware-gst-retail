import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Sparkles, 
  Layers, 
  Trash2, 
  X,
  Upload,
  Send,
  Edit3,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  TrendingUp,
  Boxes,
  CheckCircle2,
  Eye,
  ZoomIn,
  Check,
  Barcode,
  Printer,
  Copy
} from 'lucide-react';
import { Product } from '../types';

interface ProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  primaryColor: string;
  isDarkMode: boolean;
}

export const Products: React.FC<ProductsProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, primaryColor, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('default');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [activeProductForPackaging, setActiveProductForPackaging] = useState<Product | null>(null);
  const [zoomedProduct, setZoomedProduct] = useState<Product | null>(null);

  // New product form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState("Electronics");
  const [industry, setIndustry] = useState<'Garments' | 'Grocery' | 'Electronics' | 'General'>('Electronics');
  const [hsnCode, setHsnCode] = useState('8517');
  const [gstRate, setGstRate] = useState(18);
  const [purchasePrice, setPurchasePrice] = useState(18000);
  const [sellingPrice, setSellingPrice] = useState(25999);
  const [openingStock, setOpeningStock] = useState(25);
  const [uom, setUom] = useState('PCS');
  const [barcode, setBarcode] = useState('8901234567999');
  const [productImage, setProductImage] = useState<string>('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80');

  // Edit product form state
  const [editName, setEditName] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editHsn, setEditHsn] = useState('');
  const [editGst, setEditGst] = useState(18);
  const [editPurchase, setEditPurchase] = useState(0);
  const [editSelling, setEditSelling] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editImage, setEditImage] = useState('');

  // AI Discovery & Product Preview state in modal
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCandidates, setAiCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [showDropdownSuggestions, setShowDropdownSuggestions] = useState(false);
  const [isCatalogMatchCollapsed, setIsCatalogMatchCollapsed] = useState(true);

  // Handle Industry change to Grocery or others
  const handleIndustryChange = (ind: 'Garments' | 'Grocery' | 'Electronics' | 'General') => {
    setIndustry(ind);
    if (ind === 'Grocery') {
      setCategory('Groceries & Staples');
      setHsnCode('1006');
      setGstRate(0);
      setPurchasePrice(90);
      setSellingPrice(140);
    } else if (ind === 'Garments') {
      setCategory("Men's Wear");
      setHsnCode('6205');
      setGstRate(5);
      setPurchasePrice(650);
      setSellingPrice(1299);
    } else if (ind === 'Electronics') {
      setCategory('Mobiles & Gadgets');
      setHsnCode('8517');
      setGstRate(18);
      setPurchasePrice(18000);
      setSellingPrice(25999);
    }
  };

  const [barcodeStickerProduct, setBarcodeStickerProduct] = useState<Product | null>(null);
  const [barcodeCopied, setBarcodeCopied] = useState(false);

  // Generate authentic product-related EAN-13 barcode encoded with product info
  const generateProductBarcode = (prodName?: string, prodCategory?: string, prodHsn?: string, prodPrice?: number) => {
    const pName = prodName || name || 'Product';
    const pCat = prodCategory || category || 'General';
    const pHsn = prodHsn || hsnCode || '8517';
    const pPrice = prodPrice || sellingPrice || 100;

    // 1. GS1 India retail country prefix
    const prefix = '890';

    // 2. Industry category code (2 digits)
    let catCode = '10';
    if (industry === 'Grocery' || pCat.toLowerCase().includes('groc')) catCode = '20';
    else if (industry === 'Electronics' || pCat.toLowerCase().includes('elect')) catCode = '30';
    else if (industry === 'Garments' || pCat.toLowerCase().includes('cloth') || pCat.toLowerCase().includes('wear')) catCode = '40';
    else catCode = '50';

    // 3. HSN code last 4 digits
    const cleanHsn = (pHsn.replace(/\D/g, '') || '8517').padStart(4, '0').slice(-4);

    // 4. Sequence from product name/price hash (3 digits)
    let hash = 0;
    for (let i = 0; i < pName.length; i++) hash = (hash * 31 + pName.charCodeAt(i)) % 900;
    const seq = String(100 + (hash % 900)).padStart(3, '0');

    // 12 digits
    const raw12 = (prefix + catCode + cleanHsn + seq).slice(0, 12);

    // 5. EAN-13 Modulo-10 checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const d = parseInt(raw12[i], 10);
      sum += (i % 2 === 0) ? d : d * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    const finalBarcode = raw12 + checksum;

    setBarcode(finalBarcode);
    return finalBarcode;
  };

  // Live typing debounce for AI agent suggestions
  useEffect(() => {
    if (!aiQuery.trim() || aiQuery.length < 2) {
      setAiCandidates([]);
      setShowDropdownSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setAiLoading(true);
      try {
        const res = await fetch('/api/ai-product-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: aiQuery, industry })
        });
        const data = await res.json();
        setAiCandidates(data.candidates || []);
        setShowDropdownSuggestions(true);
      } catch (err) {
        console.error(err);
      } finally {
        setAiLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [aiQuery, industry]);

  const handleRunAIProductDiscovery = async () => {
    const queryToUse = aiQuery || name;
    if (!queryToUse.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-product-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToUse, industry })
      });
      const data = await res.json();
      const candidates = data.candidates || [];
      setAiCandidates(candidates);
      if (candidates.length > 0) {
        const best = candidates[0];
        applyAICandidate(best);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.openingStock) || 0), 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + ((Number(p.sellingPrice) || 0) * (Number(p.openingStock) || 0)), 0);
  const lowStockCount = products.filter(p => (Number(p.openingStock) || 0) <= 15).length;

  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.toLowerCase().includes(q)) ||
      (p.hsnCode && p.hsnCode.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));
    const matchesIndustry = selectedIndustry === 'All' || p.industry === selectedIndustry;
    const matchesStock = 
      stockStatusFilter === 'all' 
        ? true 
        : stockStatusFilter === 'low-stock' 
        ? (p.openingStock <= 15) 
        : (p.openingStock > 15);
    return matchesSearch && matchesIndustry && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'stock-asc') return a.openingStock - b.openingStock;
    if (sortBy === 'stock-desc') return b.openingStock - a.openingStock;
    return 0;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      code: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: brand || 'Generic',
      category,
      subcategory: 'General',
      industry,
      description: `${name} by ${brand}`,
      uom: industry === 'Grocery' ? 'KG' : 'PCS',
      hsnCode,
      gstRate,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      mrp: Number(sellingPrice) * 1.25,
      openingStock: Number(openingStock),
      minStockLevel: 5,
      image: productImage,
      barcode,
      trackBatch: industry === 'Grocery',
      trackExpiry: industry === 'Grocery',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      variants: industry === 'Garments' ? [
        { id: 'v1', sku: `${name.substring(0,3).toUpperCase()}-BLU-M`, color: 'Blue', size: 'M', stock: Number(openingStock) / 2, price: Number(sellingPrice), mrp: Number(sellingPrice)*1.25, barcode },
        { id: 'v2', sku: `${name.substring(0,3).toUpperCase()}-BLU-L`, color: 'Blue', size: 'L', stock: Number(openingStock) / 2, price: Number(sellingPrice), mrp: Number(sellingPrice)*1.25, barcode: barcode + '1' }
      ] : [
        { id: 'v3', sku: `${name.substring(0,3).toUpperCase()}-STD`, packSize: 'Standard Unit', stock: Number(openingStock), price: Number(sellingPrice), mrp: Number(sellingPrice)*1.25, barcode }
      ]
    };

    onAddProduct(newProd);
    setShowModal(false);
    setName('');
    setBrand('');
    setSelectedCandidate(null);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditBrand(p.brand);
    setEditCategory(p.category);
    setEditHsn(p.hsnCode);
    setEditGst(p.gstRate);
    setEditPurchase(p.purchasePrice);
    setEditSelling(p.sellingPrice);
    setEditStock(p.openingStock);
    setEditImage(p.image || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated: Product = {
      ...editingProduct,
      name: editName,
      brand: editBrand,
      category: editCategory,
      hsnCode: editHsn,
      gstRate: Number(editGst),
      purchasePrice: Number(editPurchase),
      sellingPrice: Number(editSelling),
      openingStock: Number(editStock),
      image: editImage
    };
    onUpdateProduct(updated);
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const applyAICandidate = (c: any) => {
    setSelectedCandidate(c);
    setName(c.productName || '');
    setBrand(c.brand || '');
    if (c.industry) setIndustry(c.industry);
    setCategory(c.category || '');
    setHsnCode(c.hsnCode || '');
    setGstRate(Number(c.gstRate) || 0);
    setPurchasePrice(Number(c.purchasePrice) || 0);
    setSellingPrice(Number(c.sellingPrice) || 0);
    if (c.stock !== undefined) setOpeningStock(Number(c.stock));
    if (c.units) setUom(c.units);
    if (c.imageUrl) setProductImage(c.imageUrl);
    setAiQuery(c.productName || '');
    setShowDropdownSuggestions(false);
    setIsCatalogMatchCollapsed(false);
    generateProductBarcode(c.productName, c.category, c.hsnCode, Number(c.sellingPrice));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resStr: string = typeof reader.result === 'string' ? reader.result : '';
        if (isEdit) {
          setEditImage(resStr);
        } else {
          setProductImage(resStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className={`p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all border ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.35)]' 
          : 'bg-white border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Product Master & Catalog
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {products.length} SKUs
            </span>
          </div>
          <p className={`text-xs mt-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            Manage multi-variant inventory, packaging hierarchies, barcodes, and GST tax classifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-2xl font-black text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: primaryColor, boxShadow: `0 8px 24px ${primaryColor}4d` }}
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon with 4 Distinct Colors & Premium Contrast */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Products (Indigo Theme) */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
          isDarkMode 
            ? 'bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900 border-indigo-800/60 shadow-xs' 
            : 'bg-gradient-to-br from-indigo-50/90 via-indigo-50/40 to-white border-indigo-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
              Total Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>
              {totalProducts}
            </span>
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-indigo-300/80' : 'text-indigo-700/80'}`}>
              active SKUs
            </span>
          </div>
        </div>

        {/* Card 2: Stock On Hand (Emerald Theme) */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
          isDarkMode 
            ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900 border-emerald-800/60 shadow-xs' 
            : 'bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-white border-emerald-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
              Stock On Hand
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>
              {totalStockUnits.toLocaleString('en-IN')}
            </span>
            <span className={`text-[10px] font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              units
            </span>
          </div>
        </div>

        {/* Card 3: Inventory Value (Cyan/Sky Theme) */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
          isDarkMode 
            ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-900 border-cyan-800/60 shadow-xs' 
            : 'bg-gradient-to-br from-cyan-50/90 via-sky-50/40 to-white border-cyan-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
              Inventory Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDarkMode ? 'text-white' : 'text-cyan-950'}`}>
              ₹{totalInventoryValue.toLocaleString('en-IN')}
            </span>
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-cyan-300/80' : 'text-cyan-700/80'}`}>
              retail val.
            </span>
          </div>
        </div>

        {/* Card 4: Stock Alerts (Amber/Orange Theme) */}
        <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
          isDarkMode 
            ? 'bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900 border-amber-800/60 shadow-xs' 
            : 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-amber-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
              Stock Alerts
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ring-1 ${
              lowStockCount > 0 
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-amber-500/30' 
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${
              lowStockCount > 0 
                ? (isDarkMode ? 'text-amber-300' : 'text-amber-600') 
                : (isDarkMode ? 'text-white' : 'text-amber-950')
            }`}>
              {lowStockCount}
            </span>
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-amber-300/80' : 'text-amber-700/80'}`}>
              items low stock
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={`rounded-3xl border transition-all overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
          : 'bg-white border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
      }`}>
        {/* ROW 1: TOP CATEGORY TABS (Prominently placed at the top) */}
        <div className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 overflow-x-auto ${
          isDarkMode ? 'border-slate-800/80 bg-slate-950/50' : 'border-slate-200/80 bg-slate-50/80'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
            {['All', 'Garments', 'Grocery', 'Electronics'].map((ind) => {
              const count = ind === 'All' ? products.length : products.filter(p => p.industry === ind).length;
              const isSelected = selectedIndustry === ind;
              return (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap shadow-2xs ${
                    isSelected 
                      ? 'text-white shadow-sm scale-[1.02]' 
                      : isDarkMode 
                        ? 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60' 
                        : 'bg-white text-slate-800 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
                  }`}
                  style={isSelected ? { backgroundColor: primaryColor } : undefined}
                >
                  <span>{ind}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                    isSelected 
                      ? 'bg-white/25 text-white' 
                      : isDarkMode 
                        ? 'bg-slate-700 text-slate-300' 
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            <span>Showing <strong className="text-slate-800 dark:text-white">{filteredProducts.length}</strong> items</span>
          </div>
        </div>

        {/* ROW 2: SEARCH, SORT & STOCK FILTER */}
        <div className={`p-3 sm:p-4 border-b flex flex-wrap items-center justify-between gap-2.5 ${
          isDarkMode ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200/80 bg-white'
        }`}>
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, brand, SKU, HSN, barcode..."
              className={`w-full rounded-xl pl-9 pr-8 py-2 text-xs font-bold focus:outline-none transition-all border ${
                isDarkMode 
                  ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs'
              }`}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Stock Filter Pill */}
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value as any)}
              className={`text-xs font-black rounded-xl px-3 py-2 border focus:outline-none cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-950/70 border-slate-800 text-slate-200' 
                  : 'bg-slate-50 border-slate-300 text-slate-950 shadow-2xs'
              }`}
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock (&gt; 15)</option>
              <option value="low-stock">Low Stock (≤ 15)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`text-xs font-black rounded-xl px-3 py-2 border focus:outline-none cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-950/70 border-slate-800 text-slate-200' 
                  : 'bg-slate-50 border-slate-300 text-slate-950 shadow-2xs'
              }`}
            >
              <option value="default">Sort: Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
            </select>
          </div>
        </div>

        {/* The Beautiful Responsive Compact Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
                isDarkMode 
                  ? 'bg-slate-950/70 border-slate-800 text-slate-300' 
                  : 'bg-slate-100 border-slate-200 text-slate-950'
              }`}>
                <th className="py-2.5 px-3 pl-4 min-w-[240px] max-w-[280px]">Product Info (Click Image to Zoom)</th>
                <th className="py-2.5 px-3 min-w-[120px] max-w-[150px]">Brand / Industry</th>
                <th className="py-2.5 px-3 min-w-[110px] max-w-[130px]">Category</th>
                <th className="py-2.5 px-3 min-w-[180px] max-w-[220px]">Variants / Packaging</th>
                <th className="py-2.5 px-3 min-w-[95px]">Price (₹)</th>
                <th className="py-2.5 px-3 min-w-[115px]">Inventory Status</th>
                <th className="py-2.5 px-3 min-w-[75px] text-center">GST Rate</th>
                <th className="py-2.5 px-3 pr-4 min-w-[105px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${
              isDarkMode ? 'divide-slate-800/70' : 'divide-slate-200'
            }`}>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
                        <Search className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white">No products found</h4>
                      <p className={`text-xs mt-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        No product records match your current filters or search term "{searchTerm}".
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedIndustry('All');
                          setStockStatusFilter('all');
                        }}
                        className="mt-3 px-4 py-1.5 rounded-xl text-xs font-black text-white shadow-sm transition-all"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.openingStock <= 15;
                  return (
                    <tr 
                      key={p.id} 
                      className={`group transition-colors duration-150 odd:bg-white even:bg-slate-50/80 dark:odd:bg-slate-900/40 dark:even:bg-slate-800/40 ${
                        isDarkMode ? 'hover:!bg-slate-800/80' : 'hover:!bg-indigo-50/70'
                      }`}
                    >
                      {/* Product Name & Click-To-Zoom Visual Thumbnail (Compact + .. ellipsis) */}
                      <td className="py-2.5 px-3 pl-4 max-w-[280px]">
                        <div className="flex items-center gap-2.5">
                          <div 
                            onClick={() => setZoomedProduct(p)}
                            className="relative shrink-0 cursor-pointer group/zoom"
                            title="Click to Zoom Image & Product Details"
                          >
                            <img 
                              src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'} 
                              alt={p.name} 
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-indigo-500/30 group-hover/zoom:ring-indigo-600 shadow-2xs group-hover/zoom:scale-105 transition-all duration-200" 
                            />
                            <div className="absolute inset-0 bg-slate-950/40 rounded-lg opacity-0 group-hover/zoom:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[1px]">
                              <ZoomIn className="w-3.5 h-3.5 text-white drop-shadow" />
                            </div>
                            {isLow && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white dark:ring-slate-900" title="Low stock alert" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div 
                              className={`font-black text-xs sm:text-sm tracking-tight truncate max-w-[170px] sm:max-w-[220px] ${
                                isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-950 group-hover:text-indigo-600'
                              }`}
                              title={p.name}
                            >
                              {p.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-bold">
                              <span className={`font-mono px-1 py-0.2 rounded text-[9px] font-black border ${
                                isDarkMode ? 'bg-slate-800/90 text-slate-200 border-slate-700/70' : 'bg-slate-100 text-slate-950 border-slate-300'
                              }`}>
                                HSN: {p.hsnCode}
                              </span>
                              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>•</span>
                              <button 
                                type="button"
                                onClick={() => setBarcodeStickerProduct(p)}
                                className={`inline-flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                                  isDarkMode 
                                    ? 'bg-slate-800 text-indigo-300 border-slate-700 hover:bg-indigo-950/60 hover:border-indigo-500/50' 
                                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
                                }`}
                                title={`Click to View & Print Barcode Sticker: ${p.barcode}`}
                              >
                                <Barcode className="w-2.5 h-2.5" />
                                <span className="truncate max-w-[85px]">{p.barcode}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Industry (Compact + .. ellipsis) */}
                      <td className="py-2.5 px-3 max-w-[140px]">
                        <div 
                          className={`font-black text-xs truncate max-w-[120px] ${isDarkMode ? 'text-slate-100' : 'text-slate-950'}`}
                          title={p.brand}
                        >
                          {p.brand}
                        </div>
                        <span className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-black border truncate max-w-full ${
                          p.industry === 'Garments' 
                            ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20'
                            : p.industry === 'Grocery'
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/20'
                            : p.industry === 'Electronics'
                            ? 'bg-cyan-500/10 text-cyan-800 dark:text-cyan-400 border-cyan-500/20'
                            : 'bg-slate-500/10 text-slate-800 dark:text-slate-400 border-slate-500/20'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0"></span>
                          <span className="truncate">{p.industry}</span>
                        </span>
                      </td>

                      {/* Category (Compact + .. ellipsis) */}
                      <td className="py-2.5 px-3 max-w-[130px]">
                        <span 
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border truncate max-w-[120px] ${
                            isDarkMode 
                              ? 'bg-slate-800/80 text-slate-200 border-slate-700/60' 
                              : 'bg-slate-100 text-slate-950 border-slate-300'
                          }`}
                          title={p.category}
                        >
                          {p.category}
                        </span>
                      </td>

                      {/* Variants / Packaging (Compact + .. ellipsis) */}
                      <td className="py-2.5 px-3 max-w-[220px]">
                        <div className="flex flex-wrap items-center gap-1">
                          {p.variants && p.variants.length > 0 ? (
                            p.variants.slice(0, 2).map((v, i) => (
                              <span 
                                key={i} 
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border shadow-2xs truncate max-w-[100px] ${
                                  isDarkMode 
                                    ? 'bg-slate-800/90 text-slate-200 border-slate-700/80' 
                                    : 'bg-slate-100 text-slate-950 border-slate-300'
                                }`}
                                title={v.color ? `${v.color} (${v.size}) - Stock: ${v.stock}` : `${v.packSize} - Stock: ${v.stock}`}
                              >
                                <span className="truncate">{v.color ? `${v.color} (${v.size})` : v.packSize}</span>
                                <span className="px-1 py-0.2 rounded text-[8px] font-black bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 shrink-0">
                                  {v.stock}
                                </span>
                              </span>
                            ))
                          ) : (
                            <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Standard</span>
                          )}
                          {p.variants && p.variants.length > 2 && (
                            <span 
                              className="self-center px-1.5 py-0.5 rounded text-[9px] font-black text-slate-700 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
                              title={p.variants.slice(2).map(v => `${v.color || v.packSize}: ${v.stock}`).join(', ')}
                            >
                              +{p.variants.length - 2}..
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price (₹) (Compact) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className={`font-black text-xs sm:text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                          ₹{p.sellingPrice.toLocaleString('en-IN')}
                        </div>
                        <div className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          MRP: <span className="line-through">₹{Math.round(p.sellingPrice * 1.25).toLocaleString('en-IN')}</span>
                        </div>
                      </td>

                      {/* Stock Status Badge (Compact) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {isLow ? (
                          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border shadow-2xs ${
                            isDarkMode 
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/25' 
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}>
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                            </span>
                            <span>{p.openingStock} <span className="text-[9px] uppercase font-black opacity-90">{p.uom}</span></span>
                            <span className="text-[8px] uppercase tracking-wider bg-rose-500/20 px-1 py-0.2 rounded font-black ml-0.5">Low</span>
                          </div>
                        ) : (
                          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border shadow-2xs ${
                            isDarkMode 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
                            <span>{p.openingStock} <span className="text-[9px] uppercase font-black opacity-90">{p.uom}</span></span>
                          </div>
                        )}
                      </td>

                      {/* GST Rate (Compact) */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-black border ${
                          p.gstRate === 0 
                            ? 'bg-slate-500/10 text-slate-800 dark:text-slate-400 border-slate-500/20'
                            : p.gstRate === 5
                            ? 'bg-blue-500/15 text-blue-800 dark:text-blue-400 border-blue-500/30'
                            : p.gstRate === 12
                            ? 'bg-purple-500/15 text-purple-800 dark:text-purple-400 border-purple-500/30'
                            : p.gstRate === 18
                            ? 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-400 border-indigo-500/30'
                            : 'bg-rose-500/15 text-rose-800 dark:text-rose-400 border-rose-500/30'
                        }`}>
                          {p.gstRate}%
                        </span>
                      </td>

                      {/* Actions (Compact) */}
                      <td className="py-2.5 px-3 pr-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-0.5">
                          <button 
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product Details"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition-all duration-150"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setBarcodeStickerProduct(p)}
                            title="Print Barcode Sticker & POS Label"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all duration-150 cursor-pointer"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              setActiveProductForPackaging(p);
                              setShowPackagingModal(true);
                            }}
                            title="Packaging & Variant Hierarchy"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-cyan-600 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all duration-150"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onDeleteProduct(p.id)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-150"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Bar / Pagination Summary */}
        <div className={`py-3.5 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isDarkMode 
            ? 'border-slate-800/80 bg-slate-950/40 text-slate-400' 
            : 'border-slate-200 bg-slate-50 text-slate-800 font-bold'
        }`}>
          <div>
            Showing <span className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{filteredProducts.length}</span> of <span className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{products.length}</span> products
            {selectedIndustry !== 'All' && (
              <span className="ml-1">in <span className="font-black text-indigo-600 dark:text-indigo-400">{selectedIndustry}</span></span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold">
              Total Displayed Value: <strong className={`font-mono font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>₹{filteredProducts.reduce((sum, p) => sum + (p.sellingPrice * p.openingStock), 0).toLocaleString('en-IN')}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* EDIT PRODUCT POPUP MODAL */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#f8f9fc] dark:bg-slate-900 text-slate-950 dark:text-white rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                  <Edit3 className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Edit Product Details</h3>
                  <p className="text-[10px] text-slate-900 dark:text-slate-300 font-bold">Update product pricing, stock, name, and GST configuration.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowEditModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <img src={editImage} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-300 shadow-sm" />
                <label className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black cursor-pointer text-center border border-indigo-200">
                  <Upload className="w-4 h-4 inline mr-1 text-indigo-600" /> Upload New Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Product Name *</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Brand</label>
                  <input 
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Category</label>
                  <input 
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">HSN / SAC</label>
                  <input 
                    type="text"
                    value={editHsn}
                    onChange={(e) => setEditHsn(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">GST (%)</label>
                  <select 
                    value={editGst}
                    onChange={(e) => setEditGst(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-black text-slate-950 dark:text-white"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Purchase Price (₹)</label>
                  <input 
                    type="number"
                    value={editPurchase}
                    onChange={(e) => setEditPurchase(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Selling Price (₹)</label>
                  <input 
                    type="number"
                    value={editSelling}
                    onChange={(e) => setEditSelling(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Opening Stock</label>
                  <input 
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-slate-200/60">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-950 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black text-white shadow-lg transition-all bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPACT Add Product & AI Assistant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#f8f9fc] dark:bg-slate-900 text-slate-950 dark:text-white rounded-3xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl border border-white/20 dark:border-slate-800 max-h-[92vh] overflow-y-auto space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                  <Package className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Add New Product & AI Assistant</h3>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">Search product name to discover AI Catalog Match, image, and 9 GST attributes.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Discovery & Live Typing Suggestions Dropdown */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white shadow-lg border border-indigo-500/30 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="text-[11px] font-black text-indigo-300">Gemini AI Catalog Agent (Live Search & Google Match)</span>
                </div>
                {/* Collapse Button for AI Catalog Match */}
                <button
                  type="button"
                  onClick={() => setIsCatalogMatchCollapsed(!isCatalogMatchCollapsed)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-black rounded-lg text-indigo-300 flex items-center space-x-1 transition-colors border border-indigo-500/30"
                >
                  <span>{isCatalogMatchCollapsed ? 'Expand Match' : 'Collapse Match'}</span>
                  {isCatalogMatchCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </button>
              </div>
              
              <div className="relative">
                <div className="flex space-x-2 items-center">
                  <input 
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Search product (e.g. Lay's Chips, Basmati Rice, Levi's Jeans, Fortune Oil, Wild Stone)..."
                    className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                  {/* Uiverse AI Search Button Effect in Black */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCatalogMatchCollapsed(false);
                      handleRunAIProductDiscovery();
                    }}
                    className="uiverse uiverse-black shrink-0"
                  >
                    <div className="wrapper">
                      <span>AI Search</span>
                      <div className="circle circle-12"></div>
                      <div className="circle circle-11"></div>
                      <div className="circle circle-10"></div>
                      <div className="circle circle-9"></div>
                      <div className="circle circle-8"></div>
                      <div className="circle circle-7"></div>
                      <div className="circle circle-6"></div>
                      <div className="circle circle-5"></div>
                      <div className="circle circle-4"></div>
                      <div className="circle circle-3"></div>
                      <div className="circle circle-2"></div>
                      <div className="circle circle-1"></div>
                    </div>
                  </button>
                </div>

                {/* AI Agent Suggestions Dropdown */}
                {showDropdownSuggestions && aiCandidates.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-indigo-500/60 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800">
                    {aiCandidates.map((c, i) => (
                      <div
                        key={i}
                        onClick={() => applyAICandidate(c)}
                        className="p-3 hover:bg-indigo-950/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img src={c.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/30 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-black text-white truncate">{c.productName}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              Brand: <span className="text-slate-200 font-bold">{c.brand}</span> • HSN: {c.hsnCode} • GST: {c.gstRate}% • ₹{c.sellingPrice} • Stock: {c.stock} {c.units}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-indigo-300 font-black px-2.5 py-1 bg-indigo-500/25 rounded-lg border border-indigo-500/40 shrink-0 ml-2">
                          Select AI Match
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Preview Card - Showing AI Catalog Match accurate image and 9 Suggested Attributes */}
              {!isCatalogMatchCollapsed && (
                <div className="mt-3 p-3.5 bg-slate-800/90 rounded-2xl border border-indigo-500/40 space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-3.5">
                    {/* Accurate Product Image with Click-to-Zoom */}
                    <div 
                      onClick={() => setZoomedProduct({
                        id: 'preview',
                        name: name || aiQuery || 'Product Preview',
                        code: 'PREVIEW-01',
                        brand: brand || 'AI Brand',
                        category,
                        subcategory: 'General',
                        industry,
                        description: 'AI Catalog Matched Product',
                        uom,
                        hsnCode,
                        gstRate,
                        purchasePrice,
                        sellingPrice,
                        mrp: sellingPrice * 1.25,
                        openingStock,
                        minStockLevel: 5,
                        image: productImage,
                        barcode: barcode || '8901234567999',
                        trackBatch: false,
                        trackExpiry: false,
                        variants: [],
                        status: 'Active',
                        createdAt: ''
                      })}
                      className="relative shrink-0 group cursor-pointer w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/40 bg-slate-900 shadow-md"
                      title="Click to Zoom Full Preview"
                    >
                      <img 
                        src={productImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-5 h-5 text-white drop-shadow" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[8px] font-black bg-slate-950/80 text-white">
                        Zoom
                      </span>
                    </div>

                    {/* AI Suggestion Header & Accurate Match Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#64e447] border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#64e447]" />
                          AI Catalog Match (Verified)
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {industry}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white truncate">{name || aiQuery || 'Product Preview'}</h4>
                      <p className="text-[10px] text-slate-300">
                        Accurate product attributes suggested by AI agent from Google Search & Indian Retail Catalog.
                      </p>
                    </div>
                  </div>

                  {/* 9 Suggested Attributes Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">1. Brand</span>
                      <span className="text-xs font-black text-amber-300 truncate block">{brand || 'Generic'}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">2. Industry</span>
                      <span className="text-xs font-black text-white truncate block">{industry}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">3. Category</span>
                      <span className="text-xs font-black text-white truncate block">{category}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">4. HSN / SAC</span>
                      <span className="text-xs font-black font-mono text-cyan-300 truncate block">{hsnCode}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">5. GST (%)</span>
                      <span className="text-xs font-black text-emerald-400 block">{gstRate}%</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">6. Purchase</span>
                      <span className="text-xs font-black text-slate-200 block">₹{purchasePrice}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">7. Selling</span>
                      <span className="text-xs font-black text-[#64e447] block">₹{sellingPrice}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">8. Stock</span>
                      <span className="text-xs font-black text-white block">{openingStock}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/60 col-span-1 sm:col-span-2">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">9. Units (UOM)</span>
                      <span className="text-xs font-black text-indigo-300 block">{uom}</span>
                    </div>
                  </div>

                  {/* Actions inside Preview Card */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="text-[10px] font-bold text-indigo-300 hover:text-white cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom Image</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> All 9 Attributes Synced to Form
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button in Right Bottom Corner of AI Search Box */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (aiQuery) setName(aiQuery);
                  }}
                  className="px-4 py-2 text-white rounded-xl font-bold text-[11px] shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  <span>Submit AI Data</span>
                  <Send className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>

            {/* FORM INPUTS - Covering All 9 Attributes */}
            <form onSubmit={handleCreateProduct} className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Product Name *</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lay's India's Magic Masala 50g"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Brand Name</label>
                  <input 
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Lay's, India Gate, Levi's"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Industry Type</label>
                  <select 
                    value={industry}
                    onChange={(e: any) => handleIndustryChange(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-black text-slate-950 dark:text-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Garments">Garments</option>
                    <option value="Grocery">Grocery</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Category</label>
                  <input 
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">HSN / SAC</label>
                  <input 
                    type="text"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">GST (%)</label>
                  <select 
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-black text-slate-950 dark:text-white"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Purchase (₹)</label>
                  <input 
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Selling (₹)</label>
                  <input 
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Stock on Hand</label>
                  <input 
                    type="number"
                    value={openingStock}
                    onChange={(e) => setOpeningStock(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Units (UOM)</label>
                  <select 
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-black text-slate-950 dark:text-white"
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="PACK">PACK (Packets)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="LTR">LTR (Litres)</option>
                    <option value="BOX">BOX (Boxes)</option>
                    <option value="BAG">BAG (Bags)</option>
                    <option value="MTR">MTR (Metres)</option>
                    <option value="DOZ">DOZ (Dozens)</option>
                  </select>
                </div>
              </div>

              {/* Product-Related Barcode Generator Section */}
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label className="text-xs font-black text-slate-900 dark:text-white">
                      Product Barcode / EAN-13
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      POS Auto-Detect
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => generateProductBarcode()}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                    title="Generate authentic barcode encoded with product info"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Create Product-Related Barcode</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 8908517259992"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const code = barcode || generateProductBarcode();
                      setBarcodeStickerProduct({
                        id: 'preview',
                        name: name || 'New Product Preview',
                        code: 'SKU-PREVIEW',
                        brand: brand || 'Brand',
                        category,
                        subcategory: 'General',
                        industry,
                        description: '',
                        uom,
                        hsnCode,
                        gstRate,
                        purchasePrice: Number(purchasePrice),
                        sellingPrice: Number(sellingPrice),
                        mrp: Number(sellingPrice) * 1.25,
                        openingStock: Number(openingStock),
                        minStockLevel: 5,
                        barcode: code,
                        trackBatch: false,
                        trackExpiry: false,
                        variants: [],
                        status: 'Active',
                        createdAt: ''
                      });
                    }}
                    className="px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Preview and print barcode sticker label"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="hidden sm:inline">Sticker Preview</span>
                  </button>
                </div>

                {barcode && (
                  <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono pt-0.5">
                    <span>Encoded with: HSN {hsnCode} • ₹{sellingPrice} • {industry}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Scan in Sales Invoice to auto-add</span>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-slate-200/60 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-950 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black text-white shadow-lg transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL PRODUCT INFO CLICK-TO-ZOOM LIGHTBOX MODAL */}
      {zoomedProduct && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomedProduct(null);
          }}
        >
          <div className={`relative max-w-2xl w-full rounded-3xl shadow-2xl border p-6 overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-700/80 text-white' 
              : 'bg-white border-slate-200 text-slate-950'
          }`}>
            {/* Close button */}
            <button 
              onClick={() => setZoomedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-all shadow-md z-20"
              title="Close Zoom"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Large Image with Interactive Zoom Hover */}
              <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950/5 flex items-center justify-center h-72 sm:h-80">
                <img 
                  src={zoomedProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'} 
                  alt={zoomedProduct.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-125 transition-transform duration-300 ease-out cursor-zoom-in" 
                />
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-slate-950/70 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hover to magnify</span>
                </div>
              </div>

              {/* Detailed Product Metadata */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {zoomedProduct.industry}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      zoomedProduct.openingStock <= 15 
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                      {zoomedProduct.openingStock <= 15 ? 'Low Stock Alert' : 'In Stock'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                    {zoomedProduct.name}
                  </h3>
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Brand: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{zoomedProduct.brand}</strong> • Category: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{zoomedProduct.category}</strong>
                  </p>
                </div>

                {/* 9 core attributes mini table / grid */}
                <div className={`grid grid-cols-2 gap-2 p-3 rounded-2xl border text-xs font-bold ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">HSN / SAC Code</span>
                    <span className={`font-mono font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{zoomedProduct.hsnCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">GST Slab</span>
                    <span className={`font-black ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{zoomedProduct.gstRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Selling Price</span>
                    <span className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>₹{zoomedProduct.sellingPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Purchase Price</span>
                    <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>₹{zoomedProduct.purchasePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Current Stock</span>
                    <span className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{zoomedProduct.openingStock} {zoomedProduct.uom}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Barcode</span>
                    <span className={`font-mono text-[10px] truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{zoomedProduct.barcode}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => {
                      const prod = zoomedProduct;
                      setZoomedProduct(null);
                      handleOpenEdit(prod);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                  <button
                    onClick={() => setZoomedProduct(null)}
                    className="px-4 py-2 rounded-xl text-xs font-black border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Packaging Configuration Modal */}
      {showPackagingModal && activeProductForPackaging && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-white/20 dark:border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Packaging Hierarchy Preview</h3>
                  <p className="text-[10px] text-slate-900 dark:text-slate-300 font-bold">{activeProductForPackaging.name}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowPackagingModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <h4 className="text-[11px] font-black text-indigo-900 mb-1.5">Visual Hierarchy Flow:</h4>
                <div className="flex items-center space-x-1.5 text-[11px] font-black text-indigo-700">
                  <span className="px-2.5 py-1 bg-white rounded-lg shadow-xs">Piece</span>
                  <span>→</span>
                  <span className="px-2.5 py-1 bg-white rounded-lg shadow-xs">Polybag</span>
                  <span>→</span>
                  <span className="px-2.5 py-1 bg-white rounded-lg shadow-xs">Bundle</span>
                  <span>→</span>
                  <span className="px-2.5 py-1 bg-white rounded-lg shadow-xs">Carton</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button 
                  onClick={() => setShowPackagingModal(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT BARCODE STICKER & POS LABEL MODAL */}
      {barcodeStickerProduct && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-60 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-4 sm:p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Barcode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">Product Barcode Label</h3>
                  <p className="text-[10px] text-slate-400">GS1 / EAN-13 Retail POS Sticker</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setBarcodeStickerProduct(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Physical Sticker Canvas */}
            <div id="barcode-sticker-print" className="p-3.5 bg-white text-slate-950 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 shadow-sm space-y-1.5 text-center">
              <div className="text-[10px] uppercase font-black tracking-widest text-slate-600">
                Hiffy Retail Store
              </div>
              <div className="font-black text-xs text-slate-900 truncate">
                {barcodeStickerProduct.name}
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 px-2">
                <span>HSN: {barcodeStickerProduct.hsnCode}</span>
                <span>GST: {barcodeStickerProduct.gstRate}%</span>
              </div>

              {/* SVG Barcode Graphic */}
              <div className="py-1 flex flex-col items-center justify-center">
                <svg className="w-48 h-12" viewBox="0 0 160 50">
                  <rect x="0" y="0" width="160" height="50" fill="#ffffff" />
                  {/* Left guard bars */}
                  <rect x="10" y="2" width="2" height="42" fill="#000000" />
                  <rect x="14" y="2" width="2" height="42" fill="#000000" />
                  {/* Encoded Bars */}
                  <rect x="20" y="2" width="3" height="38" fill="#000000" />
                  <rect x="25" y="2" width="1" height="38" fill="#000000" />
                  <rect x="28" y="2" width="4" height="38" fill="#000000" />
                  <rect x="35" y="2" width="2" height="38" fill="#000000" />
                  <rect x="39" y="2" width="1" height="38" fill="#000000" />
                  <rect x="43" y="2" width="3" height="38" fill="#000000" />
                  <rect x="49" y="2" width="2" height="38" fill="#000000" />
                  <rect x="54" y="2" width="4" height="38" fill="#000000" />
                  <rect x="61" y="2" width="1" height="38" fill="#000000" />
                  <rect x="64" y="2" width="3" height="38" fill="#000000" />
                  <rect x="70" y="2" width="2" height="38" fill="#000000" />
                  {/* Center Guard */}
                  <rect x="77" y="2" width="2" height="42" fill="#000000" />
                  <rect x="81" y="2" width="2" height="42" fill="#000000" />
                  {/* Right Data Bars */}
                  <rect x="87" y="2" width="3" height="38" fill="#000000" />
                  <rect x="92" y="2" width="1" height="38" fill="#000000" />
                  <rect x="96" y="2" width="4" height="38" fill="#000000" />
                  <rect x="103" y="2" width="2" height="38" fill="#000000" />
                  <rect x="108" y="2" width="3" height="38" fill="#000000" />
                  <rect x="114" y="2" width="1" height="38" fill="#000000" />
                  <rect x="118" y="2" width="4" height="38" fill="#000000" />
                  <rect x="125" y="2" width="2" height="38" fill="#000000" />
                  <rect x="130" y="2" width="3" height="38" fill="#000000" />
                  <rect x="136" y="2" width="1" height="38" fill="#000000" />
                  <rect x="140" y="2" width="2" height="38" fill="#000000" />
                  {/* Right guard */}
                  <rect x="146" y="2" width="2" height="42" fill="#000000" />
                  <rect x="150" y="2" width="2" height="42" fill="#000000" />
                </svg>
                <div className="font-mono text-xs font-black tracking-widest text-slate-900 mt-1">
                  {barcodeStickerProduct.barcode}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold">
                  MRP: <span className="line-through">₹{Math.round(barcodeStickerProduct.sellingPrice * 1.25)}</span>
                </span>
                <span className="text-xs font-black text-indigo-700 font-mono">
                  ₹{barcodeStickerProduct.sellingPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(barcodeStickerProduct.barcode);
                  setBarcodeCopied(true);
                  setTimeout(() => setBarcodeCopied(false), 2000);
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {barcodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{barcodeCopied ? 'Copied!' : 'Copy Barcode'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sticker</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
