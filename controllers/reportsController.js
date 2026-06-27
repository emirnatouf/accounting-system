const db = require('../models/database');

exports.getReport = async (req, res) => {
  try {
    const { period = 'all', date_from, date_to } = req.query;
    const today = new Date().toISOString().split('T')[0];

    const buildWhere = (dateField) => {
      const params = [];
      let where = '1=1';
      let pi = 1;

      if (period === 'today') {
        where = `${dateField} = $${pi}`; params.push(today);
      } else if (period === 'week') {
        const d = new Date(); d.setDate(d.getDate() - 7);
        where = `${dateField} >= $${pi}`; params.push(d.toISOString().split('T')[0]);
      } else if (period === 'month') {
        const firstDay = today.substring(0, 7) + '-01';
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        where = `${dateField} BETWEEN $${pi} AND $${pi + 1}`; params.push(firstDay, lastDay);
      } else if (period === 'year') {
        const firstDay = today.substring(0, 4) + '-01-01';
        const lastDay  = today.substring(0, 4) + '-12-31';
        where = `${dateField} BETWEEN $${pi} AND $${pi + 1}`; params.push(firstDay, lastDay);
      } else if (period === 'custom' && date_from && date_to) {
        where = `${dateField} BETWEEN $${pi} AND $${pi + 1}`; params.push(date_from, date_to);
      }

      return { where, params };
    };

    const inc = buildWhere('payment_date');
    const exp = buildWhere('expense_date');

    const [incStats, expStats, incRows, expRows] = await Promise.all([
      db.query(`SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM income WHERE ${inc.where}`, inc.params),
      db.query(`SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM expenses WHERE ${exp.where}`, exp.params),
      db.query(`SELECT * FROM income WHERE ${inc.where} ORDER BY payment_date DESC`, inc.params),
      db.query(`SELECT * FROM expenses WHERE ${exp.where} ORDER BY expense_date DESC`, exp.params),
    ]);

    const iStats = incStats.rows[0];
    const eStats = expStats.rows[0];

    res.json({
      totalIncome:   parseFloat(iStats.total),
      totalExpenses: parseFloat(eStats.total),
      netProfit:     parseFloat(iStats.total) - parseFloat(eStats.total),
      incomeCount:   parseInt(iStats.count),
      expensesCount: parseInt(eStats.count),
      incomeRows:    incRows.rows,
      expenseRows:   expRows.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
