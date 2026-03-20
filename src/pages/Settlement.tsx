import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Wallet, Send, History, ArrowRight, Plus, Search, CheckCircle2, ArrowUpRight, DollarSign, Link as LinkIcon, Unlink, Edit2, Check, X, AlertCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  userRole: 'Initiator' | 'Party' | 'Viewer' | 'None';
}

interface Contract {
  id: string;
  projectId: string;
  title: string;
  contractAddress: string;
  isSettlementEnabled: boolean;
  userRole: 'Initiator' | 'Party' | 'Viewer' | 'None';
}

interface AddressBookEntry {
  id: string;
  name: string;
  address: string;
}

const mockProjects: Project[] = [
  { id: 'p1', name: 'Alpha Collab Project', userRole: 'Initiator' },
  { id: 'p2', name: 'Beta Distribution', userRole: 'Party' },
  { id: 'p3', name: 'Gamma Secret Project', userRole: 'None' },
];

const mockContracts: Contract[] = [
  { id: 'c1', projectId: 'p1', title: 'Alpha Revenue Share Agreement', contractAddress: '0x7a2...3f9b', isSettlementEnabled: true, userRole: 'Initiator' },
  { id: 'c2', projectId: 'p1', title: 'Alpha NDA', contractAddress: '', isSettlementEnabled: false, userRole: 'Initiator' },
  { id: 'c3', projectId: 'p2', title: 'Beta Licensing', contractAddress: '0x9b4...1c2a', isSettlementEnabled: true, userRole: 'Party' },
  { id: 'c4', projectId: 'p1', title: 'Alpha External Contract', contractAddress: '0x111...2222', isSettlementEnabled: true, userRole: 'None' },
];

const initialAddressBook: AddressBookEntry[] = [
  { id: 'a1', name: 'Company Treasury', address: '0x123...abc' },
  { id: 'a2', name: 'Marketing Fund', address: '0x456...def' },
];

const mockMyHistory = [
  { id: 'h1', project: 'Alpha Collab Project', contract: 'Alpha Revenue Share Agreement', round: 'Round 4', amount: '1500.00', date: 'Today, 10:24 AM', status: 'Completed', txHash: '0x1a2b...3c4d' },
  { id: 'h2', project: 'Alpha Collab Project', contract: 'Alpha Revenue Share Agreement', round: 'Round 3', amount: '1250.00', date: 'Oct 25, 2023', status: 'Completed', txHash: '0x5e6f...7g8h' },
  { id: 'h3', project: 'Beta Distribution', contract: 'Beta Licensing', round: 'Q3 Royalties', amount: '4200.00', date: 'Oct 10, 2023', status: 'Completed', txHash: '0x9i0j...1k2l' },
];

const Settlement: React.FC = () => {
  const { t } = useLanguage();
  
  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedContractId, setSelectedContractId] = useState('');
  const [round, setRound] = useState('');
  const [memo, setMemo] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Wallet State
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [addressBook, setAddressBook] = useState<AddressBookEntry[]>(initialAddressBook);
  const [selectedAddressBookId, setSelectedAddressBookId] = useState('');
  
  // Address Book Editing State
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editAddressName, setEditAddressName] = useState('');

  // Derived State
  const availableProjects = mockProjects.filter(p => p.userRole !== 'None');
  const availableContracts = mockContracts.filter(c => c.projectId === selectedProjectId && c.isSettlementEnabled && c.userRole !== 'None');
  const selectedContract = mockContracts.find(c => c.id === selectedContractId);
  const activeWalletAddress = connectedWallet || (selectedAddressBookId ? addressBook.find(a => a.id === selectedAddressBookId)?.address : null);
  const isWalletInAddressBook = connectedWallet ? addressBook.some(a => a.address === connectedWallet) : false;
  
  // Validation
  const numericAmount = parseFloat(amount);
  const isAmountValid = !isNaN(numericAmount) && numericAmount > 0;
  const hasSufficientFunds = isAmountValid && numericAmount <= walletBalance;
  const canExecute = selectedProjectId && selectedContractId && activeWalletAddress && isAmountValid && hasSufficientFunds && round && memo;

  // Reset contract selection when project changes
  useEffect(() => {
    setSelectedContractId('');
  }, [selectedProjectId]);

  // Mock wallet connection
  const handleConnectWallet = () => {
    // In a real app, this would trigger MetaMask or WalletConnect
    const mockAddress = '0x89a...4b2c';
    setConnectedWallet(mockAddress);
    setSelectedAddressBookId(''); // Clear address book selection
    setWalletBalance(5000.00); // Mock balance
  };

  const handleDisconnectWallet = () => {
    setConnectedWallet(null);
    setWalletBalance(0);
  };

  const handleAddressBookSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAddressBookId(val);
    if (val) {
      setConnectedWallet(null); // Disconnect direct wallet if using address book
      setWalletBalance(10000.00); // Mock balance for address book entries
    } else {
      setWalletBalance(0);
    }
  };

  const startEditingAddress = (entry: AddressBookEntry) => {
    setEditingAddressId(entry.id);
    setEditAddressName(entry.name);
  };

  const saveAddressName = () => {
    if (editingAddressId) {
      setAddressBook(addressBook.map(a => a.id === editingAddressId ? { ...a, name: editAddressName } : a));
      setEditingAddressId(null);
    }
  };

  const deleteAddress = (id: string) => {
    setAddressBook(addressBook.filter(a => a.id !== id));
    if (selectedAddressBookId === id) {
      setSelectedAddressBookId('');
      setWalletBalance(0);
    }
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExecute) return;

    setIsSubmitting(true);
    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setWalletBalance(prev => prev - numericAmount); // Deduct balance
      setTimeout(() => {
        setSuccess(false);
        setRound('');
        setMemo('');
        setAmount('');
        setSelectedProjectId('');
        setSelectedContractId('');
      }, 3000);
    }, 1500);
  };

  const getPlaceholderName = () => {
    const now = new Date();
    return `Wallet connected at ${now.toLocaleString()}`;
  };

  const handleSaveToAddressBook = () => {
    if (connectedWallet && !isWalletInAddressBook) {
      const newEntry = {
        id: `a${Date.now()}`,
        name: getPlaceholderName(),
        address: connectedWallet
      };
      setAddressBook([...addressBook, newEntry]);
      setEditingAddressId(newEntry.id);
      setEditAddressName(newEntry.name);
      setSelectedAddressBookId(newEntry.id);
      setConnectedWallet(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settlement</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-indigo-600 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Send className="w-5 h-5" /> New Settlement
              </h2>
              <p className="text-sm text-indigo-100 mt-1">Distribute funds based on smart contracts.</p>
            </div>
            
            {success ? (
              <div className="p-8 flex flex-col items-center justify-center text-center h-[500px]">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Settlement Sent!</h4>
                <p className="text-sm text-gray-500 mt-2">Funds have been successfully sent to the contract.</p>
              </div>
            ) : (
              <form onSubmit={handleSettleSubmit} className="p-6 space-y-5">
                
                {/* Project & Contract Selection */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Project</label>
                    <select 
                      required
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                    >
                      <option value="">Select a project...</option>
                      {availableProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Contract</label>
                    <select 
                      required
                      value={selectedContractId}
                      onChange={(e) => setSelectedContractId(e.target.value)}
                      disabled={!selectedProjectId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Select a contract...</option>
                      {availableContracts.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    {selectedProjectId && availableContracts.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">No settlement-enabled contracts found in this project.</p>
                    )}
                  </div>

                  {selectedContract && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 flex items-start gap-2">
                      <Wallet className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-indigo-900">Smart Contract Address</p>
                        <p className="text-xs text-indigo-700 font-mono break-all">{selectedContract.contractAddress}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wallet Connection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Funding Source</label>
                  
                  {connectedWallet ? (
                    <div className="space-y-2">
                      <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-900">Connected Wallet</p>
                            <p className="text-xs text-emerald-700 font-mono">{connectedWallet}</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={handleDisconnectWallet}
                          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <Unlink className="w-3 h-3" /> Disconnect
                        </button>
                      </div>
                      {!isWalletInAddressBook && (
                        <button
                          type="button"
                          onClick={handleSaveToAddressBook}
                          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                        >
                          <Plus className="w-3 h-3" /> Save to Address Book
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleConnectWallet}
                        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <LinkIcon className="w-4 h-4" /> Connect Wallet (MetaMask / Vault)
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-xs text-gray-400 font-medium uppercase">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>

                      <div className="relative">
                        <select 
                          value={selectedAddressBookId}
                          onChange={handleAddressBookSelect}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
                        >
                          <option value="">Select from Address Book...</option>
                          {addressBook.map(w => (
                            <option key={w.id} value={w.id}>{w.name} ({w.address})</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address Book Management UI (Visible only when an address book entry is selected) */}
                  {selectedAddressBookId && !connectedWallet && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
                      {addressBook.filter(a => a.id === selectedAddressBookId).map(entry => (
                        <div key={entry.id} className="flex items-center justify-between">
                          {editingAddressId === entry.id ? (
                            <div className="flex items-center gap-2 flex-1 mr-2">
                              <input 
                                type="text" 
                                value={editAddressName}
                                onChange={(e) => setEditAddressName(e.target.value)}
                                placeholder={getPlaceholderName()}
                                className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                autoFocus
                              />
                              <button type="button" onClick={saveAddressName} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check className="w-4 h-4"/></button>
                              <button type="button" onClick={() => setEditingAddressId(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded"><X className="w-4 h-4"/></button>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{entry.name}</span>
                                <span className="text-xs text-gray-500 font-mono">{entry.address}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button type="button" onClick={() => startEditingAddress(entry)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit Name">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button type="button" onClick={() => deleteAddress(entry.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove from Address Book">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Balance Display */}
                  {activeWalletAddress && (
                    <div className="flex justify-between items-center text-xs px-1">
                      <span className="text-gray-500">Available Balance:</span>
                      <span className="font-medium text-gray-900">{walletBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USDC</span>
                    </div>
                  )}
                </div>

                {/* Settlement Details */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Round / Period</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Round 3"
                      value={round}
                      onChange={(e) => setRound(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="number" 
                        required
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-1 text-sm ${
                          amount && !hasSufficientFunds 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {amount && !hasSufficientFunds && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Insufficient funds
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Memo / Description</label>
                  <input 
                    type="text" 
                    required
                    placeholder="What is this settlement for?"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={!canExecute || isSubmitting}
                    className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {isSubmitting ? 'Processing Transaction...' : 'Execute Settlement'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                  {!activeWalletAddress && (
                    <p className="text-xs text-center text-amber-600 mt-3">Please connect a wallet or select an address to execute.</p>
                  )}
                  {activeWalletAddress && (
                    <p className="text-xs text-center text-gray-500 mt-3">This action will record the settlement on-chain.</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* History Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500" /> My Settlement History
              </h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search history..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project / Contract</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx Hash</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockMyHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{history.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{history.project}</div>
                        <div className="text-xs text-gray-500">{history.contract}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">{history.round}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${history.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 font-mono flex items-center gap-1 cursor-pointer">
                        {history.txHash} <ArrowUpRight className="w-3 h-3" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settlement;
