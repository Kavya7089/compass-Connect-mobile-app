const express = require('express');
const Notification = require('../models/Notification.js');
const { authMiddleware } = require('../middleware/auth.js');

const router = express.Router();

// Get user notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .populate('eventId', 'title eventDate')
      .sort({ createdAt: -1 });

    res.json({ data: notifications, error: null });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Get unread notifications count
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userId,
      read: false,
    });

    res.json({ data: { unreadCount: count }, error: null });
  } catch (error) {
    console.error('Error fetching notification count:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ data: null, error: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({ data: notification, error: null });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Mark all as read
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });

    res.json({ data: { message: 'All notifications marked as read' }, error: null });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Create notice/announcement (teachers/admins)
router.post('/notifications/announce', authMiddleware, async (req, res) => {
  try {
    const { title, message, type = 'notice' } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        data: null,
        error: 'Please provide title and message',
      });
    }

    // Create notifications for all users
    // In production, you might want to broadcast this differently
    const notification = new Notification({
      userId: req.userId, // For now, creator gets it
      type,
      title,
      message,
      priority: 'high',
    });

    await notification.save();

    res.status(201).json({ data: notification, error: null });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({ data: { message: 'Notification deleted' }, error: null });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

module.exports = router;
