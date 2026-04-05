import pandas as pd
import numpy as np
import os

def generate_synthetic_data(n_samples=10000, output_path='data/credit_risk_dataset.csv'):
    np.random.seed(42)
    
    # Features
    person_age = np.random.randint(20, 70, n_samples)
    person_income = np.random.randint(20000, 150000, n_samples)
    person_home_ownership = np.random.choice(['RENT', 'OWN', 'MORTGAGE', 'OTHER'], n_samples)
    person_emp_length = np.random.randint(0, 40, n_samples)
    
    loan_intent = np.random.choice(['PERSONAL', 'EDUCATION', 'MEDICAL', 'VENTURE', 'HOMEIMPROVEMENT', 'DEBTCONSOLIDATION'], n_samples)
    loan_grade = np.random.choice(['A', 'B', 'C', 'D', 'E', 'F', 'G'], n_samples, p=[0.3, 0.25, 0.2, 0.1, 0.08, 0.04, 0.03])
    loan_amnt = np.random.randint(1000, 35000, n_samples)
    loan_int_rate = np.random.uniform(5, 20, n_samples)
    
    # Target: loan_status (0: non-default, 1: default)
    # Logic: Higher risk if income is low, loan is high, or grade is poor
    risk_score = (loan_amnt / person_income) * 2 + (loan_int_rate / 10)
    # Add some randomness and categorical influence
    risk_score += np.where(loan_grade == 'G', 2, 0)
    risk_score += np.where(person_home_ownership == 'RENT', 0.5, 0)
    
    # Normalize and threshold for status
    loan_status = (risk_score > np.percentile(risk_score, 80)).astype(int)
    
    df = pd.DataFrame({
        'person_age': person_age,
        'person_income': person_income,
        'person_home_ownership': person_home_ownership,
        'person_emp_length': person_emp_length,
        'loan_intent': loan_intent,
        'loan_grade': loan_grade,
        'loan_amnt': loan_amnt,
        'loan_int_rate': loan_int_rate,
        'loan_status': loan_status,
        'cb_person_default_on_file': np.random.choice(['Y', 'N'], n_samples, p=[0.1, 0.9]),
        'cb_person_cred_hist_length': np.random.randint(2, 30, n_samples)
    })
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Dataset generated at {output_path} with {n_samples} samples.")

if __name__ == "__main__":
    generate_synthetic_data()
