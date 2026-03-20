import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowUpRight, TrendingUp, FileText, CheckCircle, Plus, UploadCloud, Link as LinkIcon, PenTool, DollarSign, Sparkles, Send, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 8000 },
  { name: 'Jul', revenue: 10000 },
];

const contractData = [
  { id: 'ODL-001', project: 'Alpha Collab', type: 'Revenue Share', status: 'Minted', parties: 3, revenue: '$4,500', share: '50%', claimable: '$2,250' },
  { id: 'ODL-002', project: 'Beta Distribution', type: 'Royalty', status: 'Pending', pendingDetail: '(Waiting for Party A Sign)', parties: 2, revenue: '$1,200', share: '30%', claimable: '$360' },
  { id: 'ODL-003', project: 'Gamma Licensing', type: 'Revenue Share', status: 'Draft', parties: 4, revenue: '-', share: '20%', claimable: '-' },
];

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nusdcPrice, setNusdcPrice] = useState('1.00');
  const [prompt, setPrompt] = useState('');
  const [isPromptFocused, setIsPromptFocused] = useState(false);

  const suggestedPrompts = [
    { key: 'main.suggested.revenue', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'main.suggested.contract', icon: <FileText className="w-4 h-4" /> },
    { key: 'main.suggested.execute', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // Simulate fetching price
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate around 1.00
      const newPrice = (1.00 + (Math.random() * 0.002 - 0.001)).toFixed(4);
      setNusdcPrice(newPrice);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 relative pb-20">
      {/* AI Main Hero Section */}
      <section className="relative py-12 px-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {t('main.welcome').replace('{name}', user?.name || 'Guest')}
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              How can I assist you with your contracts and settlements today?
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`relative group transition-all duration-300 ${isPromptFocused ? 'scale-[1.02]' : ''}`}
          >
            <div className={`absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl transition-opacity duration-300 ${isPromptFocused ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative flex items-center bg-white border-2 rounded-2xl p-2 shadow-sm transition-all duration-300 ${isPromptFocused ? 'border-indigo-500 shadow-indigo-100 shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="flex-1 flex items-center px-4">
                <Sparkles className={`w-5 h-5 mr-3 transition-colors duration-300 ${isPromptFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsPromptFocused(true)}
                  onBlur={() => setIsPromptFocused(false)}
                  placeholder={t('main.promptPlaceholder')}
                  className="w-full py-3 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-lg"
                />
              </div>
              <button 
                className={`p-3 rounded-xl transition-all duration-300 ${prompt.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-400'}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(t(p.key))}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-full text-sm font-medium text-gray-600 hover:text-indigo-600 transition-all duration-200"
              >
                {p.icon}
                {t(p.key)}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contracts to Sign Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">Action Required: 1 Contract Pending Your Signature</h3>
            <p className="text-xs text-amber-700 mt-0.5">"Master Collaboration Agreement - Project X" requires your signature to proceed.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/contracts/sign/123')}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          Review & Sign
        </button>
      </div>

      {/* Hero Area (KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-indigo-600 rounded-xl shadow-sm p-6 flex flex-col text-white">
          <h3 className="text-sm font-medium text-indigo-100">{t('hero.claimable')}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">$12,426</span>
            <span className="text-sm font-medium text-emerald-300 flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8%
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-1">vs Last Period</p>
          <button 
            onClick={() => navigate('/revenue')}
            className="mt-4 w-full bg-white text-indigo-600 py-2 px-4 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
          >
            {t('action.claim')}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('hero.total')}</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">$45,890</div>
            <p className="text-xs text-gray-400 mt-1">Includes uncliamed assets</p>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500 gap-2">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> USDC: 40%</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> USDT: 60%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('hero.active')}</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-400 mt-1">ODL Contracts</p>
          </div>
          <div 
            onClick={() => navigate('/contracts')}
            className="mt-4 flex items-center text-sm text-indigo-600 font-medium cursor-pointer hover:text-indigo-800"
          >
            View all contracts <ArrowUpRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-16 h-16" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Current Market Price</h3>
            <div className="mt-4 space-y-3 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">nUSDC</span>
                <span className="font-mono font-bold text-indigo-600">${nusdcPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">alxUSDC</span>
                <span className="font-mono font-bold text-emerald-600">$1.0000</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Powered by CoinMarketCap</p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.trend')}</h2>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option>All Contracts</option>
              <option>Alpha Collab</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.insights')}</h2>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-900">3 Pending Signatures</h4>
                  <p className="text-xs text-amber-700 mt-1">You have contracts waiting for your review and signature.</p>
                  <button 
                    onClick={() => navigate('/contracts/sign/123')}
                    className="mt-2 text-xs font-medium text-amber-800 hover:text-amber-900 underline"
                  >
                    Review Now
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">Revenue Milestone</h4>
                  <p className="text-xs text-indigo-700 mt-1">Alpha Collab just crossed $10k in total revenue.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.performance')}</h2>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parties</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Share</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimable</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contractData.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.project}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit
                        ${contract.status === 'Minted' ? 'bg-green-100 text-green-800' : 
                          contract.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {contract.status === 'Minted' ? t('status.minted') : 
                         contract.status === 'Pending' ? t('status.pending') : t('status.draft')}
                      </span>
                      {contract.pendingDetail && (
                        <span className="text-[10px] text-amber-600 mt-1">{contract.pendingDetail}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.parties}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.share}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">{contract.claimable}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.status === 'Minted' ? (
                      <a href="#" className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" /> PDF
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Settlement History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Settlement History (My Projects)</h2>
          <Link to="/settlement" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, 10:24 AM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Alpha Collab</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Round 4</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$1,500.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 25, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Alpha Collab</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Round 3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$1,250.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 10, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Beta Distribution</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Q3 Royalties</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$4,200.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Floating CTA */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <button 
          onClick={() => navigate('/settlement')}
          className="bg-white text-gray-700 shadow-lg border border-gray-200 rounded-full p-4 flex items-center justify-center hover:bg-gray-50 transition-colors group relative"
        >
          <UploadCloud className="w-6 h-6" />
          <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {t('action.distribute')}
          </span>
        </button>
        <Link to="/contracts/create" className="bg-indigo-600 text-white shadow-lg shadow-indigo-200 rounded-full p-4 flex items-center justify-center hover:bg-indigo-700 transition-colors group relative">
          <Plus className="w-6 h-6" />
          <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {t('action.create')}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
