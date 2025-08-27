import express from 'express';
import Service from '../models/Services.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ date: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    const services = await Service.findById(req.params.id);
    if (!services) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create service (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
      const serviceData = { ...req.body };
      console.log(req.body)
      if (typeof serviceData.featuredImages === 'string') {
        serviceData.featuredImages = [serviceData.featuredImages];
      }
      const service = new Service(serviceData);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
      // Ensure featuredImages is an array
      const serviceData = { ...req.body };
      if (typeof serviceData.featuredImages === 'string') {
        serviceData.featuredImages = [serviceData.featuredImages];
      }
      const services = await Service.findByIdAndUpdate(req.params.id, serviceData, { new: true });
    if (!services) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const services = await Service.findByIdAndDelete(req.params.id);
    if (!services) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;