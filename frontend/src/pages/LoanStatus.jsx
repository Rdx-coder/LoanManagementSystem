import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { formatCurrency, formatDate, LOAN_STATUS } from '../utils/constants';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const LoanStatus = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await loanService.getLoanById(id);
        setLoan(response.data);
      } catch (error) {
        toast.error('Failed to fetch loan details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!loan) return <div>Loan not found</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Loan Application Details</h1>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Application Status</h2>
          <span className={`status-badge status-${loan.status.toLowerCase().replace('_', '-')}`}>{LOAN_STATUS[loan.status]}</span>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
            <div>
              <h3 style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}>Loan Type</h3>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold', margin: 0}}>{loan.loanType}</p>
            </div>
            <div>
              <h3 style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}>Amount Requested</h3>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold', margin: 0}}>{formatCurrency(loan.amountRequested)}</p>
            </div>
            <div>
              <h3 style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}>Tenure</h3>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold', margin: 0}}>{loan.tenureMonths} months</p>
            </div>
            <div>
              <h3 style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}>Interest Rate</h3>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold', margin: 0}}>{loan.interestRate ? `${loan.interestRate}%` : 'N/A'}</p>
            </div>
            {loan.monthlyEMI && (
              <div>
                <h3 style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}>Monthly EMI</h3>
                <p style={{fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#667eea'}}>{formatCurrency(loan.monthlyEMI)}</p>
              </div>
            )}
          </div>

          {loan.purpose && (
            <div style={{marginTop: '1.5rem'}}>
              <h3 style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}>Purpose</h3>
              <p style={{margin: 0}}>{loan.purpose}</p>
            </div>
          )}

          <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee'}}>
            <h3 style={{fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem'}}>Applied On</h3>
            <p style={{margin: 0}}>{formatDate(loan.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatus;