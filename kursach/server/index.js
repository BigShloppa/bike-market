import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/ping', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});