import { Router } from 'express';
import { body } from 'express-validator';
import {
  getConversations,
  getMessages,
  sendMessage,
  unreadCount,
} from '../controllers/messageController.js';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.use(authRequired);

router.get('/', getConversations);
router.get('/unread', unreadCount);
router.get('/:bikeId/:peerId', getMessages);
router.post(
  '/:bikeId/:peerId',
  [body('text').trim().notEmpty().withMessage('Text required')],
  validate,
  sendMessage
);

export default router;