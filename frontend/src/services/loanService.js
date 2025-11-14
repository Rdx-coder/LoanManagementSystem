import api from './api';

export const loanService = {
  async applyLoan(loanData) {
    const response = await api.post('/loans/apply', loanData);
    return response.data;
  },

  async getMyLoans(params = {}) {
    const response = await api.get('/loans/my-loans', { params });
    return response.data;
  },

  async getLoanStatus(loanId) {
    const response = await api.get(`/loans/${loanId}/status`);
    return response.data;
  },

  async getLoanById(loanId) {
    const response = await api.get(`/loans/${loanId}`);
    return response.data;
  },

  async getPendingLoans(params = {}) {
    const response = await api.get('/officer/loans/pending', { params });
    return response.data;
  },

  async getAllLoans(params = {}) {
    const response = await api.get('/officer/loans', { params });
    return response.data;
  },

  async reviewLoan(loanId, reviewData) {
    const response = await api.post(`/officer/loans/${loanId}/review`, reviewData);
    return response.data;
  },

  async getOfficerStats() {
    const response = await api.get('/officer/stats');
    return response.data;
  },

  async getMyReviews(params = {}) {
    const response = await api.get('/officer/my-reviews', { params });
    return response.data;
  }
};