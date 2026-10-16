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
  ChevronUp
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
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [activeProductForPackaging, setActiveProductForPackaging] = useState<Product | null>(null);

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
  const [barcode, setBarcode] = useState('8901234567999');
  const [productImage, setProductImage] = useState<string>('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80');

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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || p.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
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
    setName(c.productName);
    setBrand(c.brand);
    setCategory(c.category);
    setHsnCode(c.hsnCode);
    setGstRate(c.gstRate);
    setPurchasePrice(c.purchasePrice);
    setSellingPrice(c.sellingPrice);
    if (c.imageUrl) {
      setProductImage(c.imageUrl);
    }
    setAiQuery(c.productName);
    setShowDropdownSuggestions(false);
    setIsCatalogMatchCollapsed(false);
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
      {/* Header & Filters */}
      <div className={`p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
        isDarkMode ? 'bg-slate-900 text-white shadow-[6px_6px_16px_#0f172a,-6px_-6px_16px_#334155]' : 'bg-[#f8f9fc] text-slate-950 shadow-[8px_8px_20px_#d1d5db,-8px_-8px_20px_#ffffff]'
      }`}>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">Product Master & Variants</h2>
          <p className="text-xs text-slate-900 dark:text-slate-300 mt-0.5 font-bold">Manage products, variants, packaging hierarchies, and AI discovery.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`p-1 rounded-2xl flex ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200 shadow-inner'}`}>
            {['All', 'Garments', 'Grocery', 'Electronics'].map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedIndustry === ind ? 'text-white shadow-md' : 'text-slate-950 dark:text-slate-200 hover:text-black'
                }`}
                style={selectedIndustry === ind ? { backgroundColor: primaryColor } : undefined}
              >
                {ind}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 text-white rounded-2xl font-black text-xs shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: primaryColor, boxShadow: `0 8px 20px ${primaryColor}66` }}
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-indigo-600 dark:text-slate-400" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name, brand, SKU or barcode..."
          className={`w-full rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-950 dark:text-white focus:outline-none transition-all ${
            isDarkMode 
              ? 'bg-slate-900 placeholder-slate-500 shadow-[inset_4px_4px_8px_#0f172a,inset_-4px_-4px_8px_#334155]' 
              : 'bg-[#f8f9fc] placeholder-slate-500 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]'
          }`}
        />
      </div>

      {/* Products Table with solid dark text and multicolored icons */}
      <div className={`rounded-3xl overflow-hidden transition-all ${
        isDarkMode ? 'bg-slate-900 shadow-[8px_8px_20px_#0f172a,-8px_-8px_20px_#334155]' : 'bg-[#f8f9fc] shadow-[10px_10px_25px_#d1d5db,-10px_-10px_25px_#ffffff]'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b uppercase font-black ${isDarkMode ? 'border-slate-800 text-slate-300 bg-slate-950/40' : 'border-slate-200 text-slate-950 bg-slate-100/90'}`}>
                <th className="py-0 px-0">Product Name</th>
                <th className="py-0 px-0">Brand / Industry</th>
                <th className="py-0 px-0">Category</th>
                <th className="py-0 px-0">Variants / Pack</th>
                <th className="py-0 px-0">Price (₹)</th>
                <th className="py-0 px-0">Stock</th>
                <th className="py-0 px-0 text-center">GST %</th>
                <th className="py-0 px-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-bold text-white bg-slate-900">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/80 transition-colors">
                  <td className="py-0 px-0 flex items-center space-x-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-2xl object-cover shadow-sm border border-slate-700 shrink-0" />
                    <div>
                      <div className="font-black text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">HSN: {p.hsnCode} • Barcode: {p.barcode}</div>
                    </div>
                  </td>
                  <td className="py-0 px-0">
                    <div className="font-black text-white">{p.brand}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {p.industry}
                    </span>
                  </td>
                  <td className="py-0 px-0 text-slate-200 font-bold">{p.category}</td>
                  <td className="py-0 px-0">
                    <div className="flex flex-wrap gap-1">
                      {p.variants.map((v, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-800 text-white rounded-xl text-[10px] font-black shadow-xs border border-slate-700">
                          {v.color ? `${v.color} (${v.size})` : v.packSize} ({v.stock})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-0 px-0 font-black text-white">₹ {p.sellingPrice}</td>
                  <td className="py-0 px-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      p.openingStock < 20 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {p.openingStock} {p.uom}
                    </span>
                  </td>
                  <td className="py-0 px-0 text-center font-black text-white">{p.gstRate}%</td>
                  <td className="py-0 px-0 text-right">
                    {/* Actions with multicolored solid icons */}
                    <div className="inline-flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(p)}
                        title="Edit Product"
                        className="w-8 h-8 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 flex items-center justify-center transition-colors shadow-xs border border-purple-500/30"
                      >
                        <Edit3 className="w-4 h-4 text-purple-300" />
                      </button>
                      <button 
                        onClick={() => {
                          setActiveProductForPackaging(p);
                          setShowPackagingModal(true);
                        }}
                        title="Packaging Config"
                        className="w-8 h-8 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 flex items-center justify-center transition-colors shadow-xs border border-cyan-500/30"
                      >
                        <Layers className="w-4 h-4 text-cyan-300" />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(p.id)}
                        title="Deactivate / Delete"
                        className="w-8 h-8 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center transition-colors shadow-xs border border-rose-500/30"
                      >
                        <Trash2 className="w-4 h-4 text-rose-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PRODUCT POPUP MODAL */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#f8f9fc] dark:bg-slate-900 text-slate-950 dark:text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                  <Edit3 className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Edit Product Details</h3>
                  <p className="text-[10px] text-slate-900 dark:text-slate-300 font-bold">Update product pricing, stock, name, and GST configuration.</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-950 dark:text-slate-400">
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
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#f8f9fc] dark:bg-slate-900 text-slate-950 dark:text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/40">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                  <Package className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Add New Product & AI Assistant</h3>
                  <p className="text-[10px] text-slate-900 dark:text-slate-300 font-bold">Type product name to view AI agent suggestions in dropdown.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-950 dark:text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Discovery & Live Typing Suggestions Dropdown */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white shadow-lg border border-indigo-500/30 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-indigo-300">Gemini AI Agent Suggestions (Live Typing)</span>
                </div>
                {/* Collapse Button for AI Catalog Match */}
                <button
                  type="button"
                  onClick={() => setIsCatalogMatchCollapsed(!isCatalogMatchCollapsed)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-lg text-indigo-300 flex items-center space-x-1 transition-colors"
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
                    placeholder="Type product name (e.g. Lays Chips, Basmati Rice)..."
                    className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
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
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-indigo-500/50 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-800">
                    {aiCandidates.map((c, i) => (
                      <div
                        key={i}
                        onClick={() => applyAICandidate(c)}
                        className="p-2.5 hover:bg-indigo-950/60 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <img src={c.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-800" />
                          <div>
                            <p className="font-bold text-white">{c.productName}</p>
                            <p className="text-[10px] text-slate-400">{c.brand} • GST {c.gstRate}% • ₹ {c.sellingPrice}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-bold px-2 py-1 bg-indigo-500/20 rounded-lg">Select</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Preview Card (Collapsible by default) */}
              {!isCatalogMatchCollapsed && (
                <div className="mt-3 p-3 bg-slate-800/80 rounded-xl border border-indigo-500/30 grid grid-cols-3 gap-3 items-center animate-fadeIn">
                  <div className="relative group">
                    <img 
                      src={productImage} 
                      alt="Preview" 
                      className="w-full h-20 object-cover rounded-lg border border-slate-700 bg-slate-900"
                    />
                    <label className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold cursor-pointer rounded-lg">
                      <Upload className="w-3.5 h-3.5 mb-0.5 text-amber-300" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                    </label>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#64e447]">
                      AI Catalog Match
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{name || aiQuery || 'Product Preview'}</h4>
                    <p className="text-[10px] text-slate-300">Brand: <span className="font-bold">{brand}</span> • GST: {gstRate}%</p>
                    <p className="text-[10px] font-bold text-amber-300">Price: ₹ {sellingPrice}</p>
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

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Product Name *</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lays Chips"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Brand</label>
                  <input 
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. FritoLay"
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

              <div className="grid grid-cols-4 gap-3">
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
                <div>
                  <label className="block text-[11px] font-black text-slate-950 dark:text-slate-200 mb-1">Stock</label>
                  <input 
                    type="number"
                    value={openingStock}
                    onChange={(e) => setOpeningStock(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-slate-200/40">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-950 dark:text-slate-300 hover:bg-slate-100"
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

      {/* Packaging Configuration Modal */}
      {showPackagingModal && activeProductForPackaging && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Packaging Hierarchy Preview</h3>
                  <p className="text-[10px] text-slate-900 dark:text-slate-300 font-bold">{activeProductForPackaging.name}</p>
                </div>
              </div>
              <button onClick={() => setShowPackagingModal(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-950 dark:text-slate-400">
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
    </div>
  );
};
