const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceSummary,
  filterFinance,
} = require('../controllers/financeController');

router.get('/', protect, getFinances);

router.post('/', protect, createFinance);

router.put('/:id', protect, updateFinance);

router.delete('/:id', protect, deleteFinance);

router.get('/summary', protect, getFinanceSummary);

router.get('/filter', protect, filterFinance);

module.exports = router;