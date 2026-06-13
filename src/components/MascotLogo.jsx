import React from 'react';

export default function MascotLogo({ size = 48, status = 'idle', className = '' }) {
  // Define eye heights based on status
  // status: 'idle' | 'listening' | 'thinking' | 'speaking'
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--secondary)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--text-muted)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g className="antenna">
          <line x1="50" y1="25" x2="50" y2="10" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" />
          <circle 
            cx="50" 
            cy="10" 
            r="8" 
            fill="var(--accent)" 
            style={{ 
              animation: isThinking ? 'pulse-glow 0.8s infinite alternate' : isListening ? 'pulse-glow 0.4s infinite alternate' : 'none', 
              transformOrigin: '50px 10px' 
            }} 
            filter="url(#glow)" 
          />
        </g>
        <rect x="16" y="40" width="10" height="20" rx="4" fill="var(--text-secondary)" />
        <rect x="74" y="40" width="10" height="20" rx="4" fill="var(--text-secondary)" />
        <rect 
          x="22" 
          y="25" 
          width="56" 
          height="50" 
          rx="18" 
          fill="url(#faceGrad)" 
          stroke="var(--text-primary)" 
          strokeWidth="3.5" 
          style={{ 
            animation: isSpeaking ? 'float 1.2s infinite ease-in-out' : 'none',
            transformOrigin: '50px 50px'
          }} 
        />
        <rect x="28" y="31" width="44" height="32" rx="10" fill="var(--text-primary)" />
        <g fill="var(--primary-light)">
          <ellipse 
            cx="41" 
            cy="46" 
            rx="5.5" 
            ry={isListening ? 2 : isThinking ? 1 : 5.5} 
            style={{ 
              animation: isThinking || isListening ? 'none' : 'blink 4s infinite ease-in-out', 
              transformOrigin: '41px 46px' 
            }} 
          />
          <ellipse 
            cx="59" 
            cy="46" 
            rx="5.5" 
            ry={isListening ? 2 : isThinking ? 1 : 5.5} 
            style={{ 
              animation: isThinking || isListening ? 'none' : 'blink 4s infinite ease-in-out', 
              transformOrigin: '59px 46px', 
              animationDelay: '0.1s' 
            }} 
          />
        </g>
        <circle cx="34" cy="54" r="3" fill="#f43f5e" opacity="0.6" filter="url(#glow)" />
        <circle cx="66" cy="54" r="3" fill="#f43f5e" opacity="0.6" filter="url(#glow)" />
        {isListening ? (
          <line x1="44" y1="54" x2="56" y2="54" stroke="var(--primary-light)" strokeWidth="2.5" strokeLinecap="round" />
        ) : isThinking ? (
          <circle cx="50" cy="54" r="2.5" fill="var(--primary-light)" />
        ) : (
          <path d="M 44 52 Q 50 59 56 52" fill="none" stroke="var(--primary-light)" strokeWidth="3" strokeLinecap="round" />
        )}
        <path 
          d="M 50 20 L 52 18 A 2.5 2.5 0 0 0 48 18 Z" 
          fill="#ef4444" 
          transform="scale(0.8) translate(12, 18)" 
        />
      </svg>
    </div>
  );
}