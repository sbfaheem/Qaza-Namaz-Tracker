import React, { useState } from 'react';
import { 
  TrendingUp, CheckCircle, Clock, AlertCircle, 
  Sunrise, Sun, CloudSun, Sunset, Moon, Plus, Minus, Star
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { calculateETA } from '../utils/predict';
import { useLanguage } from '../context/LanguageContext';

/**
 * Common Card Component
 */
const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="premium-card stat-card" style={{ '--accent': color }}>
    <div className="stat-header">
      <div className="stat-icon-bg">
        <Icon size={20} />
      </div>
      <span className="stat-title">{title}</span>
    </div>
    <div className="stat-value">{value.toLocaleString()}</div>
    {subtitle && <div className="stat-subtitle">{subtitle}</div>}
  </div>
);

/**
 * Dashboard / Sanctuary View
 */
export const Dashboard = ({ user, onLogPrayer, onUndoPrayer, onAddMissed, onPerformMissed }) => {
  const { t, isRTL } = useLanguage();
  const [activePopup, setActivePopup] = useState(null);
  const [showMissedModal, setShowMissedModal] = useState(false);
  const [showPerformMissedModal, setShowPerformMissedModal] = useState(false);
  const [selectedMissed, setSelectedMissed] = useState('fajr');

  const { stats, profile } = user;
  const progress = ((stats.completed / stats.total) * 100).toFixed(1);
  const prediction = calculateETA(user, t);

  const handlePrayerClick = (prayer) => {
    setActivePopup(prayer);
    setTimeout(() => {
      setActivePopup(null);
    }, 10000);
  };

  const prayerInfos = {
    fajr: { name: t('fajr'), rakats: 2, type: 'Fard' },
    zuhr: { name: t('zuhr'), rakats: 4, type: 'Fard' },
    asr: { name: t('asr'), rakats: 4, type: 'Fard' },
    maghrib: { name: t('maghrib'), rakats: 3, type: 'Fard' },
    isha: { name: t('isha'), rakats: 4, type: 'Fard' },
    witr: { name: t('witr'), rakats: 3, type: 'Wajib' }
  };

  const prayerIcons = {
    fajr: Sunrise,
    zuhr: Sun,
    asr: CloudSun,
    maghrib: Sunset,
    isha: Moon,
    witr: Star
  };

  return (
    <div className="dashboard-view container">
      {/* Progress Card */}
      <div className="premium-card progress-card main-highlight">
        <div className="progress-content">
          <span className="progress-label">{t('sanctuaryProgress')}</span>
          <div className="progress-main-value">
            {progress}% <span className="completed-text">{t('completeTitle')}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-metrics" style={{ flexWrap: 'wrap' }}>
            <div className="metric">
              <span className="metric-label">{t('remaining')}</span>
              <span className="metric-value">{(stats.total - stats.completed).toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="metric-label">{t('completed')}</span>
              <span className="metric-value">{stats.completed.toLocaleString()}</span>
            </div>
            {!prediction.isComplete && (
              <div className="metric" style={{ flexBasis: '100%', marginTop: '8px' }}>
                <span className="metric-label">{t('predictedCompletion')}</span>
                <span className="metric-value" style={{ fontSize: '1.05rem', marginTop: '2px' }}>
                  {prediction.timeStr} <span style={{fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.9}}>({prediction.avgPhrase})</span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="progress-bg-icon">🌙</div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title={t('totalDebts')} 
          value={(stats.total - stats.completed).toLocaleString()} 
          icon={TrendingUp} 
          color="#004b34" 
        />
        <div 
          onClick={() => {
            const missedCount = user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed || 0;
            if (missedCount > 0) setShowPerformMissedModal(true);
          }}
          style={{ 
            cursor: user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed > 0 ? 'pointer' : 'default',
            border: user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed > 0 ? '1px solid #ef4444' : '1px solid transparent',
            boxShadow: user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed > 0 ? '0 0 10px rgba(239, 68, 68, 0.15)' : 'none',
            borderRadius: '16px',
            transition: 'all 0.3s ease'
          }}
        >
          <StatCard 
            title={t('missedToday')} 
            value={user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed || 0} 
            icon={AlertCircle} 
            color={user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed > 0 ? "#ef4444" : "#004b34"} 
          />
        </div>
      </div>

      <div className="section-header">
        <h3 className="section-title">{t('dailyQazaTracker')}</h3>
        <button className="text-btn" onClick={() => setShowMissedModal(true)}>{t('addExtra')}</button>
      </div>

      <div className="prayer-tracker-list">
        {['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'witr'].map((prayer) => {
          const Icon = prayerIcons[prayer];
          return (
            <div key={prayer} className="prayer-item premium-card">
              <div 
                className="prayer-info"
                onClick={() => handlePrayerClick(prayer)}
                style={{ cursor: 'pointer' }}
              >
                <div className="prayer-icon-box" style={activePopup === prayer ? { background: 'var(--primary)', color: 'white' } : {}}>
                  <Icon size={20} />
                </div>
                <div className="prayer-text">
                  <span className="prayer-name">{t(prayer)} <span style={{fontSize: '0.7rem', color: 'var(--primary)', marginInlineStart: '4px'}}>ℹ️ {t('tapRules')}</span></span>
                  <span className="prayer-count">{t('remaining')}: {(stats.breakdown[prayer].total - stats.breakdown[prayer].completed).toLocaleString()}</span>
                </div>
              </div>
              <div className="prayer-actions" style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="log-btn negative"
                  style={{ backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  onClick={() => onUndoPrayer(prayer)}
                >
                  <Minus size={20} />
                </button>
                <button 
                  className="log-btn"
                  onClick={() => onLogPrayer(prayer)}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activePopup && (
        <div className="witr-popup-overlay" onClick={() => setActivePopup(null)}>
          <div className="witr-rules-card" onClick={e => e.stopPropagation()} style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h3>{t('rulesTitle')} {t(activePopup)}</h3>
            
            {activePopup === 'witr' ? (
              <ul className="witr-rules-list" style={{ paddingInlineStart: '20px' }}>
                <li><strong>{t('niyyahTitle')}</strong> {t('niyyahWitr')}</li>
                <li><strong>{t('rakatsToPerform')}</strong> {t('witrRuleRakat')}</li>
                <li><strong>{t('witrRuleQunoot')}</strong></li>
                <li><strong>{t('sunnahNotRequired')}</strong> {t('sunnahDesc')}</li>
              </ul>
            ) : (
              <ul className="witr-rules-list" style={{ paddingInlineStart: '20px' }}>
                <li><strong>{t('niyyahTitle')}</strong> {t('niyyahGeneral', t(activePopup))}</li>
                <li><strong>{t('rakatsToPerform')}</strong> {t('generalRuleRakat', [prayerInfos[activePopup].rakats, prayerInfos[activePopup].type])}</li>
                <li><strong>{t('sunnahNotRequired')}</strong> {t('sunnahDesc')}</li>
              </ul>
            )}
            
             <div style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
               {t('disappearingAuto')}
             </div>
          </div>
        </div>
      )}

      {/* Add Missed Today Modal */}
      {showMissedModal && (
        <div className="witr-popup-overlay" onClick={() => setShowMissedModal(false)}>
          <div className="witr-rules-card" onClick={e => e.stopPropagation()}>
            <h3>{t('logMissedTitle')}</h3>
            <p style={{marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
              {t('logMissedDesc')}
            </p>
            <select 
              className="modern-input" 
              style={{ padding: '12px', width: '100%', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border)', appearance: 'auto' }}
              value={selectedMissed}
              onChange={e => setSelectedMissed(e.target.value)}
            >
              <option value="fajr">{t('fajr')}</option>
              <option value="zuhr">{t('zuhr')}</option>
              <option value="asr">{t('asr')}</option>
              <option value="maghrib">{t('maghrib')}</option>
              <option value="isha">{t('isha')}</option>
              <option value="witr">{t('witr')}</option>
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', marginTop: 0, boxShadow: 'none' }}
                onClick={() => setShowMissedModal(false)}
              >
                {t('cancel')}
              </button>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, marginTop: 0 }}
                onClick={() => {
                  onAddMissed(selectedMissed);
                  setShowMissedModal(false);
                }}
              >
                {t('addToDebt')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perform Missed Modal */}
      {showPerformMissedModal && (
        <div className="witr-popup-overlay" onClick={() => setShowPerformMissedModal(false)}>
          <div className="witr-rules-card" onClick={e => e.stopPropagation()}>
            <h3>{t('performMissedTitle')}</h3>
            <p style={{marginBottom: '20px', fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5}}>
              {t('performMissedDesc')}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', marginTop: 0, boxShadow: 'none' }}
                onClick={() => setShowPerformMissedModal(false)}
              >
                {t('notYet')}
              </button>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, marginTop: 0, backgroundColor: '#10b981' }}
                onClick={() => {
                  onPerformMissed();
                  setShowPerformMissedModal(false);
                }}
              >
                 {t('yesMakeUp')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Journey / Stats View
 */
export const Journey = ({ user }) => {
  const { t } = useLanguage();
  const { stats, profile } = user;
  const prediction = calculateETA(user, t);
  
  const data = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'witr'].map(p => ({
    name: t(p),
    completed: stats.breakdown[p].completed,
    remaining: stats.breakdown[p].total - stats.breakdown[p].completed
  }));

  const pieData = [
    { name: t('completed'), value: stats.completed, color: '#004b34' },
    { name: t('remaining'), value: stats.total - stats.completed, color: '#e6f4f1' }
  ];

  return (
    <div className="journey-view container">
      <div className="premium-card journey-summary main-highlight">
        <div className="summary-text">
          <span className="label">{t('journeyRestoration')}</span>
          <div className="main-value">
            {stats.total.toLocaleString()} 
            <span className="sub-label">{t('totalPrayers')}</span>
          </div>
          <div className="eta-badge" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.15)' }}>
            {prediction.isComplete ? (
               <span>{prediction.text}</span>
            ) : (
               <>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                   <Clock size={16} />
                   <span>{t('targetDate')} {prediction.dateStr}</span>
                 </div>
                 <span style={{ fontSize: '0.8rem', marginTop: '6px', opacity: 0.9 }}>
                   {prediction.timeStr} {t('left')} • {prediction.avgPhrase}
                 </span>
               </>
            )}
          </div>
        </div>
      </div>

      <div className="calculation-cards">
        <div className="premium-card mini-card">
           <span className="mini-label">{t('balaghatYear')}</span>
           <span className="mini-value">{profile.balaghatYear}</span>
        </div>
        <div className="premium-card mini-card">
           <span className="mini-label">{t('regPrayerLabel')}</span>
           <span className="mini-value">{profile.startYear}</span>
        </div>
        <div className="premium-card mini-card">
           <span className="mini-label">{t('qazaPeriod')}</span>
           <span className="mini-value">{profile.qazaYears} {profile.qazaYears === 1 ? t('year') : t('years')}</span>
        </div>
      </div>

      <div className="section-header">
        <h3 className="section-title">{t('namazBreakdown')}</h3>
      </div>

      <div className="chart-container premium-card">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="completed" stackId="a" fill="#004b34" radius={[0, 0, 0, 0]} />
            <Bar dataKey="remaining" stackId="a" fill="#e6f4f1" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
