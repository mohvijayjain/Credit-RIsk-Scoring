import React from 'react';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import './StatsGrid.css';

const stats = [
  {
    number: '50K+',
    label: 'Users Trust Us',
    icon: Users,
  },
  {
    number: '98%',
    label: 'Approval Accuracy',
    icon: TrendingUp,
  },
  {
    number: '₹500Cr+',
    label: 'Loans Processed',
    icon: DollarSign,
  },
  {
    number: '24/7',
    label: 'AI Support',
    icon: Clock,
  },
];

const GridPattern = ({ patternId }) => {
  const squares = Array.from({ length: 5 }, () => [
    Math.floor(Math.random() * 4) + 7,
    Math.floor(Math.random() * 6) + 1,
  ]);

  return (
    <svg aria-hidden="true" className="grid-pattern-svg">
      <defs>
        <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse" x="-12" y="4">
          <path d="M.5 20V.5H20" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      <svg x="-12" y="4" className="grid-pattern-squares">
        {squares.map(([x, y], index) => (
          <rect key={index} strokeWidth="0" width="21" height="21" x={x * 20} y={y * 20} />
        ))}
      </svg>
    </svg>
  );
};

const StatCard = ({ stat, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const Icon = stat.icon;
  const patternId = `pattern-${index}`;

  const CardWrapper = shouldReduceMotion ? 'div' : motion.div;
  const cardProps = shouldReduceMotion 
    ? {} 
    : {
        initial: { filter: 'blur(4px)', translateY: -8, opacity: 0 },
        whileInView: { filter: 'blur(0px)', translateY: 0, opacity: 1 },
        viewport: { once: true },
        transition: { delay: index * 0.1, duration: 0.8 }
      };

  return (
    <CardWrapper className="stat-grid-card" {...cardProps}>
      <div className="stat-pattern-wrapper">
        <div className="stat-pattern-overlay">
          <GridPattern patternId={patternId} />
        </div>
      </div>
      <Icon className="stat-icon" strokeWidth={1} />
      <div className="stat-number">{stat.number}</div>
      <div className="stat-label">{stat.label}</div>
    </CardWrapper>
  );
};

const AnimatedContainer = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <div className="stats-grid-header">{children}</div>;
  }

  return (
    <motion.div
      className="stats-grid-header"
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

function StatsGrid() {
  return (
    <section className="stats-grid-section">
      <div className="stats-grid-container">
        <AnimatedContainer>
          <h2 className="stats-grid-title">Trusted by Thousands</h2>
          <p className="stats-grid-subtitle">
            Real numbers from real users making smarter financial decisions
          </p>
        </AnimatedContainer>

        <div className="stats-grid-wrapper">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsGrid;
