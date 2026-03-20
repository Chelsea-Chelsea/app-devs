import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Filter, Search, FileEdit, Eye, Users, History, CheckCircle2, Clock, FileText, ChevronDown, ChevronUp, Mail, AlertCircle, Edit2, Check, Settings, X, Send, UserPlus, ArrowLeft } from 'lucide-react';

const contractsData = [
  { 
    id: 'ODL-001', 
    title: 'Alpha Collab Agreement', 
    status: 'Executed', 
    date: '2023-10-25', 
    roles: ['Initiator', 'Party A'], 
    nft: 'Minted',
    stage: 'Completed',
    parties: [
      { id: 'p1', name: 'Alice (You)', roles: ['Initiator', 'Party A'], email: 'alice@example.com', status: 'Signed', viewedAt: 'Oct 24, 2023, 10:15 AM', signedAt: 'Oct 25, 2023, 04:45 PM' },
      { id: 'p2', name: 'Bob', roles: ['Party B', 'Legal Reviewer'], email: 'bob@example.com', status: 'Signed', viewedAt: 'Oct 24, 2023, 11:00 AM', signedAt: 'Oct 24, 2023, 02:30 PM' },
      { id: 'p3', name: 'Charlie', roles: ['Party C'], email: 'charlie@example.com', status: 'Signed', viewedAt: 'Oct 25, 2023, 09:00 AM', signedAt: 'Oct 25, 2023, 11:15 AM' }
    ]
  },
  { 
    id: 'ODL-002', 
    title: 'Beta Distribution License', 
    status: 'Signed', 
    date: '2023-11-02', 
    roles: ['Party'], 
    nft: 'Pending',
    stage: 'Awaiting NFT Mint',
    parties: [
      { id: 'p4', name: 'David', roles: ['Initiator'], email: 'david@example.com', status: 'Signed', viewedAt: 'Nov 01, 2023, 09:00 AM', signedAt: 'Nov 01, 2023, 10:00 AM' },
      { id: 'p5', name: 'Alice (You)', roles: ['Party B'], email: 'alice@example.com', status: 'Signed', viewedAt: 'Nov 02, 2023, 01:15 PM', signedAt: 'Nov 02, 2023, 01:30 PM' }
    ]
  },
  { 
    id: 'ODL-003', 
    title: 'Gamma Revenue Share', 
    status: 'Review', 
    date: '2023-11-15', 
    roles: ['Initiator'], 
    nft: '-',
    stage: 'Pending Signatures',
    parties: [
      { id: 'p6', name: 'Alice (You)', roles: ['Initiator'], email: 'alice@example.com', status: 'Signed', viewedAt: 'Nov 15, 2023, 08:00 AM', signedAt: 'Nov 15, 2023, 08:30 AM' },
      { id: 'p7', name: 'Eve', roles: ['Party B'], email: 'eve@example.com', status: 'Reviewing', viewedAt: 'Nov 15, 2023, 02:00 PM', signedAt: null },
      { id: 'p8', name: 'Frank', roles: ['Party C', 'Financial Auditor'], email: 'frank@example.com', status: 'Invite Sent', viewedAt: null, signedAt: null },
      { id: 'p9', name: 'Grace', roles: ['Party D'], email: 'grace@example.com', status: 'Invite Sent', viewedAt: null, signedAt: null }
    ]
  },
  { 
    id: 'ODL-004', 
    title: 'Delta IP Licensing', 
    status: 'Draft', 
    date: '2023-11-20', 
    roles: ['Initiator'], 
    nft: '-',
    stage: 'Drafting',
    parties: [
      { id: 'p10', name: 'Alice (You)', roles: ['Initiator'], email: 'alice@example.com', status: 'Drafting', viewedAt: null, signedAt: null },
      { id: 'p11', name: 'Henry', roles: ['Party B'], email: 'henry@example.com', status: 'Not Invited Yet', viewedAt: null, signedAt: null }
    ]
  },
];

const ProjectDetails: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Alpha Collaboration Project');
  const [projectDescription, setProjectDescription] = useState('This project handles all revenue sharing and licensing agreements for the Alpha product line.');

  // Modal State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [editingParties, setEditingParties] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const contractId = searchParams.get('contractId');
    if (contractId) {
      setExpandedId(contractId);
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredContracts = filter === 'All' 
    ? contractsData 
    : contractsData.filter(c => c.status === filter);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openManageModal = (contract: any) => {
    setSelectedContract(contract);
    setEditingParties([...contract.parties]);
    setIsManageModalOpen(true);
  };

  const handlePartyChange = (index: number, field: string, value: any) => {
    const newParties = [...editingParties];
    newParties[index] = { ...newParties[index], [field]: value };
    setEditingParties(newParties);
  };

  const toggleRole = (partyIndex: number, role: string) => {
    const party = editingParties[partyIndex];
    const currentRoles = party.roles || [];
    let newRoles;
    if (currentRoles.includes(role)) {
      newRoles = currentRoles.filter((r: string) => r !== role);
    } else {
      newRoles = [...currentRoles, role];
    }
    handlePartyChange(partyIndex, 'roles', newRoles);
  };

  const addViewer = () => {
    setEditingParties([
      ...editingParties,
      { id: `new-${Date.now()}`, name: '', roles: ['Viewer'], email: '', status: 'Not Invited Yet', date: '-' }
    ]);
  };

  const removeParty = (index: number) => {
    const newParties = [...editingParties];
    newParties.splice(index, 1);
    setEditingParties(newParties);
  };

  const saveParties = () => {
    // In a real app, this would make an API call.
    // Also trigger re-sign notification logic if contract is already in progress.
    setIsManageModalOpen(false);
    showToast('Parties updated successfully. Notifications sent if re-signing is required.');
  };

  const sendReminder = (email: string) => {
    showToast(`Reminder sent to ${email}`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Signed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Reviewing': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Invite Sent': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Signed': return <CheckCircle2 className="w-4 h-4" />;
      case 'Reviewing': return <Eye className="w-4 h-4" />;
      case 'Invite Sent': return <Mail className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Project Header */}
      <div className="mb-4">
        <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center gap-2 text-sm font-medium text-gray-600">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 w-full max-w-md">
                  <input 
                    type="text" 
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent w-full"
                    autoFocus
                  />
                  <button onClick={() => setIsEditingTitle(false)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100">
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 group">
                  <h1 className="text-2xl font-bold text-gray-900">{projectTitle}</h1>
                  <button onClick={() => setIsEditingTitle(true)} className="p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 max-w-2xl">{projectDescription}</p>
          </div>
          <Link to={`/projects/${id}/contracts/create`} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create Contract
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Draft', 'Review', 'Signed', 'Executed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === status 
                    ? 'bg-white text-indigo-700 shadow-sm border border-gray-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contract Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">NFT Mint</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <React.Fragment key={contract.id}>
                  <tr 
                    className={`hover:bg-gray-50 transition-colors group cursor-pointer ${expandedId === contract.id ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => toggleExpand(contract.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {contract.title}
                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{contract.stage}</span>
                          </div>
                          <div className="text-xs text-gray-500">{contract.id} • {contract.parties.length} Parties</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full border
                        ${contract.status === 'Executed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          contract.status === 'Signed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          contract.status === 'Review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {contract.status === 'Executed' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                        {contract.status === 'Review' && <Clock className="w-3.5 h-3.5 mr-1" />}
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {contract.roles.map((role, rIdx) => (
                          <span key={rIdx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{role}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.nft === 'Minted' ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Minted</span>
                      ) : contract.nft === 'Pending' ? (
                        <span className="text-amber-600 flex items-center gap-1"><Clock className="w-4 h-4"/> Pending</span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="View Details">
                          {expandedId === contract.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Accordion Content */}
                  {expandedId === contract.id && (
                    <tr>
                      <td colSpan={6} className="px-0 py-0 bg-gray-50/50 border-b border-gray-200">
                        <div className="px-16 py-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            Participants & Status
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {contract.parties.map((party, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{party.name}</p>
                                    <p className="text-xs text-gray-500">{party.email}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {party.roles.map((role, rIdx) => (
                                      <span key={rIdx} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {role}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(party.status)}`}>
                                      {getStatusIcon(party.status)}
                                      {party.status}
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex justify-between text-[10px] text-gray-500">
                                      <span>Viewed:</span>
                                      <span className={party.viewedAt ? 'text-gray-700' : ''}>{party.viewedAt || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500">
                                      <span>Signed:</span>
                                      <span className={party.signedAt ? 'text-emerald-600 font-medium' : ''}>{party.signedAt || '-'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 flex justify-end gap-3">
                            {(contract.roles.includes('Initiator') || contract.roles.includes('Party')) && (
                              <>
                                <button 
                                  onClick={() => openManageModal(contract)}
                                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                  <Users className="w-4 h-4" /> Manage Parties
                                </button>
                                {contract.roles.includes('Initiator') && contract.status !== 'Executed' && (
                                  <Link 
                                    to={`/projects/${id}/contracts/create?edit=${contract.id}`}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <FileEdit className="w-4 h-4" /> Edit Contract
                                  </Link>
                                )}
                              </>
                            )}
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <History className="w-4 h-4" /> View History
                            </button>
                            {contract.status !== 'Executed' ? (
                              <Link to={`/projects/${id}/contracts/review/${contract.id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                <Eye className="w-4 h-4" /> Review & Sign
                              </Link>
                            ) : (
                              <Link to={`/projects/${id}/contracts/review/${contract.id}`} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2">
                                <FileText className="w-4 h-4" /> View Contract
                              </Link>
                            )}
                          </div>
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

      {/* Manage Parties Modal */}
      {isManageModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Manage Parties & Viewers</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedContract.title}</p>
              </div>
              <button onClick={() => setIsManageModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Important Notice</p>
                  <p>Modifying parties or viewers for an in-progress contract will require all previously signed members to review and re-sign the document. Notifications will be sent automatically.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Current Participants</h3>
                  <button onClick={addViewer} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    <UserPlus className="w-4 h-4" /> Add Members
                  </button>
                </div>
                
                {editingParties.map((party, index) => {
                  const isUserInitiator = selectedContract.roles.includes('Initiator');
                  const isUserParty = selectedContract.roles.includes('Party');
                  const isRestricted = !isUserInitiator && isUserParty;
                  
                  // A restricted user (Party) can only edit/remove if the participant ONLY has the 'Viewer' role
                  const isOnlyViewer = party.roles.length === 1 && party.roles[0] === 'Viewer';
                  const canEditInfo = !party.roles.includes('Initiator') && (!isRestricted || isOnlyViewer);
                  const canRemove = !party.roles.includes('Initiator') && (!isRestricted || isOnlyViewer);

                  return (
                    <div key={party.id || index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                          <input 
                            type="text" 
                            value={party.name} 
                            onChange={(e) => handlePartyChange(index, 'name', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="Participant Name"
                            disabled={!canEditInfo}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                          <input 
                            type="email" 
                            value={party.email} 
                            onChange={(e) => handlePartyChange(index, 'email', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="email@example.com"
                            disabled={!canEditInfo}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-2">Roles</label>
                          <div className="flex flex-wrap gap-3">
                            {['Initiator', 'Party', 'Viewer'].map((role) => {
                              const isSelected = party.roles.includes(role);
                              const isInitiatorRole = role === 'Initiator';
                              const isAnyOtherInitiator = editingParties.some((p, i) => i !== index && p.roles.includes('Initiator'));
                              
                              // Disable logic:
                              // 1. Cannot remove 'Initiator' role if already assigned
                              // 2. Cannot add 'Initiator' role if another initiator exists
                              // 3. Restricted users (Party) can only toggle 'Viewer'
                              const isDisabled = (isInitiatorRole && (party.roles.includes('Initiator') || isAnyOtherInitiator)) || 
                                               (isRestricted && role !== 'Viewer');
                              
                              return (
                                <button
                                  key={role}
                                  onClick={() => toggleRole(index, role)}
                                  disabled={isDisabled}
                                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-2 ${
                                    isSelected 
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                  } ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                  {role}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-end pb-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(party.status)}`}>
                            {getStatusIcon(party.status)}
                            {party.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-6">
                        {party.status !== 'Signed' && party.status !== 'Not Invited Yet' && party.email && (
                          <button 
                            onClick={() => sendReminder(party.email)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Send Reminder Email"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {canRemove && (
                          <button 
                            onClick={() => removeParty(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove Participant"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsManageModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveParties}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
