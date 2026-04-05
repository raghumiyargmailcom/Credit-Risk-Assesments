import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PredictionResult {
  prediction: number;
  probability: number;
  risk_level: string;
  status: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    person_age: 30,
    person_income: 50000,
    person_home_ownership: 'RENT',
    person_emp_length: 5,
    loan_intent: 'PERSONAL',
    loan_grade: 'A',
    loan_amnt: 10000,
    loan_int_rate: 11.5,
    cb_person_default_on_file: 'N',
    cb_person_cred_hist_length: 10
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [graphs, setGraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    try {
      const resp = await axios.get('http://localhost:5000/api/graphs');
      if (resp.data.status === 'success') {
        setGraphs(resp.data.graphs);
      }
    } catch (err) {
      console.error("Error fetching graphs:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.post('http://localhost:5000/api/predict', formData);
      setResult(resp.data);
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Risk', value: result.probability * 100 },
    { name: 'Safe', value: (1 - result.probability) * 100 }
  ] : [];

  const COLORS = ['#ef4444', '#22c55e'];

  return (
    <div className="container">
      <header>
        <h1>Credit Risk AI</h1>
        <p style={{ color: '#94a3b8' }}>Real-time machine learning assessment for loan applications</p>
      </header>

      <div className="dashboard-grid">
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Applicant Details</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Age</label>
                <input type="number" value={formData.person_age} onChange={e => setFormData({...formData, person_age: +e.target.value})} />
              </div>
              <div className="form-group">
                <label>Income ($)</label>
                <input type="number" value={formData.person_income} onChange={e => setFormData({...formData, person_income: +e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Home Ownership</label>
              <select value={formData.person_home_ownership} onChange={e => setFormData({...formData, person_home_ownership: e.target.value})}>
                <option value="RENT">Rent</option>
                <option value="MORTGAGE">Mortgage</option>
                <option value="OWN">Own</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Loan Amount ($)</label>
                <input type="number" value={formData.loan_amnt} onChange={e => setFormData({...formData, loan_amnt: +e.target.value})} />
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" step="0.1" value={formData.loan_int_rate} onChange={e => setFormData({...formData, loan_int_rate: +e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Loan Intent</label>
              <select value={formData.loan_intent} onChange={e => setFormData({...formData, loan_intent: e.target.value})}>
                <option value="PERSONAL">Personal</option>
                <option value="EDUCATION">Education</option>
                <option value="MEDICAL">Medical</option>
                <option value="VENTURE">Venture</option>
                <option value="HOMEIMPROVEMENT">Home Improvement</option>
                <option value="DEBTCONSOLIDATION">Debt Consolidation</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Risk Profile'}
            </button>
          </form>
        </div>

        <div className="card result-overlay">
          <h2>Assessment Result</h2>
          {result ? (
            <div>
              <div className={`risk-badge ${result.prediction === 1 ? 'risk-high' : 'risk-low'}`}>
                {result.risk_level} Risk Profile
              </div>
              
              <div style={{ height: '250px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#94a3b8' }}>Confidence: {(result.probability * 100).toFixed(1)}% probability of default</p>
                <div className="probability-bar">
                  <div 
                    className="probability-fill" 
                    style={{ 
                      width: `${result.probability * 100}%`,
                      background: result.prediction === 1 ? 'var(--danger)' : 'var(--success)'
                    }} 
                  />
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', marginTop: '1.5rem', color: '#64748b' }}>
                {result.prediction === 1 
                  ? "Caution: Multiple risk factors detected. Suggest further review."
                  : "Profile appears stable. Standard processing recommended."}
              </p>
            </div>
          ) : (
            <div style={{ marginTop: '5rem', color: '#64748b' }}>
              <p>Submit applicant data to see the AI assessment.</p>
            </div>
          )}
        </div>
      </div>

      {graphs.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Analytical Insights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {graphs.map(graph => (
              <div key={graph} className="card" style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'capitalize' }}>
                  {graph.replace('.png', '').replace(/_/g, ' ')}
                </h3>
                <img 
                  src={`http://localhost:5000/api/graphs/${graph}`} 
                  alt={graph} 
                  style={{ width: '100%', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
