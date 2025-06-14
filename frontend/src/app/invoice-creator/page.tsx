'use client';

import { useState, useEffect } from 'react';

// TypeScript interfaces
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  total: number;
}

interface ClientInfo {
  name: string;
  email: string;
  paymentTerms: string;
}

interface InvoiceData {
  client: ClientInfo;
  items: InvoiceItem[];
  discount: number;
  currency: string;
  notes: string;
}

const predefinedClients = {
  acme: { name: 'Acme Corporation', email: 'billing@acmecorp.com' },
  techstart: { name: 'TechStart Inc.', email: 'accounts@techstart.com' },
  globalcorp: { name: 'Global Corp Ltd.', email: 'finance@globalcorp.com' }
};

export default function InvoiceCreator() {
  const [activeMode, setActiveMode] = useState('express');
  const [selectedClient, setSelectedClient] = useState('');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    client: { name: '', email: '', paymentTerms: 'net30' },
    items: [{
      id: '1',
      description: 'Web Development Services',
      quantity: 40,
      rate: 125.00,
      taxRate: 0.10,
      total: 5500.00
    }],
    discount: 5,
    currency: 'USD',
    notes: 'Wire transfer to account ending in 4567'
  });

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.rate;
    const tax = subtotal * item.taxRate;
    return subtotal + tax;
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const totalTax = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate * item.taxRate), 0);
    const discountAmount = (subtotal + totalTax) * (invoiceData.discount / 100);
    const total = subtotal + totalTax - discountAmount;

    return { subtotal, totalTax, discountAmount, total };
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    if (clientId === 'new') {
      setInvoiceData(prev => ({
        ...prev,
        client: { name: '', email: '', paymentTerms: 'net30' }
      }));
    } else if (predefinedClients[clientId as keyof typeof predefinedClients]) {
      const client = predefinedClients[clientId as keyof typeof predefinedClients];
      setInvoiceData(prev => ({
        ...prev,
        client: { ...prev.client, name: client.name, email: client.email }
      }));
    }
  };

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      taxRate: 0,
      total: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          updatedItem.total = calculateItemTotal(updatedItem);
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const removeItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const addCommonItem = () => {
    const commonItems = [
      { desc: 'Consulting Services', qty: 1, rate: 150.00 },
      { desc: 'Web Development', qty: 1, rate: 125.00 },
      { desc: 'Design Services', qty: 1, rate: 100.00 },
      { desc: 'Project Management', qty: 1, rate: 85.00 }
    ];
    
    const item = commonItems[Math.floor(Math.random() * commonItems.length)];
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: item.desc,
      quantity: item.qty,
      rate: item.rate,
      taxRate: 0.10,
      total: item.qty * item.rate * 1.1
    };
    
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const quickAddClient = () => {
    const name = window.prompt('Client Company Name:');
    const email = window.prompt('Client Email:');
    
    if (name && email) {
      setInvoiceData(prev => ({
        ...prev,
        client: { ...prev.client, name, email }
      }));
    }
  };

  const { subtotal, totalTax, discountAmount, total } = calculateTotals();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 text-center mb-2 tracking-tight">
          Invoice Creator - Financial Institution Theme
        </h1>
        <p className="text-center text-slate-600 text-lg mb-12 font-medium">
          Bank-Grade Security • Lightning-Fast Generation • Professional Excellence
        </p>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid lg:grid-cols-[1fr_400px] min-h-[800px] animate-pulse-slow">
          {/* Security Header */}
          <div className="col-span-full bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">🔒</div>
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="text-xs opacity-90">
              All data transmitted securely • GDPR Compliant • SOC 2 Certified
            </div>
          </div>

          {/* Main Creation Area */}
          <div className="p-8 overflow-y-auto">
            {/* Quick Action Modes */}
            <div className="flex gap-4 mb-8">
              {[
                { key: 'express', label: '⚡ Express Invoice' },
                { key: 'template', label: '📋 From Template' },
                { key: 'recurring', label: '🔄 Recurring Setup' },
                { key: 'project', label: '📊 Project Billing' }
              ].map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setActiveMode(mode.key)}
                  className={`flex-1 p-4 rounded-lg border-2 font-semibold text-center transition-all duration-200 hover:transform hover:-translate-y-0.5 ${
                    activeMode === mode.key
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 text-blue-800'
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 text-slate-600 hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 hover:border-slate-400'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Client Information Section */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs">👤</span>
                  Client Information
                </h3>
                <button
                  onClick={quickAddClient}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 hover:transform hover:-translate-y-0.5"
                >
                  + Quick Add
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Select Client</label>
                  <select
                    value={selectedClient}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="p-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  >
                    <option value="">Choose existing client...</option>
                    <option value="acme">Acme Corporation</option>
                    <option value="techstart">TechStart Inc.</option>
                    <option value="globalcorp">Global Corp Ltd.</option>
                    <option value="new">+ Add New Client</option>
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={invoiceData.client.name}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      client: { ...prev.client, name: e.target.value }
                    }))}
                    placeholder="Enter company name"
                    className="p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={invoiceData.client.email}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      client: { ...prev.client, email: e.target.value }
                    }))}
                    placeholder="billing@company.com"
                    className="p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Payment Terms</label>
                  <select
                    value={invoiceData.client.paymentTerms}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      client: { ...prev.client, paymentTerms: e.target.value }
                    }))}
                    className="p-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  >
                    <option value="net15">Net 15 days</option>
                    <option value="net30">Net 30 days</option>
                    <option value="net60">Net 60 days</option>
                    <option value="immediate">Due immediately</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoice Items Section */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs">📋</span>
                  Invoice Items
                </h3>
                <button
                  onClick={addCommonItem}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 hover:transform hover:-translate-y-0.5"
                >
                  + Common Items
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr>
                      <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 text-sm border-b border-gray-200">Description</th>
                      <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 text-sm border-b border-gray-200">Qty</th>
                      <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 text-sm border-b border-gray-200">Rate</th>
                      <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 text-sm border-b border-gray-200">Tax</th>
                      <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 text-sm border-b border-gray-200">Total</th>
                      <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 text-sm border-b border-gray-200"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="p-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                            className="w-full border-none bg-transparent text-sm p-1 focus:outline-2 focus:outline-blue-500 focus:outline-offset-1 rounded"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            placeholder="1"
                            className="w-full border-none bg-transparent text-sm p-1 focus:outline-2 focus:outline-blue-500 focus:outline-offset-1 rounded"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="w-full border-none bg-transparent text-sm p-1 focus:outline-2 focus:outline-blue-500 focus:outline-offset-1 rounded"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={item.taxRate}
                            onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}
                            className="w-full border-none bg-transparent text-sm p-1 focus:outline-2 focus:outline-blue-500 focus:outline-offset-1 rounded cursor-pointer"
                          >
                            <option value={0}>No Tax</option>
                            <option value={0.10}>10% VAT</option>
                            <option value={0.20}>20% VAT</option>
                          </select>
                        </td>
                        <td className="p-3 text-sm">${calculateItemTotal(item).toFixed(2)}</td>
                        <td className="p-3">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr 
                      onClick={addNewItem}
                      className="bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                    >
                      <td colSpan={6} className="p-3 text-center text-slate-600 font-semibold">
                        + Click to add new item
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Adjustments Section */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs">💰</span>
                  Calculations & Adjustments
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    value={invoiceData.discount}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      discount: parseFloat(e.target.value) || 0
                    }))}
                    placeholder="0"
                    className="p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <select
                    value={invoiceData.currency}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      currency: e.target.value
                    }))}
                    className="p-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Payment Instructions</label>
                  <input
                    type="text"
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    placeholder="Bank transfer preferred"
                    className="p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div className="bg-slate-50 border-l border-slate-200 p-8 flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Live Preview</h3>
              <p className="text-sm text-slate-600">Updates automatically as you type</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8 flex-1 shadow-md">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">Your Company</h3>
                  <p className="text-sm text-slate-600">
                    123 Business Street<br />
                    City, State 12345<br />
                    (555) 123-4567
                  </p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div className="text-lg font-semibold text-slate-900">Invoice #2024-001</div>
                  <div>Date: January 15, 2024</div>
                  <div>Due: February 14, 2024</div>
                </div>
              </div>

              {/* Client Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Bill To:</h4>
                <div className="text-sm">
                  <strong>{invoiceData.client.name || 'Client Name'}</strong><br />
                  {invoiceData.client.email || 'client@email.com'}<br />
                  Payment Terms: {invoiceData.client.paymentTerms === 'net15' ? 'Net 15 days' : 
                                invoiceData.client.paymentTerms === 'net30' ? 'Net 30 days' :
                                invoiceData.client.paymentTerms === 'net60' ? 'Net 60 days' : 'Due immediately'}
                </div>
              </div>

              {/* Preview Table */}
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr>
                    <th className="p-2 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-100">Description</th>
                    <th className="p-2 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-100">Qty</th>
                    <th className="p-2 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-100">Rate</th>
                    <th className="p-2 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-100">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">${item.rate.toFixed(2)}</td>
                      <td className="p-2">${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Tax:</span>
                  <span>${totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Discount ({invoiceData.discount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg text-blue-800">
                  <span>Total Amount:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200">
                🚀 Generate & Send Instantly
              </button>
              <button className="w-full bg-white text-gray-700 border-2 border-gray-300 p-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                📄 Generate PDF Only
              </button>
              <button className="w-full bg-white text-gray-700 border-2 border-gray-300 p-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                💾 Save as Template
              </button>
              <button className="w-full bg-white text-gray-700 border-2 border-gray-300 p-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                ⏰ Schedule Delivery
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold mt-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Auto-saving every 30 seconds
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}