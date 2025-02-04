const express = require('express');
const router = express.Router();
const {
  getFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceSummary,
  filterFinance,
  getCategoryStats,
} = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');
const { getMonthlyStats } = require('../controllers/financeController');

router.route('/').get(protect, getFinances).post(protect, createFinance);
router.route('/:id').put(protect, updateFinance).delete(protect, deleteFinance);
router.get('/summary', protect, getFinanceSummary);
router.get('/filter', protect, filterFinance);
router.get('/category-stats', protect, getCategoryStats);
router.get('/monthly-stats', protect, getMonthlyStats);
module.exports = router;