import express from 'express';
import {
  getUserProfile,
  updateProfile,
  toggleFollow,
  getUserCollections,
  createCollection,
  addPostToCollection,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/collections/:userId', getUserCollections);
router.post('/collections', createCollection);
router.post('/collections/:collectionId/add', addPostToCollection);

router.get('/:id', getUserProfile);
router.put('/:id', updateProfile);
router.post('/:id/follow', toggleFollow);

export default router;
