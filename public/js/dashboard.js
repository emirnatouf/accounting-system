document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadChart();
});

async function loadStats() {
  try {
    const res  = await fetch('/api/dashboard/stats');
    const data = await res.json();

    document.getElementById('totalIncome').textContent   = fmtCurrency(data.totalIncome);
    document.getElementById('totalExpenses').textContent = fmtCurrency(data.totalExpenses);
    document.getElementById('incomeCount').textContent   = data.incomeCount;
    document.getElementById('expensesCount').textContent = data.expensesCount;

    const netEl    = document.getElementById('netProfit');
    const statusEl = document.getElementById('profitStatus');
    netEl.textContent = fmtCurrency(data.netProfit);
    if (data.netProfit > 0) {
      netEl.className   = 'fw-bold fs-3 text-success';
      statusEl.innerHTML = `<span class="badge bg-success-subtle text-success"><i class="bi bi-arrow-up me-1"></i>${t('badge_profit')}</span>`;
    } else if (data.netProfit < 0) {
      netEl.className   = 'fw-bold fs-3 text-danger';
      statusEl.innerHTML = `<span class="badge bg-danger-subtle text-danger"><i class="bi bi-arrow-down me-1"></i>${t('badge_loss')}</span>`;
    } else {
      netEl.className   = 'fw-bold fs-3 text-secondary';
      statusEl.innerHTML = `<span class="badge bg-secondary-subtle text-secondary">${t('badge_break_even')}</span>`;
    }
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

async function loadChart() {
  try {
    const res  = await fetch('/api/dashboard/chart');
    const data = await res.json();

    const allDates = [...new Set([
      ...data.income.map(r => r.date),
      ...data.expenses.map(r => r.date)
    ])].sort();

    const placeholder = document.getElementById('chartPlaceholder');
    const canvas      = document.getElementById('mainChart');

    if (allDates.length === 0) {
      placeholder.innerHTML = `
        <div class="py-5 text-muted">
          <i class="bi bi-bar-chart-line fs-1 d-block mb-2 opacity-25"></i>
          <div>${t('chart_no_data')}</div>
          <a href="/income" class="btn btn-sm btn-success mt-2">${t('chart_start')}</a>
        </div>`;
      return;
    }

    placeholder.style.display = 'none';
    canvas.style.display = 'block';

    const incMap = Object.fromEntries(data.income.map(r => [r.date, r.total]));
    const expMap = Object.fromEntries(data.expenses.map(r => [r.date, r.total]));

    const labels = allDates.map(d =>
      new Date(d + 'T00:00:00').toLocaleDateString(t('date_locale'), { month: 'short', day: 'numeric' })
    );

    new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: t('chart_income_label'),
            data: allDates.map(d => incMap[d] || 0),
            backgroundColor: 'rgba(25,135,84,0.75)',
            borderColor: 'rgb(25,135,84)',
            borderWidth: 1,
            borderRadius: 5
          },
          {
            label: t('chart_expenses_label'),
            data: allDates.map(d => expMap[d] || 0),
            backgroundColor: 'rgba(220,53,69,0.75)',
            borderColor: 'rgb(220,53,69)',
            borderWidth: 1,
            borderRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${fmtCurrency(ctx.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => '$' + v.toLocaleString('en-US') }
          }
        }
      }
    });
  } catch (err) {
    console.error('Error loading chart:', err);
  }
}
