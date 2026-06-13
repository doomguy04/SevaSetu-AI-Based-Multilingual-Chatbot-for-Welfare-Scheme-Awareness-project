import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../translations.js';
import MascotLogo from './MascotLogo.jsx';

function MarkdownRenderer({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div>
      {lines.map((line, i) => {
        // bold formatting
        let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // bullet point list items
        if (formattedLine.startsWith('- ') || formattedLine.startsWith('• ')) {
          return (
            <div 
              key={i} 
              style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}
              dangerouslySetInnerHTML={{ __html: `<span>•</span><span>${formattedLine.slice(2)}</span>` }} 
            />
          );
        }
        
        if (formattedLine.trim() === '') {
          return <div key={i} style={{ height: 8 }} />;
        }
        
        return <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      })}
    </div>
  );
}

export default function ChatInterface({ lang, apiKey }) {
  const t = translations[lang];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mascotStatus, setMascotStatus] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const quickPrompts = [t.prompt1, t.prompt2, t.prompt3];

  // Initialize messages on language change
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: lang === 'hi'
          ? `नमस्ते! मैं **सेवा** हूँ, आपकी सरकारी कल्याणकारी योजनाओं की मार्गदर्शक। मैं आपको PM-KISAN, आयुष्मान भारत, PMAY, उज्ज्वला, मनरेगा, और कई अन्य योजनाओं के बारे में सटीक जानकारी दे सकती हूँ। आप मुझसे क्या जानना चाहते हैं? 🙏`
          : lang === 'ta'
          ? `வணக்கம்! நான் **சேவா**, உங்களுக்கு அரசு நலத்திட்டங்கள் பற்றிய விவரங்கள் அளிக்க இங்கே இருக்கிறேன். PM-KISAN, ஆயுஷ்மான் பாரத், PMAY, உஜ்வாலா, MGNREGA உள்ளிட்ட திட்டங்கள் பற்றி கேளுங்கள். 🙏`
          : `Hello! I'm **Seva**, your AI assistant for discovering government welfare schemes in India. I can help you with accurate, grounded information about PM-KISAN, Ayushman Bharat, PMAY, Ujjwala, MGNREGA, Mudra Loan, and more. What would you like to know? 🙏`
      }
    ]);
  }, [lang]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customText = '') => {
    const textToSend = customText || input.trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setMascotStatus('thinking');

    // Build chat history for model context (sender must be 'user' or 'model')
    const history = newMessages.slice(0, -1).map(msg => ({
      sender: msg.sender === 'user' ? 'user' : 'model',
      text: msg.text
    }));

    try {
      const storedKey = localStorage.getItem('seva_gemini_key') || '';
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: history,
          language: lang,
          customApiKey: storedKey || apiKey || undefined
        })
      });
      const data = await response.json();
      
      const botResponse = data.text || data.error || 'Sorry, I encountered an issue. Please try again.';
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse
      }]);
      
      setMascotStatus('speaking');
      setTimeout(() => setMascotStatus('idle'), 3000);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I could not connect to the server. Please try again.'
      }]);
      setMascotStatus('idle');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice Speech to Text
  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser. Please try Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setMascotStatus('listening');
    };

    recognition.onend = () => {
      setIsListening(false);
      setMascotStatus('idle');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      inputRef.current?.focus();
    };

    recognition.onerror = () => {
      setIsListening(false);
      setMascotStatus('idle');
    };

    recognition.start();
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setMascotStatus('idle');
  };

  // Voice Text to Speech
  const toggleSpeech = (msg) => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (activeVoiceId === msg.id) {
          setIsSpeaking(false);
          setActiveVoiceId(null);
          return;
        }
      }

      // Clean up markdown markers before speaking
      const textToSpeak = msg.text.replace(/\*\*/g, '');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.9;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveVoiceId(null);
      };
      
      setActiveVoiceId(msg.id);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const hasApiKey = !!(localStorage.getItem('seva_gemini_key') || apiKey);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      
      {/* Bot Header Card */}
      <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <MascotLogo size={52} status={mascotStatus} />
          <div>
            <h3 style={{ fontSize: '18px', lineHeight: '1.2' }}>{t.title}</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.subtitle}</span>
          </div>
        </div>
        
        {/* API Connection Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: hasApiKey ? '#22c55e' : '#eab308',
            boxShadow: hasApiKey ? '0 0 8px #22c55e' : '0 0 8px #eab308'
          }} />
          <span style={{ color: hasApiKey ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {hasApiKey ? t.connected : t.notConnected}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="glass-card" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '16px', minHeight: '350px' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              {msg.sender === 'bot' && (
                <div style={{ flexShrink: 0, marginTop: '4px' }}>
                  <MascotLogo size={32} status={activeVoiceId === msg.id ? 'speaking' : 'idle'} />
                </div>
              )}
              <div 
                style={{
                  maxWidth: '75%',
                  padding: '12px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? 'var(--bubble-user)' : 'var(--bubble-model)',
                  color: msg.sender === 'user' ? 'var(--bubble-user-text)' : 'var(--bubble-model-text)',
                  boxShadow: 'var(--shadow)',
                  position: 'relative',
                  fontSize: '15px'
                }}
              >
                <MarkdownRenderer text={msg.text} />
                
                {/* Text to Speech trigger */}
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => toggleSpeech(msg)}
                    style={{
                      position: 'absolute',
                      right: '-32px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '16px',
                      opacity: 0.6
                    }}
                    title={activeVoiceId === msg.id ? t.stop : t.speak}
                  >
                    {activeVoiceId === msg.id ? '⏹️' : '🔊'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <MascotLogo size={32} status="thinking" />
              <div style={{
                padding: '12px 20px',
                borderRadius: '18px 18px 18px 2px',
                background: 'var(--bubble-model)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                gap: '6px',
                alignItems: 'center'
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '50%',
                    animation: 'soundwave 0.8s ease-in-out infinite alternate',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 4px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', alignSelf: 'center', color: 'var(--text-muted)' }}>{t.quickPrompts}</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="btn-secondary"
            style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '13px' }}
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1.5px solid var(--border-color)',
            background: isListening ? 'var(--primary-gradient)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0
          }}
          title={t.voicePrompt}
        >
          {isListening ? (
            <div className="speech-wave">
              <div className="speech-bar" />
              <div className="speech-bar" />
              <div className="speech-bar" />
              <div className="speech-bar" />
            </div>
          ) : '🎤'}
        </button>
        
        <input
          ref={inputRef}
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          placeholder={isListening ? t.listening : t.chatPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading || isListening}
        />
        
        <button
          className="btn-primary"
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            padding: 0,
            fontSize: '18px',
            flexShrink: 0,
            opacity: (!input.trim() || loading) ? 0.5 : 1
          }}
          title={t.send}
        >
          ➔
        </button>
      </div>

    </div>
  );
}