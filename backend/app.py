from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import joblib
import pandas as pd
from pydantic import BaseModel, ValidationError

app = Flask(__name__)
CORS(app)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'models', 'credit_risk_model.joblib')
EDA_PATH = os.path.join(BASE_DIR, '..', 'results', 'eda')

# Load the model
model = joblib.load(MODEL_PATH)

class LoanApplication(BaseModel):
    person_age: int
    person_income: int
    person_home_ownership: str
    person_emp_length: float
    loan_intent: str
    loan_grade: str
    loan_amnt: int
    loan_int_rate: float
    cb_person_default_on_file: str
    cb_person_cred_hist_length: int

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Credit Risk API"})

@app.route('/api/graphs', methods=['GET'])
def list_graphs():
    try:
        files = [f for f in os.listdir(EDA_PATH) if f.endswith('.png')]
        return jsonify({"status": "success", "graphs": files})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/graphs/<path:filename>')
def serve_graph(filename):
    return send_from_directory(EDA_PATH, filename)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Validate input
        json_data = request.get_json()
        application = LoanApplication(**json_data)
        
        # Convert to DataFrame for the model pipeline
        input_df = pd.DataFrame([application.model_dump()])
        
        # Predict
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]
        
        return jsonify({
            "status": "success",
            "prediction": int(prediction),
            "probability": float(probability),
            "risk_level": "High" if probability > 0.5 else "Low"
        })
        
    except ValidationError as e:
        return jsonify({"status": "error", "message": e.errors()}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
