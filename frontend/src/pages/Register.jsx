import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    income: '',
    creditScore: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = { ...formData };
      if (submitData.income) submitData.income = parseFloat(submitData.income);
      if (submitData.creditScore) submitData.creditScore = parseInt(submitData.creditScore);
      await register(submitData);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required minLength={6} />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select name="role" className="form-select" value={formData.role} onChange={handleChange} required>
            <option value="CUSTOMER">Customer</option>
            <option value="OFFICER">Loan Officer</option>
          </select>
        </div>
        {formData.role === 'CUSTOMER' && (
          <>
            <div className="form-group">
              <label className="form-label">Annual Income (₹)</label>
              <input type="number" name="income" className="form-input" value={formData.income} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Credit Score (300-850)</label>
              <input type="number" name="creditScore" className="form-input" value={formData.creditScore} onChange={handleChange} min="300" max="850" />
            </div>
          </>
        )}
        {formData.role === 'OFFICER' && (
          <div className="form-group">
            <label className="form-label">Branch</label>
            <input type="text" name="branch" className="form-input" value={formData.branch} onChange={handleChange} />
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;