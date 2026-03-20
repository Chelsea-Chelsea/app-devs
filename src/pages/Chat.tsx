import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  PlusCircle, 
  FileText, 
  PieChart, 
  Users as UsersIcon, 
  Sparkles,
  ArrowRight,
  MessageSquare,
  History,
  Search,
  Zap,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Package,
  CreditCard,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: { label: string; icon: React.ReactNode; onClick: () => void; primary?: boolean }[];
  status?: 'success' | 'warning' | 'info';
  widget?: 'contract' | 'settlement' | 'package' | 'success';
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your GoSign X Agent. I can help you manage contracts, create contract packages, or execute settlements. What would you like to do today?",
      timestamp: new Date(),
      actions: [
        { label: 'Create New Contract', icon: <PlusCircle className="w-4 h-4" />, onClick: () => handleAction('contract') },
        { label: 'Create Contract Package', icon: <Package className="w-4 h-4" />, onClick: () => handleAction('package') },
        { label: 'Execute Settlement', icon: <CreditCard className="w-4 h-4" />, onClick: () => handleAction('settlement') },
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAction = (type: 'contract' | 'settlement' | 'package') => {
    setIsTyping(true);
    setTimeout(() => {
      let content = "";
      if (type === 'contract') content = "I've prepared a draft contract form for you. Please fill in the details below to generate the agreement.";
      if (type === 'settlement') content = "I've calculated the pending settlements. Please review the amounts and participants before execution.";
      if (type === 'package') content = "Let's bundle your contracts. Select the agreements you'd like to include in this new package.";

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        widget: type
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleWidgetSubmit = (type: string, data: any) => {
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Successfully processed your ${type} request! Everything is synced and secured.`,
        timestamp: new Date(),
        status: 'success',
        widget: 'success'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate Agentic Response
    setTimeout(() => {
      const response = getAgentResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions,
        status: response.status,
        widget: response.widget as any
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const getAgentResponse = (query: string): { content: string; actions?: any[]; status?: 'success' | 'warning' | 'info'; widget?: string } => {
    const q = query.toLowerCase();

    // Flow: Contract Package Creation
    if (q.includes('package') || (q.includes('create') && q.includes('contract'))) {
      if (q.includes('package')) {
        return {
          content: "I've initiated the 'Contract Package' creation flow. You can select the contracts to bundle right here.",
          widget: 'package',
          status: 'info'
        };
      }
      return {
        content: "I've opened the contract drafting tool for you. What type of agreement are we making today?",
        widget: 'contract'
      };
    }

    // Flow: Settlement Execution
    if (q.includes('settlement') || q.includes('pay') || q.includes('execute')) {
      return {
        content: "I've analyzed the current billing cycle. Ready to execute the following settlements?",
        widget: 'settlement',
        status: 'warning'
      };
    }

    // Flow: Revenue Analysis
    if (q.includes('revenue') || q.includes('money') || q.includes('earn') || q.includes('report')) {
      return {
        content: "Your total revenue for Q1 2026 is $42,150, which is 15% higher than the previous quarter. The 'Beta Mobile' project is the primary driver. Would you like a detailed breakdown by project?",
        actions: [
          { label: 'View Revenue Dashboard', icon: <PieChart className="w-4 h-4" />, onClick: () => navigate('/revenue') },
          { label: 'Download Q1 Report', icon: <FileText className="w-4 h-4" />, onClick: () => navigate('/reporting') }
        ],
        status: 'success'
      };
    }

    // Flow: Participants
    if (q.includes('participant') || q.includes('user') || q.includes('member')) {
      return {
        content: "You have 12 active participants across 4 projects. 2 participants have pending document signatures. Should I send them a reminder notification?",
        actions: [
          { label: 'Send Reminders', icon: <Bell className="w-4 h-4" />, onClick: () => console.log('Reminders sent') },
          { label: 'Manage Users', icon: <UsersIcon className="w-4 h-4" />, onClick: () => {} }
        ]
      };
    }

    return {
      content: "I'm your GoSign X intelligent assistant. I can automate your contract workflows, manage settlements, and provide real-time financial insights. What can I help you with right now?",
      actions: [
        { label: 'New Project', icon: <Zap className="w-4 h-4" />, onClick: () => handleAction('package') },
        { label: 'System Audit', icon: <ShieldCheck className="w-4 h-4" />, onClick: () => {} }
      ]
    };
  };

  // Widget Components
  const ContractWidget = () => (
    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Contract Title</label>
        <input type="text" placeholder="e.g. Alpha Partnership Agreement" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Counterparty</label>
          <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
            <option>Select User...</option>
            <option>Alice Johnson</option>
            <option>Bob Smith</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Template</label>
          <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
            <option>Standard Service</option>
            <option>NDA</option>
          </select>
        </div>
      </div>
      <button 
        onClick={() => handleWidgetSubmit('contract', {})}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
      >
        Generate & Send for Signature
      </button>
    </div>
  );

  const SettlementWidget = () => (
    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
      <div className="space-y-2">
        {[
          { name: 'Alice Johnson', amount: '$2,450', status: 'Verified' },
          { name: 'Bob Smith', amount: '$1,200', status: 'Verified' },
          { name: 'Charlie Davis', amount: '$4,770', status: 'Verified' },
        ].map((s, i) => (
          <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold">
                {s.name[0]}
              </div>
              <span className="text-xs font-medium text-gray-700">{s.name}</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{s.amount}</p>
              <p className="text-[10px] text-emerald-500 font-medium">{s.status}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xs text-gray-500">Total Settlement</span>
        <span className="text-sm font-bold text-indigo-600">$8,420.00</span>
      </div>
      <button 
        onClick={() => handleWidgetSubmit('settlement', {})}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
      >
        <Wallet className="w-4 h-4" /> Execute All Payments
      </button>
    </div>
  );

  const PackageWidget = () => (
    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase">Select Contracts to Bundle</p>
      <div className="space-y-2">
        {['Master Service Agreement', 'NDA - Project Alpha', 'IP Assignment', 'Revenue Share Terms'].map((c, i) => (
          <label key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 cursor-pointer hover:border-indigo-300 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-xs text-gray-700">{c}</span>
          </label>
        ))}
      </div>
      <button 
        onClick={() => handleWidgetSubmit('package', {})}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
      >
        Create Package
      </button>
    </div>
  );

  const SuccessWidget = () => (
    <div className="mt-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-emerald-900">Process Complete</p>
        <p className="text-xs text-emerald-700">All actions have been recorded on the blockchain.</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Sidebar - History */}
      <div className="w-72 border-r border-gray-100 bg-gray-50/50 hidden lg:flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Sessions</div>
          {[
            { title: 'Contract Package: Alpha', time: '2h ago', icon: <Package className="w-4 h-4" /> },
            { title: 'Settlement Execution', time: 'Yesterday', icon: <Wallet className="w-4 h-4" /> },
            { title: 'Revenue Analysis Q1', time: 'Mar 15', icon: <PieChart className="w-4 h-4" /> },
            { title: 'New Project Setup', time: 'Mar 12', icon: <Zap className="w-4 h-4" /> },
          ].map((chat, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all group text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {chat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{chat.title}</p>
                <p className="text-[10px] text-gray-400">{chat.time}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setMessages([messages[0]])}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> New Session
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">GoSign X Agent</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Active & Ready</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              <History className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'assistant' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                    msg.role === 'assistant'
                      ? 'bg-white border border-gray-100 text-gray-700'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {msg.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute -left-6 top-3" />}
                    {msg.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 absolute -left-6 top-3" />}
                    {msg.content}

                    {msg.widget === 'contract' && <ContractWidget />}
                    {msg.widget === 'settlement' && <SettlementWidget />}
                    {msg.widget === 'package' && <PackageWidget />}
                    {msg.widget === 'success' && <SuccessWidget />}
                  </div>
                  
                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={action.onClick}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm border ${
                            action.primary 
                              ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          {action.icon}
                          {action.label}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-2xl flex gap-1 items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
              {[
                'Create contract package', 
                'Execute settlements', 
                'Check Q1 revenue', 
                'Remind participants'
              ].map((hint, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(hint)}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-medium text-gray-500 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all whitespace-nowrap"
                >
                  {hint}
                </button>
              ))}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me to create a package or execute settlements..."
                className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> GoSign X Agent uses secure end-to-end encryption for all interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


