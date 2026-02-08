import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import './AnimatedHero.css';

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Reliable", "Intelligent", "Transparent", "Secure", "Advanced"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="animated-hero-wrapper">
      <div className="animated-hero-container">
        <div className="animated-hero-content">
          <div className="hero-badge-wrapper">
            <button className="hero-badge-button">
              Read our launch article <MoveRight className="badge-icon" />
            </button>
          </div>
          
          <div className="hero-text-group">
            <h1 className="hero-title">
              <span className="hero-title-primary">Credit Risk Assessment</span>
              <span className="hero-title-animated-wrapper">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="hero-title-animated"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="hero-description">
              Managing credit risk assessment today requires precision and speed. 
              Our AI-powered platform streamlines the entire process, providing 
              instant, accurate risk evaluations to help you make confident lending decisions.
            </p>
          </div>
          
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-primary">
              Get Started <MoveRight className="hero-btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedHero;
