import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthScreen } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Navbar, BottomNav } from './components/Navigation';
import { Dashboard, Journey } from './components/Views';
import { ReportView } from './components/ReportView';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { fetchUserData, initializeUserRecord, persistUserData } from './utils/firestore';
import { downloadQazaReport } from './utils/export';
import { getRandomQuote } from './utils/quotes';
import './App.css';

function AppContent() {
  const { currentUser: authUser, logout } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('sanctuary');
  const [toastMessage, setToastMessage] = useState('');

  const showQuote = () => {
    setToastMessage(getRandomQuote(language));
    setTimeout(() => {
      setToastMessage('');
    }, 10000);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      if (authUser) {
        try {
          const data = await fetchUserData(authUser.uid);
          if (isMounted) {
            if (data && data.stats && data.stats.breakdown && typeof data.stats.breakdown.witr === 'undefined') {
              const qazaYears = data.profile.qazaYears || 0;
              const witrTotal = qazaYears * 365;
              data.stats.breakdown.witr = { total: witrTotal, completed: 0 };
              data.stats.total += witrTotal;
              // Will be persisted next time they log any prayer.
            }
            setUserData(data); // Null if they haven't completed onboarding
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          if (isMounted) setLoadingData(false);
        }
      } else {
        if (isMounted) {
          setUserData(null);
          setLoadingData(false);
        }
      }
    };

    loadProfile();
    
    return () => { isMounted = false; };
  }, [authUser]);

  const handleOnboardingComplete = async (userState) => {
    setLoadingData(true);
    try {
      // Initialize in Firestore mapped to auth uid
      const savedData = await initializeUserRecord(authUser.uid, userState);
      setUserData(savedData);
    } catch (e) {
      console.error(e);
      alert('Failed to save profile.');
    }
    setLoadingData(false);
  };

  const syncToFirestore = async (newData) => {
    setUserData(newData);
    try {
      await persistUserData(authUser.uid, newData);
    } catch (e) {
      console.error("Failed to sync to database", e);
    }
  };

  const handleLogPrayer = (prayerType) => {
    if (!userData) return;
    const newData = JSON.parse(JSON.stringify(userData)); // Deep clone simple object
    const today = new Date().toISOString().split('T')[0];
    
    // Update stats
    if (newData.stats.breakdown[prayerType].completed < newData.stats.breakdown[prayerType].total) {
      newData.stats.completed += 1;
      newData.stats.breakdown[prayerType].completed += 1;
    }

    // Add to daily logs
    const logIndex = newData.dailyLogs.findIndex(l => l.date === today);
    if (logIndex !== -1) {
      newData.dailyLogs[logIndex].prayers.push(prayerType);
    } else {
      newData.dailyLogs.push({ date: today, prayers: [prayerType], missed: 0 });
    }

    syncToFirestore(newData);
    showQuote();
  };

  const handleUndoPrayer = (prayerType) => {
    if (!userData) return;
    const newData = JSON.parse(JSON.stringify(userData)); 
    const today = new Date().toISOString().split('T')[0];
    
    if (newData.stats.breakdown[prayerType].completed > 0) {
      newData.stats.completed -= 1;
      newData.stats.breakdown[prayerType].completed -= 1;
      
      // Attempt to remove from today's daily log
      const logIndex = newData.dailyLogs.findIndex(l => l.date === today);
      if (logIndex !== -1) {
        const prayerIndex = newData.dailyLogs[logIndex].prayers.lastIndexOf(prayerType);
        if (prayerIndex !== -1) {
          newData.dailyLogs[logIndex].prayers.splice(prayerIndex, 1);
        }
      }
      syncToFirestore(newData);
    }
  };

  const handleAddMissed = (prayerType) => {
    if (!userData) return;
    const newData = JSON.parse(JSON.stringify(userData));
    const today = new Date().toISOString().split('T')[0];

    // Increment missed counter for today
    let logIndex = newData.dailyLogs.findIndex(l => l.date === today);
    if (logIndex !== -1) {
      newData.dailyLogs[logIndex].missed = (newData.dailyLogs[logIndex].missed || 0) + 1;
      newData.dailyLogs[logIndex].missedList = newData.dailyLogs[logIndex].missedList || [];
      newData.dailyLogs[logIndex].missedList.push(prayerType);
    } else {
      newData.dailyLogs.push({ date: today, prayers: [], missed: 1, missedList: [prayerType] });
    }

    syncToFirestore(newData);
  };

  const handlePerformMissed = () => {
    if (!userData) return;
    const newData = JSON.parse(JSON.stringify(userData));
    const today = new Date().toISOString().split('T')[0];
    const logIndex = newData.dailyLogs.findIndex(l => l.date === today);

    if (logIndex !== -1 && newData.dailyLogs[logIndex].missed > 0) {
      newData.dailyLogs[logIndex].missed -= 1;
      const missedList = newData.dailyLogs[logIndex].missedList || [];
      
      if (missedList.length > 0) {
        missedList.shift(); // remove the oldest missed purely from the isolated list
      }
      
      syncToFirestore(newData);
    }
  };

  // State 1: Not Logged In
  if (!authUser) {
    return <AuthScreen />;
  }

  // State 2: Logged In, but Loading Database
  if (loadingData) {
    return <div className="container" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>{t('processing')}</div>;
  }

  // State 3: Logged In, NO Profile (Needs Onboarding)
  if (!userData) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // State 4: Logged In & Has Profile
  return (
    <div className={`app-container ${activeTab}-active`}>
      <Navbar currentUserId={authUser.uid} />
      
      <main className="main-content">
        {activeTab === 'sanctuary' && (
          <Dashboard 
            user={userData} 
            onLogPrayer={handleLogPrayer}
            onUndoPrayer={handleUndoPrayer}
            onAddMissed={handleAddMissed}
            onPerformMissed={handlePerformMissed}
          />
        )}
        {activeTab === 'journey' && <Journey user={userData} />}
        {activeTab === 'report' && <ReportView user={userData} />}
        {activeTab === 'settings' && (
          <div className="settings-view container">
            <h2 className="section-title">{t('navSettings')}</h2>
            <div className="premium-card">
              <div className="settings-profile">
                <img src={authUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.uid}`} alt="avatar" className="settings-avatar" />
                <div className="profile-details">
                   <h3>{userData.profile.name || authUser.displayName || 'Anonymous User'}</h3>
                   <p>{t(userData.profile.gender.toLowerCase())} • {t('joined')} {new Date(userData.profile.dob).getFullYear()}</p>
                   <p style={{fontSize: '0.8rem', marginTop: '4px', textTransform: 'none'}}>{authUser.email}</p>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button className="premium-card action-item" onClick={() => {
                const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              }}>
                <div className="action-icon">🌓</div>
                <div className="action-info">
                  <span className="action-title">{t('toggleDark')}</span>
                  <span className="action-desc">{t('toggleDarkDesc')}</span>
                </div>
              </button>

              <button className="premium-card action-item" style={{ border: '1px solid #ef4444' }} onClick={logout}>
                <div className="action-icon">🚪</div>
                <div className="action-info">
                  <span className="action-title" style={{ color: '#ef4444' }}>{t('signOut')}</span>
                  <span className="action-desc">{t('signOutDesc')}</span>
                </div>
              </button>
            </div>
          </div>
        )}
        {activeTab === 'log' && (
          <div className="container">
             <h2 className="section-title">{t('navLog')}</h2>
             <div className="premium-card">
               {(userData.dailyLogs || []).length === 0 ? (
                 <p>{t('noActivity')}</p>
               ) : (
                 (userData.dailyLogs || []).slice().reverse().map((log, i) => (
                    <div key={i} className="log-entry" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <strong>{log.date}</strong>
                      <span>{(log.prayers || []).length} {t('completedShort')}</span>
                    </div>
                 ))
               )}
             </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {toastMessage && (
        <div className="toast-container">
          {toastMessage}
          <div className="toast-timer-line"></div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
