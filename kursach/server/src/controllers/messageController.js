import pool from '../config/db.js';
import { emitToUser } from '../services/socketService.js';

export const getConversations = async (req, res, next) => {
  try {
    const me = req.user.id;
    const sql = `
      WITH pairs AS (
        SELECT bike_id,
               CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS peer_id
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
        GROUP BY bike_id, peer_id
      )
      SELECT
        p.bike_id,
        p.peer_id,
        u.name AS peer_name,
        b.title AS bike_title,
        b.image_url AS bike_image,
        (SELECT text FROM messages m
         WHERE m.bike_id = p.bike_id
           AND ((m.sender_id = $1 AND m.receiver_id = p.peer_id)
             OR (m.sender_id = p.peer_id AND m.receiver_id = $1))
         ORDER BY m.created_at DESC LIMIT 1) AS last_text,
        (SELECT created_at FROM messages m
         WHERE m.bike_id = p.bike_id
           AND ((m.sender_id = $1 AND m.receiver_id = p.peer_id)
             OR (m.sender_id = p.peer_id AND m.receiver_id = $1))
         ORDER BY m.created_at DESC LIMIT 1) AS last_at,
        (SELECT COUNT(*)::int FROM messages m
         WHERE m.bike_id = p.bike_id
           AND m.sender_id = p.peer_id AND m.receiver_id = $1
           AND m.read_at IS NULL) AS unread
      FROM pairs p
      JOIN users u ON u.id = p.peer_id
      JOIN bikes b ON b.id = p.bike_id
      ORDER BY last_at DESC
    `;
    const r = await pool.query(sql, [me]);
    res.json({ items: r.rows });
  } catch (e) {
    next(e);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const me = req.user.id;
    const { bikeId, peerId } = req.params;

    const r = await pool.query(
      `SELECT * FROM messages
       WHERE bike_id = $1
         AND ((sender_id = $2 AND receiver_id = $3)
           OR (sender_id = $3 AND receiver_id = $2))
       ORDER BY created_at ASC`,
      [bikeId, me, peerId]
    );

    await pool.query(
      `UPDATE messages SET read_at = NOW()
       WHERE bike_id = $1 AND sender_id = $2 AND receiver_id = $3 AND read_at IS NULL`,
      [bikeId, peerId, me]
    );

    res.json({ items: r.rows });
  } catch (e) {
    next(e);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const me = req.user.id;
    const { bikeId, peerId } = req.params;
    const { text } = req.body;

    if (Number(peerId) === me) {
      return res.status(400).json({ error: 'Нельзя писать самому себе' });
    }

    const bike = await pool.query('SELECT id FROM bikes WHERE id = $1', [bikeId]);
    if (bike.rowCount === 0) return res.status(404).json({ error: 'Bike not found' });

    const r = await pool.query(
      `INSERT INTO messages (bike_id, sender_id, receiver_id, text)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [bikeId, me, peerId, text]
    );

    const message = r.rows[0];
    emitToUser(Number(peerId), 'message:new', message);
    res.status(201).json({ item: message });
  } catch (e) {
    next(e);
  }
};

export const unreadCount = async (req, res, next) => {
  try {
    const r = await pool.query(
      'SELECT COUNT(*)::int AS count FROM messages WHERE receiver_id = $1 AND read_at IS NULL',
      [req.user.id]
    );
    res.json({ count: r.rows[0].count });
  } catch (e) {
    next(e);
  }
};