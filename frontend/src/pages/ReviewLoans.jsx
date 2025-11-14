import { useState, useEffect } from 'react';
import { loanService } from '../services/loanService';
import { formatCurrency, formatDate, LOAN_STATUS } from '../utils/constants';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const ReviewLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [reviewData, setReviewData] = useState({status: 'APPROVED', reviewNotes: ''});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let response;
        if (filter === 'pending') {
          response = await loanService.getPendingLoans();
        } else {
          response = await loanService.getAllLoans({status: filter.toUpperCase()});
        }
        setLoans(response.data.loans);
      } catch (error) {
        toast.error('Failed to fetch loans');
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loanService.reviewLoan(selectedLoan._id, reviewData);
      toast.success(`Loan ${reviewData.status.toLowerCase()} successfully!`);
      setSelectedLoan(null);
      setReviewData({status: 'APPROVED', reviewNotes: ''});
      setFilter(filter === 'pending' ? 'pending' : filter);
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Review Loan Applications</h1>
      </div>

      <div className="card" style={{marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          {['pending', 'approved', 'rejected', ''].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)} style={{width: 'auto'}}>
              {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Loan Applications</h2>
        </div>
        <div className="card-body">
          {loans.length === 0 ? (
            <p style={{textAlign: 'center', padding: '2rem', color: '#666'}}>No loan applications found</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Customer</th><th>Amount</th><th>Type</th><th>Score</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan._id}>
                      <td>{loan.customerId?.userId?.name || 'N/A'}</td>
                      <td>{formatCurrency(loan.amountRequested)}</td>
                      <td>{loan.loanType}</td>
                      <td>{loan.eligibilityScore ? `${(loan.eligibilityScore * 100).toFixed(0)}%` : 'N/A'}</td>
                      <td><span className={`status-badge status-${loan.status.toLowerCase().replace('_', '-')}`}>{LOAN_STATUS[loan.status]}</span></td>
                      <td><button className="btn btn-primary" onClick={() => setSelectedLoan(loan)} style={{padding: '0.5rem 1rem', width: 'auto'}}>Review</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedLoan && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem'}}>
          <div className="card" style={{maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', margin: 0}}>
            <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 className="card-title">Review Loan Application</h2>
              <button onClick={() => setSelectedLoan(null)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>×</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Decision</label>
                  <select className="form-select" value={reviewData.status} onChange={(e) => setReviewData({...reviewData, status: e.target.value})} required>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Review Notes</label>
                  <textarea className="form-textarea" value={reviewData.reviewNotes} onChange={(e) => setReviewData({...reviewData, reviewNotes: e.target.value})} placeholder="Add any notes or comments..." />
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button type="submit" className={`btn ${reviewData.status === 'APPROVED' ? 'btn-success' : 'btn-danger'}`} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedLoan(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewLoans;