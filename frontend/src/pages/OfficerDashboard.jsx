import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { formatCurrency } from '../utils/constants';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await loanService.getOfficerStats();
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!stats) return <div>No data available</div>;

  const approvalRate = stats.officer.stats.totalReviewed > 0 ? ((stats.officer.stats.totalApproved / stats.officer.stats.totalReviewed) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Officer Dashboard</h1>
        <p style={{color: '#666'}}>Welcome, {stats.officer.name}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card"><div className="stat-title">Pending Loans</div><div className="stat-value" style={{color: '#ffc107'}}>{stats.systemStats.totalPending}</div></div>
        <div className="stat-card"><div className="stat-title">Total Reviewed</div><div className="stat-value">{stats.officer.stats.totalReviewed}</div></div>
        <div className="stat-card"><div className="stat-title">Approved by You</div><div className="stat-value" style={{color: '#28a745'}}>{stats.officer.stats.totalApproved}</div></div>
        <div className="stat-card"><div className="stat-title">Approval Rate</div><div className="stat-value">{approvalRate}%</div></div>
      </div>

      <Link to="/officer/review-loans" className="card" style={{textDecoration: 'none', cursor: 'pointer'}}>
        <div style={{textAlign: 'center'}}>
          <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: '#333'}}>Review Loans</h3>
          <p style={{color: '#666', margin: 0}}>View and review pending loan applications</p>
        </div>
      </Link>
    </div>
  );
};

export default OfficerDashboard;