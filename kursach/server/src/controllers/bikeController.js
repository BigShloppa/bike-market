import pool from '../config/db.js';
import { emitToAll } from '../services/socketService.js';

const SORTABLE = { price: 'price', created_at: 'created_at', title: 'title' };

export const list = async (req, res, next) => {
  try {
    const { search = '', sort = 'created_at', order = 'desc' } = req.query;
    const sortCol = SORTABLE[sort] || 'created_at';
    const sortDir = String(order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const params = [];
    let where = '';
    if (search.trim()) {
      params.push(`%${search.trim()}%`);
      where = 'WHERE b.title ILIKE $1 OR b.brand ILIKE $1 OR b.description ILIKE $1';
    }

    const sql = `
      SELECT b.*, u.name AS seller_name, u.email AS seller_email
      FROM bikes b
      JOIN users u ON u.id = b.user_id
      ${where}
      ORDER BY b.${sortCol} ${sortDir}
    `;

    const result = await pool.query(sql, params);
    res.json({ items: result.rows });
  } catch (e) {
    next(e);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.name AS seller_name, u.email AS seller_email
       FROM bikes b
       JOIN users u ON u.id = b.user_id
       WHERE b.id = $1`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ item: result.rows[0] });
  } catch (e) {
    next(e);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, description, price, brand, condition, image_url, city } = req.body;
    const result = await pool.query(
      `INSERT INTO bikes (user_id, title, description, price, brand, condition, image_url, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, title, description, price, brand, condition, image_url, city || null]
    );
    const bike = result.rows[0];
    emitToAll('bike:new', bike);
    res.status(201).json({ item: bike });
  } catch (e) {
    next(e);
  }
};

export const update = async (req, res, next) => {
  try {
    const bike = await pool.query('SELECT * FROM bikes WHERE id = $1', [req.params.id]);
    if (bike.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    if (bike.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { title, description, price, brand, condition, image_url, city } = req.body;
    const result = await pool.query(
      `UPDATE bikes
       SET title = $1, description = $2, price = $3, brand = $4,
           condition = $5, image_url = $6, city = $7
       WHERE id = $8
       RETURNING *`,
      [title, description, price, brand, condition, image_url, city || null, req.params.id]
    );
    res.json({ item: result.rows[0] });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req, res, next) => {
  try {
    const bike = await pool.query('SELECT * FROM bikes WHERE id = $1', [req.params.id]);
    if (bike.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    if (bike.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await pool.query('DELETE FROM bikes WHERE id = $1', [req.params.id]);
    emitToAll('bike:deleted', { id: Number(req.params.id) });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};