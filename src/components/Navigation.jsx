import { Home, PlusCircle, BarChart2, Settings, FileText, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = ({ currentUserId }) => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <nav className="navbar container">
      <div className="nav-header">
        <div className="branding">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-logo">
             <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 12L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 12L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
           <h1 className="brand-name">{t('brandName')}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="lang-toggle"
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.8rem', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              background: 'var(--secondary)',
              color: 'var(--primary)',
              fontWeight: 'bold'
            }}
          >
            <Globe size={14} />
            {language === 'en' ? 'اردو' : 'English'}
          </button>
          <div className="user-profile">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId || 'guest'}`} alt="avatar" className="avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const tabs = [
    { id: 'sanctuary', label: t('navSanctuary'), icon: Home },
    { id: 'log', label: t('navLog'), icon: PlusCircle },
    { id: 'report', label: t('navReport'), icon: FileText },
    { id: 'journey', label: t('navJourney'), icon: BarChart2 },
    { id: 'settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-content container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={24} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
