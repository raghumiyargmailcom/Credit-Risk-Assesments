# 🛡️ Credit Risk AI: End-to-End Assessment System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
[![ML](https://img.shields.io/badge/ML-XGBoost-orange.svg)](https://xgboost.readthedocs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A sophisticated machine learning application designed to assess credit risk in real-time. This project features a high-performance **XGBoost** model served via a **Flask API**, paired with a modern **React + TypeScript** dashboard for interactive risk analysis and data exploration.

## ✨ Key Features
- **Real-time Prediction**: Instant probability-of-default assessment for loan applicants.
- **Interactive Dashboard**: Sleek UI for inputting applicant data (income, age, home ownership, etc.).
- **Data Visualizations**: Dynamic charts using `Recharts` and automated Exploratory Data Analysis (EDA) reports.
- **Automated ML Pipeline**: Scripts for synthetic data generation, model training, and performance evaluation.
- **Robust Validation**: Type-safe data handling with Pydantic (Backend) and TypeScript (Frontend).

## 🛠️ Tech Stack
### **Frontend**
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **State Management**: React Hooks
- **Visuals**: Recharts (Pie charts & Probability bars)
- **Styling**: Modern CSS3 (Dark Mode)

### **Backend**
- **Framework**: Flask (Python)
- **Validation**: Pydantic
- **Data Processing**: Pandas, NumPy
- **Storage**: Joblib (Model persistence)

### **Machine Learning**
- **Model**: XGBoost Classifier
- **Metrics**: Accuracy, Precision-Recall, Probability Scoring
- **Pipeline**: Label Encoding & Feature Engineering

## 📁 Project Structure
```text
├── 📂 backend/           # Flask API & Model Serving
├── 📂 frontend/          # React TS Dashboard
├── 📂 scripts/           # ML Scripts (Generate data, Train, EDA)
├── 📂 data/              # CSV Datasets
├── 📂 models/            # Serialized ML Models (.joblib)
└── 📂 results/           # Generated EDA Plots & Reports
```

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8+
- Node.js & npm

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*API runs on `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*UI runs on `http://localhost:5173`*

## 📊 Automated Analysis
You can regenerate the entire data pipeline using the included scripts:
- `python scripts/generate_data.py`: Creates synthetic applicant data.
- `python scripts/train_model.py`: Trains and saves the XGBoost model.
- `python scripts/eda.py`: Generates visual insights in `results/eda/`.

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
