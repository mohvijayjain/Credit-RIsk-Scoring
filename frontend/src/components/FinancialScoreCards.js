import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import './FinancialScoreCards.css';

// Strength Enum
const Strength = {
  None: 'none',
  Weak: 'weak',
  Moderate: 'moderate',
  Strong: 'strong',
};

// Sample Data - Financial Scores for Credit Risk
const data = [
  {
    title: "Credit Score",
    description:
      "Your credit score reflects your borrowing history. A higher score means better loan terms and faster approvals.",
    initialScore: 72,
    badge: "MODERATE"
  },
  {
    title: "Risk Assessment",
    description:
      "This measures your overall loan risk based on income, debt, and employment stability. Lower risk = better rates.",
    initialScore: 83,
    badge: "STRONG"
  },
  {
    title: "Financial Health",
    description:
      "Get your complete financial fitness score. Quick assessment, no impact on your credit report.",
    badge: null
  },
];

// Utility Functions
const Utils = {
  circumference: (r) => 2 * Math.PI * r,
  
  formatNumber: (n) => new Intl.NumberFormat('en-US').format(n),
  
  getStrength: (score, maxScore) => {
    if (!score) return Strength.None;
    const percent = score / maxScore;
    if (percent >= 0.8) return Strength.Strong;
    if (percent >= 0.4) return Strength.Moderate;
    return Strength.Weak;
  },
  
  randomHash: (length = 4) => {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  },
  
  randomInt: (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min,
};

// Counter Context for staggered animations
const CounterContext = createContext(undefined);

const CounterProvider = ({ children }) => {
  const counterRef = useRef(0);
  const getNextIndex = useCallback(() => counterRef.current++, []);
  return (
    <CounterContext.Provider value={{ getNextIndex }}>
      {children}
    </CounterContext.Provider>
  );
};

const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) throw new Error('useCounter must be used within CounterProvider');
  return context.getNextIndex;
};

// Sub-Components
function FinancialScoreButton({ children, onClick }) {
  return (
    <button className="score-button" onClick={onClick}>
      <span className="button-bg"></span>
      <span className="button-text">{children}</span>
    </button>
  );
}

function FinancialScoreCard({ children }) {
  const getNextIndex = useCounter();
  const indexRef = useRef(null);
  const [appearing, setAppearing] = useState(false);

  if (indexRef.current === null) {
    indexRef.current = getNextIndex();
  }

  useEffect(() => {
    const delay = 300 + indexRef.current * 200;
    const timer = setTimeout(() => setAppearing(true), delay);
    return () => clearTimeout(timer);
  }, []);

  if (!appearing) return null;

  return (
    <div className="liquid-card" style={{ animationDelay: `${indexRef.current * 0.15}s` }}>
      <div className="card-glass-effect"></div>
      <div className="card-content">{children}</div>
    </div>
  );
}

function FinancialScoreDisplay({ value, max }) {
  const hasValue = value !== null;
  const digits = hasValue ? String(Math.floor(value)).split('') : [];
  const maxFormatted = Utils.formatNumber(max);
  const percentage = hasValue ? ((value / max) * 100).toFixed(1) : '0';
  const label = hasValue ? `${percentage}% (out of ${maxFormatted})` : 'No score';

  return (
    <div className="score-display">
      <div className="score-value">
        {hasValue && digits.map((digit, i) => (
          <span
            key={i}
            className="digit"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
            {digit}
          </span>
        ))}
        {!hasValue && <span className="digit-placeholder">—</span>}
      </div>
      <div className="score-label">{label}</div>
    </div>
  );
}

function FinancialScoreHalfCircle({ value, max }) {
  const strokeRef = useRef(null);
  const gradIdRef = useRef(`grad-${Utils.randomHash()}`);
  const gradId = gradIdRef.current;
  const radius = 45;
  const dist = Utils.circumference(radius);
  const distHalf = dist / 2;
  const distFourth = distHalf / 2;
  const strokeDasharray = `${distHalf} ${distHalf}`;
  const distForValue = Math.min((value || 0) / max, 1) * -distHalf;
  const strokeDashoffset = value !== null ? distForValue : -distFourth;
  const strength = Utils.getStrength(value, max);

  const strengthColors = {
    none: ['#6b7280', '#4b5563'],
    weak: ['#f87171', '#ef4444', '#dc2626'],
    moderate: ['#fbbf24', '#f59e0b', '#d97706'],
    strong: ['#4ade80', '#22c55e', '#16a34a'],
  };

  const colorStops = strengthColors[strength];

  useEffect(() => {
    if (strokeRef.current) {
      strokeRef.current.animate(
        [
          { strokeDashoffset: '0', offset: 0 },
          { strokeDashoffset: '0', offset: 0.3 },
          { strokeDashoffset: strokeDashoffset.toString() },
        ],
        {
          duration: 1400,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          fill: 'forwards',
        }
      );
    }
  }, [value, max, strokeDashoffset]);

  return (
    <svg className="score-circle" viewBox="0 0 100 50" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          {colorStops.map((stop, i) => (
            <stop
              key={i}
              offset={`${(100 / (colorStops.length - 1)) * i}%`}
              stopColor={stop}
            />
          ))}
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="10" transform="translate(50, 50.5)">
        <circle className="circle-bg" r={radius} />
        <circle
          ref={strokeRef}
          stroke={`url(#${gradId})`}
          strokeDasharray={strokeDasharray}
          r={radius}
        />
      </g>
    </svg>
  );
}

function FinancialScoreHeader({ title, strength, badge }) {
  const hasStrength = strength !== Strength.None;

  const getStrengthClass = (s) => {
    switch (s) {
      case Strength.Weak: return 'badge-weak';
      case Strength.Moderate: return 'badge-moderate';
      case Strength.Strong: return 'badge-strong';
      default: return '';
    }
  };

  const getBadgeClass = (b) => {
    if (!b) return '';
    const lower = b.toLowerCase();
    if (lower === 'moderate') return 'badge-moderate';
    if (lower === 'strong') return 'badge-strong';
    if (lower === 'weak') return 'badge-weak';
    return '';
  };

  return (
    <div className="score-header">
      <h2 className="score-title">{title}</h2>
      {badge && (
        <span className={`strength-badge ${getBadgeClass(badge)}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

function FinancialScore({ title, description, initialScore, badge }) {
  const [score, setScore] = useState(initialScore ?? null);
  const hasScore = score !== null;
  const max = 100;
  const strength = Utils.getStrength(score, max);

  const handleGenerateScore = () => {
    if (!hasScore) {
      setScore(Utils.randomInt(0, max));
    }
  };

  return (
    <FinancialScoreCard>
      <FinancialScoreHeader title={title} strength={strength} badge={badge} />
      <div className="score-visual">
        <FinancialScoreHalfCircle value={score} max={max} />
        <FinancialScoreDisplay value={score} max={max} />
      </div>
      <p className="score-description">{description}</p>
      <FinancialScoreButton onClick={handleGenerateScore}>
        {hasScore ? 'View Details' : 'Calculate Score'}
      </FinancialScoreButton>
    </FinancialScoreCard>
  );
}

// Main Export Component
export default function FinancialScoreCards() {
  return (
    <section className="financial-scores-section">
      <div className="scores-header">
        <span className="scores-caption">FINANCIAL INSIGHTS</span>
        <h2 className="scores-title">Your Financial Dashboard</h2>
        <p className="scores-subtitle">
          Get instant insights into your financial health and creditworthiness
        </p>
      </div>
      <div className="scores-grid">
        <CounterProvider>
          {data.map((card, i) => (
            <FinancialScore key={i} {...card} />
          ))}
        </CounterProvider>
      </div>
    </section>
  );
}
