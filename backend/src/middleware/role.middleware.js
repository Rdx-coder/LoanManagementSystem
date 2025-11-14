const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

const isCustomer = checkRole('CUSTOMER');
const isOfficer = checkRole('OFFICER');
const isAuthenticated = checkRole('CUSTOMER', 'OFFICER');

module.exports = {
  checkRole,
  isCustomer,
  isOfficer,
  isAuthenticated
};