const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/',          (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', (req, res) => res.render('dashboard', { title: 'لوحة التحكم', page: 'dashboard' }));
router.get('/income',    (req, res) => res.render('income',    { title: 'الإيرادات - عمليات القبض', page: 'income' }));
router.get('/expenses',  (req, res) => res.render('expenses',  { title: 'المصروفات - عمليات الصرف', page: 'expenses' }));
router.get('/reports',   (req, res) => res.render('reports',   { title: 'التقارير المالية', page: 'reports' }));

module.exports = router;
