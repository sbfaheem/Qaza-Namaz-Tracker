import React, { useState } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { GENDER, getDefaultUserState } from '../utils/qazaLogic';

export const Onboarding = ({ onComplete }) => {
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
        <h2 className="section-title">Welcome to Al-Mihrab</h2>
        <p className="section-subtitle">Let's calculate your prayer journey</p>
      </div>

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="input-group">
          <label className="input-label">Full Name (Optional)</label>
          <input
            type="text"
            className="modern-input"
            placeholder="e.g. Abdullah"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Date of Birth</label>
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
          <label className="input-label">Gender</label>
          <div className="gender-toggle">
            <button
              type="button"
              className={`gender-btn ${formData.gender === GENDER.MALE ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, gender: GENDER.MALE })}
            >
              <User size={20} /> Male
            </button>
            <button
              type="button"
              className={`gender-btn ${formData.gender === GENDER.FEMALE ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, gender: GENDER.FEMALE })}
            >
              <User size={20} /> Female
            </button>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Year Started Praying Regularly</label>
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
          <p className="input-hint">We use this to estimate your total missed prayers from the age of maturity (Bulugh).</p>
        </div>

        <button type="submit" className="calculate-btn">
          Calculate Qaza Namaz <ArrowRight size={20} />
        </button>
      </form>
      
      <div className="onboarding-footer">
        <div className="footer-tag">
          <div className="tag-icon">🔒</div>
          <span>PRIVATE</span>
        </div>
        <div className="footer-tag">
          <div className="tag-icon">✨</div>
          <span>ACCURATE</span>
        </div>
        <div className="footer-tag">
          <div className="tag-icon">❤️</div>
          <span>SUPPORTIVE</span>
        </div>
      </div>
    </div>
  );
};
