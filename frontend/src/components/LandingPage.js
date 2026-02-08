import React from 'react';
import { useState } from 'react';
import './LandingPage.css';
import LoanForm from './LoanForm';
import ResultDisplay from './ResultDisplay';
import BlogSection from './BlogSection';
import AnimatedHero from './AnimatedHero';
import FeatureCards from './FeatureCards';
import StatsGrid from './StatsGrid';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

function LandingPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loanAmount, setLoanAmount] = useState(50000);
  const [investment, setInvestment] = useState(0);
  const [interestRate, setInterestRate] = useState(8);
  const [tenure, setTenure] = useState(12);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m your financial AI assistant. Ask me anything about loans, EMI, credit scores, or financial planning!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const calculateEMI = () => {
    const principal = loanAmount - investment;
    const monthlyRate = interestRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                 (Math.pow(1 + monthlyRate, tenure) - 1);
    return isNaN(emi) ? 0 : emi.toFixed(2);
  };

  const handleLoanCheck = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use environment variable for API URL or fallback to localhost
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${apiUrl}/predict`, formData);
      setResult(response.data);
      setActiveSection('results');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setActiveSection('check');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsTyping(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      let botResponse = '';
      const lowerInput = userMessage.toLowerCase();

      // Finance-related keywords
      const financeKeywords = [
        'emi', 'loan', 'credit', 'cibil', 'interest', 'rate', 'tenure', 
        'dti', 'debt', 'income', 'payment', 'mortgage', 'finance', 'financial',
        'bank', 'money', 'savings', 'budget', 'investment', 'score', 'approval',
        'repayment', 'principal', 'borrowing', 'lending', 'collateral', 'guarantee',
        'installment', 'foreclosure', 'prepayment', 'down payment', 'processing fee',
        'home loan', 'personal loan', 'car loan', 'education loan', 'business loan',
        'salary', 'fund', 'tax', 'insurance', 'expense', 'asset', 'liability'
      ];

      // Check if question is finance-related
      const isFinanceRelated = financeKeywords.some(keyword => lowerInput.includes(keyword));

      if (!isFinanceRelated) {
        botResponse = `I'm a specialized Financial AI Assistant focused on helping with credit scores, loans, EMI, and financial planning. I can only answer questions related to finance. Please ask me about:\n\n📊 EMI & loan calculations\n💳 Credit scores & CIBIL\n🏦 Loan approvals & rates\n💰 DTI ratios & budgeting\n📈 Financial planning\n\nWhat financial question can I help you with?`;
      } else if (lowerInput.includes('emi') || lowerInput.includes('monthly payment') || lowerInput.includes('installment')) {
        botResponse = `EMI stands for Equated Monthly Installment. It's the fixed payment you make to a lender each month. Your EMI depends on loan amount, interest rate, and tenure. Try our EMI Calculator to see your estimated monthly payments!`;
      } else if (lowerInput.includes('credit score') || lowerInput.includes('cibil')) {
        botResponse = `A credit score (CIBIL score in India) ranges from 300-900. A score above 750 is considered excellent and helps you get loans with better interest rates. Factors affecting it: payment history (35%), credit utilization (30%), credit history length (15%), credit mix (10%), and new credit (10%).`;
      } else if (lowerInput.includes('loan') || lowerInput.includes('approval')) {
        botResponse = `To improve loan approval chances: 1) Maintain credit score above 750, 2) Keep debt-to-income ratio below 40%, 3) Have stable employment (2+ years), 4) Avoid multiple loan applications at once, 5) Pay existing EMIs on time. Want to check your approval probability? Use our "Tools" section!`;
      } else if (lowerInput.includes('interest rate') || lowerInput.includes('rate of interest')) {
        botResponse = `Interest rates vary by loan type: Home loans (8-10%), Personal loans (10-18%), Car loans (8-12%). Your rate depends on: credit score, income, employment type, loan amount, and tenure. Better credit scores get lower rates!`;
      } else if (lowerInput.includes('tenure') || lowerInput.includes('repayment period')) {
        botResponse = `Loan tenure is the repayment period. Longer tenure = lower monthly EMI but higher total interest. Shorter tenure = higher EMI but less interest overall. For example, a ₹10 lakh loan at 9%: 10 years = ₹12,668/month (total ₹15.2L), 20 years = ₹8,997/month (total ₹21.6L).`;
      } else if (lowerInput.includes('dti') || lowerInput.includes('debt to income') || lowerInput.includes('debt-to-income')) {
        botResponse = `Debt-to-Income (DTI) ratio = (Total monthly debt payments ÷ Monthly gross income) × 100. Banks prefer DTI below 40%. For example, if you earn ₹50,000/month and have ₹15,000 in debt payments, your DTI is 30% - which is good!`;
      } else if (lowerInput.includes('down payment') || lowerInput.includes('downpayment')) {
        botResponse = `Down payment is the upfront amount you pay when taking a loan. Higher down payment = lower loan amount = lower EMI. For home loans, aim for 20% down payment. For car loans, 10-20% is typical. A larger down payment also improves approval chances!`;
      } else if (lowerInput.includes('processing fee') || lowerInput.includes('charges')) {
        botResponse = `Processing fees are upfront charges by banks for loan processing, typically 0.5-2% of loan amount. Other charges include: prepayment charges (0-4%), late payment fees, legal fees, and stamp duty. Always factor these into your total loan cost!`;
      } else if (lowerInput.includes('prepayment') || lowerInput.includes('foreclosure')) {
        botResponse = `Prepayment means paying off your loan before the tenure ends. Benefits: Save on interest, become debt-free faster. Note: Some banks charge prepayment penalties (0-4% of outstanding). Home loans typically have no prepayment charges after initial years.`;
      } else if (lowerInput.includes('budget') || lowerInput.includes('expense') || lowerInput.includes('savings')) {
        botResponse = `Financial planning tip: Follow the 50-30-20 rule - 50% for needs, 30% for wants, 20% for savings/debt repayment. Before taking a loan, ensure your EMI doesn't exceed 40% of your monthly income. Build an emergency fund of 6 months' expenses first!`;
      } else {
        botResponse = `I can help you with:\n\n📊 EMI & loan calculations\n💳 Credit scores & CIBIL reports\n🏦 Loan approval strategies\n💰 Interest rates & tenure\n📅 Debt-to-income ratios\n💵 Down payments & fees\n🏠 Home, car & personal loans\n📈 Financial planning & budgeting\n\nWhat specific financial topic would you like to know about?`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 8V16C4 24 16 30 16 30C16 30 28 24 28 16V8L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="16" cy="16" r="6" fill="currentColor" opacity="0.3"/>
            </svg>
            <span className="logo-text">RiskAI</span>
          </div>
          <ul className="nav-menu">
            <li onClick={() => setActiveSection('home')} className={activeSection === 'home' ? 'active' : ''}>
              Dashboard
            </li>
            <li onClick={() => setActiveSection('check')} className={activeSection === 'check' ? 'active' : ''}>
              Tools
            </li>
            <li onClick={() => setActiveSection('calculator')} className={activeSection === 'calculator' ? 'active' : ''}>
              EMI Calculator
            </li>
            <li className="talk-to-ai-btn" onClick={() => setShowChatbot(!showChatbot)}>
              Talk to AI
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">{activeSection === 'home' && (
          <div className="home-section">
            {/* Animated Hero Section */}
            <AnimatedHero />

            {/* Stats Grid Section */}
            <StatsGrid />

            {/* Feature Cards with Glowing Effect */}
            <FeatureCards onNavigate={setActiveSection} />

            {/* How It Works Section */}
            <div className="how-it-works-section">
              <h2 className="section-title">How It Works</h2>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">01</div>
                  <div className="step-icon">📝</div>
                  <h3>Enter Details</h3>
                  <p>Basic info about your income, employment, and any existing loans</p>
                </div>
                <div className="step-arrow">→</div>
                <div className="step-card">
                  <div className="step-number">02</div>
                  <div className="step-icon">🤖</div>
                  <h3>AI Analyzes</h3>
                  <p>Our model checks 15+ factors that banks look at when deciding on loans</p>
                </div>
                <div className="step-arrow">→</div>
                <div className="step-card">
                  <div className="step-number">03</div>
                  <div className="step-icon">✅</div>
                  <h3>See Results</h3>
                  <p>Get approval probability, estimated credit score, and tips to improve</p>
                </div>
              </div>
            </div>

            {/* Blog Section */}
            <BlogSection />

            {/* Testimonials Section */}
            <div className="testimonials-section">
              <h2 className="section-title">What Our Users Say</h2>
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p className="testimonial-text">
                    "I was nervous about applying for a business loan, but this tool showed me exactly where I stood. Saved me from a rejected application!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">R</div>
                    <div>
                      <div className="author-name">Rajesh Kumar</div>
                      <div className="author-role">Mumbai • Small Business Owner</div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p className="testimonial-text">
                    "Finally! An EMI calculator that actually shows month-by-month breakdown. Helped me decide between 3 and 5-year tenure."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">P</div>
                    <div>
                      <div className="author-name">Priya Sharma</div>
                      <div className="author-role">Bengaluru • First-time Home Buyer</div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p className="testimonial-text">
                    "Got rejected by my bank twice. This tool told me why — my debt-to-income ratio. Fixed it, reapplied, got approved!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">A</div>
                    <div>
                      <div className="author-name">Amit Patel</div>
                      <div className="author-role">Delhi • Car Loan Applicant</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="footer">
              <div className="social-links">
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                <a href="#" aria-label="Discord"><i className="fab fa-discord"></i></a>
              </div>
              <div className="powered-by">
                <span>Powered by</span>
                <svg className="gemini-logo" width="100" height="24" viewBox="0 0 100 24">
                  <text x="0" y="18" fill="currentColor" fontSize="16" fontWeight="600">Gemini AI</text>
                </svg>
              </div>
            </footer>
          </div>
        )}

        {/* Check Loan Section */}
        {activeSection === 'check' && !result && (
          <div className="section-content">
            <div className="section-header">
              <h2>Check Your Approval Chances</h2>
              <p>Takes 2 minutes. Won't affect your credit score. Get instant feedback on what lenders see.</p>
            </div>
            <LoanForm onSubmit={handleLoanCheck} loading={loading} error={error} />
          </div>
        )}

        {/* Results Section */}
        {activeSection === 'results' && result && (
          <div className="section-content">
            <ResultDisplay data={result} onReset={handleReset} />
          </div>
        )}

        {/* EMI Calculator Section */}
        {activeSection === 'calculator' && (
          <div className="section-content">
            <div className="section-header">
              <h2>EMI Calculator</h2>
              <p>Calculate your monthly installments with precision</p>
            </div>

            <div className="emi-calculator-section">
              <div style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start'}}>
                  <div className="calculator-input">
                    <div className="input-row">
                      <label>Loan Amount</label>
                      <span className="input-value">₹{loanAmount.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="10000" 
                      max="10000000" 
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="slider"
                    />
                  </div>

                  <div className="calculator-input">
                    <div className="input-row">
                      <label>Interest Rate</label>
                      <span className="input-value">{interestRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="25" 
                      step="0.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="slider"
                    />
                  </div>

                  <div className="calculator-input">
                    <div className="input-row">
                      <label>Loan Tenure (Months)</label>
                      <span className="input-value">{tenure} months</span>
                    </div>
                    <input 
                      type="range" 
                      min="6" 
                      max="360" 
                      step="6"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="slider"
                    />
                  </div>
                </div>

                <div className="emi-display" style={{margin: '0 auto', maxWidth: '320px'}}>
                  <div className="emi-amount">₹{calculateEMI()}</div>
                  <div className="emi-label">Monthly EMI</div>
                </div>
              </div>

              <div className="emi-breakdown" style={{marginTop: '3rem'}}>
                <div className="breakdown-card">
                  <h4>Total Amount Payable</h4>
                  <p className="amount">₹{(calculateEMI() * tenure).toLocaleString()}</p>
                </div>
                <div className="breakdown-card">
                  <h4>Total Interest</h4>
                  <p className="amount">₹{((calculateEMI() * tenure) - loanAmount).toLocaleString()}</p>
                </div>
                <div className="breakdown-card">
                  <h4>Principal Amount</h4>
                  <p className="amount">₹{loanAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="emi-pie-chart-dark" style={{minHeight: '400px'}}>
                <h3 className="pie-title" style={{color: '#1e3a8a', fontWeight: '700'}}>Payment Distribution</h3>
                <div className="pie-content" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', padding: '2rem'}}>
                  <div style={{position: 'relative'}}>
                    <svg viewBox="0 0 200 200" className="pie-svg" style={{width: '250px', height: '250px', filter: 'drop-shadow(0 4px 12px rgba(65, 105, 225, 0.3))'}}>
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        fill="none" 
                        stroke="#4169E1"
                        strokeWidth="40"
                        strokeDasharray={`${(loanAmount / (calculateEMI() * tenure)) * 502} 502`}
                        transform="rotate(-90 100 100)"
                      />
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        fill="none" 
                        stroke="#1E90FF"
                        strokeWidth="40"
                        strokeDasharray={`${(((calculateEMI() * tenure) - loanAmount) / (calculateEMI() * tenure)) * 502} 502`}
                        strokeDashoffset={`-${(loanAmount / (calculateEMI() * tenure)) * 502}`}
                        transform="rotate(-90 100 100)"
                      />
                      <text x="100" y="95" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1e293b">
                        {((loanAmount / (calculateEMI() * tenure)) * 100).toFixed(1)}%
                      </text>
                      <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500">
                        Principal
                      </text>
                    </svg>
                  </div>
                  <div className="pie-legend-dark">
                    <div className="legend-item-dark" style={{fontSize: '1rem', color: '#1e293b', fontWeight: '500'}}>
                      <span className="legend-dot-dark" style={{width: '16px', height: '16px', borderRadius: '50%', background: '#4169E1', boxShadow: '0 0 10px rgba(65, 105, 225, 0.5)'}}></span>
                      <span>Principal: ₹{loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="legend-item-dark" style={{fontSize: '1rem', color: '#1e293b', fontWeight: '500'}}>
                      <span className="legend-dot-dark" style={{width: '16px', height: '16px', borderRadius: '50%', background: '#1E90FF', boxShadow: '0 0 10px rgba(30, 144, 255, 0.5)'}}></span>
                      <span>Interest: ₹{((calculateEMI() * tenure) - loanAmount).toFixed(0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="emi-schedule-dark">
              <div className="schedule-header-dark">
                <h3>Monthly Payment Schedule</h3>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="month-picker-dark" 
                    placeholder="Filter by month"
                  />
                  {selectedMonth && (
                    <button 
                      onClick={() => setSelectedMonth('')}
                      className="month-picker-dark"
                      style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        border: '2px solid #dc2626',
                        cursor: 'pointer',
                        fontWeight: '600',
                        padding: '0.7rem 1.2rem'
                      }}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
              
              <div className="schedule-content-dark">
                {(() => {
                  const monthlyEMI = parseFloat(calculateEMI());
                  let balance = loanAmount;
                  const monthlyRate = interestRate / 100 / 12;
                  const chartData = [];
                  
                  // Generate monthly data (limit to first 60 months for display)
                  for (let month = 1; month <= Math.min(tenure, 60); month++) {
                    const interest = balance * monthlyRate;
                    const principal = monthlyEMI - interest;
                    balance -= principal;
                    
                    const date = new Date(2026, 1, 1); // Feb 2026
                    date.setMonth(date.getMonth() + month - 1);
                    
                    chartData.push({
                      month: month,
                      date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                      dateObject: date,
                      emi: monthlyEMI,
                      principal: principal,
                      interest: interest,
                      balance: Math.max(0, balance)
                    });
                  }

                  // Filter by selected month if any
                  let displayData = chartData;
                  if (selectedMonth) {
                    const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);
                    displayData = chartData.filter(data => {
                      const dataYear = data.dateObject.getFullYear();
                      const dataMonth = data.dateObject.getMonth() + 1;
                      return dataYear === selectedYear && dataMonth === selectedMonthNum;
                    });
                  }
                  
                  return (
                    <div className="schedule-table-modern">
                      {displayData.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '1.1rem'}}>
                          No payments found for selected month
                        </div>
                      ) : (
                        <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-20">Month</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">EMI (₹)</TableHead>
                                <TableHead className="text-right">Principal (₹)</TableHead>
                                <TableHead className="text-right">Interest (₹)</TableHead>
                                <TableHead className="text-right">Balance (₹)</TableHead>
                                <TableHead className="text-right">% Paid</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {displayData.map((data, idx) => {
                                const totalPaid = loanAmount - data.balance;
                                const paidPercent = (totalPaid / loanAmount) * 100;
                                return (
                                  <TableRow key={idx}>
                                <TableCell className="font-bold text-slate-900">{data.month}</TableCell>
                                <TableCell className="text-slate-700">{data.date}</TableCell>
                                <TableCell className="text-right font-semibold text-slate-900">
                                  ₹ {data.emi.toFixed(0).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-medium">
                                  ₹ {data.principal.toFixed(0).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-blue-600 font-medium">
                                  ₹ {data.interest.toFixed(0).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-indigo-600 font-medium">
                                  ₹ {data.balance.toFixed(0).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900">
                                  {paidPercent.toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      {!selectedMonth && tenure > 60 && (
                        <div style={{textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '500'}}>
                          Showing first 60 months of {tenure} month loan
                        </div>
                      )}
                      {selectedMonth && (
                        <div style={{textAlign: 'center', padding: '1rem', color: '#4169E1', fontSize: '0.9rem', fontWeight: '600'}}>
                          Filtered: Showing {displayData.length} payment(s) for selected month
                        </div>
                      )}
                      </>
                    )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Resources Section */}
        {activeSection === 'resources' && (
          <div className="section-content academy-detail">
            <div className="section-header">
              <h2>Financial Resources & Learning</h2>
              <p>Improve your financial knowledge and credit score</p>
            </div>
            <div className="resources-grid">
              <div className="resource-item">
                <h3>Understanding Credit Scores</h3>
                <p>Learn how credit scores work and how to improve yours</p>
              </div>
              <div className="resource-item">
                <h3>Loan Application Tips</h3>
                <p>Best practices for successful loan applications</p>
              </div>
              <div className="resource-item">
                <h3>Financial Planning</h3>
                <p>Smart strategies for managing your finances</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Chatbot Widget */}
      {showChatbot && (
        <div className="chatbot-widget" style={{width: '400px', maxHeight: '600px', display: 'flex', flexDirection: 'column'}}>
          <div className="chatbot-header">
            <span>💬 Financial AI Assistant</span>
            <button onClick={() => setShowChatbot(false)}>×</button>
          </div>
          <div className="chatbot-body" style={{flex: 1, overflowY: 'auto', padding: '1rem', maxHeight: '450px'}}>
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div 
                  style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                    background: msg.sender === 'user' ? '#4169E1' : '#f1f5f9',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem'}}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem 1rem 1rem 0',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '0.9rem'
                }}>
                  Typing...
                </div>
              </div>
            )}
          </div>
          <div style={{padding: '1rem', borderTop: '1px solid #e2e8f0', background: '#ffffff'}}>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4169E1'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: chatInput.trim() ? '#4169E1' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (chatInput.trim()) {
                    e.target.style.background = '#3157c4';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = chatInput.trim() ? '#4169E1' : '#cbd5e1';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!showChatbot && (
        <button className="floating-chat-btn" onClick={() => setShowChatbot(true)}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" fill="currentColor"/>
            <circle cx="12" cy="14" r="2" fill="white"/>
            <circle cx="20" cy="14" r="2" fill="white"/>
            <path d="M10 20C10 20 12 22 16 22C20 22 22 20 22 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}


// EMI Calculator Component
function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(12);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const months = parseInt(tenure);

    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return {
      emi: isNaN(emi) ? 0 : emi.toFixed(2),
      totalAmount: isNaN(totalAmount) ? 0 : totalAmount.toFixed(2),
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest.toFixed(2)
    };
  };

  const { emi, totalAmount, totalInterest } = calculateEMI();

  return (
    <div className="calculator-container">
      <div className="calculator-inputs">
        <div className="input-group">
          <label>Loan Amount ($)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            min="1000"
            step="1000"
          />
          <input
            type="range"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            min="1000"
            max="1000000"
            step="1000"
          />
        </div>

        <div className="input-group">
          <label>Interest Rate (% per annum)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="1"
            max="30"
            step="0.1"
          />
          <input
            type="range"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="1"
            max="30"
            step="0.1"
          />
        </div>

        <div className="input-group">
          <label>Loan Tenure (months)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            min="1"
            max="360"
          />
          <input
            type="range"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            min="1"
            max="360"
          />
        </div>
      </div>

      <div className="calculator-results">
        <div className="result-card">
          <div className="result-label">Monthly EMI</div>
          <div className="result-value">${emi}</div>
        </div>
        <div className="result-card">
          <div className="result-label">Total Interest</div>
          <div className="result-value">${totalInterest}</div>
        </div>
        <div className="result-card">
          <div className="result-label">Total Payable</div>
          <div className="result-value">${totalAmount}</div>
        </div>
      </div>

      <div className="payment-breakdown">
        <h3>Payment Breakdown</h3>
        <div className="breakdown-chart">
          <div className="chart-bar">
            <div 
              className="principal-bar" 
              style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
            >
              Principal: ${loanAmount}
            </div>
            <div 
              className="interest-bar" 
              style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
            >
              Interest: ${totalInterest}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Resources Section Component
function ResourcesSection() {
  const resources = [
    {
      category: "Credit Score Improvement",
      items: [
        { title: "How to Build Credit from Scratch", description: "Step-by-step guide for beginners" },
        { title: "7 Ways to Boost Your Credit Score", description: "Proven strategies that work" },
        { title: "Understanding Credit Reports", description: "Read and interpret your report" }
      ]
    },
    {
      category: "Loan Management",
      items: [
        { title: "Debt Consolidation Guide", description: "Simplify multiple loans" },
        { title: "Early Loan Repayment Benefits", description: "Save on interest" },
        { title: "Managing Multiple Loans", description: "Smart strategies" }
      ]
    },
    {
      category: "Financial Planning",
      items: [
        { title: "Emergency Fund Basics", description: "How much do you need?" },
        { title: "Budget Planning 101", description: "Track and optimize spending" },
        { title: "Investment for Beginners", description: "Start your journey" }
      ]
    }
  ];

  return (
    <div className="resources-container">
      {resources.map((category, idx) => (
        <div key={idx} className="resource-category">
          <h3>{category.category}</h3>
          <div className="resource-list">
            {category.items.map((item, i) => (
              <div key={i} className="resource-item">
                <div className="resource-icon">📄</div>
                <div className="resource-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
                <button className="read-btn">Read →</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="tips-section">
        <h3>💡 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <strong>Pay on Time</strong>
            <p>Payment history accounts for 35% of your credit score</p>
          </div>
          <div className="tip-card">
            <strong>Keep Utilization Low</strong>
            <p>Use less than 30% of your available credit</p>
          </div>
          <div className="tip-card">
            <strong>Don't Close Old Accounts</strong>
            <p>Length of credit history matters</p>
          </div>
          <div className="tip-card">
            <strong>Monitor Regularly</strong>
            <p>Check your credit report every 3 months</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Assistant Component
function AIAssistant() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI Financial Assistant. Ask me anything about credit scores, loans, or financial planning!' }
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    "How can I improve my credit score?",
    "What is a good credit score?",
    "How is EMI calculated?",
    "What factors affect loan approval?"
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(input);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 1000);

    setInput('');
  };

  const getAIResponse = (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('credit score') && q.includes('improve')) {
      return 'To improve your credit score: 1) Pay bills on time, 2) Keep credit utilization below 30%, 3) Don\'t close old credit accounts, 4) Avoid multiple loan applications, 5) Regularly check your credit report for errors.';
    } else if (q.includes('good credit score')) {
      return 'Credit score ranges: Excellent (750-900), Good (650-749), Fair (550-649), Poor (below 550). Aim for 700+ for best loan terms.';
    } else if (q.includes('emi')) {
      return 'EMI (Equated Monthly Installment) = [P x R x (1+R)^N]/[(1+R)^N-1], where P = Principal, R = Monthly interest rate, N = Tenure in months. Use our EMI Calculator for instant results!';
    } else if (q.includes('loan approval')) {
      return 'Key factors: Credit score (700+), debt-to-income ratio (<40%), employment stability, credit history length, existing loans, and payment history.';
    }
    
    return 'That\'s a great question! For detailed information, please check our Resources section or use the Loan Assessment tool for personalized insights.';
  };

  return (
    <div className="ai-assistant-container">
      <div className="quick-questions">
        <h4>Quick Questions:</h4>
        <div className="questions-grid">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              className="quick-question-btn"
              onClick={() => {
                setInput(q);
                handleSend();
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-content">
                {msg.type === 'bot' && <span className="bot-icon">🤖</span>}
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about credit and loans..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
