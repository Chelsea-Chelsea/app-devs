import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.main': 'Main',
    'nav.projects': 'Projects',
    'nav.revenue': 'Revenue',
    'nav.settlement': 'Settlement',
    'nav.reporting': 'Reporting',
    'nav.users': 'Users',
    'hero.claimable': 'Claimable Revenue',
    'hero.total': 'Total Revenue (All Projects)',
    'hero.active': 'Active Projects',
    'hero.settlement': 'Settlement Status',
    'action.claim': 'Claim Now',
    'action.create': 'Create Contract',
    'action.createProject': 'Create Project',
    'dashboard.trend': 'Revenue Trend',
    'dashboard.insights': 'Smart Insights',
    'dashboard.performance': 'Project Performance',
    'dashboard.snapshot': 'On-Chain Snapshot',
    'status.minted': 'Minted',
    'status.pending': 'Pending',
    'status.draft': 'Draft',
    'main.welcome': 'Hello, {name}',
    'main.promptPlaceholder': 'Ask me to manage your projects or revenue...',
    'main.suggested.revenue': 'Tell me the settled amount for this month',
    'main.suggested.contract': 'Create a collaboration contract',
    'main.suggested.execute': "Execute this month's settlement",
    'createContract.aiPrompt': 'Describe your contract to auto-fill...',
    'createContract.aiButton': 'Generate with AI',
    'createContract.manualToggle': 'Switch to Manual / AI',
    'project.title': 'Project Title',
    'project.description': 'Project Description',
    'project.viewers': 'Invite Viewers',
    'project.lastChanged': 'Last Changed',
    'project.role': 'Role',
    'project.actions': 'Actions',
    'contract.builder.title': 'Contract Builder',
    'contract.builder.desc': 'Add and organize documents for this contract package.',
    'contract.addDocument': 'Add Document',
    'contract.selectTemplate': 'Select Template',
    'contract.makeCustom': 'Make My Own',
    'contract.settlementRelated': 'Settlement Related',
    'contract.advancedSettings': 'Advanced Settings',
    'contract.dragToReorder': 'Drag to reorder',
  },
  ko: {
    'nav.home': '홈',
    'nav.main': '메인',
    'nav.projects': '프로젝트',
    'nav.revenue': '수익',
    'nav.settlement': '정산',
    'nav.reporting': '리포팅',
    'nav.users': '사용자',
    'hero.claimable': '청구 가능 수익',
    'hero.total': '총 수익 (전체 프로젝트)',
    'hero.active': '활성 프로젝트',
    'hero.settlement': '정산 상태',
    'action.claim': '지금 청구하기',
    'action.create': '계약 생성',
    'action.createProject': '프로젝트 생성',
    'dashboard.trend': '수익 추이',
    'dashboard.insights': '스마트 인사이트',
    'dashboard.performance': '프로젝트 성과',
    'dashboard.snapshot': '온체인 스냅샷',
    'status.minted': '발행됨',
    'status.pending': '대기중',
    'status.draft': '초안',
    'main.welcome': '안녕하세요, {name}님',
    'main.promptPlaceholder': '프로젝트나 정산 관리에 대해 무엇이든 물어보세요...',
    'main.suggested.revenue': '이번달 정산된 금액을 알려줘',
    'main.suggested.contract': '콜라보 계약서를 만들어줘',
    'main.suggested.execute': '이번달 정산을 집행하자',
    'createContract.aiPrompt': '계약 내용을 설명해주시면 자동으로 채워드립니다...',
    'createContract.aiButton': 'AI로 생성하기',
    'createContract.manualToggle': '수동 / AI 전환',
    'project.title': '프로젝트 명',
    'project.description': '프로젝트 설명',
    'project.viewers': '뷰어 초대',
    'project.lastChanged': '최근 변경일',
    'project.role': '역할',
    'project.actions': '작업',
    'contract.builder.title': '계약서 빌더',
    'contract.builder.desc': '이 계약 패키지에 포함될 문서들을 추가하고 구성하세요.',
    'contract.addDocument': '문서 추가',
    'contract.selectTemplate': '템플릿 선택',
    'contract.makeCustom': '직접 만들기',
    'contract.settlementRelated': '정산 관련 계약',
    'contract.advancedSettings': '고급 설정',
    'contract.dragToReorder': '드래그하여 순서 변경',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
