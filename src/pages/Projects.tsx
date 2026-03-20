import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Search, Folder, ChevronDown, ChevronUp, Users, Clock, FileText } from 'lucide-react';

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const projectsData = [
  {
    id: 'proj-004',
    title: 'Epsilon Vendor Agreement',
    description: 'New vendor onboarding and service level agreement requiring your immediate review.',
    lastChanged: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    roles: ['Party'],
    contracts: [
      { 
        id: 'ODL-005', 
        title: 'Epsilon SLA & Terms', 
        status: 'Review', 
        roles: ['Party'],
        viewedAt: null,
        signedAt: null,
        actionRequired: true
      }
    ]
  },
  {
    id: 'proj-001',
    title: 'Alpha Collaboration Project',
    description: 'This project handles all revenue sharing and licensing agreements for the Alpha product line.',
    lastChanged: '2023-11-20T14:30:00Z',
    roles: ['Initiator', 'Party A'],
    contracts: [
      { 
        id: 'ODL-001', 
        title: 'Alpha Collab Agreement', 
        status: 'Executed',
        roles: ['Initiator', 'Party A'],
        viewedAt: '2023-10-24T10:15:00Z',
        signedAt: '2023-10-25T16:45:00Z',
        actionRequired: false
      },
      { 
        id: 'ODL-002', 
        title: 'Beta Distribution License', 
        status: 'Signed',
        roles: ['Party B'],
        viewedAt: '2023-11-01T09:00:00Z',
        signedAt: '2023-11-02T11:20:00Z',
        actionRequired: false
      }
    ]
  },
  {
    id: 'proj-002',
    title: 'Gamma IP Licensing',
    description: 'Licensing agreements and revenue share for Gamma intellectual property.',
    lastChanged: '2023-11-15T09:00:00Z',
    roles: ['Viewer'],
    contracts: [
      { 
        id: 'ODL-003', 
        title: 'Gamma Revenue Share', 
        status: 'Review',
        roles: ['Viewer'],
        viewedAt: '2023-11-16T11:30:00Z',
        signedAt: null,
        actionRequired: false
      }
    ]
  },
  {
    id: 'proj-003',
    title: 'Delta Internal Operations',
    description: 'Internal operational contracts and NDAs.',
    lastChanged: '2023-10-05T16:20:00Z',
    roles: ['Initiator'],
    contracts: [
      { 
        id: 'ODL-004', 
        title: 'Delta IP Licensing', 
        status: 'Draft',
        roles: ['Initiator'],
        viewedAt: '2023-10-05T16:20:00Z',
        signedAt: null,
        actionRequired: false
      }
    ]
  }
];

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredProjects = projectsData.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.projects')}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your projects and their associated contracts.</p>
        </div>
        <Link to="/projects/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors">
          <Plus className="w-4 h-4" />
          {t('action.createProject')}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('project.title')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Modified</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('project.role')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('project.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <React.Fragment key={project.id}>
                  <tr 
                    className={`hover:bg-gray-50 transition-colors group cursor-pointer ${expandedId === project.id ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => toggleExpand(project.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                          <Folder className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {project.title}
                            {project.contracts.some(c => c.actionRequired) && (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 max-w-md truncate">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                        {formatDate(project.lastChanged)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1.5 flex-wrap">
                        {project.roles.map((role, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="View Contracts">
                          {expandedId === project.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Accordion Content: Contracts List */}
                  {expandedId === project.id && (
                    <tr>
                      <td colSpan={4} className="px-0 py-0 bg-gray-50/50 border-b border-gray-200">
                        <div className="px-16 py-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              Contracts in this Project
                            </h4>
                            <Link to={`/projects/${project.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                              Go to Project Details &rarr;
                            </Link>
                          </div>
                          
                          {project.contracts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {project.contracts.map((contract) => (
                                <div 
                                  key={contract.id} 
                                  onClick={() => navigate(`/projects/${project.id}?contractId=${contract.id}`)}
                                  className={`bg-white p-4 rounded-lg border shadow-sm flex flex-col gap-2 cursor-pointer transition-all group relative overflow-hidden
                                    ${contract.actionRequired ? 'border-indigo-400 ring-1 ring-indigo-400 shadow-md' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
                                >
                                  {contract.actionRequired && (
                                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10">
                                      ACTION REQUIRED
                                    </div>
                                  )}
                                  <div className="flex justify-between items-start mt-1">
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors pr-16">{contract.title}</p>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0
                                      ${contract.status === 'Executed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                        contract.status === 'Signed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                        contract.status === 'Review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                        'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                      {contract.status}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-500">{contract.id}</p>
                                    <div className="flex gap-1 flex-wrap justify-end">
                                      {contract.roles?.map((r, i) => (
                                        <span key={i} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                          {r}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {contract.actionRequired && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}/contracts/review/${contract.id}`); }}
                                      className="mt-2 w-full py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
                                    >
                                      Review & Sign Now
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic bg-white p-4 rounded-lg border border-gray-200 border-dashed">
                              No contracts found in this project.
                            </div>
                          )}
                          
                          {!project.roles.includes('Viewer') || project.roles.length > 1 ? (
                            <div className="mt-4">
                              <Link to={`/projects/${project.id}/contracts/create`} className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Add New Contract
                              </Link>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
