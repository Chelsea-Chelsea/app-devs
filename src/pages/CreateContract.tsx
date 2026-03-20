import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, FileText, Upload, GripVertical, Settings, 
  Trash2, Plus, X, ChevronDown, ChevronUp, CheckCircle2,
  LayoutTemplate, Users, Edit3, Send, PenTool, Type, 
  AlignLeft, Wallet, Lock, Smartphone, Mail, Check
} from 'lucide-react';

interface ContractDoc {
  id: string;
  title: string;
  type: 'template' | 'custom';
  isSettlementRelated: boolean;
  expanded: boolean;
  advancedSettings?: {
    requireSignature: boolean;
    autoRenew: boolean;
  };
}

interface Participant {
  id: string;
  roleType: 'initiator' | 'party' | 'viewer';
  customRoleName: string;
  name: string;
  email: string;
  color: string;
}

interface DocumentField {
  id: string;
  type: 'signature' | 'wallet' | 'text' | 'textarea';
  x: number;
  y: number;
  width: number;
  height: number;
  participantId: string;
  value?: string;
}

const colors = [
  'border-blue-500 bg-blue-50 text-blue-700',
  'border-green-500 bg-green-50 text-green-700',
  'border-purple-500 bg-purple-50 text-purple-700',
  'border-orange-500 bg-orange-50 text-orange-700',
  'border-pink-500 bg-pink-50 text-pink-700'
];

const CreateContract: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  
  const [step, setStep] = useState(1);

  // Step 1: Documents State
  const [documents, setDocuments] = useState<ContractDoc[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Step 2: Participants State
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', roleType: 'initiator', customRoleName: 'Party A (Initiator)', name: '', email: '', color: colors[0] },
    { id: '2', roleType: 'party', customRoleName: 'Party B', name: '', email: '', color: colors[1] }
  ]);

  // Step 3: Editor State
  const [fields, setFields] = useState<DocumentField[]>([]);
  const [activeParticipantId, setActiveParticipantId] = useState('1');
  const [draggingField, setDraggingField] = useState<{ id: string, startX: number, startY: number, initialX: number, initialY: number } | null>(null);

  // Step 4: Final Settings State
  const [finalSettings, setFinalSettings] = useState({
    packageName: 'New Contract Package',
    message: '',
    requirePassword: true,
    password: '',
    requireMobileAuth: false
  });

  const availableTemplates = [
    { id: 't1', name: 'Master Collaboration Agreement', category: 'Partnership' },
    { id: 't2', name: 'Non-Disclosure Agreement (NDA)', category: 'Legal' },
    { id: 't3', name: 'Revenue Share Agreement', category: 'Finance' },
    { id: 't4', name: 'IP Licensing Agreement', category: 'Legal' },
  ];

  const steps = [
    { num: 1, label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { num: 2, label: 'Participants', icon: <Users className="w-4 h-4" /> },
    { num: 3, label: 'Edit Fields', icon: <Edit3 className="w-4 h-4" /> },
    { num: 4, label: 'Settings & Send', icon: <Settings className="w-4 h-4" /> }
  ];

  // --- Step 1 Handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newDocs = [...documents];
    const draggedItem = newDocs[draggedIndex];
    newDocs.splice(draggedIndex, 1);
    newDocs.splice(index, 0, draggedItem);
    setDocuments(newDocs);
    setDraggedIndex(null);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const handleSelectTemplate = (templateName: string) => {
    const newDoc: ContractDoc = {
      id: Date.now().toString(),
      title: templateName,
      type: 'template',
      isSettlementRelated: templateName.includes('Revenue') || templateName.includes('Finance'),
      expanded: false,
      advancedSettings: { requireSignature: true, autoRenew: false }
    };
    setDocuments([...documents, newDoc]);
    setShowTemplateModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newDoc: ContractDoc = {
        id: Date.now().toString(),
        title: e.target.files[0].name,
        type: 'custom',
        isSettlementRelated: false,
        expanded: false,
        advancedSettings: { requireSignature: true, autoRenew: false }
      };
      setDocuments([...documents, newDoc]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeDocument = (id: string) => setDocuments(documents.filter(d => d.id !== id));
  const toggleExpand = (id: string) => setDocuments(documents.map(d => d.id === id ? { ...d, expanded: !d.expanded } : d));
  const toggleSettlement = (id: string) => setDocuments(documents.map(d => d.id === id ? { ...d, isSettlementRelated: !d.isSettlementRelated } : d));

  // --- Step 2 Handlers ---
  const handleAddParticipant = () => {
    if (participants.length >= 5) return;
    const newColor = colors[participants.length];
    setParticipants([...participants, { 
      id: Date.now().toString(), 
      roleType: 'party', 
      customRoleName: `Party ${String.fromCharCode(65 + participants.length)}`, 
      name: '', 
      email: '', 
      color: newColor 
    }]);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleParticipantChange = (id: string, field: keyof Participant, value: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // --- Step 3 Handlers ---
  const addField = (type: DocumentField['type']) => {
    const newField: DocumentField = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100 + fields.length * 20,
      width: type === 'signature' ? 200 : type === 'textarea' ? 300 : 200,
      height: type === 'signature' ? 80 : type === 'textarea' ? 100 : 40,
      participantId: activeParticipantId
    };
    setFields([...fields, newField]);
  };

  const handleFieldPointerDown = (e: React.PointerEvent, field: DocumentField) => {
    e.stopPropagation();
    setDraggingField({
      id: field.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: field.x,
      initialY: field.y
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleFieldPointerMove = (e: React.PointerEvent) => {
    if (draggingField) {
      const dx = e.clientX - draggingField.startX;
      const dy = e.clientY - draggingField.startY;
      setFields(fields.map(f => f.id === draggingField.id ? { ...f, x: draggingField.initialX + dx, y: draggingField.initialY + dy } : f));
    }
  };

  const handleFieldPointerUp = (e: React.PointerEvent) => {
    if (draggingField) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setDraggingField(null);
    }
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const activeColor = participants.find(p => p.id === activeParticipantId)?.color || colors[0];

  // --- Render Helpers ---
  const handleBack = () => {
    if (projectId) navigate(`/projects/${projectId}`);
    else navigate('/projects');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header & Progress */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={handleBack} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Contract Package</h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 ? 'Add and organize documents' : 
             step === 2 ? 'Invite parties to sign and review' : 
             step === 3 ? 'Drag and drop fields for each party' : 
             'Finalize settings and send'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative mb-12 px-4 max-w-4xl mx-auto">
        <div className="absolute left-8 right-8 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-300" style={{ width: `calc(${((step - 1) / 3) * 100}% - 2rem)` }}></div>
        
        {steps.map((s) => (
          <div key={s.num} className={`relative z-10 flex flex-col items-center ${step >= s.num ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 bg-white transition-colors duration-300 ${
              step >= s.num ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-400'
            } ${step > s.num ? 'bg-indigo-600 text-white' : ''}`}>
              {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
            </div>
            <span className="absolute top-12 text-xs font-medium whitespace-nowrap">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Documents */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="bg-white rounded-xl shadow-sm border-2 border-indigo-100 p-6 flex flex-col items-center justify-center gap-3 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900">{t('contract.selectTemplate')}</h3>
                <p className="text-xs text-gray-500 mt-1">Choose from standard legal templates</p>
              </div>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center gap-3 hover:border-gray-400 hover:bg-gray-50 transition-all group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900">{t('contract.makeCustom')}</h3>
                <p className="text-xs text-gray-500 mt-1">Upload your own PDF or Word document</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
            </button>
          </div>

          {documents.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Contract Documents ({documents.length})</h3>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <GripVertical className="w-3 h-3" /> {t('contract.dragToReorder')}
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {documents.map((doc, index) => (
                  <div 
                    key={doc.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDrop={(e) => handleDrop(e, index)} onDragEnd={handleDragEnd}
                    className={`transition-all ${draggedIndex === index ? 'opacity-50 bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${doc.type === 'template' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {doc.type === 'template' ? <FileText className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-gray-900 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" checked={doc.isSettlementRelated} onChange={() => toggleSettlement(doc.id)} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${doc.isSettlementRelated ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${doc.isSettlementRelated ? 'transform translate-x-4' : ''}`}></div>
                          </div>
                          <span className={`text-sm font-medium transition-colors ${doc.isSettlementRelated ? 'text-indigo-700' : 'text-gray-500 group-hover:text-gray-700'}`}>
                            {t('contract.settlementRelated')}
                          </span>
                        </label>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <button onClick={() => toggleExpand(doc.id)} className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium ${doc.expanded ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                          <Settings className="w-4 h-4" />
                          <span className="hidden sm:inline">{t('contract.advancedSettings')}</span>
                          {doc.expanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                        </button>
                        <button onClick={() => removeDocument(doc.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {doc.expanded && (
                      <div className="px-14 pb-4 pt-2 bg-gray-50/50 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Document Options</h4>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked={doc.advancedSettings?.requireSignature} />
                                Require Signatures
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked={doc.advancedSettings?.autoRenew} />
                                Auto-renew Contract
                              </label>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Permissions</h4>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked />
                                Allow viewers to download
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                Require approval before execution
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6">
            <button 
              onClick={() => setStep(2)}
              disabled={documents.length === 0}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Participants */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Set Participants</h2>
            <span className="text-sm text-gray-500">{participants.length} / 5 Participants</span>
          </div>
          
          <div className="space-y-4">
            {participants.map((p, index) => (
              <div key={p.id} className={`flex items-start gap-4 p-5 border-2 rounded-xl relative group bg-white transition-colors ${p.color.split(' ')[0]}`}>
                <div className="mt-3 cursor-grab text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-1 shrink-0 ${p.color}`}>
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Role Type</label>
                    <select 
                      value={p.roleType}
                      onChange={(e) => handleParticipantChange(p.id, 'roleType', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                    >
                      <option value="initiator">Initiator</option>
                      <option value="party">Party</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Custom Role Name</label>
                    <input 
                      type="text" 
                      value={p.customRoleName}
                      onChange={(e) => handleParticipantChange(p.id, 'customRoleName', e.target.value)}
                      placeholder="e.g., Party A, Developer, Publisher"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      value={p.name}
                      onChange={(e) => handleParticipantChange(p.id, 'name', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="Enter email address"
                      value={p.email}
                      onChange={(e) => handleParticipantChange(p.id, 'email', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                    />
                  </div>
                </div>
                {participants.length > 1 && (
                  <button 
                    onClick={() => handleRemoveParticipant(p.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleAddParticipant}
            disabled={participants.length >= 5}
            className="mt-6 w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" /> Add Participant
          </button>

          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
            <button onClick={() => setStep(1)} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button onClick={() => setStep(3)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Next Step
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Edit Fields */}
      {step === 3 && (
        <div className="flex gap-6 h-[700px]">
          {/* Sidebar */}
          <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Assign Fields To:</h3>
              <select 
                value={activeParticipantId}
                onChange={(e) => setActiveParticipantId(e.target.value)}
                className={`w-full rounded-lg shadow-sm text-sm p-3 border-2 outline-none transition-colors font-medium ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]}`}
              >
                {participants.map(p => (
                  <option key={p.id} value={p.id}>{p.customRoleName} {p.name ? `(${p.name})` : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Drag & Drop Fields</p>
              
              <button onClick={() => addField('signature')} className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all text-sm font-medium text-gray-800 shadow-sm hover:shadow-md ${activeColor.split(' ')[0]} bg-white hover:${activeColor.split(' ')[1]}`}>
                <div className={`p-1.5 rounded-md ${activeColor.split(' ')[1]}`}><PenTool className="w-4 h-4" /></div>
                Signature (결제의 증명)
              </button>
              
              <button onClick={() => addField('wallet')} className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all text-sm font-medium text-gray-800 shadow-sm hover:shadow-md ${activeColor.split(' ')[0]} bg-white hover:${activeColor.split(' ')[1]}`}>
                <div className={`p-1.5 rounded-md ${activeColor.split(' ')[1]}`}><Wallet className="w-4 h-4" /></div>
                Settlement Wallet (정산 지갑)
              </button>
              
              <button onClick={() => addField('text')} className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all text-sm font-medium text-gray-800 shadow-sm hover:shadow-md ${activeColor.split(' ')[0]} bg-white hover:${activeColor.split(' ')[1]}`}>
                <div className={`p-1.5 rounded-md ${activeColor.split(' ')[1]}`}><Type className="w-4 h-4" /></div>
                Text Input (단일 텍스트)
              </button>

              <button onClick={() => addField('textarea')} className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all text-sm font-medium text-gray-800 shadow-sm hover:shadow-md ${activeColor.split(' ')[0]} bg-white hover:${activeColor.split(' ')[1]}`}>
                <div className={`p-1.5 rounded-md ${activeColor.split(' ')[1]}`}><AlignLeft className="w-4 h-4" /></div>
                Text Area (계약 내용, 조건 등)
              </button>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Next</button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-200 rounded-xl border border-gray-300 overflow-auto relative flex justify-center p-8">
            <div 
              className="bg-white shadow-lg relative"
              style={{ width: '800px', minHeight: '1131px' }} // A4 ratio
              onPointerMove={handleFieldPointerMove}
              onPointerUp={handleFieldPointerUp}
            >
              {/* Placeholder Document Content */}
              <div className="p-12 text-gray-300 select-none pointer-events-none">
                <h1 className="text-3xl font-bold text-center mb-10 text-gray-400">CONTRACT DOCUMENT</h1>
                <div className="space-y-6">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                  <div className="h-32 bg-gray-50 rounded w-full mt-10"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mt-10"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>

              {/* Render Fields */}
              {fields.map(field => {
                const pColor = participants.find(p => p.id === field.participantId)?.color || colors[0];
                return (
                  <div
                    key={field.id}
                    onPointerDown={(e) => handleFieldPointerDown(e, field)}
                    className={`absolute border-2 cursor-move flex flex-col bg-white shadow-sm group ${pColor.split(' ')[0]}`}
                    style={{ left: field.x, top: field.y, width: field.width, height: field.height }}
                  >
                    <div className={`text-[10px] font-bold px-1 py-0.5 text-white truncate ${pColor.split(' ')[0].replace('border-', 'bg-')}`}>
                      {participants.find(p => p.id === field.participantId)?.customRoleName}
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2 relative">
                      {field.type === 'signature' && <span className="text-gray-400 font-medium">Signature</span>}
                      {field.type === 'wallet' && <span className="text-gray-400 font-medium">Wallet Address</span>}
                      {field.type === 'text' && <span className="text-gray-400 font-medium">Text</span>}
                      {field.type === 'textarea' && <span className="text-gray-400 font-medium">Text Area</span>}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Final Settings */}
      {step === 4 && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Final Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Package Name</label>
              <input 
                type="text" 
                value={finalSettings.packageName}
                onChange={(e) => setFinalSettings({...finalSettings, packageName: e.target.value})}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Message (Optional)</label>
              <textarea 
                rows={4}
                value={finalSettings.message}
                onChange={(e) => setFinalSettings({...finalSettings, message: e.target.value})}
                placeholder="Please review and sign the attached documents..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border resize-none"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Settings</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600"><Lock className="w-5 h-5" /></div>
                      <div>
                        <p className="font-medium text-gray-900">Access Password</p>
                        <p className="text-xs text-gray-500">Require a password to open the documents</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={finalSettings.requirePassword} onChange={(e) => setFinalSettings({...finalSettings, requirePassword: e.target.checked})} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  {finalSettings.requirePassword && (
                    <div className="mt-3 pl-12">
                      <input 
                        type="password" 
                        placeholder="Enter access password"
                        value={finalSettings.password}
                        onChange={(e) => setFinalSettings({...finalSettings, password: e.target.value})}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600"><Smartphone className="w-5 h-5" /></div>
                      <div>
                        <p className="font-medium text-gray-900">Mobile Verification (OTP)</p>
                        <p className="text-xs text-gray-500">Require SMS verification before signing</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={finalSettings.requireMobileAuth} onChange={(e) => setFinalSettings({...finalSettings, requireMobileAuth: e.target.checked})} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
            <button onClick={() => setStep(3)} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button 
              onClick={() => navigate(projectId ? `/projects/${projectId}` : '/projects')} 
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Contract Package
            </button>
          </div>
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{t('contract.selectTemplate')}</h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {availableTemplates.map(template => (
                <div 
                  key={template.id} 
                  onClick={() => handleSelectTemplate(template.name)}
                  className="p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block">{template.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContract;
