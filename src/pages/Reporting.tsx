import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, FileText, Calendar, Filter, Search, ExternalLink } from 'lucide-react';

const reportsData = [
  { id: 'REP-001', type: 'Settlement Statement', period: 'Oct 2023', contract: 'Alpha Collab', amount: '$9,500.00', txHash: '0x8f...2a1b', date: '2023-11-05' },
  { id: 'REP-002', type: 'Settlement Statement', period: 'Sep 2023', contract: 'Alpha Collab', amount: '$8,200.00', txHash: '0x3c...9d4e', date: '2023-10-05' },
  { id: 'REP-003', type: 'Annual Summary', period: '2023', contract: 'All Contracts', amount: '$45,890.00', txHash: '-', date: '2024-01-10' },
  { id: 'REP-004', type: 'Settlement Statement', period: 'Oct 2023', contract: 'Beta Distribution', amount: '$1,200.00', txHash: '0x1a...5b6c', date: '2023-11-06' },
];

const Reporting: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');

  const filteredReports = filter === 'All' 
    ? reportsData 
    : reportsData.filter(r => r.type.includes(filter));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporting & Compliance</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download official settlement statements and tax documents.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors">
            <Calendar className="w-4 h-4" />
            Generate Annual Summary
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Settlement Statement', 'Annual Summary'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === type 
                    ? 'bg-white text-indigo-700 shadow-sm border border-gray-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contract</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">On-chain Ref</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.type}</div>
                        <div className="text-xs text-gray-500">Generated: {report.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.contract}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {report.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.txHash !== '-' ? (
                      <a href="#" className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 font-mono text-xs">
                        {report.txHash} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
