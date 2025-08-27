import express from 'express';
import Member from '../models/Member.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all members (public)
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured members (public)
router.get('/featured', async (req, res) => {
  try {
    const members = await Member.find({ featured: true }).sort({ createdAt: -1 }).limit(4);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single member (public)
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create member (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
      // Ensure profilePictures is an array
      const memberData = { ...req.body };
      if (typeof memberData.profilePictures === 'string') {
        memberData.profilePictures = [memberData.profilePictures];
      }
      const member = new Member(memberData);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update member (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
      // Ensure profilePictures is an array
      const memberData = { ...req.body };
      if (typeof memberData.profilePictures === 'string') {
        memberData.profilePictures = [memberData.profilePictures];
      }
      const member = await Member.findByIdAndUpdate(req.params.id, memberData, { new: true });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete member (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;