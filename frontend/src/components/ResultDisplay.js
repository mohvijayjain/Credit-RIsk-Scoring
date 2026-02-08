import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { LiquidCard, CardContent, CardHeader } from './ui/liquid-glass-card';
import { LiquidButton } from './ui/liquid-glass-button';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const Strength = {
  None: "none",
  Weak: "weak",
  Moderate: "moderate",
  Strong: "strong",
};

// Utils Class
class Utils {
  static circumference(r) {
    return 2 * Math.PI * r;
  }

  static formatNumber(n) {
    return new Intl.NumberFormat('en-US').format(n);
  }

  static getStrength(score, maxScore) {
    if (!score && score !== 0) return Strength.None;
    const percent = score / maxScore;
    if (percent >= 0.8) return Strength.Strong;
    if (percent >= 0.4) return Strength.Moderate;
    return Strength.Weak;
  }
}

// Counter Context
const CounterContext = createContext(undefined);

const CounterProvider = ({ children }) => {
  const counterRef = useRef(0);
  const getNextIndex = useCallback(() => {
    return counterRef.current++;
  }, []);

  return (
    <CounterContext.Provider value={{ getNextIndex }}>
      {children}
    </CounterContext.Provider>
  );
};

const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context.getNextIndex;
};

// Components
function CreditScoreCard({ title, description, score, maxScore }) {
  const getNextIndex = useCounter();
  const indexRef = useRef(null);
  const [appearing, setAppearing] = useState(false);
  const strength = Utils.getStrength(score, maxScore);

  if (indexRef.current === null) {
    indexRef.current = getNextIndex();
  }

  useEffect(() => {
    const delay = 300 + indexRef.current * 200;
    const timer = setTimeout(() => setAppearing(true), delay);
    return () => clearTimeout(timer);
  }, []);

  if (!appearing) return null;

  const getBadgeClassName = (strength) => {
    switch (strength) {
      case Strength.Weak:
        return 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      case Strength.Moderate:
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
      case Strength.Strong:
        return 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      default:
        return '';
    }
  };

  return (
    <LiquidCard className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-800">
      <CardContent className="p-9">
        <CardHeader className="flex flex-row items-center justify-between gap-6 pb-10 px-0 animate-in fade-in slide-in-from-bottom-12 duration-800">
          <h2 className="text-xl font-medium truncate">{title}</h2>
          {strength !== Strength.None && (
            <LiquidButton
              className={`uppercase text-xs font-semibold shrink-0 h-8 ${getBadgeClassName(strength)}`}
            >
              {strength}
            </LiquidButton>
          )}
        </CardHeader>

        <div className="relative mb-8 animate-in fade-in slide-in-from-bottom-12 duration-800 delay-100" style={{ minHeight: '200px' }}>
          <HalfCircleGauge value={score} max={maxScore} strength={strength} />
          <ScoreDisplay value={score} max={maxScore} />
        </div>

        <p className="text-muted-foreground text-center mb-9 min-h-[4.5rem] animate-in fade-in slide-in-from-bottom-12 duration-800 delay-200">
          {description}
        </p>
      </CardContent>
    </LiquidCard>
  );
}

function HalfCircleGauge({ value, max, strength }) {
  const strokeRef = useRef(null);
  const gradId = useRef(`grad-${Math.random().toString(36).substr(2, 9)}`).current;
  const radius = 45;
  const circumference = Utils.circumference(radius);
  const halfCircum = circumference / 2;
  const strokeDasharray = `${halfCircum} ${halfCircum}`;
  const distForValue = value !== null ? Math.min(value / max, 1) * -halfCircum : -(halfCircum / 2);

  const strengthColors = {
    [Strength.None]: ['hsl(220, 13%, 69%)', 'hsl(220, 9%, 46%)'],
    [Strength.Weak]: ['hsl(0, 84%, 80%)', 'hsl(0, 84%, 60%)', 'hsl(0, 84%, 40%)'],
    [Strength.Moderate]: ['hsl(38, 92%, 80%)', 'hsl(38, 92%, 60%)', 'hsl(38, 92%, 40%)'],
    [Strength.Strong]: ['hsl(142, 71%, 80%)', 'hsl(142, 71%, 60%)', 'hsl(142, 71%, 40%)'],
  };

  const colorStops = strengthColors[strength];

  useEffect(() => {
    if (strokeRef.current) {
      strokeRef.current.animate(
        [
          { strokeDashoffset: '0', offset: 0 },
          { strokeDashoffset: '0', offset: 400 / 1400 },
          { strokeDashoffset: distForValue.toString() },
        ],
        {
          duration: 1400,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          fill: 'forwards',
        }
      );
    }
  }, [value, max, distForValue]);

  return (
    <svg className="block mx-auto w-auto max-w-full h-36" viewBox="0 0 100 50" aria-hidden="true">
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
        <circle className="stroke-muted/20" r={radius} />
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

function ScoreDisplay({ value, max }) {
  const hasValue = value !== null;
  const digits = hasValue ? String(Math.floor(value)).split('') : [];
  const maxFormatted = Utils.formatNumber(max);
  const percentage = hasValue ? ((value / max) * 100).toFixed(1) : '0';
  const label = hasValue ? `out of ${maxFormatted} (${percentage}%)` : 'No score';

  return (
    <div className="absolute bottom-0 w-full text-center" style={{ marginBottom: '-20px' }}>
      <div className="text-5xl font-bold h-16 overflow-hidden relative text-gray-800">
        <div className="absolute inset-0 opacity-0">
          <div className="inline-block">0</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {hasValue ? (
            <span className="animate-in slide-in-from-bottom-full duration-800 fill-mode-both">
              {value}
            </span>
          ) : (
            <span>-</span>
          )}
        </div>
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wide mt-1 font-medium">{label}</div>
    </div>
  );
}

function RiskFactorCard({ factors }) {
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
    <LiquidCard className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-800">
      <CardContent className="p-9">
        <CardHeader className="flex flex-row items-center justify-between gap-6 pb-10 px-0">
          <h2 className="text-xl font-medium">Key Risk Factors</h2>
        </CardHeader>

        <div className="space-y-3">
          {factors.slice(0, 5).map((factor, index) => {
            const percentage = factor.percentage || 50;
            const getBarColor = () => {
              if (percentage >= 80) return 'from-green-400 to-green-600';
              if (percentage >= 50) return 'from-yellow-400 to-yellow-600';
              return 'from-red-400 to-red-600';
            };

            return (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl animate-in fade-in slide-in-from-left duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {factor.feature}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-1000 ease-out`}
                    style={{
                      width: `${percentage}%`,
                      animationDelay: `${index * 100 + 300}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </LiquidCard>
  );
}

function InsightsCard({ decision, metadata, creditScore }) {
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

  const getInterestRate = () => {
    if (creditScore >= 750) return '7.5% - 9.5%';
    if (creditScore >= 650) return '9.5% - 12.5%';
    if (creditScore >= 550) return '12.5% - 16%';
    return '16%+';
  };

  const getLoanAmount = () => {
    if (decision === 'Rejected') return 'Not eligible';
    if (creditScore >= 750) return 'Up to ₹50L';
    if (creditScore >= 650) return 'Up to ₹30L';
    return 'Up to ₹15L';
  };

  const insights = [
    {
      icon: DollarSign,
      title: 'Expected Rate',
      value: getInterestRate(),
      color: 'from-pink-200 to-rose-200 border-pink-300/50',
    },
    {
      icon: Calendar,
      title: 'Loan Amount',
      value: getLoanAmount(),
      color: 'from-purple-200 to-indigo-200 border-purple-300/50',
    },
    {
      icon: TrendingUp,
      title: 'DTI Ratio',
      value: metadata?.dti_ratio ? `${(metadata.dti_ratio * 100).toFixed(1)}%` : 'N/A',
      color: 'from-blue-200 to-cyan-200 border-blue-300/50',
    },
  ];

  return (
    <LiquidCard className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-800">
      <CardContent className="p-9">
        <CardHeader className="flex flex-row items-center justify-between gap-6 pb-6 px-0">
          <h2 className="text-xl font-medium">Financial Insights</h2>
        </CardHeader>

        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 bg-gradient-to-r ${insight.color} border shadow-sm rounded-2xl animate-in fade-in slide-in-from-right duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center">
                    <insight.icon className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="font-medium text-gray-800">{insight.title}</span>
                </div>
                <span className="font-semibold text-gray-800">{insight.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </LiquidCard>
  );
}

// Main Component
export default function ResultDisplay({ data, onReset }) {
  // Handle undefined or null data
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { probability, decision, risk_level, risk_factors = [], metadata = {} } = data;
  const creditScore = metadata.credit_score || 500;

  // Calculate probability score (inverse of default probability)
  const probabilityScore = Math.round((1 - probability) * 100);

  const getDecisionIcon = () => {
    if (decision === 'Approved') return CheckCircle2;
    if (decision === 'Rejected') return XCircle;
    return AlertTriangle;
  };

  const getDecisionColor = () => {
    if (decision === 'Approved') return 'from-green-500 to-emerald-600';
    if (decision === 'Rejected') return 'from-red-500 to-rose-600';
    return 'from-yellow-500 to-orange-600';
  };

  const DecisionIcon = getDecisionIcon();

  return (
    <div className="flex flex-wrap items-start justify-center gap-6 mx-auto py-6 px-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* New Assessment Button */}
      <div className="w-full max-w-6xl animate-in fade-in slide-in-from-top-4 duration-500">
        <LiquidButton
          onClick={onReset}
          className="h-14 text-base px-8 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          New Assessment
        </LiquidButton>
      </div>

      {/* Status Banner */}
      <div className="w-full max-w-6xl">
        <div className={`bg-gradient-to-r ${getDecisionColor()} text-white rounded-3xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-8 duration-800`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <DecisionIcon className="w-12 h-12" />
              <div>
                <div className="text-2xl font-bold">Application {decision}</div>
                <div className="text-white/90">Risk Level: {risk_level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Default Probability</div>
              <div className="text-3xl font-bold">{(probability * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>

      <CounterProvider>
        {/* Credit Score Card */}
        <CreditScoreCard
          title="Credit Score"
          description="Your credit score reflects your creditworthiness. A higher score indicates better credit health and lower default risk."
          score={creditScore}
          maxScore={900}
        />

        {/* Approval Probability Card */}
        <CreditScoreCard
          title="Approval Strength"
          description="This score represents your approval likelihood based on all financial factors. Higher scores indicate stronger applications."
          score={probabilityScore}
          maxScore={100}
        />

        {/* Risk Factors */}
        {risk_factors.length > 0 && <RiskFactorCard factors={risk_factors} />}

        {/* Financial Insights */}
        <InsightsCard
          decision={decision}
          metadata={metadata}
          creditScore={creditScore}
        />
      </CounterProvider>
    </div>
  );
}
