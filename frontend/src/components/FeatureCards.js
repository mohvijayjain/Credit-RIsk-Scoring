import React, { useCallback, useEffect, useRef, memo } from "react";
import { Clock, CreditCard, MessageCircle, BookOpen } from "lucide-react";
import { animate } from "motion/react";
import './FeatureCards.css';

const GlowingEffect = memo(({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  movementDuration = 2,
  borderWidth = 1,
  disabled = true,
}) => {
  const containerRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(0);

  const handleMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const { left, top, width, height } = element.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;

        if (e) {
          lastPosition.current = { x: mouseX, y: mouseY };
        }

        const center = [left + width * 0.5, top + height * 0.5];
        const distanceFromCenter = Math.hypot(
          mouseX - center[0],
          mouseY - center[1]
        );
        const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty("--active", "0");
          return;
        }

        const isActive =
          mouseX > left - proximity &&
          mouseX < left + width + proximity &&
          mouseY > top - proximity &&
          mouseY < top + height + proximity;

        element.style.setProperty("--active", isActive ? "1" : "0");

        if (!isActive) return;

        const currentAngle =
          parseFloat(element.style.getPropertyValue("--start")) || 0;
        let targetAngle =
          (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
            Math.PI +
          90;

        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        animate(currentAngle, newAngle, {
          duration: movementDuration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (value) => {
            element.style.setProperty("--start", String(value));
          },
        });
      });
    },
    [inactiveZone, proximity, movementDuration]
  );

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => handleMove();
    const handlePointerMove = (e) => handleMove(e);

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handleMove, disabled]);

  return (
    <div
      ref={containerRef}
      className="glowing-effect-container"
      style={{
        '--blur': `${blur}px`,
        '--spread': spread,
        '--start': '0',
        '--active': '0',
        '--glowingeffect-border-width': `${borderWidth}px`,
      }}
    >
      <div className="glow-wrapper" />
    </div>
  );
});

GlowingEffect.displayName = "GlowingEffect";

const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <div className="feature-card-item" onClick={onClick}>
      <div className="feature-card-border">
        <GlowingEffect
          spread={40}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="feature-card-content">
          <div className="feature-icon-wrapper">
            {icon}
          </div>
          <div className="feature-text">
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function FeatureCards({ onNavigate }) {
  const features = [
    {
      icon: <Clock className="feature-icon" />,
      title: "Instant Risk Check",
      description: "Find out your approval chances before hitting 'apply' — no credit score impact, no paperwork needed",
      action: 'check'
    },
    {
      icon: <CreditCard className="feature-icon" />,
      title: "EMI Calculator",
      description: "See exactly how much you'll pay each month. Adjust loan amount, tenure, and rate to find what fits your budget",
      action: 'calculator'
    },
    {
      icon: <MessageCircle className="feature-icon" />,
      title: "AI Assistant",
      description: "Have questions? Chat with our AI to understand credit scores, interest rates, or anything money-related",
      action: 'ai'
    },
    {
      icon: <BookOpen className="feature-icon" />,
      title: "Learning Center",
      description: "Quick reads on improving your credit score, managing debt, and making smarter financial decisions",
      action: 'resources'
    },
  ];

  return (
    <div className="feature-cards-section">
      <div className="feature-cards-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            onClick={() => onNavigate && onNavigate(feature.action)}
          />
        ))}
      </div>
    </div>
  );
}

export default FeatureCards;
