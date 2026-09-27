import pool from './src/config/db.js';

const res = await pool.query('SELECT NOW() AS now');
console.log('DB connected:', res.rows[0].now);
await pool.end();