import React, { useState } from 'react';
import './LoanForm.css';

function LoanForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    person_age: 30,
    person_income: 60000,
    person_home_ownership: 'RENT',
    person_emp_length: 5,
    loan_intent: 'EDUCATION',
    loan_grade: 'A',
    loan_amnt: 15000,
    loan_int_rate: 10.5,
    cb_person_default_on_file: 'N',
    cb_person_cred_hist_length: 7
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numeric fields
    const processedData = {
      ...formData,
      person_age: parseInt(formData.person_age),
      person_income: parseFloat(formData.person_income),
      person_emp_length: parseFloat(formData.person_emp_length),
      loan_amnt: parseFloat(formData.loan_amnt),
      loan_int_rate: parseFloat(formData.loan_int_rate),
      cb_person_cred_hist_length: parseInt(formData.cb_person_cred_hist_length)
    };
    
    onSubmit(processedData);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>📋 Loan Application Form</h2>
        </div>
        
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="form-section">
            <div className="section-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 17C4 13 7 11 10 11C13 11 16 13 16 17" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3>Personal Information</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="person_age"
                  value={formData.person_age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Annual Income ($)</label>
                <input
                  type="number"
                  name="person_income"
                  value={formData.person_income}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Home Ownership</label>
                <select
                  name="person_home_ownership"
                  value={formData.person_home_ownership}
                  onChange={handleChange}
                  required
                >
                  <option value="RENT">Rent</option>
                  <option value="OWN">Own</option>
                  <option value="MORTGAGE">Mortgage</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Employment Length (years)</label>
                <input
                  type="number"
                  name="person_emp_length"
                  value={formData.person_emp_length}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  step="0.5"
                  required
                />
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="form-section">
            <div className="section-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 6V10C3 15 10 18 10 18C10 18 17 15 17 10V6L10 2Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3>Loan Information</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Loan Purpose</label>
                <select
                  name="loan_intent"
                  value={formData.loan_intent}
                  onChange={handleChange}
                  required
                >
                  <option value="EDUCATION">Education</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="VENTURE">Venture</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="DEBTCONSOLIDATION">Debt Consolidation</option>
                  <option value="HOMEIMPROVEMENT">Home Improvement</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loan Grade</label>
                <select
                  name="loan_grade"
                  value={formData.loan_grade}
                  onChange={handleChange}
                  required
                >
                  <option value="A">A (Best)</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G (Worst)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Loan Amount ($)</label>
                <input
                  type="number"
                  name="loan_amnt"
                  value={formData.loan_amnt}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  name="loan_int_rate"
                  value={formData.loan_int_rate}
                  onChange={handleChange}
                  min="0"
                  max="30"
                  step="0.1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Credit History */}
          <div className="form-section">
            <div className="section-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3H17V13H3V3Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 7H14M6 10H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>Credit History</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Previous Default</label>
                <select
                  name="cb_person_default_on_file"
                  value={formData.cb_person_default_on_file}
                  onChange={handleChange}
                  required
                >
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Credit History Length (years)</label>
                <input
                  type="number"
                  name="cb_person_cred_hist_length"
                  value={formData.cb_person_cred_hist_length}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Assess Credit Risk</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoanForm;
