import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, PenTool, CheckSquare, Calendar, Paperclip } from 'lucide-react';

const SignDocument: React.FC = () => {
  const navigate = useNavigate();
  
  // Simulate the signer's required actions
  const [actions, setActions] = useState({
    signature: false,
    date: false,
    checkbox: false
  });

  const isComplete = Object.values(actions).every(Boolean);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sign Document</h1>
            <p className="text-sm text-gray-500 mt-1">Master Collaboration Agreement - Project X</p>
          </div>
        </div>
        <button 
          disabled={!isComplete}
          onClick={() => {
            alert('Document signed successfully!');
            navigate('/');
          }}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Signing
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar: Required Actions */}
        <div className="w-72 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-fit sticky top-24">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Required Actions</h3>
          
          <div className="space-y-3">
            <div className={`p-3 border rounded-lg flex items-center gap-3 transition-colors ${actions.signature ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-700'}`}>
              {actions.signature ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <PenTool className="w-5 h-5 text-gray-400" />}
              <span className="text-sm font-medium">1. Add Signature</span>
            </div>
            <div className={`p-3 border rounded-lg flex items-center gap-3 transition-colors ${actions.date ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-700'}`}>
              {actions.date ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Calendar className="w-5 h-5 text-gray-400" />}
              <span className="text-sm font-medium">2. Fill Date</span>
            </div>
            <div className={`p-3 border rounded-lg flex items-center gap-3 transition-colors ${actions.checkbox ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-700'}`}>
              {actions.checkbox ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <CheckSquare className="w-5 h-5 text-gray-400" />}
              <span className="text-sm font-medium">3. Agree to Terms</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              Please review the document and complete all required actions highlighted in <span className="font-bold text-green-600">green</span> to finish the signing process.
            </p>
          </div>
        </div>

        {/* Center: Document View */}
        <div className="flex-1 bg-gray-300 rounded-xl border border-gray-200 overflow-y-auto flex justify-center p-8 h-[800px]">
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-md p-12 font-serif text-gray-800 text-sm leading-relaxed relative">
            
            <h1 className="text-xl font-bold text-center mb-8">MASTER COLLABORATION AGREEMENT</h1>
            
            <p className="mb-6">
              This Collaboration Agreement (“Agreement”) is made and entered into by and between:
            </p>

            <div className="mb-6 space-y-2">
              <p><strong>Party A:</strong> Alpha Corp with its principal place of business at 123 Tech Lane (“Party A”), and</p>
              <p><strong>Party B:</strong> Beta LLC with its principal place of business at 456 Innovation Blvd (“Party B”).</p>
            </div>

            <p className="mb-8">
              The Effective Date of this Agreement shall be October 1, 2023, regardless of the date of execution.
            </p>

            <h3 className="font-bold mb-2">1. Purpose and Scope</h3>
            <p className="mb-4">
              The Parties hereby agree to collaborate in connection with the project entitled “Project X” (the “Project”), which shall be carried out as a Joint Venture pursuant to the terms and conditions set forth in this Agreement.
            </p>

            <h3 className="font-bold mb-2 mt-6">2. Roles and Responsibilities</h3>
            <p className="font-semibold mb-1">2.1 Responsibilities of Party A</p>
            <p className="mb-4 text-gray-600 p-2">Party A will provide the core technology platform and infrastructure.</p>
            
            <p className="font-semibold mb-1">2.2 Responsibilities of Party B</p>
            <p className="mb-4 text-gray-600 p-2">Party B will handle marketing, distribution, and customer support.</p>

            <h3 className="font-bold mb-2 mt-6">3. Terms and Conditions</h3>
            <div className="mb-4">
              <label className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${actions.checkbox ? 'border-emerald-500 bg-emerald-50' : 'border-green-500 bg-green-50 animate-pulse'}`}>
                <input 
                  type="checkbox" 
                  checked={actions.checkbox}
                  onChange={(e) => setActions({...actions, checkbox: e.target.checked})}
                  className="mt-1 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" 
                />
                <span className="text-sm text-gray-700">I have read and agree to the terms and conditions outlined in Section 3 regarding liability and dispute resolution.</span>
              </label>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8">
              <div>
                <p className="font-bold mb-4">Party A (Alpha Corp)</p>
                <p className="mb-2">Name: John Doe</p>
                <p className="mb-2">Date: Oct 1, 2023</p>
                <div className="mt-4 border border-gray-300 w-[200px] h-[80px] flex items-center justify-center text-gray-400 text-sm font-medium">
                  Signed by John Doe
                </div>
              </div>
              <div>
                <p className="font-bold mb-4">Party B (You)</p>
                <p className="mb-2">Name: Jane Smith</p>
                <div className="mb-2 flex items-center gap-2">
                  <span>Date:</span>
                  {actions.date ? (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-medium rounded">Oct 15, 2023</span>
                  ) : (
                    <button 
                      onClick={() => setActions({...actions, date: true})}
                      className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200 text-xs font-bold animate-pulse"
                    >
                      Click to add Date
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  {actions.signature ? (
                    <div className="border-2 border-emerald-500 bg-emerald-50 w-[200px] h-[80px] flex items-center justify-center text-emerald-700 font-bold italic text-xl">
                      Jane Smith
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActions({...actions, signature: true})}
                      className="border-2 border-dashed border-green-500 bg-green-50 w-[200px] h-[80px] flex flex-col items-center justify-center text-green-600 hover:bg-green-100 transition-colors animate-pulse"
                    >
                      <PenTool className="w-6 h-6 mb-1" />
                      <span className="text-sm font-bold">Click to Sign</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignDocument;
