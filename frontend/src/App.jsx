import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ApplyLoan from './pages/ApplyLoan';
import LoanStatus from './pages/LoanStatus';
import ReviewLoans from './pages/ReviewLoans';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute role="CUSTOMER">
                    <CustomerDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/apply-loan" 
                element={
                  <PrivateRoute role="CUSTOMER">
                    <ApplyLoan />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/loan-status/:id" 
                element={
                  <PrivateRoute>
                    <LoanStatus />
                  </PrivateRoute>
                } 
              />

              <Route 
                path="/officer/dashboard" 
                element={
                  <PrivateRoute role="OFFICER">
                    <OfficerDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/officer/review-loans" 
                element={
                  <PrivateRoute role="OFFICER">
                    <ReviewLoans />
                  </PrivateRoute>
                } 
              />

              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;