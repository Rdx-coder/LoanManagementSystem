import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { LOAN_TYPES, formatCurrency } from '../utils/constants';
import { toast } from 'react-toastify';

const ApplyLoan = () => {
  const [formData, setFormData] = useState({
    amountRequested: '',
    tenureMonths: '',
    loanType: 'PERSONAL',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [calculatedEMI, setCalculatedEMI] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const calculateEMI = () => {
    const amount = parseFloat(formData.amountRequested);
    const tenure = parseInt(formData.tenureMonths);
    const ratePerMonth = 10 / 12 / 100;
    if (amount && tenure) {
      const emi = (amount * ratePerMonth * Math.pow(1 + ratePerMonth, tenure)) / (Math.pow(1 + ratePerMonth, tenure) - 1);
      setCalculatedEMI(emi);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        amountRequested: parseFloat(formData.amountRequested),
        tenureMonths: parseInt(formData.tenureMonths),
        loanType: formData.loanType,
        purpose: formData.purpose
      };
      const response = await loanService.applyLoan(submitData);
      toast.success('Loan application submitted successfully!');
      navigate(`/loan-status/${response.data.loanId}`);
    } catch (error) {
      toast.error('Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{maxWidth: '600px'}}>
      <h2 className="form-title">Apply for Loan</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Loan Type</label>
          <select name="loanType" className="form-select" value={formData.loanType} onChange={handleChange} required>
            {LOAN_TYPES.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Loan Amount (₹)</label>
          <input type="number" name="amountRequested" className="form-input" value={formData.amountRequested} onChange={(e) => {handleChange(e); setTimeout(calculateEMI, 100);}} min="10000" max="50000000" required />
          <small style={{color: '#666'}}>Minimum: ₹10,000 | Maximum: ₹5,00,00,000</small>
        </div>
        <div className="form-group">
          <label className="form-label">Tenure (Months)</label>
          <input type="number" name="tenureMonths" className="form-input" value={formData.tenureMonths} onChange={(e) => {handleChange(e); setTimeout(calculateEMI, 100);}} min="6" max="360" required />
          <small style={{color: '#666'}}>Minimum: 6 months | Maximum: 360 months (30 years)</small>
        </div>
        {calculatedEMI && (
          <div className="card" style={{marginBottom: '1.5rem', backgroundColor: '#f0f7ff'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', color: '#333'}}>Estimated Monthly EMI</h3>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea', margin: 0}}>{formatCurrency(calculatedEMI)}</p>
            <small style={{color: '#666'}}>Based on approx. 10% annual interest rate</small>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Purpose (Optional)</label>
          <textarea name="purpose" className="form-textarea" value={formData.purpose} onChange={handleChange} placeholder="Describe the purpose of this loan..." maxLength={500} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyLoan;