const Finance = require('../models/financeModel');
const getFinances = async (req, res) => {
  try {
    const finances = await Finance.find({ user: req.user.id });
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

const createFinance = async (req, res) => {
  const { title, amount, type, category } = req.body;
  if (!title || !amount || !type || !category) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Tipe harus income atau expense' });
  }

  if (![ 'salary', 'education', 'health', 'food', 'transportation', 'entertainment', 'utilities', 'others'].includes(category)) {
    return res.status(400).json({ message: 'Kategori harus salary, food, transportation, entertainment, utilities, others' });
  }

  try {
    const finance = await Finance.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
    });

    res.status(201).json(finance);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat data finance' });
  }
};

const updateFinance = async (req, res) => {
  const { id } = req.params;
  try {
    const finance = await Finance.findById(id);
    if (!finance || finance.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    const updatedFinance = await Finance.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedFinance);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate data finance' });
  }
};

const deleteFinance = async (req, res) => {
  const { id } = req.params;
  try {
    const finance = await Finance.findById(id);
    if (!finance || finance.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    await finance.deleteOne();
    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data finance' });
  }
};

const financeReport = async (req, res) => {
  try {
      const { id } = req.params
      const { start_date, end_date, type } = req.query

      let filter = { user: id };

      if (start_date) filter.createdAt = { ...filter.createdAt, $gte: new Date(start_date.split('-').reverse().join('-')) };
      if (end_date) filter.createdAt = { ...filter.createdAt, $lte: new Date(end_date.split('-').reverse().join('-')) };

      if (type) filter.type = type;

      const data = await Finance.find(filter).select('-createdAt -updatedAt -user -__v')
      const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

      res.status(200).json({totalAmount, data})
  }
  catch {
      res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

const filterFinance = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, month, year } = req.query; 
    let query = { user: userId };
    if (type) {
      query.type = type; 
    }
    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
      query.createdAt = { $gte: startOfYear, $lt: endOfYear };
    }

    if (month) {
      if (!query.createdAt) {
        query.createdAt = {};
      }
      const yearValue = year || new Date().getFullYear(); 
      const monthStart = new Date(`${yearValue}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`);
      const nextMonth = Number(month) + 1;
      const monthEnd = nextMonth > 12
        ? new Date(`${Number(yearValue) + 1}-01-01T00:00:00.000Z`)
        : new Date(`${yearValue}-${String(nextMonth).padStart(2, '0')}-01T00:00:00.000Z`);
      query.createdAt.$gte = monthStart;
      query.createdAt.$lt = monthEnd;
    }
    const finances = await Finance.find(query).sort({ createdAt: -1 });
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFinanceSummary = async (req, res) => {
  try {
      const userId = req.user._id;
      const finances = await Finance.find({ user: userId });
      const totalIncome = finances
          .filter((item) => item.type === 'income')
          .reduce((acc, curr) => acc + curr.amount, 0);

      const totalExpense = finances
          .filter((item) => item.type === 'expense')
          .reduce((acc, curr) => acc + curr.amount, 0);

      const balance = totalIncome - totalExpense;

      res.status(200).json({
          totalIncome,
          totalExpense,
          balance,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const getCategoryStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const finances = await Finance.find({ user: userId });
    const categoryStats = finances.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { total: 0, count: 0 };
      }
      acc[curr.category].total += curr.amount;
      acc[curr.category].count += 1;
      return acc;
    }, {});
    res.status(200).json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mendapatkan statistik kategori' });
  }
};

module.exports = { getFinances, createFinance, updateFinance, deleteFinance,financeReport ,filterFinance,getFinanceSummary,getCategoryStats};