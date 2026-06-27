const db = require('../models/database');
const cloudinary = require('cloudinary').v2;

async function destroyCloudinaryFile(url) {
  if (!url || !url.includes('cloudinary.com')) return;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
  if (!match) return;
  const publicId = match[1];
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    try { await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }); } catch {}
  }
}

exports.getAll = async (req, res) => {
  try {
    const { search, date_from, date_to, page = 1, limit = 10 } = req.query;
    const cond = [], params = [];
    let pi = 1;

    if (search) {
      cond.push(`(receiver_name ILIKE $${pi} OR receipt_number ILIKE $${pi + 1})`);
      params.push(`%${search}%`, `%${search}%`);
      pi += 2;
    }
    if (date_from) {
      cond.push(`expense_date >= $${pi}`);
      params.push(date_from);
      pi++;
    }
    if (date_to) {
      cond.push(`expense_date <= $${pi}`);
      params.push(date_to);
      pi++;
    }

    const where = cond.length ? 'WHERE ' + cond.join(' AND ') : '';
    const countResult = await db.query(`SELECT COUNT(*) as c FROM expenses ${where}`, params);
    const total = parseInt(countResult.rows[0].c);

    const offset = (Math.max(1, +page) - 1) * +limit;
    const rowsResult = await db.query(
      `SELECT * FROM expenses ${where} ORDER BY expense_date DESC, id DESC LIMIT $${pi} OFFSET $${pi + 1}`,
      [...params, +limit, offset]
    );

    res.json({ data: rowsResult.rows, total, page: +page, limit: +limit });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'السجل غير موجود' });
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { receiver_name, amount, expense_reason, receipt_number, expense_date } = req.body;
    if (!receiver_name?.trim())                    return res.status(400).json({ error: 'اسم المستلم مطلوب' });
    if (!amount || isNaN(amount) || +amount <= 0)  return res.status(400).json({ error: 'المبلغ يجب أن يكون رقماً موجباً' });
    if (!receipt_number?.trim())                   return res.status(400).json({ error: 'رقم الوصل مطلوب' });
    if (!expense_date)                             return res.status(400).json({ error: 'تاريخ العملية مطلوب' });

    const receipt_file = req.file ? req.file.path : '';

    const result = await db.query(
      `INSERT INTO expenses (receiver_name, amount, expense_reason, receipt_number, receipt_file, expense_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [receiver_name.trim(), +amount, expense_reason?.trim() || '', receipt_number.trim(), receipt_file, expense_date]
    );

    res.json({ id: result.rows[0].id, message: 'تم إضافة المصروف بنجاح ✅' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'رقم الوصل موجود مسبقاً، يرجى استخدام رقم مختلف' });
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { receiver_name, amount, expense_reason, receipt_number, expense_date } = req.body;
    const id = req.params.id;

    const existing = (await db.query('SELECT * FROM expenses WHERE id = $1', [id])).rows[0];
    if (!existing) return res.status(404).json({ error: 'السجل غير موجود' });

    if (!receiver_name?.trim())                   return res.status(400).json({ error: 'اسم المستلم مطلوب' });
    if (!amount || isNaN(amount) || +amount <= 0) return res.status(400).json({ error: 'المبلغ يجب أن يكون رقماً موجباً' });
    if (!receipt_number?.trim())                  return res.status(400).json({ error: 'رقم الوصل مطلوب' });
    if (!expense_date)                            return res.status(400).json({ error: 'تاريخ العملية مطلوب' });

    const dup = (await db.query(
      'SELECT id FROM expenses WHERE receipt_number = $1 AND id != $2',
      [receipt_number.trim(), id]
    )).rows[0];
    if (dup) return res.status(400).json({ error: 'رقم الوصل مستخدم بسجل آخر، يرجى اختيار رقم مختلف' });

    let receipt_file = existing.receipt_file;
    if (req.file) {
      await destroyCloudinaryFile(existing.receipt_file);
      receipt_file = req.file.path;
    }

    await db.query(
      `UPDATE expenses SET receiver_name=$1, amount=$2, expense_reason=$3,
       receipt_number=$4, receipt_file=$5, expense_date=$6 WHERE id=$7`,
      [receiver_name.trim(), +amount, expense_reason?.trim() || '',
       receipt_number.trim(), receipt_file, expense_date, id]
    );

    res.json({ message: 'تم تحديث المصروف بنجاح ✅' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'رقم الوصل مستخدم بسجل آخر، يرجى اختيار رقم مختلف' });
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const existing = (await db.query('SELECT * FROM expenses WHERE id = $1', [req.params.id])).rows[0];
    if (!existing) return res.status(404).json({ error: 'السجل غير موجود' });

    await destroyCloudinaryFile(existing.receipt_file);
    await db.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    res.json({ message: 'تم حذف المصروف بنجاح' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
