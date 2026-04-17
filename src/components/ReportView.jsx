import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  FileText,
  Heart
} from 'lucide-react';
import { downloadQazaReport } from '../utils/export';
import { useLanguage } from '../context/LanguageContext';

export const ReportView = ({ user }) => {
  const { t, isRTL } = useLanguage();
  const { stats, dailyLogs, profile } = user;
  const today = new Date().toISOString().split('T')[0];
  
  // Calculations
  const completed = stats.completed;
  const total = stats.total;
  const remaining = total - completed;
  const progressPercent = ((completed / total) * 100).toFixed(1);
  
  const todayLog = dailyLogs.find(l => l.date === today);
  const todaysCount = todayLog ? todayLog.prayers.length : 0;
  
  // Status Logic for Table
  const getStatus = (comp, tot) => {
    const ratio = comp / tot;
    if (ratio >= 0.9) return { label: t('statusNear'), color: '#22c55e' };
    if (ratio >= 0.4) return { label: t('statusModerate'), color: '#F59E0B' };
    return { label: t('statusHigh'), color: '#EF4444' };
  };

  // Activity History (Last 14 days)
  const last14Days = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const log = dailyLogs.find(l => l.date === dateStr);
    last14Days.push({
      date: dateStr,
      count: log ? log.prayers.length : 0
    });
  }

  return (
    <div className="report-view container" style={{ textAlign: isRTL ? 'right' : 'left' }}>
      <div className="section-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title">{t('progressReportTitle')}</h2>
          <p className="section-subtitle">{t('progressReportSub')}</p>
        </div>
        <button className="calculate-btn" onClick={() => downloadQazaReport(user, t, isRTL)} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} />
          {t('downloadPdf')}
        </button>
      </div>

      {/* Summary Section */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="premium-card text-center" style={{ borderBottom: '4px solid #22c55e' }}>
          <div style={{ color: '#22c55e', marginBottom: '8px' }}><CheckCircle size={24} /></div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{completed.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('completed')}</div>
        </div>
        <div className="premium-card text-center" style={{ borderBottom: '4px solid #ef4444' }}>
          <div style={{ color: '#ef4444', marginBottom: '8px' }}><AlertCircle size={24} /></div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{remaining.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('remaining')}</div>
        </div>
        <div className="premium-card text-center" style={{ borderBottom: '4px solid #F59E0B' }}>
          <div style={{ color: '#F59E0B', marginBottom: '8px' }}><TrendingUp size={24} /></div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{progressPercent}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('progress')}</div>
        </div>
        <div className="premium-card text-center" style={{ borderBottom: '4px solid #3B82F6' }}>
          <div style={{ color: '#3B82F6', marginBottom: '8px' }}><Clock size={24} /></div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{todaysCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('today')}</div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="premium-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontWeight: '600' }}>{t('overallJourney')}</span>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{progressPercent}%</span>
        </div>
        <div style={{ height: '12px', background: '#e5e7eb', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${progressPercent}%`, background: '#22c55e', height: '100%' }}></div>
          <div style={{ flex: 1, background: '#ef4444', height: '100%', opacity: 0.2 }}></div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          {t('reportDesc', [completed.toLocaleString(), total.toLocaleString()])}
        </p>
      </div>

      {/* Namaz Breakdown Table */}
      <div className="premium-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>{t('detailedBreakdown')}</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRTL ? 'right' : 'left' }}>
            <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <tr>
                <th style={{ padding: '12px 20px' }}>{t('colPrayer')}</th>
                <th style={{ padding: '12px 20px' }}>{t('colCompleted')}</th>
                <th style={{ padding: '12px 20px' }}>{t('colRemaining')}</th>
                <th style={{ padding: '12px 20px' }}>{t('colStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(stats.breakdown).map((key) => {
                const item = stats.breakdown[key];
                const status = getStatus(item.completed, item.total);
                return (
                  <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '600', textTransform: 'capitalize' }}>{t(key)}</td>
                    <td style={{ padding: '14px 20px' }}>{item.completed.toLocaleString()}</td>
                    <td style={{ padding: '14px 20px' }}>{(item.total - item.completed).toLocaleString()}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        background: `${status.color}22`, 
                        color: status.color,
                        fontWeight: '600'
                      }}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Daily Activity Tracker */}
        <div className="premium-card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
            <Calendar size={18} />
            <span style={{ fontWeight: 'bold' }}>{t('activeConsistency')}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {last14Days.map((day, i) => (
              <div 
                key={i} 
                title={`${day.date}: ${day.count} prayers`}
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '4px', 
                  background: day.count > 0 ? '#22c55e' : '#e5e7eb',
                  opacity: day.count > 0 ? Math.min(1, 0.4 + (day.count * 0.15)) : 1
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
            {t('consistencyDesc')}
          </p>
        </div>

        {/* Motivation Section */}
        <div className="premium-card" style={{ background: 'var(--primary)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
            <Heart size={18} />
            <span style={{ fontWeight: 'bold' }}>{t('divineMotivation')}</span>
          </div>
          <div style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '12px' }}>
            {t('motivationQuote')}
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            {t('motivationSub')}
          </p>
        </div>
      </div>
    </div>
  );
};
