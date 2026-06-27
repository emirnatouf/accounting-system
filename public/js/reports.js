let currentPeriod = 'all';
let reportData    = null;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;

      const isCustom = currentPeriod === 'custom';
      document.getElementById('customDateRow').style.display  = isCustom ? '' : 'none';
      document.getElementById('customDateRow2').style.display = isCustom ? '' : 'none';
      document.getElementById('applyBtnRow').style.display    = isCustom ? '' : 'none';

      if (!isCustom) loadReport();
    });
  });

  loadReport();
});

async function loadReport() {
  const params = new URLSearchParams({ period: currentPeriod });

  if (currentPeriod === 'custom') {
    const from = document.getElementById('dateFrom').value;
    const to   = document.getElementById('dateTo').value;
    if (!from || !to) { showToast(t('err_date_range'), 'warning'); return; }
    params.set('date_from', from);
    params.set('date_to', to);
  }

  try {
    const res  = await fetch('/api/reports?' + params);
    reportData = await res.json();
    renderSummary(reportData);
    renderIncomeTable(reportData.incomeRows);
    renderExpensesTable(reportData.expenseRows);
  } catch { showToast(t('err_report'), 'error'); }
}

function renderSummary(d) {
  document.getElementById('rTotalIncome').textContent   = fmtCurrency(d.totalIncome);
  document.getElementById('rTotalExpenses').textContent = fmtCurrency(d.totalExpenses);
  document.getElementById('rIncomeCount').textContent   = d.incomeCount;
  document.getElementById('rExpensesCount').textContent = d.expensesCount;

  const netEl   = document.getElementById('rNetProfit');
  const badgeEl = document.getElementById('rProfitBadge');
  netEl.textContent = fmtCurrency(d.netProfit);
  if (d.netProfit > 0) {
    netEl.className   = 'fw-bold fs-3 text-success';
    badgeEl.innerHTML = `<span class="badge bg-success-subtle text-success"><i class="bi bi-arrow-up me-1"></i>${t('badge_profit')}</span>`;
  } else if (d.netProfit < 0) {
    netEl.className   = 'fw-bold fs-3 text-danger';
    badgeEl.innerHTML = `<span class="badge bg-danger-subtle text-danger"><i class="bi bi-arrow-down me-1"></i>${t('badge_loss')}</span>`;
  } else {
    netEl.className   = 'fw-bold fs-3 text-secondary';
    badgeEl.innerHTML = `<span class="badge bg-secondary-subtle text-secondary">${t('badge_break_even')}</span>`;
  }
}

function renderIncomeTable(rows) {
  const tbody = document.getElementById('incomeTableBody');
  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-muted">${t('no_income_period')}</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map((r, i) => `
    <tr>
      <td class="text-muted small">${i+1}</td>
      <td><strong>${esc(r.student_name)}</strong></td>
      <td class="d-none d-md-table-cell text-muted">${esc(r.specialization) || '—'}</td>
      <td><span class="text-success fw-semibold">${fmtCurrency(r.amount)}</span></td>
      <td class="d-none d-lg-table-cell">${esc(r.payment_reason) || '—'}</td>
      <td><code class="small">${esc(r.receipt_number)}</code></td>
      <td class="d-none d-md-table-cell text-muted small">${fmtDate(r.payment_date)}</td>
    </tr>`).join('');
}

function renderExpensesTable(rows) {
  const tbody = document.getElementById('expensesTableBody');
  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">${t('no_expenses_period')}</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map((r, i) => `
    <tr>
      <td class="text-muted small">${i+1}</td>
      <td><strong>${esc(r.receiver_name)}</strong></td>
      <td><span class="text-danger fw-semibold">${fmtCurrency(r.amount)}</span></td>
      <td class="d-none d-lg-table-cell">${esc(r.expense_reason) || '—'}</td>
      <td><code class="small">${esc(r.receipt_number)}</code></td>
      <td class="d-none d-md-table-cell text-muted small">${fmtDate(r.expense_date)}</td>
    </tr>`).join('');
}

// ---- Export PDF (via browser print) ----
function exportPDF() {
  if (!reportData) return;

  const periodLabels = {
    all:    t('period_all'),
    today:  t('period_today'),
    week:   t('period_week'),
    month:  t('period_month'),
    year:   t('period_year'),
    custom: t('period_custom'),
  };
  const label     = periodLabels[currentPeriod] || '';
  const dir       = t('pdf_dir');
  const lang      = t('pdf_lang');
  const textAlign = t('pdf_text_align');
  const locale    = t('date_locale');
  const printDate = new Date().toLocaleDateString(locale);

  const printWin = window.open('', '_blank', 'width=900,height=700');
  printWin.document.write(`<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<title>${t('pdf_title')}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 12px; color: #111; margin: 20px; direction: ${dir}; }
  h1   { text-align: center; font-size: 18px; margin-bottom: 4px; }
  .sub { text-align: center; color: #555; font-size: 11px; margin-bottom: 20px; }
  .summary { display: flex; gap: 20px; justify-content: center; margin-bottom: 20px; }
  .s-box   { border: 1px solid #ddd; border-radius: 8px; padding: 10px 20px; text-align: center; }
  .s-box .label { font-size: 10px; color: #777; }
  .s-box .value { font-size: 16px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th    { background: #f0f4f8; padding: 7px 10px; text-align: ${textAlign}; font-size: 11px; border: 1px solid #ddd; }
  td    { padding: 6px 10px; border: 1px solid #eee; text-align: ${textAlign}; }
  tr:nth-child(even) { background: #fafafa; }
  h3    { margin: 16px 0 6px; font-size: 13px; }
  .green { color: #198754; } .red { color: #dc3545; }
  @media print { body { margin: 5mm; } }
</style>
</head>
<body>
<h1>${t('pdf_title')}</h1>
<div class="sub">${t('pdf_period_label')} ${label} &nbsp;|&nbsp; ${t('pdf_print_date')} ${printDate}</div>
<div class="summary">
  <div class="s-box"><div class="label">${t('stat_total_income')}</div><div class="value green">${fmtCurrency(reportData.totalIncome)}</div></div>
  <div class="s-box"><div class="label">${t('stat_total_expenses')}</div><div class="value red">${fmtCurrency(reportData.totalExpenses)}</div></div>
  <div class="s-box"><div class="label">${t('stat_net_profit')}</div>
    <div class="value ${reportData.netProfit >= 0 ? 'green' : 'red'}">${fmtCurrency(reportData.netProfit)}</div></div>
</div>
<h3>${t('income_table_title')} (${reportData.incomeCount} ${t('ops_count')})</h3>
<table>
  <tr>
    <th>${t('col_num')}</th><th>${t('col_student_name')}</th><th>${t('col_spec')}</th>
    <th>${t('col_amount')}</th><th>${t('col_payment_reason')}</th>
    <th>${t('col_receipt_num')}</th><th>${t('col_date')}</th>
  </tr>
  ${reportData.incomeRows.map((r, i) => `<tr>
    <td>${i+1}</td><td>${esc(r.student_name)}</td><td>${esc(r.specialization) || '—'}</td>
    <td class="green">${fmtCurrency(r.amount)}</td><td>${esc(r.payment_reason) || '—'}</td>
    <td>${esc(r.receipt_number)}</td><td>${fmtDate(r.payment_date)}</td>
  </tr>`).join('') || `<tr><td colspan="7" style="text-align:center">${t('no_income_period')}</td></tr>`}
</table>
<h3>${t('expenses_table_title')} (${reportData.expensesCount} ${t('ops_count')})</h3>
<table>
  <tr>
    <th>${t('col_num')}</th><th>${t('col_receiver_name')}</th><th>${t('col_amount')}</th>
    <th>${t('col_expense_reason')}</th><th>${t('col_receipt_num')}</th><th>${t('col_date')}</th>
  </tr>
  ${reportData.expenseRows.map((r, i) => `<tr>
    <td>${i+1}</td><td>${esc(r.receiver_name)}</td>
    <td class="red">${fmtCurrency(r.amount)}</td><td>${esc(r.expense_reason) || '—'}</td>
    <td>${esc(r.receipt_number)}</td><td>${fmtDate(r.expense_date)}</td>
  </tr>`).join('') || `<tr><td colspan="6" style="text-align:center">${t('no_expenses_period')}</td></tr>`}
</table>
</body></html>`);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => { printWin.print(); }, 500);
}

// ---- Export Excel ----
function exportExcel() {
  if (!reportData) return;

  const periodLabels = {
    all:    t('period_all'),
    today:  t('period_today'),
    week:   t('period_week'),
    month:  t('period_month'),
    year:   t('period_year'),
    custom: t('period_custom'),
  };
  const locale    = t('date_locale');
  const exportDate = new Date().toLocaleDateString(locale);
  const periodLabel = periodLabels[currentPeriod] || '';

  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    [t('excel_summary_title')],
    [`${t('pdf_period_label')} ${periodLabel} | ${t('pdf_print_date')} ${exportDate}`],
    [],
    [t('stat_total_income'),   reportData.totalIncome],
    [t('stat_total_expenses'), reportData.totalExpenses],
    [t('stat_net_profit'),     reportData.netProfit],
    [t('stat_income_ops'),     reportData.incomeCount],
    [t('stat_expense_ops'),    reportData.expensesCount],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), t('excel_sheet_summary'));

  // Income sheet
  const incHeader = [t('col_num'), t('col_student_name'), t('col_spec'), t('col_amount'), t('col_payment_reason'), t('col_receipt_num'), t('col_date')];
  const incRows   = reportData.incomeRows.map((r, i) => [
    i + 1, r.student_name, r.specialization || '', r.amount,
    r.payment_reason || '', r.receipt_number, r.payment_date
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([incHeader, ...incRows]), t('excel_sheet_income'));

  // Expenses sheet
  const expHeader = [t('col_num'), t('col_receiver_name'), t('col_amount'), t('col_expense_reason'), t('col_receipt_num'), t('col_date')];
  const expRows   = reportData.expenseRows.map((r, i) => [
    i + 1, r.receiver_name, r.amount,
    r.expense_reason || '', r.receipt_number, r.expense_date
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([expHeader, ...expRows]), t('excel_sheet_expenses'));

  const fileName = `report-${periodLabel}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  showToast(t('success_excel'), 'success');
}
