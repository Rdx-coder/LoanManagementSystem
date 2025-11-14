import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({email: '', password: ''});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'CUSTOMER') navigate('/dashboard');
      else if (user.role === 'OFFICER') navigate('/officer/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
        <p style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}><strong>Test Credentials:</strong></p>
        <p style={{fontSize: '0.875rem', margin: '0.25rem 0'}}>Customer: ravi@example.com / password123</p>
        <p style={{fontSize: '0.875rem', margin: '0.25rem 0'}}>Officer: suresh.officer@example.com / password123</p>
      </div>
    </div>
  );
};

export default Login;