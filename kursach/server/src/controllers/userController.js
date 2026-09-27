import pool from '../config/db.js';

export const myBikes = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bikes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ items: result.rows });
  } catch (e) {
    next(e);
  }
};

export const myFavorites = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT b.* FROM bikes b
       JOIN favorites f ON f.bike_id = b.id
       WHERE f.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ items: result.rows });
  } catch (e) {
    next(e);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    await pool.query(
      'INSERT INTO favorites (user_id, bike_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.bikeId]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND bike_id = $2',
      [req.user.id, req.params.bikeId]
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};

export const getSeller = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );
    if (user.rowCount === 0) return res.status(404).json({ error: 'Not found' });

    const bikes = await pool.query(
      'SELECT * FROM bikes WHERE user_id = $1 ORDER BY created_at DESC',
      [id]
    );

    const stats = await pool.query(
      `SELECT COALESCE(AVG(rating), 0)::numeric(3,2) AS avg, COUNT(*)::int AS count
       FROM reviews WHERE seller_id = $1`,
      [id]
    );

    res.json({
      user: user.rows[0],
      bikes: bikes.rows,
      rating: stats.rows[0],
    });
  } catch (e) {
    next(e);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone, city } = req.body;
    const r = await pool.query(
      `UPDATE users SET name = $1, phone = $2, city = $3
       WHERE id = $4
       RETURNING id, email, name, phone, city, created_at`,
      [name, phone || null, city || null, req.user.id]
    );
    res.json({ user: r.rows[0] });
  } catch (e) {
    next(e);
  }
};

export const getPublicUser = async (req, res, next) => {
  try {
    const r = await pool.query(
      'SELECT id, name, phone, city FROM users WHERE id = $1',
      [req.params.id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ user: r.rows[0] });
  } catch (e) {
    next(e);
  }
};
