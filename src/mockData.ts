import { Product, Invoice, PurchaseOrder, Party, PaymentTransaction, StockLedgerEntry, BusinessSettings } from './types';

export const initialBusinessSettings: BusinessSettings = {
  name: 'Hiffy Retail Store',
  legalName: 'Hiffy Enterprises Pvt Ltd',
  gstin: '29AABCH1234F1Z5',
  email: 'support@hiffystore.com',
  phone: '+91 98765 43210',
  address: '108, Brigade Road, Commercial Complex',
  state: 'Karnataka',
  bankName: 'HDFC Bank',
  accountNumber: '50200012345678',
  ifsc: 'HDFC0001234',
  branchName: 'Main Branch - Bengaluru'
};

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: "Men's Casual Shirt",
    code: 'SHIRT-M-01',
    brand: 'Peter England',
    category: "Men's Wear",
    subcategory: 'Shirts',
    industry: 'Garments',
    description: '100% Cotton Premium Regular Fit Casual Shirt for Men',
    uom: 'PCS',
    hsnCode: '6205',
    gstRate: 5,
    purchasePrice: 650,
    sellingPrice: 1299,
    mrp: 1999,
    openingStock: 120,
    minStockLevel: 20,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80',
    barcode: '8901234567891',
    trackBatch: false,
    trackExpiry: false,
    status: 'Active',
    createdAt: '2024-10-01',
    variants: [
      { id: 'v1', sku: 'SH-BLU-M', color: 'Blue', size: 'M', stock: 30, price: 1299, mrp: 1999, barcode: '8901234567891' },
      { id: 'v2', sku: 'SH-BLU-L', color: 'Blue', size: 'L', stock: 25, price: 1299, mrp: 1999, barcode: '8901234567892' },
      { id: 'v3', sku: 'SH-BLK-M', color: 'Black', size: 'M', stock: 35, price: 1299, mrp: 1999, barcode: '8901234567893' },
      { id: 'v4', sku: 'SH-BLK-L', color: 'Black', size: 'L', stock: 30, price: 1299, mrp: 1999, barcode: '8901234567894' }
    ],
    packagingLevels: [
      { levelNumber: 1, levelName: 'Piece', unitsPerParent: 1, uom: 'PCS', netQuantity: 0.3, grossWeight: 0.35, weightUnit: 'kg' },
      { levelNumber: 2, levelName: 'Bundle', unitsPerParent: 10, uom: 'Bdl', netQuantity: 3.0, grossWeight: 3.5, weightUnit: 'kg' },
      { levelNumber: 3, levelName: 'Master Carton', unitsPerParent: 50, uom: 'Ctn', netQuantity: 15.0, grossWeight: 17.0, weightUnit: 'kg' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Premium Basmati Rice',
    code: 'RICE-BASM-02',
    brand: 'India Gate',
    category: 'Groceries',
    subcategory: 'Grains & Rice',
    industry: 'Grocery',
    description: 'Aged Traditional Long Grain Basmati Rice',
    uom: 'KG',
    hsnCode: '1006',
    gstRate: 0,
    purchasePrice: 90,
    sellingPrice: 140,
    mrp: 160,
    openingStock: 500,
    minStockLevel: 100,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80',
    barcode: '8909876543211',
    trackBatch: true,
    trackExpiry: true,
    status: 'Active',
    createdAt: '2024-10-02',
    variants: [
      { id: 'v5', sku: 'RICE-BASM-1KG', packSize: '1 kg', stock: 150, price: 140, mrp: 160, barcode: '8909876543211' },
      { id: 'v6', sku: 'RICE-BASM-5KG', packSize: '5 kg', stock: 200, price: 650, mrp: 750, barcode: '8909876543212' },
      { id: 'v7', sku: 'RICE-BASM-10KG', packSize: '10 kg', stock: 150, price: 1250, mrp: 1450, barcode: '8909876543213' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Cotton T-Shirt',
    code: 'TSHIRT-03',
    brand: 'Allen Solly',
    category: "Men's Wear",
    subcategory: 'T-Shirts',
    industry: 'Garments',
    description: 'Casual Solid Round Neck Cotton T-Shirt',
    uom: 'PCS',
    hsnCode: '6109',
    gstRate: 5,
    purchasePrice: 280,
    sellingPrice: 599,
    mrp: 999,
    openingStock: 80,
    minStockLevel: 15,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
    barcode: '8903334445551',
    trackBatch: false,
    trackExpiry: false,
    status: 'Active',
    createdAt: '2024-10-03',
    variants: [
      { id: 'v8', sku: 'TS-GRN-M', color: 'Green', size: 'M', stock: 40, price: 599, mrp: 999, barcode: '8903334445551' },
      { id: 'v9', sku: 'TS-GRN-L', color: 'Green', size: 'L', stock: 40, price: 599, mrp: 999, barcode: '8903334445552' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Cooking Oil 1L',
    code: 'OIL-SF-04',
    brand: 'Fortune',
    category: 'Groceries',
    subcategory: 'Edible Oils',
    industry: 'Grocery',
    description: 'Refined Sunflower Edible Oil Pouch',
    uom: 'Ltr',
    hsnCode: '1512',
    gstRate: 5,
    purchasePrice: 110,
    sellingPrice: 145,
    mrp: 160,
    openingStock: 300,
    minStockLevel: 50,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80',
    barcode: '8905556667771',
    trackBatch: true,
    trackExpiry: true,
    status: 'Active',
    createdAt: '2024-10-04',
    variants: [
      { id: 'v10', sku: 'OIL-SF-1L', packSize: '1 Litre', stock: 300, price: 145, mrp: 160, barcode: '8905556667771' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Slim Fit Jeans',
    code: 'JEANS-05',
    brand: 'Levis',
    category: "Men's Wear",
    subcategory: 'Denim',
    industry: 'Garments',
    description: 'Dark Blue Stretchable Slim Fit Jeans',
    uom: 'PCS',
    hsnCode: '6203',
    gstRate: 12,
    purchasePrice: 950,
    sellingPrice: 2199,
    mrp: 3499,
    openingStock: 60,
    minStockLevel: 10,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80',
    barcode: '8907778889991',
    trackBatch: false,
    trackExpiry: false,
    status: 'Active',
    createdAt: '2024-10-05',
    variants: [
      { id: 'v11', sku: 'JNS-BLU-30', color: 'Blue', size: '30', stock: 20, price: 2199, mrp: 3499, barcode: '8907778889991' },
      { id: 'v12', sku: 'JNS-BLU-32', color: 'Blue', size: '32', stock: 25, price: 2199, mrp: 3499, barcode: '8907778889992' },
      { id: 'v13', sku: 'JNS-BLU-34', color: 'Blue', size: '34', stock: 15, price: 2199, mrp: 3499, barcode: '8907778889993' }
    ]
  }
];

export const initialParties: Party[] = [
  {
    id: 'cust-1',
    type: 'Customer',
    name: 'Rahul Sharma',
    contactPerson: 'Rahul Sharma',
    phone: '+91 98221 11223',
    email: 'rahul.sharma@gmail.com',
    gstin: '29AAAAA0000A1Z5',
    address: '#45, 5th Cross, Indiranagar',
    state: 'Karnataka',
    creditLimit: 50000,
    openingBalance: 0,
    currentOutstanding: 2450
  },
  {
    id: 'cust-2',
    type: 'Customer',
    name: 'Neha Fashion Hub',
    contactPerson: 'Neha Gupta',
    phone: '+91 97443 33221',
    email: 'neha@nehafashion.com',
    gstin: '29BBBBB1111B1Z2',
    address: '#12, Commercial Street',
    state: 'Karnataka',
    creditLimit: 150000,
    openingBalance: 10000,
    currentOutstanding: 12400
  },
  {
    id: 'supp-1',
    type: 'Supplier',
    name: 'India Gate Foods',
    contactPerson: 'Manoj Kumar',
    phone: '+91 98450 12345',
    email: 'orders@indiagatefoods.com',
    gstin: '27AAACI1234P1ZV',
    address: 'APMC Market, Vashi',
    state: 'Maharashtra',
    creditLimit: 500000,
    openingBalance: 0,
    currentOutstanding: 35000
  },
  {
    id: 'supp-2',
    type: 'Supplier',
    name: 'Peter England Apparel Ltd',
    contactPerson: 'Sanjay Verma',
    phone: '+91 98800 65432',
    email: 'b2b@peterengland.com',
    gstin: '29AAACP9876Q1ZO',
    address: 'Garment Park, Doddaballapur',
    state: 'Karnataka',
    creditLimit: 1000000,
    openingBalance: 0,
    currentOutstanding: 125000
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-00124',
    date: '2024-10-18',
    dueDate: '2024-11-18',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerGstin: '29AAAAA0000A1Z5',
    placeOfSupply: 'Karnataka',
    isInterState: false,
    items: [
      {
        id: 'ii-1',
        productId: 'prod-1',
        productName: "Men's Casual Shirt",
        variantSku: 'SH-BLU-M',
        hsnCode: '6205',
        quantity: 2,
        unit: 'PCS',
        price: 1299,
        discountPercent: 5,
        taxableAmount: 2468.10,
        gstRate: 5,
        cgst: 61.70,
        sgst: 61.70,
        igst: 0,
        totalAmount: 2591.50
      }
    ],
    subtotal: 2598.00,
    totalDiscount: 129.90,
    totalTax: 123.40,
    roundOff: -0.50,
    grandTotal: 2450.00,
    paymentMode: 'UPI',
    paymentStatus: 'Paid',
    paidAmount: 2450.00,
    status: 'Issued'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-00123',
    date: '2024-10-18',
    dueDate: '2024-11-18',
    customerId: 'cust-walkin',
    customerName: 'Walk-in Customer',
    placeOfSupply: 'Karnataka',
    isInterState: false,
    items: [
      {
        id: 'ii-2',
        productId: 'prod-2',
        productName: 'Premium Basmati Rice 5kg',
        variantSku: 'RICE-BASM-5KG',
        hsnCode: '1006',
        quantity: 2,
        unit: 'Pack',
        price: 650,
        discountPercent: 0,
        taxableAmount: 1300,
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalAmount: 1300
      }
    ],
    subtotal: 1300,
    totalDiscount: 0,
    totalTax: 0,
    roundOff: 0,
    grandTotal: 1300,
    paymentMode: 'Cash',
    paymentStatus: 'Paid',
    paidAmount: 1300,
    status: 'Issued'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-00122',
    date: '2024-10-17',
    dueDate: '2024-11-17',
    customerId: 'cust-2',
    customerName: 'Neha Fashion Hub',
    customerGstin: '29BBBBB1111B1Z2',
    placeOfSupply: 'Karnataka',
    isInterState: false,
    items: [
      {
        id: 'ii-3',
        productId: 'prod-5',
        productName: 'Slim Fit Jeans',
        variantSku: 'JNS-BLU-32',
        hsnCode: '6203',
        quantity: 5,
        unit: 'PCS',
        price: 2199,
        discountPercent: 10,
        taxableAmount: 9895.50,
        gstRate: 12,
        cgst: 593.73,
        sgst: 593.73,
        igst: 0,
        totalAmount: 11083.00
      }
    ],
    subtotal: 10995.00,
    totalDiscount: 1099.50,
    totalTax: 1187.46,
    roundOff: 0.04,
    grandTotal: 12400.00,
    paymentMode: 'Credit',
    paymentStatus: 'Credit',
    paidAmount: 0,
    status: 'Issued'
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-00045',
    supplierId: 'supp-1',
    supplierName: 'India Gate Foods',
    date: '2024-10-18',
    items: [
      {
        id: 'pi-1',
        productId: 'prod-2',
        productName: 'Premium Basmati Rice 10kg',
        variantSku: 'RICE-BASM-10KG',
        quantity: 50,
        unitCost: 1100,
        taxRate: 0,
        total: 55000,
        batchNumber: 'IG-2024-B1',
        expiryDate: '2026-10-18'
      }
    ],
    totalAmount: 35000,
    status: 'Received'
  },
  {
    id: 'po-2',
    poNumber: 'PO-00044',
    supplierId: 'supp-2',
    supplierName: 'Peter England',
    date: '2024-10-17',
    items: [
      {
        id: 'pi-2',
        productId: 'prod-1',
        productName: "Men's Casual Shirt",
        variantSku: 'SH-BLU-M',
        quantity: 100,
        unitCost: 650,
        taxRate: 5,
        total: 68250
      }
    ],
    totalAmount: 125000,
    status: 'Partial'
  }
];

export const initialPayments: PaymentTransaction[] = [
  {
    id: 'pay-1',
    receiptNumber: 'REC-0089',
    date: '2024-10-18',
    partyId: 'cust-1',
    partyName: 'Rahul Sharma',
    type: 'Payment In',
    amount: 2450,
    mode: 'UPI',
    referenceNo: 'UPI/429182910',
    allocatedInvoice: 'INV-00124'
  },
  {
    id: 'pay-2',
    receiptNumber: 'PAY-0041',
    date: '2024-10-16',
    partyId: 'supp-1',
    partyName: 'India Gate Foods',
    type: 'Payment Out',
    amount: 50000,
    mode: 'Bank Transfer',
    referenceNo: 'NEFT/HDFC123456'
  }
];

export const initialStockLedger: StockLedgerEntry[] = [
  {
    id: 'sl-1',
    date: '2024-10-01',
    productId: 'prod-1',
    productName: "Men's Casual Shirt (SH-BLU-M)",
    type: 'Opening',
    qtyIn: 50,
    qtyOut: 0,
    balanceQty: 50,
    reference: 'Opening Stock',
    user: 'Admin'
  },
  {
    id: 'sl-2',
    date: '2024-10-18',
    productId: 'prod-1',
    productName: "Men's Casual Shirt (SH-BLU-M)",
    type: 'Sale',
    qtyIn: 0,
    qtyOut: 2,
    balanceQty: 48,
    reference: 'INV-00124',
    user: 'Cashier 1'
  }
];
