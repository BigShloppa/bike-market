import { Router } from 'express';
import { body } from 'express-validator';
import {
  myBikes,
  myFavorites,
  addFavorite,
  removeFavorite,
  updateMe,
  getPublicUser,
} from '../controllers/userController.js';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.use(authRequired);

router.get('/me/bikes', myBikes);
router.get('/me/favorites', myFavorites);
router.post('/me/favorites/:bikeId', addFavorite);
router.delete('/me/favorites/:bikeId', removeFavorite);

router.patch(
  '/me',
  [body('name').trim().notEmpty().withMessage('Name required')],
  validate,
  updateMe
);

router.get('/:id/public', getPublicUser);

export default router;