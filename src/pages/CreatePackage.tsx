import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Mail, UserPlus, FileText, Settings, GripVertical, Plus, Trash2, Shield } from 'lucide-react';

interface Party {
  id: string;
  email: string;
  role: 'Initiator' | 'Party' | 'Viewer';
}

interface ContractField {
  id: string;
  type: 'text' | 'signature' | 'wallet';
  label: string;
  assignedTo?: string; // Party ID
}

const CreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 State: Parties
  const [parties, setParties] = useState<Party[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Initiator' | 'Party' | 'Viewer'>('Party');

  // Step 2 State: Contract Editor
  const [contractTitle, setContractTitle] = useState('');
  const [contractContent, setContractContent] = useState('');
  const [fields, setFields] = useState<ContractField[]>([]);

  // Step 3 State: Final Settings
  const [packageName, setPackageName] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [requirePassword, setRequirePassword] = useState(false);
  const [requireMobileVerification, setRequireMobileVerification] = useState(false);

  const handleAddParty = () => {
    if (newEmail && !parties.some(p => p.email === newEmail)) {
      setParties([...parties, { id: `p_${Date.now()}`, email: newEmail, role: newRole }]);
      setNewEmail('');
    }
  };

  const handleRemoveParty = (id: string) => {
    setParties(parties.filter(p => p.id !== id));
  };

  const handleAddField = (type: 'text' | 'signature' | 'wallet') => {
    const labels = {
      text: 'Text Input',
      signature: 'Signature',
      wallet: 'Wallet Address'
    };
    setFields([...fields, { id: `f_${Date.now()}`, type, label: labels[type] }]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleAssignField = (fieldId: string, partyId: string) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, assignedTo: partyId } : f));
  };

  const handleSubmit = () => {
    // In a real app, save the package to the backend
    navigate('/projects');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header & Stepper */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Contract Package</h1>
          <p className="text-sm text-gray-500 mt-1">Bundle contracts and invite parties to review and sign.</p>
        </div>
      </div>

      <div className="flex items-center justify-between relative mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-300`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        {[
          { num: 1, label: 'Invite Parties', icon: UserPlus },
          { num: 2, label: 'Contract Editor', icon: FileText },
          { num: 3, label: 'Final Settings', icon: Settings }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-white px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
              step >= s.num ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className={`text-sm font-medium ${step >= s.num ? 'text-indigo-900' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Invite Parties</h2>
              <p className="text-sm text-gray-500">Add people to this contract package and assign their roles.</p>
            </div>

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Initiator">Initiator</option>
                  <option value="Party">Party (Signer)</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <button 
                onClick={handleAddParty}
                disabled={!newEmail}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {parties.length > 0 && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parties.map(party => (
                      <tr key={party.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{party.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            party.role === 'Initiator' ? 'bg-purple-100 text-purple-800' :
                            party.role === 'Party' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {party.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleRemoveParty(party.id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex h-[600px]">
            {/* Editor Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Drag & Drop Fields</h3>
              <p className="text-xs text-gray-500">Click to add fields to the contract for parties to fill out.</p>
              
              <div className="space-y-2">
                <button onClick={() => handleAddField('signature')} className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all text-left">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><FileText className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-gray-700">Signature</span>
                </button>
                <button onClick={() => handleAddField('wallet')} className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all text-left">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><Settings className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-gray-700">Wallet Address</span>
                </button>
                <button onClick={() => handleAddField('text')} className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all text-left">
                  <div className="p-1.5 bg-gray-100 text-gray-600 rounded-md"><FileText className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-gray-700">Text Input</span>
                </button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 p-8 overflow-y-auto bg-gray-100">
              <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-xl p-8 min-h-full space-y-6">
                <input 
                  type="text" 
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  placeholder="Contract Title"
                  className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 p-0"
                />
                
                <textarea 
                  value={contractContent}
                  onChange={(e) => setContractContent(e.target.value)}
                  placeholder="Enter contract content, terms, and conditions here..."
                  className="w-full h-48 text-gray-700 placeholder-gray-400 border-none focus:ring-0 p-0 resize-none"
                />

                {fields.length > 0 && (
                  <div className="pt-8 border-t border-gray-100 space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Assigned Fields</h4>
                    {fields.map(field => (
                      <div key={field.id} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg group">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{field.label}</p>
                          <p className="text-xs text-gray-500 capitalize">{field.type} Field</p>
                        </div>
                        <div className="w-48">
                          <select 
                            value={field.assignedTo || ''}
                            onChange={(e) => handleAssignField(field.id, e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Assign to...</option>
                            {parties.filter(p => p.role === 'Party').map(p => (
                              <option key={p.id} value={p.id}>{p.email}</option>
                            ))}
                          </select>
                        </div>
                        <button onClick={() => handleRemoveField(field.id)} className="p-1.5 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Final Settings</h2>
              <p className="text-sm text-gray-500">Configure package details and security settings before sending.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Package Name</label>
                <input 
                  type="text" 
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g. Q4 Partnership Agreements"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Message (Optional)</label>
                <textarea 
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Add a personal note to the invitation email..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" /> Authentication Settings
              </h3>
              
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    checked={requirePassword}
                    onChange={(e) => setRequirePassword(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Require Access Password</p>
                  <p className="text-xs text-gray-500 mt-0.5">Parties must enter a password to view the documents.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    checked={requireMobileVerification}
                    onChange={(e) => setRequireMobileVerification(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Mobile Verification (SMS OTP)</p>
                  <p className="text-xs text-gray-500 mt-0.5">Require SMS verification before signing the contract.</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        {step < 3 ? (
          <button 
            onClick={() => setStep(Math.min(3, step + 1))}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={!packageName}
            className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Create Package & Send Invites
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatePackage;
