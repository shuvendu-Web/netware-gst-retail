import React, { useState } from 'react';
import { Bot, Sparkles, Send, User, Brain } from 'lucide-react';
import { ChatMessage } from '../types';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'model',
      content: "Hello! I am HiffyAI, your expert retail ERP and GST billing assistant. Ask me anything about today's sales, low stock alerts, inventory valuation, or customer outstanding payments.",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [highThinking, setHighThinking] = useState(false);
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What were today's total sales?",
    "Which products are running low on stock?",
    "Show GST collected this month",
    "Which customers have outstanding payments?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          highThinking,
          systemInstruction: "You are HiffyAI, the expert AI assistant for HiffyBill GST Billing & Retail ERP. You help business owners analyze sales, inventory, low stock, GST compliance, and product variants with high precision."
        })
      });
      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content: data.reply || "I have analyzed your request based on current ERP records.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'model',
        content: "Sorry, I encountered an error connecting to the AI engine. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">HiffyAI Intelligent Assistant</h2>
            <p className="text-xs text-slate-500 mt-0.5">Powered by Gemini 3.8 Flash & Gemini 4 Argon with High Thinking reasoning.</p>
          </div>
        </div>

        {/* High Thinking Toggle */}
        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
          <Brain className={`w-4 h-4 ${highThinking ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-bold text-slate-700">High Thinking Mode (Argon)</span>
          <input 
            type="checkbox"
            checked={highThinking}
            onChange={(e) => setHighThinking(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
            }`}>
              {m.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div className={`max-w-xl p-4 rounded-3xl text-xs leading-relaxed font-medium shadow-xs ${
              m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <p>{m.content}</p>
              <span className={`block text-[10px] mt-1 text-right opacity-60 ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-spin">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="p-4 bg-slate-100 rounded-3xl text-xs text-slate-500 font-medium">
              Thinking and analyzing ERP records...
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp)}
            className="px-3.5 py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-xs font-bold text-slate-700 transition-all shadow-xs"
          >
            ✨ {qp}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-3">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask HiffyAI anything about sales, inventory, GST or variants..."
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
