const express = require('express');
const Event = require('../models/Event.js');
const Notification = require('../models/Notification.js');
const { authMiddleware } = require('../middleware/auth.js');

const router = express.Router();

// Get all events (students view)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name role')
      .populate('registeredStudents', 'name email')
      .sort({ eventDate: 1 });

    const registeredEventIds = events
      .filter((event) => event.registeredStudents.some((s) => s._id.toString() === req.userId))
      .map((e) => e._id);

    res.json({
      data: events.map((event) => ({
        ...event.toObject(),
        isRegistered: registeredEventIds.includes(event._id),
      })),
      error: null,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Get single event
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name role email')
      .populate('registeredStudents', 'name email department');

    if (!event) {
      return res.status(404).json({ data: null, error: 'Event not found' });
    }

    res.json({ data: event, error: null });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Create event (teachers/admins only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, eventDate, location, capacity, thumbnail } = req.body;

    if (!title || !description || !eventDate || !location) {
      return res.status(400).json({
        data: null,
        error: 'Please provide all required fields',
      });
    }

    const event = new Event({
      title,
      description,
      eventDate: new Date(eventDate),
      location,
      capacity: capacity || 100,
      thumbnail,
      createdBy: req.userId,
    });

    await event.save();

    // Create notification for all students
    const notificationTitle = `📢 New Event: ${title}`;
    const notificationMessage = `A new event "${title}" has been scheduled for ${new Date(
      eventDate
    ).toLocaleDateString()}`;

    // Here you'd create notifications for all users
    // For now, we'll just save the event

    console.log('Event created successfully:', event._id);
    res.status(201).json({ data: event, error: null });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Register for event (students)
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ data: null, error: 'Event not found' });
    }

    // Check if already registered
    if (event.registeredStudents.includes(req.userId)) {
      return res.status(400).json({
        data: null,
        error: 'Already registered for this event',
      });
    }

    // Check capacity
    if (event.registeredStudents.length >= event.capacity) {
      return res.status(400).json({
        data: null,
        error: 'Event is at full capacity',
      });
    }

    event.registeredStudents.push(req.userId);
    await event.save();

    // Create registration notification
    const notification = new Notification({
      userId: req.userId,
      type: 'event_alert',
      title: `✅ Registered for ${event.title}`,
      message: `You have successfully registered for the event on ${new Date(
        event.eventDate
      ).toLocaleDateString()}`,
      eventId: event._id,
      priority: 'high',
    });

    await notification.save();

    res.json({ data: event, error: null });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Unregister from event
router.post('/:id/unregister', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ data: null, error: 'Event not found' });
    }

    const index = event.registeredStudents.indexOf(req.userId);
    if (index > -1) {
      event.registeredStudents.splice(index, 1);
      await event.save();
    }

    res.json({ data: event, error: null });
  } catch (error) {
    console.error('Error unregistering from event:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Update event (teachers/admins only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ data: null, error: 'Event not found' });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        data: null,
        error: 'Only the event creator can update it',
      });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({ data: event, error: null });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

// Delete event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ data: null, error: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        data: null,
        error: 'Only the event creator can delete it',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ data: { message: 'Event deleted' }, error: null });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ data: null, error: error.message });
  }
});

module.exports = router;
