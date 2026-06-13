import React, { useState } from 'react';
import { translations } from '../translations.js';

export default function DocumentChecklist({ scheme, lang, onClose }) {
  const t = translations[lang];
  const [checked, setChecked] = useState({});
  const [smsNumber, setSmsNumber] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [showSmsInput, setShowSmsInput] = useState(false);

  if (!scheme) return null;

  const docs = scheme.documents[lang] || scheme.documents['en'] || [];

  const handleToggle = (index) => {
    setChecked((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendSms = (e) => {
    e.preventDefault();
    if (smsNumber.trim().length === 10) {
      setSmsSent(true);
      setTimeout(() => {
        setSmsSent(false);
        setShowSmsInput(false);
        setSmsNumber('');
      }, 3000);
    }
  };

  return (
    <div className="modal-overlay no-print animate-fade">
      <div className="modal-container large glass-card" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {scheme.name[lang] || scheme.name['en']}
            </h2>
            <button 
              onClick={onClose} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: 'var(--text-secondary)' }}
            >
              &times;
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2" style={{ color: 'var(--text-secondary)' }}>
            {t.documentsTitle}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1" style={{ overflowY: 'auto' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {t.checklistDesc}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {docs.map((doc, idx) => (
              <label 
                key={idx} 
                className="flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-orange-50/20"
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  border: '1.5px solid var(--border-color)',
                  background: checked[idx] ? 'var(--accent-light)' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={!!checked[idx]} 
                  onChange={() => handleToggle(idx)}
                  className="mt-1"
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <span className={`text-sm ${checked[idx] ? 'line-through text-gray-400' : ''}`} style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                  {doc}
                </span>
              </label>
            ))}
          </div>

          {scheme.apply_link && (
            <div className="mb-6">
              <a 
                href={scheme.apply_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline"
                style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                🔗 {t.officialLink}
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50/50 flex flex-col gap-4" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex gap-3 justify-end" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setShowSmsInput(!showSmsInput)} 
              className="btn-secondary"
            >
              💬 {t.shareSms}
            </button>
            <button 
              onClick={handlePrint} 
              className="btn-primary"
            >
              🖨️ {t.printChecklist}
            </button>
          </div>

          {showSmsInput && (
            <form onSubmit={handleSendSms} className="flex gap-2 p-3 bg-white border rounded-2xl animate-fade" style={{ display: 'flex', gap: '8px', padding: '12px', border: '1.5px solid var(--border-color)', borderRadius: '16px', backgroundColor: '#fff' }}>
              <input 
                type="tel" 
                pattern="[0-9]{10}"
                placeholder={t.smsPlaceholder} 
                value={smsNumber} 
                onChange={(e) => setSmsNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="form-input"
                style={{ flex: 1, padding: '10px 14px' }}
                required 
              />
              <button 
                type="submit" 
                className="btn-primary"
                style={{ padding: '10px 20px' }}
              >
                {t.sendSms}
              </button>
            </form>
          )}

          {smsSent && (
            <div className="p-3 text-center bg-green-50 text-green-700 rounded-2xl animate-fade" style={{ padding: '12px', textAlign: 'center', backgroundColor: 'var(--accent-light)', color: 'var(--text-secondary)', borderRadius: '16px', fontSize: '14px', fontWeight: '500' }}>
              ✅ {t.smsSent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}