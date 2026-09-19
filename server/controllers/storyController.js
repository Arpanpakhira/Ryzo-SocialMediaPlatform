import { Story } from '../models/Story.js';

export const getActiveStories = async (req, res) => {
  try {
    const activeStories = await Story.find({
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: { $exists: false } },
      ],
    }).sort({ createdAt: -1 });
    res.json(activeStories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStory = async (req, res) => {
  try {
    const storyData = { ...req.body };
    if (!storyData._id) {
      storyData._id = 'story_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    }
    // If story already exists, update it, otherwise create new
    const saved = await Story.findByIdAndUpdate(storyData._id, storyData, {
      upsert: true,
      new: true,
    });
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    await Story.findByIdAndDelete(id);
    res.json({ message: 'Story deleted successfully', storyId: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
