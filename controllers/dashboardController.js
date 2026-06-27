const db = require('../models/database');

exports.getStats = async (req, res) => {
  try {
    const [incResult, expResult] = await Promise.all([
      db.query('SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM income'),
      db.query('SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM expenses'),
    ]);
    const inc = incResult.rows[0];
    const exp = expResult.rows[0];
    res.json({
      totalIncome:   parseFloat(inc.total),
      totalExpenses: parseFloat(exp.total),
      netProfit:     parseFloat(inc.total) - parseFloat(exp.total),
      incomeCount:   parseInt(inc.count),
      expensesCount: parseInt(exp.count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    const [incResult, expResult] = await Promise.all([
      db.query(
        'SELECT payment_date as date, SUM(amount) as total FROM income WHERE payment_date >= $1 GROUP BY payment_date ORDER BY payment_date',
        [cutoffStr]
      ),
      db.query(
        'SELECT expense_date as date, SUM(amount) as total FROM expenses WHERE expense_date >= $1 GROUP BY expense_date ORDER BY expense_date',
        [cutoffStr]
      ),
    ]);

    res.json({
      income:   incResult.rows.map(r => ({ date: r.date, total: parseFloat(r.total) })),
      expenses: expResult.rows.map(r => ({ date: r.date, total: parseFloat(r.total) })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
