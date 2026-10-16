export type TabType = 
  | 'dashboard' 
  | 'sales' 
  | 'purchases' 
  | 'inventory' 
  | 'products' 
  | 'parties' 
  | 'payments' 
  | 'reports' 
  | 'ai-assistant' 
  | 'settings';

export interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  packSize?: string;
  stock: number;
  price: number;
  mrp: number;
  barcode: string;
}

export interface PackagingLevel {
  levelNumber: number;
  levelName: string; // e.g. Piece, Polybag, Bundle, Master Carton
  unitsPerParent: number;
  uom: string;
  netQuantity: number;
  grossWeight: number;
  weightUnit: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  brand: string;
  category: string;
  subcategory: string;
  industry: 'Garments' | 'Grocery' | 'Electronics' | 'General';
  description: string;
  uom: string;
  hsnCode: string;
  gstRate: number; // e.g. 5, 12, 18
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  openingStock: number;
  minStockLevel: number;
  image?: string;
  barcode: string;
  trackBatch: boolean;
  trackExpiry: boolean;
  variants: ProductVariant[];
  packagingLevels?: PackagingLevel[];
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  variantSku?: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  price: number;
  discountPercent: number;
  taxableAmount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerGstin?: string;
  placeOfSupply: string;
  isInterState: boolean;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Credit';
  paymentStatus: 'Paid' | 'Partial' | 'Pending' | 'Credit';
  paidAmount: number;
  status: 'Issued' | 'Cancelled' | 'Returned';
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  variantSku?: string;
  quantity: number;
  unitCost: number;
  taxRate: number;
  total: number;
  batchNumber?: string;
  expiryDate?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'Ordered' | 'Partial' | 'Received' | 'Cancelled';
}

export interface Party {
  id: string;
  type: 'Customer' | 'Supplier';
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  state: string;
  creditLimit: number;
  openingBalance: number;
  currentOutstanding: number;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  date: string;
  partyId: string;
  partyName: string;
  type: 'Payment In' | 'Payment Out';
  amount: number;
  mode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  referenceNo?: string;
  allocatedInvoice?: string;
}

export interface StockLedgerEntry {
  id: string;
  date: string;
  productId: string;
  productName: string;
  variantSku?: string;
  type: 'Opening' | 'Purchase' | 'Sale' | 'Return' | 'Adjustment';
  qtyIn: number;
  qtyOut: number;
  balanceQty: number;
  reference: string;
  user: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface BusinessSettings {
  name: string;
  legalName: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branchName: string;
}
