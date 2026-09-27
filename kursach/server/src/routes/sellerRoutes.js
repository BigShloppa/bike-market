import { Router } from 'express';
import { getSeller } from '../controllers/userController.js';

const router = Router();

router.get('/:id', getSeller);

export default router;