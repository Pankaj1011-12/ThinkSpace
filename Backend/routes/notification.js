import express from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../controller/notification.js';
import userAuthentication from '../middleware/userAuthentication.js';

const notification = express.Router();

notification.get("/", userAuthentication, getNotifications);
notification.get("/unread-count", userAuthentication, getUnreadCount);
notification.patch("/read-all", userAuthentication, markAllAsRead);
notification.patch("/:notificationId/read", userAuthentication, markAsRead);

export default notification;
