# نظام المحاسبة — Accounting System

نظام محاسبة متكامل بواجهة عربية RTL، مبني بـ Node.js + PostgreSQL + Cloudinary.

---

## المتطلبات

- Node.js 18+
- PostgreSQL (محلياً أو عبر Railway/Render)
- حساب Cloudinary (مجاني)

---

## التشغيل محلياً

### 1. تثبيت الحزم

```bash
npm install
```

### 2. إعداد ملف البيئة

```bash
cp .env.example .env
```

ثم افتح `.env` وعدّل القيم:

| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | رابط اتصال PostgreSQL المحلي |
| `CLOUDINARY_CLOUD_NAME` | اسم حساب Cloudinary |
| `CLOUDINARY_API_KEY` | مفتاح API من لوحة Cloudinary |
| `CLOUDINARY_API_SECRET` | السر الخاص من لوحة Cloudinary |
| `SESSION_SECRET` | نص عشوائي طويل لتشفير الجلسات |
| `ADMIN_USERNAME` | اسم المستخدم الافتراضي (admin) |
| `ADMIN_PASSWORD` | كلمة مرور المستخدم الافتراضي |

### 3. إنشاء قاعدة بيانات PostgreSQL محلية

```bash
psql -U postgres -c "CREATE DATABASE accounting;"
```

ثم في `.env`:
```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/accounting
```

### 4. تشغيل الخادم

```bash
npm start
```

افتح المتصفح على: **http://localhost:3000**

بيانات الدخول الافتراضية: `admin` / `admin123` (أو ما حددته في `.env`)

---

## النشر على Railway

### 1. أنشئ مشروعاً جديداً

- اذهب إلى [railway.app](https://railway.app) وسجّل دخولك
- اضغط **New Project → Deploy from GitHub repo**
- اختر المستودع

### 2. أضف PostgreSQL

- داخل المشروع: **New → Database → Add PostgreSQL**
- انسخ **DATABASE_URL** من تبويب Variables في قاعدة البيانات
- أضفه كمتغير بيئة في خدمة التطبيق

### 3. أضف متغيرات البيئة

في تبويب **Variables** في خدمة التطبيق أضف:

```
DATABASE_URL=<انسخ من قاعدة بيانات Railway>
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SESSION_SECRET=<نص عشوائي طويل>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<كلمة مرور قوية>
```

### 4. النشر تلقائي

Railway سيبني المشروع وينشره تلقائياً عند كل push إلى main.

---

## النشر على Render

### 1. أنشئ Web Service

- اذهب إلى [render.com](https://render.com) وسجّل دخولك
- **New → Web Service → Connect GitHub repo**
- Build Command: `npm install`
- Start Command: `npm start`

### 2. أضف PostgreSQL

- **New → PostgreSQL** → أنشئ قاعدة بيانات
- انسخ **Internal Database URL**

### 3. أضف متغيرات البيئة

في تبويب **Environment** أضف نفس المتغيرات أعلاه.

---

## هيكل المشروع

```
Accounting-System/
├── server.js               ← الخادم + تسجيل الدخول/الخروج
├── .env                    ← متغيرات البيئة (لا يُرفع لـ git)
├── .env.example            ← قالب متغيرات البيئة
├── .gitignore
├── middleware/
│   └── auth.js             ← حماية المسارات
├── models/
│   └── database.js         ← PostgreSQL pool + initialize
├── routes/
│   ├── pages.js            ← مسارات الصفحات (محمية)
│   └── api.js              ← مسارات API (محمية) + Cloudinary upload
├── controllers/
│   ├── dashboardController.js
│   ├── incomeController.js
│   ├── expensesController.js
│   └── reportsController.js
├── views/
│   ├── login.ejs
│   ├── partials/ (header, footer)
│   ├── dashboard.ejs
│   ├── income.ejs
│   ├── expenses.ejs
│   └── reports.ejs
└── public/
    ├── css/style.css
    └── js/ (dashboard, income, expenses, reports)
```

---

## API Endpoints (تتطلب جلسة نشطة)

```
POST   /login
POST   /logout

GET    /api/dashboard/stats
GET    /api/dashboard/chart

GET    /api/income
POST   /api/income
GET    /api/income/:id
PUT    /api/income/:id
DELETE /api/income/:id

GET    /api/expenses
POST   /api/expenses
GET    /api/expenses/:id
PUT    /api/expenses/:id
DELETE /api/expenses/:id

GET    /api/reports?period=month
```

---

## ملاحظات

- الجداول تُنشأ تلقائياً عند أول تشغيل
- المستخدم الافتراضي يُنشأ تلقائياً من `ADMIN_USERNAME` و `ADMIN_PASSWORD`
- الملفات (صور الوصولات) تُرفع إلى Cloudinary
- الجلسات تُخزَّن في PostgreSQL ولا تُفقد عند إعادة تشغيل الخادم
- عند حذف سجل يُحذف ملفه من Cloudinary تلقائياً
