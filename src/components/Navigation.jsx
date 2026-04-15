import React from 'react';
import { Home, PlusCircle, BarChart2, Settings } from 'lucide-react';

export const Navbar = ({ currentUserId }) => {
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
           <h1 className="brand-name">Qaza Namaz Tracker</h1>
        </div>
        <div className="user-profile">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId || 'guest'}`} alt="avatar" className="avatar" />
        </div>
      </div>
    </nav>
  );
};

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'sanctuary', label: 'Sanctuary', icon: Home },
    { id: 'log', label: 'Log', icon: PlusCircle },
    { id: 'journey', label: 'Journey', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
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
