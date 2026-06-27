/**
 * i18n.js — Centralized translations for Arabic / English
 *
 * Usage:
 *   t('key')                  → translated string
 *   t('key', {start:1,end:10,total:50}) → with interpolation
 *
 * EJS templates use data-i18n="key" on elements.
 * applyTranslations() is called once on DOMContentLoaded (in footer.ejs).
 */

window.TRANSLATIONS = {
  ar: {
    // ── System ──────────────────────────────────────────────────
    sys_name:          'نظام المحاسبة',
    sys_version:       'الإصدار 2.0',

    // ── Navigation ──────────────────────────────────────────────
    nav_dashboard:     'لوحة التحكم',
    nav_income:        'الإيرادات',
    nav_expenses:      'المصروفات',
    nav_reports:       'التقارير',
    nav_logout:        'تسجيل الخروج',
    nav_lang_switch:   'English',

    // ── Common actions ──────────────────────────────────────────
    btn_save:          'حفظ',
    btn_cancel:        'إلغاء',
    btn_clear:         'مسح',
    btn_apply:         'تطبيق',
    btn_view:          'عرض',
    btn_export_pdf:    'تصدير PDF',
    btn_export_excel:  'تصدير Excel',

    // ── Common columns ──────────────────────────────────────────
    col_num:           '#',
    col_amount:        'المبلغ ($)',
    col_date:          'التاريخ',
    col_receipt_num:   'رقم الوصل',
    col_file:          'الوصل',
    col_actions:       'الإجراءات',

    // ── Filters / pagination ────────────────────────────────────
    filter_from:       'من تاريخ',
    filter_to:         'إلى تاريخ',
    showing_records:   'عرض {start} – {end} من {total} سجل',
    no_records:        'لا توجد سجلات مطابقة للبحث',
    pag_prev:          '‹ السابق',
    pag_next:          'التالي ›',

    // ── States ──────────────────────────────────────────────────
    loading:           'جاري التحميل...',
    saving:            'جاري الحفظ...',

    // ── File upload ─────────────────────────────────────────────
    file_optional:     'JPG / PNG / PDF — اختياري',
    file_current:      'الملف الحالي:',
    file_cloud:        'ملف محفوظ على السحابة',
    file_replace_hint: 'رفع ملف جديد سيستبدل الملف الحالي تلقائياً',
    label_receipt_file:'صورة الوصل',

    // ── Common errors ───────────────────────────────────────────
    err_server:        'خطأ في الاتصال بالخادم',
    err_load:          'خطأ في تحميل بيانات السجل',
    err_amount:        'المبلغ يجب أن يكون رقماً موجباً',
    err_receipt_num:   'رقم الوصل مطلوب',
    err_date:          'تاريخ العملية مطلوب',

    // ── Delete confirmation ─────────────────────────────────────
    confirm_delete_title:    'تأكيد الحذف',
    confirm_delete_subtitle: 'سيتم حذف السجل التالي نهائياً:',
    confirm_delete_warning:  'لا يمكن التراجع عن هذا الإجراء — وسيُحذف ملف الوصل أيضاً إن وُجد',
    confirm_delete_btn:      'نعم، احذف نهائياً',
    confirm_receipt_label:   'رقم الوصل:',

    // ── Login ───────────────────────────────────────────────────
    login_subtitle:    'يرجى تسجيل الدخول للمتابعة',
    login_user_label:  'اسم المستخدم',
    login_pass_label:  'كلمة المرور',
    login_user_ph:     'أدخل اسم المستخدم',
    login_pass_ph:     'أدخل كلمة المرور',
    login_btn:         'دخول',

    // ── Dashboard ───────────────────────────────────────────────
    stat_total_income:   'إجمالي الإيرادات',
    stat_income_ops:     'عملية قبض',
    stat_total_expenses: 'إجمالي المصروفات',
    stat_expense_ops:    'عملية صرف',
    stat_net_profit:     'صافي الربح',
    badge_profit:        'ربح',
    badge_loss:          'خسارة',
    badge_break_even:    'تعادل',
    shortcut_add_income:     'إضافة عملية قبض',
    shortcut_add_income_sub: 'تسجيل إيراد جديد',
    shortcut_add_expense:    'إضافة مصروف',
    shortcut_add_expense_sub:'تسجيل مصروف جديد',
    chart_title:         'الإيرادات والمصروفات — آخر 30 يوماً',
    chart_loading:       'جاري تحميل البيانات...',
    chart_no_data:       'لا توجد بيانات لعرضها في الرسم البياني بعد',
    chart_start:         'ابدأ بإضافة إيرادات',
    chart_income_label:  'الإيرادات',
    chart_expenses_label:'المصروفات',
    date_locale:         'ar-SA',

    // ── Income ──────────────────────────────────────────────────
    btn_add_income:       'إضافة عملية قبض',
    modal_add_income:     'إضافة عملية قبض',
    modal_edit_income:    'تعديل عملية قبض',
    col_student_name:     'اسم الطالب',
    col_spec:             'التخصص',
    col_payment_reason:   'سبب القبض',
    label_student_name:   'اسم الطالب',
    label_spec:           'التخصص',
    label_payment_reason: 'سبب القبض',
    label_payment_date:   'تاريخ العملية',
    label_amount_income:  'قيمة القبض ($)',
    label_receipt_num:    'رقم الوصل',
    ph_student_name:      'اسم الطالب',
    ph_spec:              'التخصص (اختياري)',
    ph_payment_reason:    'سبب القبض (اختياري)',
    ph_receipt_num:       'رقم الوصل الفريد',
    search_income_ph:     'اسم الطالب / رقم الوصل',
    search_spec_ph:       'بحث بالتخصص',
    err_student_name:     'اسم الطالب مطلوب',
    msg_add_income:       'تم إضافة عملية القبض بنجاح ✅',
    msg_edit_income:      'تم تحديث عملية القبض بنجاح ✅',
    msg_delete_income:    'تم حذف عملية القبض بنجاح',
    records_label:        'سجل',

    // ── Expenses ────────────────────────────────────────────────
    btn_add_expense:       'إضافة مصروف',
    modal_add_expense:     'إضافة مصروف',
    modal_edit_expense:    'تعديل مصروف',
    col_receiver_name:     'اسم المستلم',
    col_expense_reason:    'سبب المصروف',
    label_receiver_name:   'اسم المستلم',
    label_expense_reason:  'سبب المصروف',
    label_expense_date:    'تاريخ العملية',
    label_amount_expense:  'قيمة المصروف ($)',
    ph_receiver_name:      'اسم الشخص أو الجهة المستلمة',
    ph_expense_reason:     'وصف سبب الصرف (اختياري)',
    search_expenses_ph:    'اسم المستلم / رقم الوصل',
    err_receiver_name:     'اسم المستلم مطلوب',
    msg_add_expense:       'تم إضافة المصروف بنجاح ✅',
    msg_edit_expense:      'تم تحديث المصروف بنجاح ✅',
    msg_delete_expense:    'تم حذف المصروف بنجاح',

    // ── Reports ─────────────────────────────────────────────────
    period_filter_label:  'فلترة الفترة الزمنية',
    period_all:           'الكل',
    period_today:         'اليوم',
    period_week:          'هذا الأسبوع',
    period_month:         'هذا الشهر',
    period_year:          'هذه السنة',
    period_custom:        'فترة مخصصة',
    report_details:       'تفاصيل الفترة',
    income_table_title:   'عمليات القبض (الإيرادات)',
    expenses_table_title: 'عمليات الصرف (المصروفات)',
    ops_count:            'عملية',
    no_income_period:     'لا توجد إيرادات في هذه الفترة',
    no_expenses_period:   'لا توجد مصروفات في هذه الفترة',
    err_date_range:       'يرجى تحديد تاريخ البداية والنهاية',
    err_report:           'خطأ في تحميل التقرير',
    success_excel:        'تم تصدير ملف Excel بنجاح',
    pdf_title:            'نظام المحاسبة — التقرير المالي',
    pdf_period_label:     'الفترة:',
    pdf_print_date:       'تاريخ الطباعة:',
    excel_summary_title:  'نظام المحاسبة — التقرير المالي',
    excel_sheet_summary:  'الملخص',
    excel_sheet_income:   'الإيرادات',
    excel_sheet_expenses: 'المصروفات',
    pdf_dir:              'rtl',
    pdf_lang:             'ar',
    pdf_text_align:       'right',
  },

  en: {
    // ── System ──────────────────────────────────────────────────
    sys_name:          'Accounting System',
    sys_version:       'Version 2.0',

    // ── Navigation ──────────────────────────────────────────────
    nav_dashboard:     'Dashboard',
    nav_income:        'Income',
    nav_expenses:      'Expenses',
    nav_reports:       'Reports',
    nav_logout:        'Sign Out',
    nav_lang_switch:   'عربي',

    // ── Common actions ──────────────────────────────────────────
    btn_save:          'Save',
    btn_cancel:        'Cancel',
    btn_clear:         'Clear',
    btn_apply:         'Apply',
    btn_view:          'View',
    btn_export_pdf:    'Export PDF',
    btn_export_excel:  'Export Excel',

    // ── Common columns ──────────────────────────────────────────
    col_num:           '#',
    col_amount:        'Amount ($)',
    col_date:          'Date',
    col_receipt_num:   'Receipt No.',
    col_file:          'Receipt',
    col_actions:       'Actions',

    // ── Filters / pagination ────────────────────────────────────
    filter_from:       'From Date',
    filter_to:         'To Date',
    showing_records:   'Showing {start} – {end} of {total} records',
    no_records:        'No matching records found',
    pag_prev:          '‹ Prev',
    pag_next:          'Next ›',

    // ── States ──────────────────────────────────────────────────
    loading:           'Loading...',
    saving:            'Saving...',

    // ── File upload ─────────────────────────────────────────────
    file_optional:     'JPG / PNG / PDF — optional',
    file_current:      'Current file:',
    file_cloud:        'File stored in cloud',
    file_replace_hint: 'Uploading a new file will replace the current one',
    label_receipt_file:'Receipt Image',

    // ── Common errors ───────────────────────────────────────────
    err_server:        'Connection error',
    err_load:          'Error loading record data',
    err_amount:        'Amount must be a positive number',
    err_receipt_num:   'Receipt number is required',
    err_date:          'Transaction date is required',

    // ── Delete confirmation ─────────────────────────────────────
    confirm_delete_title:    'Confirm Deletion',
    confirm_delete_subtitle: 'The following record will be permanently deleted:',
    confirm_delete_warning:  'This action cannot be undone — the receipt file will also be deleted if present',
    confirm_delete_btn:      'Yes, Delete Permanently',
    confirm_receipt_label:   'Receipt No.:',

    // ── Login ───────────────────────────────────────────────────
    login_subtitle:    'Please sign in to continue',
    login_user_label:  'Username',
    login_pass_label:  'Password',
    login_user_ph:     'Enter your username',
    login_pass_ph:     'Enter your password',
    login_btn:         'Sign In',

    // ── Dashboard ───────────────────────────────────────────────
    stat_total_income:   'Total Income',
    stat_income_ops:     'transactions',
    stat_total_expenses: 'Total Expenses',
    stat_expense_ops:    'transactions',
    stat_net_profit:     'Net Profit',
    badge_profit:        'Profit',
    badge_loss:          'Loss',
    badge_break_even:    'Break Even',
    shortcut_add_income:     'Add Income',
    shortcut_add_income_sub: 'Record a new income entry',
    shortcut_add_expense:    'Add Expense',
    shortcut_add_expense_sub:'Record a new expense entry',
    chart_title:         'Income & Expenses — Last 30 Days',
    chart_loading:       'Loading chart data...',
    chart_no_data:       'No data available for the chart yet',
    chart_start:         'Start adding income',
    chart_income_label:  'Income',
    chart_expenses_label:'Expenses',
    date_locale:         'en-US',

    // ── Income ──────────────────────────────────────────────────
    btn_add_income:       'Add Income',
    modal_add_income:     'Add Income',
    modal_edit_income:    'Edit Income',
    col_student_name:     'Student Name',
    col_spec:             'Specialization',
    col_payment_reason:   'Reason',
    label_student_name:   'Student Name',
    label_spec:           'Specialization',
    label_payment_reason: 'Payment Reason',
    label_payment_date:   'Transaction Date',
    label_amount_income:  'Amount ($)',
    label_receipt_num:    'Receipt Number',
    ph_student_name:      'Student name',
    ph_spec:              'Specialization (optional)',
    ph_payment_reason:    'Payment reason (optional)',
    ph_receipt_num:       'Unique receipt number',
    search_income_ph:     'Student name / Receipt no.',
    search_spec_ph:       'Search by specialization',
    err_student_name:     'Student name is required',
    msg_add_income:       'Income added successfully ✅',
    msg_edit_income:      'Income updated successfully ✅',
    msg_delete_income:    'Income deleted successfully',
    records_label:        'records',

    // ── Expenses ────────────────────────────────────────────────
    btn_add_expense:       'Add Expense',
    modal_add_expense:     'Add Expense',
    modal_edit_expense:    'Edit Expense',
    col_receiver_name:     'Receiver',
    col_expense_reason:    'Expense Reason',
    label_receiver_name:   'Receiver Name',
    label_expense_reason:  'Expense Reason',
    label_expense_date:    'Transaction Date',
    label_amount_expense:  'Amount ($)',
    ph_receiver_name:      'Person or organization name',
    ph_expense_reason:     'Describe the expense reason (optional)',
    search_expenses_ph:    'Receiver name / Receipt no.',
    err_receiver_name:     'Receiver name is required',
    msg_add_expense:       'Expense added successfully ✅',
    msg_edit_expense:      'Expense updated successfully ✅',
    msg_delete_expense:    'Expense deleted successfully',

    // ── Reports ─────────────────────────────────────────────────
    period_filter_label:  'Filter by Period',
    period_all:           'All',
    period_today:         'Today',
    period_week:          'This Week',
    period_month:         'This Month',
    period_year:          'This Year',
    period_custom:        'Custom Range',
    report_details:       'Period Details',
    income_table_title:   'Income Transactions',
    expenses_table_title: 'Expense Transactions',
    ops_count:            'entries',
    no_income_period:     'No income records for this period',
    no_expenses_period:   'No expense records for this period',
    err_date_range:       'Please select start and end dates',
    err_report:           'Error loading report',
    success_excel:        'Excel file exported successfully',
    pdf_title:            'Accounting System — Financial Report',
    pdf_period_label:     'Period:',
    pdf_print_date:       'Print Date:',
    excel_summary_title:  'Accounting System — Financial Report',
    excel_sheet_summary:  'Summary',
    excel_sheet_income:   'Income',
    excel_sheet_expenses: 'Expenses',
    pdf_dir:              'ltr',
    pdf_lang:             'en',
    pdf_text_align:       'left',
  }
};

// ── t() — translate a key, with optional {placeholder} interpolation ──────────
window.t = function(key, params) {
  const lang = document.documentElement.lang || 'ar';
  const dict = window.TRANSLATIONS[lang] || window.TRANSLATIONS['ar'];
  let text = dict[key] ?? window.TRANSLATIONS['ar'][key] ?? key;
  if (params) {
    Object.keys(params).forEach(k => {
      text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
    });
  }
  return text;
};

// ── applyTranslations() — walk DOM and translate data-i18n-* elements ─────────
window.applyTranslations = function() {
  // data-i18n → textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (v !== el.dataset.i18n) el.textContent = v;
  });
  // data-i18n-placeholder → placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const v = t(el.dataset.i18nPlaceholder);
    if (v !== el.dataset.i18nPlaceholder) el.placeholder = v;
  });
  // data-i18n-title → title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const v = t(el.dataset.i18nTitle);
    if (v !== el.dataset.i18nTitle) el.title = v;
  });
};
