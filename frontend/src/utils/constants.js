export const LOAN_TYPES = [
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'HOME', label: 'Home Loan' },
  { value: 'EDUCATION', label: 'Education Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'VEHICLE', label: 'Vehicle Loan' }
];

export const LOAN_STATUS = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  OFFICER: 'OFFICER'
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};