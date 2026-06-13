import React, { useState, useEffect } from 'react';
import './index.css';
import { translations } from './translations.js';
import MascotLogo from './components/MascotLogo.jsx';
import ChatInterface from './components/ChatInterface.jsx';
import EligibilityWizard from './components/EligibilityWizard.jsx';
import DocumentChecklist from './components/DocumentChecklist.jsx';

const THEMES = [
  { id: 'seva-gold', label: '🌟 Seva Gold', desc: 'Warm orange' },
  { id: 'dark-velvet', label: '🌙 Dark Velvet', desc: 'Rich dark' },
  { id: 'emerald-care', label: '🌿 Emerald Care', desc: 'Fresh green' }
];

const LANGS = [
  { id: 'en', label: 'English', flag: '🇮🇳' },
  { id: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { id: 'ta', label: 'தமிழ்', flag: '🇮🇳' }
];

const TABS = ['chatTab', 'wizardTab', 'schemesTab', 'guideTab'];
const TAB_ICONS = ['💬', '🎯', '📜', '📖'];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('seva_theme') || 'seva-gold');
  const [lang, setLang] = useState(() => localStorage.getItem('seva_lang') || 'en');
  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('seva_gemini_key') || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const t = translations[lang];

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('seva_theme', theme);
  }, [theme]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('seva_lang', lang);
  }, [lang]);

  // Fetch schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      setSchemesLoading(true);
      try {
        const res = await fetch('/api/schemes');
        const data = await res.json();
        setSchemes(data);
      } catch (err) {
        console.error("Error loading schemes:", err);
      }
      setSchemesLoading(false);
    };

    if (activeTab === 2 && schemes.length === 0) {
      fetchSchemes();
    }
  }, [activeTab, schemes.length]);

  const openSettings = () => {
    setApiKeyInput(localStorage.getItem('seva_gemini_key') || '');
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('seva_gemini_key', apiKeyInput);
    setApiKey(apiKeyInput);
    setShowSettings(false);
  };

  return (
    <div className="glass-container">
      
      {/* Navigation Header */}
      <nav className="glass-nav no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab(0)}>
          <MascotLogo size={42} status="idle" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>SevaSetu</span>
            <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>सेवासेतु • சேவாசேது</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {TABS.map((tabKey, idx) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(idx)}
              className={`nav-tab ${activeTab === idx ? 'active' : ''}`}
            >
              <span>{TAB_ICONS[idx]}</span>
              <span className="md-only" style={{ display: 'inline' }}>{t[tabKey]}</span>
            </button>
          ))}
        </div>

        {/* Settings button */}
        <button 
          onClick={openSettings} 
          className="btn-secondary" 
          style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0 }}
        >
          ⚙️
        </button>
      </nav>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 0 && <ChatInterface lang={lang} apiKey={apiKey} />}
        
        {activeTab === 1 && <EligibilityWizard lang={lang} />}
        
        {activeTab === 2 && (
          <div className="glass-card animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h2 style={{ color: 'var(--primary)' }}>{t.schemesTab}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Discover welfare programs available for Indian citizens.</p>
            </div>

            {schemesLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
                <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
                <span>Loading schemes...</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', overflowY: 'auto', maxHeight: '65vh' }}>
                {schemes.map(scheme => (
                  <div 
                    key={scheme.id}
                    style={{
                      padding: '20px',
                      borderRadius: '20px',
                      border: '1.5px solid var(--border-color)',
                      background: 'rgba(255, 255, 255, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {scheme.name[lang] || scheme.name['en']}
                      </h4>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                        {scheme.description[lang] || scheme.description['en']}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        <span>🎁 <strong>Benefits:</strong> {scheme.benefits[lang] || scheme.benefits['en']}</span>
                        <span>📋 <strong>Criteria:</strong> {scheme.eligibility_criteria.text[lang] || scheme.eligibility_criteria.text['en']}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedScheme(scheme)} 
                      className="btn-primary"
                      style={{ fontSize: '13px', padding: '10px 16px', alignSelf: 'flex-start' }}
                    >
                      📋 {t.viewDetails}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="glass-card animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h2 style={{ color: 'var(--primary)' }}>{t.guideTitle}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{t.guideDesc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '65vh' }}>
              {[
                { q: t.faq1_q, a: t.faq1_a },
                { q: t.faq2_q, a: t.faq2_a },
                { q: t.faq3_q, a: t.faq3_a }
              ].map((faq, idx) => (
                <div key={idx} style={{ padding: '18px 22px', borderRadius: '18px', border: '1.5px solid var(--border-color)', background: 'rgba(255,255,255,0.4)' }}>
                  <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', gap: '8px' }}>
                    <span>❓</span>
                    <span>{faq.q}</span>
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '26px', lineHeight: '1.6' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay animate-fade">
          <div className="modal-container glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px' }}>⚙️ {t.settings}</h3>
              <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>&times;</button>
            </div>

            {/* Language Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.language}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {LANGS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: `2px solid ${lang === l.id ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: lang === l.id ? 'var(--accent-light)' : 'transparent',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.theme}</label>
              <select
                className="form-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                {THEMES.map(themeOption => (
                  <option key={themeOption.id} value={themeOption.id}>
                    {themeOption.label}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key Config */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.geminiKey}</label>
              <input
                type="password"
                className="form-input"
                placeholder={t.keyPlaceholder}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
              <button onClick={() => setShowSettings(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                {t.close}
              </button>
              <button onClick={handleSaveSettings} className="btn-primary" style={{ padding: '10px 20px' }}>
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected checklist Modal */}
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