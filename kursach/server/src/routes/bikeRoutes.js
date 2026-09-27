import { Router } from 'express';
import { body } from 'express-validator';
import { list, getById, create, update, remove } from '../controllers/bikeController.js';
import { validate } from '../middlewares/validate.js';
import { authRequired } from '../middlewares/auth.js';

const router = Router();

const bikeValidators = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be > 0'),
];

router.get('/', list);
router.get('/:id', getById);
router.post('/', authRequired, bikeValidators, validate, create);
router.put('/:id', authRequired, bikeValidators, validate, update);
router.delete('/:id', authRequired, remove);

export default router;