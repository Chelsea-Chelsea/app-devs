import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Plus, X, Send, User, 
  CheckCircle2, AlertCircle, ZoomIn, ZoomOut, MousePointer2
} from 'lucide-react';

interface Reply {
  id: string;
  text: string;
  author: string;
  role: string;
  timestamp: string;
}

interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  role: string;
  timestamp: string;
  replies: Reply[];
  resolved: boolean;
}

const ReviewContract: React.FC = () => {
  const { projectId, contractId } = useParams();
  const navigate = useNavigate();
  
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState<'view' | 'comment'>('view');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1', x: 250, y: 320, text: 'Can we change the governing law to New York?',
      author: 'Alice (Party B)', role: 'Party', timestamp: '2 hours ago', resolved: false,
      replies: [
        { id: 'r1', text: 'I will check with our legal team.', author: 'You', role: 'Initiator', timestamp: '1 hour ago' }
      ]
    }
  ]);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [newReplyText, setNewReplyText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [pendingCommentPos, setPendingCommentPos] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signatureType, setSignatureType] = useState<'text' | 'draw'>('text');
  const [typedSignature, setTypedSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  const documentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartPos = useRef<{ x: number, y: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'comment' || !documentRef.current) return;
    const rect = documentRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);
    dragStartPos.current = { x, y };
    setPendingCommentPos({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'comment' || !dragStartPos.current || !documentRef.current) return;
    const rect = documentRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);
    
    const width = Math.abs(x - dragStartPos.current.x);
    const height = Math.abs(y - dragStartPos.current.y);
    const left = Math.min(x, dragStartPos.current.x);
    const top = Math.min(y, dragStartPos.current.y);
    
    setPendingCommentPos({ x: left, y: top, width, height });
  };

  const handleMouseUp = () => {
    if (mode !== 'comment' || !pendingCommentPos) return;
    dragStartPos.current = null;
    setSelectedCommentId('new');
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4f46e5';
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const confirmSignature = () => {
    setHasSigned(true);
    setIsSignModalOpen(false);
    showToast('Document signed successfully on-chain.');
    
    // Auto-navigate or show completion state after a delay
    setTimeout(() => {
      showToast('Contract execution finalized. All parties notified.');
    }, 2000);
  };

  const submitNewComment = () => {
    if (!newCommentText.trim() || !pendingCommentPos) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      x: pendingCommentPos.x,
      y: pendingCommentPos.y,
      text: newCommentText,
      author: 'You',
      role: 'Initiator',
      timestamp: 'Just now',
      replies: [],
      resolved: false
    };

    setComments([...comments, newComment]);
    setNewCommentText('');
    setPendingCommentPos(null);
    setSelectedCommentId(newComment.id);
    setMode('view'); // Switch back to view mode after commenting

    if (sendEmailNotification) {
      showToast('Comment posted and email notification sent to parties.');
    } else {
      showToast('Comment posted.');
    }
  };

  const submitReply = (commentId: string) => {
    if (!newReplyText.trim()) return;

    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, {
            id: Date.now().toString(),
            text: newReplyText,
            author: 'You',
            role: 'Initiator',
            timestamp: 'Just now'
          }]
        };
      }
      return c;
    }));
    setNewReplyText('');
  };

  const handleSign = () => {
    setIsSignModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/projects/${projectId}`)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">Master Collaboration Agreement</h1>
              <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">Reviewing</span>
            </div>
            <p className="text-xs text-gray-500">Project: Project Alpha • Role: Initiator</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Toolbar */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setMode('view')}
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors ${mode === 'view' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MousePointer2 className="w-4 h-4" /> View
            </button>
            <button 
              onClick={() => setMode('comment')}
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors ${mode === 'comment' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MessageSquare className="w-4 h-4" /> Add Comment
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs font-medium w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><ZoomIn className="w-4 h-4" /></button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          {hasSigned ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Signed
            </div>
          ) : (
            <button 
              onClick={handleSign} 
              disabled={!walletAddress.trim() || !signatoryName.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title={(!walletAddress.trim() || !signatoryName.trim()) ? "Please fill out all required fields in the document first" : ""}
            >
              Sign Document
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Canvas */}
        <div className="flex-1 overflow-auto bg-gray-200 flex justify-center p-8 relative">
          <div 
            ref={documentRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`bg-white shadow-lg relative transition-transform origin-top ${mode === 'comment' ? 'cursor-crosshair' : 'cursor-default'}`}
            style={{ width: '800px', minHeight: '1131px', transform: `scale(${zoom / 100})` }}
          >
            {/* Dummy Document Content */}
            <div className="p-16 font-serif text-gray-800 leading-relaxed">
              <h1 className="text-2xl font-bold text-center mb-8">MASTER COLLABORATION AGREEMENT</h1>
              <p className="mb-6">This Collaboration Agreement (“Agreement”) is made and entered into by and between:</p>
              <div className="mb-6 space-y-4 pl-4 border-l-2 border-gray-200">
                <p><strong>Party A:</strong> Acme Corp with its principal place of business at 123 Tech Lane (“Party A”), and</p>
                <p><strong>Party B:</strong> Globex Inc with its principal place of business at 456 Innovation Blvd (“Party B”).</p>
              </div>
              
              <h3 className="font-bold mb-2 mt-8">1. Purpose and Scope</h3>
              <p className="mb-4 text-justify">
                The Parties hereby agree to collaborate in connection with the project entitled “Project Alpha” (the “Project”), which shall be carried out pursuant to the terms and conditions set forth in this Agreement. Both parties agree to share resources, intellectual property, and revenue as defined in the subsequent sections.
              </p>

              {/* Interactive Fields for Party - Integrated into document */}
              <div className={`my-8 p-6 bg-indigo-50/30 border-2 border-dashed rounded-xl transition-all pointer-events-auto ${hasSigned ? 'border-emerald-200 bg-emerald-50/20' : 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
                <div className="flex items-center gap-2 mb-4 text-indigo-900">
                  {hasSigned ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-emerald-900">Party B Information Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold">Party B Information Required</span>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      Authorized Signatory
                      {!signatoryName && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={signatoryName}
                      onChange={(e) => setSignatoryName(e.target.value)}
                      disabled={hasSigned}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 select-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      Settlement Wallet (ERC-20)
                      {!walletAddress && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      disabled={hasSigned}
                      placeholder="0x..."
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 select-text"
                    />
                  </div>
                </div>
              </div>

              <h3 className="font-bold mb-2 mt-8">2. Governing Law</h3>
              <p className="mb-4 text-justify">
                This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
              </p>

              <div className="mt-12 pt-12 border-t border-gray-200 grid grid-cols-2 gap-12">
                <div className="space-y-8">
                  <p className="font-bold">PARTY A (Initiator)</p>
                  <div className="h-16 border-b border-gray-400 flex items-end pb-2">
                    <span className="font-serif italic text-2xl text-gray-400">Alice Smith</span>
                  </div>
                  <p className="text-sm text-gray-500">Date: Oct 25, 2023</p>
                </div>
                <div className="space-y-8">
                  <p className="font-bold">PARTY B (You)</p>
                  <div className="h-16 border-b border-gray-400 flex items-end pb-2 relative">
                    {hasSigned ? (
                      signatureType === 'text' ? (
                        <span className="font-serif italic text-3xl text-indigo-600">{typedSignature || signatoryName}</span>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-indigo-600 font-bold border-2 border-indigo-600 px-4 py-1 rotate-[-5deg] uppercase tracking-widest">Signed On-Chain</span>
                        </div>
                      )
                    ) : (
                      <span className="text-gray-300 italic">Awaiting Signature</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Date: {hasSigned ? 'Mar 19, 2026' : '—'}</p>
                </div>
              </div>
            </div>

            {/* Render Comments on Canvas */}
            {comments.map(comment => (
              <div 
                key={comment.id}
                onClick={(e) => { e.stopPropagation(); setSelectedCommentId(comment.id); setMode('view'); }}
                className={`absolute rounded-md flex items-center justify-center cursor-pointer shadow-md transition-all ${selectedCommentId === comment.id ? 'bg-indigo-600/20 border-2 border-indigo-600 z-20' : 'bg-yellow-400/20 border-2 border-yellow-400 hover:bg-yellow-400/30 z-10'}`}
                style={{ left: comment.x, top: comment.y, width: 30, height: 30 }}
              >
                <MessageSquare className={`w-4 h-4 ${selectedCommentId === comment.id ? 'text-indigo-600' : 'text-yellow-700'}`} />
              </div>
            ))}

            {/* Pending Comment Box (Drag) */}
            {pendingCommentPos && (
              <div 
                className="absolute border-2 border-dashed border-indigo-500 bg-indigo-500/10 z-30 pointer-events-none"
                style={{ 
                  left: pendingCommentPos.x, 
                  top: pendingCommentPos.y, 
                  width: pendingCommentPos.width, 
                  height: pendingCommentPos.height 
                }}
              />
            )}
          </div>
        </div>

        {/* Comments Sidebar */}

        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 shadow-xl">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Comments & Review
            </h2>
            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{comments.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* New Comment Input Box */}
            {selectedCommentId === 'new' && pendingCommentPos && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold">Y</div>
                  <span className="text-sm font-semibold text-gray-900">You</span>
                </div>
                <textarea 
                  autoFocus
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type your comment here..."
                  className="w-full text-sm border border-indigo-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
                  rows={3}
                />
                <div className="flex items-center gap-2 mt-2 mb-1">
                  <input 
                    type="checkbox" 
                    id="sendEmail" 
                    checked={sendEmailNotification} 
                    onChange={(e) => setSendEmailNotification(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <label htmlFor="sendEmail" className="text-xs text-gray-600 cursor-pointer">Send email notification to parties</label>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => { setSelectedCommentId(null); setPendingCommentPos(null); }} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-indigo-100 rounded-md">Cancel</button>
                  <button onClick={submitNewComment} disabled={!newCommentText.trim()} className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">Post Comment</button>
                </div>
              </div>
            )}

            {/* List of Comments */}
            {comments.map(comment => (
              <div 
                key={comment.id} 
                onClick={() => setSelectedCommentId(comment.id)}
                className={`border rounded-xl transition-all cursor-pointer ${selectedCommentId === comment.id ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${comment.author === 'You' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                        {comment.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mt-2">{comment.text}</p>
                </div>

                {/* Replies Section */}
                {comment.replies.length > 0 && (
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 space-y-3 rounded-b-xl">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${reply.author === 'You' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'}`}>
                          {reply.author.charAt(0)}
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-semibold text-gray-900">{reply.author}</span>
                            <span className="text-[10px] text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-700">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input (Visible when selected) */}
                {selectedCommentId === comment.id && (
                  <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl flex gap-2">
                    <input 
                      type="text" 
                      value={newReplyText}
                      onChange={(e) => setNewReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitReply(comment.id)}
                      placeholder="Reply to this thread..."
                      className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button 
                      onClick={() => submitReply(comment.id)}
                      disabled={!newReplyText.trim()}
                      className="p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {comments.length === 0 && selectedCommentId !== 'new' && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No comments yet</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Comment" and click anywhere on the document to start a discussion.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Signature Modal */}
      {isSignModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Sign Document</h2>
              <button onClick={() => setIsSignModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => setSignatureType('text')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${signatureType === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Type Signature
                </button>
                <button 
                  onClick={() => setSignatureType('draw')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${signatureType === 'draw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Draw Signature
                </button>
              </div>

              {signatureType === 'text' ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Type your name here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-serif italic focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      By typing your name, you agree that this is a legally binding electronic signature. Your signature will be cryptographically hashed and stored on the blockchain.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 overflow-hidden relative">
                    <canvas 
                      ref={canvasRef}
                      width={440}
                      height={180}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="cursor-crosshair w-full h-[180px]"
                    />
                    <button 
                      onClick={clearCanvas}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-gray-500 rounded-md shadow-sm text-xs font-medium"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Use your mouse or touch screen to draw your signature</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsSignModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSignature}
                disabled={signatureType === 'text' ? !typedSignature.trim() : false}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
              >
                Confirm & Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewContract;
