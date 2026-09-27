import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import { authRequired } from '../middlewares/auth.js';

const router = Router();

router.post('/', authRequired, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;