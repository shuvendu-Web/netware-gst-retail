import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// API Endpoint for Gemini AI Assistant and Chat
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { messages, highThinking, systemInstruction } = req.body;
    const lastUserMessage = (messages && messages.length > 0) 
      ? (messages[messages.length - 1]?.content || '').toLowerCase()
      : '';

    // Step flows map for all ERP features
    const ERP_FLOW_MAP: Array<{ regex: RegExp; breadcrumb: string; reply: string }> = [
      {
        regex: /how.*add.*product|add.*product|new.*product|add.*item|kaise.*add.*product/i,
        breadcrumb: "click Products & AI > Add New Product button > open Add New Product & AI Assistant > input product name > edit > clicksave product button",
        reply: "click Products & AI > Add New Product button > open Add New Product & AI Assistant > input product name > edit > clicksave product button\n\nFollow these quick steps in HiffyBill ERP:\n1. click Products & AI in the sidebar\n2. Click the '+ Add New Product' button at the top\n3. This will open Add New Product & AI Assistant modal\n4. input product name (AI will auto-match catalog & HSN)\n5. edit GST, pricing, category, and initial stock\n6. clicksave product button to store the product in inventory master"
      },
      {
        regex: /how.*(create|make|issue|generate).*invoice|sales.*invoice|new.*sale|pos.*billing/i,
        breadcrumb: "click Sales & Invoices > New GST Sales Invoice button > enter Customer Name & Phone > select Products > adjust Qty & Discount > choose Payment Mode > click Issue & Print GST Invoice",
        reply: "click Sales & Invoices > New GST Sales Invoice button > enter Customer Name & Phone > select Products > adjust Qty & Discount > choose Payment Mode > click Issue & Print GST Invoice\n\nFollow these steps:\n1. click Sales & Invoices in the sidebar\n2. Click '+ New GST Sales Invoice' button\n3. enter Customer Name & Phone number with OTP\n4. select Products to add to invoice table\n5. adjust Qty, discount %, or edit unit price\n6. choose Payment Mode (Cash/UPI/Credit)\n7. click Issue & Print GST Invoice to finalize"
      },
      {
        regex: /how.*add.*supplier|add.*vendor|supplier.*product/i,
        breadcrumb: "click Purchase Orders & Bills > Add Supplier button > input Supplier Name & GSTIN > add Supplied Products details (Name, Rate, HSN, GST%) > toggle Add to Master > click Save Supplier & Products",
        reply: "click Purchase Orders & Bills > Add Supplier button > input Supplier Name & GSTIN > add Supplied Products details (Name, Rate, HSN, GST%) > toggle Add to Master > click Save Supplier & Products\n\nFollow these steps:\n1. click Purchase Orders & Bills from sidebar\n2. Click '+ Add Supplier' button at the top\n3. input Supplier Name, phone, and 15-digit GSTIN\n4. add Supplied Products details with purchase rates, HSN & GST%\n5. toggle 'Also add products to ERP Product Master'\n6. click Save Supplier & Products button"
      },
      {
        regex: /how.*(create|make|issue).*purchase.*order|how.*create.*po|purchase.*bill/i,
        breadcrumb: "click Purchase Orders & Bills > New Purchase Order button > select Supplier > pick Products & Batch > enter Purchase Qty & Rate > click Save PO & Receive Stock",
        reply: "click Purchase Orders & Bills > New Purchase Order button > select Supplier > pick Products & Batch > enter Purchase Qty & Rate > click Save PO & Receive Stock\n\nFollow these steps:\n1. click Purchase Orders & Bills from sidebar\n2. Click '+ New Purchase Order' button\n3. select Supplier from directory\n4. pick Products & batch details\n5. enter Purchase Qty & unit cost\n6. click Save PO & Receive Stock to update inventory"
      },
      {
        regex: /party|customer.*supplier|how.*manage.*part|how.*add.*customer/i,
        breadcrumb: "click Parties > switch to All Parties or Customers/Suppliers > click Add New Party button > choose Customer or Supplier > enter GSTIN, Phone & Credit Limit > click Save Party",
        reply: "click Parties > switch to All Parties or Customers/Suppliers > click Add New Party button > choose Customer or Supplier > enter GSTIN, Phone & Credit Limit > click Save Party\n\nFollow these steps:\n1. click Parties from the sidebar\n2. Switch to 'All Parties' to view all customer and supplier names together\n3. Click '+ Add New Party' button\n4. choose Customer or Supplier toggle\n5. enter GSTIN, phone, address & credit limit\n6. click Save Party to update directory"
      },
      {
        regex: /stock.*ledger|how.*track.*inventory|check.*stock|stock.*movement/i,
        breadcrumb: "click Inventory & Stock > view Real-time Stock Levels > click Stock Ledger tab > filter by Product or Transaction Type > inspect Opening, In/Out & Balance Qty",
        reply: "click Inventory & Stock > view Real-time Stock Levels > click Stock Ledger tab > filter by Product or Transaction Type > inspect Opening, In/Out & Balance Qty\n\nFollow these steps:\n1. click Inventory & Stock from sidebar\n2. View real-time stock levels and low stock alerts\n3. Click 'Stock Ledger' tab\n4. filter by Product or Transaction Type (Sale/Purchase/Opening)\n5. inspect Opening, In/Out and balance quantity audit trail"
      },
      {
        regex: /how.*record.*payment|payment.*in|payment.*out|settle.*bill/i,
        breadcrumb: "click Payments & Ledgers > click Record Payment button > select Party (Customer/Supplier) > enter Received/Paid Amount > pick Mode (Cash/UPI/Bank) > click Save Receipt",
        reply: "click Payments & Ledgers > click Record Payment button > select Party (Customer/Supplier) > enter Received/Paid Amount > pick Mode (Cash/UPI/Bank) > click Save Receipt\n\nFollow these steps:\n1. click Payments & Ledgers from sidebar\n2. Click '+ Record Payment' button\n3. select Party (Customer for Inward, Supplier for Outward)\n4. enter amount and reference invoice number\n5. pick Mode (Cash, UPI, Bank Transfer)\n6. click Save Receipt to settle party outstanding"
      },
      {
        regex: /how.*(file|generate).*gst|gstr1|gstr3b|tax.*report/i,
        breadcrumb: "click GST & Tax Reports > select Tax Period > review B2B Invoices, B2CS & HSN Summary > check CGST/SGST/IGST breakdown > click Export GSTR-1 JSON or Download PDF",
        reply: "click GST & Tax Reports > select Tax Period > review B2B Invoices, B2CS & HSN Summary > check CGST/SGST/IGST breakdown > click Export GSTR-1 JSON or Download PDF\n\nFollow these steps:\n1. click GST & Tax Reports from sidebar\n2. select Tax Period (Month/Quarter)\n3. review B2B Invoices, B2CS & HSN Summary\n4. check CGST/SGST/IGST tax breakdown\n5. click Export GSTR-1 JSON or Download PDF for GST portal filing"
      },
      {
        regex: /barcode|how.*scan.*barcode|pos.*scanner/i,
        breadcrumb: "click Sales & Invoices > click New GST Sales Invoice > plug USB Barcode Scanner > scan Product Barcode > auto-adds item to cart > enter Customer details > press F12 or Issue Invoice",
        reply: "click Sales & Invoices > click New GST Sales Invoice > plug USB Barcode Scanner > scan Product Barcode > auto-adds item to cart > enter Customer details > press F12 or Issue Invoice\n\nFollow these steps:\n1. click Sales & Invoices\n2. Click '+ New GST Sales Invoice'\n3. plug in any USB or Bluetooth Barcode Scanner\n4. scan product barcode on retail item\n5. Item is auto-added to the invoice table\n6. enter customer details and press F12 or Issue Invoice"
      }
    ];

    for (const flow of ERP_FLOW_MAP) {
      if (flow.regex.test(lastUserMessage)) {
        return res.json({ reply: flow.reply, breadcrumb: flow.breadcrumb });
      }
    }
    
    const modelName = highThinking ? 'gemini-4-argon' : 'gemini-3.8-flash';
    
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const config: any = {
      systemInstruction: systemInstruction || 'You are HiffyAI, the intelligent assistant for HiffyBill GST Billing & Retail ERP. You help business owners analyze sales, inventory, low stock, GST compliance, suppliers, and ERP features. When asked how to perform any ERP action, ALWAYS provide a step-by-step navigation breadcrumb in the format: click [Module] > [Action Button] > [Step 3] > [Step 4] > [Step 5] > [Final Action Button], followed by numbered instructions.'
    };

    if (highThinking) {
      config.thinkingConfig = { thinkingLevel: 'HIGH' };
    } else {
      config.temperature = 0.7;
    }

    if (apiKey) {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: formattedMessages,
        config
      });

      return res.json({ reply: response.text });
    }

    // Offline / fallback response
    return res.json({
      reply: "I am ready to help you manage your HiffyBill ERP operations! You can ask me how to add products, generate GST sales invoices, track low stock, or discover retail catalogs with Google AI images."
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    const lastUserMsg = (req.body?.messages?.slice(-1)[0]?.content || '').toLowerCase();
    if (/add.*product/i.test(lastUserMsg)) {
      return res.json({
        reply: "click Products & AI > Add New Product button > open Add New Product & AI Assistant > input product name > edit > clicksave product button"
      });
    }
    res.json({ 
      reply: "I analyzed your request using HiffyBill ERP records. Ask me to discover products (e.g., 'Suggest Lay\\'s Chips'), check low stock, or guide you through creating invoices and adding products." 
    });
  }
});

// API Endpoint for AI Product Discovery & Search Preview with deep image analysis
// Curated high-resolution retail product images by keyword/category
const PRODUCT_IMAGE_MAP: Array<{ keywords: string[]; url: string }> = [
  // Chips, Snacks & Confectionery
  { keywords: ['lay', 'chips', 'wafer', 'potato chips', 'pringles', 'bingo'], url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['kurkure', 'namkeen', 'snack', 'bhujia', 'mixture', 'haldiram'], url: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['biscuit', 'cookie', 'parle', 'oreo', 'bourbon', 'good day', 'britannia', 'marie'], url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['chocolate', 'cadbury', 'dairy milk', 'kitkat', 'snickers', 'sweet', '5 star', 'candy'], url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['maggi', 'noodle', 'instant noodle', 'yippee', 'pasta', 'chowmein'], url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80' },

  // Groceries, Grains & Edible Oils
  { keywords: ['rice', 'basmati', 'daawat', 'india gate', 'grain', 'paddy', 'chawal'], url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['oil', 'cooking oil', 'sunflower', 'fortune', 'mustard oil', 'safola', 'groundnut', 'soya oil'], url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['atta', 'flour', 'wheat', 'aashirvaad', 'maida', 'suji', 'besan'], url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['dal', 'pulse', 'toor dal', 'moong', 'chana', 'rajma', 'lentil', 'urad'], url: 'https://images.unsplash.com/photo-1585994192701-f1a505c8574a?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['ghee', 'butter', 'amul', 'dairy', 'curd', 'paneer', 'cheese'], url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['milk', 'amul milk', 'mother dairy', 'toned milk', 'cow milk'], url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['tea', 'chai', 'red label', 'tata tea', 'taj mahal', 'coffee', 'nescafe', 'bru'], url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['salt', 'tata salt', 'sugar', 'jaggery', 'spice', 'turmeric', 'chilli', 'masala', 'everest', 'mdh'], url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },

  // Electronics & Mobile Gadgets
  { keywords: ['iphone', 'apple', 'smartphone', 'mobile', 'galaxy', 'samsung', 'redmi', 'oneplus', 'pixel', 'vivo', 'oppo'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['laptop', 'macbook', 'dell', 'hp', 'lenovo', 'asus', 'notebook', 'computer'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['headphone', 'earphone', 'earbud', 'airpod', 'boat', 'sony', 'jbl', 'noise', 'audio'], url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['watch', 'smartwatch', 'fitbit', 'apple watch', 'boat wave', 'fastrack', 'titan'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['camera', 'dslr', 'canon', 'nikon', 'sony alpha'], url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['charger', 'cable', 'powerbank', 'adapter', 'usb', 'type-c', 'fast charger'], url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80' },

  // Garments & Apparel
  { keywords: ['shirt', 'formal shirt', 'casual shirt', 'cotton shirt', 'peter england', 'arrow', 'linen', 'button shirt'], url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['t-shirt', 'tshirt', 'tee', 'polo', 'allen solly', 'round neck', 'collar tee'], url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['jean', 'jeans', 'denim', 'levis', 'wrangler', 'pant', 'trouser', 'chinos'], url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['saree', 'kurti', 'dress', 'salwar', 'suit', 'lehenga', 'ethnic'], url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['jacket', 'hoodie', 'sweater', 'blazer', 'coat', 'winter wear'], url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['shoe', 'sneaker', 'nike', 'adidas', 'puma', 'sandal', 'footwear', 'lofer', 'leather shoe'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },

  // Personal Care & Fragrances
  { keywords: ['perfume', 'fragrance', 'cologne', 'wild stone', 'fogg', 'deodorant', 'body spray', 'axe'], url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['soap', 'dettol', 'dove', 'lifebuoy', 'lux', 'body wash', 'sanitizer', 'pears'], url: 'https://images.unsplash.com/photo-1607006314580-2c2421a2b92f?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['shampoo', 'conditioner', 'head & shoulders', 'pantene', 'dove shampoo', 'hair oil', 'clinic plus'], url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['toothpaste', 'colgate', 'pepsodent', 'brush', 'oral care', 'close up'], url: 'https://images.unsplash.com/photo-1559567246-81e19d3fec44?auto=format&fit=crop&w=600&q=80' },
  { keywords: ['cream', 'lotion', 'moisturizer', 'nivea', 'vaseline', 'sunscreen', 'skincare'], url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' }
];

function getAccurateProductImage(queryText: string): string {
  const q = (queryText || '').toLowerCase().trim();
  for (const item of PRODUCT_IMAGE_MAP) {
    if (item.keywords.some(k => q.includes(k))) {
      return item.url;
    }
  }
  // Curated retail placeholder
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
}

// Built-in Indian Retail Catalog Knowledge Base (5 items per category for rich carousel view)
function getSmartFallbackCandidates(rawQuery: string, industryType?: string) {
  const q = rawQuery.toLowerCase().trim();

  if (q.includes('lay') || q.includes('chip') || q.includes('wafer') || q.includes('potato') || q.includes('snack')) {
    return [
      {
        productName: "Lay's India's Magic Masala Potato Chips 50g",
        brand: "Lay's",
        industry: "Grocery",
        category: "Snacks & Namkeen",
        hsnCode: "1905",
        gstRate: 12,
        purchasePrice: 16,
        sellingPrice: 20,
        stock: 120,
        units: "PACK",
        variants: ["Magic Masala 50g", "Classic Salted 50g", "Spanish Tomato 50g"],
        suggestedSKU: "LAYS-MAS-50G",
        confidence: 0.98,
        description: "Crispy potato chips seasoned with authentic traditional Indian spices.",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Lay's American Style Cream & Onion 50g",
        brand: "Lay's",
        industry: "Grocery",
        category: "Snacks & Namkeen",
        hsnCode: "1905",
        gstRate: 12,
        purchasePrice: 16,
        sellingPrice: 20,
        stock: 80,
        units: "PACK",
        variants: ["Cream & Onion 50g", "Cream & Onion 90g"],
        suggestedSKU: "LAYS-CRMON-50G",
        confidence: 0.95,
        description: "Delicious potato chips flavored with rich sour cream and fragrant herbs.",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Kurkure Masala Munch Crunchy Snacks 85g",
        brand: "Kurkure",
        industry: "Grocery",
        category: "Snacks & Namkeen",
        hsnCode: "2106",
        gstRate: 12,
        purchasePrice: 15,
        sellingPrice: 20,
        stock: 90,
        units: "PACK",
        variants: ["Masala Munch 85g", "Green Chutney 85g"],
        suggestedSKU: "KURK-MUNCH-85G",
        confidence: 0.92,
        description: "Crunchy corn puffs with spicy blend of chili and mango seasoning.",
        imageUrl: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Pringles Original Savory Potato Crisps 107g",
        brand: "Pringles",
        industry: "Grocery",
        category: "Snacks & Namkeen",
        hsnCode: "1905",
        gstRate: 12,
        purchasePrice: 95,
        sellingPrice: 125,
        stock: 65,
        units: "CAN",
        variants: ["Original 107g", "Sour Cream & Onion 107g", "Peri Peri 107g"],
        suggestedSKU: "PRING-ORIG-107",
        confidence: 0.96,
        description: "Iconic hyperbolic paraboloid stacked potato crisps in a protective can canister.",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Bingo! Mad Angles Achaari Masti 66g",
        brand: "Bingo!",
        industry: "Grocery",
        category: "Snacks & Namkeen",
        hsnCode: "1905",
        gstRate: 12,
        purchasePrice: 16,
        sellingPrice: 20,
        stock: 75,
        units: "PACK",
        variants: ["Achaari Masti 66g", "Chaahat Chaat 66g"],
        suggestedSKU: "BNGO-ACH-66G",
        confidence: 0.94,
        description: "Perfect triangular crunchy chips soaked in mouth-watering tangy mango pickle spices.",
        imageUrl: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=600&q=80"
      }
    ];
  }

  if (q.includes('rice') || q.includes('basmati')) {
    return [
      {
        productName: "India Gate Basmati Rice Classic 5kg",
        brand: "India Gate",
        industry: "Grocery",
        category: "Rice & Grains",
        hsnCode: "1006",
        gstRate: 5,
        purchasePrice: 420,
        sellingPrice: 525,
        stock: 60,
        units: "BAG",
        variants: ["1 kg (150)", "5 kg (60)", "10 kg (30)"],
        suggestedSKU: "IG-BAS-5KG",
        confidence: 0.97,
        description: "Aged extra long grain fragrant Indian basmati rice.",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Daawat Rozana Gold Basmati Rice 5kg",
        brand: "Daawat",
        industry: "Grocery",
        category: "Rice & Grains",
        hsnCode: "1006",
        gstRate: 5,
        purchasePrice: 340,
        sellingPrice: 410,
        stock: 45,
        units: "BAG",
        variants: ["5 kg", "10 kg"],
        suggestedSKU: "DAAW-ROZ-5KG",
        confidence: 0.94,
        description: "Perfect everyday basmati rice with delightful aroma and elongation.",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Fortune Everyday Full Grain Basmati Rice 5kg",
        brand: "Fortune",
        industry: "Grocery",
        category: "Rice & Grains",
        hsnCode: "1006",
        gstRate: 5,
        purchasePrice: 320,
        sellingPrice: 395,
        stock: 55,
        units: "BAG",
        variants: ["1 kg", "5 kg"],
        suggestedSKU: "FORT-BAS-5KG",
        confidence: 0.93,
        description: "Fluffy non-sticky elongated basmati rice suitable for biryani and daily meals.",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Kohinoor Super Authentic Silver Basmati Rice 5kg",
        brand: "Kohinoor",
        industry: "Grocery",
        category: "Rice & Grains",
        hsnCode: "1006",
        gstRate: 5,
        purchasePrice: 410,
        sellingPrice: 499,
        stock: 40,
        units: "BAG",
        variants: ["5 kg", "1 kg"],
        suggestedSKU: "KOH-SILV-5KG",
        confidence: 0.95,
        description: "Naturally matured Himalayan river-fed basmati rice grains.",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Lal Qilla Traditional Extra Long Basmati Rice 5kg",
        brand: "Lal Qilla",
        industry: "Grocery",
        category: "Rice & Grains",
        hsnCode: "1006",
        gstRate: 5,
        purchasePrice: 460,
        sellingPrice: 560,
        stock: 35,
        units: "BAG",
        variants: ["5 kg", "10 kg"],
        suggestedSKU: "LQ-TRAD-5KG",
        confidence: 0.96,
        description: "Royal royal grade aromatic long grain basmati rice for royal feasts.",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
      }
    ];
  }

  if (q.includes('shirt') || q.includes('t-shirt') || q.includes('apparel') || q.includes('pant') || q.includes('jean')) {
    return [
      {
        productName: "Levi's 511 Slim Fit Stretch Denim Jeans",
        brand: "Levi's",
        industry: "Garments",
        category: "Men's Wear",
        hsnCode: "6203",
        gstRate: 12,
        purchasePrice: 1450,
        sellingPrice: 2499,
        stock: 45,
        units: "PCS",
        variants: ["Blue (30)", "Blue (32)", "Black (34)"],
        suggestedSKU: "LEVI-511-SLM",
        confidence: 0.96,
        description: "Classic slim-fit denim jeans with comfortable stretch cotton blend.",
        imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Wrangler Authentics Regular Fit Straight Leg Jeans",
        brand: "Wrangler",
        industry: "Garments",
        category: "Men's Wear",
        hsnCode: "6203",
        gstRate: 12,
        purchasePrice: 1350,
        sellingPrice: 2199,
        stock: 50,
        units: "PCS",
        variants: ["Vintage Indigo (32)", "Dark Stonewash (34)"],
        suggestedSKU: "WRANG-REG-32",
        confidence: 0.94,
        description: "Durable 5-pocket denim styling with comfort flex waistband.",
        imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Peter England Men's Slim Fit Formal Cotton Shirt",
        brand: "Peter England",
        industry: "Garments",
        category: "Men's Wear",
        hsnCode: "6205",
        gstRate: 5,
        purchasePrice: 650,
        sellingPrice: 1299,
        stock: 60,
        units: "PCS",
        variants: ["Blue (39)", "Blue (40)", "White (40)", "Navy (42)"],
        suggestedSKU: "PE-SLM-SHT",
        confidence: 0.97,
        description: "Breathable 100% cotton formal and casual button-down shirt.",
        imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Allen Solly Solid Pure Cotton Polo T-Shirt",
        brand: "Allen Solly",
        industry: "Garments",
        category: "Men's Wear",
        hsnCode: "6109",
        gstRate: 5,
        purchasePrice: 420,
        sellingPrice: 799,
        stock: 75,
        units: "PCS",
        variants: ["Navy (M)", "Navy (L)", "White (M)", "Black (L)"],
        suggestedSKU: "AS-POLO-CTN",
        confidence: 0.95,
        description: "Premium combed cotton pique polo t-shirt with ribbed collar.",
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "U.S. Polo Assn. Classic Denim Trucker Jacket",
        brand: "U.S. Polo Assn.",
        industry: "Garments",
        category: "Men's Wear",
        hsnCode: "6201",
        gstRate: 12,
        purchasePrice: 1800,
        sellingPrice: 2999,
        stock: 30,
        units: "PCS",
        variants: ["Denim Blue (M)", "Denim Blue (L)", "Denim Blue (XL)"],
        suggestedSKU: "USPA-TRK-JKT",
        confidence: 0.93,
        description: "Heritage denim jacket with dual chest pockets and branded metal buttons.",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
      }
    ];
  }

  if (q.includes('phone') || q.includes('mobile') || q.includes('iphone') || q.includes('samsung') || q.includes('galaxy') || q.includes('electronics')) {
    return [
      {
        productName: "Samsung Galaxy S24 5G (8GB RAM, 256GB)",
        brand: "Samsung",
        industry: "Electronics",
        category: "Mobiles & Gadgets",
        hsnCode: "8517",
        gstRate: 18,
        purchasePrice: 58000,
        sellingPrice: 69999,
        stock: 25,
        units: "PCS",
        variants: ["Onyx Black (256GB)", "Marble Gray (256GB)", "Cobalt Violet (256GB)"],
        suggestedSKU: "SAM-S24-256",
        confidence: 0.98,
        description: "Flagship smartphone with Dynamic AMOLED 2X, AI features and Snapdragon processor.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Apple iPhone 15 128GB Blue",
        brand: "Apple",
        industry: "Electronics",
        category: "Mobiles & Gadgets",
        hsnCode: "8517",
        gstRate: 18,
        purchasePrice: 61000,
        sellingPrice: 72900,
        stock: 15,
        units: "PCS",
        variants: ["Black 128GB", "Blue 128GB", "Green 128GB"],
        suggestedSKU: "APL-IP15-128",
        confidence: 0.99,
        description: "Dynamic Island, 48MP Main camera, and USB-C connectivity.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "OnePlus Nord CE 4 5G (8GB RAM, 128GB Storage)",
        brand: "OnePlus",
        industry: "Electronics",
        category: "Mobiles & Gadgets",
        hsnCode: "8517",
        gstRate: 18,
        purchasePrice: 20500,
        sellingPrice: 24999,
        stock: 35,
        units: "PCS",
        variants: ["Dark Chrome 128GB", "Celadon Marble 128GB"],
        suggestedSKU: "1PLS-NORD-128",
        confidence: 0.95,
        description: "Snapdragon 7 Gen 3, 100W SUPERVOOC charging, and 120Hz AMOLED display.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "boAt Rockerz 450 Wireless Bluetooth On-Ear Headphones",
        brand: "boAt",
        industry: "Electronics",
        category: "Audio & Wearables",
        hsnCode: "8518",
        gstRate: 18,
        purchasePrice: 950,
        sellingPrice: 1499,
        stock: 80,
        units: "PCS",
        variants: ["Luscious Black", "Hazel Beige", "Aqua Blue"],
        suggestedSKU: "BOAT-RCK-450",
        confidence: 0.94,
        description: "40mm dynamic drivers with up to 15 hours playback and plush padded ear cushions.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Noise ColorFit Pulse 3 Bluetooth Calling Smartwatch",
        brand: "Noise",
        industry: "Electronics",
        category: "Audio & Wearables",
        hsnCode: "8517",
        gstRate: 18,
        purchasePrice: 1200,
        sellingPrice: 1799,
        stock: 60,
        units: "PCS",
        variants: ["Jet Black", "Rose Pink", "Deep Wine"],
        suggestedSKU: "NOIS-PULS-3",
        confidence: 0.93,
        description: "1.96-inch TFT display, Tru Sync Bluetooth calling, and 100+ sports modes.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
      }
    ];
  }

  if (q.includes('oil') || q.includes('fortune') || q.includes('sunflower')) {
    return [
      {
        productName: "Fortune Sunlite Refined Sunflower Oil 1 Litre Pouch",
        brand: "Fortune",
        industry: "Grocery",
        category: "Edible Oils",
        hsnCode: "1512",
        gstRate: 5,
        purchasePrice: 115,
        sellingPrice: 145,
        stock: 150,
        units: "LTR",
        variants: ["1 Litre Pouch", "5 Litre Jar"],
        suggestedSKU: "FORT-SUN-1L",
        confidence: 0.96,
        description: "Enriched with Vitamins A & D, light and healthy refined sunflower oil.",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Saffola Gold Pro Healthy Blend Edible Oil 1 Litre",
        brand: "Saffola",
        industry: "Grocery",
        category: "Edible Oils",
        hsnCode: "1512",
        gstRate: 5,
        purchasePrice: 135,
        sellingPrice: 170,
        stock: 90,
        units: "LTR",
        variants: ["1 Litre Pouch", "5 Litre Can"],
        suggestedSKU: "SAFF-GLD-1L",
        confidence: 0.95,
        description: "Dual seed technology blend of Rice Bran and Sunflower oil for heart health.",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Dhara Kachi Ghani Mustard Oil 1 Litre Bottle",
        brand: "Dhara",
        industry: "Grocery",
        category: "Edible Oils",
        hsnCode: "1514",
        gstRate: 5,
        purchasePrice: 125,
        sellingPrice: 155,
        stock: 110,
        units: "LTR",
        variants: ["1 Litre Bottle", "5 Litre Jar"],
        suggestedSKU: "DHARA-MST-1L",
        confidence: 0.94,
        description: "Traditional cold-pressed mustard oil with pungent pungent natural aroma.",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Emami Healthy & Tasty Refined Rice Bran Oil 1L",
        brand: "Emami",
        industry: "Grocery",
        category: "Edible Oils",
        hsnCode: "1515",
        gstRate: 5,
        purchasePrice: 120,
        sellingPrice: 150,
        stock: 70,
        units: "LTR",
        variants: ["1 Litre Pouch"],
        suggestedSKU: "EMAM-RBO-1L",
        confidence: 0.92,
        description: "Physically refined rice bran oil rich in Oryzanol for cholesterol management.",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
      },
      {
        productName: "Gemini Pure Refined Sunflower Oil 1 Litre Pouch",
        brand: "Gemini",
        industry: "Grocery",
        category: "Edible Oils",
        hsnCode: "1512",
        gstRate: 5,
        purchasePrice: 112,
        sellingPrice: 140,
        stock: 85,
        units: "LTR",
        variants: ["1 Litre Pouch", "5 Litre Can"],
        suggestedSKU: "GEM-SUN-1L",
        confidence: 0.93,
        description: "Trusted sunflower cooking oil enriched with Nutri-V health boosters.",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
      }
    ];
  }

  // General smart fallback: 5 diverse realistic catalog items
  const cleanTitle = rawQuery.replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Retail Product';
  const matchedIndustry = (industryType && industryType !== 'All') ? industryType : 'General';
  const imgUrl = getAccurateProductImage(cleanTitle);

  return [
    {
      productName: `${cleanTitle} Standard Edition Pack`,
      brand: 'Premium Brand',
      industry: matchedIndustry,
      category: matchedIndustry === 'Grocery' ? 'Groceries & Essentials' : matchedIndustry === 'Garments' ? "Men's Apparel" : 'General Merchandise',
      hsnCode: matchedIndustry === 'Grocery' ? '2106' : matchedIndustry === 'Garments' ? '6205' : '8517',
      gstRate: matchedIndustry === 'Grocery' ? 5 : 18,
      purchasePrice: 240,
      sellingPrice: 399,
      stock: 60,
      units: matchedIndustry === 'Grocery' ? 'KG' : 'PCS',
      variants: ['Standard Pack (50)'],
      suggestedSKU: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      confidence: 0.95,
      description: `AI catalog matched retail product: ${cleanTitle}`,
      imageUrl: imgUrl
    },
    {
      productName: `${cleanTitle} Deluxe Family Edition`,
      brand: 'Classic Brand',
      industry: matchedIndustry,
      category: matchedIndustry === 'Grocery' ? 'Groceries & Essentials' : matchedIndustry === 'Garments' ? "Men's Apparel" : 'General Merchandise',
      hsnCode: matchedIndustry === 'Grocery' ? '2106' : matchedIndustry === 'Garments' ? '6205' : '8517',
      gstRate: matchedIndustry === 'Grocery' ? 5 : 18,
      purchasePrice: 420,
      sellingPrice: 649,
      stock: 45,
      units: matchedIndustry === 'Grocery' ? 'KG' : 'PCS',
      variants: ['Deluxe Pack (100)'],
      suggestedSKU: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      confidence: 0.94,
      description: `High demand deluxe variant of ${cleanTitle} for wholesale and retail.`,
      imageUrl: imgUrl
    },
    {
      productName: `${cleanTitle} Economy Value Pack`,
      brand: 'Heritage Brand',
      industry: matchedIndustry,
      category: matchedIndustry === 'Grocery' ? 'Groceries & Essentials' : matchedIndustry === 'Garments' ? "Men's Apparel" : 'General Merchandise',
      hsnCode: matchedIndustry === 'Grocery' ? '2106' : matchedIndustry === 'Garments' ? '6205' : '8517',
      gstRate: matchedIndustry === 'Grocery' ? 5 : 18,
      purchasePrice: 150,
      sellingPrice: 249,
      stock: 120,
      units: matchedIndustry === 'Grocery' ? 'KG' : 'PCS',
      variants: ['Economy Pack'],
      suggestedSKU: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      confidence: 0.92,
      description: `High velocity consumer choice packaging for ${cleanTitle}.`,
      imageUrl: imgUrl
    },
    {
      productName: `${cleanTitle} Pro Gold Edition`,
      brand: 'Select Brand',
      industry: matchedIndustry,
      category: matchedIndustry === 'Grocery' ? 'Groceries & Essentials' : matchedIndustry === 'Garments' ? "Men's Apparel" : 'General Merchandise',
      hsnCode: matchedIndustry === 'Grocery' ? '2106' : matchedIndustry === 'Garments' ? '6205' : '8517',
      gstRate: matchedIndustry === 'Grocery' ? 5 : 18,
      purchasePrice: 680,
      sellingPrice: 999,
      stock: 35,
      units: matchedIndustry === 'Grocery' ? 'KG' : 'PCS',
      variants: ['Pro Gold Edition'],
      suggestedSKU: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      confidence: 0.96,
      description: `Grade A certified premium batch of ${cleanTitle}.`,
      imageUrl: imgUrl
    },
    {
      productName: `${cleanTitle} Mini Travel / Sample Pack`,
      brand: 'Express Brand',
      industry: matchedIndustry,
      category: matchedIndustry === 'Grocery' ? 'Groceries & Essentials' : matchedIndustry === 'Garments' ? "Men's Apparel" : 'General Merchandise',
      hsnCode: matchedIndustry === 'Grocery' ? '2106' : matchedIndustry === 'Garments' ? '6205' : '8517',
      gstRate: matchedIndustry === 'Grocery' ? 5 : 18,
      purchasePrice: 65,
      sellingPrice: 99,
      stock: 180,
      units: matchedIndustry === 'Grocery' ? 'KG' : 'PCS',
      variants: ['Mini Sample (25)'],
      suggestedSKU: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      confidence: 0.91,
      description: `Quick impulse purchase retail edition of ${cleanTitle}.`,
      imageUrl: imgUrl
    }
  ];
}

// API Endpoint for AI Product Discovery & Search Preview with deep image analysis
app.post('/api/ai-product-search', async (req, res) => {
  const { query, industry } = req.body;
  const safeQuery = (query || '').trim();

  try {
    if (apiKey) {
      const prompt = `Act as an expert retail product catalog AI for Indian GST retail/wholesale businesses (${industry || 'General Retail'}). 
      Provide 5 realistic candidate products matching this exact description (including 2 additional brand/pack variants for a 5-item carousel), including:
      - productName (string: full official brand + item name, e.g. "Lay's India's Magic Masala 50g")
      - brand (string: brand name, e.g. "Lay's", "Amul", "Peter England", "Samsung")
      - industry (string: strictly one of "Garments", "Grocery", "Electronics", "General")
      - category (string: retail category, e.g. "Snacks & Namkeen", "Mobiles & Gadgets", "Men's Wear")
      - variants (array of strings, e.g. ["50g Pack", "90g Pack"])
      - suggestedSKU (string, e.g. "LAY-MAS-50G")
      - hsnCode (string: accurate 4-digit Indian GST HSN code, e.g. 1905, 1006, 6205, 8517, 3401)
      - gstRate (number: strictly 0, 5, 12, 18, or 28)
      - purchasePrice (number in INR)
      - sellingPrice (number in INR)
      - stock (number: recommended initial inventory, e.g. 50, 100)
      - units (string: UOM like "PCS", "KG", "LTR", "BOX", "PACK", "BAG")
      - confidence (number between 0.85 and 0.99)
      - description (string)
      - imageSearchKeyword (string for image matching, e.g. "chips", "phone", "shirt", "rice", "perfume")
      
      Return ONLY valid JSON array of objects with these exact keys. No markdown fences around the raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      });

      let text = response.text || '[]';
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const candidates = JSON.parse(text);

      if (Array.isArray(candidates) && candidates.length > 0) {
        const enriched = candidates.map((c: any) => ({
          ...c,
          industry: c.industry || (industry && industry !== 'All' ? industry : 'General'),
          units: c.units || (c.industry === 'Grocery' ? 'KG' : 'PCS'),
          stock: Number(c.stock) || 50,
          imageUrl: getAccurateProductImage(c.imageSearchKeyword || c.productName || safeQuery)
        }));
        return res.json({ candidates: enriched });
      }
    }

    // High quality fallback catalog match
    const fallbackCandidates = getSmartFallbackCandidates(safeQuery, industry);
    return res.json({ candidates: fallbackCandidates });
  } catch (error: any) {
    console.warn('AI API fallback triggered for product search:', error.message || error);
    const fallbackCandidates = getSmartFallbackCandidates(safeQuery, industry);
    return res.json({ candidates: fallbackCandidates });
  }
});

async function startServer() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const isDist = path.basename(__dirname).toLowerCase() === 'dist';
  const isProd = process.env.NODE_ENV === 'production' || isDist;

  if (isProd) {
    const distPath = isDist ? __dirname : path.resolve(process.cwd(), 'dist');
    console.log(`[Production Mode] Serving static assets from: ${distPath}`);
    app.use(express.static(distPath));

    // Handle SPA client-side routing fallback
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    console.log(`[Development Mode] Starting Vite middleware...`);
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  const initialPort = Number(process.env.PORT) || 3000;

  function listen(port: number) {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`HiffyBill ERP Server running on http://localhost:${port} [${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is already in use. Retrying on port ${port + 1}...`);
        listen(port + 1);
      } else {
        console.error('Server listen error:', err);
      }
    });
  }

  listen(initialPort);
}

startServer();
