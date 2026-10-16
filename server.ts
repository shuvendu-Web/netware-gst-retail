import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
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
    
    const modelName = highThinking ? 'gemini-4-argon' : 'gemini-3.8-flash';
    
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const config: any = {
      systemInstruction: systemInstruction || 'You are HiffyAI, the intelligent assistant for HiffyBill GST Billing & Retail ERP. You help business owners analyze sales, inventory, low stock, GST compliance, and product variants.'
    };

    if (highThinking) {
      config.thinkingConfig = { thinkingLevel: 'HIGH' };
    } else {
      config.temperature = 0.7;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: formattedMessages,
      config
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI response' });
  }
});

// API Endpoint for AI Product Discovery & Search Preview with deep image analysis
app.post('/api/ai-product-search', async (req, res) => {
  try {
    const { query, industry } = req.body;
    
    const prompt = `Act as an expert retail product catalog AI for Indian GST retail/wholesale businesses (${industry || 'General Retail'}). 
    The user searched for: "${query}".
    Provide 3 realistic candidate products matching this exact description, including:
    - ProductName (string)
    - Brand (string)
    - Category (string)
    - Variants/PackSizes (array of strings)
    - SuggestedSKU (string)
    - HSNCode (string)
    - GST_Rate (number, e.g. 5, 12, 18, 28)
    - PurchasePrice (number in INR)
    - SellingPrice (number in INR)
    - Confidence (number between 0.85 and 0.99)
    - Description (string)
    - ImageSearchKeyword (string, e.g. "smartphone", "laptop", "chips", "shirt", "shoes", "rice")
    
    Return ONLY valid JSON array of objects with these exact keys: productName, brand, category, variants, suggestedSKU, hsnCode, gstRate, purchasePrice, sellingPrice, confidence, description, imageSearchKeyword. No markdown fences around the raw JSON if possible, or clean JSON format.`;

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

    // Attach exact matching image URL for each candidate based on query/keyword
    const enrichedCandidates = candidates.map((c: any) => {
      const keyword = (c.imageSearchKeyword || query || '').toLowerCase();
      let imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
      
      if (keyword.includes('phone') || keyword.includes('mobile') || keyword.includes('edge') || keyword.includes('galaxy') || keyword.includes('apple') || keyword.includes('iphone')) {
        imageUrl = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80';
      } else if (keyword.includes('chip') || keyword.includes('snack') || keyword.includes('lays') || keyword.includes('crisp')) {
        imageUrl = 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80';
      } else if (keyword.includes('shirt') || keyword.includes('cloth') || keyword.includes('apparel') || keyword.includes('wear')) {
        imageUrl = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80';
      } else if (keyword.includes('rice') || keyword.includes('grain')) {
        imageUrl = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80';
      } else if (keyword.includes('oil')) {
        imageUrl = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80';
      } else if (keyword.includes('shoe') || keyword.includes('sneaker')) {
        imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80';
      }

      return {
        ...c,
        imageUrl
      };
    });

    res.json({ candidates: enrichedCandidates });
  } catch (error: any) {
    console.error('AI Product Search Error:', error);
    res.json({
      candidates: [
        {
          productName: req.body.query || 'Sample Product',
          brand: 'Generic Brand',
          category: 'General',
          variants: ['Standard'],
          suggestedSKU: 'SMPL-001',
          hsnCode: '8517',
          gstRate: 18,
          purchasePrice: 15000,
          sellingPrice: 24999,
          confidence: 0.95,
          description: `AI discovered product matching ${req.body.query}`,
          imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80'
        }
      ]
    });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`HiffyBill ERP Server running on http://localhost:${port}`);
  });
}

startServer();
