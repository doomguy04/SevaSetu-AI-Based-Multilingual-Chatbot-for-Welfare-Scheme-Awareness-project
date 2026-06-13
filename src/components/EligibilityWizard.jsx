import React, { useState } from 'react';
import { translations } from '../translations.js';
import DocumentChecklist from './DocumentChecklist.jsx';

const STEPS = ['q1', 'q2', 'q3', 'q4', 'q5'];

const initialAnswers = {
  occupation: '',
  income: '',
  ownsLand: '',
  age: '',
  gender: '',
  hasGirlChild: ''
};

export default function EligibilityWizard({ lang }) {
  const t = translations[lang];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      calculateEligibility();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers(initialAnswers);
    setResults(null);
  };

  const selectAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateEligibility = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error calculating eligibility:', error);
    }
    setLoading(false);
  };

  const isStepComplete = () => {
    if (step === 0) return !!answers.occupation;
    if (step === 1) return !!answers.income;
    if (step === 2) return !!answers.ownsLand;
    if (step === 3) return !!answers.age && !!answers.gender;
    if (step === 4) return !!answers.hasGirlChild;
    return false;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-fade">
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>{t.q1}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { key: 'farmer', emoji: '🚜', label: t.occupations.farmer },
                { key: 'worker', emoji: '🔨', label: t.occupations.worker },
                { key: 'entrepreneur', emoji: '💼', label: t.occupations.entrepreneur },
                { key: 'unemployed', emoji: '🎓', label: t.occupations.unemployed },
                { key: 'other', emoji: '👤', label: t.occupations.other }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer('occupation', opt.key)}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '16px',
                    border: `2px solid ${answers.occupation === opt.key ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: answers.occupation === opt.key ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fade">
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>{t.q2}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { key: 'low', emoji: '🪙', label: t.incomes.low },
                { key: 'medium', emoji: '💵', label: t.incomes.medium },
                { key: 'high', emoji: '💰', label: t.incomes.high },
                { key: 'veryHigh', emoji: '💎', label: t.incomes.veryHigh }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer('income', opt.key)}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '16px',
                    border: `2px solid ${answers.income === opt.key ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: answers.income === opt.key ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade">
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>{t.q3}</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { key: 'yes', emoji: '🌱', label: t.yes },
                { key: 'no', emoji: '🏢', label: t.no }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer('ownsLand', opt.key)}
                  style={{
                    flex: 1,
                    padding: '24px 16px',
                    borderRadius: '16px',
                    border: `2px solid ${answers.ownsLand === opt.key ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: answers.ownsLand === opt.key ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{opt.emoji}</span>
                  <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '20px' }}>{t.q4}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.ageLabel}</label>
              <input
                type="number"
                min="0"
                max="120"
                value={answers.age}
                onChange={(e) => selectAnswer('age', e.target.value)}
                className="form-input"
                placeholder="e.g. 35"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.genderLabel}</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { key: 'male', label: t.male },
                  { key: 'female', label: t.female },
                  { key: 'other', label: t.other }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => selectAnswer('gender', opt.key)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      border: `2px solid ${answers.gender === opt.key ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: answers.gender === opt.key ? 'var(--accent-light)' : 'transparent',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade">
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>{t.q5}</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { key: 'yes', emoji: '👧', label: t.yes },
                { key: 'no', emoji: '✖️', label: t.no }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer('hasGirlChild', opt.key)}
                  style={{
                    flex: 1,
                    padding: '24px 16px',
                    borderRadius: '16px',
                    border: `2px solid ${answers.hasGirlChild === opt.key ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: answers.hasGirlChild === opt.key ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{opt.emoji}</span>
                  <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (results) {
    const eligibleCount = results.filter(r => r.eligible).length;
    return (
      <div className="glass-card animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{t.resultsTitle}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.eligibleCount.replace('{count}', eligibleCount).replace('{total}', results.length)}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '55vh' }}>
          {results.filter(r => r.eligible).map(res => (
            <div 
              key={res.scheme.id} 
              style={{
                padding: '20px',
                borderRadius: '18px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '17px', marginBottom: '6px' }}>
                  {res.scheme.name[lang] || res.scheme.name['en']}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  {res.scheme.description[lang] || res.scheme.description['en']}
                </p>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '6px', flexDirection: 'column' }}>
                  <span>🎁 <strong>Benefits:</strong> {res.scheme.benefits[lang] || res.scheme.benefits['en']}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedScheme(res.scheme)} 
                className="btn-primary" 
                style={{ fontSize: '13px', padding: '10px 18px', flexShrink: 0 }}
              >
                📋 {t.viewDetails}
              </button>
            </div>
          ))}

          {eligibleCount === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔍</span>
              {t.noSchemes}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <button onClick={handleRestart} className="btn-secondary">
            🔄 {t.restart}
          </button>
        </div>

        {selectedScheme && (
          <DocumentChecklist 
            scheme={selectedScheme} 
            lang={lang} 
            onClose={() => setSelectedScheme(null)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      
      {/* Progress Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        {STEPS.map((_, idx) => (
          <div 
            key={idx}
            style={{
              width: idx === step ? '28px' : '10px',
              height: '10px',
              borderRadius: '99px',
              background: idx <= step ? 'var(--primary-gradient)' : 'var(--border-color)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Step {step + 1} of {STEPS.length}
      </div>

      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Calculating Eligibility...</span>
          </div>
        ) : (
          renderStep()
        )}
      </div>

      {!loading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <button 
            type="button" 
            onClick={handleBack} 
            disabled={step === 0} 
            className="btn-secondary"
            style={{ opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← {t.back}
          </button>
          <button 
            type="button" 
            onClick={handleNext} 
            disabled={!isStepComplete()} 
            className="btn-primary"
            style={{ opacity: !isStepComplete() ? 0.5 : 1, cursor: !isStepComplete() ? 'not-allowed' : 'pointer' }}
          >
            {step === STEPS.length - 1 ? t.calculate : t.next} →
          </button>
        </div>
      )}
    </div>
  );
}