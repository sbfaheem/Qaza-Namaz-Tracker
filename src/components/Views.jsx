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
  const [activePopup, setActivePopup] = useState(null);
  const [showMissedModal, setShowMissedModal] = useState(false);
  const [showPerformMissedModal, setShowPerformMissedModal] = useState(false);
  const [selectedMissed, setSelectedMissed] = useState('fajr');

  const { stats, profile } = user;
  const progress = ((stats.completed / stats.total) * 100).toFixed(1);
  const prediction = calculateETA(user);

  const handlePrayerClick = (prayer) => {
    setActivePopup(prayer);
    setTimeout(() => {
      setActivePopup(null);
    }, 10000);
  };

  const prayerInfos = {
    fajr: { name: 'Fajr', rakats: 2, type: 'Fard' },
    zuhr: { name: 'Zuhar', rakats: 4, type: 'Fard' },
    asr: { name: 'Asr', rakats: 4, type: 'Fard' },
    maghrib: { name: 'Maghrib', rakats: 3, type: 'Fard' },
    isha: { name: 'Isha', rakats: 4, type: 'Fard' },
    witr: { name: 'Witr', rakats: 3, type: 'Wajib' }
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
          <span className="progress-label">CURRENT SANCTUARY PROGRESS</span>
          <div className="progress-main-value">
            {progress}% <span className="completed-text">Complete</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-metrics" style={{ flexWrap: 'wrap' }}>
            <div className="metric">
              <span className="metric-label">REMAINING</span>
              <span className="metric-value">{(stats.total - stats.completed).toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="metric-label">COMPLETED</span>
              <span className="metric-value">{stats.completed.toLocaleString()}</span>
            </div>
            {!prediction.isComplete && (
              <div className="metric" style={{ flexBasis: '100%', marginTop: '8px' }}>
                <span className="metric-label">PREDICTED COMPLETION</span>
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
          title="TOTAL DEBTS" 
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
            title="MISSED TODAY" 
            value={user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed || 0} 
            icon={AlertCircle} 
            color={user.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0])?.missed > 0 ? "#ef4444" : "#004b34"} 
          />
        </div>
      </div>

      <div className="section-header">
        <h3 className="section-title">Daily Qaza Tracker</h3>
        <button className="text-btn" onClick={() => setShowMissedModal(true)}>Add Extra Qaza +</button>
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
                  <span className="prayer-name">{prayerInfos[prayer].name} <span style={{fontSize: '0.7rem', color: 'var(--primary)', marginLeft: '4px'}}>ℹ️ Tap for rules</span></span>
                  <span className="prayer-count">Remaining: {(stats.breakdown[prayer].total - stats.breakdown[prayer].completed).toLocaleString()}</span>
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
          <div className="witr-rules-card" onClick={e => e.stopPropagation()}>
            <h3>Key Rules for Qaza {prayerInfos[activePopup].name}</h3>
            
            {activePopup === 'witr' ? (
              <ul className="witr-rules-list">
                <li><strong>The Intent (Niyyah):</strong> "I am performing the first/earliest Witr prayer that I missed."</li>
                <li><strong>Rak'ats to Perform:</strong> 3 Wajib Rak'ats.</li>
                <li><strong>Du'a-e-Qunoot:</strong> Must recite in the 3rd Rak'at. If forgotten, say <i>"Rabbana Atina..."</i> or <i>"Allahummaghfir-li"</i> 3 times.</li>
                <li><strong>Sunnahs are not required:</strong> Only Fard and Witr are recorded as debt.</li>
              </ul>
            ) : (
              <ul className="witr-rules-list">
                <li><strong>The Intent (Niyyah):</strong> "I am performing the first/earliest {prayerInfos[activePopup].name} prayer that I missed."</li>
                <li><strong>Rak'ats to Perform:</strong> {prayerInfos[activePopup].rakats} {prayerInfos[activePopup].type} Rak'ats.</li>
                <li><strong>Sunnahs are not required:</strong> You do not need to make up the Sunnah or Nafl prayers. Only Fard is recorded as debt.</li>
              </ul>
            )}
            
             <div style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
               Disappearing automatically...
             </div>
          </div>
        </div>
      )}

      {/* Add Missed Today Modal */}
      {showMissedModal && (
        <div className="witr-popup-overlay" onClick={() => setShowMissedModal(false)}>
          <div className="witr-rules-card" onClick={e => e.stopPropagation()}>
            <h3>Log Missed Prayer</h3>
            <p style={{marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
              Select a prayer you missed today to add it to your Qaza debt.
            </p>
            <select 
              className="modern-input" 
              style={{ padding: '12px', width: '100%', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}
              value={selectedMissed}
              onChange={e => setSelectedMissed(e.target.value)}
            >
              <option value="fajr">Fajr</option>
              <option value="zuhr">Zuhar</option>
              <option value="asr">Asr</option>
              <option value="maghrib">Maghrib</option>
              <option value="isha">Isha</option>
              <option value="witr">Witr</option>
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', marginTop: 0, boxShadow: 'none' }}
                onClick={() => setShowMissedModal(false)}
              >
                Cancel
              </button>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, marginTop: 0 }}
                onClick={() => {
                  onAddMissed(selectedMissed);
                  setShowMissedModal(false);
                }}
              >
                Add to Debt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perform Missed Modal */}
      {showPerformMissedModal && (
        <div className="witr-popup-overlay" onClick={() => setShowPerformMissedModal(false)}>
          <div className="witr-rules-card" onClick={e => e.stopPropagation()}>
            <h3>Perform Missed Prayer?</h3>
            <p style={{marginBottom: '20px', fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5}}>
              Have you performed one of the prayers you missed today?<br/><br/>
              Selecting <strong>Yes</strong> will clear it from your Missed Today box.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', marginTop: 0, boxShadow: 'none' }}
                onClick={() => setShowPerformMissedModal(false)}
              >
                Not yet
              </button>
              <button 
                className="calculate-btn" 
                style={{ flex: 1, marginTop: 0, backgroundColor: '#10b981' }}
                onClick={() => {
                  onPerformMissed();
                  setShowPerformMissedModal(false);
                }}
              >
                Yes, Make it Up!
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
  const { stats, profile } = user;
  const prediction = calculateETA(user);
  
  const data = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'witr'].map(p => ({
    name: p === 'zuhr' ? 'Zuhar' : p.charAt(0).toUpperCase() + p.slice(1),
    completed: stats.breakdown[p].completed,
    remaining: stats.breakdown[p].total - stats.breakdown[p].completed
  }));

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#004b34' },
    { name: 'Remaining', value: stats.total - stats.completed, color: '#e6f4f1' }
  ];

  return (
    <div className="journey-view container">
      <div className="premium-card journey-summary main-highlight">
        <div className="summary-text">
          <span className="label">Your Journey to Restoration</span>
          <div className="main-value">
            {stats.total.toLocaleString()} 
            <span className="sub-label">TOTAL PRAYERS</span>
          </div>
          <div className="eta-badge" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,0,0,0.15)' }}>
            {prediction.isComplete ? (
               <span>{prediction.text}</span>
            ) : (
               <>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                   <Clock size={16} />
                   <span>Target: {prediction.dateStr}</span>
                 </div>
                 <span style={{ fontSize: '0.8rem', marginTop: '6px', opacity: 0.9 }}>
                   {prediction.timeStr} left • {prediction.avgPhrase}
                 </span>
               </>
            )}
          </div>
        </div>
      </div>

      <div className="calculation-cards">
        <div className="premium-card mini-card">
           <span className="mini-label">BALAGHAT YEAR</span>
           <span className="mini-value">{profile.balaghatYear}</span>
        </div>
        <div className="premium-card mini-card">
           <span className="mini-label">REGULAR PRAYER</span>
           <span className="mini-value">{profile.startYear}</span>
        </div>
        <div className="premium-card mini-card">
           <span className="mini-label">QAZA PERIOD</span>
           <span className="mini-value">{profile.qazaYears} Years</span>
        </div>
      </div>

      <div className="section-header">
        <h3 className="section-title">Namaz Breakdown</h3>
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
