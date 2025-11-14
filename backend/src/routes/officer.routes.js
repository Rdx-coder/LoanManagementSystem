const express = require('express');
const { body } = require('express-validator');
const officerController = require('../controllers/officer.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isOfficer } = require('../middleware/role.middleware');

const router = express.Router();

router.use(verifyToken, isOfficer);

router.get('/loans/pending', officerController.getPendingLoans);
router.get('/loans', officerController.getAllLoans);
router.post('/loans/:id/review', [
  body('status').isIn(['APPROVED', 'REJECTED', 'UNDER_REVIEW'])
    .withMessage('Status must be APPROVED, REJECTED, or UNDER_REVIEW'),
  body('reviewNotes').optional().trim().isLength({ max: 1000 })
    .withMessage('Review notes cannot exceed 1000 characters')
], officerController.reviewLoan);
router.get('/stats', officerController.getOfficerStats);
router.get('/my-reviews', officerController.getMyReviews);

module.exports = router;