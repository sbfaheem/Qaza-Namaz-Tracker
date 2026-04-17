import React, { useState } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { GENDER, getDefaultUserState } from '../utils/qazaLogic';
import { useLanguage } from '../context/LanguageContext';

export const Onboarding = ({ onComplete }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: GENDER.MALE,
    startYear: new Date().getFullYear(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dob || !formData.startYear) return;
    
    const userState = getDefaultUserState(formData);
    onComplete(userState);
  };

  return (
    <div className="onboarding-container container">
      <div className="onboarding-header">
        <h2 className="section-title">{t('welcomeTo')}</h2>
        <p className="section-subtitle">{t('calcJourney')}</p>
      </div>

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="input-group">
          <label className="input-label">{t('fullName')}</label>
          <input
            type="text"
            className="modern-input"
            placeholder="e.g. Abdullah"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">{t('dob')}</label>
          <div className="input-wrapper">
            <Calendar className="input-icon" size={20} />
            <input
              type="date"
              required
              className="modern-input icon-indent"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">{t('gender')}</label>
          <div className="gender-toggle">
            <button
              type="button"
              className={`gender-btn ${formData.gender === GENDER.MALE ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, gender: GENDER.MALE })}
            >
              <User size={20} /> {t('male')}
            </button>
            <button
              type="button"
              className={`gender-btn ${formData.gender === GENDER.FEMALE ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, gender: GENDER.FEMALE })}
            >
              <User size={20} /> {t('female')}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">{t('startPrayingYear')}</label>
          <input
            type="number"
            required
            min="1900"
            max={new Date().getFullYear()}
            className="modern-input"
            placeholder="e.g. 2012"
            value={formData.startYear}
            onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
          />
          <p className="input-hint">{t('onboardingHint')}</p>
        </div>

        <button type="submit" className="calculate-btn">
          {t('calculateBtn')} <ArrowRight size={20} />
        </button>
      </form>
      
      <div className="onboarding-footer">
        <div className="footer-tag">
          <div className="tag-icon">🔒</div>
          <span>{t('private')}</span>
        </div>
        <div className="footer-tag">
          <div className="tag-icon">✨</div>
          <span>{t('accurate')}</span>
        </div>
        <div className="footer-tag">
          <div className="tag-icon">❤️</div>
          <span>{t('supportive')}</span>
        </div>
      </div>
    </div>
  );
};
