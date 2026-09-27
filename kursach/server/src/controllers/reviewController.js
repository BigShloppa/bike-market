import pool from '../config/db.js';

export const listBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const items = await pool.query(
      `SELECT r.*, u.name AS author_name
       FROM reviews r
       JOIN users u ON u.id = r.author_id
       WHERE r.seller_id = $1
       ORDER BY r.created_at DESC`,
      [sellerId]
    );

    const stats = await pool.query(
      `SELECT COALESCE(AVG(rating), 0)::numeric(3,2) AS avg, COUNT(*)::int AS count
       FROM reviews WHERE seller_id = $1`,
      [sellerId]
    );

    res.json({ items: items.rows, stats: stats.rows[0] });
  } catch (e) {
    next(e);
  }
};

export const upsertReview = async (req, res, next) => {
  try {
    const sellerId = Number(req.params.sellerId);
    const authorId = req.user.id;

    if (sellerId === authorId) {
      return res.status(400).json({ error: 'Нельзя оценивать самого себя' });
    }

    const seller = await pool.query('SELECT id FROM users WHERE id = $1', [sellerId]);
    if (seller.rowCount === 0) return res.status(404).json({ error: 'Seller not found' });

    const { rating, comment } = req.body;

    const r = await pool.query(
      `INSERT INTO reviews (seller_id, author_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (seller_id, author_id)
       DO UPDATE SET rating = EXCLUDED.rating,
                     comment = EXCLUDED.comment,
                     created_at = NOW()
       RETURNING *`,
      [sellerId, authorId, rating, comment || null]
    );

    res.status(201).json({ item: r.rows[0] });
  } catch (e) {
    next(e);
  }
};