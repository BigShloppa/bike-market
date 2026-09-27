import { Router } from 'express';
import { body } from 'express-validator';
import { listBySeller, upsertReview } from '../controllers/reviewController.js';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/seller/:sellerId', listBySeller);
router.post(
  '/seller/:sellerId',
  authRequired,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5'),
    body('comment').optional({ nullable: true }).isString(),
  ],
  validate,
  upsertReview
);

export default router;