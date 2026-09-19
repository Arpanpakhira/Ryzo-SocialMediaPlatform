import express from 'express';
import {
  getUserHighlights,
  createHighlight,
  deleteHighlight,
} from '../controllers/highlightController.js';

const router = express.Router();

router.get('/:userId', getUserHighlights);
router.post('/', createHighlight);
router.delete('/:highlightId', deleteHighlight);

export default router;
