import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏦 Loan Origination System
        </Link>

        {isAuthenticated && (
          <div className="navbar-menu">
            {user?.role === 'CUSTOMER' && (
              <>
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/apply-loan" className="navbar-link">Apply Loan</Link>
              </>
            )}

            {user?.role === 'OFFICER' && (
              <>
                <Link to="/officer/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/officer/review-loans" className="navbar-link">Review Loans</Link>
              </>
            )}

            <div className="navbar-user">
              <span>👤 {user?.name}</span>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;