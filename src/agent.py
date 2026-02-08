import requests
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

# Get API URL from environment variable or use default
API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

@tool
def calculate_credit_risk(
    person_age: int,
    person_income: float,
    person_home_ownership: str,
    person_emp_length: float,
    loan_intent: str,
    loan_grade: str,
    loan_amnt: float,
    loan_int_rate: float,
    cb_person_default_on_file: str,
    cb_person_cred_hist_length: int
) -> dict:
    """
    Calculate credit risk for a loan application.
    
    Args:
        person_age: Age of the applicant (e.g., 30)
        person_income: Annual income (e.g., 60000)
        person_home_ownership: Home ownership status - RENT, OWN, MORTGAGE, or OTHER
        person_emp_length: Employment length in years (e.g., 5.0)
        loan_intent: Loan purpose - EDUCATION, MEDICAL, VENTURE, PERSONAL, DEBTCONSOLIDATION, or HOMEIMPROVEMENT
        loan_grade: Loan grade - A, B, C, D, E, F, or G
        loan_amnt: Loan amount requested (e.g., 15000)
        loan_int_rate: Interest rate percentage (e.g., 10.5)
        cb_person_default_on_file: Previous default history - Y or N
        cb_person_cred_hist_length: Credit history length in years (e.g., 7)
    
    Returns:
        Dictionary with probability, decision, and top risk factors
    """
    url = f"{API_BASE_URL}/predict"
    
    payload = {
        "person_age": person_age,
        "person_income": person_income,
        "person_home_ownership": person_home_ownership.upper(),
        "person_emp_length": person_emp_length,
        "loan_intent": loan_intent.upper().replace(" ", ""),
        "loan_grade": loan_grade.upper(),
        "loan_amnt": loan_amnt,
        "loan_int_rate": loan_int_rate,
        "cb_person_default_on_file": cb_person_default_on_file.upper(),
        "cb_person_cred_hist_length": cb_person_cred_hist_length
    }
    
    print(f"Calling API with payload: {payload}")
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code != 200:
            return {"error": f"API returned status {response.status_code}: {response.text}"}
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": f"Cannot connect to API. Make sure the FastAPI server is running on {API_BASE_URL}"}
    except Exception as e:
        return {"error": str(e)}

tools = [calculate_credit_risk]

# Create agent by binding tools to the LLM
agent = llm.bind_tools(tools)

if __name__ == "__main__":
    # Low risk applicant - should be APPROVED
    test_query = (
        "Check loan risk for: Age 30, Income 60000, Home Rent, "
        "Emp Length 5 years, Intent Education, Grade A, "
        "Amount 15000, Rate 10.5, Default No, Hist 7 years."
    )
    
    print("--- Starting AI Integration Check ---")
    
    # First call to the agent
    response = agent.invoke(test_query)
    
    # Check if there are tool calls to execute
    if hasattr(response, 'tool_calls') and response.tool_calls:
        print(f"\nAgent wants to call tool: {response.tool_calls[0]['name']}")
        
        # Execute the tool directly
        tool_call = response.tool_calls[0]
        print(f"\nTool arguments: {tool_call['args']}")
        
        tool_result = calculate_credit_risk.invoke(tool_call['args'])
        
        print(f"\n{'='*70}")
        print(" "*20 + "CREDIT RISK ASSESSMENT REPORT")
        print('='*70)
        if 'error' in tool_result:
            print(f"\n[ERROR] {tool_result['error']}")
        else:
            prob = tool_result.get('probability', 0)
            decision = tool_result.get('decision', 'N/A')
            risk = tool_result.get('risk_level', 'N/A')
            factors = tool_result.get('risk_factors', [])
            
            # Calculate Credit Score (300-900 scale)
            # Lower probability = Higher score
            credit_score = int(900 - (prob * 600))
            
            # ===== SECTION 1: MODEL PREDICTIONS =====
            print(f"\n{'─'*70}")
            print("SECTION 1: MODEL PREDICTIONS")
            print('─'*70)
            
            print(f"\n┌─ Probability of Default (PD)")
            print(f"│  Value: {prob:.4f} (Range: 0.00 - 1.00)")
            print(f"│  Percentage: {prob*100:.2f}%")
            print(f"└─ Interpretation: Likelihood of loan default")
            
            print(f"\n┌─ Credit Score")
            print(f"│  Score: {credit_score}/900")
            print(f"│  Rating: {'Excellent' if credit_score >= 750 else 'Good' if credit_score >= 650 else 'Fair' if credit_score >= 550 else 'Poor'}")
            print(f"└─ Note: Derived from PD (300-900 scale)")
            
            print(f"\n┌─ Decision Outcome")
            print(f"│  Status: {decision.upper()}")
            print(f"│  Action: {'Accept Application' if decision == 'Approved' else 'Reject Application' if decision == 'Rejected' else 'Manual Review Required'}")
            print(f"└─ Risk Level: {risk}")
            
            # ===== SECTION 2: DECISION RATIONALE =====
            print(f"\n{'─'*70}")
            print("SECTION 2: DECISION RATIONALE")
            print('─'*70)
            
            if factors:
                print(f"\n┌─ Primary Decision Factors")
                print(f"│")
                
                # Show all factors with their impact
                for i, factor in enumerate(factors, 1):
                    impact = factor.get('impact', 'UNKNOWN')
                    feature = factor.get('feature', 'Unknown')
                    note = factor.get('note', '')
                    
                    if impact == 'HIGH':
                        indicator = "[HIGH RISK]"
                        symbol = "▲"
                    elif impact == 'MEDIUM':
                        indicator = "[MEDIUM RISK]"
                        symbol = "▲"
                    elif impact == 'POSITIVE':
                        indicator = "[POSITIVE]"
                        symbol = "▼"
                    else:
                        indicator = f"[{impact}]"
                        symbol = "■"
                    
                    print(f"│  {i}. {feature}")
                    print(f"│     Impact Level: {indicator}")
                    if note:
                        print(f"│     Details: {note}")
                    print(f"│")
                
                print(f"└─ Total Factors Analyzed: {len(factors)}")
                
                print(f"\n┌─ Feature Importance Ranking")
                print(f"│  (Factors with highest impact on credit decision)")
                print(f"│")
                
                # List factors by importance
                important_factors = [f for f in factors if f.get('impact') in ['HIGH', 'MEDIUM', 'POSITIVE']]
                for idx, factor in enumerate(important_factors[:5], 1):  # Top 5
                    feature_name = factor.get('feature', 'Unknown')
                    impact_level = factor.get('impact', 'N/A')
                    print(f"│  Rank {idx}: {feature_name} - {impact_level} Impact")
                print(f"└─")
            
            # ===== SECTION 3: RECOMMENDATIONS =====
            print(f"\n{'─'*70}")
            print("SECTION 3: RECOMMENDATIONS")
            print('─'*70)
            
            if decision == "Rejected":
                print("\n[APPLICATION REJECTED]")
                print("\n┌─ Rejection Reason Codes:")
                print("│")
                
                # Extract high-risk factors as reason codes
                high_risk_factors = [f for f in factors if f.get('impact') in ['HIGH', 'MEDIUM']]
                for idx, factor in enumerate(high_risk_factors, 1):
                    print(f"│  Code {idx}: {factor.get('feature')}")
                    print(f"│           {factor.get('note', 'Negative impact on creditworthiness')}")
                    print("│")
                print("└─")
                
                print("\n┌─ Improvement Actions:")
                print("│  → Increase annual income or reduce loan amount")
                print("│  → Improve credit grade through timely bill payments")
                print("│  → Build employment stability and credit history")
                print("│  → Clear any outstanding defaults")
                print("│  → Consider adding a co-applicant with strong credit")
                print("└─")
            elif decision == "Refer":
                print("\n[MANUAL REVIEW REQUIRED]")
                print("\n┌─ Referral Reasons:")
                print("│  → Borderline credit profile requires human assessment")
                print("│  → Mixed risk indicators detected")
                print("│  → Additional documentation may be necessary")
                print("│  → Secondary verification recommended")
                print("└─")
            else:
                print("\n[APPLICATION APPROVED]")
                
                # Show positive factors
                positive_factors = [f for f in factors if f.get('impact') == 'POSITIVE']
                if positive_factors:
                    print("\n┌─ Application Strengths:")
                    print("│")
                    for idx, factor in enumerate(positive_factors, 1):
                        print(f"│  ✓ {factor.get('feature')}")
                    print("└─")
                
                print("\n┌─ Credit Maintenance Guidelines:")
                print("│  → Maintain regular payment schedule")
                print("│  → Avoid multiple simultaneous loan applications")
                print("│  → Keep debt-to-income ratio below 40%")
                print("│  → Monitor credit report quarterly")
                print("│  → Update employment and income information")
                print("└─")
        print('='*70)
        print(" "*15 + "End of Credit Risk Assessment Report")
        print('='*70)
    else:
        print(f"\nDirect AI Response: {response.content}")