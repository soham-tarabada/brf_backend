import express from 'express';
import Event from '../models/Event.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured events (public)
router.get('/featured', async (req, res) => {
  try {
    const events = await Event.find({ featured: true }).sort({ date: -1 }).limit(3);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single event (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create event (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
      // Ensure featuredImages is an array
      const eventData = { ...req.body };
      if (typeof eventData.featuredImages === 'string') {
        eventData.featuredImages = [eventData.featuredImages];
      }
      const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
      // Ensure featuredImages is an array
      const eventData = { ...req.body };
      if (typeof eventData.featuredImages === 'string') {
        eventData.featuredImages = [eventData.featuredImages];
      }
      const event = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;