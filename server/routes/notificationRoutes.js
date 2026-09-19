import express from 'express';
import {
  getUserNotifications,
  markAllAsRead,
  markSingleAsRead,
  createNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', getUserNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:notificationId/read', markSingleAsRead);
router.post('/', createNotification);

export default router;
