import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, ArrowUpRight, Calendar, Shield, Coins, Wallet, ChevronDown, ChevronUp, Layers, PieChart, Activity, CheckCircle2, Link as LinkIcon, Plus, LayoutDashboard, FileText } from 'lucide-react';

// Mock User Wallets
const MY_WALLETS = [
  { id: 'w1', address: '0xAbC1...890f', label: 'Main Wallet' },
  { id: 'w2', address: '0xDef2...112a', label: 'Vault Wallet' }
];

interface TokenHolder {
  walletAddress: string;
  tokenAmount: number; 
  settledAmount: number; 
  isMe?: boolean;
}

interface PartySettlement {
  partyName: string;
  partyRole: string; 
  totalPartyTokens: number; 
  partyAllocationPercentage: number; 
  totalSettledForParty: number; 
  holders: TokenHolder[];
}

interface SettlementRound {
  id: string;
  roundName: string;
  date: string;
  totalRoundRevenue: number;
  parties: PartySettlement[];
}

interface ContractRevenue {
  id: string;
  contractName: string;
  projectName: string;
  userRole: 'Initiator' | 'Party';
  userPartyName?: string; 
  totalContractRevenue: number; 
  rounds: SettlementRound[];
}

const mockContracts: ContractRevenue[] = [
  {
    id: 'c1',
    contractName: 'Global Publishing Agreement',
    projectName: 'Alpha Collab',
    userRole: 'Initiator',
    totalContractRevenue: 150000,
    rounds: [
      {
        id: 'r2',
        roundName: 'Q2 2024 Settlement',
        date: '2024-07-01',
        totalRoundRevenue: 100000,
        parties: [
          {
            partyName: 'Studio A',
            partyRole: 'Developer',
            totalPartyTokens: 100,
            partyAllocationPercentage: 60,
            totalSettledForParty: 60000,
            holders: [
              { walletAddress: '0xDev9...3321', tokenAmount: 80, settledAmount: 48000 },
              { walletAddress: '0xInv1...9982', tokenAmount: 20, settledAmount: 12000 },
            ]
          },
          {
            partyName: 'Com2uS',
            partyRole: 'Publisher',
            totalPartyTokens: 100,
            partyAllocationPercentage: 40,
            totalSettledForParty: 40000,
            holders: [
              { walletAddress: MY_WALLETS[0].address, tokenAmount: 70, settledAmount: 28000, isMe: true },
              { walletAddress: MY_WALLETS[1].address, tokenAmount: 30, settledAmount: 12000, isMe: true },
            ]
          }
        ]
      },
      {
        id: 'r1',
        roundName: 'Q1 2024 Settlement',
        date: '2024-04-01',
        totalRoundRevenue: 50000,
        parties: [
          {
            partyName: 'Studio A',
            partyRole: 'Developer',
            totalPartyTokens: 100,
            partyAllocationPercentage: 60,
            totalSettledForParty: 30000,
            holders: [
              { walletAddress: '0xDev9...3321', tokenAmount: 80, settledAmount: 24000 },
              { walletAddress: '0xInv1...9982', tokenAmount: 20, settledAmount: 6000 },
            ]
          },
          {
            partyName: 'Com2uS',
            partyRole: 'Publisher',
            totalPartyTokens: 100,
            partyAllocationPercentage: 40,
            totalSettledForParty: 20000,
            holders: [
              { walletAddress: MY_WALLETS[0].address, tokenAmount: 100, settledAmount: 20000, isMe: true },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'c2',
    contractName: 'Character IP Licensing',
    projectName: 'Beta Distribution',
    userRole: 'Party',
    userPartyName: 'Licensor',
    totalContractRevenue: 45000,
    rounds: [
      {
        id: 'r1',
        roundName: 'March 2024 Royalties',
        date: '2024-03-15',
        totalRoundRevenue: 45000,
        parties: [
          {
            partyName: 'Licensor',
            partyRole: 'Licensor',
            totalPartyTokens: 100,
            partyAllocationPercentage: 40,
            totalSettledForParty: 18000,
            holders: [
              { walletAddress: MY_WALLETS[1].address, tokenAmount: 60, settledAmount: 10800, isMe: true },
              { walletAddress: '0xJay8...4456', tokenAmount: 40, settledAmount: 7200 },
            ]
          },
          {
            partyName: 'Licensee',
            partyRole: 'Licensee',
            totalPartyTokens: 100,
            partyAllocationPercentage: 60,
            totalSettledForParty: 27000,
            holders: [
              { walletAddress: '0xLic3...7771', tokenAmount: 100, settledAmount: 27000 },
            ]
          }
        ]
      }
    ]
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// --- Subcomponent: Management Round Card ---
const ManagementRoundCard: React.FC<{ round: SettlementRound; userRole: string; userPartyName?: string }> = ({ round, userRole, userPartyName }) => {
  const [expanded, setExpanded] = useState(true);

  const visibleParties = userRole === 'Initiator' 
    ? round.parties 
    : round.parties.filter(p => p.partyName === userPartyName);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-sm">
      <div 
        className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{round.roundName}</h4>
            <p className="text-xs text-gray-500">Settled on {round.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Round Revenue</p>
            <p className="font-bold text-gray-900">{formatCurrency(round.totalRoundRevenue)}</p>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-6">
          {visibleParties.map((party, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <h5 className="font-semibold text-gray-800">{party.partyName} <span className="text-gray-400 font-normal text-sm">({party.partyRole})</span></h5>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Contract Share: {party.partyAllocationPercentage}% • Total Tokens: {party.totalPartyTokens}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(party.totalSettledForParty)}</p>
                  <p className="text-xs text-gray-500">Party Settlement</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                <div className="grid grid-cols-12 text-xs font-medium text-gray-500 px-2">
                  <div className="col-span-5">Wallet Address</div>
                  <div className="col-span-4">Token Holdings</div>
                  <div className="col-span-3 text-right">Settled Amount</div>
                </div>
                {party.holders.map((holder, hIdx) => (
                  <div key={hIdx} className={`grid grid-cols-12 items-center text-sm px-2 py-2 rounded-md ${holder.isMe ? 'bg-indigo-50 border border-indigo-100' : 'bg-white border border-gray-100'}`}>
                    <div className="col-span-5 flex items-center gap-2 font-mono text-gray-600">
                      <Wallet className={`w-4 h-4 ${holder.isMe ? 'text-indigo-500' : 'text-gray-400'}`} />
                      {holder.walletAddress}
                      {holder.isMe && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ml-1">My Wallet</span>}
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${holder.isMe ? 'bg-indigo-500' : 'bg-gray-400'}`} 
                          style={{ width: `${(holder.tokenAmount / party.totalPartyTokens) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{holder.tokenAmount} PT</span>
                    </div>
                    <div className="col-span-3 text-right font-bold text-gray-900">
                      {formatCurrency(holder.settledAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {userRole === 'Party' && round.parties.length > 1 && (
            <div className="text-center py-2 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Other parties' settlement details are hidden due to your role permissions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Revenue: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'management'>('portfolio');
  const [selectedWalletFilter, setSelectedWalletFilter] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<ContractRevenue | null>(mockContracts[0]);

  // --- Portfolio Calculations ---
  const portfolioData = useMemo(() => {
    let totalRevenue = 0;
    const ledger: any[] = [];

    mockContracts.forEach(contract => {
      contract.rounds.forEach(round => {
        round.parties.forEach(party => {
          party.holders.forEach(holder => {
            if (holder.isMe) {
              // Filter by selected wallet if not 'all'
              if (selectedWalletFilter === 'all' || selectedWalletFilter === holder.walletAddress) {
                totalRevenue += holder.settledAmount;
                ledger.push({
                  contractName: contract.contractName,
                  projectName: contract.projectName,
                  roundName: round.roundName,
                  date: round.date,
                  walletAddress: holder.walletAddress,
                  tokens: holder.tokenAmount,
                  amount: holder.settledAmount
                });
              }
            }
          });
        });
      });
    });

    // Sort ledger by date descending
    ledger.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { totalRevenue, ledger };
  }, [selectedWalletFilter]);

  // --- Management Calculations ---
  const managementSummary = useMemo(() => {
    let totalManagedVolume = 0;
    mockContracts.forEach(contract => {
      contract.rounds.forEach(round => {
        totalManagedVolume += round.totalRoundRevenue;
      });
    });
    return { totalManagedVolume, activeContracts: mockContracts.length };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue & Settlements</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your wallet portfolio and track contract settlements.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit border border-gray-200">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'portfolio' 
              ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <PieChart className="w-4 h-4" /> My Revenue
        </button>
        <button
          onClick={() => setActiveTab('management')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'management' 
              ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Settlement Status Management
        </button>
      </div>

      {/* ==========================================
          TAB 1: MY REVENUE PORTFOLIO
          ========================================== */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Wallet Connection & Filter Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-indigo-600" /> Connected Wallets
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {MY_WALLETS.map(wallet => (
                  <div key={wallet.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {wallet.label}: {wallet.address}
                  </div>
                ))}
                <button className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                  <Plus className="w-3 h-3" /> Connect Wallet
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <label className="block text-xs font-medium text-gray-500 mb-1">Filter by Wallet</label>
              <select 
                value={selectedWalletFilter}
                onChange={(e) => setSelectedWalletFilter(e.target.value)}
                className="w-full md:w-64 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Connected Wallets</option>
                {MY_WALLETS.map(w => (
                  <option key={w.id} value={w.address}>{w.label} ({w.address})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-sm font-medium text-indigo-100 flex items-center gap-2">Total Settled Revenue</h3>
                <div className="mt-2 text-4xl font-bold">{formatCurrency(portfolioData.totalRevenue)}</div>
                <p className="text-xs text-indigo-200 mt-1 flex items-center">Across selected wallets</p>
              </div>
              <Coins className="w-32 h-32 text-white opacity-10 absolute -bottom-6 -right-6 z-0 transform -rotate-12" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">Active Revenue Streams</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockContracts.length} Contracts</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> Generating yield</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">Total Party Tokens Held</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900">260 PT</div>
              <p className="text-xs text-gray-400 mt-1">Representing your ownership stakes</p>
            </div>
          </div>

          {/* Revenue Ledger */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" /> Revenue Ledger
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract / Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Wallet</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Settled</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {portfolioData.ledger.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{entry.contractName}</div>
                        <div className="text-xs text-gray-500">{entry.projectName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {entry.roundName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-3 h-3 text-gray-400" />
                          <span className="text-xs font-mono text-gray-600">{entry.walletAddress}</span>
                          <span className="text-[10px] text-gray-400">({entry.tokens} PT)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-emerald-600">+{formatCurrency(entry.amount)}</div>
                      </td>
                    </tr>
                  ))}
                  {portfolioData.ledger.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No revenue records found for the selected wallet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: SETTLEMENT MANAGEMENT
          ========================================== */}
      {activeTab === 'management' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Management Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">Total Managed Volume</h3>
                <div className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(managementSummary.totalManagedVolume)}</div>
                <p className="text-xs text-gray-400 mt-1">Across all contracts you are involved in</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">Contracts Managed</h3>
                <div className="mt-2 text-3xl font-bold text-gray-900">{managementSummary.activeContracts}</div>
                <p className="text-xs text-gray-400 mt-1">Initiator or Party roles</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contract List Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Contract Status</h2>
              {mockContracts.map(contract => (
                <div 
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedContract?.id === contract.id ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 shadow-sm' : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{contract.contractName}</h3>
                      <p className="text-xs text-gray-500 mt-1">{contract.projectName}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${contract.userRole === 'Initiator' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      <Shield className="w-3 h-3" /> {contract.userRole}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Volume</p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(contract.totalContractRevenue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contract Details & Rounds Main Area */}
            <div className="lg:col-span-2">
              {selectedContract ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                  <div className="p-6 border-b border-gray-100 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Layers className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{selectedContract.projectName}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedContract.contractName}</h2>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Shield className="w-4 h-4 text-gray-400" />
                            Your Role: <strong className="text-gray-900">{selectedContract.userRole}</strong>
                            {selectedContract.userPartyName && ` (${selectedContract.userPartyName})`}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Activity className="w-4 h-4 text-gray-400" />
                            Total Volume: <strong className="text-gray-900">{formatCurrency(selectedContract.totalContractRevenue)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-gray-500" />
                      Settlement Rounds Distribution
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedContract.rounds.map(round => (
                        <ManagementRoundCard 
                          key={round.id} 
                          round={round} 
                          userRole={selectedContract.userRole} 
                          userPartyName={selectedContract.userPartyName} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed h-full flex flex-col items-center justify-center text-gray-500 p-12">
                  <PieChart className="w-12 h-12 text-gray-300 mb-4" />
                  <p>Select a contract to view its settlement portfolio and token distribution.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
