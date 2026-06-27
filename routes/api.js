require('dotenv').config();
const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { requireAuth } = require('../middleware/auth');

// Protect all API routes
router.use(requireAuth);

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder:        'accounting-receipts',
    resource_type: 'auto',
    public_id:     Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
  }),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('نوع الملف غير مدعوم. المسموح به: JPG, PNG, PDF'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

const dashboardCtrl = require('../controllers/dashboardController');
const incomeCtrl    = require('../controllers/incomeController');
const expensesCtrl  = require('../controllers/expensesController');
const reportsCtrl   = require('../controllers/reportsController');

// Dashboard
router.get('/dashboard/stats', dashboardCtrl.getStats);
router.get('/dashboard/chart', dashboardCtrl.getChartData);

// Income CRUD
router.get('/income',        incomeCtrl.getAll);
router.get('/income/:id',    incomeCtrl.getOne);
router.post('/income',       upload.single('receipt_file'), incomeCtrl.create);
router.put('/income/:id',    upload.single('receipt_file'), incomeCtrl.update);
router.delete('/income/:id', incomeCtrl.remove);

// Expenses CRUD
router.get('/expenses',         expensesCtrl.getAll);
router.get('/expenses/:id',     expensesCtrl.getOne);
router.post('/expenses',        upload.single('receipt_file'), expensesCtrl.create);
router.put('/expenses/:id',     upload.single('receipt_file'), expensesCtrl.update);
router.delete('/expenses/:id',  expensesCtrl.remove);

// Reports
router.get('/reports', reportsCtrl.getReport);

// Multer error handling
router.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message });
  next(err);
});

module.exports = router;
