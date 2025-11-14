import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { formatCurrency, formatDate, LOAN_STATUS } from '../utils/constants';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await loanService.getMyLoans({ limit: 10 });
        setLoans(response.data.loans);
      } catch (error) {
        toast.error('Failed to fetch loans');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  const approvedLoans = loans.filter(l => l.status === 'APPROVED').length;
  const pendingLoans = loans.filter(l => l.status === 'PENDING' || l.status === 'UNDER_REVIEW').length;
  const totalAmount = loans.filter(l => l.status === 'APPROVED').reduce((sum, l) => sum + l.amountRequested, 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Customer Dashboard</h1>
        <p style={{color: '#666'}}>Welcome! Manage your loan applications here.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card"><div className="stat-title">Total Loans</div><div className="stat-value">{loans.length}</div></div>
        <div className="stat-card"><div className="stat-title">Approved</div><div className="stat-value" style={{color: '#28a745'}}>{approvedLoans}</div></div>
        <div className="stat-card"><div className="stat-title">Pending</div><div className="stat-value" style={{color: '#ffc107'}}>{pendingLoans}</div></div>
        <div className="stat-card"><div className="stat-title">Approved Amount</div><div className="stat-value" style={{fontSize: '1.5rem'}}>{formatCurrency(totalAmount)}</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Loan Applications</h2>
        </div>
        <div className="card-body">
          {loans.length === 0 ? (
            <p style={{textAlign: 'center', padding: '2rem', color: '#666'}}>No loan applications yet</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Type</th><th>Amount</th><th>Tenure</th><th>Status</th><th>Rate</th><th>Action</th></tr></thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan._id}>
                      <td>{loan.loanType}</td>
                      <td>{formatCurrency(loan.amountRequested)}</td>
                      <td>{loan.tenureMonths} months</td>
                      <td><span className={`status-badge status-${loan.status.toLowerCase().replace('_', '-')}`}>{LOAN_STATUS[loan.status]}</span></td>
                      <td>{loan.interestRate ? `${loan.interestRate}%` : 'N/A'}</td>
                      <td><Link to={`/loan-status/${loan._id}`} className="btn btn-primary" style={{padding: '0.5rem 1rem', width: 'auto'}}>View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;