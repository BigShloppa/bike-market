import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { authRequired } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('name').trim().notEmpty().withMessage('Name required'),
    body('phone').optional({ nullable: true, checkFalsy: true }).isString(),
    body('city').optional({ nullable: true, checkFalsy: true }).isString(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  login
);

router.get('/me', authRequired, me);

export default router;