import pool from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/token.js';
import { sendWelcomeEmail } from '../services/mailService.js';

const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  phone: u.phone,
  city: u.city,
  created_at: u.created_at,
});

export const register = async (req, res, next) => {
  try {
    const { email, password, name, phone, city } = req.body;

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: 'Email already taken' });
    }

    const password_hash = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, phone, city)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, phone, city, created_at`,
      [email, password_hash, name, phone || null, city || null]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email });

    sendWelcomeEmail(user).catch(() => {});

    res.status(201).json({ user: publicUser(user), token });

    res.status(201).json({ user: publicUser(user), token });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, email: user.email });
    res.json({ user: publicUser(user), token });
  } catch (e) {
    next(e);
  }
};

export const me = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, city, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (e) {
    next(e);
  }
};