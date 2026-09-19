import { Highlight } from '../models/Highlight.js';

// Get highlights for a specific user
export const getUserHighlights = async (req, res) => {
  try {
    const { userId } = req.params;
    const highlights = await Highlight.find({ user: userId }).sort({ createdAt: -1 });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new story highlight
export const createHighlight = async (req, res) => {
  try {
    const { user, title, cover_image, stories } = req.body;
    const newHighlight = await Highlight.create({
      user,
      title,
      cover_image: cover_image || stories?.[0]?.media_url || '',
      stories: stories || [],
    });
    res.status(201).json(newHighlight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a story highlight
export const deleteHighlight = async (req, res) => {
  try {
    const { highlightId } = req.params;
    await Highlight.findByIdAndDelete(highlightId);
    res.json({ message: 'Highlight deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
