import express from 'express';
import { getActiveStories, createStory, deleteStory } from '../controllers/storyController.js';

const router = express.Router();

router.get('/', getActiveStories);
router.post('/', createStory);
router.delete('/:id', deleteStory);

export default router;
