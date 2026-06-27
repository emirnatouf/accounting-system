let currentPage = 1;
const PAGE_SIZE  = 10;
let searchTimer  = null;
let rowsCache    = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fPaymentDate').value = todayStr();
  loadData();
  loadHeaderStats();

  ['searchMain', 'searchSpec', 'dateFrom', 'dateTo'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { currentPage = 1; loadData(); }, 320);
    });
  });
});

async function loadHeaderStats() {
  try {
    const r = await fetch('/api/dashboard/stats');
    const d = await r.json();
    document.getElementById('totalAmount').textContent = fmtCurrency(d.totalIncome);
    document.getElementById('totalCount').textContent  = d.incomeCount;
  } catch {}
}

async function loadData() {
  const params = new URLSearchParams();
  const main = document.getElementById('searchMain').value.trim();
  const spec = document.getElementById('searchSpec').value.trim();
  const from = document.getElementById('dateFrom').value;
  const to   = document.getElementById('dateTo').value;

  if (main) params.set('search', main);
  if (spec) params.set('specialization', spec);
  if (from) params.set('date_from', from);
  if (to)   params.set('date_to', to);
  params.set('page', currentPage);
  params.set('limit', PAGE_SIZE);

  try {
    const r = await fetch('/api/income?' + params);
    const j = await r.json();
    rowsCache = j.data || [];
    renderTable(rowsCache, j.total);
  } catch {
    showToast(t('err_server'), 'error');
  }
}

function renderTable(rows, total) {
  const tbody = document.getElementById('tableBody');
  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state">
      <i class="bi bi-inbox"></i>${t('no_records')}</td></tr>`;
    renderPagination(0);
    return;
  }

  tbody.innerHTML = rows.map((r, i) => `
    <tr>
      <td><span class="badge bg-light text-dark border">${(currentPage-1)*PAGE_SIZE+i+1}</span></td>
      <td><strong class="text-dark">${esc(r.student_name)}</strong></td>
      <td class="d-none d-md-table-cell text-muted">${esc(r.specialization) || '—'}</td>
      <td><span class="badge bg-success-subtle text-success py-1 px-2 fw-semibold" style="font-size:.9rem">
        ${fmtCurrency(r.amount)}</span></td>
      <td class="d-none d-lg-table-cell">${esc(r.payment_reason) || '<span class="text-muted">—</span>'}</td>
      <td><code class="text-dark bg-light px-2 py-1 rounded small">${esc(r.receipt_number)}</code></td>
      <td class="d-none d-md-table-cell text-muted small">${fmtDate(r.payment_date)}</td>
      <td>
        ${r.receipt_file
          ? `<button class="btn btn-sm btn-outline-primary py-0 px-2" onclick="viewFile('${esc(r.receipt_file)}')" title="${t('btn_view')}">
               <i class="bi bi-eye"></i></button>`
          : '<span class="text-muted small">—</span>'}
      </td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-warning" onclick="editRecord(${r.id})" title="${t('btn_edit')}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-outline-danger" onclick="deleteRecord(${r.id})" title="${t('btn_delete')}">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>`).join('');

  renderPagination(total);
}

function renderPagination(total) {
  const pages  = Math.ceil(total / PAGE_SIZE) || 1;
  const infoEl = document.getElementById('paginationInfo');
  const pagEl  = document.getElementById('pagination');
  const start  = total ? (currentPage-1)*PAGE_SIZE+1 : 0;
  const end    = Math.min(currentPage*PAGE_SIZE, total);

  infoEl.textContent = total
    ? t('showing_records', { start, end, total })
    : t('no_records');

  if (pages <= 1) { pagEl.innerHTML = ''; return; }

  let html = '';
  if (currentPage > 1)
    html += `<li class="page-item"><a class="page-link" onclick="goPage(${currentPage-1})">${t('pag_prev')}</a></li>`;
  const lo = Math.max(1, currentPage-2), hi = Math.min(pages, currentPage+2);
  if (lo > 1) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
  for (let p = lo; p <= hi; p++)
    html += `<li class="page-item ${p===currentPage?'active':''}"><a class="page-link" onclick="goPage(${p})">${p}</a></li>`;
  if (hi < pages) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
  if (currentPage < pages)
    html += `<li class="page-item"><a class="page-link" onclick="goPage(${currentPage+1})">${t('pag_next')}</a></li>`;
  pagEl.innerHTML = html;
}

function goPage(p) { currentPage = p; loadData(); }

function openAddModal() {
  document.getElementById('mainForm').reset();
  document.getElementById('recordId').value          = '';
  document.getElementById('fPaymentDate').value      = todayStr();
  document.getElementById('currentFileInfo').innerHTML = '';
  document.getElementById('modalTitle').innerHTML =
    `<i class="bi bi-plus-circle-fill me-1"></i> ${t('modal_add_income')}`;
  new bootstrap.Modal(document.getElementById('mainModal')).show();
}

async function editRecord(id) {
  try {
    const r = await fetch(`/api/income/${id}`);
    if (!r.ok) { showToast(t('err_load'), 'error'); return; }
    const d = await r.json();

    document.getElementById('recordId').value         = id;
    document.getElementById('fStudentName').value     = d.student_name;
    document.getElementById('fSpecialization').value  = d.specialization  || '';
    document.getElementById('fAmount').value          = d.amount;
    document.getElementById('fPaymentReason').value   = d.payment_reason  || '';
    document.getElementById('fReceiptNumber').value   = d.receipt_number;
    document.getElementById('fPaymentDate').value     = d.payment_date;
    document.getElementById('fReceiptFile').value     = '';

    const infoEl = document.getElementById('currentFileInfo');
    if (d.receipt_file) {
      const isUrl = d.receipt_file.startsWith('http');
      const ext   = d.receipt_file.split('.').pop().toLowerCase().split('?')[0];
      const icon  = ext === 'pdf' ? 'bi-file-earmark-pdf-fill text-danger' : 'bi-image-fill text-primary';
      const label = isUrl ? t('file_cloud') : esc(d.receipt_file);
      infoEl.innerHTML = `
        <div class="d-flex align-items-center gap-2 mt-2 p-2 bg-light rounded border">
          <i class="bi ${icon} fs-5 flex-shrink-0"></i>
          <span class="small text-dark flex-grow-1 text-truncate">
            ${t('file_current')} <strong>${label}</strong>
          </span>
          <button type="button" class="btn btn-sm btn-outline-primary flex-shrink-0 py-0 px-2"
                  onclick="viewFile('${esc(d.receipt_file)}')">
            <i class="bi bi-eye me-1"></i>${t('btn_view')}
          </button>
        </div>
        <div class="small text-muted mt-1">
          <i class="bi bi-info-circle me-1"></i>${t('file_replace_hint')}
        </div>`;
    } else {
      infoEl.innerHTML = '';
    }

    document.getElementById('modalTitle').innerHTML =
      `<i class="bi bi-pencil-fill me-1"></i> ${t('modal_edit_income')}`;
    new bootstrap.Modal(document.getElementById('mainModal')).show();
  } catch {
    showToast(t('err_server'), 'error');
  }
}

async function saveRecord() {
  const id     = document.getElementById('recordId').value;
  const name   = document.getElementById('fStudentName').value.trim();
  const amount = document.getElementById('fAmount').value;
  const rcpt   = document.getElementById('fReceiptNumber').value.trim();
  const date   = document.getElementById('fPaymentDate').value;

  if (!name)                { showToast(t('err_student_name'), 'error'); return; }
  if (!amount || +amount<=0){ showToast(t('err_amount'),       'error'); return; }
  if (!rcpt)                { showToast(t('err_receipt_num'),  'error'); return; }
  if (!date)                { showToast(t('err_date'),         'error'); return; }

  const fd = new FormData();
  fd.append('student_name',   name);
  fd.append('specialization', document.getElementById('fSpecialization').value.trim());
  fd.append('amount',         amount);
  fd.append('payment_reason', document.getElementById('fPaymentReason').value.trim());
  fd.append('receipt_number', rcpt);
  fd.append('payment_date',   date);
  const file = document.getElementById('fReceiptFile').files[0];
  if (file) fd.append('receipt_file', file);

  const saveBtn   = document.getElementById('saveBtnModal');
  const origLabel = saveBtn.innerHTML;
  saveBtn.disabled  = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> ${t('saving')}`;

  try {
    const res  = await fetch(id ? `/api/income/${id}` : '/api/income', {
      method: id ? 'PUT' : 'POST',
      body: fd
    });
    const data = await res.json();

    if (!res.ok) { showToast(data.error, 'error'); return; }

    bootstrap.Modal.getInstance(document.getElementById('mainModal')).hide();
    showToast(id ? t('msg_edit_income') : t('msg_add_income'), 'success');
    if (!id) currentPage = 1;
    loadData();
    loadHeaderStats();
  } catch {
    showToast(t('err_server'), 'error');
  } finally {
    saveBtn.disabled  = false;
    saveBtn.innerHTML = origLabel;
  }
}

async function deleteRecord(id) {
  const record  = rowsCache.find(r => r.id === id);
  const name    = record ? esc(record.student_name)   : `#${id}`;
  const receipt = record ? esc(record.receipt_number) : '';
  const dir     = document.documentElement.dir || 'rtl';
  const align   = dir === 'rtl' ? 'text-end' : 'text-start';

  const result = await Swal.fire({
    title: t('confirm_delete_title'),
    html: `
      <div dir="${dir}" class="${align}">
        <p class="text-muted mb-3">${t('confirm_delete_subtitle')}</p>
        <div class="border rounded-3 p-3 bg-light ${align} mb-3">
          <div class="mb-1">
            <i class="bi bi-person-fill text-secondary me-1"></i>
            <strong>${name}</strong>
          </div>
          ${receipt ? `<div class="text-muted small mt-1">
            <i class="bi bi-receipt me-1"></i>${t('confirm_receipt_label')}
            <code class="text-dark">${receipt}</code>
          </div>` : ''}
        </div>
        <p class="text-danger mb-0 small">
          <i class="bi bi-exclamation-triangle-fill me-1"></i>${t('confirm_delete_warning')}
        </p>
      </div>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor:  '#6c757d',
    confirmButtonText:  `<i class="bi bi-trash3 me-1"></i> ${t('confirm_delete_btn')}`,
    cancelButtonText:   `<i class="bi bi-x-circle me-1"></i> ${t('btn_cancel')}`,
    reverseButtons:     true,
    focusCancel:        true,
    showLoaderOnConfirm: true,
    allowOutsideClick:  () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        const res  = await fetch(`/api/income/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) { Swal.showValidationMessage(`<i class="bi bi-x-circle me-1"></i>${data.error}`); return false; }
        return data;
      } catch {
        Swal.showValidationMessage(`<i class="bi bi-x-circle me-1"></i>${t('err_server')}`);
        return false;
      }
    }
  });

  if (result.isConfirmed && result.value) {
    showToast(t('msg_delete_income'), 'success');
    if (rowsCache.length === 1 && currentPage > 1) currentPage--;
    loadData();
    loadHeaderStats();
  }
}

function viewFile(fileOrUrl) {
  const url  = (fileOrUrl.startsWith('http://') || fileOrUrl.startsWith('https://'))
    ? fileOrUrl : `/uploads/${fileOrUrl}`;
  const ext  = url.split('.').pop().toLowerCase().split('?')[0];
  const cont = document.getElementById('viewerContent');
  cont.innerHTML = ext === 'pdf'
    ? `<iframe src="${url}" width="100%" height="620px" style="border:none;border-radius:8px"></iframe>`
    : `<img src="${url}" class="img-fluid rounded shadow" alt="${t('col_file')}" style="max-height:620px">`;
  new bootstrap.Modal(document.getElementById('viewerModal')).show();
}

function clearFilters() {
  ['searchMain', 'searchSpec', 'dateFrom', 'dateTo'].forEach(id => {
    document.getElementById(id).value = '';
  });
  currentPage = 1;
  loadData();
}

function todayStr() { return new Date().toISOString().split('T')[0]; }
