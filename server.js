require('dotenv').config();
const express  = require('express');
const path     = require('path');
const session  = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bcrypt   = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const db       = require('./models/database');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function start() {
  await db.initialize();

  const app  = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  // Sessions (stored in PostgreSQL)
  app.use(session({
    store: new pgSession({
      pool:                 db.pool,
      createTableIfMissing: true,
    }),
    secret:            process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave:            false,
    saveUninitialized: false,
    cookie: {
      secure:  process.env.NODE_ENV === 'production',
      maxAge:  7 * 24 * 60 * 60 * 1000,
    },
  }));

  // Language switcher (public — no auth required)
  app.post('/set-lang', (req, res) => {
    const { lang } = req.body;
    if (lang === 'ar' || lang === 'en') req.session.lang = lang;
    const referer = req.get('Referer');
    let returnPath = '/dashboard';
    try {
      const parsed = new URL(referer || '', 'http://localhost');
      if (parsed.pathname && parsed.pathname !== '/login') returnPath = parsed.pathname;
    } catch {}
    res.redirect(returnPath);
  });

  // Expose session data to all EJS templates
  app.use((req, res, next) => {
    res.locals.username = req.session?.username || null;
    res.locals.lang     = req.session?.lang     || 'ar';
    next();
  });

  // View engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Auth routes (public — no auth required)
  app.get('/login', (req, res) => {
    if (req.session?.userId) return res.redirect('/dashboard');
    res.render('login', { title: 'تسجيل الدخول', error: null });
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username?.trim()]);
      const user = result.rows[0];
      if (!user) {
        return res.render('login', { title: 'تسجيل الدخول', error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.render('login', { title: 'تسجيل الدخول', error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }
      req.session.userId   = user.id;
      req.session.username = user.username;
      res.redirect('/dashboard');
    } catch (err) {
      res.render('login', { title: 'تسجيل الدخول', error: 'خطأ في الخادم: ' + err.message });
    }
  });

  app.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
  });

  // Protected routes (auth required)
  app.use('/',    require('./routes/pages'));
  app.use('/api', require('./routes/api'));

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'خطأ في الخادم: ' + err.message });
  });

  app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║          نظام المحاسبة                    ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║   ✅ يعمل على: http://localhost:${PORT}       ║`);
    console.log('╚══════════════════════════════════════════╝\n');
  });
}

start().catch(err => {
  console.error('\n❌ فشل تشغيل الخادم:', err.message);
  process.exit(1);
});
