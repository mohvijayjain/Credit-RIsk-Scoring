from fastapi import FastAPI as fa, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel
import shap
import traceback

# Pipeline dependencies
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MinMaxScaler
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier

pipeline = joblib.load('E:/Credit-Risk-Scoring/models/credit_risk_pipeline.pkl')

# Get the model from pipeline - it might be named 'classifier' or be the last step
try:
    model = pipeline.named_steps['classifier']
except KeyError:
    # If 'classifier' doesn't exist, get the final step
    model = pipeline.steps[-1][1]

explainer = shap.TreeExplainer(model)

app = fa(title='Credit Risk Scoring')

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanApplication(BaseModel):
    person_age: int
    person_income: float
    person_home_ownership: str
    person_emp_length: float
    loan_intent: str
    loan_grade: str
    loan_amnt: float
    loan_int_rate: float
    cb_person_default_on_file: str
    cb_person_cred_hist_length: int


@app.get('/')
def home():
    return {'message': "Credit Risk API is running"}

@app.post("/Calculating_DTI")
def predict_loan_status(data: LoanApplication):
    input_dict = data.model_dump()
    
    # Calculate ALL interaction features
    input_dict['dti_ratio'] = input_dict['loan_amnt'] / input_dict['person_income']
    input_dict['loan_percent_income'] = (input_dict['loan_amnt'] / input_dict['person_income']) * 100
    input_dict['income_to_loan_ratio'] = input_dict['person_income'] / input_dict['loan_amnt']
    input_dict['credit_hist_to_age_ratio'] = input_dict['cb_person_cred_hist_length'] / input_dict['person_age']
    input_dict['employment_stability'] = input_dict['person_emp_length'] / input_dict['person_age']
    
    # Convert loan_grade to numeric
    grade_map = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7}
    loan_grade_numeric = grade_map.get(input_dict['loan_grade'].upper(), 1)
    input_dict['loan_grade'] = loan_grade_numeric
    
    # Calculate remaining interaction features
    input_dict['income_credit_product'] = input_dict['person_income'] * (8 - loan_grade_numeric)
    input_dict['loan_burden'] = (input_dict['loan_int_rate'] * input_dict['loan_amnt']) / input_dict['person_income']
    
    input_df = pd.DataFrame([input_dict])
    probability = pipeline.predict_proba(input_df)[0][1]
    status = "Rejected" if probability > 0.4 else "Approved"
    return {
        "probability_of_default": float(probability),
        "decision": status
    }
    
    
@app.post("/predict")
def predict(data: LoanApplication):
    try:
        print(f"Received request: {data}")
        input_dict = data.model_dump()
        print(f"Input dict: {input_dict}")
        
        # ==========================================
        # CALCULATE ALL INTERACTION FEATURES
        # ==========================================
        
        # Basic derived features
        input_dict['dti_ratio'] = input_dict['loan_amnt'] / input_dict['person_income']
        input_dict['loan_percent_income'] = (input_dict['loan_amnt'] / input_dict['person_income']) * 100
        
        # New interaction features
        input_dict['income_to_loan_ratio'] = input_dict['person_income'] / input_dict['loan_amnt']
        input_dict['credit_hist_to_age_ratio'] = input_dict['cb_person_cred_hist_length'] / input_dict['person_age']
        input_dict['employment_stability'] = input_dict['person_emp_length'] / input_dict['person_age']
        
        print(f"After basic calculations: dti={input_dict['dti_ratio']:.4f}, income_to_loan={input_dict['income_to_loan_ratio']:.4f}")
        
        # Convert loan_grade to numeric (A=1, B=2, ..., G=7)
        grade_map = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7}
        original_grade = input_dict['loan_grade']
        loan_grade_numeric = grade_map.get(input_dict['loan_grade'].upper(), 1)
        input_dict['loan_grade'] = loan_grade_numeric
        
        # Calculate grade-dependent interaction features
        input_dict['income_credit_product'] = input_dict['person_income'] * (8 - loan_grade_numeric)
        input_dict['loan_burden'] = (input_dict['loan_int_rate'] * input_dict['loan_amnt']) / input_dict['person_income']
        
        print(f"Interaction features: income_credit_product={input_dict['income_credit_product']:.2f}, loan_burden={input_dict['loan_burden']:.4f}")
        
        input_df = pd.DataFrame([input_dict])
        
        # Get probability
        probability = pipeline.predict_proba(input_df)[0][1]
        status = "Rejected" if probability > 0.4 else "Approved"
        
        # Calculate credit score (inverse of probability)
        credit_score = int(900 - (probability * 600))
        
        # Enhanced risk factor identification with importance scores AND percentages
        risk_factors = []
        
        # Calculate individual factor scores (0-100%)
        # These percentages represent the "strength" of each factor
        
        # Default History Score (0-100%)
        default_score = 0 if input_dict['cb_person_default_on_file'].upper() == 'Y' else 100
        
        # Credit Grade Score (A=100, B=85, C=70, D=55, E=40, F=25, G=10)
        grade_score = max(0, 100 - ((input_dict['loan_grade'] - 1) * 15))
        
        # DTI Score (lower DTI = higher score)
        dti_score = max(0, min(100, 100 - (input_dict['dti_ratio'] * 200)))
        
        # Employment Length Score
        emp_score = min(100, (input_dict['person_emp_length'] / 10) * 100)
        
        # Credit History Length Score
        credit_hist_score = min(100, (input_dict['cb_person_cred_hist_length'] / 15) * 100)
        
        # Income Score (normalized)
        income_score = min(100, (input_dict['person_income'] / 150000) * 100)
        
        # Interest Rate Score (lower rate = higher score)
        interest_score = max(0, 100 - ((input_dict['loan_int_rate'] - 5) * 5))
        
        # Age Score
        age_score = min(100, ((input_dict['person_age'] - 18) / 42) * 100)
        
        # HIGH PRIORITY FACTORS (scores < 40)
        if default_score < 40:
            risk_factors.append({
                "feature": "Previous Default History", 
                "impact": "HIGH", 
                "note": "Has previous defaults on file",
                "importance": 95,
                "percentage": int(default_score)
            })
        
        if grade_score < 40:
            risk_factors.append({
                "feature": "Poor Credit Grade", 
                "impact": "HIGH", 
                "note": f"Grade {original_grade} indicates higher risk",
                "importance": 90,
                "percentage": int(grade_score)
            })
        
        # MEDIUM PRIORITY FACTORS
# MEDIUM PRIORITY FACTORS (scores 40-70)
        if dti_score >= 40 and dti_score < 70:
            risk_factors.append({
                "feature": "Moderate Debt-to-Income Ratio", 
                "impact": "MEDIUM", 
                "note": f"DTI of {input_dict['dti_ratio']*100:.1f}% requires monitoring",
                "importance": 75,
                "percentage": int(dti_score)
            })
        elif dti_score < 40:
            risk_factors.append({
                "feature": "High Debt-to-Income Ratio", 
                "impact": "HIGH", 
                "note": f"DTI of {input_dict['dti_ratio']*100:.1f}% exceeds safe threshold",
                "importance": 85,
                "percentage": int(dti_score)
            })
        
        if interest_score >= 40 and interest_score < 70:
            risk_factors.append({
                "feature": "Elevated Interest Rate", 
                "impact": "MEDIUM", 
                "note": f"Rate of {input_dict['loan_int_rate']}% indicates moderate risk",
                "importance": 70,
                "percentage": int(interest_score)
            })
        
        if emp_score >= 40 and emp_score < 70:
            risk_factors.append({
                "feature": "Limited Employment History", 
                "impact": "MEDIUM", 
                "note": f"{input_dict['person_emp_length']} years of employment",
                "importance": 68,
                "percentage": int(emp_score)
            })
        
        if credit_hist_score >= 40 and credit_hist_score < 70:
            risk_factors.append({
                "feature": "Developing Credit History", 
                "impact": "MEDIUM", 
                "note": f"{input_dict['cb_person_cred_hist_length']} years credit track record",
                "importance": 65,
                "percentage": int(credit_hist_score)
            })
        
        # POSITIVE FACTORS (scores >= 70)
        if default_score >= 70:
            risk_factors.append({
                "feature": "Clean Repayment History", 
                "impact": "POSITIVE", 
                "note": "No previous defaults recorded",
                "importance": 88,
                "percentage": int(default_score)
            })
        
        if grade_score >= 70:
            risk_factors.append({
                "feature": "Strong Credit Grade", 
                "impact": "POSITIVE", 
                "note": f"Grade {original_grade} demonstrates creditworthiness",
                "importance": 85,
                "percentage": int(grade_score)
            })
        
        if dti_score >= 70:
            risk_factors.append({
                "feature": "Healthy Debt-to-Income Ratio", 
                "impact": "POSITIVE", 
                "note": f"DTI of {input_dict['dti_ratio']*100:.1f}% shows good financial management",
                "importance": 80,
                "percentage": int(dti_score)
            })
        
        if emp_score >= 70:
            risk_factors.append({
                "feature": "Strong Employment Stability",
                "impact": "POSITIVE",
                "note": f"{input_dict['person_emp_length']} years demonstrates job security",
                "importance": 78,
                "percentage": int(emp_score)
            })
        
        if income_score >= 70:
            risk_factors.append({
                "feature": "Strong Income Level",
                "impact": "POSITIVE",
                "note": f"Annual income of ₹{input_dict['person_income']:,.0f} provides repayment capacity",
                "importance": 82,
                "percentage": int(income_score)
            })
        
        if credit_hist_score >= 70:
            risk_factors.append({
                "feature": "Established Credit History",
                "impact": "POSITIVE",
                "note": f"{input_dict['cb_person_cred_hist_length']} years of credit experience",
                "importance": 76,
                "percentage": int(credit_hist_score)
            })
        
        # ==========================================
        # NEW INTERACTION FEATURE ANALYSIS
        # ==========================================
        
        # Income-to-Loan Ratio Analysis
        income_to_loan_score = min(100, (input_dict['income_to_loan_ratio'] / 10) * 100)
        if income_to_loan_score >= 70:
            risk_factors.append({
                "feature": "Strong Affordability Ratio",
                "impact": "POSITIVE",
                "note": f"Income is {input_dict['income_to_loan_ratio']:.1f}x the loan amount",
                "importance": 84,
                "percentage": int(income_to_loan_score)
            })
        elif income_to_loan_score < 40:
            risk_factors.append({
                "feature": "Loan Affordability Concern",
                "impact": "HIGH",
                "note": f"Loan amount is {(1/input_dict['income_to_loan_ratio'])*100:.1f}% of annual income",
                "importance": 87,
                "percentage": int(income_to_loan_score)
            })
        
        # Employment Stability Analysis
        employment_stability_score = min(100, (input_dict['employment_stability'] / 0.5) * 100)
        if employment_stability_score >= 70:
            risk_factors.append({
                "feature": "Excellent Career Stability",
                "impact": "POSITIVE",
                "note": f"Employment spans {input_dict['employment_stability']*100:.1f}% of working age",
                "importance": 79,
                "percentage": int(employment_stability_score)
            })
        elif employment_stability_score < 40:
            risk_factors.append({
                "feature": "Limited Career Stability",
                "impact": "MEDIUM",
                "note": f"Short employment history relative to age",
                "importance": 72,
                "percentage": int(employment_stability_score)
            })
        
        # Loan Burden Analysis
        loan_burden_score = max(0, 100 - (input_dict['loan_burden'] * 50))
        if loan_burden_score < 40:
            risk_factors.append({
                "feature": "High Loan Burden",
                "impact": "HIGH",
                "note": f"Interest payments will significantly impact income",
                "importance": 83,
                "percentage": int(loan_burden_score)
            })
        elif loan_burden_score >= 70:
            risk_factors.append({
                "feature": "Manageable Loan Burden",
                "impact": "POSITIVE",
                "note": f"Interest payments are sustainable relative to income",
                "importance": 77,
                "percentage": int(loan_burden_score)
            })
        
        # Credit History to Age Ratio
        credit_maturity_score = min(100, (input_dict['credit_hist_to_age_ratio'] / 0.5) * 100)
        if credit_maturity_score >= 70:
            risk_factors.append({
                "feature": "Mature Credit Profile",
                "impact": "POSITIVE",
                "note": f"Long credit history relative to age shows experience",
                "importance": 74,
                "percentage": int(credit_maturity_score)
            })
        elif credit_maturity_score < 40:
            risk_factors.append({
                "feature": "Young Credit Profile",
                "impact": "MEDIUM",
                "note": f"Limited credit history relative to age",
                "importance": 69,
                "percentage": int(credit_maturity_score)
            })
        
        # Sort by importance and take top 5
        risk_factors.sort(key=lambda x: x.get('importance', 0), reverse=True)
        top_factors = risk_factors[:5]
        
        # Remove importance from output (used only for sorting)
        for factor in top_factors:
            factor.pop('importance', None)
        
        result = {
            "probability": float(probability),
            "decision": status,
            "risk_level": "HIGH RISK" if probability > 0.4 else "LOW RISK",
            "risk_factors": top_factors,
            "metadata": {
                "credit_score": credit_score,
                "dti_ratio": float(input_dict['dti_ratio']),
                "loan_grade": original_grade,
                "income": float(input_dict['person_income']),
                "employment_years": float(input_dict['person_emp_length'])
            }
        }
        
        print(f"DEBUG: Credit Score = {credit_score}, PD = {probability:.4f}")
        print(f"DEBUG: Returning {len(top_factors)} risk factors with percentages")
        
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
